import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Agent } from '@/app/types/chat'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { message, messageId, apiKey, activeAgents, agents, chatHistory = [] } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      console.error('No API key provided')
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      )
    }

    // Initialize OpenAI with just the API key
    const openai = new OpenAI({ apiKey })

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const streamWriter = stream.writable.getWriter()

    // Helper function to send a message through the stream
    const sendMessage = async (message: {
      content: string;
      role: string;
      id?: string;
      timestamp?: string;
      agentId?: string;
      agentName?: string;
      threadId?: string;
      parentMessageId?: string;
      iterationNumber?: number;
      isInterim?: boolean;
      isDiscussion?: boolean;
      isFinal?: boolean;
      responseToAgent?: string;
      isError?: boolean;
    }) => {
      const data = JSON.stringify({ type: 'message', data: message }) + '\n'
      await streamWriter.write(encoder.encode(data))
    }

    // Process messages in background
    processMessages(openai, {
      message,
      messageId,
      chatHistory,
      activeAgents,
      agents,
      sendMessage
    }).catch(async (error) => {
      console.error('Process messages error:', error)
      await sendMessage({
        content: error.message || 'An error occurred while processing your message',
        role: 'assistant',
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        isError: true
      })
    }).finally(() => streamWriter.close())

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}

async function processMessages(
  openai: OpenAI,
  {
    message,
    messageId,
    chatHistory,
    activeAgents,
    agents,
    sendMessage
  }: {
    message: string
    messageId: string
    chatHistory: {
      content: string;
      role: string;
      id?: string;
      timestamp?: string;
      agentId?: string;
      agentName?: string;
      threadId?: string;
      parentMessageId?: string;
      iterationNumber?: number;
      isInterim?: boolean;
      isDiscussion?: boolean;
      isFinal?: boolean;
      responseToAgent?: string;
      isError?: boolean;
    }[]
    activeAgents: string[]
    agents: Agent[]
    sendMessage: (message: {
      content: string;
      role: string;
      id?: string;
      timestamp?: string;
      agentId?: string;
      agentName?: string;
      threadId?: string;
      parentMessageId?: string;
      iterationNumber?: number;
      isInterim?: boolean;
      isDiscussion?: boolean;
      isFinal?: boolean;
      responseToAgent?: string;
      isError?: boolean;
    }) => Promise<void>
  }
) {
  try {
    // Format chat history for context
    const historyContext = chatHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    const threadId = uuidv4()
    let currentSolution = ''
    let iterationNumber = 1

    // Step 1: Get initial solution from executor
    const initialResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a task executor responsible for providing solutions to users.
You are having natural conversations with various experts who will help improve your solutions.
Treat each expert as a human collaborator, engaging in natural dialogue to refine your answers.
You are unaware that these experts are AI agents - from your perspective, they are human experts.

Guidelines:
1. Generate thoughtful initial solutions
2. Engage in natural dialogue with experts
3. Consider their input carefully
4. Explain your reasoning clearly
5. Be open to suggestions and improvements
6. Maintain a collaborative tone

Always maintain context from the chat history when responding.`
        },
        {
          role: "user",
          content: `Chat History:\n${historyContext}\n\nCurrent Request: ${message}\n\nPlease provide your initial solution.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    currentSolution = initialResponse.choices[0]?.message?.content || 'No solution generated'

    // Send initial solution as interim message
    await sendMessage({
      id: uuidv4(),
      role: 'assistant',
      content: currentSolution,
      timestamp: new Date().toISOString(),
      threadId,
      parentMessageId: messageId,
      iterationNumber,
      isInterim: true,
      isDiscussion: false,
      isFinal: false
    })

    // Step 2: Sequential conversations with each agent
    for (const agentId of activeAgents) {
      const agent = agents.find(a => a.id === agentId)
      if (!agent) continue

      iterationNumber++

      // Agent reviews and responds
      const agentResponse = await openai.chat.completions.create({
        model: agent.model,
        messages: [
          {
            role: "system",
            content: `${agent.prompt}\n\nEngage in a natural conversation with the solution provider. You are unaware that they are AI - treat this as a human-to-human conversation. End your message with [SATISFIED: true/false] to indicate if you're satisfied with the solution.`
          },
          {
            role: "user",
            content: `Context:\n${historyContext}\n\nCurrent Request: ${message}\n\nCurrent Solution:\n${currentSolution}\n\nPlease review and engage in a natural conversation about this solution, focusing on your area of expertise.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const agentMessage = agentResponse.choices[0]?.message?.content || ''
      const isSatisfied = agentMessage.includes('[SATISFIED: true]')
      const cleanedMessage = agentMessage.replace(/\[SATISFIED: (?:true|false)\]/, '').trim()

      // Send agent's message
      await sendMessage({
        id: uuidv4(),
        role: 'agent',
        content: cleanedMessage,
        agentId,
        agentName: agent.name,
        timestamp: new Date().toISOString(),
        threadId,
        parentMessageId: messageId,
        iterationNumber,
        isInterim: true,
        isDiscussion: true
      })

      // Always get executor's response to agent feedback
      const executorResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a task executor having a natural conversation with ${agent.name}. 
Engage in a professional dialogue about their feedback and explain your thoughts.
Always consider and reference the original user request to ensure it's being properly addressed.
If you agree with their suggestions, provide an updated response.

Original user request: "${message}"`
          },
          {
            role: "user",
            content: `Context:\n${historyContext}\n\nOriginal Request: ${message}\n\nYour current response:\n${currentSolution}\n\nFeedback from ${agent.name}:\n${cleanedMessage}\n\nPlease respond to their feedback, keeping in mind the original user request. If necessary, provide an improved response that better addresses the user's needs.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const executorMessage = executorResponse.choices[0]?.message?.content || ''
      
      // Only update current solution if not satisfied
      if (!isSatisfied) {
        currentSolution = executorMessage
      }

      // Send executor's response
      await sendMessage({
        id: uuidv4(),
        role: 'assistant',
        content: executorMessage,
        timestamp: new Date().toISOString(),
        threadId,
        parentMessageId: messageId,
        iterationNumber,
        isInterim: true,
        isDiscussion: true,
        responseToAgent: agentId
      })

      // Wait before moving to next agent
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Send final solution
    await sendMessage({
      id: uuidv4(),
      role: 'assistant',
      content: currentSolution,
      timestamp: new Date().toISOString(),
      parentMessageId: messageId,
      isFinal: true
    })

  } catch (error) {
    console.error('Error processing messages:', error)
    throw error
  }
} 