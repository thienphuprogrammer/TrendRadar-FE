'use client';

import { toast } from 'sonner';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export interface DashboardMetrics {
  revenue: ChartData;
  searchVolume: ChartData;
  engagement: ChartData;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  geographic: {
    region: string;
    value: number;
    growth: number;
  }[];
}

export class DashboardService {
  private static instance: DashboardService;

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  public async refreshData(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Dashboard data refreshed successfully!');
  }

  public async exportReport(format: 'pdf' | 'excel' | 'powerpoint'): Promise<void> {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const formatLabels = {
      pdf: 'PDF Report',
      excel: 'Excel Workbook',
      powerpoint: 'PowerPoint Presentation'
    };
    
    toast.success(`${formatLabels[format]} exported successfully!`);
  }

  public async shareReport(): Promise<string> {
    // Generate shareable link
    const shareId = Math.random().toString(36).substring(7);
    const shareUrl = `${window.location.origin}/shared/${shareId}`;
    
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Dashboard link copied to clipboard!');
    
    return shareUrl;
  }

  public async scheduleReport(frequency: string, recipients: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Report scheduled ${frequency} for ${recipients.length} recipients`);
  }

  public async setupAlerts(thresholds: Record<string, number>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Custom alerts configured successfully!');
  }

  public getRevenueChartData(): ChartData {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Revenue ($)',
          data: [4200, 3800, 5200, 4900, 6100, 5800, 4600],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
        {
          label: 'Search Volume',
          data: [1200, 1100, 1500, 1400, 1800, 1600, 1300],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
        }
      ]
    };
  }

  public getSentimentData() {
    return {
      positive: 75,
      neutral: 20,
      negative: 5
    };
  }

  public getGeographicData() {
    return [
      { region: 'North America', value: 45, growth: 12.5 },
      { region: 'Europe', value: 30, growth: 8.7 },
      { region: 'Asia Pacific', value: 20, growth: 22.1 },
      { region: 'Others', value: 5, growth: 5.3 }
    ];
  }

  public getEngagementData(): ChartData {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Engagement Rate (%)',
          data: [7.2, 6.8, 8.1, 7.9, 9.2, 8.5, 7.6],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
        }
      ]
    };
  }
}