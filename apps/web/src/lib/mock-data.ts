import type { KPIData, TimeSeriesPoint, BreakdownItem, FunnelStep, TableRow, AlertNotification, AlertRule } from "@/types";
import { CHART_COLORS } from "./utils";

// ─── Seeded RNG (mulberry32) — data stabil per seed ─────────────
function createRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const executiveKPIs: KPIData[] = [
  { key: "revenue", label: "Total Revenue", value: 1250000, formatted: "$1.25M", delta: 12.5, deltaDirection: "up", previousValue: 1111111, sparkline: [980000, 1010000, 1050000, 1100000, 1150000, 1200000, 1250000] },
  { key: "active_users", label: "Active Users", value: 48250, formatted: "48.2K", delta: 8.3, deltaDirection: "up", previousValue: 44550, sparkline: [38000, 39500, 41000, 42000, 44000, 46000, 48250] },
  { key: "cac", label: "Customer Acquisition Cost", value: 42, formatted: "$42", delta: -5.2, deltaDirection: "down", previousValue: 44.3, sparkline: [52, 50, 48, 46, 45, 43, 42] },
  { key: "nps", label: "Net Promoter Score", value: 67, formatted: "67", delta: 3.1, deltaDirection: "up", previousValue: 65, sparkline: [58, 60, 62, 63, 64, 66, 67] },
  { key: "gross_margin", label: "Gross Margin", value: 72.4, formatted: "72.4%", delta: 0.8, deltaDirection: "up", previousValue: 71.8, sparkline: [70, 70.5, 71, 71.2, 71.5, 72, 72.4] },
];

export const productKPIs: KPIData[] = [
  { key: "dau_mau", label: "DAU/MAU Ratio", value: 0.34, formatted: "34%", delta: 2.1, deltaDirection: "up", previousValue: 0.33, sparkline: [0.28, 0.29, 0.30, 0.31, 0.32, 0.33, 0.34] },
  { key: "conversion_rate", label: "Conversion Rate", value: 3.8, formatted: "3.8%", delta: 0.4, deltaDirection: "up", previousValue: 3.4, sparkline: [2.8, 3.0, 3.1, 3.3, 3.5, 3.6, 3.8] },
  { key: "avg_session", label: "Avg Session Duration", value: 342, formatted: "5m 42s", delta: -1.2, deltaDirection: "down", previousValue: 346, sparkline: [380, 370, 365, 355, 350, 346, 342] },
  { key: "campaign_roi", label: "Campaign ROI", value: 4.2, formatted: "4.2x", delta: 15.3, deltaDirection: "up", previousValue: 3.64, sparkline: [2.8, 3.0, 3.2, 3.5, 3.8, 4.0, 4.2] },
  { key: "churn_rate", label: "Churn Rate", value: 2.1, formatted: "2.1%", delta: -0.3, deltaDirection: "down", previousValue: 2.4, sparkline: [3.0, 2.8, 2.6, 2.5, 2.3, 2.2, 2.1] },
];

export const operationsKPIs: KPIData[] = [
  { key: "open_tickets", label: "Open Tickets", value: 23, formatted: "23", delta: -12.5, deltaDirection: "down", previousValue: 26, sparkline: [35, 32, 30, 28, 27, 26, 23] },
  { key: "avg_response", label: "Avg Response Time", value: 14, formatted: "14m", delta: -22.2, deltaDirection: "down", previousValue: 18, sparkline: [25, 22, 20, 19, 17, 18, 14] },
  { key: "sla_compliance", label: "SLA Compliance", value: 98.5, formatted: "98.5%", delta: 0.5, deltaDirection: "up", previousValue: 98.0, sparkline: [96, 96.5, 97, 97.5, 98, 98, 98.5] },
  { key: "uptime", label: "Server Uptime", value: 99.97, formatted: "99.97%", delta: 0.02, deltaDirection: "up", previousValue: 99.95, sparkline: [99.8, 99.85, 99.9, 99.92, 99.95, 99.96, 99.97] },
  { key: "error_rate", label: "Error Rate", value: 0.12, formatted: "0.12%", delta: -45.5, deltaDirection: "down", previousValue: 0.22, sparkline: [0.5, 0.4, 0.35, 0.3, 0.25, 0.22, 0.12] },
];

