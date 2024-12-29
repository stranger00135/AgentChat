'use client'

import { useState } from 'react'
import { useChatStore } from '@/app/store/chatStore'
import { Agent } from '@/app/types/chat'

const MODEL_OPTIONS = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-0125-preview', label: 'GPT-4 Turbo' },
  { value: 'gpt-4-1106-preview', label: 'GPT-4 Turbo (Previous)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'o1', label: 'O1 (Reasoning)' },
  { value: 'o1-mini', label: 'O1 Mini (Reasoning)' },
  { value: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet' },
]

export const AgentList = () => {
  const { agents, activeAgents, toggleAgent, addAgent, removeAgent } = useChatStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    description: '',
    prompt: '',
    model: 'gpt-4',
    maxTurns: 1
  })

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.prompt) return

    addAgent(
      newAgent.name,
      newAgent.description || `Custom agent: ${newAgent.name}`,
      newAgent.prompt,
      newAgent.model,
      Math.max(1, Math.min(10, Number(newAgent.maxTurns) || 1))
    )
    setNewAgent({ name: '', description: '', prompt: '', model: 'gpt-4', maxTurns: 1 })
    setIsModalOpen(false)
  }

  const handleMaxTurnsChange = (value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue)) {
      setNewAgent(prev => ({
        ...prev,
        maxTurns: Math.max(1, Math.min(10, numValue))
      }))
    } else {
      setNewAgent(prev => ({
        ...prev,
        maxTurns: 1
      }))
    }
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
              title={`${agent.name}\n${agent.description}`}
            >
              {agent.name}
            </button>
            {/* Show delete button for custom agents */}
            {!['technical-expert', 'ux-specialist', 'security-expert'].includes(agent.id) && (
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
                  placeholder="e.g., Performance Expert"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Specializes in performance optimization"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt
                </label>
                <textarea
                  value={newAgent.prompt}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, prompt: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md h-32"
                  placeholder="Define how the agent should engage in conversation..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <select
                    value={newAgent.model}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {MODEL_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Turns
                  </label>
                  <input
                    type="number"
                    value={newAgent.maxTurns}
                    onChange={(e) => handleMaxTurnsChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    min="1"
                    max="10"
                  />
                </div>
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
                disabled={!newAgent.name || !newAgent.prompt}
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