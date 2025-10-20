import { useState, useEffect, useCallback, useRef } from 'react';
import { useChatData } from './useChatData';
import { ThreadResponse } from '@/apollo/client/graphql/__types__';

export interface UseThreadPollingReturn {
  pollingResponses: Set<number>;
  startPolling: (responseId: number) => void;
  stopPolling: (responseId: number) => void;
  stopAllPolling: () => void;
  isPolling: (responseId: number) => boolean;
}

export function useThreadPolling(): UseThreadPollingReturn {
  const [pollingResponses, setPollingResponses] = useState<Set<number>>(new Set());
  const { pollThreadResponse } = useChatData();
  const pollingIntervals = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const startPolling = useCallback((responseId: number) => {
    if (pollingResponses.has(responseId)) return;

    setPollingResponses(prev => new Set(prev).add(responseId));

    const interval = setInterval(async () => {
      try {
        const response = await pollThreadResponse(responseId);
        if (response) {
          // Check if response is finished
          const isFinished = checkIfResponseFinished(response);
          if (isFinished) {
            stopPolling(responseId);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        stopPolling(responseId);
      }
    }, 1000); // Poll every second

    pollingIntervals.current.set(responseId, interval);
  }, [pollingResponses, pollThreadResponse]);

  const stopPolling = useCallback((responseId: number) => {
    const interval = pollingIntervals.current.get(responseId);
    if (interval) {
      clearInterval(interval);
      pollingIntervals.current.delete(responseId);
    }
    
    setPollingResponses(prev => {
      const newSet = new Set(prev);
      newSet.delete(responseId);
      return newSet;
    });
  }, []);

  const stopAllPolling = useCallback(() => {
    pollingIntervals.current.forEach((interval) => {
      clearInterval(interval);
    });
    pollingIntervals.current.clear();
    setPollingResponses(new Set());
  }, []);

  const isPolling = useCallback((responseId: number) => {
    return pollingResponses.has(responseId);
  }, [pollingResponses]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllPolling();
    };
  }, [stopAllPolling]);

  return {
    pollingResponses,
    startPolling,
    stopPolling,
    stopAllPolling,
    isPolling
  };
}

// Helper function to check if a response is finished
function checkIfResponseFinished(response: ThreadResponse): boolean {
  // Check if asking task is finished
  if (response.askingTask && response.askingTask.status !== 'COMPLETED') {
    return false;
  }

  // Check if breakdown detail is finished
  if (response.breakdownDetail && response.breakdownDetail.status !== 'COMPLETED') {
    return false;
  }

  // Check if answer detail is finished
  if (response.answerDetail && response.answerDetail.status !== 'COMPLETED') {
    return false;
  }

  // Check if chart detail is finished
  if (response.chartDetail && response.chartDetail.status !== 'COMPLETED') {
    return false;
  }

  // Check if adjustment task is finished
  if (response.adjustmentTask && response.adjustmentTask.status !== 'COMPLETED') {
    return false;
  }

  return true;
}
