/**
 * ChatbotDashboard Component
 * Main chatbot dashboard interface
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function ChatbotDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>AI Chatbot Dashboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Chatbot dashboard component will be implemented here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

