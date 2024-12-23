'use client'

import { useState } from 'react'
import { useChatStore } from '@/app/store/chatStore'
import { Agent } from '@/app/types/chat'

export const AgentList = () => {
  const { agents, activeAgents, toggleAgent, addAgent, removeAgent } = useChatStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    description: '',
    systemPrompt: ''
  })

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.systemPrompt) return

    addAgent(
      newAgent.name,
      newAgent.description || `Custom agent: ${newAgent.name}`,
      newAgent.systemPrompt
    )
    setNewAgent({ name: '', description: '', systemPrompt: '' })
    setIsModalOpen(false)
  }

  return (
    <div className="p-4 border-b bg-white">
      <h2 className="text-lg font-semibold mb-2">Active Agents</h2>
      <div className="flex flex-wrap gap-2">
        {agents.map((agent) => (
          <div key={agent.id} className="relative group">
            <button
              onClick={() => toggleAgent(agent.id)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-colors duration-200
                ${activeAgents.includes(agent.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {agent.name}
            </button>
            {/* Show delete button for custom agents */}
            {!['researcher', 'coder', 'critic'].includes(agent.id) && (
              <button
                onClick={() => removeAgent(agent.id)}
                className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs"
                title="Remove agent"
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        {/* Add Agent Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Agent
        </button>
      </div>

      {/* Add Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Custom Agent</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., UX Expert"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Specializes in user experience and interface design"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  System Prompt
                </label>
                <textarea
                  value={newAgent.systemPrompt}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md h-32"
                  placeholder="Define the agent's role and behavior..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAgent}
                disabled={!newAgent.name || !newAgent.systemPrompt}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 