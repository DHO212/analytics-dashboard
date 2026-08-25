"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { SkeletonChart } from "@/components/ui/skeleton";

interface GaugeWidgetProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  isLoading?: boolean;
}

export const GaugeWidget = memo(function GaugeWidget({
  title, value, target, unit, isLoading,
}: GaugeWidgetProps) {
  if (isLoading) return <SkeletonChart />;

  const percentage = Math.min((value / target) * 100, 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  const getColor = () => {
    if (percentage >= 95) return "#22C55E";
    if (percentage >= 80) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="widget flex flex-col items-center"
    >
      <h3 className="mb-4 text-sm font-semibold text-[rgb(var(--text))] self-start">{title}</h3>
      <div className="relative">
        <svg width="160" height="120" viewBox="0 0 160 120">
          {/* Background arc */}
          <path
            d="M 20 100 A 54 54 0 1 1 140 100"
            fill="none"
            stroke="rgb(var(--surface-2))"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <motion.path
            d="M 20 100 A 54 54 0 1 1 140 100"
            fill="none"
            stroke={getColor()}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference * 0.75}
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className="text-3xl font-bold text-[rgb(var(--text))] tabular">{value}</span>
          <span className="text-xs text-[rgb(var(--text-2))]">{unit}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-[rgb(var(--text-2))]">
        <span>Target: {target}{unit}</span>
        <span className={percentage >= 95 ? "text-emerald-500" : percentage >= 80 ? "text-amber-500" : "text-red-500"}>
          {percentage.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
});
