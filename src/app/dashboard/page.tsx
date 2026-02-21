/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';
import ChartPanel from '@/components/generated/ChartPanel';

import { DashboardConfig } from '@/components/dashboard/DynamicDashboard';

export default function DashboardPage() {
    const [config, setConfig] = useState<DashboardConfig | null>(null);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res = await fetch(`/api/config?t=${Date.now()}`);
                const data = await res.json();
                setConfig(data as DashboardConfig);
            } catch (err) {
                console.error("Failed to load config", err);
                setConfig({ charts: [], kpis: [] });
            }
        };
        loadConfig();
    }, []);

    if (!config) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="absolute top-6 left-6 z-10">
                <Link
                    href="/"
                    className="p-2 bg-white/10 backdrop-blur rounded-full shadow hover:bg-white/20 transition-colors inline-flex"
                >
                    <ArrowLeft size={20} className="text-white" />
                </Link>
            </div>
            <DashboardShell
                config={config}
                title="AI Analytics Dashboard"
                subtitle="Comprehensive data breakdown and trend analysis"
                onConfigUpdate={setConfig}
            >
                {({ colors }) => (
                    <ChartPanel
                        config={config}
                        colors={colors}
                    />
                )}
            </DashboardShell>
        </div>
    );
}
