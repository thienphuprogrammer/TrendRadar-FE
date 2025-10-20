'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, TrendingUp, BarChart3, Target, Lightbulb, MessageCircle } from 'lucide-react';

// Components
import ChatSidebar from '@/components/chatbot/ChatSidebar';
import ChatHeader from '@/components/chatbot/ChatHeader';
import ChatMessages from '@/components/chatbot/ChatMessages';
import ChatInput from '@/components/chatbot/ChatInput';

// Modals
import SaveAsViewModal from '@/components/chatbot/modals/SaveAsViewModal';
import AdjustSQLModal from '@/components/chatbot/modals/AdjustSQLModal';
import AdjustReasoningStepsModal from '@/components/chatbot/modals/AdjustReasoningStepsModal';
import QuestionSQLPairModal from '@/components/chatbot/modals/QuestionSQLPairModal';

// Hooks
import { useChatData } from '@/hooks/useChatData';
import useModalAction from '@/hooks/useModalAction';

// Types
import { Message, QuickAction, SampleQuestion, SessionStats, ThreadInfo } from '../../../types/chat';

// Sample data
const quickActions: QuickAction[] = [
  { label: "Trending Analysis", icon: TrendingUp, query: "Show me what's trending right now" },
  { label: "Revenue Insights", icon: BarChart3, query: "Analyze our revenue performance" },
  { label: "Competitor Check", icon: Target, query: "How are our competitors performing?" },
  { label: "Content Strategy", icon: Lightbulb, query: "Suggest content strategy improvements" },
];

const sampleQuestions: SampleQuestion[] = [
  { text: "What are the top trending hashtags this week?", category: "trends" },
  { text: "Show me revenue comparison by platform", category: "revenue" },
  { text: "Which products have the highest engagement rate?", category: "engagement" },
  { text: "What's the sentiment analysis for #SustainableFashion?", category: "sentiment" },
  { text: "Compare TikTok vs Instagram performance", category: "comparison" },
  { text: "Show me the forecast for next month's trends", category: "forecast" },
  { text: "What's the best time to post for maximum engagement?", category: "timing" },
  { text: "Which competitors are gaining market share?", category: "competitors" },
  { text: "Analyze the ROI of our recent campaigns", category: "roi" },
  { text: "What content types perform best in our niche?", category: "content" }
];

const sessionStats: SessionStats = {
  queriesToday: 47,
  avgResponseTime: '1.2s',
  accuracy: 94,
  sources: 5
};

