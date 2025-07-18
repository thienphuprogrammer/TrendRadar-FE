'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Copy, ThumbsUp, ThumbsDown, Clock, BarChart3, ExternalLink } from 'lucide-react';
import { ChatMessage, ChatbotService } from '@/lib/services/chatbotService';

interface ChatInterfaceProps {
  initialMessage?: string;
}

export function ChatInterface({ initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
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
  const [inputValue, setInputValue] = useState(initialMessage || '');
  const [isTyping, setIsTyping] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotService = ChatbotService.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue;
    if (!text.trim()) return;

    const startTime = Date.now();
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await chatbotService.sendMessage(text);
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const MiniChart = ({ chart }: { chart: ChatMessage['chart'] }) => {
    if (!chart) return null;

    return (
      <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-blue-50 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            {chart.title}
          </h4>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            Full View
          </Button>
        </div>
        <div className="h-32 flex items-end gap-1 mb-2">
          {chart.data.map((item: any, index: number) => (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div 
                className="w-full bg-gradient-to-t from-primary to-blue-500 rounded-t hover:from-primary/80 hover:to-blue-500/80 transition-colors cursor-pointer"
                style={{ 
                  height: `${(item.revenue || item.posts || item.engagement * 10) / Math.max(...chart.data.map((d: any) => d.revenue || d.posts || d.engagement * 10)) * 100}%`,
                  minHeight: '8px'
                }}
              />
              <span className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">
                {item.day || item.hashtag?.slice(0, 4) || index + 1}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Interactive chart • Click for details</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Live data
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="soft-card gradient-bg-dark flex flex-col h-[600px] max-h-[80vh] min-h-[500px] shadow-soft-lg">
      <div className="flex-shrink-0 border-b bg-gradient-brand p-4 rounded-t-3xl flex items-center justify-between animate-slide-in-up">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-soft">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-semibold text-lg text-primary-foreground">AI Trend Analyst</span>
            <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Avg: {responseTime > 0 ? `${(responseTime/1000).toFixed(1)}s` : '<2s'}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-0 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="space-y-6">
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-up`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {message.type === 'bot' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-3xl p-4 shadow-soft transition-all duration-soft ease-soft ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-surface/80 border border-border'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, index) => (
                        <p key={index} className={`${index === 0 ? 'mt-0' : ''} ${message.type === 'user' ? 'text-primary-foreground' : ''}`}>
                          {line}
                        </p>
                      ))}
                    </div>
                    {message.chart && <MiniChart chart={message.chart} />}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs transition-colors duration-soft ease-soft hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" size="icon" className="hover:bg-muted/30" onClick={() => copyMessage(message.content)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    {message.type === 'bot' && (
                      <>
                        <Button variant="ghost" size="icon" className="hover:bg-success/20">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-error/20">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 border-t bg-background rounded-b-3xl flex items-center gap-3">
          <Input
            className="flex-1 rounded-2xl bg-surface/80 border border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-soft ease-soft"
            placeholder="Type your message..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            disabled={isTyping}
          />
          <Button
            variant="default"
            size="icon"
            className="rounded-full shadow-soft-lg transition-all duration-soft ease-soft"
            onClick={() => handleSendMessage()}
            disabled={isTyping || !inputValue.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}