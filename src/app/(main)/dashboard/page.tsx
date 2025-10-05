/**
 * Dashboard Page
 * Main dashboard with analytics, trends, and KPI metrics
 */

'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layouts/Header';
import { KPICard } from '@/components/common/display/KPICard';
import { RevenueChart, SentimentChart, GeographicChart } from '@/components/chart';
import { TrendCard } from '@/components/features/trends/TrendCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalFilterBar } from '@/components/shared/filters/GlobalFilterBar';
import { useFilterState } from '@/contexts/OptimizedFilterContext';
import { useDashboardData, useRefreshDashboard, useExportReport } from '@/hooks/useAnalytics';
import { ErrorBoundary } from '@/components/common/feedback/ErrorBoundary';
import { PageLoading, CardSkeleton, ChartSkeleton } from '@/components/common/feedback/LoadingStates';
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  RefreshCw,
  Download,
  Upload,
  Sparkles,
  BarChart3,
  AlertTriangle,
  Bell,
  Settings,
  Share2,
  Clock,
  Target,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
const ImportModal = dynamic(() => import('@/components/modals').then(m => m.ImportDataSourceSQLModal), { ssr: false });

const quickInsights = [
  {
    title: 'Peak Performance Hour',
    value: '2:00 PM - 3:00 PM',
    description: 'Highest engagement window today',
    icon: <Clock className="h-4 w-4" />,
    action: 'Schedule Posts',
  },
  {
    title: 'Top Converting Hashtag',
    value: '#SustainableFashion',
    description: '3.2x higher conversion rate',
    icon: <Target className="h-4 w-4" />,
    action: 'Create Content',
  },
  {
    title: 'Trending Category',
    value: 'Eco-Friendly Products',
    description: 'Rising 45% this week',
    icon: <TrendingUp className="h-4 w-4" />,
    action: 'Explore Trends',
  },
];

export default function DashboardPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const filter = useFilterState();
  
  // Use optimized hooks
  const { kpis, revenueChart, sentiment, geographic, hotTrends, isLoading, error, refetch } = 
    useDashboardData(filter.timeRange);
  
  const refreshDashboard = useRefreshDashboard();
  const exportReport = useExportReport();

  const handleRefresh = () => {
    refreshDashboard.mutate();
  };

  const handleExport = (format: 'pdf' | 'excel' | 'powerpoint' = 'pdf') => {
    exportReport.mutate({ format });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Schedule Posts':
        window.location.href = '/content';
        break;
      case 'Create Content':
        window.location.href = '/content';
        break;
      case 'Explore Trends':
        window.location.href = '/trends';
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  // Show loading state
  if (isLoading && !kpis) {
    return <PageLoading message="Loading dashboard data..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="font-semibold text-lg">Failed to load dashboard</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Please try again later or contact support if the problem persists.
                </p>
              </div>
              <Button onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockKPIs = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: 12.5,
      changeLabel: 'from last month',
      icon: <DollarSign className="h-4 w-4" />,
      trend: [4200, 3800, 5200, 4900, 6100, 5800, 4600],
    },
    {
      title: 'Trend Score',
      value: '8.4/10',
      change: 5.2,
      changeLabel: 'from last week',
      icon: <TrendingUp className="h-4 w-4" />,
      trend: [7.2, 7.8, 8.1, 7.9, 8.4, 8.2, 8.4],
    },
    {
      title: 'Active Users',
      value: '12,483',
      change: -2.1,
      changeLabel: 'from yesterday',
      icon: <Users className="h-4 w-4" />,
      trend: [12800, 12600, 12483, 12700, 12483, 12400, 12483],
    },
    {
      title: 'Page Views',
      value: '84,291',
      change: 18.2,
      changeLabel: 'from last week',
      icon: <Eye className="h-4 w-4" />,
      trend: [71200, 75400, 78900, 82100, 84291, 83500, 84291],
    },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header title="Dashboard" subtitle="Real-time Business & Trend Insights" />

        <div className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
          {/* Enhanced Global Filter */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-card via-card to-muted/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <GlobalFilterBar />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshDashboard.isPending}
                  className="gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshDashboard.isPending ? 'animate-spin' : ''}`} />
                  {refreshDashboard.isPending ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockKPIs.map((kpi, index) => (
              <KPICard
                key={index}
                {...kpi}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50"
              />
            ))}
          </div>

          {/* Quick Insights */}
          <div className="grid gap-5 md:grid-cols-3">
            {quickInsights.map((insight, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-border/50"
                onClick={() => handleQuickAction(insight.action)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                      {insight.icon}
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">{insight.title}</h4>
                    <p className="font-bold text-xl mb-2">{insight.value}</p>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{insight.description}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-8 w-full group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                    >
                      {insight.action}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="mb-6 bg-muted/50 p-1">
              <TabsTrigger value="charts" className="gap-2 data-[state=active]:bg-background">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-2 data-[state=active]:bg-background">
                <TrendingUp className="h-4 w-4" />
                Hot Trends
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2 data-[state=active]:bg-background">
                <AlertTriangle className="h-4 w-4" />
                Alerts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  {isLoading ? <ChartSkeleton /> : <RevenueChart />}
                </div>
                <Card className="hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-sm font-semibold">4.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Session</span>
                        <span className="text-sm font-semibold">3m 42s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bounce Rate</span>
                        <span className="text-sm font-semibold">32.1%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {isLoading ? (
                  <>
                    <ChartSkeleton height={250} />
                    <ChartSkeleton height={250} />
                  </>
                ) : (
                  <>
                    <GeographicChart />
                    <SentimentChart />
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <Card className="hover:shadow-lg transition-shadow border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Hot Trends Now</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Real-time trending topics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 animate-pulse shadow-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                        Live
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        Import
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                  ) : (
                    hotTrends.map((trend, index) => (
                      <TrendCard key={index} {...trend} />
                    ))
                  )}
                  <div className="mt-6 pt-4 border-t text-center">
                    <p className="text-xs text-muted-foreground mb-3">
                      Auto-refreshes every 5 minutes • Multi-source data
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full shadow-sm hover:shadow-md transition-all"
                      onClick={() => (window.location.href = '/trends')}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View All Trends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg">
                      <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle>Active Alerts</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Monitor critical metrics</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-muted/50 rounded-2xl mb-4">
                      <Bell className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold mb-2">No Active Alerts</h3>
                    <p className="text-xs text-muted-foreground mb-6">
                      Configure alerts to monitor important metrics
                    </p>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-shadow border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button
                  variant="outline"
                  className="justify-start gap-4 h-auto p-5 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all group"
                  onClick={() => console.log('Share')}
                >
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Share Dashboard</div>
                    <div className="text-xs text-muted-foreground">Export current view</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-4 h-auto p-5 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all group"
                  onClick={() => handleExport('pdf')}
                  disabled={exportReport.isPending}
                >
                  <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                    <Download className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Export Report</div>
                    <div className="text-xs text-muted-foreground">PDF, Excel, PowerPoint</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-4 h-auto p-5 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all group"
                  onClick={() => console.log('Settings')}
                >
                  <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <Settings className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Dashboard Settings</div>
                    <div className="text-xs text-muted-foreground">Customize your view</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {showImportModal && (
          <ImportModal open={showImportModal} onClose={() => setShowImportModal(false)} />
        )}
      </div>
    </ErrorBoundary>
  );
}

