"use client";

import { create } from "zustand";
import type { FilterState, DateRange } from "@/types";

function getDefaultDateRange(): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return { preset: "last_7d", start, end };
}

export function getDaysFromPreset(preset: string): number {
  const map: Record<string, number> = {
    today: 1, yesterday: 1, last_7d: 7, last_30d: 30,
    this_month: 30, last_month: 30, this_quarter: 90, last_quarter: 90,
    ytd: 365, custom: 7,
  };
  return map[preset] ?? 7;
}

interface FilterStore extends FilterState {
  setDateRange: (range: DateRange) => void;
  setComparePeriod: (compare: boolean) => void;
  setRegion: (region: string) => void;
  setPlatform: (platform: string) => void;
  setTier: (tier: string) => void;
  setCampaign: (campaign: string) => void;
  clearFilters: () => void;
  activeFilterCount: () => number;
}

const defaultState: FilterState = {
  dateRange: getDefaultDateRange(),
  comparePeriod: false,
  region: "all",
  platform: "all",
  tier: "all",
  campaign: "all",
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...defaultState,

  setDateRange: (dateRange) => set({ dateRange }),
  setComparePeriod: (comparePeriod) => set({ comparePeriod }),
  setRegion: (region) => set({ region }),
  setPlatform: (platform) => set({ platform }),
  setTier: (tier) => set({ tier }),
  setCampaign: (campaign) => set({ campaign }),

  clearFilters: () =>
    set({
      region: "all",
      platform: "all",
      tier: "all",
      campaign: "all",
      comparePeriod: false,
    }),

  activeFilterCount: () => {
    const s = get();
    let count = 0;
    if (s.region !== "all") count++;
    if (s.platform !== "all") count++;
    if (s.tier !== "all") count++;
    if (s.campaign !== "all") count++;
    return count;
  },
}));
