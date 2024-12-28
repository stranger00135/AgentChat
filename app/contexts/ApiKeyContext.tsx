'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const API_KEY_COOKIE = 'openai_api_key'

interface ApiKeyContextType {
  apiKey: string
  setApiKey: (key: string) => void
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: '',
  setApiKey: () => {},
})

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState('')

  useEffect(() => {
    // On client mount, read cookie
    const storedKey = Cookies.get(API_KEY_COOKIE) || ''
    if (storedKey) setApiKeyState(storedKey)
  }, [])

  const setApiKey = (key: string) => {
    if (key.trim()) {
      Cookies.set(API_KEY_COOKIE, key.trim())
      setApiKeyState(key.trim())
    } else {
      Cookies.remove(API_KEY_COOKIE)
      setApiKeyState('')
    }
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export const useApiKey = () => useContext(ApiKeyContext) 