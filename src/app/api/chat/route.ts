import { GoogleGenAI, Type } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { generateImage } from '@/lib/image-generator'
import { PORTFOLIO_DATA } from '@/data/portfolio'

// Inisialisasi Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// System prompt
const SYSTEM_PROMPT = `Kamu adalah asisten virtual bernama Faqih Bot 🎵💻.
Kamu adalah AI assistant yang ramah dan helpful untuk website portfolio Faqih.

INFO LENGKAP TENTANG FAQIH (GUNAKAN INI SEBAGAI SUMBER KEBENARAN):
${JSON.stringify(PORTFOLIO_DATA, null, 2)}

Cara kamu menjawab:
- Gunakan bahasa Indonesia yang santai tapi sopan
- Jawab dengan singkat dan jelas (maksimal 2-3 paragraf)
- Kalau ditanya tentang hal teknis, jelaskan dengan sederhana
- Kalau ditanya hal yang tidak kamu tahu, bilang dengan jujur
- Tambahkan emoji sesekali untuk membuat percakapan lebih friendly 😊
- Jika membicarakan musik atau koding, tunjukkan antusiasme!
- Jika ditanya tentang kenapa memilih Universitas Ciputra, jelaskan poin-poin dari data 'reasons'.

Kamu TIDAK boleh:
- Menjawab pertanyaan yang tidak pantas
- Berpura-pura menjadi orang lain
- Memberikan informasi pribadi yang sensitif (seperti detail alamat rumah spesifik selain yang ada di data)

TOP 3 BAND FAVORIT FAQIH (INFORMASI PENTING):
1. The Adams (Lagu favorit: Timur, Hanya Kau, Masa Masa)
2. Perunggu (Lagu favorit: Pram, Aku Ada Untukmu, Kalibata)
3. The Beatles (Lagu favorit: If I Fell, In My Life, Real Love)

PENTING: Kamu didukung oleh DUA MODEL AI:
1. Gemini (untuk teks & logika)
2. Pollinations AI (untuk membuat gambar)

Jika user minta gambar (co: "buatkan", "gambar", "lukis", "generate image"), kamu WAJIB memanggil tool generate_image.
- Jangan hanya kasih deskripsi teks.
- Gunakan tool generate_image dengan prompt bahasa Inggris yang detail.
- Contoh: "Siap! Saya akan membuatkan gambar kucing oranye lucu untukmu." (lalu panggil tool)

Jika ditanya tentang musik atau band favorit, ceritakan tentang ketiga band di atas dengan penuh semangat! Katakan bahwa Faqih sangat menyukai vibe musik mereka.`

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

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return NextResponse.json(
            { error: 'API Key belum di-setting. Cek file .env.local kamu!' },
            { status: 500 }
        )
    }

    // Ambil message dari request body
    const { message, history } = await request.json()

    // Validasi input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Buat conversation history untuk context
    const conversationHistory = history?.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })) || []

    // --- LAYER 1: Manual Intent Detection (Fallback for Quota Cases) ---
    const isImageRequest = /buatkan|gambar|generate|lukis|image|drawing|foto|photo/i.test(message)
    if (isImageRequest && (message.length < 300)) { // Increased limit to allow more detailed prompts
      // Extract a better prompt if possible, or just use the message
      const imagePrompt = message.replace(/buatkan|gambar|generate|lukis|image|photo|foto|ai|tolong/gi, '').trim() || message
      try {
        const imageData = await generateImage(imagePrompt)
        if (imageData) {
          return NextResponse.json({
            success: true,
            message: `Tentu! Ini hasil generate gambar untuk **${imagePrompt}**. (Deteksi otomatis) 🎨`,
            image: imageData,
            imagePrompt: imagePrompt
          })
        }
      } catch (e) { console.error('Manual Image Detection Fail:', e) }
    }

    try {
      // --- LAYER 2: Primary Gemini AI with Tools ---
      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: 'Baik, saya asisten Faqih Bot. Saya paham instruksi Anda, termasuk band favorit Faqih dan kemampuan saya membuat gambar.' }] },
          ...conversationHistory,
          { role: 'user', parts: [{ text: message }] },
        ],
        config: {
          tools: [imageGenerationTool]
        }
      })

      const functionCalls = geminiResponse.functionCalls

      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0]
        if (call.name === 'generate_image') {
          const imagePrompt = (call.args as any).prompt
          const imageData = await generateImage(imagePrompt)
          if (imageData) {
            return NextResponse.json({
              success: true,
              message: `Ini dia gambar **${imagePrompt}** yang kamu minta! 🎨`,
              image: imageData,
              imagePrompt: imagePrompt
            })
          }
        }
      }

      return NextResponse.json({ success: true, message: geminiResponse.text })

    } catch (geminiError: any) {
      console.error('Gemini Failure, switching to Pollinations Text Fallback...', geminiError)
      
      // --- LAYER 3: Pollinations Text Fallback (Ensures 100% Uptime via POST) ---
      try {
        const fallbackResponse = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: message }
            ],
            model: 'openai', // Pollinations openai model is stable
            jsonMode: false
          })
        })
        
        const fallbackText = await fallbackResponse.text()

        return NextResponse.json({
          success: true,
          message: fallbackText + "\n\n*(Note: Faqih AI sedang dalam mode backup karena limit harian)*"
        })
      } catch (fallbackError) {
        console.error('Fallback Failure:', fallbackError)
        return NextResponse.json(
          { error: 'Maaf, semua sistem AI sedang sibuk. Coba lagi nanti ya! 🙏' },
          { status: 500 }
        )
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'System Error' }, { status: 500 })
  }
}
