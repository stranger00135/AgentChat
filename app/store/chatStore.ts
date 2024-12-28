'use client'

import { create } from 'zustand'
import { Message, Agent, ChatState, Role } from '../types/chat'
import { v4 as uuidv4 } from 'uuid'

interface ChatStore extends ChatState {
  isLoading: boolean
  addMessage: (content: string, role: Role, options?: {
    agentId?: string,
    threadId?: string,
    parentMessageId?: string,
    iterationNumber?: number,
    isInterim?: boolean,
    isDiscussion?: boolean,
    isFinal?: boolean,
    responseToAgent?: string,
    id?: string,
    agentName?: string,
    isError?: boolean
  }) => void
  addAgent: (name: string, description: string, prompt: string, model?: string, maxTurns?: number) => void
  removeAgent: (agentId: string) => void
  toggleAgent: (agentId: string) => void
  clearMessages: () => void
  toggleThread: (threadId: string) => void
}

// Predefined agents with natural conversation prompts
const defaultAgents: Agent[] = [
  {
    id: 'technical-expert',
    name: 'Technical Expert',
    description: 'Ensures technical accuracy and implementation details',
    prompt: 'You are a senior technical expert reviewing solutions. Engage in natural conversation with the executor to ensure technical accuracy and proper implementation. Focus on correctness, efficiency, and best practices.',
    model: 'gpt-4',
    maxTurns: 1,
    order: 1,
    isActive: false
  },
  {
    id: 'ux-specialist',
    name: 'UX Specialist',
    description: 'Focuses on user experience and interface design',
    prompt: 'You are a UX/UI specialist. Have a natural conversation with the executor about user experience, interface design, and accessibility. Suggest improvements that enhance usability and user satisfaction.',
    model: 'gpt-4',
    maxTurns: 1,
    order: 2,
    isActive: false
  },
  {
    id: 'security-expert',
    name: 'Security Expert',
    description: 'Reviews security implications and best practices',
    prompt: 'You are a security expert. Engage with the executor to discuss security implications, identify potential vulnerabilities, and suggest security best practices. Focus on making the solution secure by design.',
    model: 'gpt-4',
    maxTurns: 1,
    order: 3,
    isActive: false
  }
]

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  agents: defaultAgents,
  activeAgents: [],
  conversationThreads: {},
  isLoading: false,

  addMessage: (content, role, options = {}) => {
    const { 
      agentId, 
      threadId, 
      parentMessageId, 
      iterationNumber,
      isInterim,
      isDiscussion,
      isFinal,
      responseToAgent,
      id,
      agentName: providedAgentName
    } = options

    const message: Message = {
      id: id || uuidv4(),
      content,
      role,
      timestamp: new Date().toISOString(),
      threadId,
      parentMessageId,
      iterationNumber,
      isInterim,
      isDiscussion,
      isFinal,
      responseToAgent
    }

    if (agentId) {
      const agent = [...defaultAgents, ...get().agents].find(a => a.id === agentId)
      if (agent) {
        message.agentId = agentId
        message.agentName = providedAgentName || agent.name
      }
    }

    // Add message to main messages array
    set(state => ({
      messages: [...state.messages, message]
    }))

    // If part of a thread, update the conversation thread
    if (parentMessageId) {
      set(state => {
        const threadId = message.threadId || parentMessageId
        const currentThread = state.conversationThreads[threadId] || {
          id: threadId,
          parentMessageId,
          messages: [],
          isExpanded: true, // Start expanded to show real-time messages
          agentId: agentId || '',
          currentTurn: 1
        }

        return {
          conversationThreads: {
            ...state.conversationThreads,
            [threadId]: {
              ...currentThread,
              messages: [...currentThread.messages, message]
            }
          }
        }
      })
    }
  },

  addAgent: (name, description, prompt, model = 'gpt-4', maxTurns = 5) => {
    const newAgent: Agent = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      prompt,
      model,
      maxTurns,
      order: get().agents.length + 1,
      isActive: false
    }

    set(state => ({
      agents: [...state.agents, newAgent]
    }))
  },

  removeAgent: (agentId: string) => {
    set(state => ({
      agents: state.agents.filter(a => a.id !== agentId),
      activeAgents: state.activeAgents.filter(id => id !== agentId)
    }))
  },

  toggleAgent: (agentId: string) => {
    set(state => ({
      activeAgents: state.activeAgents.includes(agentId)
        ? state.activeAgents.filter(id => id !== agentId)
        : [...state.activeAgents, agentId]
    }))
  },

  toggleThread: (threadId: string) => {
    set(state => ({
      conversationThreads: {
        ...state.conversationThreads,
        [threadId]: {
          ...state.conversationThreads[threadId],
          isExpanded: !state.conversationThreads[threadId]?.isExpanded
        }
      }
    }))
  },

  clearMessages: () => {
    set({ messages: [], conversationThreads: {} })
  }
})) 