'use client'

import { Message } from '@/app/types/chat'
import { ChatMessage } from './ChatMessage'
import { useEffect, useRef } from 'react'

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No messages yet. Start a conversation!
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="space-y-6">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isLoading={message.id === messages[messages.length - 1]?.id && isLoading}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
} 