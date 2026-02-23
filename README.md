# Sophiie AI Agents Hackathon 2026

### Project

| Field | Your Answer |
|-------|-------------|
| **Project Name** | Dynamic AI Dashboard Analytics |
| **One-Line Description** | An autonomous AI dashboard that translates natural language into dynamic visualizations with instant local cross-filtering. |
| **Tech Stack** | Next.js, React, Tailwind CSS, Recharts, better-sqlite3 |
| **AI Provider(s) Used** | Anthropic (Claude Opus 4.6 API) |

### About Your Project

#### What does it do?

The Dynamic AI Dashboard allows users to ask natural language questions about their business data and instantly receive a comprehensive, multi-chart dashboard. Instead of relying on pre-defined dashboard templates, the AI acts as a Data Analyst—deciding on the most appropriate visualization types (Bar, Line, Segment, Funnel, Radar, Treemap, etc.) and writing the precise SQL queries needed to generate them based on the database schema.

#### How does the interaction work?

Users interact with the system via a modern chat interface. After asking a query (e.g. "Give me a full business health breakdown"), the AI processes the context, constructs the views, and an animated dashboard immediately materializes.

**Iterative Conversations & Contextual Memory:** Generating a dashboard is just the beginning. The user can converse with the AI to refine what's on the screen (e.g., "Change the first chart to a pie chart", or "Filter this by cancelled only"). The system reads the *current dashboard configuration*, sends the schema to the LLM alongside the chat history, and the LLM selectively mutates the dashboard layout.
- **Intelligent Responses:** The AI generates custom conversational responses natively with the JSON payload.
- **In-Place UI Refresh:** Chat commands trigger a fast refresh event under the hood. The dashboard configuration instantly updates on the screen without a jarring page reload.

Crucially, the interaction doesn't stop at generation or conversational iteration. We recognized that waiting for a Slow LLM on every exploratory click is a poor UX. To solve this, we implemented **instant local cross-filtering**. When a user spots an interesting metric and clicks on a chart segment (like a slice on a Pie chart), the dashboard applies the clicked dimension as a global filter and instantly re-filters all charts across the board *locally*—without making another LLM generation request.

#### What makes it special?

The hybridization of cloud-hosted generative AI and edge-level local analytics. 

The AI handles the unbounded creativity of determining *what* to show and *how* to structure the query logic, but we offload the heavy lifting of exploratory data filtering entirely to the robust local SQLite database. This effectively eliminates "LLM latency" during user drill-downs. By retaining the generative AI capabilities only when necessary, it results in an application combining the creativity of conversational AI with the high-performance speed of professional BI tools.

#### How to run it

```bash
# Clone the repository
git clone <your-repo>
cd hackathon

# Install dependencies
npm install

# IMPORTANT: Seed the local SQLite database to populate sample data
node scripts/seed-db.js

# Ensure your ANTHROPIC_API_KEY is configured in your .env.local
# cp .env.example .env.local

# Start the development server
npm run dev
```

#### Architecture / Technical Notes

- **Separation of Concerns:** The LLM does *not* query the data directly. It is prompted with the schema and outputs a structured JSON configuring exactly how `recharts` should mount the visual layer, and specific SQL queries. The node execution layer fetches the data locally via `better-sqlite3`, securing data privacy and vastly reducing token limits.
- **Dynamic Cross-Filtering:** `api/config/filter/route.ts` behaves as an intelligent SQL proxy, implementing a rewriting schema that safely injects `WHERE` and `AND` clauses universally into the AI's cached original queries dynamically. It catches constraint violations gracefully to keep compatible charts filtered while retaining unfiltered views for unmatched tables.

---