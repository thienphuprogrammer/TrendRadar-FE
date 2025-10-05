/**
 * Application constants
 * Centralized constant values used across the application
 */

// API related constants
export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  REQUEST_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Cache related constants
export const CACHE_CONSTANTS = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  INFINITY_CACHE_TIME: Infinity,
} as const;

// UI related constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 200,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  MAX_TOAST_COUNT: 5,
} as const;

// Validation constants
export const VALIDATION_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'text/plain'],
} as const;

// Date format constants
export const DATE_FORMATS = {
  FULL: 'PPP',
  SHORT: 'P',
  TIME: 'p',
  FULL_WITH_TIME: 'PPP p',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
  DATE_ONLY: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm:ss',
} as const;

// Route constants
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: '/dashboard',
  TRENDS: '/trends',
  ANALYTICS: '/analytics',
  CHATBOT: '/chatbot',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  USERS: '/users',
  BILLING: '/billing',
  INTEGRATIONS: '/integrations',
  NOTIFICATIONS: '/notifications',
  DATA_LAB: '/data-lab',
  CONTENT: '/content',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  USERS: 'users',
  USER: 'user',
  TRENDS: 'trends',
  ANALYTICS: 'analytics',
  THREADS: 'threads',
  THREAD: 'thread',
  CHATBOT: 'chatbot',
  NOTIFICATIONS: 'notifications',
  INTEGRATIONS: 'integrations',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  HEALTH: 'health',
} as const;

// Permission constants
export const PERMISSIONS = {
  VIEW_DASHBOARD: 'canViewDashboard',
  VIEW_ANALYTICS: 'canViewAnalytics',
  EXPORT_DATA: 'canExport',
  MANAGE_USERS: 'canManageUsers',
  MANAGE_INTEGRATIONS: 'canManageIntegrations',
  SCHEDULE_POSTS: 'canSchedulePosts',
  EDIT_REPORTS: 'canEditReports',
  MANAGE_BILLING: 'canManageBilling',
} as const;

// Role constants
export const ROLES = {
  ADMIN: 'admin',
  ACCOUNT_OWNER: 'account_owner',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

