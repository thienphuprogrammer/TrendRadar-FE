'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Download,
  Maximize2
} from 'lucide-react';

interface ChartData {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  title: string;
}

interface ChartVisualizationProps {
  chart: ChartData;
  className?: string;
}

export default function ChartVisualization({ chart, className }: ChartVisualizationProps) {
  if (!chart || !chart.data) return null;

  const getMaxValue = () => {
    return Math.max(...chart.data.map((item: any) => 
      item.revenue || item.posts || item.engagement * 10 || item.value || 0
    ));
  };

  const getMinValue = () => {
    return Math.min(...chart.data.map((item: any) => 
      item.revenue || item.posts || item.engagement * 10 || item.value || 0
    ));
  };

  const getTrend = () => {
    if (chart.data.length < 2) return 'stable';
    const first = chart.data[0];
    const last = chart.data[chart.data.length - 1];
    const firstValue = first.revenue || first.posts || first.engagement * 10 || first.value || 0;
    const lastValue = last.revenue || last.posts || last.engagement * 10 || last.value || 0;
    
    if (lastValue > firstValue) return 'up';
    if (lastValue < firstValue) return 'down';
    return 'stable';
  };

  const getTrendIcon = () => {
    const trend = getTrend();
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    const trend = getTrend();
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const renderBarChart = () => {
    const maxValue = getMaxValue();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {getTrend() === 'up' ? 'Tăng trưởng' : getTrend() === 'down' ? 'Giảm' : 'Ổn định'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Max: {formatValue(maxValue)}
          </div>
        </div>
        
        <div className="h-48 flex items-end gap-2">
          {chart.data.map((item: any, index: number) => {
            const value = item.revenue || item.posts || item.engagement * 10 || item.value || 0;
            const height = (value / maxValue) * 100;
            const label = item.day || item.hashtag || item.name || `Item ${index + 1}`;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full">
                  <div 
                    className="w-full bg-gradient-to-t from-primary to-blue-500 rounded-t hover:from-primary/80 hover:to-blue-500/80 transition-all duration-300 cursor-pointer group-hover:shadow-lg"
                    style={{ 
                      height: `${Math.max(height, 8)}%`,
                      minHeight: '8px'
                    }}
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {formatValue(value)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors text-center">
                  {label.length > 8 ? label.slice(0, 8) + '...' : label}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="text-muted-foreground">Min</div>
            <div className="font-medium">{formatValue(getMinValue())}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Trung bình</div>
            <div className="font-medium">
              {formatValue(chart.data.reduce((sum: number, item: any) => 
                sum + (item.revenue || item.posts || item.engagement * 10 || item.value || 0), 0
              ) / chart.data.length)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Max</div>
            <div className="font-medium">{formatValue(maxValue)}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = getMaxValue();
    const minValue = getMinValue();
    const range = maxValue - minValue;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {getTrend() === 'up' ? 'Xu hướng tăng' : getTrend() === 'down' ? 'Xu hướng giảm' : 'Ổn định'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatValue(minValue)} - {formatValue(maxValue)}
          </div>
        </div>
        
        <div className="h-48 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y, i) => (
              <line
                key={i}
                x1="0"
                y1={y * 2}
                x2="400"
                y2={y * 2}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-muted-foreground/20"
              />
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              points={chart.data.map((item: any, index: number) => {
                const value = item.revenue || item.posts || item.engagement * 10 || item.value || 0;
                const x = (index / (chart.data.length - 1)) * 400;
                const y = 200 - ((value - minValue) / range) * 200;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {chart.data.map((item: any, index: number) => {
              const value = item.revenue || item.posts || item.engagement * 10 || item.value || 0;
              const x = (index / (chart.data.length - 1)) * 400;
              const y = 200 - ((value - minValue) / range) * 200;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="currentColor"
                  className="text-primary hover:r-6 transition-all cursor-pointer"
                />
              );
            })}
          </svg>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          {chart.data.map((item: any, index: number) => (
            <span key={index} className="text-center">
              {item.day || item.hashtag || item.name || index + 1}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = chart.data.reduce((sum: number, item: any) => 
      sum + (item.value || item.revenue || item.posts || item.engagement * 10 || 0), 0
    );
    
    let cumulativePercentage = 0;
    const colors = [
      'bg-primary',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Tổng: {formatValue(total)}</div>
          <div className="text-xs text-muted-foreground">
            {chart.data.length} mục
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {chart.data.map((item: any, index: number) => {
                const value = item.value || item.revenue || item.posts || item.engagement * 10 || 0;
                const percentage = (value / total) * 100;
                const startAngle = (cumulativePercentage / 100) * 360;
                const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
                
                const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                
                const largeArcFlag = percentage > 50 ? 1 : 0;
                
                const pathData = [
                  `M 50 50`,
                  `L ${x1} ${y1}`,
                  `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`
                ].join(' ');
                
                cumulativePercentage += percentage;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={`var(--${colors[index % colors.length].replace('bg-', '')})`}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="flex-1 space-y-2">
            {chart.data.map((item: any, index: number) => {
              const value = item.value || item.revenue || item.posts || item.engagement * 10 || 0;
              const percentage = ((value / total) * 100).toFixed(1);
              const label = item.name || item.hashtag || item.day || `Mục ${index + 1}`;
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                  <span className="text-sm flex-1">{label}</span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <Card className={`mt-4 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-primary" />
            {chart.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {chart.type.toUpperCase()}
            </Badge>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Download className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Xem chi tiết
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Biểu đồ tương tác • Nhấp để xem chi tiết</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Dữ liệu trực tiếp
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
