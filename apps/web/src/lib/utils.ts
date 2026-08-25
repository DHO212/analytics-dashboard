import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function getDeltaColor(direction: "up" | "down" | "neutral"): string {
  switch (direction) {
    case "up":      return "text-[rgb(var(--positive))]";
    case "down":    return "text-[rgb(var(--negative))]";
    case "neutral": return "text-[rgb(var(--text-3))]";
  }
}

export function getSeverityColor(severity: "info" | "warning" | "critical"): string {
  switch (severity) {
    case "info": return "bg-blue-500";
    case "warning": return "bg-amber-500";
    case "critical": return "bg-red-500";
  }
}

export function getSeverityBgColor(severity: "info" | "warning" | "critical"): string {
  switch (severity) {
    case "info": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "warning": return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "critical": return "bg-red-500/10 text-red-600 dark:text-red-400";
  }
}

// Chart palette — single-saturation family, avoids AI rainbow slop
export const CHART_COLORS = [
  "#3B82F6", // blue-500   (primary series)
  "#64748B", // slate-500  (compare / secondary series)
  "#06B6D4", // cyan-500   (tertiary)
  "#F59E0B", // amber-500  (highlight / warning series)
  "#94A3B8", // slate-400  (muted reference line)
];
