'use client'

import { ApiKeyProvider } from './contexts/ApiKeyContext'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ApiKeyProvider>{children}</ApiKeyProvider>
} 