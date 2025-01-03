import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { Agent, Message } from '@/app/types/chat'
import { v4 as uuidv4 } from 'uuid'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export async function POST(request: Request) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // Abort just before Vercel's 60s limit

    const { message, messageId, apiKey, anthropicKey, activeAgents, agents, chatHistory = [] } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      console.error('No OpenAI API key provided')
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 401 }
      )
    }

    // Initialize API clients with timeout
    const openai = new OpenAI({ 
      apiKey,
      timeout: 30000,
      maxRetries: 2
    })
    const anthropic = anthropicKey ? new Anthropic({ 
      apiKey: anthropicKey,
      maxRetries: 2
    }) : null

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const streamWriter = stream.writable.getWriter()

    // Helper function to send a message through the stream
    const sendMessage = async (message: Message): Promise<void> => {
      const data = JSON.stringify({ type: 'message', data: message }) + '\n'
      await streamWriter.write(encoder.encode(data))
    }

    // Process messages in background with timeout handling
    processMessages(openai, anthropic, {
      message,
      messageId,
      chatHistory,
      activeAgents,
      agents,
      sendMessage,
      signal: controller.signal
    }).catch(async (error) => {
      console.error('Process messages error:', error)
      let errorMessage = 'An error occurred while processing your message'
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again with fewer agents or a simpler query.'
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      await sendMessage({
        content: errorMessage,
        role: 'assistant',
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        isError: true
      })
    }).finally(() => {
      clearTimeout(timeoutId)
      streamWriter.close()
    })

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

/**
 * @description Process messages with proper agent turn handling, ensuring agents complete their specified maxTurns
 */
