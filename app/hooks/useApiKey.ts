'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'

const API_KEY_COOKIE = 'openai_api_key'

export const useApiKey = () => {
  // Initialize with cookie value immediately
  const [apiKey, setApiKey] = useState<string>(() => {
    const savedKey = Cookies.get(API_KEY_COOKIE)
    return savedKey || ''
  })

  const updateApiKey = (key: string) => {
    const trimmedKey = key.trim()
    if (trimmedKey) {
      Cookies.set(API_KEY_COOKIE, trimmedKey)
      setApiKey(trimmedKey)
    } else {
      Cookies.remove(API_KEY_COOKIE)
      setApiKey('')
    }
  }

  return {
    apiKey,
    updateApiKey
  }
} 