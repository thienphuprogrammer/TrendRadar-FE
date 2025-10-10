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
  ChevronDown,
  Search,
  Home,
  User,
  Sparkles,
  Command,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Separator } from '@/components/ui/separator';

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

const getBreadcrumb = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/': 'Dashboard',
    '/trends': 'Trend Explorer',
    '/chatbot': 'Trend Chatbot',
    '/actions': 'Action Center',
    '/data-lab': 'Data Lab',
    '/content': 'Content Studio',
    '/reports': 'Reports & Export',
    '/notifications': 'Notification Hub',
    '/integrations': 'Integrations',
    '/users': 'Users & Roles',
    '/billing': 'Billing & Plans',
    '/settings': 'Settings',
  };
  return routes[pathname] || 'Home';
};

export function GlobalHeader() {
  const pathname = usePathname();
  const { user, permissions, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  const currentPage = getBreadcrumb(pathname);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredNavigation = navigation.map(section => ({
    ...section,
    items: section.items.filter(item =>
      hasPermission(effectivePermissions, item.permission)
    )
  })).filter(section => section.items.length > 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 mr-6 group">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-blue-600 shadow-lg shadow-primary/25"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-blue-600 bg-clip-text text-transparent">
              TrendRadar Hub
            </h1>
            <p className="text-xs text-muted-foreground">AI-Powered BI Platform</p>
          </div>
        </Link>

        {/* Home Dropdown Menu */}
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 font-medium hover:bg-accent/50 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isMenuOpen && "rotate-180"
              )} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[640px] p-0"
            align="start"
            sideOffset={8}
          >
            <div className="grid grid-cols-3 gap-1 p-4">
              {filteredNavigation.map((section) => (
                <div key={section.category} className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <section.icon className="h-4 w-4 text-primary/70" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.category}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                            'hover:bg-accent/50',
                            isActive && 'bg-primary/10 text-primary'
                          )}
                        >
                          <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              {item.badge && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs px-1.5 py-0 h-5",
                                    item.badge === 'AI' && "bg-primary/10 text-primary border-primary/20 animate-pulse",
                                    item.badge === 'New' && "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400"
                                  )}
                                >
                                  {item.badge === 'AI' && <Sparkles className="h-2.5 w-2.5 mr-0.5" />}
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>/</span>
          <span className="font-medium text-foreground">{currentPage}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search Bar */}
        <div className="hidden lg:block relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-accent/50 border-0 focus-visible:ring-1"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center"
            >
              3
            </motion.span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'Guest'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-semibold">
                    {user?.full_name?.charAt(0) || 'G'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name || 'Guest User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'guest@example.com'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {user?.role?.replace('_', ' ') || 'guest'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user && (
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-background/95 backdrop-blur"
          >
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Mobile Navigation */}
              {filteredNavigation.map((section) => (
                <div key={section.category} className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-1">
                    <section.icon className="h-4 w-4 text-primary/70" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.category}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent/50'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
