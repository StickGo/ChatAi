'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Send,
  Paperclip,
  Sparkles,
  User,
  Wrench,
  X
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  functionCall?: { name: string; args: any }
}

interface Props {
  documentContent: string
  onDocumentUpdate: (newContent: string) => void
}

export default function AIChat({ documentContent, onDocumentUpdate }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ data: string; type: string; name: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('File must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedFile({
        data: reader.result as string,
        type: file.type,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function sendMessage() {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/ai-editor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          documentContent,
          file: selectedFile ? { data: selectedFile.data, type: selectedFile.type } : null
        })
      })

      if (!response.ok) throw new Error('Chat API failed')

      const data = await response.json()

      if (data.newDocumentContent !== undefined) {
        onDocumentUpdate(data.newDocumentContent)
      }

      setMessages(prev => [...prev, data.message])
      setSelectedFile(null)
    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error processing request. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-icon">
          <Sparkles size={16} strokeWidth={1.5} />
        </div>
        <div>
          <div className="chat-header-title">AI Assistant</div>
          <div className="chat-header-subtitle">Gemini 2.5 Flash</div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <Sparkles size={22} strokeWidth={1} />
            </div>
            <div className="chat-empty-title">AI Assistant</div>
            <div className="chat-empty-desc">
              Ask me to edit, analyze, or transform your document. I can also process uploaded files.
            </div>
            <div className="chat-suggestions">
              <button onClick={() => setInput('Buatkan outline untuk essay tentang teknologi')}>
                Create an outline
              </button>
              <button onClick={() => setInput('Fix grammar dan format dokumen ini')}>
                Fix grammar
              </button>
              <button onClick={() => setInput('Tambahkan kesimpulan di akhir dokumen')}>
                Add conclusion
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="chat-message-avatar">
                {msg.role === 'user'
                  ? <User size={14} strokeWidth={1.5} />
                  : <Sparkles size={14} strokeWidth={1.5} />
                }
              </div>
              <div className="chat-message-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
                {msg.functionCall && (
                  <div className="chat-function-badge">
                    <Wrench size={10} strokeWidth={1.5} />
                    <code>{msg.functionCall.name}</code>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="chat-message assistant">
            <div className="chat-message-avatar">
              <Sparkles size={14} strokeWidth={1.5} />
            </div>
            <div className="chat-message-content">
              <div className="chat-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="chat-file-preview">
          <span>Attached: {selectedFile.name}</span>
          <button onClick={() => setSelectedFile(null)}>
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-row">
          <label className="chat-attach-btn" title="Attach File">
            <Paperclip size={15} strokeWidth={1.5} />
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt,.md,.doc,.docx"
            />
          </label>

          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask AI to edit the document..."
            rows={1}
          />

          <button
            className="chat-send-btn"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            title="Send"
          >
            <Send size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
