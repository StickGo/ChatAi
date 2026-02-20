import { generateImage } from '@/lib/image-generator'
import { GoogleGenAI, Type } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

// Inisialisasi Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// System prompt
const SYSTEM_PROMPT = `You are a helpful AI assistant.
- Provide clear, concise, and accurate answers
- Be friendly and professional
- Answer in the language the user uses
- If you don't know something, say so honestly
- Keep responses brief and to the point`

// Definisi Tool untuk generate gambar
const imageGenerationTool = {
  functionDeclarations: [
    {
      name: 'generate_image',
      description: 'Generate gambar berdasarkan deskripsi dari user. Gunakan tool ini ketika user meminta untuk membuat, generate, atau menggambar sesuatu.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          prompt: {
            type: Type.STRING,
            description: 'Deskripsi detail gambar yang ingin dibuat dalam bahasa Inggris. Contoh: "a cute orange cat wearing a small blue hat, digital art style"',
          },
        },
        required: ['prompt'],
      },
    },
  ],
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  console.log('Incoming request to /api/chat');
  
  // Set headers for CORS on every response
  const responseHeaders = new Headers(CORS_HEADERS);
  
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return NextResponse.json(
            { error: 'API Key belum di-setting. Cek file .env.local kamu!' },
            { status: 500, headers: responseHeaders }
        )
    }

    // Ambil message dari request body
    const { message, history, image, mimeType, category, customPrompt } = await request.json()

    // Validasi input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400, headers: responseHeaders }
      )
    }

    // Use Faqih Bot persona for all categories
    const effectiveSystemPrompt = customPrompt || SYSTEM_PROMPT;

    // Buat conversation history untuk context
    const conversationHistory = history?.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })) || []

    // Tambahkan pesan user terbaru dengan opsional gambar
    const userParts: any[] = [{ text: message }];
    if (image && mimeType) {
      userParts.push({
        inline_data: {
          mime_type: mimeType,
          data: image
        }
      });
    }

    // --- LAYER 1: Manual Intent Detection (Fallback for Quota Cases) ---
    const isImageRequest = /buatkan|gambar|generate|lukis|image|drawing|foto|photo/i.test(message) && !image; // Only if NOT already uploading
    if (isImageRequest && (message.length < 300)) {
      const imagePrompt = message.replace(/buatkan|gambar|generate|lukis|image|photo|foto|ai|tolong/gi, '').trim() || message
      try {
        const imageData = await generateImage(imagePrompt)
        if (imageData) {
          return NextResponse.json({
            success: true,
            message: `Tentu! Ini hasil generate gambar untuk **${imagePrompt}**. (Deteksi otomatis) 🎨`,
            image: imageData,
            imagePrompt: imagePrompt
          }, { headers: responseHeaders })
        }
      } catch (e) { console.error('Manual Image Detection Fail:', e) }
    }

    try {
      // --- LAYER 2: Primary Gemini AI with Streaming ---
      const result = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: effectiveSystemPrompt }] },
          { role: 'model', parts: [{ text: 'Baik, saya paham instruksi Anda.' }] },
          ...conversationHistory,
          { role: 'user', parts: userParts },
        ],
        config: {
          tools: [imageGenerationTool]
        }
      })

      const encoder = new TextEncoder();
      const customStream = new ReadableStream({
        async start(controller) {
          try {
            let fullText = "";
            let functionCallDetected = false;

            for await (const chunk of result) {
              const text = chunk.text;
              const calls = chunk.functionCalls;

              if (calls && calls.length > 0) {
                functionCallDetected = true;
                const call = calls[0];
                if (call.name === 'generate_image') {
                  const imagePrompt = (call.args as { prompt: string }).prompt;
                  const imageData = await generateImage(imagePrompt);
                  if (imageData) {
                    const toolResponse = JSON.stringify({
                      success: true,
                      message: `Ini dia gambar **${imagePrompt}** yang kamu minta! 🎨`,
                      image: imageData,
                      imagePrompt: imagePrompt
                    });
                    controller.enqueue(encoder.encode(`__JSON__${toolResponse}`));
                  }
                }
                break; 
              }

              if (text) {
                fullText += text;
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (e) {
            console.error("Stream error:", e);
            controller.error(e);
          }
        },
      });

      return new Response(customStream, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });

    } catch (geminiError: any) {
      const errorMsg = geminiError?.message || String(geminiError);
      console.error('Gemini Failure details:', errorMsg);
      
      // Check for quota limit explicitly
      if (errorMsg.includes('429') || errorMsg.includes('quota')) {
         return NextResponse.json({
          success: true,
          message: "⚠️ **Quota Terlampaui**: Gemini AI gratisan Faqih lagi limit nih (15 pesan per menit). Tunggu bentar yak, atau cek API Key kamu! 😅"
        }, { headers: responseHeaders })
      }
      
      // --- LAYER 3: Pollinations Text Fallback ---
      try {
        const fallbackResponse = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: "You are Faqih Bot. Answer briefly in Indonesian." },
              { role: 'user', content: message }
            ],
            model: 'openai'
          })
        })
        
        let fallbackText = await fallbackResponse.text()
        
        if (fallbackText.includes("502 Bad Gateway") || fallbackText.length < 5) {
          return NextResponse.json({
            success: true,
            message: "Duh, Gemini & Pollinations lagi down berjamaah! 😅 Coba lagi sebentar lagi ya."
          }, { headers: responseHeaders });
        }

        return NextResponse.json({
          success: true,
          message: fallbackText + "\n\n*(Mode: Backup)*"
        }, { headers: responseHeaders })
      } catch (fallbackError) {
        console.error('Fallback Failure:', fallbackError)
        return NextResponse.json(
          { error: 'Maaf, semua sistem AI sedang sibuk. Coba lagi nanti ya! 🙏' },
          { status: 500, headers: responseHeaders }
        )
      }
    }
  } catch (err) {
    const responseHeaders = new Headers(CORS_HEADERS);
    return NextResponse.json({ error: 'System Error' }, { status: 500, headers: responseHeaders })
  }
}
