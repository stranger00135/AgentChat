import Image from 'next/image'
import { ChatInterface } from './components/Chat/ChatInterface'

export default function Home() {
  return (
    <main className="flex h-full flex-col">
      <ChatInterface />
    </main>
  )
} 