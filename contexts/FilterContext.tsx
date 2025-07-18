"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type FilterState = {
  timeRange: "24h" | "7d" | "30d" | "90d";
  channel: string; // e.g. "all", "tiktok", "shopee", etc.
  region: string; // e.g. "VN", "US", "SG", etc.
  vertical: string; // e.g. "all", "fashion", "cosmetics", etc.
  storeId: string; // store identifier, can be empty for all
};

const defaultFilter: FilterState = {
  timeRange: "7d",
  channel: "all",
  region: "VN",
  vertical: "all",
  storeId: "",
};

interface FilterContextType {
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilterState] = useState<FilterState>(defaultFilter);

  const setFilter = (newFilter: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  };

  const resetFilter = () => setFilterState(defaultFilter);

  return (
    <FilterContext.Provider value={{ filter, setFilter, resetFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within a FilterProvider");
  return ctx;
} 