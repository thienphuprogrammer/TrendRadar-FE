'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Zap } from 'lucide-react';

interface ChatHeaderProps {
  responseTime: number;
  isOnline: boolean;
}

export default function ChatHeader({ responseTime, isOnline }: ChatHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-b bg-gradient-to-r from-background/50 to-muted/20 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 bg-gradient-to-br from-primary via-primary/90 to-blue-600 rounded-2xl shadow-lg shadow-primary/25"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Bot className="h-6 w-6 text-primary-foreground" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              AI Trend Analyst
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground">Ask me anything about your trends and analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            isOnline 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              isOnline ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted/50">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground">
              {responseTime > 0 ? `${(responseTime/1000).toFixed(1)}s` : '<2s'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
