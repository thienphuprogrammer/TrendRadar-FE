/**
 * Environment configuration
 * Centralized environment variable management with type safety
 */

// Validate that required env vars are present
const requireEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Get optional env var
const getEnv = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

// Get boolean env var
const getBoolEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

// Get number env var
const getNumberEnv = (key: string, defaultValue: number = 0): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Application environment configuration
 */
export const env = {
  // App Info
  app: {
    name: getEnv('NEXT_PUBLIC_APP_NAME', 'TrendRadar Hub'),
    version: getEnv('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
    env: getEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  },

  // API Configuration
  api: {
    baseUrl: requireEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8000'),
    timeout: getNumberEnv('NEXT_PUBLIC_API_TIMEOUT', 30000),
    graphqlUrl: getEnv('NEXT_PUBLIC_GRAPHQL_URL', 'http://localhost:8000/graphql'),
  },

  // Authentication
  auth: {
    enabled: getBoolEnv('NEXT_PUBLIC_AUTH_ENABLED', true),
    sessionTimeout: getNumberEnv('NEXT_PUBLIC_SESSION_TIMEOUT', 3600000), // 1 hour
  },

  // Feature Flags
  features: {
    analytics: getBoolEnv('NEXT_PUBLIC_ENABLE_ANALYTICS', true),
    chatbot: getBoolEnv('NEXT_PUBLIC_ENABLE_CHATBOT', true),
    wrenAI: getBoolEnv('NEXT_PUBLIC_ENABLE_WREN_AI', true),
    devtools: getBoolEnv('NEXT_PUBLIC_ENABLE_DEVTOOLS', true),
  },

  // Analytics
  analytics: {
    posthogKey: getEnv('NEXT_PUBLIC_POSTHOG_KEY'),
    posthogHost: getEnv('NEXT_PUBLIC_POSTHOG_HOST'),
  },

  // Development
  dev: {
    logLevel: getEnv('NEXT_PUBLIC_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
  },
} as const;

/**
 * Check if running in development mode
 */
export const isDev = env.app.env === 'development';

/**
 * Check if running in production mode
 */
export const isProd = env.app.env === 'production';

/**
 * Check if running in test mode
 */
export const isTest = env.app.env === 'test';

/**
 * Check if running on client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Check if running on server side
 */
export const isServer = typeof window === 'undefined';