export const analystKPIs: KPIData[] = [
  { key: "query_count", label: "Queries Today", value: 1842, formatted: "1.8K", delta: 15.2, deltaDirection: "up", previousValue: 1599, sparkline: [1200, 1350, 1400, 1500, 1600, 1700, 1842] },
  { key: "data_freshness", label: "Data Freshness", value: 2.3, formatted: "2.3 min", delta: -8.0, deltaDirection: "down", previousValue: 2.5, sparkline: [5, 4.5, 4, 3.5, 3, 2.5, 2.3] },
  { key: "pipeline_success", label: "Pipeline Success", value: 99.2, formatted: "99.2%", delta: 0.3, deltaDirection: "up", previousValue: 98.9, sparkline: [97, 97.5, 98, 98.5, 98.8, 98.9, 99.2] },
  { key: "storage", label: "Storage Usage", value: 78.5, formatted: "78.5%", delta: 2.1, deltaDirection: "up", previousValue: 76.9, sparkline: [70, 72, 74, 75, 76, 77, 78.5] },
  { key: "api_latency", label: "API Latency (P95)", value: 45, formatted: "45ms", delta: -10.0, deltaDirection: "down", previousValue: 50, sparkline: [80, 72, 65, 58, 52, 50, 45] },
];

// ─── Chart Data Generators ────────────────────────────────────
export function generateRevenueTrend(days: number, seed = 42): TimeSeriesPoint[] {
  const rng = createRng(seed);
  const data: TimeSeriesPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 150000 + rng() * 50000;
    const previous = base * (0.85 + rng() * 0.2);
    data.push({ date: date.toISOString().split("T")[0], value: Math.round(base), previousValue: Math.round(previous) });
  }
  return data;
}

export function generateUserGrowth(days: number, seed = 137): TimeSeriesPoint[] {
  const rng = createRng(seed);
  const data: TimeSeriesPoint[] = [];
  const now = new Date();
  let cumulative = 42000;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    cumulative += Math.round(100 + rng() * 300);
    data.push({ date: date.toISOString().split("T")[0], value: cumulative });
  }
  return data;
}

export function generateErrorTrend(hours: number, seed = 777): TimeSeriesPoint[] {
  const rng = createRng(seed);
  const data: TimeSeriesPoint[] = [];
  const now = new Date();
  for (let i = hours - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    data.push({ date: date.toISOString().split("T")[0] + " " + String(date.getHours()).padStart(2, "0") + ":00", value: parseFloat((0.05 + rng() * 0.3).toFixed(3)) });
  }
  return data;
}

// ─── Filter-aware Breakdown Generators ───────────────────────
type FilterParams = { region?: string; platform?: string; tier?: string };

const regionValueMap: Record<string, string> = {
  na: "North America", eu: "Europe", apac: "Asia Pacific", latam: "Latin America", mea: "Middle East",
};

const REGION_BASE: Record<string, number> = {
  "North America": 520000, "Europe": 340000, "Asia Pacific": 245000,
  "Latin America": 85000, "Middle East": 60000,
};
const PLATFORM_BASE: Record<string, number> = {
  "Web": 18500, "iOS": 12200, "Android": 6800, "Others": 900,
};
const TIER_BASE: Record<string, number> = {
  "Enterprise": 680000, "Pro": 385000, "Free": 185000,
};

