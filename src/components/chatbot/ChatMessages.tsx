'use client';

import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Clock, Copy, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Message } from '@/types/chat';
import MessageBubble from './messages/MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  onCopyMessage: (content: string) => void;
}

export default function ChatMessages({ messages, isTyping, onCopyMessage }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                </motion.div>
              )}

              <div className={`max-w-[85%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <MessageBubble 
                  message={message} 
                  onCopyMessage={onCopyMessage}
                />
              </div>

              {message.type === 'user' && (
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-blue-600 flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white animate-pulse" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
