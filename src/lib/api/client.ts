import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiService } from '@/lib/services/api';

/**
 * HTTP client configuration for API calls
 */
export class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseURL = baseURL;

    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracing
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get auth token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          this.handleUnauthorized();
          break;
        case 403:
          // Forbidden
          ApiService.showError('Access denied');
          break;
        case 404:
          // Not found
          ApiService.showError('Resource not found');
          break;
        case 429:
          // Rate limited
          ApiService.showError('Too many requests. Please try again later.');
          break;
        case 500:
          // Server error
          ApiService.showError('Server error. Please try again later.');
          break;
        default:
          ApiService.showError(data?.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      ApiService.showError('Network error. Please check your connection.');
    } else {
      // Other error
      ApiService.showError('An unexpected error occurred');
    }
  }

  /**
   * Handle unauthorized access
   */
  private handleUnauthorized() {
    // Clear auth token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }

    // Redirect to login (you might want to use Next.js router here)
    window.location.href = '/login';
  }

  /**
   * Generic HTTP request method
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'GET', url, ...config });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'POST', url, data, ...config });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'PUT', url, data, ...config });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'PATCH', url, data, ...config });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'DELETE', url, ...config });
    return response.data;
  }

  /**
   * Upload file
   */
  async uploadFile<T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });

    return response.data;
  }
}

/**
 * Create and export API client instance
 */
export const apiClient = new ApiClient();

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },

  // User endpoints
  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    profile: '/users/profile',
  },

  // Thread/Conversation endpoints
  threads: {
    list: '/threads',
    create: '/threads',
    get: (id: string) => `/threads/${id}`,
    update: (id: string) => `/threads/${id}`,
    delete: (id: string) => `/threads/${id}`,
    responses: (id: string) => `/threads/${id}/responses`,
  },

  // Chatbot endpoints
  chatbot: {
    ask: '/chatbot/ask',
    adjust: '/chatbot/adjust',
    recommended: '/chatbot/recommended',
    cancel: '/chatbot/cancel',
    rerun: '/chatbot/rerun',
  },

  // Analytics endpoints
  analytics: {
    trends: '/analytics/trends',
    kpis: '/analytics/kpis',
    reports: '/analytics/reports',
    export: '/analytics/export',
  },

  // Settings endpoints
  settings: {
    app: '/settings/app',
    user: '/settings/user',
    integrations: '/settings/integrations',
  },
} as const;
