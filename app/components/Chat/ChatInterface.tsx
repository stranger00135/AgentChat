'use client'

import { useState, useEffect } from 'react'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { AgentList } from './AgentList'
import { useApiKey } from '@/app/hooks/useApiKey'
import { ApiKeyInput } from '../Settings/ApiKeyInput'
import { useChatStore } from '@/app/store/chatStore'
import { v4 as uuidv4 } from 'uuid'

export const ChatInterface = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiKey } = useApiKey()
  const { addMessage, agents, activeAgents, messages } = useChatStore()

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !apiKey) return

    // Display user message immediately
    const userMessageId = uuidv4()
    addMessage(content, 'user', {
      id: userMessageId
    })

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content,
          messageId: userMessageId,
          apiKey,
          activeAgents,
          agents,
          chatHistory: messages.filter(m => !m.isInterim && !m.isDiscussion)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response body is not readable')
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Parse the chunk
        const chunk = new TextDecoder().decode(value)
        const messages = chunk.split('\n').filter(Boolean)

        for (const messageStr of messages) {
          try {
            const message = JSON.parse(messageStr)
            if (message.type === 'message') {
              const msg = message.data
              
              if (msg.role === 'agent') {
                addMessage(msg.content, msg.role, {
                  id: msg.id,
                  agentId: msg.agentId,
                  agentName: msg.agentName,
                  isInterim: true,
                  isDiscussion: msg.isDiscussion,
                  parentMessageId: msg.parentMessageId,
                  iterationNumber: msg.iterationNumber
                })
              } else if (msg.role === 'assistant') {
                addMessage(msg.content, msg.role, {
                  id: msg.id,
                  isInterim: msg.isInterim,
                  isDiscussion: msg.isDiscussion,
                  parentMessageId: msg.parentMessageId,
                  iterationNumber: msg.iterationNumber,
                  agentId: msg.agentId,
                  agentName: msg.agentName,
                  isFinal: msg.isFinal
                })
              }
            }
          } catch (e) {
            console.error('Error parsing message:', e)
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError(error instanceof Error ? error.message : 'Failed to send message')
      addMessage(
        'Sorry, there was an error processing your message. Please try again.',
        'assistant',
        { isError: true }
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h1 className="text-2xl font-bold mb-2">AI Chat</h1>
        <ApiKeyInput />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          <div className="w-64 p-4 border-r bg-gray-50">
            <AgentList />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList />
            </div>
            <div className="p-4 border-t bg-white">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={isLoading || !apiKey} 
                placeholder={apiKey ? "Type a message..." : "Please enter your OpenAI API key first"}
              />
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 