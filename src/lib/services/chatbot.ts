import client, { default as apolloClientDefault } from '@/lib/apollo/client';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { cloneDeep, uniq } from 'lodash';
import { nextTick } from '@/lib/utils/time';
import { THREAD } from '@/lib/apollo/client/graphql/home';
import {
  AskingTask,
  AdjustmentTask,
  DetailedThread,
  ThreadResponse,
  RecommendedQuestionsTask,
  AskingTaskStatus,
  AskingTaskType,
  RecommendedQuestionsTaskStatus,
} from '@/types';

/**
 * Utility functions for chatbot functionality
 * Handles complex logic for asking prompts, managing tasks, and updating cache
 */
export const ChatbotUtils = {

  /**
   * Check if asking task status indicates finished state
   */
  isTaskFinished: (status: AskingTaskStatus): boolean => {
    return [
      AskingTaskStatus.FINISHED,
      AskingTaskStatus.FAILED,
      AskingTaskStatus.STOPPED,
    ].includes(status);
  },

  /**
   * Check if adjustment task status indicates finished state
   */
  isAdjustmentFinished: (status: AskingTaskStatus): boolean => {
    return [
      AskingTaskStatus.FINISHED,
      AskingTaskStatus.FAILED,
      AskingTaskStatus.STOPPED,
    ].includes(status);
  },

  /**
   * Check if asking task can generate answer
   */
  canGenerateAnswer: (
    askingTask: AskingTask | null | undefined,
    adjustmentTask: AdjustmentTask | null | undefined
  ): boolean => {
    return (
      (askingTask === null && adjustmentTask === null) ||
      askingTask?.status === AskingTaskStatus.FINISHED ||
      adjustmentTask?.status === AskingTaskStatus.FINISHED
    );
  },

  /**
   * Check if asking task can fetch thread response
   */
  canFetchThreadResponse: (askingTask: AskingTask | null | undefined): boolean => {
    return (
      askingTask !== null &&
      askingTask?.status !== AskingTaskStatus.FAILED &&
      askingTask?.status !== AskingTaskStatus.STOPPED
    );
  },

  /**
   * Check if asking task is ready for thread response
   */
  isReadyForThreadResponse: (askingTask: AskingTask | null | undefined): boolean => {
    return (
      askingTask?.status === AskingTaskStatus.SEARCHING &&
      askingTask?.type === AskingTaskType.TEXT_TO_SQL
    );
  },

  /**
   * Check if recommended questions task is finished
   */
  isRecommendedFinished: (status: RecommendedQuestionsTaskStatus): boolean => {
    return [
      RecommendedQuestionsTaskStatus.FINISHED,
      RecommendedQuestionsTaskStatus.FAILED,
      RecommendedQuestionsTaskStatus.NOT_STARTED, // for existing responses
    ].includes(status);
  },

  /**
   * Check if asking task needs recommended questions
   */
  needsRecommendedQuestions: (askingTask: AskingTask | null | undefined): boolean => {
    if (!askingTask) return false;

    const isGeneralOrMisleadingQuery = [
      AskingTaskType.GENERAL,
      AskingTaskType.MISLEADING_QUERY,
    ].includes(askingTask.type);

    const isFailed =
      askingTask.type !== AskingTaskType.TEXT_TO_SQL &&
      askingTask.status === AskingTaskStatus.FAILED;

    return isGeneralOrMisleadingQuery || isFailed;
  },

  /**
   * Check if asking task needs preparation phase
   */
  needsPreparation: (askingTask: AskingTask | null | undefined): boolean => {
    return askingTask?.type === AskingTaskType.TEXT_TO_SQL;
  },

  /**
   * Update thread cache when asking task changes
   */
  updateThreadCache: (
    client: ApolloClient<NormalizedCacheObject>,
    threadId: number,
    askingTask: AskingTask
  ): void => {
    if (!askingTask) return;

    const result = client.cache.readQuery<{ thread: DetailedThread }>({
      query: THREAD,
      variables: { threadId },
    });

    if (result?.thread) {
      client.cache.updateQuery(
        {
          query: THREAD,
          variables: { threadId },
        },
        (existingData: any) => {
          return {
            thread: {
              ...existingData.thread,
              responses: existingData.thread.responses.map((response: any) => {
                if (response.askingTask?.queryId === askingTask.queryId) {
                  return {
                    ...response,
                    askingTask: cloneDeep(askingTask),
                  };
                }
                return response;
              }),
            },
          };
        }
      );
    }
  },

  /**
   * Update thread cache for rerun asking task
   */
  updateRerunAskingTaskCache: (
    client: ApolloClient<NormalizedCacheObject>,
    threadId: number,
    threadResponseId: number,
    askingTask: AskingTask
  ): void => {
    if (!askingTask) return;

    const result = client.cache.readQuery<{ thread: DetailedThread }>({
      query: THREAD,
      variables: { threadId },
    });

    if (result?.thread) {
      const task = cloneDeep(askingTask);
      // Bypass understanding status to thread response
      if (task.status === AskingTaskStatus.UNDERSTANDING) {
        task.status = AskingTaskStatus.SEARCHING;
        task.type = AskingTaskType.TEXT_TO_SQL;
      }

      client.cache.updateQuery(
        {
          query: THREAD,
          variables: { threadId },
        },
        (existingData: any) => {
          return {
            thread: {
              ...existingData.thread,
              responses: existingData.thread.responses.map((response: any) => {
                if (response.id === threadResponseId) {
                  return { ...response, askingTask: task };
                }
                return response;
              }),
            },
          };
        }
      );
    }
  },

  /**
   * Update thread cache when thread response changes
   */
  updateThreadResponseCache: (
    client: ApolloClient<NormalizedCacheObject>,
    threadId: number,
    threadResponse: ThreadResponse
  ): void => {
    const result = client.cache.readQuery<{ thread: DetailedThread }>({
      query: THREAD,
      variables: { threadId },
    });

    if (result?.thread) {
      client.cache.updateQuery(
        {
          query: THREAD,
          variables: { threadId },
        },
        (existingData: any) => {
          const isNewResponse = !existingData.thread.responses
            .map((r: any) => r.id)
            .includes(threadResponse.id);

          return {
            thread: {
              ...existingData.thread,
              responses: isNewResponse
                ? [...existingData.thread.responses, threadResponse]
                : existingData.thread.responses.map((response: any) => {
                    return response.id === threadResponse.id
                      ? cloneDeep(threadResponse)
                      : response;
                  }),
            },
          };
        }
      );
    }
  },

  /**
   * Generate previous questions for recommended questions
   */
  generatePreviousQuestions: (
    threadQuestions: string[],
    originalQuestion: string
  ): string[] => {
    return [
      // slice the last 5 questions in threadQuestions
      ...uniq(threadQuestions).slice(-5),
      originalQuestion,
    ];
  },

  /**
   * Wait for specified milliseconds
   */
  wait: async (milliseconds: number): Promise<void> => {
    await nextTick(milliseconds);
  },
};
