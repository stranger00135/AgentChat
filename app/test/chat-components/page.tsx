'use client'

import { ChatMessage } from '@/app/components/Chat/ChatMessage'
import { ChatInput } from '@/app/components/Chat/ChatInput'
import { useState, useEffect } from 'react'

export default function ChatComponentsTest() {
  // Use null initial state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'user' as const,
      content: 'Hello, this is a test message',
      timestamp: Date.now(),
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'This is a response with **markdown** and `code`',
      timestamp: Date.now(),
    },
    {
      id: '3',
      role: 'user' as const,
      content: '```typescript\nconst test = "code block";\n```',
      timestamp: Date.now(),
    }
  ])

  // Only render after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (message: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: Date.now()
    }])
  }

  if (!mounted) {
    return null // Return null on server-side and first render
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Components Test</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Message Component</h2>
          <div className="border rounded p-4">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Chat Input Component</h2>
          <div className="border rounded">
            <ChatInput onSubmit={handleSubmit} />
          </div>
        </section>
      </div>
    </div>
  )
} 