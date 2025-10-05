/**
 * Common type definitions used across the application
 */

// Status types
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Common UI states
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  code?: string;
}

// Date range
export interface DateRange {
  from: Date;
  to: Date;
}

// Sort configuration
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Filter configuration
export interface FilterConfig {
  [key: string]: string | number | boolean | Date | null | undefined;
}

// Action with payload
export interface Action<T = unknown> {
  type: string;
  payload?: T;
}

// Async action state
export interface AsyncState<T = unknown> {
  data: T | null;
  status: Status;
  error: string | null;
}

// ID types
export type ID = string | number;

// Generic dictionary
export type Dictionary<T = unknown> = Record<string, T>;

// Nullable type
export type Nullable<T> = T | null;

// Optional type
export type Optional<T> = T | undefined;

// Awaited type helper
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// Deep partial type
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

// Required deep
export type RequiredDeep<T> = T extends object ? {
  [P in keyof T]-?: RequiredDeep<T[P]>;
} : T;

// Pick by value type
export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;

// Omit by value type
export type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>;

