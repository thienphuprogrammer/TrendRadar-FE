'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Send, Mic, Paperclip } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false, 
  placeholder = "Ask me about trends, revenue, engagement, or anything else..." 
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-6 border-t bg-gradient-to-br from-background/50 to-muted/20 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-xl hover:bg-primary/10 flex-shrink-0"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="flex-1 h-12 rounded-xl border-muted-foreground/20 bg-background/50 backdrop-blur-sm focus-visible:ring-primary"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-xl hover:bg-primary/10 flex-shrink-0"
            title="Voice input"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
