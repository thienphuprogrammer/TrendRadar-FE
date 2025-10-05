'use client';

import Link from 'next/link';
import { Header } from '@/components/layouts/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Database, MessagesSquare } from 'lucide-react';

export default function KnowledgeIndexPage() {
  return (
    <div className="min-h-screen">
      <Header title="Knowledge" subtitle="Tài liệu, câu hỏi và cặp Question-SQL" />
      <div className="container mx-auto px-6 py-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Hướng dẫn và quy ước cho hệ thống.</p>
            <Link href="/knowledge/instructions">
              <Button variant="outline" className="w-full">Mở instructions</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" /> Question-SQL Pairs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Tập cặp câu hỏi và SQL để huấn luyện/kiểm thử.</p>
            <Link href="/knowledge/question-sql-pairs">
              <Button variant="outline" className="w-full">Quản lý cặp Q-SQL</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="h-5 w-5" /> Chatbot Knowledge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Nguồn tri thức dùng cho Chatbot.</p>
            <Link href="/chatbot">
              <Button variant="outline" className="w-full">Đi tới Chatbot</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


