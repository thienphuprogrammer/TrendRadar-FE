/**
 * API related type definitions
 * Centralized API types for better type safety and consistency
 */

// Base API response structure
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

// API Error structure
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

// API metadata
export interface ApiMeta {
  timestamp: string;
  requestId: string;
  page?: PageInfo;
}

// Pagination information
export interface PageInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Paginated response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiMeta & {
    page: PageInfo;
  };
}

// Request options
export interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

// Query parameters
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

// Mutation response
export interface MutationResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// File upload response
export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

