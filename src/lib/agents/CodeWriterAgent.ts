/* eslint-disable @typescript-eslint/no-explicit-any */
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const getDashboardCode = async (userQuery: string, dataAnalysis: any) => {
  const fullData = dataAnalysis.result || [];
  
  // OPTIMIZATION: Context for LLM (Schema + Sample only)
  const dataContext = {
    sample: fullData.slice(0, 5),
    totalCount: fullData.length,
    columns: fullData.length > 0 ? Object.keys(fullData[0]) : [],
  };

  const systemPrompt = `You are an expert React/Recharts developer.
  Goal: Generate ONLY chart/visualization components. The dashboard shell (header, KPI cards, filters) is already built separately.
  
  Input: "${userQuery}"
  Data Schema & Sample: ${JSON.stringify(dataContext)}
  
  Rules:
  1. Component Name: 'ChartPanel' (default export).
  2. Props signature: { data: any[]; allCategories: string[]; colors: string[] }
  3. "use client"; is required at the top.
  4. Use 'recharts' (ResponsiveContainer, BarChart, PieChart, AreaChart, LineChart, RadarChart, etc.) and 'lucide-react' for icons.
  5. Return ONLY chart cards in a grid layout. Each chart should be wrapped in a styled card div:
     <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
  6. Use the 'colors' prop for chart colors (array of hex strings).
  7. Use the 'data' prop directly — do NOT hardcode data, do NOT declare a const data variable.
  8. Use the 'allCategories' prop for category labels if applicable.
  9. Create multiple varied charts (bar, pie, area, line, radar) based on the data.
  10. Wrap charts in a grid: <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  11. Style tooltips with dark theme: bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl
  12. Return ONLY code. No markdown. No backticks.
  `;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Generate the chart panel component.' }],
    });

    // Clean up response if it contains markdown code blocks
    let code = response.content[0].type === 'text' ? response.content[0].text : '';
    code = code.replace(/```tsx?/g, '').replace(/```/g, '').trim();
    
    return { code, data: fullData };

  } catch (error) {
    console.error('Error in CodeWriterAgent:', error);
    return { code: '// Error generating code', data: fullData };
  }
};
