'use client'

import { Message } from '@/app/types/chat'
import { ChatMessage } from './ChatMessage'
import { useChatStore } from '@/app/store/chatStore'

interface InterimDiscussionProps {
  parentMessageId: string
}

export const InterimDiscussion = ({ parentMessageId }: InterimDiscussionProps) => {
  const { interimDiscussions, toggleInterimDiscussion } = useChatStore()
  const discussion = interimDiscussions[parentMessageId]

  console.log('Rendering InterimDiscussion for:', parentMessageId)
  console.log('Discussion data:', discussion)

  if (!discussion || discussion.messages.length === 0) {
    console.log('No discussion found or empty messages')
    return null
  }

  // Group messages by iteration
  const messagesByIteration: { [key: number]: Message[] } = {}
  discussion.messages.forEach(msg => {
    const iteration = msg.iterationNumber || 1
    if (!messagesByIteration[iteration]) {
      messagesByIteration[iteration] = []
    }
    messagesByIteration[iteration].push(msg)
  })

  // Sort iterations by number
  const sortedIterations = Object.entries(messagesByIteration)
    .sort(([a], [b]) => Number(a) - Number(b))

  return (
    <div className="ml-12 mt-2">
      <button
        onClick={() => toggleInterimDiscussion(parentMessageId)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-2 group"
      >
        <div className="flex items-center gap-1">
          <svg
            className={`w-4 h-4 transform transition-transform ${
              discussion.isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="font-medium">
            {discussion.isExpanded ? 'Hide' : 'Show'} Improvement Process
          </span>
        </div>
        <span className="text-xs text-gray-400 group-hover:text-gray-600">
          ({sortedIterations.length} iterations)
        </span>
      </button>

      {discussion.isExpanded && (
        <div className="space-y-6">
          {sortedIterations.map(([iteration, messages]) => {
            // First, find the initial/revised response for this iteration
            const initialResponse = messages.find(
              m => m.role === 'assistant' && !m.isDiscussion && !m.isFinal
            )

            // Then find all agent-executor conversations
            const agentIds = new Set(messages.filter(m => m.role === 'agent').map(m => m.agentId))
            const conversations = Array.from(agentIds).map(agentId => {
              // Get all messages related to this agent, including both agent feedback and executor responses
              const agentMessages = messages.filter(
                m => m.agentId === agentId && (
                  m.role === 'agent' || // Agent's feedback
                  (m.role === 'assistant' && m.isDiscussion) || // Executor's discussion response
                  (m.role === 'assistant' && !m.isDiscussion && !m.isFinal) // Executor's revised response
                )
              )
              return agentMessages
            }).filter(conversation => conversation.length > 0)

            return (
              <div 
                key={iteration} 
                className="border-l-2 border-blue-100 pl-4 py-2 space-y-4 bg-blue-50/50 rounded-r-lg"
              >
                <div className="text-xs text-gray-500 mb-2 px-2 flex justify-between items-center">
                  <span>Iteration {iteration}</span>
                  {initialResponse && (
                    <span className="text-blue-500">
                      {iteration === '1' ? 'Initial Response' : 'Revised Response'}
                    </span>
                  )}
                </div>

                {/* Display initial response */}
                {initialResponse && (
                  <div className="space-y-4">
                    <ChatMessage message={initialResponse} />
                  </div>
                )}

                {/* Display agent-executor conversations */}
                {conversations.map((conversation, idx) => (
                  <div key={idx} className="space-y-4">
                    {conversation.map((message) => (
                      <div key={message.id} className={message.isDiscussion ? 'ml-4 border-l-2 border-gray-200 pl-4' : ''}>
                        {message.role === 'agent' && (
                          <div className="text-xs text-gray-500 mb-2">
                            {message.agentName}'s feedback:
                          </div>
                        )}
                        {message.role === 'assistant' && message.isDiscussion && (
                          <div className="text-xs text-gray-500 mb-2">
                            Executor's response to {message.agentName}:
                          </div>
                        )}
                        {message.role === 'assistant' && !message.isDiscussion && !message.isFinal && (
                          <div className="text-xs text-gray-500 mb-2">
                            Executor's revised response after {message.agentName}'s feedback:
                          </div>
                        )}
                        <ChatMessage message={message} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 