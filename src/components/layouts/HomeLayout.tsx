"use client";

import React, { useState } from 'react';
import { HomeSidebar } from '@/components/layouts/HomeSidebar';
import { LoadingWrapper } from '@/components/common/feedback/PageLoading';
import { cn } from '@/lib/utils';

interface HomeLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
  sidebar?: React.ReactNode;
  className?: string;
}

export function HomeLayout({ children, loading = false, sidebar, className }: HomeLayoutProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();

  return (
    <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
      {/* Sidebar with smooth animation */}
      <div className="flex-shrink-0 transition-all duration-300 ease-in-out">
        {sidebar || (
          <HomeSidebar 
            selectedThreadId={selectedThreadId}
            onThreadSelect={setSelectedThreadId}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <LoadingWrapper loading={loading}>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </LoadingWrapper>
      </div>
    </div>
  );
}
