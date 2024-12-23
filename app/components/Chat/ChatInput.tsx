'use client'

import { FC, FormEvent, useRef, useState } from 'react'

interface ChatInputProps {
  onSubmit: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export const ChatInput: FC<ChatInputProps> = ({ 
  onSubmit, 
  isLoading = false,
  placeholder = 'Type a message...'
}) => {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    onSubmit(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="relative flex items-end max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-lg border p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`
            absolute right-2 bottom-2 rounded-lg p-2 text-white
            ${isLoading || !input.trim() 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}

const SendIcon: FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path 
      d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
) 