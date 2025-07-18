'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { KPICard } from '@/components/KPICard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { SentimentChart } from '@/components/charts/SentimentChart';
import { GeographicChart } from '@/components/charts/GeographicChart';
import { TrendCard } from '@/components/trends/TrendCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DomainFilter, TimeFilter, RegionFilter } from '@/components/filters';
import { DashboardService } from '@/lib/services/dashboardService';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Eye, 
  Share2, 
  Download,
  RefreshCw,
  Calendar,
  Globe,
  Filter,
  Store,
  Upload,
  Sparkles,
  BarChart3,
  Target,
  ArrowUpRight,
  Clock,
  Zap,
  ChevronRight,
  AlertTriangle,
  Bell,
  Settings
} from 'lucide-react';

import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { GlobalFilterBar } from '@/components/GlobalFilterBar';
import { useFilter } from "@/contexts/FilterContext";
const ImportModal = dynamic(() => import('@/components/ImportModal'), { ssr: false });

// Mock data for demonstration
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

const hotTrends = [
  { 
    hashtag: '#SustainableFashion', 
    growth: '+245%', 
    posts: '12.4K', 
    source: 'Multi-source',
    engagement: '8.4%',
    velocity: 'Accelerating',
    category: 'Fashion'
  },
  { 
    hashtag: '#TechGadgets2024', 
    growth: '+189%', 
    posts: '8.7K', 
    source: 'TikTok',
    engagement: '6.2%',
    velocity: 'Rising',
    category: 'Technology'
  },
  { 
    hashtag: '#HomeDecor', 
    growth: '+156%', 
    posts: '15.2K', 
    source: 'Instagram',
    engagement: '5.8%',
    velocity: 'Steady',
    category: 'Home'
  },
  { 
    hashtag: '#FitnessMotivation', 
    growth: '+134%', 
    posts: '9.8K', 
    source: 'Imported',
    engagement: '7.1%',
    velocity: 'Rising',
    category: 'Fitness'
  },
  { 
    hashtag: '#FoodieLife', 
    growth: '+112%', 
    posts: '18.6K', 
    source: 'Multi-source',
    engagement: '4.9%',
    velocity: 'Stable',
    category: 'Food'
  },
];

