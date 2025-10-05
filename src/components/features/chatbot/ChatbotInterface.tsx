'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
  Database,
  Brain,
  FileText,
  Settings,
  History,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ChatbotService, ChatMessage, ChatRequest, ChatResponse } from '@/lib/services/chatbotService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ChartVisualization from './ChartVisualization';

interface ChatbotInterfaceProps {
  className?: string;
}

const quickActions = [
  { 
    label: "Trending Analysis", 
    icon: TrendingUp, 
    query: "Hiển thị dữ liệu bán hàng tháng trước",
    description: "Phân tích xu hướng và hiệu suất"
  },
  { 
    label: "Revenue Insights", 
    icon: BarChart3, 
    query: "Tạo biểu đồ doanh thu theo danh mục",
    description: "Hiểu rõ về doanh thu và lợi nhuận"
  },
  { 
    label: "Customer Analysis", 
    icon: Target, 
    query: "Phân tích xu hướng khách hàng",
    description: "Khám phá hành vi và sở thích khách hàng"
  },
  { 
    label: "Predictions", 
    icon: Brain, 
    query: "Dự đoán doanh số tháng tới",
    description: "Dự báo và kế hoạch tương lai"
  },
];

export default function ChatbotInterface({ className }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Xin chào! Tôi là AI Trend Analyst của bạn. Tôi có thể giúp bạn khám phá insights, phân tích hiệu suất và dự báo xu hướng. Hãy hỏi tôi bất cứ điều gì về dữ liệu của bạn!",
      timestamp: new Date(),
      suggestions: [
        "Hiển thị dữ liệu bán hàng tháng trước",
        "Tạo biểu đồ doanh thu theo danh mục",
        "Phân tích xu hướng khách hàng",
        "Dự đoán doanh số tháng tới"
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [responseTime, setResponseTime] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatbotService = ChatbotService.getInstance();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  // Initialize session and load suggestions
  useEffect(() => {
    const initializeChatbot = async () => {
      // Wait for auth to be ready
      if (authLoading) return;
      
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Cần đăng nhập",
          description: "Vui lòng đăng nhập để sử dụng chatbot",
          variant: "destructive",
        });
        return;
      }

      try {
        // Generate session ID
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);

        // Load suggestions
        const suggestionsResponse = await chatbotService.getSuggestions();
        setSuggestions(suggestionsResponse.suggestions);

        // Check health status
        const health = await chatbotService.getHealthStatus();
        setHealthStatus(health);
      } catch (error) {
        console.error('Error initializing chatbot:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('Authentication')) {
          toast({
            title: "Lỗi xác thực",
            description: "Vui lòng đăng nhập lại để sử dụng chatbot",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Lỗi khởi tạo",
            description: "Không thể kết nối với chatbot service",
            variant: "destructive",
          });
        }
      }
    };

    initializeChatbot();
  }, [user, authLoading]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue;
    if (!text.trim() || isLoading) return;

    const startTime = Date.now();
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text || '', // Ensure content is never undefined
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const request: ChatRequest = {
        message: text,
        session_id: sessionId,
        enable_evaluation: true,
        enable_chart_generation: true,
        enable_insights: true,
        language: 'vi'
      };

      const response: ChatResponse = await chatbotService.sendMessage(request);
      
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.message || 'Không có phản hồi từ server', // Ensure content is never undefined
        timestamp: new Date(),
        workflowId: response.workflow_id,
        intent: response.intent,
        executionTime: response.execution_time,
        success: response.success,
        chart: response.chart ? {
          type: response.chart.type as 'line' | 'bar' | 'pie',
          data: response.chart.data,
          title: response.chart.title
        } : undefined,
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, botResponse]);
      
      toast({
        title: "Phản hồi thành công",
        description: `Intent: ${response.intent} | Thời gian: ${(response.execution_time / 1000).toFixed(1)}s`,
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
        timestamp: new Date(),
        success: false,
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    textareaRef.current?.focus();
  };

  const handleQuickAction = (query: string) => {
    handleSendMessage(query);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào clipboard",
    });
  };

  const submitFeedback = async (workflowId: string, score: number) => {
    try {
      await chatbotService.submitFeedback(workflowId, score);
      toast({
        title: "Cảm ơn bạn",
        description: "Phản hồi của bạn đã được ghi nhận",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi phản hồi",
        variant: "destructive",
      });
    }
  };

  const renderMessageContent = (content: string, messageType: 'user' | 'bot') => {
    if (!content || !content.trim()) {
      return (
        <p className="text-muted-foreground italic">
          {messageType === 'bot' ? 'Đang xử lý...' : 'Tin nhắn trống'}
        </p>
      );
    }

    return content.split('\n').map((line, index) => (
      <p key={index} className={`${index === 0 ? 'mt-0' : ''} ${messageType === 'user' ? 'text-primary-foreground' : ''}`}>
        {line}
      </p>
    ));
  };

  const clearChat = async () => {
    if (sessionId) {
      try {
        await chatbotService.clearSession(sessionId);
        setMessages([
          {
            id: '1',
            type: 'bot',
            content: "👋 Cuộc trò chuyện đã được làm mới. Tôi sẵn sàng giúp bạn!",
            timestamp: new Date(),
          }
        ]);
        toast({
          title: "Đã xóa",
          description: "Lịch sử trò chuyện đã được xóa",
        });
      } catch (error) {
        console.error('Error clearing session:', error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa lịch sử trò chuyện",
          variant: "destructive",
        });
      }
    }
  };


  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Đang kiểm tra xác thực...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!user) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Cần đăng nhập</h3>
                <p className="text-muted-foreground">
                  Vui lòng đăng nhập để sử dụng AI Trend Analyst
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="flex flex-col shadow-lg h-[600px]">
            <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span>AI Trend Analyst</span>
                    <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${healthStatus?.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span>{healthStatus?.status === 'healthy' ? 'Online' : 'Offline'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>Avg: {responseTime > 0 ? `${(responseTime/1000).toFixed(1)}s` : '<2s'}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'bot' && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] ${message.type === 'user' ? 'order-1' : ''}`}>
                        <div
                          className={`rounded-2xl p-4 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted/50 border'
                          }`}
                        >
                          <div className="prose prose-sm max-w-none">
                            {renderMessageContent(message.content, message.type)}
                          </div>
                          
                          {message.chart && <ChartVisualization chart={message.chart} />}
                          
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => handleSendMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                          {message.workflowId && (
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {message.intent}
                              </Badge>
                              {message.executionTime && (
                                <span>{message.executionTime}ms</span>
                              )}
                            </div>
                          )}
                          {message.type === 'bot' && (
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyMessage(message.content)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                              {message.workflowId && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => submitFeedback(message.workflowId!, 10)}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => submitFeedback(message.workflowId!, 1)}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white animate-pulse" />
                        </div>
                      </div>
                      <div className="bg-muted/50 border rounded-2xl p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <div className="p-4 border-t bg-background">
                <div className="flex gap-3">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Hỏi tôi về xu hướng, doanh thu, tương tác hoặc bất cứ điều gì khác..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={() => handleSendMessage()} 
                    disabled={!inputValue.trim() || isLoading}
                    className="h-[60px] px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Hành động nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickAction(action.query)}
                  disabled={isLoading}
                >
                  <action.icon className="h-4 w-4 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Sample Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Câu hỏi mẫu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 whitespace-normal hover:bg-primary/5"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                >
                  <MessageCircle className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5 text-primary" />
                  {suggestion}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Thông tin phiên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Session ID</span>
                <span className="font-mono text-xs">{sessionId.slice(-8)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tin nhắn hôm nay</span>
                <span className="font-medium">{messages.length - 1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Thời gian phản hồi</span>
                <span className="font-medium text-green-600">
                  {responseTime > 0 ? `${(responseTime/1000).toFixed(1)}s` : '<2s'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trạng thái</span>
                <div className="flex items-center gap-1">
                  {healthStatus?.status === 'healthy' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs">{healthStatus?.status || 'Unknown'}</span>
                </div>
              </div>
              <Separator />
              <Button variant="outline" size="sm" className="w-full" onClick={clearChat}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa lịch sử
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
