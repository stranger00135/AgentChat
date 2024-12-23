import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Agent, Message } from '@/app/types/chat'
import { v4 as uuidv4 } from 'uuid'

const EXECUTOR_PROMPT = `You are a task executor responsible for providing answers to users.
Your role is to:
1. Generate initial responses to user queries
2. Engage in dialogue with specialized AI agents to improve your response
3. Consider each agent's feedback carefully
4. Explain your thought process when revising your response
5. Provide clear, well-structured final answers

Always maintain context from the chat history when responding.`

const AGENT_REVIEW_PROMPT = `You are reviewing the executor's response to a user's question.
Based on your specialized role, engage in a constructive dialogue with the executor.
Consider both the user's question and the chat history for context.
Format your feedback as:
- Strengths: [what's good about the current response]
- Areas for Improvement: [specific suggestions]
- Questions for Executor: [if you need clarification]
- Additional Considerations: [any other relevant points]`

export async function POST(request: Request) {
  try {
    const { message, messageId, apiKey, activeAgents, agents, chatHistory = [] } = await request.json()
    console.log('Received request:', { 
      message, 
      messageId,
      activeAgents, 
      agentCount: agents.length,
      historyLength: chatHistory.length 
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(activeAgents)) {
      return NextResponse.json(
        { error: 'activeAgents must be an array' },
        { status: 400 }
      )
    }

    if (!Array.isArray(agents)) {
      return NextResponse.json(
        { error: 'agents must be an array' },
        { status: 400 }
      )
    }

    const openai = new OpenAI({ apiKey })
    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // Helper function to send a message through the stream
    const sendMessage = async (message: any) => {
      const data = JSON.stringify({ type: 'message', data: message }) + '\n'
      await writer.write(encoder.encode(data))
    }

    // Process messages in background
    processMessages(openai, {
      message,
      messageId,
      chatHistory,
      activeAgents,
      agents,
      sendMessage,
      writer
    }).catch(error => {
      console.error('Error in processMessages:', error)
    })

    // Return the response stream immediately
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process message' },
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
    sendMessage,
    writer
  }: {
    message: string
    messageId: string
    chatHistory: any[]
    activeAgents: string[]
    agents: Agent[]
    sendMessage: (message: any) => Promise<void>
    writer: WritableStreamDefaultWriter<Uint8Array>
  }
) {
  try {
    // Format chat history for context
    const historyContext = chatHistory
      .map((msg: Message) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n')

    // Step 1: Get initial executor response
    console.log('Getting initial executor response')
    const initialExecution = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: EXECUTOR_PROMPT
        },
        {
          role: "user",
          content: `Chat History:\n${historyContext}\n\nCurrent Question: ${message}\n\nPlease provide your initial response.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    let currentResponse = initialExecution.choices[0]?.message?.content
    if (!currentResponse) {
      throw new Error('Failed to get initial response from OpenAI')
    }

    // Send initial response
    await sendMessage({
      id: uuidv4(),
      role: 'assistant',
      content: currentResponse,
      timestamp: new Date().toISOString(),
      isInterim: true,
      parentMessageId: messageId,
      iterationNumber: 1
    })

    // Step 2: Sequential agent reviews and revisions
    for (let i = 0; i < activeAgents.length; i++) {
      const agentId = activeAgents[i]
      const agent = agents.find((a: Agent) => a.id === agentId)
      if (!agent) continue

      const currentIteration = i + 1
      console.log(`Processing agent review for iteration ${currentIteration}:`, agent.name)

      // Step 2a: Get agent's feedback on the current response
      console.log(`Getting feedback from ${agent.name}`)
      const agentReview = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `${agent.systemPrompt}\n\n${AGENT_REVIEW_PROMPT}`
          },
          {
            role: "user",
            content: `Chat History:\n${historyContext}\n\nCurrent Question: ${message}\n\nExecutor's Current Response: ${currentResponse}\n\nPlease review and provide feedback.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const feedback = agentReview.choices[0]?.message?.content || 'No feedback provided'
      
      // Send agent's feedback
      await sendMessage({
        id: uuidv4(),
        role: 'agent',
        content: feedback,
        agentId: agent.id,
        agentName: agent.name,
        timestamp: new Date().toISOString(),
        isInterim: true,
        isDiscussion: true,
        parentMessageId: messageId,
        iterationNumber: currentIteration
      })

      // Step 2b: Get executor's response to this specific agent's feedback
      console.log(`Getting executor's response to ${agent.name}'s feedback`)
      const executorDiscussion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `${EXECUTOR_PROMPT}\n\nYou are currently in a discussion with the ${agent.name}. Focus on addressing their specific feedback and explaining your thoughts clearly. Be collaborative and thoughtful in your response.`
          },
          {
            role: "user",
            content: `Chat History:\n${historyContext}\n\nCurrent Question: ${message}\n\nYour current response: ${currentResponse}\n\nThe ${agent.name} provided this feedback:\n\n${feedback}\n\nPlease respond to their feedback, explaining whether you agree or disagree with their suggestions and why. Be specific about how you plan to incorporate their feedback.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const executorResponse = executorDiscussion.choices[0]?.message?.content || 'No response generated'
      
      // Send executor's discussion response
      await sendMessage({
        id: uuidv4(),
        role: 'assistant',
        content: executorResponse,
        timestamp: new Date().toISOString(),
        isInterim: true,
        isDiscussion: true,
        parentMessageId: messageId,
        iterationNumber: currentIteration,
        agentId: agent.id,
        agentName: agent.name
      })

      // Step 2c: Get executor's revised response based on this agent's feedback
      console.log(`Getting executor's revised response after ${agent.name}'s feedback`)
      const revision = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `${EXECUTOR_PROMPT}\n\nYou are revising your response based on feedback from the ${agent.name}. Focus on incorporating their specific suggestions while maintaining clarity and accuracy.`
          },
          {
            role: "user",
            content: `Chat History:\n${historyContext}\n\nCurrent Question: ${message}\n\nYour current response: ${currentResponse}\n\nThe ${agent.name} provided this feedback:\n\n${feedback}\n\nYour discussion with them:\n\n${executorResponse}\n\nPlease provide your revised response, incorporating the feedback from this specific agent.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      // Update the current response with the revision
      currentResponse = revision.choices[0]?.message?.content || 'No revision generated'

      // Send the revised response as an interim message
      await sendMessage({
        id: uuidv4(),
        role: 'assistant',
        content: `Based on ${agent.name}'s feedback, I will revise my response:\n\n${currentResponse}`,
        timestamp: new Date().toISOString(),
        isInterim: true,
        isDiscussion: true,
        parentMessageId: messageId,
        iterationNumber: currentIteration,
        agentId: agent.id,
        agentName: agent.name
      })

      // Add a small delay before moving to the next agent
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Step 3: Send final response (the last revision becomes the final response)
    console.log('Sending final response')
    await sendMessage({
      id: uuidv4(),
      role: 'assistant',
      content: currentResponse,
      timestamp: new Date().toISOString(),
      isFinal: true,
      parentMessageId: messageId
    })

    await writer.close()
  } catch (error) {
    console.error('Error in processMessages:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await sendMessage({
      id: uuidv4(),
      role: 'system',
      content: `Error: ${errorMessage}`,
      timestamp: new Date().toISOString(),
      isError: true
    })
    await writer.close()
  }
} 