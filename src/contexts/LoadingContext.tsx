import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CardSkeleton, TableSkeleton, FormSkeleton, ProfileSkeleton } from '@/components/ui/skeleton';

interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  skeletonType?: 'card' | 'table' | 'form' | 'profile' | 'custom';
  customSkeleton?: ReactNode;
}

interface LoadingContextType {
  loadingState: LoadingState;
  setLoading: (isLoading: boolean, options?: Partial<LoadingState>) => void;
  clearLoading: () => void;
  renderSkeleton: () => ReactNode;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

/**
 * Loading context provider for managing global loading states
 * Provides skeleton rendering based on the current loading type
 */
export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  const setLoading = (isLoading: boolean, options?: Partial<LoadingState>) => {
    setLoadingState({
      isLoading,
      ...options,
    });
  };

  const clearLoading = () => {
    setLoadingState({
      isLoading: false,
    });
  };

  const renderSkeleton = (): ReactNode => {
    if (!loadingState.isLoading) return null;

    switch (loadingState.skeletonType) {
      case 'card':
        return <CardSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'form':
        return <FormSkeleton />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'custom':
        return loadingState.customSkeleton || <CardSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  const value: LoadingContextType = {
    loadingState,
    setLoading,
    clearLoading,
    renderSkeleton,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Hook to use loading context
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

/**
 * Hook for component-specific loading states
 */
export function useComponentLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>();

  const startLoading = (message?: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
  };

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  };
}
