'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const OPENAI_KEY_COOKIE = 'openai_api_key'
const ANTHROPIC_KEY_COOKIE = 'anthropic_api_key'

interface ApiKeyContextType {
  apiKey: string
  setApiKey: (key: string) => void
  anthropicKey: string
  setAnthropicKey: (key: string) => void
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: '',
  setApiKey: () => {},
  anthropicKey: '',
  setAnthropicKey: () => {},
})

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState('')
  const [anthropicKey, setAnthropicKeyState] = useState('')

  useEffect(() => {
    // On client mount, read cookies
    const storedOpenAIKey = Cookies.get(OPENAI_KEY_COOKIE) || ''
    const storedAnthropicKey = Cookies.get(ANTHROPIC_KEY_COOKIE) || ''
    if (storedOpenAIKey) setApiKeyState(storedOpenAIKey)
    if (storedAnthropicKey) setAnthropicKeyState(storedAnthropicKey)
  }, [])

  const setApiKey = (key: string) => {
    if (key.trim()) {
      Cookies.set(OPENAI_KEY_COOKIE, key.trim(), {
        expires: 7,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      })
      setApiKeyState(key.trim())
    } else {
      Cookies.remove(OPENAI_KEY_COOKIE, { path: '/' })
      setApiKeyState('')
    }
  }

  const setAnthropicKey = (key: string) => {
    if (key.trim()) {
      Cookies.set(ANTHROPIC_KEY_COOKIE, key.trim(), {
        expires: 7,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      })
      setAnthropicKeyState(key.trim())
    } else {
      Cookies.remove(ANTHROPIC_KEY_COOKIE, { path: '/' })
      setAnthropicKeyState('')
    }
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, anthropicKey, setAnthropicKey }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export const useApiKey = () => useContext(ApiKeyContext) 