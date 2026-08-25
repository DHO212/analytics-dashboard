"use client";

import { memo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { motion } from "motion/react";
import type { TimeSeriesPoint } from "@/types";
import { CHART_COLORS } from "@/lib/utils";
import { SkeletonChart } from "@/components/ui/skeleton";

interface AreaChartWidgetProps {
  title: string;
  data: TimeSeriesPoint[];
  color?: string;
  isLoading?: boolean;
}

const TICK_STYLE = {
  fontSize: 10,
  fontFamily: "'Fira Code', monospace",
  fill: "var(--color-text-3, #94A3B8)",
};

const CustomTooltip = memo(function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[6px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 shadow-xl">
      <p className="mb-1 text-[10.5px] font-medium text-[rgb(var(--text-3))]">{label}</p>
      <p className="font-code text-[13px] font-semibold tabular text-[rgb(var(--text))]">
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
});

export const AreaChartWidget = memo(function AreaChartWidget({
  title, data, color = CHART_COLORS[0], isLoading,
}: AreaChartWidgetProps) {
  if (isLoading) return <SkeletonChart />;

  const gradId = `ag-${title.replace(/\s+/g, "-")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="widget"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[rgb(var(--text))]">{title}</h3>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={color} stopOpacity={0.18} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgb(var(--border) / 0.5)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={TICK_STYLE}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: string) => {
                const d = new Date(val);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <YAxis
              tick={TICK_STYLE}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => {
                if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                return String(val);
              }}
              width={36}
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: "rgb(var(--border))", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#${gradId})`}
              animationDuration={700}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});
