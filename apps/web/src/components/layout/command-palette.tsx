"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  MagnifyingGlass,
  ChartBar,
  Gauge,
  Package,
  Wrench,
  Bell,
  ArrowSquareOut,
  ClockCounterClockwise,
  Command,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CmdItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  kbd?: string;
  group: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const ALL_ITEMS: CmdItem[] = [
    {
      id: "executive",
      label: "Executive Dashboard",
      description: "KPIs, revenue, top-level metrics",
      icon: ChartBar,
      group: "Dashboards",
      action: () => { router.push("/executive"); close(); },
    },
    {
      id: "product",
      label: "Product Dashboard",
      description: "DAU, retention, feature adoption",
      icon: Package,
      group: "Dashboards",
      action: () => { router.push("/product"); close(); },
    },
    {
      id: "operations",
      label: "Operations Dashboard",
      description: "System health, queues, latency",
      icon: Gauge,
      group: "Dashboards",
      action: () => { router.push("/operations"); close(); },
    },
    {
      id: "analyst",
      label: "Analyst Dashboard",
      description: "Deep-dive analytics workspace",
      icon: ChartBar,
      group: "Dashboards",
      action: () => { router.push("/analyst"); close(); },
    },
    {
      id: "alerts",
      label: "Alerts",
      description: "Active alerts and thresholds",
      icon: Bell,
      group: "Tools",
      action: () => { router.push("/alerts"); close(); },
    },
    {
      id: "exports",
      label: "Exports",
      description: "Download reports and data",
      icon: ArrowSquareOut,
      group: "Tools",
      action: () => { router.push("/exports"); close(); },
    },
    {
      id: "audit",
      label: "Audit Log",
      description: "User activity and system events",
      icon: ClockCounterClockwise,
      group: "System",
      action: () => { router.push("/audit"); close(); },
    },
    {
      id: "settings",
      label: "Settings",
      description: "Workspace and account settings",
      icon: Wrench,
      group: "System",
      action: () => { router.push("/settings"); close(); },
    },
  ];

  const filtered = query.trim()
    ? ALL_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.group.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_ITEMS;

  // Group items
  const grouped = filtered.reduce<Record<string, CmdItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  // Flat list for keyboard nav
  const flat = filtered;

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((v) => Math.min(v + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((v) => Math.max(v - 1, 0));
    } else if (e.key === "Enter" && flat[selected]) {
      flat[selected].action();
    }
  }

  return (
    <>
      {/* Search button */}
      <button
        onClick={() => setOpen(true)}
        className="icon-btn"
        aria-label="Search (Ctrl+K)"
        title="Search  Ctrl+K"
      >
        <MagnifyingGlass size={16} />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-[18vh] px-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className={cn(
                "w-full max-w-[520px] overflow-hidden rounded-xl",
                "border border-[rgb(var(--border))]",
                "bg-[rgb(var(--surface))] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)]"
              )}
            >
              {/* Input row */}
              <div className="flex items-center gap-3 border-b border-[rgb(var(--border))] px-4">
                <MagnifyingGlass
                  size={16}
                  className="shrink-0 text-[rgb(var(--text-3))]"
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                  onKeyDown={handleKey}
                  placeholder="Search pages, tools…"
                  className={cn(
                    "flex-1 bg-transparent py-3.5 text-[13.5px] text-[rgb(var(--text))]",
                    "placeholder:text-[rgb(var(--text-3))]",
                    "outline-none"
                  )}
                />
                <kbd className="hidden shrink-0 rounded border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-1.5 py-0.5 font-code text-[10px] text-[rgb(var(--text-3))] sm:flex items-center gap-0.5">
                  <Command size={9} />K
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[360px] overflow-y-auto py-2">
                {flat.length === 0 ? (
                  <div className="py-10 text-center text-[12px] text-[rgb(var(--text-3))]">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Object.entries(grouped).map(([group, items]) => (
                    <div key={group}>
                      <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--text-3))]">
                        {group}
                      </div>
                      {items.map((item) => {
                        const globalIdx = flat.indexOf(item);
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={item.action}
                            onMouseEnter={() => setSelected(globalIdx)}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                              selected === globalIdx
                                ? "bg-[rgb(var(--accent)/0.1)] text-[rgb(var(--text))]"
                                : "text-[rgb(var(--text-2))] hover:bg-[rgb(var(--surface-2))]"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                selected === globalIdx
                                  ? "bg-[rgb(var(--accent)/0.15)] text-[rgb(var(--accent))]"
                                  : "bg-[rgb(var(--surface-2))] text-[rgb(var(--text-3))]"
                              )}
                            >
                              <Icon size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[12.5px] font-medium leading-tight">
                                {item.label}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-[rgb(var(--text-3))] truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {selected === globalIdx && (
                              <CaretRight
                                size={12}
                                className="shrink-0 text-[rgb(var(--accent))]"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-3 border-t border-[rgb(var(--border))] px-4 py-2">
                <span className="flex items-center gap-1 text-[10.5px] text-[rgb(var(--text-3))]">
                  <kbd className="rounded border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-1 font-code text-[9px]">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1 text-[10.5px] text-[rgb(var(--text-3))]">
                  <kbd className="rounded border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-1 font-code text-[9px]">↵</kbd>
                  open
                </span>
                <span className="flex items-center gap-1 text-[10.5px] text-[rgb(var(--text-3))]">
                  <kbd className="rounded border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-1 font-code text-[9px]">Esc</kbd>
                  close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
