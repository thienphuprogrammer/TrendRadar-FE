/**
 * Enhanced HTTP Client
 * Professional API client with comprehensive error handling, interceptors, and logging
 */

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';
import { env, isClient } from '@/lib/config/env';
import { API_CONSTANTS, HTTP_STATUS, ERROR_CODES } from '@/lib/config/constants';
import { ApiError, ApiResponse } from '@/types/api';
import { logger } from '@/lib/utils/logger';

/**
 * HTTP Client class with advanced features
 */
export class HttpClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = env.api.baseUrl) {
    this.baseURL = baseURL;

    this.client = axios.create({
      baseURL,
      timeout: env.api.timeout,
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
  private handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add auth token if available
    const token = this.getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracing
    if (config.headers) {
      config.headers['X-Request-ID'] = this.generateRequestId();
      config.headers['X-Client-Version'] = env.app.version;
    }

    // Log request in development
    logger.debug('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
    });

    return config;
  };

  /**
   * Handle request errors
   */
  private handleRequestError = (error: AxiosError): Promise<never> => {
    logger.error('Request Error:', error);
    return Promise.reject(this.normalizeError(error));
  };

  /**
   * Handle successful responses
   */
  private handleResponse = <T>(response: AxiosResponse<T>): AxiosResponse<T> => {
    logger.debug('API Response:', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  };

  /**
   * Handle response errors
   */
  private handleResponseError = (error: AxiosError): Promise<never> => {
    const normalizedError = this.normalizeError(error);
    
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          this.handleUnauthorized();
          break;
        case HTTP_STATUS.FORBIDDEN:
          logger.warn('Access denied');
          break;
        case HTTP_STATUS.NOT_FOUND:
          logger.warn('Resource not found');
          break;
        case HTTP_STATUS.TOO_MANY_REQUESTS:
          logger.warn('Rate limit exceeded');
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        case HTTP_STATUS.BAD_GATEWAY:
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          logger.error('Server error');
          break;
      }
    } else if (error.request) {
      logger.error('Network error');
    }

    logger.error('API Error:', normalizedError);
    return Promise.reject(normalizedError);
  };

  /**
   * Normalize error to consistent format
   */
  private normalizeError(error: AxiosError): ApiError {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      
      if (response) {
        // Server responded with error
        return {
          code: this.getErrorCode(response.status),
          message: this.getErrorMessage(error),
          statusCode: response.status,
          details: response.data,
        };
      } else if (error.request) {
        // Request made but no response
        return {
          code: ERROR_CODES.NETWORK_ERROR,
          message: 'Network error. Please check your connection.',
          statusCode: 0,
        };
      } else if (error.code === 'ECONNABORTED') {
        // Request timeout
        return {
          code: ERROR_CODES.TIMEOUT,
          message: 'Request timeout. Please try again.',
          statusCode: 0,
        };
      }
    }

    // Unknown error
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
      return data.message || data.error || error.message;
    }

    return error.message || 'An error occurred';
  }

  /**
   * Get auth token from storage
   */
  private getAuthToken(): string | null {
    if (!isClient) return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle unauthorized access
   */
  private handleUnauthorized(): void {
    if (!isClient) return;

    // Clear auth token
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');

    // Redirect to login
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/auth')) {
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }

  /**
   * Generic request method
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
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
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'GET', url, ...config });
    return response.data as T;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'POST', url, data, ...config });
    return response.data as T;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'PUT', url, data, ...config });
    return response.data as T;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'PATCH', url, data, ...config });
    return response.data as T;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.request<T>({ method: 'DELETE', url, ...config });
    return response.data as T;
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
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
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
      ...config,
    });

    return response.data as T;
  }

  /**
   * Cancel request
   */
  createCancelToken() {
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
 * Create and export HTTP client instance
 */
export const httpClient = new HttpClient();

/**
 * Export axios for direct use if needed
 */
export { axios };

