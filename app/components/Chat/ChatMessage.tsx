'use client'

import { Message } from '@/app/types/chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { FC, memo } from 'react'

interface ChatMessageProps {
  message: Message
  isLoading?: boolean
}

export const ChatMessage: FC<ChatMessageProps> = memo(({ message, isLoading }) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
        <div className={`
          flex h-8 w-8 items-center justify-center rounded-full 
          ${isUser ? 'bg-blue-500' : 'bg-gray-500'}
          text-white font-semibold shrink-0
        `}>
          {isUser ? 'U' : 'A'}
        </div>
        
        <div className={`
          rounded-lg px-4 py-2
          ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}
          ${isLoading ? 'animate-pulse' : ''}
        `}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                pre: ({ node, ...props }) => (
                  <div className="relative my-2">
                    <pre {...props} className="overflow-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-800 dark:text-gray-200" />
                  </div>
                ),
                code: ({ node, inline, ...props }) => (
                  inline 
                    ? <code {...props} className="rounded bg-gray-200 px-1 py-0.5 text-sm font-mono text-gray-800" />
                    : <code {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-2 last:mb-0" />
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
})

ChatMessage.displayName = 'ChatMessage' 