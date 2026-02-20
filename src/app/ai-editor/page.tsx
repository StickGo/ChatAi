'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import DocumentEditor from '@/components/DocumentEditor'
import AIChat from '@/components/AIChat'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useRealtimeDocument } from '@/hooks/useRealtimeDocument'
import {
  FileText,
  Plus,
  Trash2,
  Undo2,
  Redo2,
  Download,
  LogOut,
  ArrowLeft,
  Loader2
} from 'lucide-react'

interface Document {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

// ─── Undo/Redo Hook ─────────────────────────────────────────
function useUndoRedo(initial: string) {
  const [history, setHistory] = useState<string[]>([initial])
  const [index, setIndex] = useState(0)
  const skipNextPush = useRef(false)

  const current = history[index]

  const push = useCallback((value: string) => {
    if (skipNextPush.current) {
      skipNextPush.current = false
      return
    }
    setHistory(prev => {
      const newHistory = prev.slice(0, index + 1)
      newHistory.push(value)
      // Cap history at 100 entries
      if (newHistory.length > 100) newHistory.shift()
      return newHistory
    })
    setIndex(prev => Math.min(prev + 1, 100))
  }, [index])

  const undo = useCallback(() => {
    if (index > 0) {
      skipNextPush.current = true
      setIndex(prev => prev - 1)
    }
  }, [index])

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      skipNextPush.current = true
      setIndex(prev => prev + 1)
    }
  }, [index, history.length])

  const reset = useCallback((value: string) => {
    setHistory([value])
    setIndex(0)
  }, [])

  return { current, push, undo, redo, reset, canUndo: index > 0, canRedo: index < history.length - 1 }
}

// ─── Auth Form ───────────────────────────────────────────────
function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <FileText size={28} strokeWidth={1.5} />
        </div>
        <h1 className="auth-title">Document Editor</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to continue' : 'Create your account'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            minLength={6}
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <button
          className="auth-toggle"
          onClick={() => { setIsLogin(!isLogin); setError('') }}
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  )
}

