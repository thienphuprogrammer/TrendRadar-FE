'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Sparkles,
  Clock,
  Zap,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Lightbulb,
  Target,
  ArrowUpRight,
  History,
  FileText,
  Share2,
  Mic,
  Paperclip
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  chart?: {
    type: 'line' | 'bar' | 'pie';
    data: any;
    title: string;
  };
  deepDiveLink?: string;
  streaming?: boolean;
  suggestions?: string[];
}

const sampleQuestions = [
  "What are the top trending hashtags this week?",
  "Show me revenue comparison by platform",
  "Which products have the highest engagement rate?",
  "What's the sentiment analysis for #SustainableFashion?",
  "Compare TikTok vs Instagram performance",
  "Show me the forecast for next month's trends",
  "What's the best time to post for maximum engagement?",
  "Which competitors are gaining market share?",
  "Analyze the ROI of our recent campaigns",
  "What content types perform best in our niche?"
];

const quickActions = [
  { label: "Trending Analysis", icon: TrendingUp, query: "Show me what's trending right now" },
  { label: "Revenue Insights", icon: BarChart3, query: "Analyze our revenue performance" },
  { label: "Competitor Check", icon: Target, query: "How are our competitors performing?" },
  { label: "Content Strategy", icon: Lightbulb, query: "Suggest content strategy improvements" },
];

const mockChartData = {
  line: {
    title: "Revenue Trend (Last 7 Days)",
    data: [
      { day: 'Mon', revenue: 4200, searches: 1200 },
      { day: 'Tue', revenue: 3800, searches: 1100 },
      { day: 'Wed', revenue: 5200, searches: 1500 },
      { day: 'Thu', revenue: 4900, searches: 1400 },
      { day: 'Fri', revenue: 6100, searches: 1800 },
      { day: 'Sat', revenue: 5800, searches: 1600 },
      { day: 'Sun', revenue: 4600, searches: 1300 }
    ]
  }
};

