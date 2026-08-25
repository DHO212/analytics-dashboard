"use client";

import { memo } from "react";
import { motion } from "motion/react";
import type { FunnelStep } from "@/types";
import { CHART_COLORS } from "@/lib/utils";
import { SkeletonChart } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";

interface FunnelChartWidgetProps {
  title: string;
  data: FunnelStep[];
  isLoading?: boolean;
  onStepClick?: (step: FunnelStep) => void;
}

export const FunnelChartWidget = memo(function FunnelChartWidget({
  title, data, isLoading, onStepClick,
}: FunnelChartWidgetProps) {
  if (isLoading) return <SkeletonChart />;

  const maxValue = data[0]?.value || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="widget"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[rgb(var(--text))]">{title}</h3>
      </div>
      <div className="space-y-3">
        {data.map((step, i) => {
          const widthPercent = (step.value / maxValue) * 100;
          return (
            <motion.button
              key={step.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.08 }}
              onClick={() => onStepClick?.(step)}
              className="group w-full text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[rgb(var(--text-2))]">{step.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular font-semibold text-[rgb(var(--text))]">{formatNumber(step.value)}</span>
                  <span className="text-xs tabular text-[rgb(var(--text-2))]">({step.percentage}%)</span>
                </div>
              </div>
              <div className="relative h-8 w-full rounded-md bg-[rgb(var(--surface-2))] overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.2 + i * 0.08 }}
                />
                {step.dropOff > 0 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] font-medium text-red-500 tabular">
                      -{step.dropOff}%
                    </span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
});
