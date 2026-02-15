import Anthropic from '@anthropic-ai/sdk';
import Dictionary from 'better-sqlite3';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const db = new Dictionary('local.db');

export const getDataAnalysis = async (query: string) => {
  const schema = `
    Tables:
    - bookings (id, title, date, time, status, customer)
    - calls (id, date, duration, "from", "to", type)
    - costs (id, category, amount, date, description)
  `;

  const systemPrompt = `You are an expert Data Analyst and SQL developer.
  Your goal is to answer the user's question by querying the database.
  
  Database Schema:
  ${schema}
  
  Rules:
  1. Generate a valid SQL query (SQLite compatible) to answer the question.
  2. Return ONLY the SQL query. Do not include markdown formatting or explanations.
  3. If the user asks for a visualization, select the relevant data so a dashboard can be built later.
  4. When using UNION or UNION ALL, do NOT use ORDER BY inside the sub-queries. Only use ORDER BY at the very end if needed on the combined result.
  
  Example Input: "How many confirmed bookings do we have?"
  Example Output: SELECT count(*) as count FROM bookings WHERE status = 'confirmed';
  `;

  try {
    // 1. Generate SQL
    const sqlResponse = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: query }],
    });

    const sql = sqlResponse.content[0].type === 'text' ? sqlResponse.content[0].text.trim() : '';
    console.log('Generated SQL:', sql);

    if (!sql) return { error: 'Failed to generate SQL' };

    // 2. Execute SQL
    const stmt = db.prepare(sql);
    const result = stmt.all();

    return {
      sql,
      result
    };

  } catch (error) {
    console.error('Error in DataAnalystAgent:', error);
    return { error: 'Analysis failed', details: error };
  }
};
