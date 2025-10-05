'use client';

import React from 'react';
import { Header } from '@/components/layouts/Header';
import ChatbotDashboard from '@/components/features/chatbot/ChatbotDashboard';

export default function TrendChatbot() {
  return (
    <div className="space-y-6">
      <Header 
        title="AI Trend Analyst" 
        subtitle="Phân tích dữ liệu thông minh với AI - Hỏi bất cứ điều gì về xu hướng và hiệu suất"
      />
      
      <ChatbotDashboard />
    </div>
  );
}