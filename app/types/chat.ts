export type Role = 'user' | 'assistant' | 'agent' | 'executor'

export interface Agent {
  id: string
  name: string
  description: string
  prompt: string       // Initial context and behavior
  model: string       // LLM model to use
  maxTurns: number    // Maximum conversation turns
  order: number       // Pipeline position
  isActive: boolean   // Current state
}

/**
 * @description Message interface for chat messages, including turn tracking for agent conversations
 */
export interface Message {
  id: string
  content: string
  role: string
  timestamp: string
  agentId?: string
  agentName?: string
  threadId?: string
  parentMessageId?: string
  iterationNumber?: number
  isInterim?: boolean
  isDiscussion?: boolean
  isFinal?: boolean
  responseToAgent?: string
  isError?: boolean
  currentTurn?: number
  maxTurns?: number
}

export interface ConversationThread {
  id: string
  parentMessageId: string
  messages: Message[]
  isExpanded: boolean
  agentId: string
  currentTurn: number
}

export interface ChatState {
  messages: Message[]
  agents: Agent[]
  activeAgents: string[]
  conversationThreads: { [key: string]: ConversationThread }
  toggleThread: (threadId: string) => void
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface ConversationSummary {
  id: string
  title: string
  lastMessage: string
  updatedAt: string
} 