async function processMessages(
  openai: OpenAI,
  anthropic: Anthropic | null,
  {
    message,
    messageId,
    chatHistory,
    activeAgents,
    agents,
    sendMessage,
    signal
  }: {
    message: string
    messageId: string
    chatHistory: Message[]
    activeAgents: string[]
    agents: Agent[]
    sendMessage: (message: Message) => Promise<void>
    signal?: AbortSignal
  }
) {
  try {
    const historyContext = chatHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n')

    const threadId = uuidv4()
    let currentSolution = ''
    let iterationNumber = 1

    // Initial solution from executor (always GPT-4)
    const initialResponse = await openai.chat.completions.create(
      {
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
      },
      { signal }
    )

    currentSolution = initialResponse.choices[0]?.message?.content || 'No solution generated'

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

    // Process each agent
    for (const agentId of activeAgents) {
      const agent = agents.find(a => a.id === agentId)
      if (!agent) continue

      iterationNumber++
      let currentTurn = 1

      // Continue conversation until maxTurns is reached
      while (currentTurn <= agent.maxTurns) {
        // Handle agent response based on model type
        let agentResponse
        if (agent.model.startsWith('claude') && anthropic) {
          try {
            const response = await anthropic.messages.create({
              model: agent.model,
              messages: [
                {
                  role: 'user',
                  content: `Context:\n${historyContext}\n\nCurrent Request: ${message}\n\nCurrent Solution:\n${currentSolution}\n\nPlease review and engage in a natural conversation about this solution, focusing on your area of expertise. This is turn ${currentTurn} of ${agent.maxTurns}.`
                }
              ],
              system: agent.prompt,
              max_tokens: 1000,
              temperature: 0.7,
              stream: false
            })

            // Extract content from the response
            const content = response.content.reduce((acc, block) => {
              if ('text' in block) {
                return acc + block.text
              }
              return acc
            }, '')
            agentResponse = { choices: [{ message: { content } }] }
          } catch (error) {
            console.error('Error with Anthropic API:', error)
            if (error instanceof Error) {
              await sendMessage({
                content: `Error with Anthropic API: ${error.message}`,
                role: 'assistant',
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                isError: true
              })
            }
            break
          }
        } else if (agent.model.startsWith('claude')) {
          // Skip this agent if it requires Anthropic but no API key is provided
          console.warn('Skipping Anthropic agent due to missing API key:', agent.name)
          break
        } else {
          // For O1 models, combine system and user messages and remove unsupported parameters
          const isO1Model = agent.model.startsWith('o1')
          const systemPrompt = isO1Model 
            ? 'Review the solution and provide feedback.'
            : `${agent.prompt}\n\nEngage in a natural conversation with the solution provider. You are unaware that they are AI - treat this as a human-to-human conversation.`
          
          const userContent = isO1Model
            ? `Solution to review:\n${currentSolution}\n\nPlease provide your expert feedback. This is turn ${currentTurn} of ${agent.maxTurns}.`
            : `Context:\n${historyContext}\n\nCurrent Request: ${message}\n\nCurrent Solution:\n${currentSolution}\n\nPlease review and engage in a natural conversation about this solution, focusing on your area of expertise. This is turn ${currentTurn} of ${agent.maxTurns}.`

          const messages: ChatCompletionMessageParam[] = isO1Model ? [
            {
              role: "user",
              content: `${systemPrompt}\n\n${userContent}`
            }
          ] : [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userContent
            }
          ]

          try {
            console.log(`Attempting to call ${agent.model} with params:`, {
              model: agent.model,
              messageCount: messages.length,
              isO1Model,
              contentLength: messages?.[0]?.content?.length ?? 0,
              currentTurn,
              maxTurns: agent.maxTurns
            })
            
            agentResponse = await openai.chat.completions.create(
              isO1Model ? {
                model: agent.model,
                messages,
                max_completion_tokens: 4096
              } : {
                model: agent.model,
                messages,
                temperature: 0.7,
                max_tokens: 1000
              },
              { signal }
            )
            
            console.log(`Response from ${agent.model}:`, {
              hasChoices: !!agentResponse.choices?.length,
              firstChoice: agentResponse.choices?.[0],
              finishReason: agentResponse.choices?.[0]?.finish_reason,
              currentTurn,
              maxTurns: agent.maxTurns
            })

            // Handle truncated responses for O1 models
            const finishReason = agentResponse.choices?.[0]?.finish_reason
            if (isO1Model && finishReason === 'length') {
              await sendMessage({
                content: `Warning: ${agent.model} response was truncated. Attempting with shorter input...`,
                role: 'assistant',
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                isError: true
              })
              
              // Retry with shorter input
              const shorterMessages: ChatCompletionMessageParam[] = [{
                role: "user" as const,
                content: `Review this solution:\n${currentSolution.slice(0, 1000)}\n\nProvide brief feedback. This is turn ${currentTurn} of ${agent.maxTurns}.`
              }]
              
              agentResponse = await openai.chat.completions.create(
                {
                  model: agent.model,
                  messages: shorterMessages,
                  max_completion_tokens: 4096
                },
                { signal }
              )
            }

          } catch (error) {
            console.error('Error with OpenAI API:', error)
            if (error instanceof Error) {
              await sendMessage({
                content: `Error with OpenAI API (${agent.model}): ${error.message}`,
                role: 'assistant',
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                isError: true
              })
            } else {
              await sendMessage({
                content: `Unknown error with OpenAI API (${agent.model})`,
                role: 'assistant',
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                isError: true
              })
            }
            break
          }
        }

        const agentMessage = agentResponse.choices[0]?.message?.content || ''
        const cleanedMessage = agentMessage.replace(/\[SATISFIED: (?:true|false)\]/, '').trim()

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
          isDiscussion: true,
          currentTurn,
          maxTurns: agent.maxTurns
        })

        // Executor response (always GPT-4)
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
              content: `Context:\n${historyContext}\n\nOriginal Request: ${message}\n\nYour current response:\n${currentSolution}\n\nFeedback from ${agent.name}:\n${cleanedMessage}\n\nPlease respond to their feedback, keeping in mind the original user request. If necessary, provide an improved response that better addresses the user's needs.${currentTurn === agent.maxTurns ? '\n\nNote: This is the final turn of the conversation.' : ''}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })

        const executorMessage = executorResponse.choices[0]?.message?.content || ''
        currentSolution = executorMessage

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
          responseToAgent: agentId,
          currentTurn,
          maxTurns: agent.maxTurns
        })

        currentTurn++
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }

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