export default function TrendChatbot() {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your AI Trend Analyst. I can help you discover insights, analyze performance, and forecast trends. Ask me anything about your data!",
      timestamp: new Date(),
      suggestions: [
        "What's trending today?",
        "Show revenue analytics",
        "Analyze competitor performance",
        "Suggest content ideas"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  // Hooks
  const chatData = useChatData();
  
  // Modal actions
  const saveAsViewModal = useModalAction();
  const adjustSQLModal = useModalAction();
  const adjustReasoningModal = useModalAction();
  const questionSQLPairModal = useModalAction();

  // Thread info
  const threadInfo: ThreadInfo | null = currentThreadId ? {
    id: currentThreadId,
    summary: `Thread ${currentThreadId}`,
    messageCount: messages.length - 1,
    status: 'active',
    lastActivity: new Date()
  } : null;

  // Handlers
  const handleSendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || inputValue;
    if (!text.trim()) return;

    const startTime = Date.now();
    const messageId = Date.now().toString();

    const userMessage: Message = {
      id: messageId,
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Create or get thread ID
    if (!currentThreadId) {
      const thread = await chatData.createThread({ summary: `Chat ${Date.now()}` });
      setCurrentThreadId(thread.id.toString());
    }

    // Simulate response generation
    setTimeout(async () => {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      try {
        const response = await chatData.createThreadResponse(
          parseInt(currentThreadId || '1'), 
          { question: text }
        );

        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.answerDetail?.content || 'Analysis completed',
          timestamp: new Date(),
          chart: response.chartDetail ? {
            type: 'line',
            data: response.chartDetail.chartSchema?.data || [],
            title: response.chartDetail.description || 'Chart'
          } : undefined,
          sql: response.sql ? {
            query: response.sql,
            status: 'completed',
            result: { rows: 15, executionTime: '0.8s' }
          } : undefined,
          reasoningSteps: response.askingTask?.sqlGenerationReasoning ? {
            steps: [
              "Analyzing the question structure and intent",
              "Identifying relevant data sources and tables",
              "Constructing SQL query based on requirements",
              "Validating query syntax and performance",
              "Executing query and processing results",
              "Generating insights and recommendations"
            ],
            currentStep: 0
          } : undefined,
          status: 'completed',
          threadId: currentThreadId || undefined,
          responseId: response.id.toString(),
          actions: {
            onSaveAsView: () => saveAsViewModal.openModal({ sql: response.sql || '', responseId: response.id }),
            onAdjustSQL: () => adjustSQLModal.openModal({ responseId: response.id, sql: response.sql || '' }),
            onAdjustReasoning: () => adjustReasoningModal.openModal({ 
              responseId: response.id, 
              retrievedTables: response.askingTask?.retrievedTables || [],
              sqlGenerationReasoning: response.askingTask?.sqlGenerationReasoning || ''
            }),
            onRegenerate: () => console.log('Regenerate response')
          }
        };

        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('Error creating response:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }, Math.random() * 1000 + 800);
  }, [inputValue, currentThreadId, chatData, saveAsViewModal, adjustSQLModal, adjustReasoningModal]);

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleNewChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your AI Trend Analyst. I can help you discover insights, analyze performance, and forecast trends. Ask me anything about your data!",
      timestamp: new Date(),
      suggestions: [
        "What's trending today?",
        "Show revenue analytics",
        "Analyze competitor performance",
        "Suggest content ideas"
      ]
    }]);
    setCurrentThreadId(null);
  };

  const handleHistory = () => {
    console.log('Open history');
  };

  const handleExport = () => {
    console.log('Export thread');
  };

  const handleClear = () => {
    handleNewChat();
  };

  // Modal handlers
  const handleSaveAsView = async (data: { name: string; sql: string; responseId: number }) => {
    await chatData.createView({ name: data.name, statement: data.sql });
  };

  const handleAdjustSQL = async (data: { responseId: number; sql: string }) => {
    await chatData.updateThreadResponse(data.responseId, { sql: data.sql });
  };

  const handleAdjustReasoning = async (data: { responseId: number; retrievedTables: string[]; sqlGenerationReasoning: string }) => {
    await chatData.adjustThreadResponse(data.responseId, {
      type: 'reasoning',
      data: { retrievedTables: data.retrievedTables, sqlGenerationReasoning: data.sqlGenerationReasoning }
    });
  };

  const handleQuestionSQLPair = async (data: { question: string; sql: string }) => {
    await chatData.createSqlPair({ question: data.question, sql: data.sql });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex relative">
      {/* Desktop Sidebar */}
      <ChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onSendMessage={handleSendMessage}
        quickActions={quickActions}
        sampleQuestions={sampleQuestions}
        sessionStats={sessionStats}
        threadInfo={threadInfo}
        onNewChat={handleNewChat}
        onHistory={handleHistory}
        onExport={handleExport}
        onClear={handleClear}
      />

      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="lg:hidden fixed left-4 top-20 z-50 h-10 w-10 rounded-full shadow-lg"
      >
        {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-background border-r z-50 overflow-y-auto"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Quick Actions */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => {
                          handleSendMessage(action.query);
                          setIsMobileSidebarOpen(false);
                        }}
                      >
                        <action.icon className="h-4 w-4 mr-3 text-primary" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile Sample Questions */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Sample Questions
                  </h3>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto">
                    {sampleQuestions.slice(0, 6).map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-2 whitespace-normal"
                        onClick={() => {
                          handleSendMessage(question.text);
                          setIsMobileSidebarOpen(false);
                        }}
                      >
                        <MessageCircle className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5 text-primary" />
                        <span className="text-xs">{question.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          responseTime={responseTime} 
          isOnline={true} 
        />
        
        <ChatMessages 
          messages={messages} 
          isTyping={isTyping} 
          onCopyMessage={handleCopyMessage} 
        />
        
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSendMessage()}
          disabled={isTyping}
        />
      </div>

      {/* Modals */}
      <SaveAsViewModal
        visible={saveAsViewModal.state.visible}
        onClose={saveAsViewModal.closeModal}
        onSubmit={handleSaveAsView}
        loading={chatData.isLoading}
        defaultValue={saveAsViewModal.state.defaultValue}
      />

      <AdjustSQLModal
        visible={adjustSQLModal.state.visible}
        onClose={adjustSQLModal.closeModal}
        onSubmit={handleAdjustSQL}
        loading={chatData.isLoading}
        defaultValue={adjustSQLModal.state.defaultValue}
      />

      <AdjustReasoningStepsModal
        visible={adjustReasoningModal.state.visible}
        onClose={adjustReasoningModal.closeModal}
        onSubmit={handleAdjustReasoning}
        loading={chatData.isLoading}
        defaultValue={adjustReasoningModal.state.defaultValue}
      />

      <QuestionSQLPairModal
        visible={questionSQLPairModal.state.visible}
        onClose={questionSQLPairModal.closeModal}
        onSubmit={handleQuestionSQLPair}
        loading={chatData.isLoading}
        defaultValue={questionSQLPairModal.state.defaultValue}
      />
    </div>
  );
}