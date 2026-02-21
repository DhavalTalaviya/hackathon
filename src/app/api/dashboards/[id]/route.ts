import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DASHBOARDS_DIR = path.join(process.cwd(), 'src', 'components', 'generated', 'dashboards');

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise
) {
    try {
        const { id } = await context.params;
        const filePath = path.join(DASHBOARDS_DIR, `${id}.json`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const filePath = path.join(DASHBOARDS_DIR, `${id}.json`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting dashboard:', error);
        return NextResponse.json({ error: 'Failed to delete dashboard' }, { status: 500 });
    }
}
