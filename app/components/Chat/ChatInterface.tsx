'use client'

import { useChatStore } from '@/app/store/chatStore'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { useEffect, useState } from 'react'

export const ChatInterface = () => {
  const [mounted, setMounted] = useState(false)
  const { 
    chats, 
    currentChatId, 
    createChat, 
    addMessage 
  } = useChatStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && chats.length === 0) {
      createChat()
    }
  }, [mounted, chats.length, createChat])

  const currentChat = chats.find(chat => chat.id === currentChatId)
  
  const handleSubmit = (content: string) => {
    if (!currentChatId) return
    
    addMessage({
      role: 'user',
      content
    })
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">AI Chat</h1>
      </header>
      <main className="flex-1 flex flex-col min-h-0">
        <MessageList 
          messages={currentChat?.messages ?? []}
        />
        <div className="border-t">
          <ChatInput 
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
} 