import { useState, useCallback } from 'react';
import { mockChatService } from '@/services/mockChatService';
import { realChatService } from '@/services/realChatService';
import { 
  CreateThreadInput, 
  CreateThreadResponseInput,
  CreateSqlPairInput,
  CreateViewInput,
  AdjustThreadResponseInput,
  AdjustThreadResponseChartInput,
  ThreadResponse,
  Thread
} from '@/apollo/client/graphql/__types__';

// Environment variable to switch between mock and real data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development';

export interface UseChatDataReturn {
  // Thread operations
  createThread: (data: CreateThreadInput) => Promise<{ id: number }>;
  getThread: (threadId: number) => Promise<Thread | null>;
  getThreads: () => Promise<Thread[]>;
  
  // Thread response operations
  createThreadResponse: (threadId: number, data: CreateThreadResponseInput) => Promise<ThreadResponse>;
  updateThreadResponse: (responseId: number, data: { sql?: string }) => Promise<ThreadResponse>;
  adjustThreadResponse: (responseId: number, data: AdjustThreadResponseInput) => Promise<ThreadResponse>;
  adjustThreadResponseChart: (responseId: number, data: AdjustThreadResponseChartInput) => Promise<ThreadResponse>;
  
  // SQL Pair operations
  createSqlPair: (data: CreateSqlPairInput) => Promise<any>;
  getSqlPairs: () => Promise<any[]>;
  
  // View operations
  createView: (data: CreateViewInput) => Promise<any>;
  validateView: (data: { name: string }) => Promise<{ valid: boolean; message: string }>;
  
  // Polling
  pollThreadResponse: (responseId: number) => Promise<ThreadResponse | null>;
  
  // Recommended questions
  getRecommendedQuestions: (threadId: number) => Promise<any>;
  
  // Service info
  isMockMode: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useChatData(): UseChatDataReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const service = USE_MOCK_DATA ? mockChatService : realChatService;
  
  const handleAsync = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Thread operations
  const createThread = useCallback(async (data: CreateThreadInput) => {
    return handleAsync(() => service.createThread(data));
  }, [service, handleAsync]);

  const getThread = useCallback(async (threadId: number) => {
    return handleAsync(() => service.getThread(threadId));
  }, [service, handleAsync]);

  const getThreads = useCallback(async () => {
    return handleAsync(() => service.getThreads());
  }, [service, handleAsync]);

  // Thread response operations
  const createThreadResponse = useCallback(async (threadId: number, data: CreateThreadResponseInput) => {
    return handleAsync(() => service.createThreadResponse(threadId, data));
  }, [service, handleAsync]);

  const updateThreadResponse = useCallback(async (responseId: number, data: { sql?: string }) => {
    return handleAsync(() => service.updateThreadResponse(responseId, data));
  }, [service, handleAsync]);

  const adjustThreadResponse = useCallback(async (responseId: number, data: AdjustThreadResponseInput) => {
    return handleAsync(() => service.adjustThreadResponse(responseId, data));
  }, [service, handleAsync]);

  const adjustThreadResponseChart = useCallback(async (responseId: number, data: AdjustThreadResponseChartInput) => {
    return handleAsync(() => service.adjustThreadResponseChart(responseId, data));
  }, [service, handleAsync]);

  // SQL Pair operations
  const createSqlPair = useCallback(async (data: CreateSqlPairInput) => {
    return handleAsync(() => service.createSqlPair(data));
  }, [service, handleAsync]);

  const getSqlPairs = useCallback(async () => {
    return handleAsync(() => service.getSqlPairs());
  }, [service, handleAsync]);

  // View operations
  const createView = useCallback(async (data: CreateViewInput) => {
    return handleAsync(() => service.createView(data));
  }, [service, handleAsync]);

  const validateView = useCallback(async (data: { name: string }) => {
    return handleAsync(() => service.validateView(data));
  }, [service, handleAsync]);

  // Polling
  const pollThreadResponse = useCallback(async (responseId: number) => {
    return handleAsync(() => service.pollThreadResponse(responseId));
  }, [service, handleAsync]);

  // Recommended questions
  const getRecommendedQuestions = useCallback(async (threadId: number) => {
    return handleAsync(() => service.getRecommendedQuestions(threadId));
  }, [service, handleAsync]);

  return {
    // Thread operations
    createThread,
    getThread,
    getThreads,
    
    // Thread response operations
    createThreadResponse,
    updateThreadResponse,
    adjustThreadResponse,
    adjustThreadResponseChart,
    
    // SQL Pair operations
    createSqlPair,
    getSqlPairs,
    
    // View operations
    createView,
    validateView,
    
    // Polling
    pollThreadResponse,
    
    // Recommended questions
    getRecommendedQuestions,
    
    // Service info
    isMockMode: USE_MOCK_DATA,
    isLoading,
    error
  };
}
