/**
 * Optimized Filter Context
 * Performance-optimized filter context with memoization and local storage persistence
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';

export type FilterState = {
  timeRange: '24h' | '7d' | '30d' | '90d';
  channel: string;
  region: string;
  vertical: string;
  storeId: string;
};

const defaultFilter: FilterState = {
  timeRange: '7d',
  channel: 'all',
  region: 'VN',
  vertical: 'all',
  storeId: '',
};

interface FilterContextType {
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  updateTimeRange: (timeRange: FilterState['timeRange']) => void;
  updateChannel: (channel: string) => void;
  updateRegion: (region: string) => void;
  updateVertical: (vertical: string) => void;
  updateStoreId: (storeId: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const STORAGE_KEY = 'trendradar_filters';

/**
 * Load filters from localStorage
 */
function loadFiltersFromStorage(): FilterState {
  if (typeof window === 'undefined') return defaultFilter;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultFilter, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load filters from storage:', error);
  }

  return defaultFilter;
}

/**
 * Save filters to localStorage
 */
function saveFiltersToStorage(filters: FilterState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filters to storage:', error);
  }
}

export function OptimizedFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setFilterState] = useState<FilterState>(loadFiltersFromStorage);

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    saveFiltersToStorage(filter);
  }, [filter]);

  // Memoized setFilter function
  const setFilter = useCallback((newFilter: Partial<FilterState>) => {
    setFilterState((prev) => {
      const updated = { ...prev, ...newFilter };
      return updated;
    });
  }, []);

  // Memoized resetFilter function
  const resetFilter = useCallback(() => {
    setFilterState(defaultFilter);
  }, []);

  // Individual update functions for better granularity
  const updateTimeRange = useCallback((timeRange: FilterState['timeRange']) => {
    setFilterState((prev) => ({ ...prev, timeRange }));
  }, []);

  const updateChannel = useCallback((channel: string) => {
    setFilterState((prev) => ({ ...prev, channel }));
  }, []);

  const updateRegion = useCallback((region: string) => {
    setFilterState((prev) => ({ ...prev, region }));
  }, []);

  const updateVertical = useCallback((vertical: string) => {
    setFilterState((prev) => ({ ...prev, vertical }));
  }, []);

  const updateStoreId = useCallback((storeId: string) => {
    setFilterState((prev) => ({ ...prev, storeId }));
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      filter,
      setFilter,
      resetFilter,
      updateTimeRange,
      updateChannel,
      updateRegion,
      updateVertical,
      updateStoreId,
    }),
    [filter, setFilter, resetFilter, updateTimeRange, updateChannel, updateRegion, updateVertical, updateStoreId]
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

/**
 * Hook to use filter context
 */
export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within an OptimizedFilterProvider');
  }
  return context;
}

/**
 * Hook to get only filter state (for components that only read filters)
 */
export function useFilterState() {
  const { filter } = useFilter();
  return filter;
}

/**
 * Hook to get only filter actions (for components that only update filters)
 */
export function useFilterActions() {
  const {
    setFilter,
    resetFilter,
    updateTimeRange,
    updateChannel,
    updateRegion,
    updateVertical,
    updateStoreId,
  } = useFilter();

  return {
    setFilter,
    resetFilter,
    updateTimeRange,
    updateChannel,
    updateRegion,
    updateVertical,
    updateStoreId,
  };
}

/**
 * Hook to get specific filter value
 */
export function useFilterValue<K extends keyof FilterState>(key: K): FilterState[K] {
  const { filter } = useFilter();
  return filter[key];
}

