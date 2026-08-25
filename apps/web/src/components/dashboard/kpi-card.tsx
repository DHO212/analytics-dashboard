"use client";

import { memo, useMemo } from "react";
import { motion } from "motion/react";
import { TrendUp, TrendDown, Minus, Warning } from "@phosphor-icons/react";
import type { KPIData } from "@/types";
import { cn, getDeltaColor, formatPercentage } from "@/lib/utils";

// ─── Sparkline — thin, precise, no fill overload ─────────────
const Sparkline = memo(function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const path = useMemo(() => {
    if (data.length < 2) return "";
    const W = 200;
    const H = 28;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * W,
      y: H - ((v - min) / range) * (H - 4) - 2,
    }));

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1];
      const c = pts[i];
      const cx = (p.x + c.x) / 2;
      d += ` C ${cx} ${p.y}, ${cx} ${c.y}, ${c.x} ${c.y}`;
    }
    return d;
  }, [data]);

  const areaPath = path ? `${path} L 200 28 L 0 28 Z` : "";
  const gradId = `sg-${color.replace("#", "")}`;

  return (
    <svg
      width="100%"
      height="28"
      viewBox="0 0 200 28"
      preserveAspectRatio="none"
      className="block"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaPath && (
        <path d={areaPath} fill={`url(#${gradId})`} />
      )}
      {path && (
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
        />
      )}
    </svg>
  );
});

// ─── KPI Card ─────────────────────────────────────────────────
interface KPICardProps {
  data: KPIData;
  index: number;
  hasAlert?: boolean;
}

export const KPICard = memo(function KPICard({
  data,
  index,
  hasAlert,
}: KPICardProps) {
  const DeltaIcon =
    data.deltaDirection === "up"
      ? TrendUp
      : data.deltaDirection === "down"
      ? TrendDown
      : Minus;

  // Single-hue sparkline colors: semantic + blue neutral
  const sparkColor =
    data.deltaDirection === "up"
      ? "#4ADE80"  // green-400
      : data.deltaDirection === "down"
      ? "#F87171"  // red-400
      : "#60A5FA"; // blue-400 — not gray, still neutral but alive

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 26,
        delay: index * 0.035,
      }}
      className={cn(
        "widget group relative cursor-default select-none overflow-hidden",
        hasAlert && "ring-1 ring-[rgb(var(--negative)/0.25)]"
      )}
    >
      {/* Alert strip — top hairline, not an icon soup */}
      {hasAlert && (
        <span
          className="absolute inset-x-0 top-0 h-[2px] bg-[rgb(var(--negative)/0.5)]"
          aria-hidden="true"
        />
      )}

      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <p className="kpi-label">{data.label}</p>
        {hasAlert && (
          <Warning
            size={12}
            weight="fill"
            className="shrink-0 text-[rgb(var(--negative)/0.7)]"
            aria-label="Alert"
          />
        )}
      </div>

      {/* Big number — Fira Code, center of the card */}
      <div className="mt-3">
        <span className="kpi-value" aria-label={`${data.label}: ${data.formatted}`}>
          {data.formatted}
        </span>
      </div>

      {/* Delta row */}
      <div className="mt-1.5 flex items-center gap-1">
        <DeltaIcon
          size={12}
          weight="bold"
          className={getDeltaColor(data.deltaDirection)}
          aria-hidden="true"
        />
        <span
          className={cn(
            "kpi-delta",
            data.deltaDirection === "up" && "kpi-delta-positive",
            data.deltaDirection === "down" && "kpi-delta-negative",
            data.deltaDirection === "neutral" && "kpi-delta-neutral"
          )}
        >
          {formatPercentage(data.delta)}
        </span>
        <span className="text-[10.5px] text-[rgb(var(--text-3))]">vs prev</span>
      </div>

      {/* Sparkline — bottom strip, no box */}
      <div className="mt-3.5">
        <Sparkline data={data.sparkline} color={sparkColor} />
      </div>
    </motion.div>
  );
});

// ─── KPI Row ──────────────────────────────────────────────────
interface KPIRowProps {
  kpis: KPIData[];
  alertKeys?: string[];
}

export function KPIRow({ kpis, alertKeys = [] }: KPIRowProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {kpis.map((kpi, i) => (
        <KPICard
          key={kpi.key}
          data={kpi}
          index={i}
          hasAlert={alertKeys.includes(kpi.key)}
        />
      ))}
    </div>
  );
}
