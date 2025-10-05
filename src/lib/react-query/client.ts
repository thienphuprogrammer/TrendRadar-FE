import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 * Optimized for development and production environments
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,

      // Cache time - how long inactive queries stay in cache (10 minutes)
      cacheTime: 10 * 60 * 1000,

      // Retry failed requests up to 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus in development only
      refetchOnWindowFocus: process.env.NODE_ENV === 'development',

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Background refetch interval for real-time data (30 seconds)
      refetchInterval: 30 * 1000,

      // Background refetch only when window is visible
      refetchIntervalInBackground: false,
    },

    mutations: {
      // Retry failed mutations once
      retry: 1,

      // Don't retry on client errors
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

/**
 * Query keys factory for consistent key management
 */
export const queryKeys = {
  // Thread related queries
  threads: {
    all: ['threads'] as const,
    lists: () => [...queryKeys.threads.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.threads.lists(), filters] as const,
    details: () => [...queryKeys.threads.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.threads.details(), id] as const,
  },

  // User related queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Analytics related queries
  analytics: {
    all: ['analytics'] as const,
    trends: () => [...queryKeys.analytics.all, 'trends'] as const,
    kpis: () => [...queryKeys.analytics.all, 'kpis'] as const,
    reports: () => [...queryKeys.analytics.all, 'reports'] as const,
  },

  // Chatbot related queries
  chatbot: {
    all: ['chatbot'] as const,
    conversations: () => [...queryKeys.chatbot.all, 'conversations'] as const,
    conversation: (id: string) => [...queryKeys.chatbot.conversations(), id] as const,
    askingTasks: () => [...queryKeys.chatbot.all, 'asking-tasks'] as const,
    askingTask: (id: string) => [...queryKeys.chatbot.askingTasks(), id] as const,
  },
} as const;

/**
 * Query client utilities
 */
export const queryClientUtils = {
  /**
   * Invalidate queries by key pattern
   */
  invalidateQueries: (queryKey: readonly unknown[]) => {
    return queryClient.invalidateQueries({ queryKey });
  },

  /**
   * Remove queries by key pattern
   */
  removeQueries: (queryKey: readonly unknown[]) => {
    return queryClient.removeQueries({ queryKey });
  },

  /**
   * Prefetch query
   */
  prefetchQuery: (options: any) => {
    return queryClient.prefetchQuery(options);
  },

  /**
   * Get query data from cache
   */
  getQueryData: <T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData(queryKey);
  },

  /**
   * Set query data in cache
   */
  setQueryData: <T>(queryKey: readonly unknown[], data: T) => {
    return queryClient.setQueryData(queryKey, data);
  },
};
