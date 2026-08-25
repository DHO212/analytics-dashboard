"use client";

import { useFilterStore } from "@/stores/filter-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Dropdown } from "@/components/ui/dropdown";
import { CalendarBlank, ArrowCounterClockwise, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const datePresets = [
  { value: "today",        label: "Today" },
  { value: "yesterday",    label: "Yesterday" },
  { value: "last_7d",      label: "Last 7 days" },
  { value: "last_30d",     label: "Last 30 days" },
  { value: "this_month",   label: "This month" },
  { value: "last_month",   label: "Last month" },
  { value: "this_quarter", label: "This quarter" },
  { value: "last_quarter", label: "Last quarter" },
  { value: "ytd",          label: "Year to date" },
  { value: "custom",       label: "Custom range" },
];

const regionOptions = [
  { value: "all",   label: "All regions" },
  { value: "na",    label: "North America" },
  { value: "eu",    label: "Europe" },
  { value: "apac",  label: "Asia Pacific" },
  { value: "latam", label: "Latin America" },
  { value: "mea",   label: "Middle East" },
];

const platformOptions = [
  { value: "all",     label: "All platforms" },
  { value: "web",     label: "Web" },
  { value: "ios",     label: "iOS" },
  { value: "android", label: "Android" },
];

const tierOptions = [
  { value: "all",        label: "All tiers" },
  { value: "free",       label: "Free" },
  { value: "pro",        label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

export function FilterBar() {
  const {
    dateRange, comparePeriod, region, platform, tier,
    setDateRange, setComparePeriod, setRegion, setPlatform, setTier,
    clearFilters, activeFilterCount,
  } = useFilterStore();

  const { isCollapsed } = useSidebarStore();
  const filterCount = activeFilterCount();

  return (
    <div
      className={cn(
        "border-b border-[rgb(var(--border))] bg-[rgb(var(--surface)/0.97)]",
        "px-5 py-1.5 transition-all duration-200",
        isCollapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Date picker */}
        <div className="flex items-center gap-1.5">
          <CalendarBlank size={12} className="text-[rgb(var(--text-3))]" aria-hidden="true" />
          <Dropdown
            options={datePresets}
            value={dateRange.preset}
            onChange={(val) => {
              const end = new Date();
              const start = new Date();
              switch (val) {
                case "today":        start.setHours(0,0,0,0); break;
                case "yesterday":    start.setDate(start.getDate()-1); end.setDate(end.getDate()-1); break;
                case "last_7d":      start.setDate(start.getDate()-7); break;
                case "last_30d":     start.setDate(start.getDate()-30); break;
                case "this_month":   start.setDate(1); break;
                case "last_month":   start.setMonth(start.getMonth()-1); start.setDate(1); end.setDate(0); break;
                case "this_quarter": start.setMonth(Math.floor(start.getMonth()/3)*3, 1); break;
                case "ytd":          start.setMonth(0, 1); break;
              }
              setDateRange({ preset: val, start, end });
            }}
            className="w-36"
          />
        </div>

        {/* Compare toggle */}
        <button
          onClick={() => setComparePeriod(!comparePeriod)}
          className={cn(
            "flex h-7 items-center gap-1 rounded-md border px-2 text-[11.5px] font-medium transition-all duration-100",
            comparePeriod
              ? "border-[rgb(var(--accent)/0.4)] bg-[rgb(var(--accent)/0.06)] text-[rgb(var(--accent))]"
              : "border-[rgb(var(--border))] text-[rgb(var(--text-3))] hover:border-[rgb(var(--border-2))] hover:text-[rgb(var(--text-2))]"
          )}
          aria-pressed={comparePeriod}
        >
          <ArrowCounterClockwise size={11} weight={comparePeriod ? "bold" : "regular"} />
          <span>vs prev</span>
        </button>

        <div className="sep-v" aria-hidden="true" />

        {/* Attribute filters */}
        <Dropdown options={regionOptions}   value={region}   onChange={setRegion}   className="w-36" />
        <Dropdown options={platformOptions} value={platform} onChange={setPlatform} className="w-32" />
        <Dropdown options={tierOptions}     value={tier}     onChange={setTier}     className="w-28" />

        {/* Clear — only shows when active */}
        {filterCount > 0 && (
          <>
            <div className="sep-v" aria-hidden="true" />
            <button
              onClick={clearFilters}
              className="flex h-7 items-center gap-1 rounded-md px-2 text-[11.5px] text-[rgb(var(--text-3))] transition-all hover:text-[rgb(var(--negative))] active:scale-[0.96]"
              aria-label={`Clear ${filterCount} active filter${filterCount !== 1 ? "s" : ""}`}
            >
              <X size={11} />
              <span>Clear</span>
              <span
                className="ml-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-[rgb(var(--surface-2))] px-1 font-code text-[9px] font-semibold text-[rgb(var(--text-2))]"
                aria-hidden="true"
              >
                {filterCount}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Active filter pills — only when active */}
      {filterCount > 0 && (
        <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-[rgb(var(--text-3))]">
          <span>Showing:</span>
          {region !== "all" && (
            <span className="rounded bg-[rgb(var(--surface-2))] px-1.5 py-0.5 font-medium text-[rgb(var(--text-2))]">
              {regionOptions.find(o => o.value === region)?.label}
            </span>
          )}
          {platform !== "all" && (
            <span className="rounded bg-[rgb(var(--surface-2))] px-1.5 py-0.5 font-medium text-[rgb(var(--text-2))]">
              {platformOptions.find(o => o.value === platform)?.label}
            </span>
          )}
          {tier !== "all" && (
            <span className="rounded bg-[rgb(var(--surface-2))] px-1.5 py-0.5 font-medium text-[rgb(var(--text-2))]">
              {tierOptions.find(o => o.value === tier)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
