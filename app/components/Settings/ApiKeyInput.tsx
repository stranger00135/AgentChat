'use client'

import { useState, useEffect } from 'react'
import { useApiKey } from '@/app/contexts/ApiKeyContext'

export const ApiKeyInput = () => {
  const { apiKey, setApiKey } = useApiKey()
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(!apiKey)

  // Log initial mount
  useEffect(() => {
    console.log('ApiKeyInput: Component mounted, initial apiKey exists:', !!apiKey)
  }, [apiKey])

  // Update editing state when apiKey changes
  useEffect(() => {
    console.log('ApiKeyInput: apiKey changed, new value exists:', !!apiKey)
    setIsEditing(!apiKey)
  }, [apiKey])

  const handleSave = () => {
    console.log('ApiKeyInput: Save button clicked')
    const trimmedValue = inputValue.trim()
    if (trimmedValue) {
      console.log('ApiKeyInput: About to save API key')
      setApiKey(trimmedValue)
      console.log('ApiKeyInput: API key saved')
      
      setInputValue('')
      setIsEditing(false)
      console.log('ApiKeyInput: Input cleared and editing disabled')
    }
  }

  const handleEdit = () => {
    console.log('ApiKeyInput: Edit button clicked')
    setIsEditing(true)
    setInputValue(apiKey) // Set current API key when editing
  }

  const handleClear = () => {
    console.log('ApiKeyInput: Clear button clicked')
    setApiKey('')
    setInputValue('')
    setIsEditing(true)
  }

  if (!isEditing && apiKey) {
    return (
      <div className="flex items-center gap-2 p-2">
        <span className="text-sm text-gray-600">API Key: ••••••••</span>
        <button
          onClick={handleEdit}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleClear}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Clear
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <input
        type="password"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && inputValue.trim()) {
            handleSave()
          }
        }}
        placeholder="Enter OpenAI API Key"
        className="flex-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSave}
        disabled={!inputValue.trim()}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Save
      </button>
    </div>
  )
} 