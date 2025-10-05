/**
 * Unified API Client
 * Production-ready HTTP client with comprehensive features:
 * - Request/response interceptors
 * - Automatic token refresh
 * - Error normalization
 * - Request retry logic
 * - Request cancellation
 * - File upload with progress
 * - TypeScript type safety
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  CancelTokenSource,
} from 'axios';
import { toast } from 'sonner';

// Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

export interface ApiMeta {
  timestamp: string;
  requestId: string;
  page?: PageInfo;
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
  retryAttempts?: number;
}

// Constants
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
  CANCELLED: 'CANCELLED',
} as const;

/**
 * Unified HTTP Client Class
 */
export class UnifiedApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseURL = baseURL;

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    // Response interceptor
    this.client.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  /**
   * Handle outgoing requests
   */
  private handleRequest = (
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig => {
    const customConfig = config as InternalAxiosRequestConfig & RequestOptions;

    // Add auth token if not skipped
    if (!customConfig.skipAuth) {
      const token = this.getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add request metadata
    if (config.headers) {
      config.headers['X-Request-ID'] = this.generateRequestId();
      config.headers['X-Client-Version'] = '1.0.0';
      config.headers['X-Timestamp'] = new Date().toISOString();
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
      });
    }

    return config;
  };

  /**
   * Handle request errors
   */
  private handleRequestError = (error: AxiosError): Promise<never> => {
    console.error('[Request Error]', error);
    return Promise.reject(this.normalizeError(error));
  };

  /**
   * Handle successful responses
   */
  private handleResponse = <T>(response: AxiosResponse<T>): AxiosResponse<T> => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Response]', {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  };

  /**
   * Handle response errors with retry logic
   */
  private handleResponseError = async (error: AxiosError): Promise<never> => {
    const config = error.config as InternalAxiosRequestConfig & RequestOptions;
    
    if (!error.response) {
      return Promise.reject(this.normalizeError(error));
    }

    const { status } = error.response;

    // Handle 401 Unauthorized with token refresh
    if (status === HTTP_STATUS.UNAUTHORIZED && !config._retry) {
      config._retry = true;

      try {
        const newToken = await this.refreshToken();
        if (newToken && config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`;
          return this.client.request(config);
        }
      } catch (refreshError) {
        this.handleUnauthorized();
        return Promise.reject(this.normalizeError(error));
      }
    }

    // Handle other status codes
    const normalizedError = this.normalizeError(error);
    
    // Show toast notification unless explicitly skipped
    if (!config.skipErrorToast) {
      this.showErrorToast(normalizedError);
    }

    // Log error
    console.error('[API Error]', normalizedError);

    return Promise.reject(normalizedError);
  };

  /**
   * Normalize errors to consistent format
   */
  private normalizeError(error: AxiosError): ApiError {
    if (axios.isCancel(error)) {
      return {
        code: ERROR_CODES.CANCELLED,
        message: 'Request was cancelled',
        statusCode: 0,
      };
    }

    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response) {
        return {
          code: this.getErrorCode(response.status),
          message: this.getErrorMessage(error),
          statusCode: response.status,
          details: response.data,
        };
      }

      if (error.request) {
        return {
          code: ERROR_CODES.NETWORK_ERROR,
          message: 'Network error. Please check your connection.',
          statusCode: 0,
        };
      }

      if (error.code === 'ECONNABORTED') {
        return {
          code: ERROR_CODES.TIMEOUT,
          message: 'Request timeout. Please try again.',
          statusCode: 0,
        };
      }
    }

    return {
      code: ERROR_CODES.UNKNOWN,
      message: error.message || 'An unexpected error occurred',
      statusCode: 0,
    };
  }

  /**
   * Get error code from HTTP status
   */
  private getErrorCode(status: number): string {
    const statusMap: Record<number, string> = {
      [HTTP_STATUS.UNAUTHORIZED]: ERROR_CODES.UNAUTHORIZED,
      [HTTP_STATUS.FORBIDDEN]: ERROR_CODES.FORBIDDEN,
      [HTTP_STATUS.NOT_FOUND]: ERROR_CODES.NOT_FOUND,
      [HTTP_STATUS.UNPROCESSABLE_ENTITY]: ERROR_CODES.VALIDATION_ERROR,
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ERROR_CODES.SERVER_ERROR,
      [HTTP_STATUS.BAD_GATEWAY]: ERROR_CODES.SERVER_ERROR,
      [HTTP_STATUS.SERVICE_UNAVAILABLE]: ERROR_CODES.SERVER_ERROR,
    };

    return statusMap[status] || ERROR_CODES.UNKNOWN;
  }

  /**
   * Extract error message from error object
   */
  private getErrorMessage(error: AxiosError): string {
    const response = error.response;

    if (response?.data) {
      const data = response.data as any;
      return data.message || data.error || data.detail || error.message;
    }

    return error.message || 'An error occurred';
  }

  /**
   * Show error toast notification
   */
  private showErrorToast(error: ApiError): void {
    const messages: Record<string, string> = {
      [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection.',
      [ERROR_CODES.TIMEOUT]: 'Request timeout. Please try again.',
      [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized. Please log in.',
      [ERROR_CODES.FORBIDDEN]: 'Access denied.',
      [ERROR_CODES.NOT_FOUND]: 'Resource not found.',
      [ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
    };

    const message = messages[error.code] || error.message;
    toast.error(message);
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
   * Refresh authentication token
   */
  private async refreshToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${this.baseURL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data;
        localStorage.setItem('auth_token', access_token);

        return access_token;
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        throw error;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  /**
   * Handle unauthorized access
   */
  private handleUnauthorized(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');

    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/auth')) {
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }

  /**
   * Generic request method
   */
  async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>(options);
      return {
        data: response.data,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: response.headers['x-request-id'] || '',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>({ method: 'GET', url, ...options });
    return response.data as T;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>({
      method: 'POST',
      url,
      data,
      ...options,
    });
    return response.data as T;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>({
      method: 'PUT',
      url,
      data,
      ...options,
    });
    return response.data as T;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...options,
    });
    return response.data as T;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>({
      method: 'DELETE',
      url,
      ...options,
    });
    return response.data as T;
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    options?: RequestOptions
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
      ...options,
    });

    return response.data as T;
  }

  /**
   * Create cancel token source
   */
  createCancelToken(): CancelTokenSource {
    return axios.CancelToken.source();
  }

  /**
   * Check if error is cancel error
   */
  isCancel(error: any): boolean {
    return axios.isCancel(error);
  }
}

/**
 * Create and export unified API client instance
 */
export const apiClient = new UnifiedApiClient();

/**
 * Export axios for direct use if needed
 */
export { axios };

