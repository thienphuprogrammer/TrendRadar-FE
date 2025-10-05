import { toast } from 'sonner';
import { ApiResponse, MutationResponse } from '@/types';

/**
 * Generic API service for handling HTTP requests and responses
 * Provides consistent error handling and response formatting
 */
export class ApiService {
  /**
   * Handle API errors with user-friendly messages
   */
  static handleError(error: unknown, fallbackMessage = 'An unexpected error occurred'): string {
    console.error('API Error:', error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('Network Error')) {
        return 'Network connection failed. Please check your internet connection.';
      }
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
      if (error.message.includes('401')) {
        return 'Authentication failed. Please log in again.';
      }
      if (error.message.includes('403')) {
        return 'Access denied. You don\'t have permission to perform this action.';
      }
      if (error.message.includes('404')) {
        return 'The requested resource was not found.';
      }
      if (error.message.includes('500')) {
        return 'Server error. Please try again later.';
      }

      return error.message;
    }

    return fallbackMessage;
  }

  /**
   * Show success toast notification
   */
  static showSuccess(message: string): void {
    toast.success(message);
  }

  /**
   * Show error toast notification
   */
  static showError(message: string): void {
    toast.error(message);
  }

  /**
   * Create standardized API response
   */
  static createApiResponse<T>(data?: T, error?: string, loading = false): ApiResponse<T> {
    return {
      data,
      error,
      loading,
    };
  }

  /**
   * Create standardized mutation response
   */
  static createMutationResponse<T>(data?: T, error?: string, loading = false): MutationResponse<T> {
    return {
      data,
      error,
      loading,
    };
  }

  /**
   * Execute async operation with error handling
   */
  static async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<ApiResponse<T>> {
    try {
      const data = await operation();

      if (successMessage) {
        this.showSuccess(successMessage);
      }

      return this.createApiResponse(data);
    } catch (error) {
      const errorMsg = errorMessage || this.handleError(error);
      this.showError(errorMsg);

      return this.createApiResponse<T>(undefined, errorMsg);
    }
  }

  /**
   * Execute mutation with error handling
   */
  static async executeMutation<T>(
    mutation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<MutationResponse<T>> {
    try {
      const data = await mutation();

      if (successMessage) {
        this.showSuccess(successMessage);
      }

      return this.createMutationResponse(data);
    } catch (error) {
      const errorMsg = errorMessage || this.handleError(error);
      this.showError(errorMsg);

      return this.createMutationResponse<T>(undefined, errorMsg);
    }
  }

  /**
   * Retry async operation with exponential backoff
   */
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}
