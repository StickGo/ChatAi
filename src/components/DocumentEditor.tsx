'use client'

import { useRef } from 'react'

interface Props {
  content: string
  onChange: (content: string) => void
}

export default function DocumentEditor({ content, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  const lines = content.split('\n')
  const lineCount = lines.length

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  return (
    <div className="editor-container">
      {/* Header */}
      <div className="editor-header">
        <span className="editor-header-dot red" />
        <span className="editor-header-dot yellow" />
        <span className="editor-header-dot green" />
        <span className="editor-header-title">Editor</span>
        <span className="editor-header-lines">{lineCount} lines</span>
      </div>

      {/* Body */}
      <div className="editor-body">
        <div ref={lineNumbersRef} className="editor-line-numbers">
          {lines.map((_, i) => (
            <div key={i} className="editor-line-number">{i + 1}</div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="editor-textarea"
          placeholder="Start typing your document..."
          spellCheck={false}
        />
      </div>
    </div>
  )
}
