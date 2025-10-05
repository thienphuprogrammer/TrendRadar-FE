"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  BarChart3, 
  Home,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const navigationItems = [
  {
    title: "Home",
    path: "/home",
    icon: <Home className="h-4 w-4" />,
    description: "AI Chat Interface"
  },
  {
    title: "Dashboard", 
    path: "/home/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Data Visualizations"
  },
  {
    title: "Overview",
    path: "/home/overview", 
    icon: <Sparkles className="h-4 w-4" />,
    description: "Feature Overview"
  }
];

export function HomeNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? "default" : "ghost"}
          size="sm"
          className="flex items-center gap-2"
          onClick={() => window.location.href = item.path}
        >
          {item.icon}
          <span>{item.title}</span>
          {pathname === item.path && (
            <Badge variant="secondary" className="ml-1">
              Active
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}
