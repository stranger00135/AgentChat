'use client'

import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export const ChatInput = ({ onSendMessage, disabled, placeholder = "Type a message..." }: ChatInputProps) => {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t p-4 bg-white">
      <div className="max-w-4xl mx-auto flex gap-4">
        <textarea
          className="flex-1 resize-none rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
        >
          Send
        </button>
      </div>
    </div>
  )
} 