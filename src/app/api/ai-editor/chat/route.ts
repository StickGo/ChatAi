import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { functionTools } from '@/lib/function-tools'
import { executeFunctionCall } from '@/lib/execute-function'

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// Helper: Format document with line numbers for AI
function formatDocumentForAI(content: string): string {
  if (!content) return '(empty document)'
  const lines = content.split('\n')
  return lines.map((line, i) => `${i + 1}. ${line}`).join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const { messages, documentContent, file } = await request.json()

    // CRITICAL: Always give AI the current document state with line numbers
    const documentWithLines = formatDocumentForAI(documentContent)
    const lineCount = documentContent ? documentContent.split('\n').length : 0

    const systemInstruction = `You are a helpful AI assistant for a document editor, similar to Cursor IDE.

**CURRENT DOCUMENT (${lineCount} lines):**
\`\`\`
${documentWithLines}
\`\`\`

You have tools to manipulate the document. When the user asks you to edit:
1. Look at the line numbers above
2. Use the appropriate tool
3. Be precise with line numbers

Tool selection guide:
- To change specific lines → update_doc_by_line
- To find/replace text → update_doc_by_replace
- To insert new content → insert_at_line
- To remove lines → delete_lines
- To add to end → append_to_document

Always respond in the same language the user uses. If they speak Indonesian, respond in Indonesian.`

    // Prepare content parts for Gemini
    const userMessage = messages[messages.length - 1]
    const contentParts: any[] = []

    // Add file if present (multimodal support)
    if (file) {
      const base64Data = file.data.split(',')[1]
      const mimeType = file.type

      contentParts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      })
    }

    // Add text message
    contentParts.push({ text: userMessage.content })

    // Build conversation history
    const conversationHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }))

    // First call with function tools
    let response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...conversationHistory,
        {
          role: 'user' as const,
          parts: contentParts
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: functionTools,
      }
    })

    // Check if AI wants to call a function
    const candidate = response.candidates?.[0]
    const parts = candidate?.content?.parts || []
    const functionCallPart = parts.find((p: any) => p.functionCall)

    if (functionCallPart?.functionCall) {
      const fc = functionCallPart.functionCall
      console.log('Function call:', fc.name, fc.args)

      // Execute the function
      const executionResult = executeFunctionCall(
        fc.name!,
        fc.args,
        documentContent
      )

      if (!executionResult.success) {
        return NextResponse.json({
          message: {
            role: 'assistant',
            content: `❌ Error: ${executionResult.error}`,
            functionCall: {
              name: fc.name,
              args: fc.args,
              result: executionResult
            }
          }
        })
      }

      // CRITICAL: Format the NEW document state for AI
      const newDocumentWithLines = formatDocumentForAI(executionResult.newContent!)
      const newLineCount = executionResult.newContent!.split('\n').length

      // Send result back to AI with UPDATED document state
      const followUpInstruction = `You are a helpful AI assistant for a document editor.

**UPDATED DOCUMENT (${newLineCount} lines):**
\`\`\`
${newDocumentWithLines}
\`\`\`

The function ${fc.name} was executed successfully. Confirm the change to the user concisely. Always respond in the same language the user uses.`

      response = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...conversationHistory,
          {
            role: 'user' as const,
            parts: contentParts
          },
          {
            role: 'model' as const,
            parts: [{ functionCall: { name: fc.name!, args: fc.args } }]
          },
          {
            role: 'user' as const,
            parts: [{
              functionResponse: {
                name: fc.name!,
                response: executionResult
              }
            }]
          }
        ],
        config: {
          systemInstruction: followUpInstruction,
        }
      })

      return NextResponse.json({
        message: {
          role: 'assistant',
          content: response.text || '✅ Document updated!',
          functionCall: {
            name: fc.name,
            args: fc.args,
          }
        },
        newDocumentContent: executionResult.newContent
      })
    }

    // No function call, just normal chat response
    return NextResponse.json({
      message: {
        role: 'assistant',
        content: response.text || 'No response'
      }
    })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    )
  }
}
