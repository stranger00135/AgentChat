'use client'

import { useState } from 'react'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { AgentList } from './AgentList'
import { useApiKey } from '@/app/contexts/ApiKeyContext'
import { ApiKeyInput } from '../Settings/ApiKeyInput'
import { useChatStore } from '@/app/store/chatStore'
import { v4 as uuidv4 } from 'uuid'

export const ChatInterface = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { apiKey } = useApiKey()
  const { addMessage, agents, activeAgents, messages } = useChatStore()

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return
    
    // Check API key only when sending
    if (!apiKey) {
      console.log('ChatInterface: No API key available when trying to send message')
      setError('Please enter your OpenAI API key first')
      return
    }

    console.log('ChatInterface: Sending message with API key:', apiKey ? '***exists***' : 'empty')

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
          'Authorization': `Bearer ${apiKey}`
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
        if (response.status === 401) {
          const errorMessage = errorData.error || 'Please enter a valid OpenAI API key'
          setError(errorMessage)
          addMessage(errorMessage, 'assistant', { isError: true })
          return
        }
        throw new Error(errorData.error || 'Failed to send message')
      }

      if (!response.body) {
        throw new Error('Response body is empty')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const messages = chunk.split('\n').filter(Boolean)

        for (const messageStr of messages) {
          try {
            const message = JSON.parse(messageStr)
            if (message.type === 'message') {
              const msg = message.data
              if (msg.isError) {
                setError(msg.content)
                continue
              }
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
            setError('Error parsing response from server')
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
      setError(errorMessage)
      addMessage(errorMessage, 'assistant', { isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h1 className="text-2xl font-bold mb-2">AI Chat</h1>
        <ApiKeyInput />
        {error && (
          <div className="mt-2 text-sm text-red-500">
            {error}
          </div>
        )}
      </div>
      <AgentList />
      <MessageList />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading}
        placeholder="Type a message..."
      />
    </div>
  )
} 