'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Đăng ký thành công!</CardTitle>
          <CardDescription>
            Tài khoản của bạn đã được tạo thành công. Bạn có thể bắt đầu sử dụng TrendRadar ngay bây giờ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Kiểm tra email của bạn
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                  Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn. 
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để kích hoạt tài khoản.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link href="/" className="w-full">
              <Button className="w-full">
                Bắt đầu sử dụng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
