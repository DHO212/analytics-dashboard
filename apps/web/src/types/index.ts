// ─── KPI Types ────────────────────────────────────────────────
export interface KPIData {
  key: string;
  label: string;
  value: number;
  formatted: string;
  delta: number;
  deltaDirection: "up" | "down" | "neutral";
  previousValue: number;
  sparkline: number[];
}

// ─── Chart Types ──────────────────────────────────────────────
export interface TimeSeriesPoint {
  date: string;
  value: number;
  previousValue?: number;
  [key: string]: string | number | undefined;
}

export interface BreakdownItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface FunnelStep {
  name: string;
  value: number;
  percentage: number;
  dropOff: number;
}

// ─── Table Types ──────────────────────────────────────────────
export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
  visible: boolean;
  width?: string;
}

export interface TableRow {
  id: string;
  [key: string]: string | number | boolean;
}

// ─── Filter Types ─────────────────────────────────────────────
export interface DateRange {
  preset: string;
  start: Date;
  end: Date;
}

export interface FilterState {
  dateRange: DateRange;
  comparePeriod: boolean;
  region: string;
  platform: string;
  tier: string;
  campaign: string;
}

// ─── Alert Types ──────────────────────────────────────────────
export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface AlertRule {
  id: string;
  name: string;
  metricKey: string;
  condition: "gt" | "lt" | "eq" | "pct_change_gt" | "pct_change_lt";
  thresholdValue: number;
  evaluationWindow: string;
  severity: AlertSeverity;
  notificationChannels: string[];
  cooldownMinutes: number;
  isActive: boolean;
  lastTriggeredAt: string | null;
}

export interface AlertNotification {
  id: string;
  ruleId: string;
  ruleName: string;
  triggeredValue: number;
  thresholdValue: number;
  status: AlertStatus;
  severity: AlertSeverity;
  triggeredAt: string;
  acknowledgedAt?: string;
  message: string;
}

// ─── Dashboard Types ──────────────────────────────────────────
export type DashboardType = "executive" | "product" | "operations" | "analyst";

export interface WidgetConfig {
  id: string;
  type: "kpi" | "line-chart" | "bar-chart" | "donut-chart" | "area-chart" | "gauge" | "table" | "funnel";
  title: string;
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
}

export interface UserRole {
  name: string;
  displayName: string;
  permissions: {
    dashboards: DashboardType[];
    features: string[];
  };
}

// ─── Navigation Types ─────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
