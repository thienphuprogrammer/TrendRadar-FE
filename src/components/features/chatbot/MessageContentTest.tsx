'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Test component to verify message content rendering
export default function MessageContentTest() {
  const testMessages = [
    { content: 'Normal message', type: 'user' as const },
    { content: 'Message with\nmultiple lines', type: 'bot' as const },
    { content: '', type: 'user' as const },
    { content: undefined as any, type: 'bot' as const },
    { content: null as any, type: 'user' as const },
    { content: '   ', type: 'bot' as const }, // Only whitespace
  ];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Content Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {testMessages.map((message, index) => (
          <div key={index} className="p-3 border rounded">
            <div className="text-sm text-muted-foreground mb-2">
              Test {index + 1}: {message.type} - Content: "{message.content}"
            </div>
            <div className="prose prose-sm max-w-none">
              {renderMessageContent(message.content, message.type)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
