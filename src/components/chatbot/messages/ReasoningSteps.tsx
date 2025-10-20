'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Lightbulb, Edit } from 'lucide-react';

interface ReasoningStepsProps {
  reasoningSteps: {
    steps: string[];
    currentStep?: number;
  };
}

export default function ReasoningSteps({ reasoningSteps }: ReasoningStepsProps) {
  if (!reasoningSteps) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-purple-600" />
          Reasoning Steps
        </h4>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          <Edit className="h-3 w-3 mr-1" />
          Adjust
        </Button>
      </div>
      <div className="space-y-2">
        {reasoningSteps.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className={`flex items-start gap-3 p-2 rounded-lg ${
              index === reasoningSteps.currentStep 
                ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700' 
                : 'bg-white/50 dark:bg-slate-800/50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              index <= (reasoningSteps.currentStep || 0)
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {index + 1}
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300">{step}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
