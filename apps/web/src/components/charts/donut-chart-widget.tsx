"use client";

import { memo, useState } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { motion } from "motion/react";
import type { BreakdownItem } from "@/types";
import { SkeletonChart } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";

interface DonutChartWidgetProps {
  title: string;
  data: BreakdownItem[];
  centerLabel?: string;
  isLoading?: boolean;
  activeFilterName?: string;
  onSegmentClick?: (item: BreakdownItem) => void;
}

const CustomTooltip = memo(function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as BreakdownItem;
  return (
    <div className="rounded-[6px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="text-[12.5px] font-medium text-[rgb(var(--text))]">{item.name}</span>
      </div>
      <p className="mt-1 font-code text-[12px] tabular text-[rgb(var(--text-2))]">{item.value.toLocaleString()}</p>
      <p className="text-[10.5px] text-[rgb(var(--text-3))]">{item.percentage}%</p>
    </div>
  );
});

export const DonutChartWidget = memo(function DonutChartWidget({
  title, data, centerLabel, isLoading, activeFilterName, onSegmentClick,
}: DonutChartWidgetProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (isLoading) return <SkeletonChart />;

  const total = data.reduce((sum, d) => sum + d.value, 0);

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

      <div className="flex items-center gap-5">
        {/* Donut */}
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
                animationDuration={600}
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(d: any) => onSegmentClick?.(d)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.25}
                    stroke="none"
                    cursor="pointer"
                  />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label — Fira Code, precise */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-code text-[1.05rem] font-semibold tabular leading-none text-[rgb(var(--text))]">
              {centerLabel || formatNumber(total)}
            </span>
            <span className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.1em] text-[rgb(var(--text-3))]">
              total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1">
          {data.map((item, i) => {
            const isActive = activeFilterName === item.name.toLowerCase();
            return (
              <button
                key={item.name}
                className={[
                  "flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left transition-all duration-100",
                  isActive
                    ? "bg-[rgb(var(--accent)/0.08)] ring-1 ring-[rgb(var(--accent)/0.2)]"
                    : "hover:bg-[rgb(var(--surface-2))]",
                ].join(" ")}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => onSegmentClick?.(item)}
              >
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className={[
                    "flex-1 truncate text-[12px]",
                    isActive
                      ? "font-semibold text-[rgb(var(--accent))]"
                      : "text-[rgb(var(--text-2))]",
                  ].join(" ")}
                >
                  {item.name}
                </span>
                <span className="font-code text-[11.5px] font-medium tabular text-[rgb(var(--text))]">
                  {item.percentage}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});
