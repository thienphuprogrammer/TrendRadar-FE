import { apiClient, API_ENDPOINTS } from './client';
import { ApiService } from '@/lib/services/api';

/**
 * API service methods for different domains
 * Integrates with React Query for caching and error handling
 */

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.auth.login, credentials),
      'Login successful',
      'Login failed'
    );
  },

  logout: async () => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.auth.logout),
      'Logout successful',
      'Logout failed'
    );
  },

  refreshToken: async () => {
    return apiClient.post(API_ENDPOINTS.auth.refresh);
  },

  forgotPassword: async (email: string) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email }),
      'Password reset email sent',
      'Failed to send reset email'
    );
  },

  resetPassword: async (data: { token: string; password: string }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.auth.resetPassword, data),
      'Password reset successful',
      'Failed to reset password'
    );
  },
};

// User API
export const userApi = {
  getUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
    return apiClient.get(API_ENDPOINTS.users.list, { params });
  },

  getUser: async (id: string) => {
    return apiClient.get(API_ENDPOINTS.users.get(id));
  },

  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    department?: string;
    phone?: string;
  }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.users.create, data),
      'User created successfully',
      'Failed to create user'
    );
  },

  updateUser: async (id: string, data: {
    name?: string;
    email?: string;
    role?: string;
    department?: string;
    phone?: string;
  }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.put(API_ENDPOINTS.users.update(id), data),
      'User updated successfully',
      'Failed to update user'
    );
  },

  deleteUser: async (id: string) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.delete(API_ENDPOINTS.users.delete(id)),
      'User deleted successfully',
      'Failed to delete user'
    );
  },

  getProfile: async () => {
    return apiClient.get(API_ENDPOINTS.users.profile);
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
    department?: string;
    phone?: string;
  }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.put(API_ENDPOINTS.users.profile, data),
      'Profile updated successfully',
      'Failed to update profile'
    );
  },
};

// Thread API
export const threadApi = {
  getThreads: async (params?: { page?: number; limit?: number; search?: string }) => {
    return apiClient.get(API_ENDPOINTS.threads.list, { params });
  },

  getThread: async (id: string) => {
    return apiClient.get(API_ENDPOINTS.threads.get(id));
  },

  createThread: async (data: { title: string; content?: string }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.threads.create, data),
      'Thread created successfully',
      'Failed to create thread'
    );
  },

  updateThread: async (id: string, data: { title?: string; content?: string }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.put(API_ENDPOINTS.threads.update(id), data),
      'Thread updated successfully',
      'Failed to update thread'
    );
  },

  deleteThread: async (id: string) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.delete(API_ENDPOINTS.threads.delete(id)),
      'Thread deleted successfully',
      'Failed to delete thread'
    );
  },

  getThreadResponses: async (id: string) => {
    return apiClient.get(API_ENDPOINTS.threads.responses(id));
  },

  addThreadResponse: async (threadId: string, data: { question: string; context?: string[] }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.threads.responses(threadId), data),
      'Message sent successfully',
      'Failed to send message'
    );
  },
};

// Chatbot API
export const chatbotApi = {
  ask: async (data: { question: string; threadId?: number; context?: string[] }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.chatbot.ask, data),
      undefined,
      'Failed to process question'
    );
  },

  adjustAnswer: async (data: { responseId: string; adjustment: {
    sql?: string;
    reasoning?: string;
    tables?: string[];
  }}) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.chatbot.adjust, data),
      'Answer adjusted successfully',
      'Failed to adjust answer'
    );
  },

  getRecommendedQuestions: async (data: { threadId: number; previousQuestions: string[] }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.chatbot.recommended, data),
      undefined,
      'Failed to generate recommendations'
    );
  },

  cancelTask: async (taskId: string) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.chatbot.cancel, { taskId }),
      'Task cancelled successfully',
      'Failed to cancel task'
    );
  },

  rerunTask: async (responseId: string) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.chatbot.rerun, { responseId }),
      'Task rerun successfully',
      'Failed to rerun task'
    );
  },
};

// Analytics API
export const analyticsApi = {
  getTrends: async (params?: {
    startDate?: string;
    endDate?: string;
    categories?: string[];
    platforms?: string[];
  }) => {
    return apiClient.get(API_ENDPOINTS.analytics.trends, { params });
  },

  getKPIs: async (params?: { dateRange?: string; groupBy?: string }) => {
    return apiClient.get(API_ENDPOINTS.analytics.kpis, { params });
  },

  getReports: async (params?: { page?: number; limit?: number; status?: string }) => {
    return apiClient.get(API_ENDPOINTS.analytics.reports, { params });
  },

  exportData: async (data: {
    format: 'csv' | 'excel' | 'pdf';
    filters: Record<string, any>;
    columns: string[];
  }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.analytics.export, data, {
        responseType: 'blob',
      }),
      'Export started successfully',
      'Failed to start export'
    );
  },
};

// Settings API
export const settingsApi = {
  getAppSettings: async () => {
    return apiClient.get(API_ENDPOINTS.settings.app);
  },

  updateAppSettings: async (data: {
    theme?: string;
    language?: string;
    timezone?: string;
    notifications?: Record<string, boolean>;
    autoSave?: boolean;
    compactMode?: boolean;
  }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.put(API_ENDPOINTS.settings.app, data),
      'Settings updated successfully',
      'Failed to update settings'
    );
  },

  getUserSettings: async () => {
    return apiClient.get(API_ENDPOINTS.settings.user);
  },

  updateUserSettings: async (data: Record<string, any>) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.put(API_ENDPOINTS.settings.user, data),
      'User settings updated successfully',
      'Failed to update user settings'
    );
  },

  getIntegrations: async () => {
    return apiClient.get(API_ENDPOINTS.settings.integrations);
  },

  createIntegration: async (data: {
    name: string;
    type: string;
    config: Record<string, any>;
    autoSync?: boolean;
    syncFrequency?: string;
  }) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.post(API_ENDPOINTS.settings.integrations, data),
      'Integration created successfully',
      'Failed to create integration'
    );
  },

  updateIntegration: async (id: string, data: Record<string, any>) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.put(`${API_ENDPOINTS.settings.integrations}/${id}`, data),
      'Integration updated successfully',
      'Failed to update integration'
    );
  },

  deleteIntegration: async (id: string) => {
    return ApiService.executeWithErrorHandling(
      () => apiClient.delete(`${API_ENDPOINTS.settings.integrations}/${id}`),
      'Integration deleted successfully',
      'Failed to delete integration'
    );
  },
};
