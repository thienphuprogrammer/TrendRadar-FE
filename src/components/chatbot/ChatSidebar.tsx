'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  TrendingUp,
  BarChart3,
  Target,
  Lightbulb,
  Zap,
  Sparkles,
  Plus,
  History,
  Share2,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { QuickAction, SampleQuestion, SessionStats, ThreadInfo } from '@/types/chat';

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSendMessage: (message: string) => void;
  quickActions: QuickAction[];
  sampleQuestions: SampleQuestion[];
  sessionStats: SessionStats;
  threadInfo: ThreadInfo | null;
  onNewChat: () => void;
  onHistory: () => void;
  onExport: () => void;
  onClear: () => void;
}

export default function ChatSidebar({
  isCollapsed,
  onToggleCollapse,
  onSendMessage,
  quickActions,
  sampleQuestions,
  sessionStats,
  threadInfo,
  onNewChat,
  onHistory,
  onExport,
  onClear
}: ChatSidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 320
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex flex-col border-r bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl relative"
    >
      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="absolute -right-4 top-20 z-10 h-8 w-8 rounded-full border bg-background shadow-lg hover:bg-accent"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <ScrollArea className="flex-1 p-4">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 px-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-3 hover:bg-primary/10 hover:border-primary/30 transition-all"
                        onClick={() => onSendMessage(action.query)}
                      >
                        <action.icon className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                        <span className="text-left flex-1 text-sm">{action.label}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sample Questions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 px-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Sample Questions
                </h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {sampleQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-2 whitespace-normal hover:bg-primary/5"
                        onClick={() => onSendMessage(question.text)}
                      >
                        <MessageCircle className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5 text-primary" />
                        <span className="text-xs">{question.text}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Thread Management */}
              {threadInfo && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 px-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Current Thread
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-xs text-muted-foreground">Thread ID</span>
                      <span className="font-semibold text-sm font-mono">{threadInfo.id}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-xs text-muted-foreground">Messages</span>
                      <span className="font-semibold text-sm">{threadInfo.messageCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <span className="font-semibold text-sm text-green-600 capitalize">{threadInfo.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Session Stats */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3 flex items-center gap-2 px-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Session Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-xs text-muted-foreground">Queries Today</span>
                    <span className="font-semibold text-sm">{sessionStats.queriesToday}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-xs text-muted-foreground">Avg Response</span>
                    <span className="font-semibold text-sm text-green-600">{sessionStats.avgResponseTime}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-xs text-muted-foreground">Accuracy</span>
                    <span className="font-semibold text-sm">{sessionStats.accuracy}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-xs text-muted-foreground">Sources</span>
                    <span className="font-semibold text-sm">{sessionStats.sources}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start hover:bg-primary/10" onClick={onNewChat}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start hover:bg-primary/10" onClick={onHistory}>
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start hover:bg-primary/10" onClick={onExport}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start hover:bg-destructive/10 hover:text-destructive" onClick={onClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 flex flex-col items-center"
            >
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => onSendMessage(action.query)}
                  title={action.label}
                >
                  <action.icon className="h-5 w-5 text-primary" />
                </Button>
              ))}
              <div className="h-px w-8 bg-border my-2" />
              <Button variant="ghost" size="icon" className="h-10 w-10" title="New Chat" onClick={onNewChat}>
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10" title="History" onClick={onHistory}>
                <History className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10" title="Export" onClick={onExport}>
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}
