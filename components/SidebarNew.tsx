'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  LogOut,
  Bot,
  Database,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission: string;
  badge?: string;
  description?: string;
}

interface NavSection {
  category: string;
  icon: React.ElementType;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    category: 'Core Analysis',
    icon: BarChart3,
    items: [
      {
        name: 'Dashboard',
        href: '/',
        icon: Layout,
        permission: 'canViewDashboard',
        description: 'Overview & KPIs'
      },
      {
        name: 'Trend Explorer',
        href: '/trends',
        icon: TrendingUp,
        permission: 'canViewAnalytics',
        description: 'Market trends & insights'
      },
      {
        name: 'Trend Chatbot',
        href: '/chatbot',
        icon: Bot,
        permission: 'canViewAnalytics',
        badge: 'AI',
        description: 'AI-powered analysis'
      },
      {
        name: 'Action Center',
        href: '/actions',
        icon: Zap,
        permission: 'canApplyActions',
        description: 'Smart recommendations'
      },
    ]
  },
  {
    category: 'Data & Tools',
    icon: Database,
    items: [
      {
        name: 'Data Lab',
        href: '/data-lab',
        icon: Database,
        permission: 'canViewDataLab',
        badge: 'New',
        description: 'Self-service BI'
      },
      {
        name: 'Content Studio',
        href: '/content',
        icon: Video,
        permission: 'canSchedulePosts',
        description: 'Content creation'
      },
      {
        name: 'Reports & Export',
        href: '/reports',
        icon: FileText,
        permission: 'canEditReports',
        description: 'Generate reports'
      },
      {
        name: 'Notification Hub',
        href: '/notifications',
        icon: Bell,
        permission: 'canViewNotifications',
        description: 'Alerts & updates'
      },
    ]
  },
  {
    category: 'System & Admin',
    icon: Settings,
    items: [
      {
        name: 'Integrations',
        href: '/integrations',
        icon: Plug,
        permission: 'canManageIntegrations',
        description: 'Connect platforms'
      },
      {
        name: 'Users & Roles',
        href: '/users',
        icon: Users,
        permission: 'canManageUsers',
        description: 'Team management'
      },
      {
        name: 'Billing & Plans',
        href: '/billing',
        icon: CreditCard,
        permission: 'canManageBilling',
        description: 'Subscription & usage'
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        permission: 'canViewDashboard',
        description: 'Preferences'
      },
    ]
  }
];

function hasPermission(permissions: any, permissionKey: string): boolean {
  if (!permissions) return false;
  return permissions[permissionKey as keyof typeof permissions] === true;
}

export function SidebarNew() {
  const pathname = usePathname();
  const { user, permissions, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Default permissions when not authenticated - show all for demo
  const defaultPermissions = {
    canViewDashboard: true,
    canViewAnalytics: true,
    canViewTrends: true,
    canViewDataLab: true,
    canViewNotifications: true,
    canApplyActions: true,
    canSchedulePosts: true,
    canEditReports: true,
    canManageIntegrations: true,
    canManageUsers: true,
    canManageBilling: true,
  };

  const effectivePermissions = user ? permissions : defaultPermissions;

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 },
  };

  const mobileVariants = {
    open: { x: 0 },
    closed: { x: -300 },
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <TooltipProvider delayDuration={0}>
        <motion.div
          className={cn(
            "flex h-screen flex-col border-r relative z-50",
            "bg-gradient-to-br from-background/95 via-background/90 to-background/95",
            "backdrop-blur-xl",
            "shadow-2xl shadow-primary/5",
            "fixed lg:sticky top-0 left-0",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
          initial="expanded"
          animate={isCollapsed ? "collapsed" : "expanded"}
          variants={sidebarVariants}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />

          {/* Header */}
          <div className="flex h-16 items-center gap-3 px-4 border-b border-border/50 relative">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-blue-600 shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </motion.div>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-blue-600 bg-clip-text text-transparent">
                    TrendRadar Hub
                  </h1>
                  <p className="text-xs text-muted-foreground">AI-Powered BI</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 hover:bg-primary/10"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
            {navigation.map((section, sectionIdx) => {
              const visibleItems = section.items.filter(item =>
                hasPermission(effectivePermissions, item.permission)
              );

              if (visibleItems.length === 0) return null;

              return (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIdx * 0.1 }}
                >
                  {/* Section Header */}
                  <div className="mb-3 px-3">
                    <AnimatePresence mode="wait">
                      {!isCollapsed ? (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          <section.icon className="h-3.5 w-3.5 text-primary/70" />
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {section.category}
                          </h3>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-px bg-border/50 mx-auto w-8"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Section Items */}
                  <div className="space-y-1">
                    {visibleItems.map((item, itemIdx) => {
                      const isActive = pathname === item.href;

                      const linkContent = (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                            'hover:scale-[1.02] active:scale-[0.98]',
                            isActive
                              ? 'bg-gradient-to-r from-primary/90 to-blue-600 text-primary-foreground shadow-lg shadow-primary/25'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                          )}
                        >
                          {/* Active indicator line */}
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}

                          {/* Icon with animation */}
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 transition-all duration-300",
                                isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                              )}
                            />
                          </motion.div>

                          <AnimatePresence mode="wait">
                            {!isCollapsed && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex-1 flex items-center justify-between min-w-0"
                              >
                                <span className="truncate">{item.name}</span>

                                {item.badge && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                  >
                                    <Badge
                                      variant={isActive ? "secondary" : "outline"}
                                      className={cn(
                                        "text-xs px-1.5 py-0.5 font-semibold",
                                        isActive
                                          ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                                          : "bg-primary/10 text-primary border-primary/20",
                                        item.badge === 'AI' && "animate-pulse"
                                      )}
                                    >
                                      {item.badge === 'AI' && <Sparkles className="h-2.5 w-2.5 mr-0.5" />}
                                      {item.badge}
                                    </Badge>
                                  </motion.div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Hover chevron */}
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-all duration-300",
                              isActive
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                            )}
                          />
                        </Link>
                      );

                      if (isCollapsed) {
                        return (
                          <Tooltip key={item.name}>
                            <TooltipTrigger asChild>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex flex-col gap-1">
                              <span className="font-semibold">{item.name}</span>
                              {item.description && (
                                <span className="text-xs text-muted-foreground">{item.description}</span>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return <div key={item.name}>{linkContent}</div>;
                    })}
                  </div>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border/50 p-4 space-y-3 relative">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: isCollapsed ? 1.05 : 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Avatar className="h-9 w-9 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'Guest'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-semibold">
                  {user?.full_name?.charAt(0) || 'G'}
                </AvatarFallback>
              </Avatar>

              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-semibold truncate">{user?.full_name || 'Guest User'}</p>
                    <p className="text-xs text-muted-foreground capitalize truncate">
                      {user?.role?.replace('_', ' ') || 'guest'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isCollapsed && <ThemeToggle />}
            </motion.div>

            {user && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  isCollapsed ? "w-full p-2" : "w-full justify-start gap-3"
                )}
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      Sign out
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            )}
          </div>
        </motion.div>
      </TooltipProvider>
    </>
  );
}
