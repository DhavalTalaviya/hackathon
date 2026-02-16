/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';
import ChartPanel from '@/components/generated/ChartPanel';

export default function DashboardPage() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Dynamically load the data file
        import('@/components/generated/dashboardData.json')
            .then((mod) => setData(mod.default || []))
            .catch(() => setData([]));
    }, []);

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
                data={data}
                title="AI Analytics Dashboard"
                subtitle="Comprehensive data breakdown and trend analysis"
            >
                {({ filteredData, allCategories, colors }) => (
                    <ChartPanel
                        data={filteredData}
                        allCategories={allCategories}
                        colors={colors}
                    />
                )}
            </DashboardShell>
        </div>
    );
}
