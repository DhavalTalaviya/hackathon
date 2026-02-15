import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const getResponse = async (messages: any[], action: string) => {
  const systemPrompt = `You are an AI assistant. You will be given a conversation history and a planned action that has been determined to help the user.
  
  THE PLANNED ACTION IS: "${action}"

  Your goal is to execute this action and provide a helpful, natural response to the user. 
  Use the planned action as your guide for what to say or do.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    return response.content[0].type === 'text' ? response.content[0].text : 'No response generated.';
  } catch (error) {
    console.error('Error in ResponseAgent:', error);
    return 'Error generating response.';
  }
};
