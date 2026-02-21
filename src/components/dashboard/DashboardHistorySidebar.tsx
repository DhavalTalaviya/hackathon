"use client";

import { useEffect, useState } from "react";
import { Clock, Trash2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { DashboardConfig } from "@/components/dashboard/DynamicDashboard";

interface SavedDashboard {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface DashboardHistorySidebarProps {
    onSelect: (config: DashboardConfig) => void;
    currentId?: string; // Optional: To highlight currently loaded dashboard
}

export default function DashboardHistorySidebar({ onSelect, currentId }: DashboardHistorySidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const fetchDashboards = async () => {
        try {
            const res = await fetch("/api/dashboards");
            if (res.ok) {
                const data = await res.json();
                setDashboards(data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard history", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDashboards();
        }
    }, [isOpen]);

    // Expose a way to refresh the list from outside (e.g. after save) - we will use a custom event
    useEffect(() => {
        const handleRefresh = () => {
            fetchDashboards();
        };
        window.addEventListener("refresh-dashboards", handleRefresh);
        return () => window.removeEventListener("refresh-dashboards", handleRefresh);
    }, []);

    const handleLoad = async (id: string) => {
        setLoadingId(id);
        try {
            const res = await fetch(`/api/dashboards/${id}`);
            if (res.ok) {
                const data = await res.json();
                onSelect(data.config);
                // Optionally close on mobile/small screens, but keep open on desktop
            }
        } catch (error) {
            console.error("Failed to load dashboard", error);
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this dashboard?")) return;

        try {
            const res = await fetch(`/api/dashboards/${id}`, { method: "DELETE" });
            if (res.ok) {
                setDashboards((prev) => prev.filter((d) => d.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete dashboard", error);
        }
    };

    return (
        <>
            {/* Toggle Button - always visible if sidebar is closed */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-white/10 backdrop-blur-md border border-r-0 border-gray-200 dark:border-gray-800 p-2 rounded-l-xl shadow-lg hover:bg-white/20 transition-all print:hidden"
                    title="History"
                >
                    <Clock size={24} className="text-gray-900 dark:text-gray-100" />
                </button>
            )}

            {/* Sidebar Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden print:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar content */}
            <div
                className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col print:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock size={20} className="text-indigo-500" />
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Saved Dashboards</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-indigo-500" size={24} />
                        </div>
                    ) : dashboards.length === 0 ? (
                        <div className="text-center text-sm text-gray-500 py-8">
                            No saved dashboards yet.
                        </div>
                    ) : (
                        dashboards.map((dashboard) => (
                            <div
                                key={dashboard.id}
                                onClick={() => handleLoad(dashboard.id)}
                                className={`group p-3 rounded-xl border cursor-pointer transition-all ${currentId === dashboard.id
                                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20"
                                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {dashboard.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(dashboard.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {loadingId === dashboard.id ? (
                                            <Loader2 size={16} className="animate-spin text-gray-400" />
                                        ) : (
                                            <button
                                                onClick={(e) => handleDelete(e, dashboard.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
