"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Filter,
} from "lucide-react";

const data = [{ "category": "Infrastructure", "total_entries": 4, "total_amount": 13534, "avg_amount": 3383.5, "min_amount": 1590, "max_amount": 4314, "pct_of_total": 0.11, "month": "2026-01" }, { "category": "Marketing", "total_entries": 4, "total_amount": 13217, "avg_amount": 3304.25, "min_amount": 1896, "max_amount": 4051, "pct_of_total": 0.11, "month": "2026-01" }, { "category": "Software", "total_entries": 4, "total_amount": 11141, "avg_amount": 2785.25, "min_amount": 528, "max_amount": 4571, "pct_of_total": 0.09, "month": "2026-01" }, { "category": "Software", "total_entries": 150, "total_amount": 379041, "avg_amount": 2526.94, "min_amount": 79, "max_amount": 4991, "pct_of_total": 3.04, "month": "2025-12" }, { "category": "Marketing", "total_entries": 144, "total_amount": 366606, "avg_amount": 2545.88, "min_amount": 56, "max_amount": 4966, "pct_of_total": 2.94, "month": "2025-12" }, { "category": "Infrastructure", "total_entries": 121, "total_amount": 280348, "avg_amount": 2316.93, "min_amount": 67, "max_amount": 4970, "pct_of_total": 2.25, "month": "2025-12" }, { "category": "Software", "total_entries": 164, "total_amount": 420964, "avg_amount": 2566.85, "min_amount": 69, "max_amount": 4992, "pct_of_total": 3.38, "month": "2025-11" }, { "category": "Marketing", "total_entries": 145, "total_amount": 371424, "avg_amount": 2561.54, "min_amount": 58, "max_amount": 4990, "pct_of_total": 2.98, "month": "2025-11" }, { "category": "Infrastructure", "total_entries": 139, "total_amount": 325222, "avg_amount": 2339.73, "min_amount": 169, "max_amount": 4961, "pct_of_total": 2.61, "month": "2025-11" }, { "category": "Infrastructure", "total_entries": 151, "total_amount": 394514, "avg_amount": 2612.68, "min_amount": 106, "max_amount": 4967, "pct_of_total": 3.16, "month": "2025-10" }, { "category": "Software", "total_entries": 142, "total_amount": 342735, "avg_amount": 2413.63, "min_amount": 66, "max_amount": 4991, "pct_of_total": 2.75, "month": "2025-10" }, { "category": "Marketing", "total_entries": 118, "total_amount": 281135, "avg_amount": 2382.5, "min_amount": 220, "max_amount": 4910, "pct_of_total": 2.25, "month": "2025-10" }, { "category": "Infrastructure", "total_entries": 159, "total_amount": 393804, "avg_amount": 2476.75, "min_amount": 110, "max_amount": 4901, "pct_of_total": 3.16, "month": "2025-09" }, { "category": "Marketing", "total_entries": 151, "total_amount": 389811, "avg_amount": 2581.53, "min_amount": 60, "max_amount": 4973, "pct_of_total": 3.13, "month": "2025-09" }, { "category": "Software", "total_entries": 120, "total_amount": 306194, "avg_amount": 2551.62, "min_amount": 89, "max_amount": 4944, "pct_of_total": 2.46, "month": "2025-09" }, { "category": "Infrastructure", "total_entries": 165, "total_amount": 427526, "avg_amount": 2591.07, "min_amount": 164, "max_amount": 4991, "pct_of_total": 3.43, "month": "2025-08" }, { "category": "Software", "total_entries": 159, "total_amount": 397987, "avg_amount": 2503.06, "min_amount": 58, "max_amount": 4987, "pct_of_total": 3.19, "month": "2025-08" }, { "category": "Marketing", "total_entries": 121, "total_amount": 298013, "avg_amount": 2462.92, "min_amount": 164, "max_amount": 4969, "pct_of_total": 2.39, "month": "2025-08" }, { "category": "Infrastructure", "total_entries": 159, "total_amount": 373009, "avg_amount": 2345.97, "min_amount": 82, "max_amount": 4948, "pct_of_total": 2.99, "month": "2025-07" }, { "category": "Software", "total_entries": 143, "total_amount": 360651, "avg_amount": 2522.03, "min_amount": 50, "max_amount": 4985, "pct_of_total": 2.89, "month": "2025-07" }, { "category": "Marketing", "total_entries": 132, "total_amount": 342465, "avg_amount": 2594.43, "min_amount": 119, "max_amount": 4985, "pct_of_total": 2.75, "month": "2025-07" }, { "category": "Software", "total_entries": 148, "total_amount": 370378, "avg_amount": 2502.55, "min_amount": 67, "max_amount": 4979, "pct_of_total": 2.97, "month": "2025-06" }, { "category": "Marketing", "total_entries": 119, "total_amount": 312419, "avg_amount": 2625.37, "min_amount": 94, "max_amount": 4921, "pct_of_total": 2.51, "month": "2025-06" }, { "category": "Infrastructure", "total_entries": 116, "total_amount": 310398, "avg_amount": 2675.84, "min_amount": 59, "max_amount": 5000, "pct_of_total": 2.49, "month": "2025-06" }, { "category": "Infrastructure", "total_entries": 143, "total_amount": 360825, "avg_amount": 2523.25, "min_amount": 134, "max_amount": 4954, "pct_of_total": 2.89, "month": "2025-05" }, { "category": "Marketing", "total_entries": 148, "total_amount": 358707, "avg_amount": 2423.7, "min_amount": 199, "max_amount": 4999, "pct_of_total": 2.88, "month": "2025-05" }, { "category": "Software", "total_entries": 114, "total_amount": 295041, "avg_amount": 2588.08, "min_amount": 74, "max_amount": 4996, "pct_of_total": 2.37, "month": "2025-05" }, { "category": "Software", "total_entries": 150, "total_amount": 383372, "avg_amount": 2555.81, "min_amount": 52, "max_amount": 4996, "pct_of_total": 3.07, "month": "2025-04" }, { "category": "Marketing", "total_entries": 152, "total_amount": 372161, "avg_amount": 2448.43, "min_amount": 69, "max_amount": 4996, "pct_of_total": 2.98, "month": "2025-04" }, { "category": "Infrastructure", "total_entries": 122, "total_amount": 298135, "avg_amount": 2443.73, "min_amount": 52, "max_amount": 4992, "pct_of_total": 2.39, "month": "2025-04" }, { "category": "Software", "total_entries": 132, "total_amount": 307190, "avg_amount": 2327.2, "min_amount": 168, "max_amount": 4999, "pct_of_total": 2.46, "month": "2025-03" }, { "category": "Infrastructure", "total_entries": 127, "total_amount": 306696, "avg_amount": 2414.93, "min_amount": 58, "max_amount": 4983, "pct_of_total": 2.46, "month": "2025-03" }, { "category": "Marketing", "total_entries": 120, "total_amount": 292417, "avg_amount": 2436.81, "min_amount": 103, "max_amount": 4953, "pct_of_total": 2.35, "month": "2025-03" }, { "category": "Software", "total_entries": 140, "total_amount": 333780, "avg_amount": 2384.14, "min_amount": 78, "max_amount": 4988, "pct_of_total": 2.68, "month": "2025-02" }, { "category": "Marketing", "total_entries": 132, "total_amount": 308677, "avg_amount": 2338.46, "min_amount": 53, "max_amount": 4976, "pct_of_total": 2.48, "month": "2025-02" }, { "category": "Infrastructure", "total_entries": 117, "total_amount": 293853, "avg_amount": 2511.56, "min_amount": 70, "max_amount": 4830, "pct_of_total": 2.36, "month": "2025-02" }, { "category": "Infrastructure", "total_entries": 154, "total_amount": 385128, "avg_amount": 2500.83, "min_amount": 147, "max_amount": 4898, "pct_of_total": 3.09, "month": "2025-01" }, { "category": "Software", "total_entries": 141, "total_amount": 377398, "avg_amount": 2676.58, "min_amount": 141, "max_amount": 4947, "pct_of_total": 3.03, "month": "2025-01" }, { "category": "Marketing", "total_entries": 130, "total_amount": 313725, "avg_amount": 2413.27, "min_amount": 58, "max_amount": 4996, "pct_of_total": 2.52, "month": "2025-01" }];

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

