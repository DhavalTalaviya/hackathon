import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Dictionary from 'better-sqlite3';

const db = new Dictionary('local.db');

export async function POST(request: Request) {
  try {
    const { filterContext } = await request.json();

    if (!filterContext) {
      return NextResponse.json({ error: 'filterContext is required' }, { status: 400 });
    }

    const componentDir = path.join(process.cwd(), 'src', 'components', 'generated');
    const configPath = path.join(componentDir, 'dashboardConfig.json');
    
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ charts: [], error: 'Dashboard config not found. Please ask the AI to generate a dashboard first.' });
    }

    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);

    const applyFilterToSQL = (sql: string, filter: string) => {
        if (!sql) return sql;
        
        // Remove trailing semicolons
        const cleanSql = sql.trim().replace(/;$/, '');
        
        // Very basic SQL injection prevention for our local hackathon DB
        const safeFilter = filter.replace(/;/g, '');

        // Naive SQL parser: We want to inject `AND (safeFilter)` if WHERE exists.
        // Or `WHERE (safeFilter)` if WHERE doesn't exist, right before GROUP BY, ORDER BY, LIMIT, or end of string.
        
        const upperSql = cleanSql.toUpperCase();
        
        const groupByIndex = upperSql.indexOf(' GROUP BY ');
        const orderByIndex = upperSql.indexOf(' ORDER BY ');
        const limitIndex = upperSql.indexOf(' LIMIT ');
        
        // Find the earliest terminating clause
        let injectionIndex = cleanSql.length;
        if (groupByIndex !== -1 && groupByIndex < injectionIndex) injectionIndex = groupByIndex;
        if (orderByIndex !== -1 && orderByIndex < injectionIndex) injectionIndex = orderByIndex;
        if (limitIndex !== -1 && limitIndex < injectionIndex) injectionIndex = limitIndex;

        const whereIndex = upperSql.indexOf(' WHERE ');

        if (whereIndex !== -1 && whereIndex < injectionIndex) {
            // WHERE exists before any grouping/ordering. Inject AND.
            // Split string at injection index
            const before = cleanSql.substring(0, injectionIndex);
            const after = cleanSql.substring(injectionIndex);
            return `${before} AND (${safeFilter}) ${after}`;
        } else {
            // WHERE doesn't exist. Inject WHERE.
            const before = cleanSql.substring(0, injectionIndex);
            const after = cleanSql.substring(injectionIndex);
            return `${before} WHERE (${safeFilter}) ${after}`;
        }
    };

    // 1. Re-execute charts with filtered SQL
    if (config.charts && Array.isArray(config.charts)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config.charts = config.charts.map((chart: any) => {
            if (chart.sql) {
                try {
                    const filteredSql = applyFilterToSQL(chart.sql, filterContext);
                    console.log(`[Local Filter] Original: ${chart.sql}`);
                    console.log(`[Local Filter] Rewritten: ${filteredSql}`);
                    
                    const stmt = db.prepare(filteredSql);
                    chart.data = stmt.all();
                } catch (dbError) {
                    console.error(`Error executing filtered SQL for chart ${chart.title}:`, (dbError as Error).message);
                    chart.error = "Error executing filtered chart query";
                    // keep old data fallback
                }
            } else {
                console.warn(`Chart ${chart.title} is missing cached SQL. Cannot apply local filter.`);
            }
            return chart;
        });
    }

    // 2. Re-execute KPIs with filtered SQL
    if (config.kpis && Array.isArray(config.kpis)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config.kpis = config.kpis.map((kpi: any) => {
            if (kpi.sql) {
                try {
                    const filteredSql = applyFilterToSQL(kpi.sql, filterContext);
                    const stmt = db.prepare(filteredSql);
                    const row = stmt.get() as Record<string, unknown>;
                    if (row) {
                        const firstKey = Object.keys(row)[0];
                        kpi.value = row[firstKey];
                    } else {
                        kpi.value = 0;
                    }
                } catch (dbError) {
                    console.error(`Error executing filtered SQL for KPI ${kpi.title}:`, (dbError as Error).message);
                    kpi.value = "Error";
                }
            }
            return kpi;
        });
    }

    return NextResponse.json(config);

  } catch (error) {
    console.error('Error in local config filtering:', error);
    return NextResponse.json({ error: 'Local filtering failed' }, { status: 500 });
  }
}
