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

  // Group messages by parent ID for interim discussions
  const messageGroups: { [key: string]: typeof messages } = {}
  messages.forEach(msg => {
    if (msg.parentMessageId && !msg.isFinal) {
      if (!messageGroups[msg.parentMessageId]) {
        messageGroups[msg.parentMessageId] = []
      }
      messageGroups[msg.parentMessageId].push(msg)
    }
  })

  // Get main messages (user messages and final responses only)
  const mainMessages = messages.filter(msg => 
    msg.role === 'user' || // User messages
    (msg.role === 'assistant' && msg.isFinal) // Final responses only
  )

  // Group messages by conversation
  const conversations: { [key: string]: typeof messages } = {}
  mainMessages.forEach(msg => {
    if (msg.role === 'user') {
      conversations[msg.id] = [msg]
    } else if (msg.isFinal && msg.parentMessageId) {
      const parentId = msg.parentMessageId
      if (conversations[parentId]) {
        conversations[parentId].push(msg)
      }
    }
  })

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 bg-white">
      <div className="space-y-6">
        {Object.entries(conversations).map(([parentId, conversationMessages]) => (
          <div key={parentId} className="space-y-4">
            {/* Display user message */}
            <ChatMessage message={conversationMessages[0]} />
            
            {/* Display interim discussion if exists */}
            {messageGroups[parentId] && messageGroups[parentId].length > 0 && (
              <InterimDiscussion parentMessageId={parentId} />
            )}
            
            {/* Display final response if exists */}
            {conversationMessages.length > 1 && (
              <ChatMessage message={conversationMessages[1]} />
            )}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
} 