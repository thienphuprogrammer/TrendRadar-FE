import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import {
  AskingTask,
  ThreadResponse,
  DetailedThread,
  RecommendedQuestionsTask,
  AskingTaskStatus,
  AskingTaskType,
  RecommendedQuestionsTaskStatus
} from '@/types';

/**
 * Chatbot store for managing conversation state
 * Uses Zustand for reactive state management
 */

export interface ChatbotState {
  // Current conversation
  currentThreadId: number | null;
  currentThread: DetailedThread | null;

  // Active tasks
  activeAskingTask: AskingTask | null;
  activeRecommendedTask: RecommendedQuestionsTask | null;

  // UI State
  isStreaming: boolean;
  showRecommendedQuestions: boolean;

  // Conversation history
  threadQuestions: string[];

  // Settings
  autoScroll: boolean;
  soundEnabled: boolean;

  // Actions
  setCurrentThread: (thread: DetailedThread | null) => void;
  setCurrentThreadId: (threadId: number | null) => void;
  addThreadResponse: (response: ThreadResponse) => void;
  updateThreadResponse: (responseId: string, updates: Partial<ThreadResponse>) => void;

  // Task management
  setActiveAskingTask: (task: AskingTask | null) => void;
  setActiveRecommendedTask: (task: RecommendedQuestionsTask | null) => void;
  updateAskingTask: (updates: Partial<AskingTask>) => void;
  updateRecommendedTask: (updates: Partial<RecommendedQuestionsTask>) => void;

  // UI actions
  setStreaming: (streaming: boolean) => void;
  setShowRecommendedQuestions: (show: boolean) => void;
  toggleRecommendedQuestions: () => void;

  // Conversation actions
  addQuestionToHistory: (question: string) => void;
  clearQuestionHistory: () => void;
  setThreadQuestions: (questions: string[]) => void;

  // Settings
  setAutoScroll: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Utility actions
  reset: () => void;
  resetCurrentThread: () => void;
}

const initialState = {
  currentThreadId: null,
  currentThread: null,
  activeAskingTask: null,
  activeRecommendedTask: null,
  isStreaming: false,
  showRecommendedQuestions: false,
  threadQuestions: [],
  autoScroll: true,
  soundEnabled: false,
};

export const useChatbotStore = create<ChatbotState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Thread management
      setCurrentThread: (thread) => {
        set({ currentThread: thread }, false, 'setCurrentThread');

        if (thread) {
          set({ currentThreadId: Number(thread.id) }, false, 'setCurrentThreadId');
        }
      },

      setCurrentThreadId: (threadId) => {
        set({ currentThreadId: threadId }, false, 'setCurrentThreadId');
      },

      addThreadResponse: (response) => {
        const state = get();
        if (!state.currentThread) return;

        const updatedThread = {
          ...state.currentThread,
          responses: [...state.currentThread.responses, response],
        };

        set({ currentThread: updatedThread }, false, 'addThreadResponse');
      },

      updateThreadResponse: (responseId, updates) => {
        const state = get();
        if (!state.currentThread) return;

        const updatedResponses = state.currentThread.responses.map((response) =>
          response.id === responseId ? { ...response, ...updates } : response
        );

        set(
          {
            currentThread: {
              ...state.currentThread,
              responses: updatedResponses,
            },
          },
          false,
          'updateThreadResponse'
        );
      },

      // Task management
      setActiveAskingTask: (task) => {
        set({ activeAskingTask: task }, false, 'setActiveAskingTask');
        set({ isStreaming: !!task && task.status === AskingTaskStatus.PLANNING }, false, 'setStreaming');
      },

      setActiveRecommendedTask: (task) => {
        set({ activeRecommendedTask: task }, false, 'setActiveRecommendedTask');
      },

      updateAskingTask: (updates) => {
        const state = get();
        if (!state.activeAskingTask) return;

        const updatedTask = { ...state.activeAskingTask, ...updates };
        set({ activeAskingTask: updatedTask }, false, 'updateAskingTask');

        // Update streaming state based on task status
        set({
          isStreaming: updatedTask.status === AskingTaskStatus.PLANNING,
        }, false, 'setStreaming');
      },

      updateRecommendedTask: (updates) => {
        const state = get();
        if (!state.activeRecommendedTask) return;

        set({
          activeRecommendedTask: { ...state.activeRecommendedTask, ...updates },
        }, false, 'updateRecommendedTask');
      },

      // UI actions
      setStreaming: (streaming) => {
        set({ isStreaming: streaming }, false, 'setStreaming');
      },

      setShowRecommendedQuestions: (show) => {
        set({ showRecommendedQuestions: show }, false, 'setShowRecommendedQuestions');
      },

      toggleRecommendedQuestions: () => {
        set(
          (state) => ({ showRecommendedQuestions: !state.showRecommendedQuestions }),
          false,
          'toggleRecommendedQuestions'
        );
      },

      // Conversation actions
      addQuestionToHistory: (question) => {
        set(
          (state) => ({
            threadQuestions: [...state.threadQuestions, question].slice(-10), // Keep last 10 questions
          }),
          false,
          'addQuestionToHistory'
        );
      },

      clearQuestionHistory: () => {
        set({ threadQuestions: [] }, false, 'clearQuestionHistory');
      },

      setThreadQuestions: (questions) => {
        set({ threadQuestions: questions }, false, 'setThreadQuestions');
      },

      // Settings
      setAutoScroll: (enabled) => {
        set({ autoScroll: enabled }, false, 'setAutoScroll');
      },

      setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled }, false, 'setSoundEnabled');
      },

      // Utility actions
      reset: () => {
        set(initialState, false, 'reset');
      },

      resetCurrentThread: () => {
        set(
          {
            currentThread: null,
            currentThreadId: null,
            activeAskingTask: null,
            activeRecommendedTask: null,
            isStreaming: false,
            showRecommendedQuestions: false,
          },
          false,
          'resetCurrentThread'
        );
      },
    })),
    {
      name: 'ChatbotStore',
    }
  )
);
