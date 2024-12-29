'use client'

import { useState, useCallback, useEffect } from 'react'
import Cookies from 'js-cookie'

const API_KEY_COOKIE = 'openai_api_key'

export const useApiKey = () => {
  // Initialize state from cookie
  const [apiKey, setApiKey] = useState<string>(() => {
    const key = Cookies.get(API_KEY_COOKIE) || ''
    console.log('useApiKey: Initial cookie value exists:', !!key)
    return key
  })

  const updateApiKey = useCallback((key: string) => {
    const trimmedKey = key.trim()
    console.log('useApiKey: updateApiKey called with value:', trimmedKey ? '***exists***' : 'empty')
    
    if (trimmedKey) {
      console.log('useApiKey: Setting cookie and state')
      // Update cookie first
      Cookies.set(API_KEY_COOKIE, trimmedKey)
      // Force immediate state update
      Promise.resolve().then(() => {
        console.log('useApiKey: Forcing immediate state update')
        setApiKey(trimmedKey)
      })
    } else {
      console.log('useApiKey: Removing cookie and clearing state')
      Cookies.remove(API_KEY_COOKIE)
      // Force immediate state update
      Promise.resolve().then(() => {
        console.log('useApiKey: Forcing immediate state update')
        setApiKey('')
      })
    }
  }, [])

  // Debug: Log state changes
  useEffect(() => {
    console.log('useApiKey: State changed, new value exists:', !!apiKey)
    const cookieValue = Cookies.get(API_KEY_COOKIE)
    console.log('useApiKey: Current cookie value exists:', !!cookieValue)
  }, [apiKey])

  return {
    apiKey,
    updateApiKey
  }
} 