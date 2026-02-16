"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  CalendarDays,
  Users,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Activity,
} from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl">
        {label && (
          <p className="text-gray-300 text-sm font-medium mb-1">{label}</p>
        )}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartPanel({
  data,
  allCategories,
  colors,
}: {
  data: any[];
  allCategories: string[];
  colors: string[];
}) {
  const row = data[0] || {};

  const statusData = [
    { name: "Confirmed", value: row.confirmed || 0 },
    { name: "Cancelled", value: row.cancelled || 0 },
    { name: "Pending", value: row.pending || 0 },
  ];

  const rateData = [
    { name: "Confirmation Rate", value: row.confirmation_rate_pct || 0 },
    { name: "Cancellation Rate", value: row.cancellation_rate_pct || 0 },
    {
      name: "Pending Rate",
      value: parseFloat(
        (100 - (row.confirmation_rate_pct || 0) - (row.cancellation_rate_pct || 0)).toFixed(2)
      ),
    },
  ];

  const barData = [
    { name: "Confirmed", count: row.confirmed || 0 },
    { name: "Cancelled", count: row.cancelled || 0 },
    { name: "Pending", count: row.pending || 0 },
  ];

  const radarData = [
    {
      metric: "Total Bookings",
      value: Math.min((row.total_bookings || 0) / 50, 100),
    },
    { metric: "Confirmed", value: Math.min((row.confirmed || 0) / 50, 100) },
    { metric: "Cancelled", value: Math.min((row.cancelled || 0) / 50, 100) },
    { metric: "Pending", value: Math.min((row.pending || 0) / 50, 100) },
    {
      metric: "Unique Customers",
      value: Math.min((row.unique_customers || 0) * 5, 100),
    },
    { metric: "Confirm Rate", value: row.confirmation_rate_pct || 0 },
  ];

  const areaData = [
    { label: "Confirmed", value: row.confirmed || 0, rate: row.confirmation_rate_pct || 0 },
    { label: "Cancelled", value: row.cancelled || 0, rate: row.cancellation_rate_pct || 0 },
    {
      label: "Pending",
      value: row.pending || 0,
      rate: parseFloat(
        (100 - (row.confirmation_rate_pct || 0) - (row.cancellation_rate_pct || 0)).toFixed(2)
      ),
    },
  ];

  const gaugeData = [
    { name: "Confirmed", value: row.confirmation_rate_pct || 0 },
    { name: "Remaining", value: 100 - (row.confirmation_rate_pct || 0) },
  ];

  const comparisonData = [
    {
      name: "Bookings",
      confirmed: row.confirmed || 0,
      cancelled: row.cancelled || 0,
      pending: row.pending || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Booking Status Distribution - Pie Chart */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold text-lg">
            Booking Status Distribution
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Breakdown of {(row.total_bookings || 0).toLocaleString()} total bookings
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {statusData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: "#d1d5db", fontSize: "13px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Booking Counts - Bar Chart */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold text-lg">
            Booking Counts by Status
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Confirmed vs Cancelled vs Pending
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} barSize={50}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#4b5563" }}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#4b5563" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {barData.map((_, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rate Percentages - Donut Chart */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold text-lg">
            Rate Percentages
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Confirmation, Cancellation & Pending rates
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={rateData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={50}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              label={({ name, value }) => `${value}%`}
            >
              {rateData.map((_, index) => (
                <Cell
                  key={`rate-${index}`}
                  fill={colors[(index + 3) % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              formatter={(value: any) => `${value}%`}
            />
            <Legend wrapperStyle={{ color: "#d1d5db", fontSize: "13px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart - Values & Rates */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6 lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold text-lg">
            Status Volume & Rate Overview
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Booking volumes alongside their respective rate percentages
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors[0]}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={colors[0]}
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="gradRate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors[2]}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={colors[2]}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#4b5563" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#4b5563" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#4b5563" }}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#d1d5db", fontSize: "13px" }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              fill="url(#gradValue)"
              strokeWidth={2}
              name="Booking Count"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="rate"
              stroke={colors[2]}
              fill="url(#gradRate)"
              strokeWidth={2}
              name="Rate %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart - Overall Performance */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-lg">
            Performance Radar
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Normalized metrics overview (0-100 scale)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#4b5563" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#6b7280", fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke={colors[4] || colors[0]}
              fill={colors[4] || colors[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Confirmation Rate Gauge - Semi-donut */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-semibold text-lg">
            Confirmation Rate Gauge
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          {row.confirmation_rate_pct || 0}% of bookings confirmed
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="60%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={colors[0]} />
              <Cell fill="#374151" />
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center -mt-16">
          <span className="text-4xl font-bold text-white">
            {row.confirmation_rate_pct || 0}%
          </span>
          <p className="text-gray-400 text-sm mt-1">Confirmed</p>
        </div>
      </div>

      {/* Stacked Bar - Confirmed vs Cancelled vs Pending */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-rose-400" />
          <h3 className="text-white font-semibold text-lg">
            Stacked Comparison
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          All statuses stacked in a single bar
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData} barSize={80}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#4b5563" }}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#4b5563" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#d1d5db", fontSize: "13px" }} />
            <Bar
              dataKey="confirmed"
              stackId="a"
              fill={colors[0]}
              name="Confirmed"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="cancelled"
              stackId="a"
              fill={colors[1]}
              name="Cancelled"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="pending"
              stackId="a"
              fill={colors[2]}
              name="Pending"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats Card */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6 lg:col-span-3">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-semibold text-lg">
            Key Metrics Summary
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              label: "Total Bookings",
              value: (row.total_bookings || 0).toLocaleString(),
              color: colors[0],
              icon: <CalendarDays className="w-5 h-5" />,
            },
            {
              label: "Confirmed",
              value: (row.confirmed || 0).toLocaleString(),
              color: colors[1],
              icon: <TrendingUp className="w-5 h-5" />,
            },
            {
              label: "Cancelled",
              value: (row.cancelled || 0).toLocaleString(),
              color: colors[2],
              icon: <Activity className="w-5 h-5" />,
            },
            {
              label: "Pending",
              value: (row.pending || 0).toLocaleString(),
              color: colors[3] || colors[0],
              icon: <BarChart3 className="w-5 h-5" />,
            },
            {
              label: "Unique Customers",
              value: (row.unique_customers || 0).toLocaleString(),
              color: colors[4] || colors[1],
              icon: <Users className="w-5 h-5" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-900/50 border border-gray-700/40 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gray-600/60 transition-colors"
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                {item.icon}
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: item.color }}
              >
                {item.value}
              </span>
              <span className="text-gray-400 text-sm text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-400">
          <span>
            📅 Period: {row.earliest_booking || "N/A"} → {row.latest_booking || "N/A"}
          </span>
          <span>
            ✅ Confirmation Rate:{" "}
            <span className="text-green-400 font-semibold">
              {row.confirmation_rate_pct || 0}%
            </span>
          </span>
          <span>
            ❌ Cancellation Rate:{" "}
            <span className="text-red-400 font-semibold">
              {row.cancellation_rate_pct || 0}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}