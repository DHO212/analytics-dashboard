import { create } from "zustand";

export type NotifKind = "alert" | "info" | "success" | "warning";

export interface Notification {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  ts: Date;
  read: boolean;
}

interface NotificationStore {
  items: Notification[];
  unreadCount: () => number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const SEED: Notification[] = [
  {
    id: "n1",
    kind: "alert",
    title: "CPU spike detected",
    body: "Worker cluster #3 hit 94% CPU for 2 min — auto-scaled to 6 nodes.",
    ts: new Date(Date.now() - 4 * 60 * 1000),
    read: false,
  },
  {
    id: "n2",
    kind: "warning",
    title: "Export queue delayed",
    body: "Nightly CSV export is 18 min behind schedule due to lock contention.",
    ts: new Date(Date.now() - 22 * 60 * 1000),
    read: false,
  },
  {
    id: "n3",
    kind: "success",
    title: "Data pipeline complete",
    body: "Hourly ETL finished in 3m 41s — 1.2M rows processed.",
    ts: new Date(Date.now() - 61 * 60 * 1000),
    read: false,
  },
  {
    id: "n4",
    kind: "info",
    title: "New team member",
    body: "Sarah K. joined the Analytics workspace with Viewer access.",
    ts: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "n5",
    kind: "info",
    title: "Report shared",
    body: "Executive Q3 summary was shared with 4 stakeholders.",
    ts: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
  },
];

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  items: SEED,

  unreadCount: () => get().items.filter((n) => !n.read).length,

  markRead: (id) =>
    set((s) => ({
      items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllRead: () =>
    set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),

  dismiss: (id) =>
    set((s) => ({ items: s.items.filter((n) => n.id !== id) })),

  clearAll: () => set({ items: [] }),
}));

/** Format relative timestamp */
export function relativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
