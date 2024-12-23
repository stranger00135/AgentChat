'use client'

import { ChatMessage } from './ChatMessage'
import { InterimDiscussion } from './InterimDiscussion'
import { useEffect, useRef } from 'react'
import { useChatStore } from '@/app/store/chatStore'

export const MessageList = () => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { messages } = useChatStore()

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

  // Filter out interim messages from the main display
  const mainMessages = messages.filter(msg => !msg.isInterim)

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 bg-white">
      <div className="space-y-6">
        {mainMessages.map((message) => (
          <div key={message.id}>
            <ChatMessage message={message} />
            {message.role === 'user' && <InterimDiscussion parentMessageId={message.id} />}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
} 