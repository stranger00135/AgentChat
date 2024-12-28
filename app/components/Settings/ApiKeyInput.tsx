'use client'

import { useState, useEffect } from 'react'
import { useApiKey } from '@/app/hooks/useApiKey'

export const ApiKeyInput = () => {
  const { apiKey, updateApiKey } = useApiKey()
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(!apiKey)

  useEffect(() => {
    if (apiKey) {
      setInputValue(apiKey)
      setIsEditing(false)
    }
  }, [apiKey])

  const handleSave = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue) {
      updateApiKey(trimmedValue)
      // Force immediate UI update
      setIsEditing(false)
      setInputValue(trimmedValue)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSave()
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleClear = () => {
    updateApiKey('')
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
        onKeyPress={handleKeyPress}
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