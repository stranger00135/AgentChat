'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const API_KEY_COOKIE = 'openai_api_key'

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>(() => Cookies.get(API_KEY_COOKIE) || '')

  useEffect(() => {
    const savedKey = Cookies.get(API_KEY_COOKIE)
    if (savedKey && !apiKey) {
      setApiKey(savedKey)
    }
  }, [apiKey])

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