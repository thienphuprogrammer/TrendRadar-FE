'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Database, Code, Play, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SQLQueryProps {
  sql: {
    query: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: any;
  };
}

export default function SQLQuery({ sql }: SQLQueryProps) {
  if (!sql) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'running': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Database className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          SQL Query
          {getStatusIcon(sql.status)}
        </h4>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Code className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Play className="h-3 w-3 mr-1" />
            Run
          </Button>
        </div>
      </div>
      <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
        <pre>{sql.query}</pre>
      </div>
      {sql.result && (
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            {sql.result.rows} rows returned
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {sql.result.executionTime}
          </span>
        </div>
      )}
    </motion.div>
  );
}