const formatCurrency = (val: number) =>
  "$" + val.toLocaleString("en-US", { maximumFractionDigits: 0 });

const formatCompact = (val: number) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val}`;
};

export default function DashboardComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(data.map((d: any) => d.category)))],
    []
  );

  const filteredData = useMemo(
    () =>
      selectedCategory === "All"
        ? data
        : data.filter((d: any) => d.category === selectedCategory),
    [selectedCategory]
  );

  const totalAmount = useMemo(
    () => filteredData.reduce((s: number, d: any) => s + d.total_amount, 0),
    [filteredData]
  );

  const totalEntries = useMemo(
    () => filteredData.reduce((s: number, d: any) => s + d.total_entries, 0),
    [filteredData]
  );

  const avgAmount = useMemo(
    () =>
      filteredData.length > 0
        ? filteredData.reduce((s: number, d: any) => s + d.avg_amount, 0) /
        filteredData.length
        : 0,
    [filteredData]
  );

  const maxEntry = useMemo(
    () =>
      filteredData.reduce(
        (max: any, d: any) => (d.max_amount > (max?.max_amount || 0) ? d : max),
        filteredData[0]
      ),
    [filteredData]
  );

  // Category breakdown for pie chart
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach((d: any) => {
      map[d.category] = (map[d.category] || 0) + d.total_amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    const map: Record<string, any> = {};
    data.forEach((d: any) => {
      if (!map[d.month]) {
        map[d.month] = { month: d.month, total: 0, entries: 0, avg: 0 };
      }
      map[d.month].total += d.total_amount;
      map[d.month].entries += d.total_entries;
    });
    Object.values(map).forEach((m: any) => {
      m.avg = m.entries > 0 ? Math.round(m.total / m.entries) : 0;
    });
    return Object.values(map).sort((a: any, b: any) =>
      a.month.localeCompare(b.month)
    );
  }, []);

  // Category comparison (radar)
  const radarData = useMemo(() => {
    const map: Record<string, any> = {};
    data.forEach((d: any) => {
      if (!map[d.category]) {
        map[d.category] = {
          category: d.category,
          totalAmount: 0,
          avgAmount: 0,
          count: 0,
          maxAmount: 0,
        };
      }
      map[d.category].totalAmount += d.total_amount;
      map[d.category].avgAmount += d.avg_amount;
      map[d.category].count += 1;
      map[d.category].maxAmount = Math.max(
        map[d.category].maxAmount,
        d.max_amount
      );
    });
    return Object.values(map).map((m: any) => ({
      ...m,
      avgAmount: Math.round(m.avgAmount / m.count),
    }));
  }, []);

  // Stacked bar by month/category
  const stackedBarData = useMemo(() => {
    const months: Record<string, any> = {};
    data.forEach((d: any) => {
      if (!months[d.month]) months[d.month] = { month: d.month };
      months[d.month][d.category] =
        (months[d.month][d.category] || 0) + d.total_amount;
    });
    return Object.values(months).sort((a: any, b: any) =>
      a.month.localeCompare(b.month)
    );
  }, []);

  const allCategories = useMemo(
    () => Array.from(new Set(data.map((d: any) => d.category))),
    []
  );

  const CustomTooltipBar = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl">
          <p className="text-gray-300 text-sm font-medium mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl">
          <p className="text-white text-sm font-semibold">{payload[0].name}</p>
          <p className="text-indigo-400 text-sm">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-400 text-xs">
            {((payload[0].percent || 0) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Enhanced Costs Analytics
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Comprehensive cost breakdown and trend analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700/50 rounded-2xl p-5 hover:border-indigo-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              Active
            </span>
          </div>
          <p className="text-gray-400 text-sm">Total Spend</p>
          <p className="text-2xl font-bold mt-1">{formatCompact(totalAmount)}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700/50 rounded-2xl p-5 hover:border-cyan-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">
              <Activity className="w-3 h-3" />
              {totalEntries}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Total Entries</p>
          <p className="text-2xl font-bold mt-1">{totalEntries.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700/50 rounded-2xl p-5 hover:border-amber-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
              avg
            </span>
          </div>
          <p className="text-gray-400 text-sm">Avg Amount</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(Math.round(avgAmount))}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700/50 rounded-2xl p-5 hover:border-rose-500/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-rose-400 bg-rose-400/10 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3" />
              peak
            </span>
          </div>
          <p className="text-gray-400 text-sm">Max Single Cost</p>
          <p className="text-2xl font-bold mt-1">
            {formatCurrency(maxEntry?.max_amount || 0)}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {maxEntry?.category} — {maxEntry?.month}
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stacked Bar */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold">Cost by Category & Month</h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stackedBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#4b5563" }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#4b5563" }}
                tickFormatter={(v) => formatCompact(v)}
              />
              <Tooltip content={<CustomTooltipBar />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "#d1d5db" }}
              />
              {allCategories.map((cat: string, i: number) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  stackId="a"
                  fill={COLORS[i % COLORS.length]}
                  radius={
                    i === allCategories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};
