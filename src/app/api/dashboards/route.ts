import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DASHBOARDS_DIR = path.join(process.cwd(), 'src', 'components', 'generated', 'dashboards');

// Ensure directory exists
if (!fs.existsSync(DASHBOARDS_DIR)) {
    fs.mkdirSync(DASHBOARDS_DIR, { recursive: true });
}

export async function GET() {
    try {
        const files = fs.readdirSync(DASHBOARDS_DIR);
        const dashboards = files
            .filter(f => f.endsWith('.json'))
            .map(file => {
                const filePath = path.join(DASHBOARDS_DIR, file);
                const stat = fs.statSync(filePath);
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const parsed = JSON.parse(content);
                    return {
                        id: file.replace('.json', ''),
                        name: parsed.name || 'Unnamed Dashboard',
                        createdAt: stat.birthtime,
                        updatedAt: stat.mtime
                    };
                } catch (e) {
                    console.error("Error reading dashboard file:", file, e);
                    return null;
                }
            })
            .filter(Boolean)
            .sort((a, b) => b!.updatedAt.getTime() - a!.updatedAt.getTime());

        return NextResponse.json(dashboards);
    } catch (error) {
        console.error('Error fetching dashboards:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboards' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, config } = body;

        if (!name || !config) {
            return NextResponse.json({ error: 'Name and config are required' }, { status: 400 });
        }

        const id = `dashboard-${Date.now()}`;
        const filePath = path.join(DASHBOARDS_DIR, `${id}.json`);

        const dataToSave = {
            id,
            name,
            config
        };

        fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));

        return NextResponse.json({ success: true, id, name });
    } catch (error) {
        console.error('Error saving dashboard:', error);
        return NextResponse.json({ error: 'Failed to save dashboard' }, { status: 500 });
    }
}
