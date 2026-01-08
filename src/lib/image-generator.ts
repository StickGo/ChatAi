/**
 * Generate image URL using Pollinations AI (Correct Image API)
 * @param prompt - Image description in English
 * @returns Direct URL to the generated image
 */
export async function generateImage(prompt: string): Promise<string | null> {
  try {
    // Clean prompt: remove special characters
    const cleanPrompt = prompt.trim().replace(/[^\w\s]/gi, ' ').trim()
    const encodedPrompt = encodeURIComponent(cleanPrompt)
    
    // Using the correct image API endpoint with distinct seed and high-quality model
    const seed = Math.floor(Math.random() * 1000000)
    // Add model=flux for better quality, and ensure proper encoding
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`

    console.log('Pollinations Image API URL:', imageUrl)
    return imageUrl
  } catch (error) {
    console.error('Image URL generation error:', error)
    return null
  }
}
