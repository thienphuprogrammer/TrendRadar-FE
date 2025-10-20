'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message } from '@/types/chat';
import MiniChart from './MiniChart';
import SQLQuery from './SQLQuery';
import ReasoningSteps from './ReasoningSteps';
import MessageActions from './MessageActions';

interface MessageBubbleProps {
  message: Message;
  onCopyMessage: (content: string) => void;
}

export default function MessageBubble({ message, onCopyMessage }: MessageBubbleProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-2xl p-4 ${
        message.type === 'user'
          ? 'bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/25'
          : 'bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 backdrop-blur-sm'
      }`}
    >
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {message.content.split('\n').map((line, index) => (
          <p key={index} className={`${index === 0 ? 'mt-0' : ''} ${message.type === 'user' ? 'text-primary-foreground' : ''}`}>
            {line}
          </p>
        ))}
      </div>

      {/* Chart Component */}
      {message.chart && <MiniChart chart={message.chart} />}
      
      {/* SQL Query Component */}
      {message.sql && <SQLQuery sql={message.sql} />}
      
      {/* Reasoning Steps Component */}
      {message.reasoningSteps && <ReasoningSteps reasoningSteps={message.reasoningSteps} />}
      
      {/* Message Actions Component */}
      {message.actions && <MessageActions message={message} />}

      {/* Suggestions */}
      {message.suggestions && message.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {message.suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-7 text-xs hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
            >
              {suggestion}
            </Button>
          ))}
        </motion.div>
      )}

      {/* Message Footer */}
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {message.timestamp.toLocaleTimeString()}
        </div>
        {message.type === 'bot' && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:text-primary" 
              onClick={() => onCopyMessage(message.content)}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-green-600">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-red-600">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
