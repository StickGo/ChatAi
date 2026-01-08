'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    const savedWelcome = localStorage.getItem('hasShownWelcome')
    
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    }
    
    if (savedWelcome) {
      setHasShownWelcome(true)
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom when new messages arrive or chat opens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isOpen])

  // Show welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: 'Halo! Saya Faqih Bot 💻\n\nSaya di sini untuk membantu Anda mengetahui lebih banyak tentang Agil - seorang developer dan musisi yang passionate.\n\nTanyakan saya tentang:\n- 🎮 Game Development Projects\n- 💻 Web & App Development\n- 🎵 Music Production\n- 🚀 Pengalaman Kerja\n\nAda yang ingin kamu ketahui?',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
      setHasShownWelcome(true)
      localStorage.setItem('hasShownWelcome', 'true')
    }
  }, [isOpen, hasShownWelcome])

  // Fungsi untuk mengirim pesan ke API
  const sendMessageToAI = async (userMessage: string) => {
    try {
      // Siapkan history untuk context (ambil 10 pesan terakhir)
      const history = messages.slice(-10).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }))

      // Panggil API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: history,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mendapatkan response')
      }

      return data.message
    } catch (error) {
      console.error('Error calling AI:', error)
      throw error
    }
  }

  // Handle kirim pesan
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage = inputValue.trim()
    setInputValue('')

    // Tambah pesan user
    const userMsg: Message = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])

    // Set loading (typing indicator)
    setIsTyping(true)

    try {
      // Panggil AI
      const aiResponse = await sendMessageToAI(userMessage)

      // Tambah response AI
      const botMsg: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (error) {
      // Tampilkan error message
      const errorMessage = error instanceof Error ? error.message : 'Maaf, terjadi kesalahan. Coba lagi ya! 😅'
      
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: `Error: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Clear chat history
  const handleClearHistory = () => {
    if (window.confirm('Hapus semua riwayat chat? Tindakan ini tidak bisa dibatalkan.')) {
      setMessages([])
      setHasShownWelcome(false)
      localStorage.removeItem('chatMessages')
      localStorage.removeItem('hasShownWelcome')
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bg-[#0a0a0a] shadow-2xl flex flex-col overflow-hidden border border-[#1a1a1a] z-50 animate-slideUp transition-all duration-300
            ${isFullscreen 
              ? 'top-0 left-0 w-full h-full rounded-none' 
              : 'bottom-24 right-6 w-[380px] h-[550px] rounded-2xl'
            }`}
        >
          {/* Header */}
          <div className="bg-[#0a0a0a] text-white p-4 flex justify-between items-center border-b border-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div className="flex flex-col">
                <span className="font-bold text-lg font-heading">Faqih Bot</span>
                <span className="text-xs opacity-70">Portfolio Assistant</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hover:bg-[var(--background)]/20 rounded-full p-2 transition-all duration-200"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                )}
              </button>
              <button
                onClick={handleClearHistory}
                className="hover:bg-[var(--background)]/20 rounded-full p-2 transition-all duration-200 hover:text-red-300"
                aria-label="Clear chat history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-red-500/80 rounded-full p-2 transition-all duration-200 ml-1"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--background)]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-lg flex-shrink-0 border border-[#2a2a2a]">
                    🤖
                  </div>
                )}
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[260px] px-4 py-2.5 rounded-2xl shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#f5f5f5] text-black rounded-br-md'
                        : 'bg-[#1a1a1a] text-white rounded-bl-md border border-[#2a2a2a]'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="text-xs opacity-50 mt-1 px-2 text-[var(--foreground)]">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#f5f5f5] text-black flex items-center justify-center text-lg flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 items-end justify-start animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-lg flex-shrink-0 border border-[#2a2a2a]">
                  🤖
                </div>
                <div className="bg-[#1a1a1a] rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-[#2a2a2a]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#1a1a1a] bg-[#0a0a0a] flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik pesan..."
              className="flex-1 px-4 py-2.5 border border-[#2a2a2a] rounded-full focus:outline-none focus:ring-1 focus:ring-white transition-all bg-[#0a0a0a] text-white placeholder-gray-600"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              className="bg-[#f5f5f5] text-black px-5 py-2.5 rounded-full hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              aria-label="Send message"
            >
              <span className="text-lg">➤</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-6 flex items-center gap-3 px-4 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg hover:border-white/30 hover:shadow-white/10 transition-all group z-50"
          aria-label="Open chat"
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white transition-colors">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </div>
          <span className="text-sm font-mono uppercase tracking-widest text-white/70 group-hover:text-white hidden sm:block">
            Ask AI
          </span>
        </button>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .fixed.bottom-24 {
            width: calc(100vw - 2rem);
            max-width: 380px;
          }
        }
      `}</style>
    </>
  )
}
