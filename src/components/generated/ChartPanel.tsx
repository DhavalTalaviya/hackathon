/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import DynamicDashboard, { DashboardConfig } from "@/components/dashboard/DynamicDashboard";

interface ChartPanelProps {
  config: DashboardConfig;
  colors: string[];
}

export default function ChartPanel({
  config,
  colors,
}: ChartPanelProps) {
  if (!config) return null;

  const handleChartClick = (query: string) => {
    window.dispatchEvent(new CustomEvent("trigger-chat", { detail: query }));
  };

  return (
    <DynamicDashboard
      data={[]}
      config={config}
      colors={colors}
      onChartClick={handleChartClick}
    />
  );
}