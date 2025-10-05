"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogoBar } from '@/components/common/display/LogoBar';

const Path = {
  Home: '/',
  Trends: '/trends',
  DataLab: '/data-lab',
  DataModeling: '/data-modeling',
  DataSetup: '/data-setup',
  Reports: '/reports',
  Settings: '/settings',
  Users: '/users',
  Billing: '/billing',
  Integrations: '/integrations',
  Notifications: '/notifications',
  Content: '/content',
  Chatbot: '/chatbot',
  WrenAI: '/wren-ai',
  WrenAIChat: '/wren-ai-chat',
  WrenAIDemo: '/wren-ai-demo',
};

export function HeaderBar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const showNav = !pathname.startsWith('/auth');
  const isDataModeling = pathname.startsWith(Path.DataModeling);

  const navigationItems = [
    { path: Path.Home, label: 'Home' },
    { path: Path.Trends, label: 'Trends' },
    { path: Path.DataLab, label: 'Data Lab' },
    { path: Path.DataModeling, label: 'Data Modeling' },
    { path: Path.Reports, label: 'Reports' },
    { path: Path.Settings, label: 'Settings' },
  ];

  return (
    <header className="h-12 border-b border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 px-4">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center space-x-12">
          <LogoBar />
          {showNav && (
            <nav className="flex items-center space-x-4">
              {navigationItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-gray-900 dark:text-white font-semibold' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    onClick={() => router.push(item.path)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          )}
        </div>
        {isDataModeling && (
          <div className="flex items-center space-x-4">
            {/* Deploy button or other actions can go here */}
          </div>
        )}
      </div>
    </header>
  );
}
