'use client'

import { useChatStore } from '@/app/store/chatStore'
import { useEffect, useState } from 'react'

export default function ChatStoreTest() {
  const [mounted, setMounted] = useState(false)
  const { 
    chats, 
    currentChatId, 
    createChat, 
    addMessage, 
    deleteChat,
    clearChats 
  } = useChatStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Store Test</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={createChat}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create New Chat
          </button>
          <button
            onClick={clearChats}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Clear All Chats
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Current Chat ID: {currentChatId || 'None'}</h2>
          <h2 className="text-xl font-semibold mb-2">Total Chats: {chats.length}</h2>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Test Actions:</h2>
          <button
            onClick={() => {
              if (currentChatId) {
                addMessage({
                  role: 'user',
                  content: 'Test message at ' + new Date().toISOString(),
                })
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
          >
            Add Test Message
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Chats:</h2>
          {chats.map((chat) => (
            <div key={chat.id} className="border p-4 mb-2 rounded">
              <div className="flex justify-between items-center mb-2">
                <span>ID: {chat.id}</span>
                <button
                  onClick={() => deleteChat(chat.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-2">
                {chat.messages.map((msg) => (
                  <div key={msg.id} className="border-l-4 border-blue-500 pl-2">
                    <p><strong>{msg.role}:</strong> {msg.content}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 