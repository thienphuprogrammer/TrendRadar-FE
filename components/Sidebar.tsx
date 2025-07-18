'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Zap,
  FileText,
  Bell,
  Settings,
  Users,
  CreditCard,
  Plug,
  Video,
  Layout,
  User,
  LogOut,
  Bot,
  Database,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/ThemeToggle';

const navigation = [
  // Core Analysis
  { 
    category: '🧭 Core Analysis',
    items: [
      { name: 'Dashboard', href: '/', icon: Layout, permission: 'canViewDashboard' },
      { name: 'Trend Explorer', href: '/trends', icon: TrendingUp, permission: 'canViewAnalytics' },
      { name: 'Trend Chatbot', href: '/chatbot', icon: Bot, permission: 'canViewAnalytics', badge: 'Beta' },
      { name: 'Action Center', href: '/actions', icon: Zap, permission: 'canViewAnalytics' },
    ]
  },
  // Data & Content
  {
    category: '📊 Data & Content',
    items: [
      { name: 'Data Lab', href: '/data-lab', icon: Database, permission: 'canViewAnalytics', badge: 'New' },
      { name: 'Content Studio', href: '/content', icon: Video, permission: 'canSchedulePosts' },
      { name: 'Reports & Export', href: '/reports', icon: FileText, permission: 'canEditReports' },
      { name: 'Notification Hub', href: '/notifications', icon: Bell, permission: 'canViewDashboard' },
    ]
  },
  // System Tools
  {
    category: '⚙️ System Tools',
    items: [
      { name: 'Integrations', href: '/integrations', icon: Plug, permission: 'canManageIntegrations' },
      { name: 'Users & Roles', href: '/users', icon: Users, permission: 'canManageUsers' },
      { name: 'Billing & Plans', href: '/billing', icon: CreditCard, permission: 'canManageBilling' },
      { name: 'Settings', href: '/settings', icon: Settings, permission: 'canViewDashboard' },
    ]
  }
];

function hasPermission(permissions: any, permissionKey: string): boolean {
  return permissions[permissionKey as keyof typeof permissions] === true;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, permissions, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 },
  };

  return (
    <motion.div 
      className="flex h-screen flex-col border-r bg-card/50 backdrop-blur-sm"
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex h-16 items-center gap-4 px-4 border-b">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-foreground/10">
          <BarChart3 className="h-5 w-5 text-primary-foreground" />
        </div>
        <motion.span 
          className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          variants={contentVariants}
        >
          TrendRadar Hub
        </motion.span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-4 p-4 overflow-y-auto">
        {navigation.map((section) => {
          const visibleItems = section.items.filter(item => 
            hasPermission(permissions, item.permission)
          );
          
          if (visibleItems.length === 0) return null;
          
          return (
            <div key={section.category} className="space-y-2">
              <motion.h3 
                className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                variants={contentVariants}
              >
                {section.category}
              </motion.h3>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300',
                        isActive
                          ? 'bg-gradient-to-r from-primary/80 to-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isActive && "rotate-6 scale-110"
                      )} />
                      <motion.span 
                        className="flex-1"
                        variants={contentVariants}
                      >
                        {item.name}
                      </motion.span>
                      {item.badge && (
                        <motion.div variants={contentVariants}>
                          <Badge 
                            variant={isActive ? "secondary" : "outline"} 
                            className={cn(
                              "text-xs px-1.5 py-0.5 transition-colors",
                              isActive && "bg-primary-foreground/20 text-primary-foreground"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}
                      <ChevronRight className={cn(
                        "h-4 w-4 text-muted-foreground/50 transition-transform duration-300",
                        isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                        "group-hover:opacity-100 group-hover:translate-x-0"
                      )} />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="border-t p-4 space-y-4">
        <motion.div 
          className="flex items-center gap-3"
          variants={contentVariants}
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <motion.div 
            className="flex-1 min-w-0"
            variants={contentVariants}
          >
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
          </motion.div>
          <ThemeToggle />
        </motion.div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-primary hover:bg-primary/5"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <motion.span variants={contentVariants}>Sign out</motion.span>
        </Button>
      </div>
    </motion.div>
  );
}