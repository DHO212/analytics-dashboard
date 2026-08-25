"use client";

import { motion } from "motion/react";
import { DownloadSimple, FileCsv, FileXls, FilePdf, FilePng } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

const exportHistory = [
  { id: "1", name: "revenue-report-aug.csv", type: "CSV", date: "2026-08-23 14:30", status: "completed", size: "2.4 MB", rows: 15000 },
  { id: "2", name: "user-analytics-q3.xlsx", type: "XLSX", date: "2026-08-22 09:15", status: "completed", size: "5.1 MB", rows: 45000 },
  { id: "3", name: "executive-summary.pdf", type: "PDF", date: "2026-08-21 16:45", status: "completed", size: "1.2 MB", rows: 0 },
  { id: "4", name: "campaign-performance.csv", type: "CSV", date: "2026-08-21 11:20", status: "failed", size: "-", rows: 0 },
  { id: "5", name: "dashboard-screenshot.png", type: "PNG", date: "2026-08-20 08:00", status: "completed", size: "840 KB", rows: 0 },
];

const typeIcons: Record<string, typeof FileCsv> = {
  CSV: FileCsv,
  XLSX: FileXls,
  PDF: FilePdf,
  PNG: FilePng,
};

export default function ExportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Export History"
        subtitle="Download your exported data and reports"
        action={
          <Button>
            <DownloadSimple size={16} />
            New Export
          </Button>
        }
      />

      <div className="widget">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgb(var(--border))]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">File</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Format</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Size</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Rows</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--border)/0.5)]">
              {exportHistory.map((item, i) => {
                const FileIcon = typeIcons[item.type] || FileCsv;
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-[rgb(var(--surface-2)/0.5)] transition-colors"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <FileIcon size={18} className="text-[rgb(var(--text-2))]" />
                        <span className="text-sm font-medium text-[rgb(var(--text))]">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3"><Badge variant="outline">{item.type}</Badge></td>
                    <td className="px-6 py-3 text-sm text-[rgb(var(--text-2))] tabular">{item.date}</td>
                    <td className="px-6 py-3 text-sm text-[rgb(var(--text-2))] tabular">{item.size}</td>
                    <td className="px-6 py-3 text-sm text-[rgb(var(--text-2))] tabular">{item.rows > 0 ? item.rows.toLocaleString() : "-"}</td>
                    <td className="px-6 py-3">
                      <Badge variant={item.status === "completed" ? "success" : "danger"}>{item.status}</Badge>
                    </td>
                    <td className="px-6 py-3">
                      {item.status === "completed" && (
                        <Button variant="ghost" size="sm">
                          <DownloadSimple size={14} />
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
