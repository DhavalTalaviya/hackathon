/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Layers,
    Users,
    Activity,
    Filter,
    Calendar,
    Tag,
    Loader2
} from "lucide-react";
import { DashboardConfig, KpiConfig } from "./dashboard/DynamicDashboard";

interface DashboardShellProps {
    config: DashboardConfig;
    title?: string;
    subtitle?: string;
    onConfigUpdate?: (config: DashboardConfig) => void;
    children: (props: { colors: string[] }) => React.ReactNode;
}

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

const GLOBAL_FILTERS = [
    { label: "All Time", query: "1=1" },
    { label: "Last 30 Days", query: "date >= date('now', '-30 days')" },
    { label: "Software Costs", query: "category = 'Software'" },
    { label: "Confirmed Only", query: "status = 'confirmed'" },
];

const getIcon = (color?: string) => {
    switch (color) {
        case "emerald": return <TrendingUp className="w-5 h-5 text-emerald-400" />;
        case "rose": return <TrendingDown className="w-5 h-5 text-rose-400" />;
        case "amber": return <DollarSign className="w-5 h-5 text-amber-400" />;
        case "cyan": return <Users className="w-5 h-5 text-cyan-400" />;
        case "indigo": return <Layers className="w-5 h-5 text-indigo-400" />;
        default: return <Activity className="w-5 h-5 text-blue-400" />;
    }
};

const getIconBg = (color?: string) => {
    switch (color) {
        case "emerald": return "bg-emerald-500/20";
        case "rose": return "bg-rose-500/20";
        case "amber": return "bg-amber-500/20";
        case "cyan": return "bg-cyan-500/20";
        case "indigo": return "bg-indigo-500/20";
        default: return "bg-blue-500/20";
    }
};

const formatValue = (kpi: KpiConfig) => {
    let val = kpi.value;
    if (typeof val === 'number') {
        if (kpi.format === 'currency') {
            val = val.toLocaleString("en-US", { maximumFractionDigits: 0 });
        } else if (kpi.format === 'compact') {
            if (val >= 1000000) val = (val / 1000000).toFixed(1) + 'M';
            else if (val >= 1000) val = (val / 1000).toFixed(1) + 'K';
            else val = val.toString();
        } else {
            val = val.toLocaleString();
        }
    }
    return `${kpi.prefix || ''}${val}${kpi.suffix || ''}`;
};

export default function DashboardShell({
    config,
    title = "Analytics Dashboard",
    subtitle = "Comprehensive data breakdown and trend analysis",
    onConfigUpdate,
    children,
}: DashboardShellProps) {
    const [activeFilter, setActiveFilter] = React.useState<string>("All Time");
    const [isFiltering, setIsFiltering] = React.useState(false);

    const handleFilterClick = async (filter: typeof GLOBAL_FILTERS[0]) => {
        if (!onConfigUpdate) return;

        setActiveFilter(filter.label);
        setIsFiltering(true);

        try {
            const res = await fetch('/api/config/filter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filterContext: filter.query })
            });

            if (res.ok) {
                const newConfig = await res.json();
                onConfigUpdate(newConfig);
            }
        } catch (error) {
            console.error("Filter error:", error);
        } finally {
            setIsFiltering(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
            {/* Header */}
            {/* Header flexbox */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50 mr-2">
                        {isFiltering ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" /> : <Filter className="w-4 h-4 text-gray-400" />}
                        <span className="text-sm text-gray-400 font-medium">Local Filters:</span>
                    </div>
                    {GLOBAL_FILTERS.map((f) => (
                        <button
                            key={f.label}
                            onClick={() => handleFilterClick(f)}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeFilter === f.label
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
                                : "bg-gray-800/40 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50 hover:text-gray-200"
                                }`}
                        >
                            {f.label.includes("Days") || f.label.includes("Time") ? <Calendar className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI-Generated KPI Cards */}
            {config.kpis && config.kpis.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {config.kpis.map((kpi, idx) => (
                        <div key={idx} className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur border border-gray-700/50 rounded-2xl p-5 hover:border-${kpi.color || 'indigo'}-500/50 transition-all duration-300`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl ${getIconBg(kpi.color)} flex items-center justify-center`}>
                                    {getIcon(kpi.color)}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm truncate" title={kpi.title}>{kpi.title}</p>
                            <p className="text-2xl font-bold mt-1">{formatValue(kpi)}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Chart Area — AI-generated content renders here */}
            <div className="space-y-6">
                {children({ colors: COLORS })}
            </div>
        </div>
    );
}
