"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { MagnifyingGlass, UserCircle, Funnel } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { PageHeader } from "@/components/layout/page-header";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  ip: string;
  category: "auth" | "dashboard" | "alert" | "export" | "settings";
}

const categoryColors: Record<AuditEntry["category"], "info" | "success" | "warning" | "danger" | "outline"> = {
  auth: "info",
  dashboard: "success",
  alert: "warning",
  export: "outline",
  settings: "danger",
};

const mockAuditLog: AuditEntry[] = [
  { id: "a1", timestamp: "2026-08-23T14:32:11Z", user: "ridho@company.com", role: "Admin", action: "alert.rule.created", detail: "Created rule \"High Error Rate\" (error_rate > 5)", ip: "103.147.8.21", category: "alert" },
  { id: "a2", timestamp: "2026-08-23T14:05:44Z", user: "sari@company.com", role: "Analyst", action: "export.csv", detail: "Exported 1,500 rows from Executive dashboard", ip: "103.147.8.34", category: "export" },
  { id: "a3", timestamp: "2026-08-23T13:48:02Z", user: "ridho@company.com", role: "Admin", action: "dashboard.filter", detail: "Applied filter: region=na, tier=enterprise", ip: "103.147.8.21", category: "dashboard" },
  { id: "a4", timestamp: "2026-08-23T12:20:37Z", user: "budi@company.com", role: "Viewer", action: "auth.login", detail: "Logged in via SSO (Google)", ip: "114.125.90.102", category: "auth" },
  { id: "a5", timestamp: "2026-08-23T11:15:29Z", user: "sari@company.com", role: "Analyst", action: "alert.acknowledged", detail: "Acknowledged \"Revenue Drop Alert\"", ip: "103.147.8.34", category: "alert" },
  { id: "a6", timestamp: "2026-08-23T10:02:51Z", user: "admin@company.com", role: "Admin", action: "settings.updated", detail: "Changed data retention from 90d to 180d", ip: "10.0.0.5", category: "settings" },
  { id: "a7", timestamp: "2026-08-23T09:44:18Z", user: "budi@company.com", role: "Viewer", action: "dashboard.view", detail: "Viewed Product dashboard", ip: "114.125.90.102", category: "dashboard" },
  { id: "a8", timestamp: "2026-08-22T17:31:55Z", user: "ridho@company.com", role: "Admin", action: "auth.login", detail: "Logged in via email/password", ip: "103.147.8.21", category: "auth" },
  { id: "a9", timestamp: "2026-08-22T16:12:40Z", user: "sari@company.com", role: "Analyst", action: "export.pdf", detail: "Exported executive summary PDF", ip: "103.147.8.34", category: "export" },
  { id: "a10", timestamp: "2026-08-22T15:08:03Z", user: "admin@company.com", role: "Admin", action: "settings.user_invited", detail: "Invited dewi@company.com as Viewer", ip: "10.0.0.5", category: "settings" },
  { id: "a11", timestamp: "2026-08-22T14:26:47Z", user: "dewi@company.com", role: "Viewer", action: "auth.login_failed", detail: "Failed login attempt (wrong password)", ip: "36.79.201.55", category: "auth" },
  { id: "a12", timestamp: "2026-08-22T13:59:12Z", user: "ridho@company.com", role: "Admin", action: "alert.rule.toggled", detail: "Disabled rule \"Low SLA Compliance\"", ip: "103.147.8.21", category: "alert" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "auth", label: "Authentication" },
  { value: "dashboard", label: "Dashboard" },
  { value: "alert", label: "Alerts" },
  { value: "export", label: "Exports" },
  { value: "settings", label: "Settings" },
];

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return mockAuditLog.filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return [e.user, e.action, e.detail].some((f) => f.toLowerCase().includes(q));
    });
  }, [search, category]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Audit Log"
        subtitle="Track all user actions and system events"
        updatedAt="just now"
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-2))]" />
          <input
            type="text" placeholder="Search user, action, detail..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] pl-9 pr-4 py-2 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-2))] transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Funnel size={16} className="text-[rgb(var(--text-2))]" />
          <Dropdown options={categoryOptions} value={category} onChange={setCategory} className="w-44" />
        </div>
        <span className="text-xs text-[rgb(var(--text-2))] ml-auto tabular">{filtered.length} events</span>
      </div>

      <div className="widget !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2)/0.5)]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Detail</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--border)/0.5)]">
              {filtered.map((entry, i) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-[rgb(var(--surface-2)/0.5)] transition-colors"
                >
                  <td className="px-6 py-3 text-xs text-[rgb(var(--text-2))] tabular whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <UserCircle size={18} className="text-[rgb(var(--text-2))]" />
                      <div>
                        <p className="text-sm font-medium text-[rgb(var(--text))]">{entry.user}</p>
                        <p className="text-[11px] text-[rgb(var(--text-2))]">{entry.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <code className="rounded bg-[rgb(var(--surface-2))] px-1.5 py-0.5 text-xs font-medium text-[rgb(var(--text))]">{entry.action}</code>
                  </td>
                  <td className="px-6 py-3 text-sm text-[rgb(var(--text-2))] max-w-xs truncate" title={entry.detail}>{entry.detail}</td>
                  <td className="px-6 py-3"><Badge variant={categoryColors[entry.category]}>{entry.category}</Badge></td>
                  <td className="px-6 py-3 text-xs text-[rgb(var(--text-2))] tabular">{entry.ip}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MagnifyingGlass size={36} className="text-[rgb(var(--border))] mb-3" />
              <p className="text-sm font-medium text-[rgb(var(--text))]">No events found</p>
              <p className="text-xs text-[rgb(var(--text-2))] mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
