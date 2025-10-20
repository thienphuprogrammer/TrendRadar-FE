'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart3, ExternalLink, Sparkles } from 'lucide-react';

interface MiniChartProps {
  chart: {
    type: 'line' | 'bar' | 'pie';
    data: any;
    title: string;
  };
}

export default function MiniChart({ chart }: MiniChartProps) {
  if (!chart) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 via-blue-50/50 to-transparent dark:from-primary/10 dark:via-blue-950/20 border border-primary/10 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          {chart.title}
        </h4>
        <Button variant="outline" size="sm" className="h-7 text-xs hover:bg-primary hover:text-white transition-colors">
          <ExternalLink className="h-3 w-3 mr-1" />
          Full View
        </Button>
      </div>
      <div className="h-32 flex items-end gap-1 mb-2">
        {chart.data.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
            className="flex-1 flex flex-col items-center group"
          >
            <div
              className="w-full bg-gradient-to-t from-primary via-blue-500 to-blue-400 rounded-t hover:from-primary/80 hover:via-blue-500/80 hover:to-blue-400/80 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              style={{
                height: `${(item.revenue || item.posts || item.engagement * 10) / Math.max(...chart.data.map((d: any) => d.revenue || d.posts || d.engagement * 10)) * 100}%`,
                minHeight: '8px'
              }}
            />
            <span className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors font-medium">
              {item.day || item.hashtag?.slice(0, 4) || index + 1}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" />
          Interactive chart
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live data
        </span>
      </div>
    </motion.div>
  );
}
