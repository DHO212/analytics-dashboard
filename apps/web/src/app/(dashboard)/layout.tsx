"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { FilterBar } from "@/components/filters/filter-bar";
import { useSidebarStore } from "@/stores/sidebar-store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-[100dvh] bg-[rgb(var(--bg))]">
      <Sidebar />
      <Header />
      <FilterBar />
      <main
        className={cn(
          "transition-all duration-200 px-5 pb-8 pt-5",
          isCollapsed ? "lg:ml-14" : "lg:ml-56"
        )}
      >
        <div className="mx-auto max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
