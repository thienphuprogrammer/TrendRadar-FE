/**
 * React Query Configuration
 * Professional setup with proper defaults and error handling
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { CACHE_CONSTANTS } from '@/lib/config/constants';
import { logger } from '@/lib/utils/logger';
import { toast } from 'sonner';

/**
 * Default query options
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Retry configuration
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.statusCode >= 400 && error?.statusCode < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Stale and cache times
    staleTime: CACHE_CONSTANTS.DEFAULT_STALE_TIME,
    gcTime: CACHE_CONSTANTS.DEFAULT_CACHE_TIME, // formerly cacheTime in v4

    // Refetch configuration
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,

    // Error handling
    throwOnError: false,
  },
  mutations: {
    // Retry configuration for mutations
    retry: false,

    // Error handling
    onError: (error: any) => {
      logger.error('Mutation error:', error);
      
      // Show error toast
      const message = error?.message || 'An error occurred';
      toast.error(message);
    },

    // Success handling
    onSuccess: () => {
      logger.debug('Mutation successful');
    },
  },
};

/**
 * Create QueryClient instance
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
};

/**
 * Query key factory for consistent key generation
 */
export const queryKeys = {
  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },

  // Thread queries
  threads: {
    all: ['threads'] as const,
    lists: () => [...queryKeys.threads.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.threads.lists(), filters] as const,
    details: () => [...queryKeys.threads.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.threads.details(), id] as const,
    responses: (threadId: string) => [...queryKeys.threads.detail(threadId), 'responses'] as const,
  },

  // Chatbot queries
  chatbot: {
    all: ['chatbot'] as const,
    ask: () => [...queryKeys.chatbot.all, 'ask'] as const,
    recommended: () => [...queryKeys.chatbot.all, 'recommended'] as const,
  },

  // Analytics queries
  analytics: {
    all: ['analytics'] as const,
    trends: (filters: Record<string, any>) => [...queryKeys.analytics.all, 'trends', filters] as const,
    kpis: (filters: Record<string, any>) => [...queryKeys.analytics.all, 'kpis', filters] as const,
    reports: () => [...queryKeys.analytics.all, 'reports'] as const,
  },

  // Settings queries
  settings: {
    all: ['settings'] as const,
    app: () => [...queryKeys.settings.all, 'app'] as const,
    user: () => [...queryKeys.settings.all, 'user'] as const,
    integrations: () => [...queryKeys.settings.all, 'integrations'] as const,
  },

  // Notification queries
  notifications: {
    all: ['notifications'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.notifications.all, 'list', filters] as const,
  },

  // Health check
  health: {
    all: ['health'] as const,
    status: () => [...queryKeys.health.all, 'status'] as const,
  },
} as const;

/**
 * Helper to invalidate related queries
 */
export const invalidateQueries = {
  users: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  },
  threads: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
  },
  analytics: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
  },
  notifications: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  },
};

