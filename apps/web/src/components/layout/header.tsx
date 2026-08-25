"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun } from "@phosphor-icons/react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { CommandPalette } from "@/components/layout/command-palette";
import { UserMenu } from "@/components/layout/user-menu";

const pageTitles: Record<string, { label: string; section: string }> = {
  "/executive":  { label: "Executive",   section: "Dashboards" },
  "/product":    { label: "Product",     section: "Dashboards" },
  "/operations": { label: "Operations",  section: "Dashboards" },
  "/analyst":    { label: "Analyst",     section: "Dashboards" },
  "/alerts":     { label: "Alerts",      section: "Tools" },
  "/exports":    { label: "Exports",     section: "Tools" },
  "/audit":      { label: "Audit Log",   section: "System" },
  "/settings":   { label: "Settings",   section: "System" },
};

export function Header() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const page = pageTitles[pathname] ?? { label: "Dashboard", section: "Meridian" };

  return (
    <header
      className={cn(
        "glass sticky top-0 z-30 flex h-[52px] items-center justify-between transition-all duration-200",
        "px-5",
        isCollapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
      )}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px]">
        <span className="text-[rgb(var(--text-3))] font-medium">{page.section}</span>
        <span className="text-[rgb(var(--border-2))]" aria-hidden="true">/</span>
        <h1 className="font-semibold text-[rgb(var(--text))] tracking-tight">
          {page.label}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-0.5">
        {/* Command palette — ⌘K */}
        <CommandPalette />

        {/* Theme toggle */}
        <Tooltip content={theme === "light" ? "Dark mode" : "Light mode"}>
          <button
            onClick={toggleTheme}
            className="icon-btn"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </Tooltip>

        {/* Notification bell */}
        <NotificationPanel />

        {/* Divider */}
        <div className="sep-v mx-1.5" aria-hidden="true" />

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