// ─── Document List ───────────────────────────────────────────
function DocumentList({
  documents,
  onSelect,
  onCreate,
  onDelete,
  loading
}: {
  documents: Document[]
  onSelect: (doc: Document) => void
  onCreate: () => void
  onDelete: (id: string) => void
  loading: boolean
}) {
  return (
    <div className="doclist-page">
      <div className="doclist-container">
        <div className="doclist-header">
          <h1 className="doclist-title">
            <FileText size={18} strokeWidth={1.5} />
            Documents
          </h1>
          <button className="doclist-new-btn" onClick={onCreate}>
            + New Document
          </button>
        </div>

        {loading ? (
          <div className="doclist-loading">
            <Loader2 size={16} style={{ display: 'inline', marginRight: 8, animation: 'spin 1s linear infinite' }} />
            Loading...
          </div>
        ) : documents.length === 0 ? (
          <div className="doclist-empty">
            <div className="doclist-empty-icon">
              <FileText size={24} strokeWidth={1} />
            </div>
            <p>No documents yet</p>
            <button className="doclist-new-btn" onClick={onCreate}>
              Create your first document
            </button>
          </div>
        ) : (
          <div className="doclist-grid">
            {documents.map(doc => (
              <div key={doc.id} className="doclist-card" onClick={() => onSelect(doc)}>
                <div className="doclist-card-title">{doc.title}</div>
                <div className="doclist-card-preview">
                  {doc.content.slice(0, 120) || '(empty)'}
                </div>
                <div className="doclist-card-footer">
                  <span>{new Date(doc.updated_at).toLocaleDateString()}</span>
                  <button
                    className="doclist-card-delete"
                    onClick={(e) => { e.stopPropagation(); onDelete(doc.id) }}
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Editor Page ────────────────────────────────────────
export default function EditorPage() {
  const { user, loading: authLoading } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeDoc, setActiveDoc] = useState<Document | null>(null)
  const [docsLoading, setDocsLoading] = useState(true)

  // Undo/Redo
  const {
    current: documentContent,
    push: pushHistory,
    undo, redo, reset: resetHistory,
    canUndo, canRedo
  } = useUndoRedo('')

  // Auto-save
  useAutoSave(activeDoc?.id ?? null, documentContent)

  // Realtime
  const handleRealtimeUpdate = useCallback((content: string) => {
    pushHistory(content)
  }, [pushHistory])
  useRealtimeDocument(activeDoc?.id ?? null, handleRealtimeUpdate)

  // Load documents
  useEffect(() => {
    if (!user) return
    loadDocuments()
  }, [user])

  async function loadDocuments() {
    setDocsLoading(true)
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false })

    if (!error && data) {
      setDocuments(data)
    }
    setDocsLoading(false)
  }

  async function createDocument() {
    if (!user) return
    const title = prompt('Document title:') || 'Untitled'
    const { data, error } = await supabase
      .from('documents')
      .insert({ title, content: '', user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setDocuments(prev => [data, ...prev])
      openDocument(data)
    }
  }

  async function deleteDocument(id: string) {
    if (!confirm('Delete this document?')) return
    await supabase.from('documents').delete().eq('id', id)
    setDocuments(prev => prev.filter(d => d.id !== id))
    if (activeDoc?.id === id) {
      setActiveDoc(null)
      resetHistory('')
    }
  }

  function openDocument(doc: Document) {
    setActiveDoc(doc)
    resetHistory(doc.content)
  }

  function handleContentChange(newContent: string) {
    pushHistory(newContent)
  }

  function handleAIUpdate(newContent: string) {
    pushHistory(newContent)
  }

  function downloadDocument() {
    if (!activeDoc) return
    const blob = new Blob([documentContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeDoc.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  // Auth loading
  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-loading">Loading...</div>
      </div>
    )
  }

  // Not signed in
  if (!user) {
    return <AuthForm />
  }

  // No active doc → show list
  if (!activeDoc) {
    return (
      <div className="ai-editor-root">
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-brand">AI Editor</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-email">{user.email}</span>
            <button className="topbar-btn" onClick={handleSignOut}>
              <LogOut size={12} strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </div>
        <DocumentList
          documents={documents}
          onSelect={openDocument}
          onCreate={createDocument}
          onDelete={deleteDocument}
          loading={docsLoading}
        />
      </div>
    )
  }

  // Active doc → two-panel editor
  return (
    <div className="ai-editor-root">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <button className="topbar-btn" onClick={() => setActiveDoc(null)}>
            <ArrowLeft size={12} strokeWidth={1.5} />
            Back
          </button>
          <span className="topbar-doctitle">{activeDoc.title}</span>
        </div>
        <div className="topbar-actions">
          <button className="topbar-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <Undo2 size={12} strokeWidth={1.5} />
            Undo
          </button>
          <button className="topbar-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <Redo2 size={12} strokeWidth={1.5} />
            Redo
          </button>
          <button className="topbar-btn" onClick={downloadDocument} title="Download">
            <Download size={12} strokeWidth={1.5} />
            Export
          </button>
        </div>
        <div className="topbar-right">
          <span className="topbar-email">{user.email}</span>
          <button className="topbar-btn" onClick={handleSignOut}>
            <LogOut size={12} strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="panels-wrapper">
        <PanelGroup orientation="horizontal">
          <Panel id="editor" defaultSize={50} minSize={30}>
            <DocumentEditor
              content={documentContent}
              onChange={handleContentChange}
            />
          </Panel>

          <PanelResizeHandle className="panel-resize-handle" />

          <Panel id="chat" defaultSize={50} minSize={30}>
            <AIChat
              documentContent={documentContent}
              onDocumentUpdate={handleAIUpdate}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}
