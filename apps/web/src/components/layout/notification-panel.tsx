"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  X,
  CheckCircle,
  WarningCircle,
  Info,
  Warning,
  Checks,
  Trash,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  useNotificationStore,
  relativeTime,
  type NotifKind,
} from "@/stores/notification-store";

const kindMeta: Record<
  NotifKind,
  { icon: React.ElementType; color: string; bg: string }
> = {
  alert: {
    icon: WarningCircle,
    color: "text-[rgb(var(--negative))]",
    bg: "bg-[rgb(var(--negative)/0.1)]",
  },
  warning: {
    icon: Warning,
    color: "text-[rgb(var(--warning,220_160_40))]",
    bg: "bg-[rgb(220_160_40/0.1)]",
  },
  success: {
    icon: CheckCircle,
    color: "text-[rgb(var(--positive))]",
    bg: "bg-[rgb(var(--positive)/0.1)]",
  },
  info: {
    icon: Info,
    color: "text-[rgb(var(--accent))]",
    bg: "bg-[rgb(var(--accent)/0.1)]",
  },
};

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { items, unreadCount, markRead, markAllRead, dismiss, clearAll } =
    useNotificationStore();
  const count = unreadCount();

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "icon-btn relative",
          open && "bg-[rgb(var(--surface-2))] text-[rgb(var(--text))]"
        )}
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
      >
        <Bell size={16} weight={open ? "fill" : "regular"} />
        {count > 0 && (
          <span
            className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[rgb(var(--negative))] font-code text-[8px] font-bold text-white ring-[1.5px] ring-[rgb(var(--bg))]"
            aria-hidden="true"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={cn(
              "absolute right-0 top-full mt-2 w-[360px] z-50",
              "rounded-xl border border-[rgb(var(--border))]",
              "bg-[rgb(var(--surface))] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[rgb(var(--text))]">
                  Notifications
                </span>
                {count > 0 && (
                  <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[rgb(var(--negative))] px-1 font-code text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-0.5">
                {count > 0 && (
                  <button
                    onClick={markAllRead}
                    className="icon-btn"
                    aria-label="Mark all read"
                    title="Mark all read"
                  >
                    <Checks size={14} />
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="icon-btn"
                  aria-label="Clear all"
                  title="Clear all"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[380px] overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-[rgb(var(--text-3))]">
                  <Bell size={28} weight="duotone" />
                  <span className="text-[12px]">No notifications</span>
                </div>
              ) : (
                <ul>
                  {items.map((notif) => {
                    const meta = kindMeta[notif.kind];
                    const Icon = meta.icon;
                    return (
                      <li
                        key={notif.id}
                        className={cn(
                          "group relative flex gap-3 px-4 py-3 transition-colors",
                          "hover:bg-[rgb(var(--surface-2))]",
                          !notif.read && "bg-[rgb(var(--accent)/0.04)]"
                        )}
                        onClick={() => markRead(notif.id)}
                      >
                        {/* Unread dot */}
                        {!notif.read && (
                          <span className="absolute left-1.5 top-4 h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
                        )}

                        {/* Icon */}
                        <div
                          className={cn(
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                            meta.bg
                          )}
                        >
                          <Icon size={14} weight="fill" className={meta.color} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-[12.5px] font-medium leading-tight",
                              notif.read
                                ? "text-[rgb(var(--text-2))]"
                                : "text-[rgb(var(--text))]"
                            )}
                          >
                            {notif.title}
                          </p>
                          <p className="mt-0.5 text-[11.5px] leading-snug text-[rgb(var(--text-3))] line-clamp-2">
                            {notif.body}
                          </p>
                          <span className="mt-1 block font-code text-[10px] text-[rgb(var(--text-3))]">
                            {relativeTime(notif.ts)}
                          </span>
                        </div>

                        {/* Dismiss */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(notif.id);
                          }}
                          className="mt-0.5 shrink-0 rounded-md p-1 text-[rgb(var(--text-3))] opacity-0 transition-all hover:bg-[rgb(var(--surface-3,var(--surface-2)))] hover:text-[rgb(var(--text))] group-hover:opacity-100"
                          aria-label="Dismiss"
                        >
                          <X size={11} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[rgb(var(--border))] px-4 py-2.5">
                <button
                  className="text-[11.5px] font-medium text-[rgb(var(--accent))] transition-opacity hover:opacity-80"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  View all in Alerts →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