export function generateRevenueByRegion(filters: FilterParams = {}): BreakdownItem[] {
  const platformScale = filters.platform && filters.platform !== "all"
    ? ({ web: 0.48, ios: 0.32, android: 0.18 }[filters.platform] ?? 1) : 1;
  const tierScale = filters.tier && filters.tier !== "all"
    ? ({ enterprise: 0.544, pro: 0.308, free: 0.148 }[filters.tier] ?? 1) : 1;

  const allRegions = Object.entries(REGION_BASE).map(([name, base]) => ({
    name, rawValue: Math.round(base * platformScale * tierScale),
  }));

  const activeRegionName = filters.region && filters.region !== "all"
    ? regionValueMap[filters.region] : null;
  const filtered = activeRegionName
    ? allRegions.filter((r) => r.name === activeRegionName) : allRegions;

  const total = filtered.reduce((s, r) => s + r.rawValue, 0);
  return filtered.map((r, i) => ({
    name: r.name, value: r.rawValue, color: CHART_COLORS[i % CHART_COLORS.length],
    percentage: total > 0 ? parseFloat(((r.rawValue / total) * 100).toFixed(1)) : 0,
  }));
}

export function generateRevenueByTier(filters: FilterParams = {}): BreakdownItem[] {
  const platformScale = filters.platform && filters.platform !== "all"
    ? ({ web: 0.48, ios: 0.32, android: 0.18 }[filters.platform] ?? 1) : 1;
  const regionScale = filters.region && filters.region !== "all"
    ? ({ na: 0.416, eu: 0.272, apac: 0.196, latam: 0.068, mea: 0.048 }[filters.region] ?? 1) : 1;

  const allTiers = Object.entries(TIER_BASE).map(([name, base]) => ({
    name, rawValue: Math.round(base * platformScale * regionScale),
  }));

  const filtered = filters.tier && filters.tier !== "all"
    ? allTiers.filter((t) => t.name.toLowerCase() === filters.tier) : allTiers;

  const total = filtered.reduce((s, t) => s + t.rawValue, 0);
  return filtered.map((t, i) => ({
    name: t.name, value: t.rawValue, color: CHART_COLORS[i % CHART_COLORS.length],
    percentage: total > 0 ? parseFloat(((t.rawValue / total) * 100).toFixed(1)) : 0,
  }));
}

export function generateTrafficByPlatform(filters: FilterParams = {}): BreakdownItem[] {
  const regionScale = filters.region && filters.region !== "all"
    ? ({ na: 1.3, eu: 1.05, apac: 0.85, latam: 0.55, mea: 0.42 }[filters.region] ?? 1) : 1;
  const tierScale = filters.tier && filters.tier !== "all"
    ? ({ enterprise: 1.4, pro: 1.0, free: 0.6 }[filters.tier] ?? 1) : 1;

  const allPlatforms = Object.entries(PLATFORM_BASE).map(([name, base]) => ({
    name, rawValue: Math.round(base * regionScale * tierScale),
  }));

  const filtered = filters.platform && filters.platform !== "all"
    ? allPlatforms.filter((p) =>
        p.name.toLowerCase() === filters.platform ||
        (filters.platform === "ios" && p.name === "iOS"))
    : allPlatforms;

  const total = filtered.reduce((s, p) => s + p.rawValue, 0);
  return filtered.map((p, i) => ({
    name: p.name, value: p.rawValue, color: CHART_COLORS[i % CHART_COLORS.length],
    percentage: total > 0 ? parseFloat(((p.rawValue / total) * 100).toFixed(1)) : 0,
  }));
}

// Static fallbacks (backward-compat if needed)
export const revenueByRegion: BreakdownItem[] = generateRevenueByRegion();
export const revenueByTier: BreakdownItem[] = generateRevenueByTier();
export const trafficByPlatform: BreakdownItem[] = generateTrafficByPlatform();

export const conversionFunnel: FunnelStep[] = [
  { name: "Visited Site", value: 48250, percentage: 100, dropOff: 0 },
  { name: "Signed Up", value: 12840, percentage: 26.6, dropOff: 73.4 },
  { name: "Activated", value: 8150, percentage: 16.9, dropOff: 36.5 },
  { name: "Started Trial", value: 4320, percentage: 9.0, dropOff: 47.0 },
  { name: "Purchased", value: 1830, percentage: 3.8, dropOff: 57.6 },
];

// ─── Table Data Generator ─────────────────────────────────────
const regionsDim = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"];
const platformsDim = ["Web", "iOS", "Android"];
const tiersDim = ["Free", "Pro", "Enterprise"];
const campaigns = ["Organic", "Summer Sale", "Black Friday", "Referral", "Social Media"];

