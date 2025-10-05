/**
 * Thread Service
 * Business logic for thread/conversation management
 */

import { apiClient } from '@/lib/api/unified-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    role: 'user' | 'assistant';
  };
  messagesCount?: number;
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface CreateThreadInput {
  title?: string;
  initialMessage?: string;
}

export interface UpdateThreadInput {
  title?: string;
}

export interface CreateMessageInput {
  content: string;
  metadata?: Record<string, any>;
}

export interface ThreadsQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface ThreadsResponse {
  threads: Thread[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Thread Service Class
 */
class ThreadService {
  /**
   * Get all threads for current user
   */
  async getThreads(params?: ThreadsQueryParams): Promise<ThreadsResponse> {
    return apiClient.get<ThreadsResponse>(API_ENDPOINTS.threads.list, {
      params,
    });
  }

  /**
   * Get a single thread by ID
   */
  async getThread(id: string): Promise<Thread> {
    return apiClient.get<Thread>(API_ENDPOINTS.threads.get(id));
  }

  /**
   * Create a new thread
   */
  async createThread(data: CreateThreadInput): Promise<Thread> {
    return apiClient.post<Thread>(API_ENDPOINTS.threads.create, data);
  }

  /**
   * Update a thread
   */
  async updateThread(id: string, data: UpdateThreadInput): Promise<Thread> {
    return apiClient.patch<Thread>(API_ENDPOINTS.threads.update(id), data);
  }

  /**
   * Delete a thread
   */
  async deleteThread(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.threads.delete(id));
  }

  /**
   * Get messages for a thread
   */
  async getThreadMessages(threadId: string): Promise<ThreadMessage[]> {
    return apiClient.get<ThreadMessage[]>(
      API_ENDPOINTS.threads.responses(threadId)
    );
  }

  /**
   * Send a message to a thread
   */
  async sendMessage(
    threadId: string,
    data: CreateMessageInput
  ): Promise<ThreadMessage> {
    return apiClient.post<ThreadMessage>(
      API_ENDPOINTS.threads.responses(threadId),
      data
    );
  }

  /**
   * Get thread summary
   */
  async getThreadSummary(threadId: string): Promise<{ summary: string }> {
    return apiClient.get<{ summary: string }>(
      API_ENDPOINTS.threads.summary(threadId)
    );
  }

  /**
   * Rename a thread
   */
  async renameThread(id: string, title: string): Promise<Thread> {
    return this.updateThread(id, { title });
  }

  /**
   * Archive a thread (soft delete)
   */
  async archiveThread(id: string): Promise<void> {
    // Implement archive logic if needed
    return this.deleteThread(id);
  }
}

/**
 * Export singleton instance
 */
export const threadService = new ThreadService();

