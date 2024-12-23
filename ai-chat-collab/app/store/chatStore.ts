'use client'

import { create } from 'zustand'
import { Message, Agent, ChatState, InterimDiscussion } from '../types/chat'
import { v4 as uuidv4 } from 'uuid'

interface ChatStore extends ChatState {
  isLoading: boolean
  addMessage: (content: string, role: Role, options?: {
    agentId?: string,
    isInterim?: boolean,
    parentMessageId?: string,
    id?: string
  }) => void
  addAgent: (name: string, description: string, systemPrompt: string) => void
  removeAgent: (agentId: string) => void
  toggleAgent: (agentId: string) => void
  clearMessages: () => void
  toggleInterimDiscussion: (parentMessageId: string) => void
}

// Predefined agents
const defaultAgents: Agent[] = [
  {
    id: 'researcher',
    name: 'Research Assistant',
    description: 'Helps with research, fact-checking, and analysis',
    systemPrompt: 'You are a research assistant. Help the task executor find accurate information and analyze data. Focus on providing well-researched, factual responses.'
  },
  {
    id: 'coder',
    name: 'Code Expert',
    description: 'Assists with coding, debugging, and technical implementation',
    systemPrompt: 'You are a coding expert. Help the task executor with programming tasks, debugging, and implementing solutions. Focus on providing clean, efficient code and clear explanations.'
  },
  {
    id: 'critic',
    name: 'Critical Thinker',
    description: 'Provides alternative viewpoints and critical analysis',
    systemPrompt: 'You are a critical thinker. Help the task executor by challenging assumptions, providing alternative viewpoints, and analyzing problems from different angles. Focus on constructive criticism and logical analysis.'
  }
]

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  agents: defaultAgents,
  activeAgents: [],
  interimDiscussions: {},
  isLoading: false,

  addMessage: (content, role, options = {}) => {
    const { agentId, isInterim, parentMessageId, id } = options
    const message: Message = {
      id: id || uuidv4(),
      content,
      role,
      timestamp: new Date().toISOString(),
      isInterim,
      parentMessageId
    }

    if (agentId) {
      const agent = defaultAgents.find(a => a.id === agentId)
      if (agent) {
        message.agentId = agentId
        message.agentName = agent.name
      }
    }

    // Always add message to the main messages array
    set(state => ({
      messages: [...state.messages, message]
    }))

    // If it's an interim message, also add it to the interim discussions
    if (isInterim && parentMessageId) {
      set(state => {
        const currentDiscussion = state.interimDiscussions[parentMessageId] || {
          id: uuidv4(),
          parentMessageId,
          messages: [],
          isExpanded: true // Start expanded by default
        }

        return {
          interimDiscussions: {
            ...state.interimDiscussions,
            [parentMessageId]: {
              ...currentDiscussion,
              messages: [...currentDiscussion.messages, message]
            }
          }
        }
      })
    }
  },

  addAgent: (name: string, description: string, systemPrompt: string) => {
    const newAgent: Agent = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      systemPrompt
    }

    set(state => ({
      agents: [...state.agents, newAgent]
    }))
  },

  removeAgent: (agentId: string) => {
    set(state => ({
      agents: state.agents.filter(a => a.id !== agentId),
      // Also remove from active agents if it was active
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

  toggleInterimDiscussion: (parentMessageId: string) => {
    set(state => ({
      interimDiscussions: {
        ...state.interimDiscussions,
        [parentMessageId]: {
          ...state.interimDiscussions[parentMessageId],
          isExpanded: !state.interimDiscussions[parentMessageId]?.isExpanded
        }
      }
    }))
  },

  clearMessages: () => {
    set({ messages: [], interimDiscussions: {} })
  }
})) 