export function generateTableData(count: number, seed = 2026, filters?: { region?: string; platform?: string; tier?: string }): TableRow[] {
  const rng = createRng(seed);
  const data: TableRow[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(rng() * 30));
    data.push({
      id: `row-${i}`,
      date: date.toISOString().split("T")[0],
      region: regionsDim[Math.floor(rng() * regionsDim.length)],
      platform: platformsDim[Math.floor(rng() * platformsDim.length)],
      tier: tiersDim[Math.floor(rng() * tiersDim.length)],
      campaign: campaigns[Math.floor(rng() * campaigns.length)],
      users: Math.round(100 + rng() * 5000),
      revenue: Math.round(1000 + rng() * 50000),
      conversion: parseFloat((1 + rng() * 8).toFixed(2)),
      sessions: Math.round(500 + rng() * 15000),
    });
  }
  let result = data;
  if (filters?.region && filters.region !== "all") {
    const name = regionValueMap[filters.region];
    if (name) result = result.filter((r) => r.region === name);
  }
  if (filters?.platform && filters.platform !== "all") {
    // "ios" → "iOS", others → capitalize first letter
    const name = filters.platform === "ios" ? "iOS"
      : filters.platform.charAt(0).toUpperCase() + filters.platform.slice(1);
    result = result.filter((r) => r.platform === name);
  }
  if (filters?.tier && filters.tier !== "all") {
    const name = filters.tier.charAt(0).toUpperCase() + filters.tier.slice(1);
    result = result.filter((r) => r.tier === name);
  }
  return result.sort((a, b) => (b.date as string).localeCompare(a.date as string));
}



// ─── Alerts Data ──────────────────────────────────────────────
export const mockAlertRules: AlertRule[] = [
  { id: "rule-1", name: "High Error Rate", metricKey: "error_rate", condition: "gt", thresholdValue: 5, evaluationWindow: "1h", severity: "critical", notificationChannels: ["in_app", "slack"], cooldownMinutes: 30, isActive: true, lastTriggeredAt: "2026-08-23T14:30:00Z" },
  { id: "rule-2", name: "Revenue Drop Alert", metricKey: "revenue", condition: "pct_change_lt", thresholdValue: -15, evaluationWindow: "24h", severity: "warning", notificationChannels: ["in_app", "email"], cooldownMinutes: 60, isActive: true, lastTriggeredAt: "2026-08-22T09:15:00Z" },
  { id: "rule-3", name: "Low SLA Compliance", metricKey: "sla_compliance", condition: "lt", thresholdValue: 95, evaluationWindow: "6h", severity: "warning", notificationChannels: ["in_app"], cooldownMinutes: 15, isActive: true, lastTriggeredAt: null },
];

export const mockAlertNotifications: AlertNotification[] = [
  { id: "notif-1", ruleId: "rule-1", ruleName: "High Error Rate", triggeredValue: 6.2, thresholdValue: 5, status: "active", severity: "critical", triggeredAt: "2026-08-23T14:30:00Z", message: "Error rate exceeded 5% threshold: current value is 6.2%" },
  { id: "notif-2", ruleId: "rule-2", ruleName: "Revenue Drop Alert", triggeredValue: -18.5, thresholdValue: -15, status: "acknowledged", severity: "warning", triggeredAt: "2026-08-22T09:15:00Z", acknowledgedAt: "2026-08-22T09:45:00Z", message: "Revenue dropped 18.5% compared to previous period" },
  { id: "notif-3", ruleId: "rule-1", ruleName: "High Error Rate", triggeredValue: 5.8, thresholdValue: 5, status: "resolved", severity: "critical", triggeredAt: "2026-08-21T18:00:00Z", acknowledgedAt: "2026-08-21T18:10:00Z", message: "Error rate exceeded 5% threshold: current value is 5.8%" },
];

export const kpiMap: Record<string, KPIData[]> = {
  executive: executiveKPIs,
  product: productKPIs,
  operations: operationsKPIs,
  analyst: analystKPIs,
};

