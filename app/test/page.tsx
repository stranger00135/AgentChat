'use client'

import { ChatInterface } from '../components/Chat/ChatInterface'
import { ApiKeyInput } from '../components/Settings/ApiKeyInput'

export default function TestPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">API Key Settings</h2>
        <ApiKeyInput />
      </div>
      
      <div className="h-[600px] border rounded">
        <ChatInterface />
      </div>
    </div>
  )
} 