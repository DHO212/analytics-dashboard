"use client";

import { useState, useEffect, useMemo } from "react";
import { useFilterStore, getDaysFromPreset } from "@/stores/filter-store";
import { KPIRow } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/dashboard/data-table";
import { LineChartWidget } from "@/components/charts/line-chart-widget";
import { GaugeWidget } from "@/components/charts/gauge-widget";
import { AreaChartWidget } from "@/components/charts/area-chart-widget";
import {
  operationsKPIs, generateErrorTrend, generateRevenueTrend, generateTableData,
} from "@/lib/mock-data";

export default function OperationsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { dateRange } = useFilterStore();

  const days = getDaysFromPreset(dateRange.preset);
  const errorTrend = useMemo(() => generateErrorTrend(Math.min(days * 24, 168)), [days]);
  const responseTrend = useMemo(() => generateRevenueTrend(days), [days]);
  const tableData = useMemo(() => generateTableData(60, 5051), [dateRange]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dateRange]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Operations Health"
        subtitle="Uptime, SLA compliance, and incident response across services"
        updatedAt="just now"
      />

      <KPIRow kpis={operationsKPIs} alertKeys={["error_rate"]} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GaugeWidget title="SLA Compliance" value={98.5} target={100} unit="%" isLoading={isLoading} />
        <GaugeWidget title="Server Uptime" value={99.97} target={100} unit="%" isLoading={isLoading} />
        <GaugeWidget title="Response Time" value={14} target={30} unit="min" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AreaChartWidget title="Error Rate (24h)" data={errorTrend} color="#EF4444" isLoading={isLoading} />
        <LineChartWidget title="Response Time Trend" data={responseTrend} isLoading={isLoading} />
      </div>

      <DataTable data={tableData} isLoading={isLoading} />
    </div>
  );
}
