import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const getDashboardCode = async (userQuery: string, dataAnalysis: any) => {
  const fullData = dataAnalysis.result || [];
  
  // OPTIMIZATION: Context for LLM (Schema + Sample only)
  const dataContext = {
    sample: fullData.slice(0, 5),
    note: `Showing 5 of ${fullData.length} items. Use __DATA_JSON__ placeholder for the full array.`
  };

  const systemPrompt = `You are an expert React/Recharts developer.
  Goal: varied, beautiful dashboard component. "use client"; required.
  
  Input: "${userQuery}"
  Data: ${JSON.stringify(dataContext)}
  
  Rules:
  1. Component Name: 'DashboardComponent' (default export).
  2. No props.
  3. CONST DATA DECLARATION MUST BE EXACTLY:
     const data = __DATA_JSON__;
  4. Use 'recharts' (ResponsiveContainer, etc) and 'lucide-react'.
  5. Return ONLY code. No markdown.
  `;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Generate code.' }],
    });

    // Clean up response if it contains markdown code blocks
    let code = response.content[0].type === 'text' ? response.content[0].text : '';
    code = code.replace(/```tsx?/g, '').replace(/```/g, '').trim();

    // INJECT DATA: Replace the placeholder with the actual full dataset
    // We use JSON.stringify to ensure it's a valid JS object/array literal
    code = code.replace('__DATA_JSON__', JSON.stringify(fullData));
    
    return code;

  } catch (error) {
    console.error('Error in CodeWriterAgent:', error);
    return '// Error generating code';
  }
};
