/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ComposedChart,
    ScatterChart,
    Scatter,
    ZAxis,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    Treemap,
    FunnelChart,
    Funnel,
    LabelList
} from "recharts";

export interface ChartConfig {
    type: "BarChart" | "LineChart" | "PieChart" | "AreaChart" | "RadarChart" | "ComposedChart" | "ScatterChart" | "RadialBarChart" | "Treemap" | "FunnelChart";
    title: string;
    dataKey?: string; // For PieChart
    nameKey?: string; // For PieChart/RadarChart
    xAxisKey?: string; // For Bar/Line/Area/Composed/Scatter
    yAxisKey?: string; // For Scatter
    zAxisKey?: string; // For Scatter sizes
    data?: any[]; // Allow individual charts to override the global data payload
    series: {
        dataKey: string;
        name?: string;
        type?: "line" | "bar" | "area"; // For ComposedChart
        color?: string; // Optional, will fallback to theme colors if not provided
    }[];
}

export interface KpiConfig {
    title: string;
    value: string | number;
    prefix?: string;
    suffix?: string;
    format?: "compact" | "currency" | "number";
    color?: "indigo" | "cyan" | "amber" | "rose" | "emerald";
}

export interface DashboardConfig {
    charts: ChartConfig[];
    kpis?: KpiConfig[];
}

interface DynamicDashboardProps {
    data: any[];
    config: DashboardConfig;
    colors: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm shadow-xl z-50">
                {label && <p className="text-gray-300 mb-1">{label}</p>}
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="font-semibold" style={{ color: entry.color }}>
                        {entry.name || entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DynamicDashboard({
    data: globalData,
    config,
    colors,
}: DynamicDashboardProps) {

    if (!config || !config.charts || config.charts.length === 0) {
        return (
            <div className="text-gray-400 text-center p-8 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                Dashboard configuration is empty or null. Try asking a different question.
            </div>
        );
    }

    const renderChart = (chart: ChartConfig, index: number) => {
        // Handle LLM execution errors gracefully
        if ((chart as any).error) {
            return (
                <div className="flex flex-col items-center justify-center h-[300px] text-red-500 italic p-4 text-center">
                    <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{(chart as any).error}</span>
                </div>
            );
        }

        // Determine data source: locally provided in config > globally provided by the component
        const chartData = chart.data && chart.data.length > 0 ? chart.data : globalData;

        if (!chartData || chartData.length === 0) {
            return (
                <div className="flex items-center justify-center h-[300px] text-gray-500 italic">
                    No data available for this chart.
                </div>
            );
        }

        switch (chart.type) {
            case "BarChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey={chart.xAxisKey} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                            {chart.series.map((s, i) => (
                                <Bar key={s.dataKey} dataKey={s.dataKey} name={s.name || s.dataKey} fill={s.color || colors[(index + i) % colors.length]} radius={[4, 4, 0, 0]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );

            case "LineChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey={chart.xAxisKey} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                            {chart.series.map((s, i) => (
                                <Line
                                    key={s.dataKey}
                                    type="monotone"
                                    dataKey={s.dataKey}
                                    name={s.name || s.dataKey}
                                    stroke={s.color || colors[(index + i) % colors.length]}
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );

            case "AreaChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey={chart.xAxisKey} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                            {chart.series.map((s, i) => (
                                <Area
                                    key={s.dataKey}
                                    type="monotone"
                                    dataKey={s.dataKey}
                                    name={s.name || s.dataKey}
                                    stroke={s.color || colors[(index + i) % colors.length]}
                                    fill={s.color || colors[(index + i) % colors.length]}
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case "PieChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey={chart.dataKey || chart.series?.[0]?.dataKey || "value"}
                                nameKey={chart.nameKey || "name"}
                            >
                                {chartData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case "RadarChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis dataKey={chart.nameKey || chart.xAxisKey || "subject"} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: "#9CA3AF" }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                            {chart.series.map((s, i) => (
                                <Radar
                                    key={s.dataKey}
                                    name={s.name || s.dataKey}
                                    dataKey={s.dataKey}
                                    stroke={s.color || colors[(index + i) % colors.length]}
                                    fill={s.color || colors[(index + i) % colors.length]}
                                    fillOpacity={0.5}
                                />
                            ))}
                        </RadarChart>
                    </ResponsiveContainer>
                );

            case "ComposedChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey={chart.xAxisKey} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                            {chart.series.map((s, i) => {
                                const color = s.color || colors[(index + i) % colors.length];
                                if (s.type === "line") {
                                    return <Line key={s.dataKey} type="monotone" dataKey={s.dataKey} name={s.name || s.dataKey} stroke={color} strokeWidth={3} />;
                                } else if (s.type === "area") {
                                    return <Area key={s.dataKey} type="monotone" dataKey={s.dataKey} name={s.name || s.dataKey} fill={color} stroke={color} fillOpacity={0.3} />;
                                }
                                return <Bar key={s.dataKey} dataKey={s.dataKey} name={s.name || s.dataKey} fill={color} radius={[4, 4, 0, 0]} />;
                            })}
                        </ComposedChart>
                    </ResponsiveContainer>
                );

            case "ScatterChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey={chart.xAxisKey} type="category" name={chart.xAxisKey} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            {chart.yAxisKey && <YAxis dataKey={chart.yAxisKey} type="number" name={chart.yAxisKey} stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />}
                            {chart.zAxisKey && <ZAxis dataKey={chart.zAxisKey} type="number" range={[50, 400]} name={chart.zAxisKey} />}
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                            {chart.series.map((s, i) => (
                                <Scatter key={s.dataKey} name={s.name || s.dataKey} data={chartData} fill={s.color || colors[(index + i) % colors.length]} />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                );

            case "RadialBarChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={20} data={chartData}>
                            <RadialBar
                                label={{ position: 'insideStart', fill: '#fff' }}
                                background={{ fill: '#374151' }}
                                dataKey={chart.series?.[0]?.dataKey || "value"}
                            />
                            {chart.nameKey && <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: 0, left: 0 }} />}
                            <Tooltip content={<CustomTooltip />} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                );

            case "Treemap":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <Treemap
                            data={chartData}
                            dataKey={chart.series?.[0]?.dataKey || "value"}
                            nameKey={chart.nameKey || "name"}
                            aspectRatio={4 / 3}
                            stroke="#1f2937"
                        >
                            <Tooltip content={<CustomTooltip />} />
                        </Treemap>
                    </ResponsiveContainer>
                );

            case "FunnelChart":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart>
                            <Tooltip content={<CustomTooltip />} />
                            <Funnel
                                dataKey={chart.series?.[0]?.dataKey || "value"}
                                data={chartData}
                                isAnimationActive
                            >
                                <LabelList position="right" fill="#9CA3AF" stroke="none" dataKey={chart.nameKey || "name"} />
                                {chartData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                                ))}
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                );

            default:
                return <div className="text-red-400">Unsupported chart type: {chart.type}</div>;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {config.charts.map((chart, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl hover:border-gray-600/50">
                    <h3 className="text-lg font-semibold text-gray-100 mb-6 truncate" title={chart.title}>
                        {chart.title}
                    </h3>
                    {renderChart(chart, index)}
                </div>
            ))}
        </div>
    );
}
