/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
    Loader2,
    Save, // New import
    Download, // New import
    FileText, // New import
    X // New import
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
    const [activeFilter, setActiveFilter] = useState<string>("All Time");
    const [isFiltering, setIsFiltering] = useState(false);

    // Save Dashboard States
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [dashboardName, setDashboardName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSaveDashboard = async () => {
        if (!dashboardName.trim()) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/dashboards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: dashboardName, config })
            });
            if (res.ok) {
                setShowSaveModal(false);
                setDashboardName("");
                // Trigger sidebar refresh
                window.dispatchEvent(new CustomEvent("refresh-dashboards"));
            }
        } catch (error) {
            console.error("Error saving dashboard", error);
        } finally {
            setIsSaving(false);
        }
    };

    const exportToPDF = () => {
        window.print();
    };

    const exportToCSV = () => {
        if (!config.charts || config.charts.length === 0) return;

        let csvContent = "";

        config.charts.forEach((chart, index) => {
            if (!chart.data || chart.data.length === 0) return;

            csvContent += `--- ${chart.title} ---\n`;

            // Get all unique keys from data objects
            const headers = Array.from(new Set(chart.data.flatMap(d => Object.keys(d))));
            csvContent += headers.join(",") + "\n";

            chart.data.forEach((row: any) => {
                const rowStr = headers.map(header => {
                    let cell = row[header];
                    if (cell === null || cell === undefined) cell = "";
                    // Escape quotes and wrap strings with commas
                    const cellStr = String(cell).replace(/"/g, '""');
                    if (cellStr.includes(",") || cellStr.includes("\n") || cellStr.includes('"')) {
                        return `"${cellStr}"`;
                    }
                    return cellStr;
                }).join(",");
                csvContent += rowStr + "\n";
            });
            csvContent += "\n\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${title.replace(/\s+/g, '_')}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
            {/* Header flexbox */}
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 print:hidden">
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            <FileText className="w-4 h-4" /> PDF
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" /> CSV
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide print:hidden">
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

            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center print:hidden">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Save Dashboard</h2>
                            <button onClick={() => setShowSaveModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Dashboard Name</label>
                                <input
                                    type="text"
                                    value={dashboardName}
                                    onChange={(e) => setDashboardName(e.target.value)}
                                    placeholder="e.g. Q3 Financial Trends"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    autoFocus
                                />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveDashboard}
                                    disabled={!dashboardName.trim() || isSaving}
                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
