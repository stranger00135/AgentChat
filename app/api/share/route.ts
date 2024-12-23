import { NextResponse } from 'next/server';
import clientPromise from '@/app/utils/mongodb';
import { ShareableContent } from '@/app/types/chat';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { type, content } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('ai-chat-collab');
    
    const shareableContent: ShareableContent = {
      id: uuidv4(),
      type,
      content,
      createdAt: Date.now(),
    };
    
    await db.collection('shared-content').insertOne(shareableContent);
    
    return NextResponse.json({ shareId: shareableContent.id });
  } catch (error) {
    console.error('Share API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shareId = searchParams.get('id');
    
    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('ai-chat-collab');
    
    const content = await db.collection('shared-content').findOne({ id: shareId });
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Share API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 