export default function TrendChatbot() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const question = urlParams.get('q');
    if (question) {
      setInputValue(question);
    }
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue;
    if (!text.trim()) return;

    const startTime = Date.now();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(text),
        timestamp: new Date(),
        chart: shouldIncludeChart(text) ? {
          type: 'line',
          data: mockChartData.line.data,
          title: mockChartData.line.title
        } : undefined,
        deepDiveLink: shouldIncludeChart(text) ? '/trends' : undefined,
        suggestions: generateSuggestions(text),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, Math.random() * 1000 + 800);
  };

  const generateBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('trending') || lowerQuestion.includes('hashtag')) {
      return "📈 **Current Trending Analysis:**\n\n#SustainableFashion is leading with **+245% growth** this week, driven by increased eco-consciousness. #TechGadgets2024 follows at **+189%** with strong TikTok engagement.\n\n**Key Insights:**\n• Peak engagement: 2-4 PM daily\n• Best platforms: TikTok, Instagram\n• Audience: 18-34 demographics\n\n*The chart below shows detailed performance metrics.*";
    }

    if (lowerQuestion.includes('revenue') || lowerQuestion.includes('sales')) {
      return "💰 **Revenue Performance Summary:**\n\nYour revenue shows **+12.5% growth** this week with Friday being the peak day at **$6,100**. The correlation with search volume indicates strong organic demand.\n\n**Highlights:**\n• Total weekly revenue: $34,600\n• Best performing day: Friday\n• Growth trend: Accelerating\n• Conversion rate: 3.2% (↑0.4%)";
    }

    if (lowerQuestion.includes('engagement') || lowerQuestion.includes('performance')) {
      return "🎯 **Engagement Analysis:**\n\nSustainable fashion content leads with **8.4% average engagement**, significantly above industry standard (5.2%). Video content performs **3x better** than static posts.\n\n**Top Performers:**\n• #SustainableFashion: 8.4% engagement\n• #TechGadgets: 6.2% engagement\n• #Fitness: 7.1% engagement\n\n**Recommendation:** Focus on video content during 2-4 PM peak hours.";
    }

    if (lowerQuestion.includes('sentiment')) {
      return "😊 **Sentiment Analysis Results:**\n\n**Overall Sentiment Score: 8.4/10**\n\n• **Positive:** 75% (↑5% from last week)\n• **Neutral:** 20% (stable)\n• **Negative:** 5% (↓2% improvement)\n\n#SustainableFashion shows exceptional **89% positive sentiment**, indicating strong brand alignment with values-driven consumers.";
    }

    if (lowerQuestion.includes('competitor')) {
      return "🏆 **Competitive Landscape:**\n\nYour market position is strong with **15% market share** in the sustainable fashion segment. BrandA leads at 23% but shows slowing growth.\n\n**Key Findings:**\n• Your engagement rate (7.3%) exceeds BrandA (6.8%)\n• Pricing advantage: 15% below market average\n• Growth rate: +15% vs industry +8%\n\n**Opportunity:** Capitalize on sustainability trend momentum.";
    }

    return "🤖 **Analysis Complete:**\n\nI've processed your query and found relevant insights across your data sources. The metrics show positive trends with opportunities for optimization.\n\n**Quick Summary:**\n• Data sources: 5 platforms analyzed\n• Time range: Last 7 days\n• Confidence level: 94%\n\nWould you like me to dive deeper into any specific area?";
  };

  const shouldIncludeChart = (question: string): boolean => {
    const chartKeywords = ['revenue', 'trend', 'performance', 'comparison', 'show me', 'analyze', 'chart'];
    return chartKeywords.some(keyword => question.toLowerCase().includes(keyword));
  };

  const generateSuggestions = (question: string): string[] => {
    const suggestions = [
      "Show me detailed breakdown",
      "Compare with last month",
      "What's driving this trend?",
      "Suggest optimization strategies"
    ];
    return suggestions.slice(0, 2);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const MiniChart = ({ chart }: { chart: Message['chart'] }) => {
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
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
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
                <h2 className="text-2xl font-bold flex items-center gap-2">
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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Online</span>
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

        <Card className="flex-1 flex flex-col shadow-2xl border-none bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl overflow-hidden">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
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

                          {message.chart && <MiniChart chart={message.chart} />}

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
                                  onClick={() => handleSendMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>

                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                          {message.type === 'bot' && (
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-primary" onClick={() => copyMessage(message.content)}>
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

            <div className="p-6 border-t bg-gradient-to-br from-background/50 to-muted/20 backdrop-blur-sm">
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl hover:bg-primary/10">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Ask me about trends, revenue, engagement, or anything else..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 h-12 rounded-xl border-muted-foreground/20 bg-background/50 backdrop-blur-sm focus-visible:ring-primary"
                />
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl hover:bg-primary/10">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Sidebar */}
      <div className="w-80 space-y-4">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl border-none bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-3 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                      onClick={() => handleSendMessage(action.query)}
                    >
                      <action.icon className="h-4 w-4 mr-3 text-primary" />
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{action.label}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sample Questions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-none bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Sample Questions
              </h3>
              <ScrollArea className="h-64">
                <div className="space-y-2 pr-4">
                  {sampleQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-3 whitespace-normal hover:bg-primary/5 transition-colors"
                        onClick={() => handleSendMessage(question)}
                      >
                        <MessageCircle className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5 text-primary" />
                        <span className="text-xs">{question}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-xl border-none bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Session Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Queries Today</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Avg Response</span>
                  <span className="font-semibold text-green-600">1.2s</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Accuracy Score</span>
                  <span className="font-semibold">94%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Data Sources</span>
                  <span className="font-semibold">5 platforms</span>
                </div>
                <div className="pt-2 space-y-2">
                  <Button variant="outline" size="sm" className="w-full hover:bg-primary/10">
                    <History className="h-4 w-4 mr-2" />
                    Chat History
                  </Button>
                  <Button variant="outline" size="sm" className="w-full hover:bg-primary/10">
                    <Share2 className="h-4 w-4 mr-2" />
                    Export Chat
                  </Button>
                  <Button variant="outline" size="sm" className="w-full hover:bg-destructive/10 hover:text-destructive">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
