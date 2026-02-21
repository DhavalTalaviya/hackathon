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

  const systemPrompt = `You are an expert Data Analyst and Visualization architect.
  Your goal is to answer the user's question by designing a dashboard configuration and writing the SQL queries to power it.
  
  Database Schema (SQLite):
  ${schema}
  
  Rules:
  1. Generate up to 3 charts that answer the user query or provide a comprehensive dashboard.
  2. Generate 4 key performance indicators (KPIs) relevant to the query.
  3. For EACH chart and KPI, you MUST provide a specific valid SQLite query.
  4. Generate ONLY a valid JSON object. Do NOT include markdown blocks (\`\`\`json) or text explanations.
  5. Use AS aliases in your SQL to match the \`*Key\` names you configure (e.g. \`SELECT status AS category, COUNT(*) AS value... \` -> xAxisKey: "category", series: [{"dataKey": "value"}]).
  6. DO NOT include "data" arrays in the JSON. The engine runs your SQL and injects the data automatically. Hallucinating data will hit token limits and crash.
  7. CRITICAL SQL AVOIDANCE: When using JOINs or UNIONs, you MUST qualify all column names in ORDER BY and GROUP BY clauses with their table alias (e.g., \`ORDER BY m.month\`, NOT \`ORDER BY month\`) to prevent ambiguous column name errors.
  8. For KPIs, the "sql" MUST return exactly one row and one column (e.g. \`SELECT COUNT(*) FROM bookings\`). Alternatively, you can return a pre-formatted string if it's simpler (e.g., \`SELECT '$' || SUM(amount) FROM costs\`).

  Schema for the JSON output:
  {
    "charts": [
      {
        "type": "BarChart" | "LineChart" | "PieChart" | "AreaChart" | "RadarChart" | "ComposedChart" | "ScatterChart",
        "title": "Clear concise chart title",
        "sql": "SELECT ... FROM ... ",
        "xAxisKey": "string (for Bar/Line/Area/Composed/Scatter)",
        "dataKey": "string (For PieChart, the numeric value)",
        "nameKey": "string (For PieChart/Radar, the label)",
        "yAxisKey": "string (For Scatter)",
        "zAxisKey": "string (For Scatter size, optional)",
        "series": [
          { "dataKey": "string", "name": "Friendly Name", "type": "line|bar|area" }
        ]
      }
    ],
    "kpis": [
      {
        "title": "Short Title",
        "sql": "SELECT ... FROM ... (MUST return 1 row, 1 col)",
        "prefix": "$", // Optional prefix (e.g., $)
        "suffix": "K", // Optional suffix (e.g., K, %, or text)
        "format": "compact" | "currency" | "number", // Optional formatting instruction
        "color": "indigo" | "cyan" | "amber" | "rose" | "emerald"
      }
    ]
  }

  Chart Selection Guidelines:
  - Parts of a whole (status breakdown, categories): PieChart or BarChart.
  - Time series (trends over days/months): LineChart or AreaChart (group by DATE).
  - Multi-variable comparison: RadarChart.
  - Correlation/Distribution: ScatterChart.

  CRITICAL: OUTPUT ONLY VALID JSON. NO MARKDOWN. NO CODE BLOCKS. ENSURE THE JSON IS FULLY CLOSED AT THE END.
  `; // End of prompt

  try {
    // 1. Generate Dashboard JSON Config + SQL queries
    const llmResponse = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: query }],
    });

    let configString = llmResponse.content[0].type === 'text' ? llmResponse.content[0].text.trim() : '';
    // Strip markdown if the LLM still includes it
    configString = configString.replace(/^```(json)?\n?/i, '').replace(/```$/i, '').trim();

    console.log('Generated Unified Config:', configString.substring(0, 150) + '...');

    if (!configString) return { error: 'Failed to generate config' };

    let config;
    try {
      config = JSON.parse(configString);
    } catch {
      console.error("Failed to parse LLM JSON:", configString);
      return { error: 'Invalid JSON config generated' };
    }

    if (!config.charts || !Array.isArray(config.charts)) {
      config.charts = []; // Fallback if missing
    }

    // 2. Execute SQL for each chart and attach data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const executedCharts = config.charts.map((chart: any) => {
      if (chart.sql) {
        try {
          const stmt = db.prepare(chart.sql);
          chart.data = stmt.all();
          // We don't need to send the SQL to the frontend config
          delete chart.sql;
        } catch (dbError) {
          console.error(`Error executing SQL for chart ${chart.title}: ${chart.sql}`, (dbError as Error).message);
          chart.data = [];
          chart.error = "Error executing chart data query";
        }
      } else {
        chart.data = [];
      }
      return chart;
    });

    config.charts = executedCharts;

    // 3. Execute SQL for KPIs
    if (config.kpis && Array.isArray(config.kpis)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const executedKpis = config.kpis.map((kpi: any) => {
            if (kpi.sql) {
                try {
                    const stmt = db.prepare(kpi.sql);
                    const row = stmt.get() as Record<string, unknown>; // get() returns the first row
                    if (row) {
                        // Get the first value from the returned object keys
                        const firstKey = Object.keys(row)[0];
                        kpi.value = row[firstKey];
                    } else {
                        kpi.value = 0;
                    }
                    delete kpi.sql;
                } catch (dbError) {
                    console.error(`Error executing SQL for KPI ${kpi.title}: ${kpi.sql}`, (dbError as Error).message);
                    kpi.value = "Error";
                }
            } else {
                kpi.value = kpi.value || 0;
            }
            return kpi;
        });
        config.kpis = executedKpis;
    } else {
        config.kpis = [];
    }

    return {
      configString: JSON.stringify(config, null, 2),
      configObject: config
    };

  } catch (error) {
    console.error('Error in DataAnalystAgent:', error);
    return { error: 'Analysis failed', details: error };
  }
};
