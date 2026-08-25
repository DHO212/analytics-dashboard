"use client";

import { memo, useState, useCallback } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { motion } from "motion/react";
import type { TimeSeriesPoint } from "@/types";
import { CHART_COLORS } from "@/lib/utils";
import { SkeletonChart } from "@/components/ui/skeleton";

interface LineChartWidgetProps {
  title: string;
  data: TimeSeriesPoint[];
  showCompare?: boolean;
  isLoading?: boolean;
  onDataPointClick?: (point: TimeSeriesPoint) => void;
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
      <p className="mb-1.5 text-[10.5px] font-medium text-[rgb(var(--text-3))]">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-[10.5px] text-[rgb(var(--text-2))]">{entry.name}</span>
          <span className="font-code text-[12px] font-semibold tabular text-[rgb(var(--text))]">
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});

export const LineChartWidget = memo(function LineChartWidget({
  title, data, showCompare, isLoading, onDataPointClick,
}: LineChartWidgetProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSeries = useCallback((dataKey: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(dataKey)) next.delete(dataKey);
      else next.add(dataKey);
      return next;
    });
  }, []);

  if (isLoading) return <SkeletonChart />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="widget"
    >
      {/* Header with legend inline */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[rgb(var(--text))]">{title}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleSeries("value")}
            className="flex items-center gap-1.5 text-[10.5px] text-[rgb(var(--text-2))] transition-opacity hover:opacity-70"
          >
            <span
              className="block h-[2px] w-5 rounded-full"
              style={{ backgroundColor: CHART_COLORS[0] }}
            />
            <span className={hiddenSeries.has("value") ? "line-through opacity-40" : ""}>
              Current
            </span>
          </button>
          {showCompare && (
            <button
              onClick={() => toggleSeries("previousValue")}
              className="flex items-center gap-1.5 text-[10.5px] text-[rgb(var(--text-2))] transition-opacity hover:opacity-70"
            >
              <span
                className="block h-[1.5px] w-5 rounded-full opacity-60"
                style={{
                  backgroundColor: CHART_COLORS[4],
                  backgroundImage: `repeating-linear-gradient(90deg, transparent 0 2px, rgb(var(--surface)) 2px 5px)`,
                }}
              />
              <span className={hiddenSeries.has("previousValue") ? "line-through opacity-40" : "opacity-60"}>
                Previous
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
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
              width={42}
              tickFormatter={(val: number) => {
                if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
                if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
                return String(val);
              }}
            />
            <RechartsTooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgb(var(--border))", strokeWidth: 1 }}
            />
            {!hiddenSeries.has("value") && (
              <Line
                type="monotone"
                dataKey="value"
                name="Current Period"
                stroke={CHART_COLORS[0]}
                strokeWidth={1.5}
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: CHART_COLORS[0],
                  strokeWidth: 1.5,
                  fill: "rgb(var(--surface))",
                  onClick: (_: any, payload: any) => onDataPointClick?.(payload),
                  style: { cursor: "pointer" },
                }}
                animationDuration={700}
                animationEasing="ease-out"
              />
            )}
            {showCompare && !hiddenSeries.has("previousValue") && (
              <Line
                type="monotone"
                dataKey="previousValue"
                name="Previous Period"
                stroke={CHART_COLORS[4]}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                strokeOpacity={0.55}
                dot={false}
                animationDuration={700}
                animationEasing="ease-out"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});
