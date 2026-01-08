'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  X, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Download, 
  Check,
  Bot,
  User
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  feedback?: 'like' | 'unlike'
  image?: string
  imagePrompt?: string
}

const CHAT_STARTERS = [
  { label: 'Generate Gambar 🎨', text: 'Buatkan gambar kucing astronot bergaya digital art' },
  { label: 'Band Favorit 🎸', text: 'Apa saja top 3 band favoritnya Agil? Ceritakan dong!' },
  { label: 'Lihat Proyek 🎨', text: 'Ceritakan tentang proyek-proyek seru yang pernah Agil kerjakan!' },
  { label: 'Skill Agil 💻', text: 'Apa saja teknologi dan bahasa pemrograman yang dikuasai Agil?' }
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } catch (e) {
        console.error('Failed to parse saved messages', e)
      }
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, isOpen, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [inputValue])

  // Simulated Streaming Effect
  const simulateStreaming = async (text: string, messageId: string) => {
    let currentText = ''
    const words = text.split(' ')
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i]
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, text: currentText } : msg
      ))
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40))
    }
  }

  const sendMessageToAI = async (userMessage: string) => {
    try {
      const history = messages.slice(-10).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Gagal tersambung ke AI')
      return {
        message: data.message,
        image: data.image || null,
        imagePrompt: data.imagePrompt || null
      }
    } catch (error) {
      console.error('AI Error:', error)
      throw error
    }
  }

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue.trim()
    if (!textToSend || isTyping) return

    if (!textOverride) setInputValue('')

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])

    const isImgReq = /buatkan|gambar|generate|lukis|image/i.test(textToSend)
    setIsGeneratingImage(isImgReq)
    setIsTyping(true)

    try {
      const aiData = await sendMessageToAI(textToSend)
      setIsGeneratingImage(false)
      
      const botMsgId = `bot-${Date.now()}`
      const botMsg: Message = {
        id: botMsgId,
        text: '', // Start empty for streaming
        sender: 'bot',
        timestamp: new Date(),
        image: aiData.image || undefined,
        imagePrompt: aiData.imagePrompt || undefined
      }
      setMessages(prev => [...prev, botMsg])
      
      setIsTyping(false)
      await simulateStreaming(aiData.message, botMsgId)
    } catch (error: any) {
      console.error('Chat Error:', error)
      const isQuotaError = error.message?.includes('429') || error.message?.toLowerCase().includes('kuota')
      
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        text: isQuotaError 
          ? '⚠️ Kuota chat AI hari ini sudah terpakai semua (Limit 20 request/hari). Faqih AI perlu istirahat sebentar, silakan coba lagi nanti atau besok ya! 🙏'
          : '⚠️ Maaf, sensor AI kami sedang mengalami kendala teknis. Bisa coba tanya lagi nanti?',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
      setIsTyping(false)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFeedback = (id: string, type: 'like' | 'unlike') => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, feedback: msg.feedback === type ? undefined : type } : msg
    ))
  }

  const handleDownload = () => {
    const chatText = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.sender.toUpperCase()}: ${m.text}`
    ).join('\n\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `faqih-bot-chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearHistory = () => {
    if (confirm('Hapus semua riwayat chat?')) {
      setMessages([])
      localStorage.removeItem('chatMessages')
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10 z-[100] transition-all duration-300
              ${isFullscreen 
                ? 'top-4 left-4 right-4 bottom-4 w-auto h-auto rounded-3xl' 
                : 'bottom-24 left-4 right-4 sm:left-auto sm:right-6 w-auto sm:w-[380px] h-[600px] max-h-[80vh] rounded-2xl'
              }`}
          >
            {/* Header */}
            <div className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">Faqih AI</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleDownload} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors" title="Download Chat">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={handleClearHistory} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-red-400 transition-colors" title="Clear Chat">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/10 rounded-full text-white/40 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-[#0a0a0a] scrollbar-thin scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 px-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-light">Belum ada percakapan. Mulai tanya Faqih sesuatu!</p>
                  <div className="grid grid-cols-1 gap-2 w-full mt-4">
                    {CHAT_STARTERS.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSend(s.text)}
                        className="text-xs p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-lg border border-white/10
                    ${msg.sender === 'user' ? 'bg-[#333333] text-white' : 'bg-[#1a1a1a] text-white'}`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`relative px-4 py-3 rounded-2xl text-sm shadow-md
                      ${msg.sender === 'user' 
                        ? 'bg-[#333333] text-white rounded-tr-none' 
                        : 'bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-tl-none'}`}
                    >
                      <div className="markdown-chat">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {/* Generated Image */}
                      {msg.image && (
                        <div className="mt-3 space-y-2">
                          <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/20 aspect-square flex items-center justify-center">
                            <img 
                              src={msg.image} 
                              alt={msg.imagePrompt || "Generated result"} 
                              className="w-full h-full object-cover cursor-zoom-in hover:scale-[1.02] transition-transform duration-500"
                              referrerPolicy="no-referrer"
                              // Removed crossOrigin to avoid strict CORS checks on public images
                              onError={(e) => {
                                console.error('Image Load Error:', msg.image);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const errorText = document.createElement('div');
                                  errorText.className = 'text-[10px] text-white/40 p-4 text-center';
                                  errorText.innerText = 'Gagal memuat gambar. Klik ikon zoom untuk mencoba buka manual.';
                                  parent.appendChild(errorText);
                                }
                              }}
                              onClick={() => window.open(msg.image, '_blank')}
                            />
                            <div className="absolute inset-4 top-auto flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    const response = await fetch(msg.image!);
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `faqih-ai-${Date.now()}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  } catch (error) {
                                    window.open(msg.image, '_blank');
                                  }
                                }}
                                className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-colors shadow-xl"
                                title="Download Image"
                              >
                                <Download className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[9px] text-white/40 italic px-1">
                            Klik gambar untuk melihat ukuran penuh
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Bot Actions & Time Row - TIDY & PERSISTENT */}
                    <div className={`flex items-center gap-3 mt-1.5 px-1 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[10px] opacity-30 font-mono tracking-wider text-white">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      {msg.sender === 'bot' && msg.text && (
                        <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                          <button 
                            onClick={() => handleCopy(msg.text, msg.id)} 
                            className="p-1 hover:bg-white/10 rounded-md transition-all group"
                            title="Salin"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white/20 group-hover:text-white" />}
                          </button>
                          <button 
                            onClick={() => handleFeedback(msg.id, 'like')} 
                            className={`p-1 hover:bg-white/10 rounded-md transition-all ${msg.feedback === 'like' ? 'text-white' : 'text-white/20 hover:text-white'}`}
                            title="Suka"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handleFeedback(msg.id, 'unlike')} 
                            className={`p-1 hover:bg-white/10 rounded-md transition-all ${msg.feedback === 'unlike' ? 'text-white' : 'text-white/20 hover:text-white'}`}
                            title="Tidak Suka"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                    <div className="flex gap-1.5 p-1">
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      {isGeneratingImage ? 'Faqih AI sedang melukis...' : 'Faqih AI sedang mengetik...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1a1a1a] border-t border-[#2a2a2a]">
              <div className="flex flex-col gap-3">
                {messages.length > 0 && !isTyping && (
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                    {CHAT_STARTERS.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSend(s.text)}
                        className="flex-shrink-0 text-[10px] py-1.5 px-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all whitespace-nowrap"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] pl-4 pr-2 py-2 transition-all">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="Tanya Faqih..."
                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-white py-2 resize-none max-h-[120px] scrollbar-none placeholder:text-white/20"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isTyping || !inputValue.trim()}
                    className="p-2.5 bg-white text-black rounded-lg hover:bg-white/90 active:scale-95 disabled:opacity-20 disabled:scale-100 transition-all flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl hover:border-white/20 transition-all group z-[100]"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-white/90" />
            <div className="absolute -top-1 -right-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </div>
          </div>
          <span className="text-sm font-mono uppercase tracking-[0.2em] text-white/70 group-hover:text-white hidden sm:block">
            Ask AI
          </span>
        </button>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .markdown-chat {
          line-height: 1.6;
        }
        .markdown-chat strong {
          color: white;
          font-weight: 700;
        }
        .markdown-chat code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.85em;
        }
        .markdown-chat p {
          margin-bottom: 0.5rem;
        }
        .markdown-chat p:last-child {
          margin-bottom: 0;
        }
        .markdown-chat ul, .markdown-chat ol {
          margin-left: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .markdown-chat li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </>
  )
}
