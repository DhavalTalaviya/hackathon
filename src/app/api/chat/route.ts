import { NextRequest, NextResponse } from 'next/server';
import { getAction } from '@/lib/agents/ActionAgent';
import { getResponse } from '@/lib/agents/ResponseAgent';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Agent 1: Determine Action
    const action = await getAction(messages);
    console.log('Action determined:', action);

    // Agent 2: Execute Action and Respond
    const responseContent = await getResponse(messages, action);

    return NextResponse.json({ 
      role: 'assistant', 
      content: responseContent
    });
  } catch (error) {
    console.error('Error calling Agents:', error);
    return NextResponse.json({ error: 'Failed to fetch response' }, { status: 500 });
  }
}

