'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';
import { DashboardService, ChartData } from '@/lib/services/dashboardService';
import { useFilter } from "@/contexts/FilterContext";

interface RevenueChartProps {
  className?: string;
}

export function RevenueChart({ className }: RevenueChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dashboardService = DashboardService.getInstance();
  const { filter } = useFilter();

  useEffect(() => {
    loadChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.timeRange, filter.channel, filter.region, filter.vertical, filter.storeId]);

  const loadChartData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
    // In real implementation, pass filter to API call
    const data = dashboardService.getRevenueChartData(/* filter */);
    setChartData(data);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    await loadChartData();
  };

  const handleAnalyze = () => {
    window.location.href = '/trends';
  };

  if (!chartData) {
    return (
      <Card className={`hover:shadow-lg transition-shadow ${className}`}>
        <CardContent className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  // Calculate chart dimensions and bars
  const maxValue = Math.max(...chartData.datasets.flatMap(d => d.data));
  const chartHeight = 200;

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue & Search Volume Trends
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter.timeRange} onValueChange={(value) => {
              // Handle time range change
            }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleAnalyze}>
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Analyze
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-sm">
            {chartData.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: dataset.borderColor }}
                ></div>
                <span>{dataset.label}</span>
              </div>
            ))}
          </div>

          {/* Interactive Chart */}
          <div className="relative" style={{ height: chartHeight + 40 }}>
            <div className="flex items-end justify-between h-full gap-2 px-4">
              {chartData.labels.map((label, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="flex flex-col items-center gap-1 mb-2 w-full">
                    {chartData.datasets.map((dataset, datasetIndex) => {
                      const value = dataset.data[index];
                      const height = (value / maxValue) * chartHeight;
                      return (
                        <div
                          key={datasetIndex}
                          className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative group/bar"
                          style={{
                            height: `${height}px`,
                            backgroundColor: dataset.backgroundColor,
                            border: `2px solid ${dataset.borderColor}`,
                            minHeight: '4px'
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {dataset.label}: {value.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">+12.5%</div>
              <div className="text-xs text-muted-foreground">Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">Friday</div>
              <div className="text-xs text-muted-foreground">Peak Day</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">$34.6K</div>
              <div className="text-xs text-muted-foreground">Weekly Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">3.2%</div>
              <div className="text-xs text-muted-foreground">Conversion Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}