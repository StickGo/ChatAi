import { AuthProvider } from '@/components/AuthProvider'
import './editor.css'

export const metadata = {
  title: 'AI Document Editor | Gemini & Supabase',
  description: 'Collaborative document editor with AI assistant powered by Gemini',
}

export default function AIEditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
