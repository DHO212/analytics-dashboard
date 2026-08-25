"use client";

import { useState, useEffect, useMemo } from "react";
import { useFilterStore, getDaysFromPreset } from "@/stores/filter-store";
import { KPIRow } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/dashboard/data-table";
import { LineChartWidget } from "@/components/charts/line-chart-widget";
import { DonutChartWidget } from "@/components/charts/donut-chart-widget";
import { FunnelChartWidget } from "@/components/charts/funnel-chart-widget";
import { AreaChartWidget } from "@/components/charts/area-chart-widget";
import {
  productKPIs, generateRevenueTrend, generateUserGrowth,
  generateTrafficByPlatform, conversionFunnel, generateTableData,
} from "@/lib/mock-data";

export default function ProductDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { dateRange, comparePeriod, region, platform, tier, setPlatform } = useFilterStore();

  const days = getDaysFromPreset(dateRange.preset);
  const sessionData = useMemo(() => generateRevenueTrend(days), [days]);
  const userGrowthData = useMemo(() => generateUserGrowth(days), [days]);
  const platformData = useMemo(() => generateTrafficByPlatform({ region, platform, tier }), [region, platform, tier]);
  const tableData = useMemo(() => generateTableData(80, 3031, { region, platform, tier }), [region, platform, tier]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dateRange, region, platform, tier]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Product Performance"
        subtitle="Engagement, conversion, and retention metrics by platform"
        updatedAt="4 min ago"
      />

      <KPIRow kpis={productKPIs} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FunnelChartWidget
          title="Signup to Purchase Funnel"
          data={conversionFunnel}
          isLoading={isLoading}
          onStepClick={() => {}}
        />
        <DonutChartWidget
          title="Traffic by Platform"
          data={platformData}
          centerLabel="38.4K"
          isLoading={isLoading}
          activeFilterName={platform}
          onSegmentClick={(item) => {
            const v = item.name.toLowerCase();
            setPlatform(platform === v ? "all" : v);
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChartWidget
          title="Session Duration Trend"
          data={sessionData}
          showCompare={comparePeriod}
          isLoading={isLoading}
        />
        <AreaChartWidget
          title="Daily Active Users"
          data={userGrowthData}
          color="#06B6D4"
          isLoading={isLoading}
        />
      </div>

      <DataTable data={tableData} isLoading={isLoading} />
    </div>
  );
}
