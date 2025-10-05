'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  History, 
  Search, 
  Calendar, 
  MessageCircle, 
  Clock,
  Trash2,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal
} from 'lucide-react';
import { ChatbotService, ChatMessage } from '@/lib/services/chatbotService';
import { useToast } from '@/hooks/use-toast';

interface Session {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  intent?: string;
}

interface SessionManagerProps {
  currentSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
  onSessionDelete?: (sessionId: string) => void;
  className?: string;
}

export default function SessionManager({ 
  currentSessionId, 
  onSessionSelect, 
  onSessionDelete,
  className 
}: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'messages'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatbotService = ChatbotService.getInstance();
  const { toast } = useToast();

  // Mock sessions for demonstration
  useEffect(() => {
    const mockSessions: Session[] = [
      {
        id: 'session_1',
        title: 'Phân tích doanh thu Q4',
        lastMessage: 'Hiển thị dữ liệu bán hàng tháng trước',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        messageCount: 8,
        intent: 'revenue_analysis'
      },
      {
        id: 'session_2',
        title: 'Xu hướng khách hàng',
        lastMessage: 'Phân tích hành vi mua hàng của khách hàng',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        messageCount: 12,
        intent: 'customer_analysis'
      },
      {
        id: 'session_3',
        title: 'Dự báo thị trường',
        lastMessage: 'Dự đoán doanh số tháng tới',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        messageCount: 6,
        intent: 'forecasting'
      },
      {
        id: 'session_4',
        title: 'So sánh đối thủ',
        lastMessage: 'So sánh hiệu suất theo khu vực',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        messageCount: 15,
        intent: 'competitive_analysis'
      }
    ];
    
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions
    .filter(session => 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = a.timestamp.getTime() - b.timestamp.getTime();
      } else if (sortBy === 'messages') {
        comparison = a.messageCount - b.messageCount;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSessionSelect = (sessionId: string) => {
    onSessionSelect?.(sessionId);
    toast({
      title: "Đã chọn phiên",
      description: "Đã chuyển sang phiên trò chuyện được chọn",
    });
  };

  const handleSessionDelete = async (sessionId: string) => {
    try {
      await chatbotService.clearSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      onSessionDelete?.(sessionId);
      toast({
        title: "Đã xóa phiên",
        description: "Phiên trò chuyện đã được xóa thành công",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa phiên trò chuyện",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Đã làm mới",
        description: "Danh sách phiên đã được cập nhật",
      });
    }, 1000);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'revenue_analysis': return 'bg-green-100 text-green-800';
      case 'customer_analysis': return 'bg-blue-100 text-blue-800';
      case 'forecasting': return 'bg-purple-100 text-purple-800';
      case 'competitive_analysis': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntentLabel = (intent?: string) => {
    switch (intent) {
      case 'revenue_analysis': return 'Phân tích doanh thu';
      case 'customer_analysis': return 'Phân tích khách hàng';
      case 'forecasting': return 'Dự báo';
      case 'competitive_analysis': return 'Phân tích cạnh tranh';
      default: return 'Chung';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử phiên
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm phiên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
              className="flex-1"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Ngày
            </Button>
            <Button
              variant={sortBy === 'messages' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('messages')}
              className="flex-1"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Tin nhắn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-3 w-3" />
              ) : (
                <SortDesc className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Sessions List */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Không tìm thấy phiên nào</p>
                {searchTerm && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => setSearchTerm('')}
                    className="mt-2"
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    currentSessionId === session.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSessionSelect(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {session.title}
                        </h4>
                        {session.intent && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getIntentColor(session.intent)}`}
                          >
                            {getIntentLabel(session.intent)}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {session.lastMessage}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(session.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {session.messageCount} tin nhắn
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSessionDelete(session.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Tổng cộng: {sessions.length} phiên</span>
            <span>Hiển thị: {filteredSessions.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
