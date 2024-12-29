'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const OPENAI_KEY_COOKIE = 'openai_api_key'
const ANTHROPIC_KEY_COOKIE = 'anthropic_api_key'

export const useApiKey = () => {
  const [apiKey, setApiKeyState] = useState<string>('')
  const [anthropicKey, setAnthropicKeyState] = useState<string>('')

  useEffect(() => {
    const savedOpenAIKey = Cookies.get(OPENAI_KEY_COOKIE)
    const savedAnthropicKey = Cookies.get(ANTHROPIC_KEY_COOKIE)
    if (savedOpenAIKey) setApiKeyState(savedOpenAIKey)
    if (savedAnthropicKey) setAnthropicKeyState(savedAnthropicKey)
  }, [])

  const setApiKey = (key: string) => {
    const trimmedKey = key.trim()
    setApiKeyState(trimmedKey)
    if (trimmedKey) {
      Cookies.set(OPENAI_KEY_COOKIE, trimmedKey, { expires: 7 })
    } else {
      Cookies.remove(OPENAI_KEY_COOKIE)
    }
  }

  const setAnthropicKey = (key: string) => {
    const trimmedKey = key.trim()
    setAnthropicKeyState(trimmedKey)
    if (trimmedKey) {
      Cookies.set(ANTHROPIC_KEY_COOKIE, trimmedKey, { expires: 7 })
    } else {
      Cookies.remove(ANTHROPIC_KEY_COOKIE)
    }
  }

  return {
    apiKey,
    setApiKey,
    anthropicKey,
    setAnthropicKey
  }
} 