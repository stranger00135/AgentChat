import { NextResponse } from 'next/server'
import clientPromise from '@/app/utils/mongodb'
import { ConversationSummary } from '@/app/types/chat'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('ai-chat')
    
    const conversations = await db.collection('conversations')
      .find({})
      .sort({ updatedAt: -1 })
      .project({
        id: 1,
        title: 1,
        updatedAt: 1,
        'messages.-1': 1 // Get only the last message
      })
      .toArray()
    
    const summaries: ConversationSummary[] = conversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      lastMessage: conv.messages?.[0]?.content || '',
      updatedAt: conv.updatedAt
    }))
    
    return NextResponse.json(summaries)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
} 