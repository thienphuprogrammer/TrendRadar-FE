/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for type-safe API calls
 */

export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    me: '/auth/me',
  },

  // User endpoints
  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
  },

  // Thread/Conversation endpoints
  threads: {
    list: '/threads',
    create: '/threads',
    get: (id: string) => `/threads/${id}`,
    update: (id: string) => `/threads/${id}`,
    delete: (id: string) => `/threads/${id}`,
    responses: (id: string) => `/threads/${id}/responses`,
    summary: (id: string) => `/threads/${id}/summary`,
  },

  // Chatbot endpoints
  chatbot: {
    ask: '/chatbot/ask',
    adjust: '/chatbot/adjust',
    recommended: '/chatbot/recommended',
    cancel: '/chatbot/cancel',
    rerun: '/chatbot/rerun',
    suggestions: '/chatbot/suggestions',
    history: '/chatbot/history',
  },

  // Analytics endpoints
  analytics: {
    trends: '/analytics/trends',
    trendDetails: (id: string) => `/analytics/trends/${id}`,
    kpis: '/analytics/kpis',
    reports: '/analytics/reports',
    export: '/analytics/export',
    dashboard: '/analytics/dashboard',
    sentiment: '/analytics/sentiment',
    geographic: '/analytics/geographic',
  },

  // Reports endpoints
  reports: {
    list: '/reports',
    create: '/reports',
    get: (id: string) => `/reports/${id}`,
    update: (id: string) => `/reports/${id}`,
    delete: (id: string) => `/reports/${id}`,
    export: (id: string) => `/reports/${id}/export`,
    schedule: '/reports/schedule',
    templates: '/reports/templates',
  },

  // Settings endpoints
  settings: {
    app: '/settings/app',
    user: '/settings/user',
    integrations: '/settings/integrations',
    notifications: '/settings/notifications',
    billing: '/settings/billing',
  },

  // Integrations endpoints
  integrations: {
    list: '/integrations',
    get: (id: string) => `/integrations/${id}`,
    connect: '/integrations/connect',
    disconnect: (id: string) => `/integrations/${id}/disconnect`,
    sync: (id: string) => `/integrations/${id}/sync`,
    status: (id: string) => `/integrations/${id}/status`,
  },

  // Notifications endpoints
  notifications: {
    list: '/notifications',
    get: (id: number) => `/notifications/${id}`,
    markAsRead: (id: number) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id: number) => `/notifications/${id}`,
    preferences: '/notifications/preferences',
    unreadCount: '/notifications/unread-count',
  },

  // Data Lab endpoints
  dataLab: {
    upload: '/data-lab/upload',
    files: '/data-lab/files',
    getFile: (id: string) => `/data-lab/files/${id}`,
    deleteFile: (id: string) => `/data-lab/files/${id}`,
    analyze: '/data-lab/analyze',
    preview: (id: string) => `/data-lab/files/${id}/preview`,
    export: (id: string) => `/data-lab/files/${id}/export`,
  },

  // Content endpoints
  content: {
    list: '/content',
    create: '/content',
    get: (id: string) => `/content/${id}`,
    update: (id: string) => `/content/${id}`,
    delete: (id: string) => `/content/${id}`,
    schedule: '/content/schedule',
    publish: (id: string) => `/content/${id}/publish`,
  },

  // Billing endpoints
  billing: {
    plans: '/billing/plans',
    subscription: '/billing/subscription',
    updateSubscription: '/billing/subscription/update',
    invoices: '/billing/invoices',
    paymentMethods: '/billing/payment-methods',
    usage: '/billing/usage',
  },

  // Health check
  health: {
    check: '/health',
    status: '/health/status',
    services: '/health/services',
  },
} as const;

/**
 * Build URL with query parameters
 */
export function buildUrlWithParams(
  url: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Type helper for endpoint functions
 */
export type EndpointFunction = (...args: any[]) => string;
export type Endpoint = string | EndpointFunction;
