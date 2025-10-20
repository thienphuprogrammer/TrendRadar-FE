'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight, MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react';
import { motion, useAnimation, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

export interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon?: React.ReactNode;
  trend?: number[];
  className?: string;
}

export function KPICard({ title, value, change, changeLabel, icon, trend, className }: KPICardProps) {
  const isPositive = change >= 0;
  const valueRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(typeof value === 'number' ? 0 : 0);
  const transformedValue = useTransform(motionValue, (v) => Math.round(v).toLocaleString());
  const controls = useAnimation();
  const inViewRef = useRef(null);
  const isInView = useInView(inViewRef, { once: true });

  useEffect(() => {
    if (typeof value === 'number' && isInView) {
      const controls = animate(motionValue, value, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [value, isInView]);

  // Simple sparkline visualization
  const renderSparkline = () => {
    if (!trend || trend.length === 0) return null;
    
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min;
    
    return (
      <div className="flex items-end gap-0.5 h-8 mt-2">
        {trend.map((value, index) => {
          const height = range === 0 ? 50 : ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className={`flex-1 rounded-sm transition-all duration-300 ${
                isPositive ? 'bg-green-200 hover:bg-green-300' : 'bg-red-200 hover:bg-red-300'
              }`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };
  
  return (
    <motion.div
      ref={inViewRef}
      className={cn('transition-all hover:shadow-lg hover:-translate-y-1 group cursor-pointer', className)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <motion.div
              className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.2, rotate: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {icon}
            </motion.div>
          )}
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {typeof value === 'number' ? (
              <motion.span ref={valueRef}>
                {transformedValue}
              </motion.span>
            ) : (
              value
            )}
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant={isPositive ? "default" : "destructive"}
              className="flex items-center gap-1 px-2 py-1"
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(change)}%
            </Badge>
            <p className="text-xs text-muted-foreground">{changeLabel}</p>
          </div>
        </div>
        
        {/* Sparkline Chart */}
        {renderSparkline()}
        
        {/* Additional Context */}
        <div className="pt-2 border-t border-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>7-day trend</span>
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
              {isPositive ? '↗' : '↘'} {Math.abs(change)}%
            </span>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
}