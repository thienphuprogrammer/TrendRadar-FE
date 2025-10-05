/**
 * Analytics Service
 * Business logic for analytics and trends data
 */

import { apiClient } from '@/lib/api/unified-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { TrendData } from '@/types';

export interface KPIMetrics {
  totalRevenue: {
    value: string;
    change: number;
    trend: number[];
  };
  trendScore: {
    value: string;
    change: number;
    trend: number[];
  };
  activeUsers: {
    value: string;
    change: number;
    trend: number[];
  };
  pageViews: {
    value: string;
    change: number;
    trend: number[];
  };
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }>;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface GeographicData {
  region: string;
  value: number;
  growth: number;
  percentage?: number;
}

export interface TrendFilters {
  timeRange?: '24h' | '7d' | '30d' | '90d';
  category?: string;
  platform?: string;
  minGrowth?: number;
  sortBy?: 'growth' | 'volume' | 'engagement';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface TrendsResponse {
  trends: TrendData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'powerpoint';
  dateRange?: {
    start: string;
    end: string;
  };
  includeSections?: string[];
}

/**
 * Analytics Service Class
 */
class AnalyticsService {
  /**
   * Get KPI metrics
   */
  async getKPIs(): Promise<KPIMetrics> {
    return apiClient.get<KPIMetrics>(API_ENDPOINTS.analytics.kpis);
  }

  /**
   * Get trends list
   */
  async getTrends(filters?: TrendFilters): Promise<TrendsResponse> {
    return apiClient.get<TrendsResponse>(API_ENDPOINTS.analytics.trends, {
      params: filters,
    });
  }

  /**
   * Get trend details by ID
   */
  async getTrendDetails(id: string): Promise<TrendData> {
    return apiClient.get<TrendData>(API_ENDPOINTS.analytics.trendDetails(id));
  }

  /**
   * Get revenue chart data
   */
  async getRevenueChart(timeRange: string = '7d'): Promise<ChartData> {
    return apiClient.get<ChartData>(`${API_ENDPOINTS.analytics.dashboard}/revenue`, {
      params: { timeRange },
    });
  }

  /**
   * Get sentiment analysis data
   */
  async getSentimentData(timeRange: string = '7d'): Promise<SentimentData> {
    return apiClient.get<SentimentData>(API_ENDPOINTS.analytics.sentiment, {
      params: { timeRange },
    });
  }

  /**
   * Get geographic distribution data
   */
  async getGeographicData(timeRange: string = '7d'): Promise<GeographicData[]> {
    return apiClient.get<GeographicData[]>(API_ENDPOINTS.analytics.geographic, {
      params: { timeRange },
    });
  }

  /**
   * Export analytics report
   */
  async exportReport(options: ExportOptions): Promise<Blob> {
    const response = await apiClient.request({
      method: 'POST',
      url: API_ENDPOINTS.analytics.export,
      data: options,
      responseType: 'blob',
    });

    return response.data as unknown as Blob;
  }

  /**
   * Download exported report
   */
  async downloadReport(options: ExportOptions): Promise<void> {
    const blob = await this.exportReport(options);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report.${options.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<{
    kpis: KPIMetrics;
    recentTrends: TrendData[];
    sentimentOverview: SentimentData;
  }> {
    return apiClient.get(API_ENDPOINTS.analytics.dashboard);
  }

  /**
   * Refresh dashboard data
   */
  async refreshDashboard(): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.analytics.dashboard}/refresh`);
  }
}

/**
 * Export singleton instance
 */
export const analyticsService = new AnalyticsService();

