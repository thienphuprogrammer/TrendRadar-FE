'use client';

import { useMemo } from 'react';

export function useDashboardData(timeRange?: string) {
  const data = useMemo(() => ({
    kpis: {},
    revenueChart: {},
    sentiment: {},
    geographic: {},
    hotTrends: [],
  }), [timeRange]);
  return { ...data, isLoading: false, error: null, refetch: () => {} } as const;
}

export function useRefreshDashboard() {
  return { mutate: () => {}, isPending: false } as const;
}

export function useExportReport() {
  return { mutate: (_: { format: 'pdf' | 'excel' | 'powerpoint' }) => {}, isPending: false } as const;
}

export default { useDashboardData, useRefreshDashboard, useExportReport };


