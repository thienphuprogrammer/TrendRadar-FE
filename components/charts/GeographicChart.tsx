'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardService } from '@/lib/services/dashboardService';
import { useFilter } from "@/contexts/FilterContext";

export function GeographicChart() {
  const [geoData, setGeoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dashboardService = DashboardService.getInstance();
  const { filter } = useFilter();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.timeRange, filter.channel, filter.region, filter.vertical, filter.storeId]);

  const loadData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    // In real implementation, pass filter to API call
    setGeoData(dashboardService.getGeographicData(/* filter */));
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const maxValue = Math.max(...geoData.map(item => item.value));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Performance
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Interactive World Map Representation */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Interactive Geographic Heatmap</p>
                <p className="text-xs text-muted-foreground">Click regions for detailed insights</p>
              </div>
              
              {/* Floating region indicators */}
              <div className="absolute top-4 left-8 p-2 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow">
                <div className="text-xs font-medium">NA</div>
                <div className="text-xs text-green-600">+12.5%</div>
              </div>
              <div className="absolute top-8 right-12 p-2 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow">
                <div className="text-xs font-medium">EU</div>
                <div className="text-xs text-blue-600">+8.7%</div>
              </div>
              <div className="absolute bottom-8 right-8 p-2 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow">
                <div className="text-xs font-medium">APAC</div>
                <div className="text-xs text-purple-600">+22.1%</div>
              </div>
            </div>

            {/* Regional Performance List */}
            <div className="space-y-3">
              {geoData.map((region, index) => (
                <div key={region.region} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{region.region}</div>
                      <div className="text-xs text-muted-foreground">{region.value}% of total traffic</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(region.value / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {region.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={region.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                        {region.growth > 0 ? '+' : ''}{region.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="pt-4 border-t grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">127</div>
                <div className="text-xs text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">+14.2%</div>
                <div className="text-xs text-muted-foreground">Global Growth</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">2.4M</div>
                <div className="text-xs text-muted-foreground">Total Reach</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}