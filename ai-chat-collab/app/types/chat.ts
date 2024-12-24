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

export interface Message {
  id: string
  content: string
  role: Role
  agentId?: string
  agentName?: string
  timestamp: string
  parentMessageId?: string    // Link messages in a conversation
  threadId?: string          // Group related messages in a conversation thread
  iterationNumber?: number   // Track iteration number in the conversation
  isInterim?: boolean       // Whether this is part of interim discussion
  isDiscussion?: boolean    // Whether this is a discussion message
  isFinal?: boolean        // Whether this is the final response
  responseToAgent?: string // Track which agent this response is for
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