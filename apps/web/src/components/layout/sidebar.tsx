"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import {
  SquaresFour,
  ChartLineUp,
  Gauge,
  MagnifyingGlass,
  Bell,
  FolderOpen,
  Export,
  GearSix,
  SignOut,
  List,
  X,
} from "@phosphor-icons/react";

const navItems = [
  {
    section: "Dashboards",
    items: [
      { label: "Executive",  href: "/executive",  icon: SquaresFour },
      { label: "Product",    href: "/product",    icon: ChartLineUp },
      { label: "Operations", href: "/operations", icon: Gauge },
      { label: "Analyst",    href: "/analyst",    icon: MagnifyingGlass },
    ],
  },
  {
    section: "Tools",
    items: [
      { label: "Alerts",  href: "/alerts",  icon: Bell,       badge: 3 },
      { label: "Exports", href: "/exports", icon: Export },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Audit Log", href: "/audit",    icon: FolderOpen },
      { label: "Settings",  href: "/settings", icon: GearSix },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggle, setMobileOpen } = useSidebarStore();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile FAB */}
      <button
        onClick={toggle}
        aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text-2))] shadow-lg transition-all active:scale-[0.93] lg:hidden"
      >
        {isMobileOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-sidebar transition-all duration-200",
          "border-[rgb(var(--sidebar-border))]",
          isCollapsed ? "w-14" : "w-56",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo mark */}
        <div
          className={cn(
            "flex h-[52px] shrink-0 items-center border-b border-[rgb(var(--sidebar-border))]",
            isCollapsed ? "justify-center px-0" : "px-4 gap-2.5"
          )}
        >
          {/* Icon mark — blue square, not gray */}
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-[rgb(var(--accent)/0.15)] ring-1 ring-[rgb(var(--accent)/0.3)]">
            <SquaresFour size={14} weight="fill" className="text-[rgb(var(--accent))]" />
          </div>
          {!isCollapsed && (
            <span className="text-[13px] font-semibold tracking-tight text-[rgb(var(--sidebar-text-active))]">
              Meridian
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3" aria-label="Primary navigation">
          {navItems.map((group) => (
            <div key={group.section} className={cn("mb-4", isCollapsed ? "px-2" : "px-2")}>
              {/* Section label — only when expanded */}
              {!isCollapsed && (
                <p className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--sidebar-text))]">
                  {group.section}
                </p>
              )}
              <ul className="space-y-px">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group relative flex items-center gap-2.5 rounded-[6px] transition-all duration-100",
                          "text-[13px] font-medium",
                          isCollapsed ? "h-9 w-full justify-center" : "h-8 px-2",
                          isActive
                            ? "bg-[rgb(var(--accent)/0.10)] text-[rgb(var(--sidebar-text-active))]"
                            : "text-[rgb(var(--sidebar-text-hi))] hover:bg-[rgb(var(--sidebar-hover))] hover:text-[rgb(var(--sidebar-text-active))]"
                        )}
                      >
                        {/* Active bar — blue, left edge */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-1/2 h-[18px] w-[2.5px] -translate-y-1/2 rounded-full bg-[rgb(var(--accent))]"
                            aria-hidden="true"
                          />
                        )}

                        <item.icon
                          size={16}
                          weight={isActive ? "fill" : "regular"}
                          className={cn(
                            "shrink-0",
                            isActive
                              ? "text-[rgb(var(--accent))]"
                              : "opacity-70 group-hover:opacity-100"
                          )}
                        />

                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span className="badge-alert">{item.badge}</span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div
          className={cn(
            "shrink-0 border-t border-[rgb(var(--sidebar-border))] p-3",
            isCollapsed && "flex justify-center"
          )}
        >
          {isCollapsed ? (
            <div className="avatar-bg flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold text-white">
              RK
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="avatar-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white">
                RK
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-[rgb(var(--sidebar-text-active))] truncate leading-tight">
                  Ridho Kurnia
                </p>
                <p className="text-[10.5px] text-[rgb(var(--sidebar-text))] leading-tight">
                  Administrator
                </p>
              </div>
              <button
                aria-label="Sign out"
                className="flex h-6 w-6 items-center justify-center rounded text-[rgb(var(--sidebar-text))] transition-colors hover:text-[rgb(var(--sidebar-text-active))] active:scale-[0.93]"
              >
                <SignOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
