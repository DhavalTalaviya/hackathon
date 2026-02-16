/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Layers,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Filter,
} from "lucide-react";

const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { maximumFractionDigits: 0 });

const formatCompact = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
};

interface DashboardShellProps {
    data: any[];
    title?: string;
    subtitle?: string;
    children: (props: { filteredData: any[]; allCategories: string[]; colors: string[] }) => React.ReactNode;
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

export default function DashboardShell({
    data,
    title = "Analytics Dashboard",
    subtitle = "Comprehensive data breakdown and trend analysis",
    children,
}: DashboardShellProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = useMemo(
        () => ["All", ...Array.from(new Set(data.map((d: any) => d.category)))],
        [data]
    );

    const filteredData = useMemo(
        () =>
            selectedCategory === "All"
                ? data
                : data.filter((d: any) => d.category === selectedCategory),
        [selectedCategory, data]
    );

    const allCategories = useMemo(
        () => Array.from(new Set(data.map((d: any) => d.category))),
        [data]
    );

    const totalAmount = useMemo(
        () => filteredData.reduce((s: number, d: any) => s + (d.total_amount || 0), 0),
        [filteredData]
    );

    const totalEntries = useMemo(
        () => filteredData.reduce((s: number, d: any) => s + (d.total_entries || 0), 0),
        [filteredData]
    );

    const avgAmount = useMemo(
        () =>
            filteredData.length > 0
                ? filteredData.reduce((s: number, d: any) => s + (d.avg_amount || 0), 0) /
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>
                </div>
                {categories.length > 2 && (
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
                )}
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

            {/* Chart Area — AI-generated content renders here */}
            <div className="space-y-6">
                {children({ filteredData, allCategories, colors: COLORS })}
            </div>
        </div>
    );
}
