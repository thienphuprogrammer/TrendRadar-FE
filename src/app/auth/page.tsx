'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, LogIn, UserPlus, Lock } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to TrendRadar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            AI-powered trend analysis and content management platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Đăng nhập</CardTitle>
              <CardDescription>
                Truy cập tài khoản hiện tại của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/auth/login">
                <Button className="w-full">
                  Đăng nhập
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Đăng ký</CardTitle>
              <CardDescription>
                Tạo tài khoản mới để bắt đầu
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/auth/register">
                <Button className="w-full">
                  Đăng ký
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Quên mật khẩu</CardTitle>
              <CardDescription>
                Đặt lại mật khẩu của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/auth/forgot-password">
                <Button variant="outline" className="w-full">
                  Đặt lại mật khẩu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300">
            Cần hỗ trợ? Liên hệ với chúng tôi tại{' '}
            <a href="mailto:support@trendradar.com" className="text-blue-600 hover:text-blue-500">
              support@trendradar.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
