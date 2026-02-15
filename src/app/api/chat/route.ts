import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAction } from '@/lib/agents/ActionAgent';
import { getResponse } from '@/lib/agents/ResponseAgent';
import { getDataAnalysis } from '@/lib/agents/DataAnalystAgent';
import { getDashboardCode } from '@/lib/agents/CodeWriterAgent';

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
      console.log('Routing to Data Analyst...');
      const analysisResult = await getDataAnalysis(messages[messages.length - 1].content);
      console.log('Analysis Result:', analysisResult);

      if (analysisResult.error) {
        return NextResponse.json({ role: 'assistant', content: "I couldn't analyze the data: " + analysisResult.error });
      }

      console.log('Routing to Code Writer...');
      const code = await getDashboardCode(messages[messages.length - 1].content, analysisResult);

      // Save the component to disk
      try {
        const componentPath = path.join(process.cwd(), 'src', 'components', 'generated', 'Dashboard.tsx');
        const componentDir = path.dirname(componentPath);
        
        if (!fs.existsSync(componentDir)) {
          fs.mkdirSync(componentDir, { recursive: true });
        }

        fs.writeFileSync(componentPath, code);
        console.log(`Dashboard component saved to ${componentPath}`);
      } catch (err) {
        console.error('Error writing dashboard component:', err);
      }
      
      // Return a special structured response for the frontend to render the component
      return NextResponse.json({ 
        role: 'assistant', 
        content: "I have analyzed the data and generated a dashboard for you.",
        componentCode: code,
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

