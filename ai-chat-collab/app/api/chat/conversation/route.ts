import { NextResponse } from 'next/server'
import clientPromise from '@/app/utils/mongodb'
import { Conversation } from '@/app/types/chat'

export async function POST(request: Request) {
  try {
    const conversation: Conversation = await request.json()
    const client = await clientPromise
    const db = client.db('ai-chat')
    
    await db.collection('conversations').insertOne(conversation)
    
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const conversation: Conversation = await request.json()
    const client = await clientPromise
    const db = client.db('ai-chat')
    
    await db.collection('conversations').updateOne(
      { id: conversation.id },
      { $set: conversation }
    )
    
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('ai-chat')
    
    await db.collection('conversations').deleteOne({ id })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
} 