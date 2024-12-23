export type Role = 'user' | 'assistant' | 'agent' | 'executor'

export interface Agent {
  id: string
  name: string
  description: string
  systemPrompt: string
}

export interface Message {
  id: string
  content: string
  role: Role
  agentId?: string
  agentName?: string
  timestamp: string
  isInterim?: boolean
  isFinal?: boolean
  isDiscussion?: boolean
  parentMessageId?: string
  iterationNumber?: number
}

export interface InterimDiscussion {
  id: string
  parentMessageId: string
  messages: Message[]
  isExpanded: boolean
  currentIteration?: number
}

export interface ChatState {
  messages: Message[]
  agents: Agent[]
  activeAgents: string[]
  interimDiscussions: { [key: string]: InterimDiscussion }
  toggleInterimDiscussion: (parentMessageId: string) => void
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