const domains = [
  { id: 'all', name: 'All Domains', stores: 15, revenue: '$124.5K', growth: '+12.5%' },
  { id: 'fashion', name: 'Fashion & Apparel', stores: 5, revenue: '$45.2K', growth: '+18.3%' },
  { id: 'tech', name: 'Technology', stores: 3, revenue: '$38.7K', growth: '+22.1%' },
  { id: 'home', name: 'Home & Garden', stores: 4, revenue: '$28.4K', growth: '+8.7%' },
  { id: 'food', name: 'Food & Beverage', stores: 3, revenue: '$12.2K', growth: '+15.2%' },
];

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

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showImportModal, setShowImportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardService = DashboardService.getInstance();
  const { filter, setFilter } = useFilter();

  // Example: fetch KPIs, hot trends, quick insights based on filter
  // In real implementation, replace with API calls using filter
  const kpis = React.useMemo(() => {
    // dashboardService.getKPIs(filter) in real app
    return mockKPIs; // Replace with filtered data if needed
  }, [filter]);

  const trends = React.useMemo(() => {
    // dashboardService.getHotTrends(filter)
    return hotTrends; // Replace with filtered data if needed
  }, [filter]);

  const insights = React.useMemo(() => {
    // dashboardService.getQuickInsights(filter)
    return quickInsights; // Replace with filtered data if needed
  }, [filter]);

  // Get selected domain from global filter
  const selectedDomain = React.useMemo(() => {
    if (!filter || !filter.vertical || filter.vertical === 'all') return null;
    return domains.find(d => d.id === filter.vertical);
  }, [filter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dashboardService.refreshData();
      setLastUpdated(new Date());
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'powerpoint' = 'pdf') => {
    setIsExporting(true);
    try {
      await dashboardService.exportReport(format);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      await dashboardService.shareReport();
    } catch (error) {
      toast.error('Failed to share dashboard');
    }
  };

  const handleSchedule = async () => {
    try {
      await dashboardService.scheduleReport('weekly', ['team@company.com']);
    } catch (error) {
      toast.error('Failed to schedule report');
    }
  };

  const handleAlerts = async () => {
    try {
      await dashboardService.setupAlerts({
        revenue: 5000,
        engagement: 5.0,
        growth: 10
      });
    } catch (error) {
      toast.error('Failed to setup alerts');
    }
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
        toast.info(`${action} feature coming soon!`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Header title="Dashboard" subtitle="Business & Trend Overview" />
      
      {/* Enhanced Global Filter with Quick Date Presets */}
      <Card className="border-none shadow-none bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <GlobalFilterBar />
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Select defaultValue="today">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Summary with Enhanced Visual Design */}
      {selectedDomain && (
        <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent animate-in slide-in-from-left duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDomain.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">{selectedDomain.stores}</span> stores
                    </span>
                    <span className="flex items-center gap-1">
                      Revenue: <span className="font-medium text-green-600">{selectedDomain.revenue}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      Growth: <span className="font-medium text-green-600">{selectedDomain.growth}</span>
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setFilter({ vertical: 'all' })}>
                Clear Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced KPI Cards with Micro Charts and Hover Effects */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard 
            key={index} 
            {...kpi} 
            className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          />
        ))}
      </div>

      {/* Quick Insights with Interactive Elements */}
      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-primary/50"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  {insight.icon}
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">{insight.title}</h4>
                <p className="font-semibold text-lg mb-1">{insight.value}</p>
                <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-7 group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={() => handleQuickAction(insight.action)}
                >
                  {insight.action}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Analytics Tabs */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="charts" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics Charts
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Hot Trends
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Active Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <RevenueChart className="lg:col-span-2" />
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add performance metrics content */}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <GeographicChart />
            <SentimentChart />
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Hot Trends Now
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Live
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                    <Upload className="h-4 w-4 mr-1" />
                    Import
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {trends.map((trend, index) => (
                <TrendCard
                  key={index}
                  hashtag={trend.hashtag}
                  growth={trend.growth}
                  posts={trend.posts}
                  source={trend.source}
                  engagement={trend.engagement}
                  velocity={trend.velocity}
                  category={trend.category}
                />
              ))}
              <div className="mt-4 pt-3 border-t text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Auto-refreshes every 5 minutes • Multi-source data
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/trends'}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View All Trends
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add alerts content */}
                <Button variant="outline" className="w-full" onClick={handleAlerts}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Quick Actions with Animation */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="justify-start gap-3 h-12 hover:bg-primary hover:text-white transition-colors group" 
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 group-hover:animate-pulse" />
              <div className="text-left">
                <div className="font-medium">Share Dashboard</div>
                <div className="text-xs text-muted-foreground group-hover:text-white/80">Export current view</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-3 h-12 hover:bg-primary hover:text-white transition-colors group" 
              onClick={() => handleExport('pdf')} 
              disabled={isExporting}
            >
              <Download className="h-4 w-4 group-hover:animate-bounce" />
              <div className="text-left">
                <div className="font-medium">Export Report</div>
                <div className="text-xs text-muted-foreground group-hover:text-white/80">PDF, Excel, PowerPoint</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-3 h-12 hover:bg-primary hover:text-white transition-colors group" 
              onClick={handleSchedule}
            >
              <Calendar className="h-4 w-4 group-hover:animate-pulse" />
              <div className="text-left">
                <div className="font-medium">Schedule Report</div>
                <div className="text-xs text-muted-foreground group-hover:text-white/80">Automated delivery</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start gap-3 h-12 hover:bg-primary hover:text-white transition-colors group" 
              onClick={handleAlerts}
            >
              <Target className="h-4 w-4 group-hover:animate-spin" />
              <div className="text-left">
                <div className="font-medium">Set Alerts</div>
                <div className="text-xs text-muted-foreground group-hover:text-white/80">Custom notifications</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showImportModal && (
        <ImportModal open={showImportModal} onClose={() => setShowImportModal(false)} />
      )}
    </div>
  );
}