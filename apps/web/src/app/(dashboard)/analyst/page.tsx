"use client";

import { useState, useEffect, useMemo } from "react";
import { useFilterStore, getDaysFromPreset } from "@/stores/filter-store";
import { KPIRow } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/dashboard/data-table";
import { LineChartWidget } from "@/components/charts/line-chart-widget";
import { AreaChartWidget } from "@/components/charts/area-chart-widget";
import { BarChartWidget } from "@/components/charts/bar-chart-widget";
import {
  analystKPIs, generateRevenueTrend, generateErrorTrend,
  revenueByRegion, generateTableData,
} from "@/lib/mock-data";

export default function AnalystDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { dateRange, comparePeriod } = useFilterStore();

  const days = getDaysFromPreset(dateRange.preset);
  const queryTrend = useMemo(() => generateRevenueTrend(days), [days]);
  const latencyTrend = useMemo(() => generateErrorTrend(Math.min(days * 24, 168)), [days]);
  const tableData = useMemo(() => generateTableData(120, 4099), [dateRange]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dateRange]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Data Analyst Workspace"
        subtitle="Query throughput, latency, and pipeline reliability"
        updatedAt="7 min ago"
      />

      <KPIRow kpis={analystKPIs} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChartWidget
          title="Query Volume"
          data={queryTrend}
          showCompare={comparePeriod}
          isLoading={isLoading}
        />
        <AreaChartWidget
          title="API Latency"
          data={latencyTrend}
          color="#F59E0B"
          isLoading={isLoading}
        />
      </div>

      <BarChartWidget
        title="Queries by Region"
        data={revenueByRegion}
        isLoading={isLoading}
      />

      <DataTable data={tableData} isLoading={isLoading} />
    </div>
  );
}
