"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Bell, Plus, Check, Clock, Warning, Info, XCircle, Trash } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/layout/page-header";
import { cn, getSeverityBgColor } from "@/lib/utils";
import { mockAlertRules, mockAlertNotifications } from "@/lib/mock-data";
import type { AlertNotification, AlertRule, AlertSeverity } from "@/types";

const severityIcons = {
  info: Info,
  warning: Warning,
  critical: XCircle,
};

const metricOptions = [
  { value: "revenue", label: "Revenue" },
  { value: "active_users", label: "Active Users" },
  { value: "error_rate", label: "Error Rate" },
  { value: "conversion_rate", label: "Conversion Rate" },
  { value: "sla_compliance", label: "SLA Compliance" },
  { value: "churn_rate", label: "Churn Rate" },
];

const conditionOptions = [
  { value: "gt", label: "Greater than (>)" },
  { value: "lt", label: "Less than (<)" },
  { value: "eq", label: "Equals (=)" },
  { value: "pct_change_gt", label: "% change greater than" },
  { value: "pct_change_lt", label: "% change less than" },
];

const windowOptions = [
  { value: "15m", label: "15 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "6h", label: "6 hours" },
  { value: "24h", label: "24 hours" },
];

const severityOptions = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
];

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "rules">("notifications");
  const [rules, setRules] = useState<AlertRule[]>(mockAlertRules);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Alert Management"
        subtitle="Monitor and manage alert rules and notifications"
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} />
            New Alert Rule
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-[rgb(var(--surface-2))] p-1 w-fit">
        {(["notifications", "rules"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors capitalize",
              activeTab === tab
                ? "bg-[rgb(var(--surface))] text-[rgb(var(--text))] shadow-sm"
                : "text-[rgb(var(--text-2))] hover:text-[rgb(var(--text))]"
            )}
          >
            {tab}
            {tab === "notifications" && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {mockAlertNotifications.filter(n => n.status === "active").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "notifications" ? (
        <div className="space-y-3">
          {mockAlertNotifications.map((notif, i) => (
            <NotificationCard key={notif.id} notification={notif} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.05 }}
              className="widget"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("h-2.5 w-2.5 rounded-full", rule.isActive ? "bg-emerald-500" : "bg-[rgb(var(--border))]")} />
                  <div>
                    <h4 className="text-sm font-semibold text-[rgb(var(--text))]">{rule.name}</h4>
                    <p className="text-xs text-[rgb(var(--text-2))] mt-0.5">
                      {rule.metricKey} {rule.condition} {rule.thresholdValue} | Window: {rule.evaluationWindow} | Cooldown: {rule.cooldownMinutes}m
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={rule.severity === "critical" ? "danger" : rule.severity === "warning" ? "warning" : "info"}>
                    {rule.severity}
                  </Badge>
                  <Badge variant="outline">
                    {rule.notificationChannels.join(", ")}
                  </Badge>
                  <button
                    onClick={() => setRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, isActive: !r.isActive } : r))}
                    className={cn("relative h-5 w-9 rounded-full transition-colors", rule.isActive ? "bg-emerald-500" : "bg-[rgb(var(--border))]")}
                    title={rule.isActive ? "Disable rule" : "Enable rule"}
                  >
                    <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-[rgb(var(--surface))] shadow transition-all", rule.isActive ? "left-[22px]" : "left-0.5")} />
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => setRules((prev) => prev.filter((r) => r.id !== rule.id))}>
                    <Trash size={14} className="text-[rgb(var(--text-2))] hover:text-red-500" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AlertRuleForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(rule) => { setRules((prev) => [rule, ...prev]); setShowForm(false); setActiveTab("rules"); }}
      />
    </div>
  );
}

function NotificationCard({ notification, index }: { notification: AlertNotification; index: number }) {
  const SevIcon = severityIcons[notification.severity];
  const statusColor = {
    active: "danger",
    acknowledged: "warning",
    resolved: "success",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.05 }}
      className={cn("widget", notification.status === "active" && "ring-1 ring-red-200")}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", getSeverityBgColor(notification.severity))}>
          <SevIcon size={16} weight="fill" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-[rgb(var(--text))]">{notification.ruleName}</h4>
            <Badge variant={statusColor[notification.status]}>{notification.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-[rgb(var(--text-2))]">{notification.message}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-[rgb(var(--text-2))]">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(notification.triggeredAt).toLocaleString()}
            </span>
            <span className="tabular">
              Value: {notification.triggeredValue} | Threshold: {notification.thresholdValue}
            </span>
          </div>
        </div>
        {notification.status === "active" && (
          <Button variant="outline" size="sm">
            <Check size={14} />
            Acknowledge
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function AlertRuleForm({ open, onClose, onSubmit }: {
  open: boolean; onClose: () => void; onSubmit: (rule: AlertRule) => void;
}) {
  const [name, setName] = useState("");
  const [metricKey, setMetricKey] = useState("revenue");
  const [condition, setCondition] = useState<AlertRule["condition"]>("gt");
  const [threshold, setThreshold] = useState("");
  const [window_, setWindow] = useState("1h");
  const [severity, setSeverity] = useState<AlertSeverity>("warning");
  const [channels, setChannels] = useState<Set<string>>(new Set(["in_app"]));
  const [cooldown, setCooldown] = useState("30");
  const [error, setError] = useState("");

  const channelOptions = ["in_app", "email", "slack"];

  function toggleChannel(ch: string) {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch); else next.add(ch);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Rule name is required"); return; }
    if (!threshold || isNaN(Number(threshold))) { setError("Threshold must be a number"); return; }
    if (channels.size === 0) { setError("Select at least one notification channel"); return; }
    onSubmit({
      id: `rule-${Date.now()}`,
      name: name.trim(),
      metricKey,
      condition,
      thresholdValue: Number(threshold),
      evaluationWindow: window_,
      severity,
      notificationChannels: Array.from(channels),
      cooldownMinutes: Number(cooldown) || 30,
      isActive: true,
      lastTriggeredAt: null,
    });
    setName(""); setThreshold(""); setError("");
  }

  const inputCls = "w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-2))] transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30";
  const labelCls = "block text-xs font-medium text-[rgb(var(--text-2))] mb-1.5";

  return (
    <Modal open={open} onClose={onClose} title="Create Alert Rule">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Rule Name</label>
          <input className={inputCls} placeholder="e.g. High Error Rate" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Metric</label>
            <Dropdown options={metricOptions} value={metricKey} onChange={setMetricKey} />
          </div>
          <div>
            <label className={labelCls}>Condition</label>
            <Dropdown options={conditionOptions} value={condition} onChange={(v) => setCondition(v as AlertRule["condition"])} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Threshold Value</label>
            <input className={inputCls} placeholder="e.g. 5" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Evaluation Window</label>
            <Dropdown options={windowOptions} value={window_} onChange={setWindow} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Severity</label>
            <Dropdown options={severityOptions} value={severity} onChange={(v) => setSeverity(v as AlertSeverity)} />
          </div>
          <div>
            <label className={labelCls}>Cooldown (minutes)</label>
            <input className={inputCls} type="number" min="1" value={cooldown} onChange={(e) => setCooldown(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Notification Channels</label>
          <div className="flex gap-2">
            {channelOptions.map((ch) => (
              <button type="button" key={ch} onClick={() => toggleChannel(ch)}
                className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  channels.has(ch) ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "border-[rgb(var(--border))] text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))]")}>
                {ch.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Rule</Button>
        </div>
      </form>
    </Modal>
  );
}

