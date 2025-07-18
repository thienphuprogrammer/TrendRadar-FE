'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, RefreshCw } from 'lucide-react';
import { DashboardService } from '@/lib/services/dashboardService';
import { useFilter } from "@/contexts/FilterContext";

export function SentimentChart() {
  const [sentimentData, setSentimentData] = useState({ positive: 75, neutral: 20, negative: 5 });
  const [isLoading, setIsLoading] = useState(false);
  const dashboardService = DashboardService.getInstance();
  const { filter } = useFilter();

  useEffect(() => {
    loadSentiment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.timeRange, filter.channel, filter.region, filter.vertical, filter.storeId]);

  const loadSentiment = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real implementation, pass filter to API call
    setSentimentData(dashboardService.getSentimentData(/* filter */));
    setIsLoading(false);
  };

  const sentimentItems = [
    { label: 'Positive', value: sentimentData.positive, color: 'bg-green-500' },
    { label: 'Neutral', value: sentimentData.neutral, color: 'bg-yellow-500' },
    { label: 'Negative', value: sentimentData.negative, color: 'bg-red-500' }
  ];

  const overallScore = (sentimentData.positive * 1 + sentimentData.neutral * 0.5 + sentimentData.negative * 0) / 10;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sentiment Analysis
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadSentiment} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sentimentItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                {item.label}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold w-10 text-right">{item.value}%</span>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Score</span>
              <span className="font-semibold text-green-600">{overallScore.toFixed(1)}/10</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Based on {(Math.random() * 10000 + 5000).toFixed(0)} analyzed mentions
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}