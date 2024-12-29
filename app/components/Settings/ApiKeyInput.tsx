'use client'

import { useState } from 'react'
import { useApiKey } from '@/app/hooks/useApiKey'

export const ApiKeyInput = () => {
  const { apiKey, setApiKey, anthropicKey, setAnthropicKey } = useApiKey()
  const [isEditingOpenAI, setIsEditingOpenAI] = useState(!apiKey)
  const [isEditingAnthropic, setIsEditingAnthropic] = useState(!anthropicKey)
  const [openAIInput, setOpenAIInput] = useState('')
  const [anthropicInput, setAnthropicInput] = useState('')

  const handleOpenAISave = () => {
    if (openAIInput.trim()) {
      setApiKey(openAIInput)
      setOpenAIInput('')
      setIsEditingOpenAI(false)
    }
  }

  const handleAnthropicSave = () => {
    if (anthropicInput.trim()) {
      setAnthropicKey(anthropicInput)
      setAnthropicInput('')
      setIsEditingAnthropic(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">OpenAI API Key (Required)</h3>
        {!isEditingOpenAI && apiKey ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">API Key: ••••••••</span>
            <button
              onClick={() => {
                setOpenAIInput(apiKey)
                setIsEditingOpenAI(true)
              }}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setApiKey('')
                setIsEditingOpenAI(true)
              }}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={openAIInput}
              onChange={(e) => setOpenAIInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && openAIInput.trim()) {
                  handleOpenAISave()
                }
              }}
              placeholder="Enter OpenAI API Key"
              className="flex-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleOpenAISave}
              disabled={!openAIInput.trim()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Anthropic API Key (Optional)</h3>
        {!isEditingAnthropic && anthropicKey ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">API Key: ••••••••</span>
            <button
              onClick={() => {
                setAnthropicInput(anthropicKey)
                setIsEditingAnthropic(true)
              }}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setAnthropicKey('')
                setIsEditingAnthropic(true)
              }}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={anthropicInput}
              onChange={(e) => setAnthropicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && anthropicInput.trim()) {
                  handleAnthropicSave()
                }
              }}
              placeholder="Enter Anthropic API Key (optional)"
              className="flex-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAnthropicSave}
              disabled={!anthropicInput.trim()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 