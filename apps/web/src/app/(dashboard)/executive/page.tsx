"use client";

import { useState, useEffect, useMemo } from "react";
import { useFilterStore, getDaysFromPreset } from "@/stores/filter-store";
import { KPIRow } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/dashboard/data-table";
import { LineChartWidget } from "@/components/charts/line-chart-widget";
import { BarChartWidget } from "@/components/charts/bar-chart-widget";
import { DonutChartWidget } from "@/components/charts/donut-chart-widget";
import { AreaChartWidget } from "@/components/charts/area-chart-widget";
import {
  executiveKPIs, generateRevenueTrend, generateUserGrowth,
  generateRevenueByRegion, generateRevenueByTier, generateTableData,
} from "@/lib/mock-data";

export default function ExecutiveDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { dateRange, comparePeriod, region, platform, tier, setRegion, setTier } = useFilterStore();

  const days = getDaysFromPreset(dateRange.preset);
  const revenueData = useMemo(() => generateRevenueTrend(days), [days]);
  const userGrowthData = useMemo(() => generateUserGrowth(days), [days]);
  const regionData = useMemo(() => generateRevenueByRegion({ region, platform, tier }), [region, platform, tier]);
  const tierData = useMemo(() => generateRevenueByTier({ region, platform, tier }), [region, platform, tier]);
  const tableData = useMemo(() => generateTableData(100, 2026, { region, platform, tier }), [region, platform, tier]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dateRange, region, platform, tier]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Executive Overview"
        subtitle="Revenue, growth, and margin performance across all regions"
        updatedAt="2 min ago"
      />

      {/* KPI Cards */}
      <KPIRow kpis={executiveKPIs} alertKeys={["revenue"]} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChartWidget
            title="Revenue Trend"
            data={revenueData}
            showCompare={comparePeriod}
            isLoading={isLoading}
            onDataPointClick={(point) => {
              const d = new Date(point.date);
              useFilterStore.getState().setDateRange({ preset: "custom", start: d, end: d });
            }}
          />
        </div>
        <DonutChartWidget
          title="Revenue by Tier"
          data={tierData}
          centerLabel="$1.25M"
          isLoading={isLoading}
          activeFilterName={tier}
          onSegmentClick={(item) => {
            const v = item.name.toLowerCase();
            setTier(tier === v ? "all" : v);
          }}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartWidget
          title="Revenue by Region"
          data={regionData}
          isLoading={isLoading}
          activeFilterName={region === "all" ? undefined : { na: "north america", eu: "europe", apac: "asia pacific", latam: "latin america", mea: "middle east" }[region]}
          onBarClick={(item) => {
            const map: Record<string, string> = { "North America": "na", "Europe": "eu", "Asia Pacific": "apac", "Latin America": "latam", "Middle East": "mea" };
            const v = map[item.name] ?? "all";
            setRegion(region === v ? "all" : v);
          }}
        />
        <AreaChartWidget
          title="User Growth"
          data={userGrowthData}
          isLoading={isLoading}
        />
      </div>

      {/* Data Table */}
      <DataTable data={tableData} isLoading={isLoading} />
    </div>
  );
}
