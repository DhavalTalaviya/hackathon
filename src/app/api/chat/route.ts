import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAction } from '@/lib/agents/ActionAgent';
import { getResponse } from '@/lib/agents/ResponseAgent';
import { getDataAnalysis } from '@/lib/agents/DataAnalystAgent';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Agent 1: Determine Action
    const action = await getAction(messages);
    console.log('Action determined:', action);

    // Logic to route based on action type
    // If action is about analyzing data, we divert to DataAnalyst -> CodeWriter
    
    if (action.toLowerCase().includes('analyze') || 
        action.toLowerCase().includes('data') || 
        action.toLowerCase().includes('report') || 
        action.toLowerCase().includes('count') ||
        action.toLowerCase().includes('query') ||
        action.toLowerCase().includes('calculate') ||
        action.toLowerCase().includes('show') ||
        action.toLowerCase().includes('get')
      ) {
      console.log('Routing to Data Analyst (Multi-Query)...');
      const analysisResult = await getDataAnalysis(messages[messages.length - 1].content);

      if (analysisResult.error) {
        return NextResponse.json({ role: 'assistant', content: "I couldn't analyze the data: " + analysisResult.error });
      }

      if (!analysisResult.configString) {
        return NextResponse.json({ role: 'assistant', content: "I couldn't generate the dashboard configuration." });
      }

      try {
        const componentDir = path.join(process.cwd(), 'src', 'components', 'generated');
        
        if (!fs.existsSync(componentDir)) {
          fs.mkdirSync(componentDir, { recursive: true });
        }

        // Save the JSON configuration (with embedded data arrays per chart)
        const configPath = path.join(componentDir, 'dashboardConfig.json');
        fs.writeFileSync(configPath, analysisResult.configString);
        console.log(`Dashboard config saved to ${configPath}`);

        // We no longer need to save an external dashboardData.json since the config holds everything internally
      } catch (err) {
        console.error('Error writing dashboard files:', err);
      }
      
      // Return a special structured response for the frontend
      return NextResponse.json({ 
        role: 'assistant', 
        content: "I have analyzed the data and generated a customized dynamic dashboard for you.",
        componentCode: analysisResult.configString,
        dataviz: true
      });
    }

    // Default: Agent 2: Execute Action and Respond (Conversational)
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
