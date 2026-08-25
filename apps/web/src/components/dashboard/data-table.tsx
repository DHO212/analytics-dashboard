"use client";

import { memo, useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { MagnifyingGlass, CaretUp, CaretDown, DownloadSimple, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { TableRow } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { SkeletonTable } from "@/components/ui/skeleton";

interface DataTableProps { data: TableRow[]; isLoading?: boolean; }
type SortDirection = "asc" | "desc" | null;
interface SortState { key: string; direction: SortDirection; }
interface ColumnDef { key: string; label: string; sortable: boolean; }

const columns: ColumnDef[] = [
  { key: "date", label: "Date", sortable: true },
  { key: "region", label: "Region", sortable: true },
  { key: "platform", label: "Platform", sortable: true },
  { key: "tier", label: "Tier", sortable: true },
  { key: "campaign", label: "Campaign", sortable: true },
  { key: "users", label: "Users", sortable: true },
  { key: "revenue", label: "Revenue", sortable: true },
  { key: "conversion", label: "Conv. %", sortable: true },
  { key: "sessions", label: "Sessions", sortable: true },
];

const pageSizeOptions = [
  { value: "10", label: "10 rows" },
  { value: "25", label: "25 rows" },
  { value: "50", label: "50 rows" },
];

export const DataTable = memo(function DataTable({ data, isLoading }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "date", direction: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());

  // Reset to page 1 whenever data changes (filter applied)
  useEffect(() => {
    setPage(1);
  }, [data]);

  const visibleColumns = useMemo(() => columns.filter((c) => !hiddenCols.has(c.key)), [hiddenCols]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) => Object.values(row).some((v) => String(v).toLowerCase().includes(q)));
  }, [data, search]);

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sort.key]; const bVal = b[sort.key];
      if (typeof aVal === "number" && typeof bVal === "number") return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      return sort.direction === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sort]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = useCallback((key: string) => {
    setSort((prev) => ({ key, direction: prev.key === key ? (prev.direction === "asc" ? "desc" : prev.direction === "desc" ? null : "asc") : "asc" }));
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = visibleColumns.map((c) => c.label).join(",");
    const rows = sortedData.map((row) => visibleColumns.map((c) => row[c.key]).join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "analytics-export.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [sortedData, visibleColumns]);

  if (isLoading) return <SkeletonTable />;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="widget">
      <TableControls search={search} setSearch={(v) => { setSearch(v); setPage(1); }} pageSize={pageSize} setPageSize={(v) => { setPageSize(v); setPage(1); }} onExport={handleExportCSV} />
      <TableContent columns={visibleColumns} data={paginatedData} sort={sort} onSort={handleSort} />
      {paginatedData.length === 0 && <EmptyState />}
      <TablePagination page={page} totalPages={totalPages} totalItems={sortedData.length} pageSize={pageSize} onPageChange={setPage} />
    </motion.div>
  );
});

function TableControls({ search, setSearch, pageSize, setPageSize, onExport }: {
  search: string; setSearch: (v: string) => void; pageSize: number; setPageSize: (v: number) => void; onExport: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-2))]" />
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] pl-9 pr-4 py-2 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-2))] transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30" />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Dropdown options={pageSizeOptions} value={String(pageSize)} onChange={(v) => setPageSize(Number(v))} placeholder="Rows" className="w-28" />
        <Button variant="outline" size="sm" onClick={onExport}><DownloadSimple size={14} /> CSV</Button>
      </div>
    </div>
  );
}

function TableContent({ columns: cols, data, sort, onSort }: {
  columns: ColumnDef[]; data: TableRow[]; sort: SortState; onSort: (key: string) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[rgb(var(--border))]">
            {cols.map((col) => (
              <th key={col.key} onClick={() => col.sortable && onSort(col.key)}
                className={cn("px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-2))]", col.sortable && "cursor-pointer select-none hover:text-[rgb(var(--text))]")}>
                <div className="flex items-center gap-1">
                  {col.label}
                  {sort.key === col.key && sort.direction && (sort.direction === "asc" ? <CaretUp size={12} /> : <CaretDown size={12} />)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgb(var(--border)/0.5)]">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-[rgb(var(--surface-2)/0.5)] transition-colors">
              {cols.map((col) => (
                <td key={col.key} className="px-6 py-3 text-sm text-[rgb(var(--text))] tabular">
                  {col.key === "revenue" ? `$${formatNumber(row[col.key] as number)}`
                    : col.key === "conversion" ? `${row[col.key]}%`
                    : col.key === "users" || col.key === "sessions" ? formatNumber(row[col.key] as number)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <MagnifyingGlass size={36} className="text-[rgb(var(--border))] mb-3" />
      <p className="text-sm font-medium text-[rgb(var(--text))]">No data available</p>
      <p className="text-xs text-[rgb(var(--text-2))] mt-1">Try adjusting your search or filters</p>
    </div>
  );
}

function TablePagination({ page, totalPages, totalItems, pageSize, onPageChange }: {
  page: number; totalPages: number; totalItems: number; pageSize: number; onPageChange: (p: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-xs text-[rgb(var(--text-2))]">
        Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalItems)} of {totalItems} results
      </p>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><CaretLeft size={14} /></Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = page <= 3 ? i + 1 : page - 2 + i;
          if (pageNum > totalPages) return null;
          return (
            <button key={pageNum} onClick={() => onPageChange(pageNum)}
              className={cn("h-8 w-8 rounded-lg text-sm font-medium transition-colors", pageNum === page ? "bg-indigo-600 text-white" : "text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))]")}>
              {pageNum}
            </button>
          );
        })}
        <Button variant="ghost" size="icon" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}><CaretRight size={14} /></Button>
      </div>
    </div>
  );
}
