'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Save, Code, Settings, RefreshCw } from 'lucide-react';
import { Message } from '@/types/chat';

interface MessageActionsProps {
  message: Message;
}

export default function MessageActions({ message }: MessageActionsProps) {
  if (!message.actions) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mt-3 flex flex-wrap gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs hover:bg-primary hover:text-white"
        onClick={message.actions.onSaveAsView}
      >
        <Save className="h-3 w-3 mr-1" />
        Save as View
      </Button>
      {message.sql && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs hover:bg-blue-600 hover:text-white"
          onClick={message.actions.onAdjustSQL}
        >
          <Code className="h-3 w-3 mr-1" />
          Adjust SQL
        </Button>
      )}
      {message.reasoningSteps && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs hover:bg-purple-600 hover:text-white"
          onClick={message.actions.onAdjustReasoning}
        >
          <Settings className="h-3 w-3 mr-1" />
          Adjust Reasoning
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs hover:bg-orange-600 hover:text-white"
        onClick={message.actions.onRegenerate}
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Regenerate
      </Button>
    </motion.div>
  );
}
