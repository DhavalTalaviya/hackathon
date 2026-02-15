import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const getAction = async (messages: any[]) => {
  const systemPrompt = `You are an AI assistant that identifies the intent and necessary action from a user conversation. 
  Your goal is to analyze the user's request and determine the specific action that needs to be taken to fulfill it. 
  Output ONLY the action description in a clear, concise manner. Do not include any other text or preamble.`;

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

    return response.content[0].type === 'text' ? response.content[0].text : 'No action determined.';
  } catch (error) {
    console.error('Error in ActionAgent:', error);
    return 'Error determining action.';
  }
};
