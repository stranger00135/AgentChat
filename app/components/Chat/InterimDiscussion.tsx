'use client'

import { Message } from '@/app/types/chat'
import { ChatMessage } from './ChatMessage'
import { useChatStore } from '@/app/store/chatStore'

interface InterimDiscussionProps {
  parentMessageId: string
}

export const InterimDiscussion = ({ parentMessageId }: InterimDiscussionProps) => {
  const { conversationThreads, toggleThread } = useChatStore()
  const thread = conversationThreads[parentMessageId]

  if (!thread || !thread.messages.length) {
    return null
  }

  // Filter out final responses and duplicates
  const uniqueMessages = thread.messages.reduce((acc: Message[], msg) => {
    // Skip final responses
    if (msg.isFinal) {
      return acc
    }
    
    // Skip duplicates
    const isDuplicate = acc.some(m => 
      m.content === msg.content && 
      m.role === msg.role && 
      m.iterationNumber === msg.iterationNumber &&
      m.isDiscussion === msg.isDiscussion
    )
    if (isDuplicate) {
      return acc
    }
    return [...acc, msg]
  }, [])

  if (uniqueMessages.length === 0) {
    return null
  }

  // Group messages by iteration
  const messagesByIteration: { [key: string]: Message[] } = {}
  uniqueMessages.forEach(msg => {
    const iteration = String(msg.iterationNumber || 1)
    if (!messagesByIteration[iteration]) {
      messagesByIteration[iteration] = []
    }
    messagesByIteration[iteration].push(msg)
  })

  // Sort iterations by number
  const sortedIterations = Object.entries(messagesByIteration)
    .sort(([a, b]) => Number(a) - Number(b))

  return (
    <div className="ml-12 mt-2">
      <button
        onClick={() => toggleThread(parentMessageId)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-2 group"
      >
        <div className="flex items-center gap-1">
          <svg
            className={`w-4 h-4 transform transition-transform ${
              thread.isExpanded ? 'rotate-90' : ''
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
            {thread.isExpanded ? 'Hide' : 'Show'} Agent Discussion
          </span>
        </div>
        <span className="text-xs text-gray-400 group-hover:text-gray-600">
          ({uniqueMessages.length} messages)
        </span>
      </button>

      {thread.isExpanded && (
        <div className="space-y-4">
          {sortedIterations.map(([iteration, messages]) => {
            const iterationNum = Number(iteration)
            return (
              <div 
                key={iteration}
                className="border-l-2 border-blue-100 pl-4 py-2 space-y-4 bg-blue-50/50 rounded-r-lg"
              >
                <div className="text-xs text-gray-500 mb-2 px-2">
                  Iteration {iteration}
                </div>
                {messages.map((message) => {
                  const isInitialSolution = iterationNum === 1 && message.role === 'assistant' && !message.isDiscussion && !message.isFinal
                  return (
                    <div key={message.id} className={message.isDiscussion ? 'ml-4 border-l-2 border-gray-200 pl-4' : ''}>
                      <div className="text-xs text-gray-500 mb-2">
                        {message.role === 'agent' && `${message.agentName}'s feedback:`}
                        {message.role === 'assistant' && message.isDiscussion && 
                          `Executor's response to ${message.responseToAgent ? messages.find(m => m.agentId === message.responseToAgent)?.agentName : 'agent'}:`}
                        {message.role === 'assistant' && !message.isDiscussion && !message.isFinal &&
                          `${isInitialSolution ? "Executor's initial response:" : "Executor's revised response:"}`}
                      </div>
                      <ChatMessage message={message} />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 