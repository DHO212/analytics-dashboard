"use client";

import { memo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Cell,
} from "recharts";
import { motion } from "motion/react";
import type { BreakdownItem } from "@/types";
import { SkeletonChart } from "@/components/ui/skeleton";

interface BarChartWidgetProps {
  title: string;
  data: BreakdownItem[];
  isLoading?: boolean;
  activeFilterName?: string;
  onBarClick?: (item: BreakdownItem) => void;
}

const TICK_MONO = {
  fontSize: 10,
  fontFamily: "'Fira Code', monospace",
  fill: "#94A3B8",
};

const TICK_SANS = {
  fontSize: 11.5,
  fontFamily: "inherit",
  fill: "#64748B",
};

const CustomTooltip = memo(function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as BreakdownItem;
  return (
    <div className="rounded-[6px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 shadow-xl">
      <p className="text-[12.5px] font-medium text-[rgb(var(--text))]">{item.name}</p>
      <p className="font-code text-[12px] tabular text-[rgb(var(--text-2))]">{item.value.toLocaleString()}</p>
      <p className="text-[10.5px] text-[rgb(var(--text-3))]">{item.percentage}% of total</p>
    </div>
  );
});

export const BarChartWidget = memo(function BarChartWidget({
  title, data, isLoading, activeFilterName, onBarClick,
}: BarChartWidgetProps) {
  if (isLoading) return <SkeletonChart />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="widget"
    >
      <div className="mb-4">
        <h3 className="text-[13px] font-semibold text-[rgb(var(--text))]">{title}</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 20, bottom: 0, left: 12 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgb(var(--border) / 0.5)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={TICK_MONO}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => {
                if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
                if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
                return String(val);
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={TICK_SANS}
              tickLine={false}
              axisLine={false}
              width={92}
            />
            <RechartsTooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgb(var(--surface-2) / 0.5)" }}
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              onClick={(d: any) => onBarClick?.(d)}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  opacity={
                    activeFilterName && activeFilterName !== entry.name.toLowerCase()
                      ? 0.25
                      : 1
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});
