import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Convert messages to Anthropic format if needed, or rely on frontend to send correct format.
    // For simplicity, we assume the frontend sends { role: 'user' | 'assistant', content: string }[]
    // tailored for Anthropic mainly (though 'system' role is handled differently in some SDK versions, 
    // for this simple case we'll just pass user/assistant messages).
    
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6', // or claude-3-sonnet-20240229, etc.
      max_tokens: 1024,
      messages: messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    return NextResponse.json({ 
      role: response.role, 
      content: response.content[0].type === 'text' ? response.content[0].text : '' 
    });
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return NextResponse.json({ error: 'Failed to fetch response' }, { status: 500 });
  }
}
