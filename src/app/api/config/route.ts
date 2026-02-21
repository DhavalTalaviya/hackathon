import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const componentDir = path.join(process.cwd(), 'src', 'components', 'generated');
    const configPath = path.join(componentDir, 'dashboardConfig.json');
    
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return NextResponse.json(JSON.parse(configData));
    } else {
      // Return empty default state if hasn't been generated yet
      return NextResponse.json({ charts: [] });
    }
  } catch (error) {
    console.error('Error serving dashboard config:', error);
    return NextResponse.json({ charts: [], error: 'Failed to load config' });
  }
}
