/**
 * API Service Integration
 * Handles communication with TrendRadar microservices
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrendData {
  id: string;
  hashtag: string;
  growth: string;
  posts: string;
  source: string;
  engagement: string;
  velocity: string;
  category: string;
  timestamp: string;
}

export interface ChatbotMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: any;
}

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    // Get base URL from environment or use default
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Load auth token from localStorage
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('auth_token');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
          status: response.status,
        };
      }

      return { success: true, data, status: response.status };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Authentication Methods
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setAuthToken(response.data.access_token);
    }

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.setAuthToken(response.data.access_token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest('/auth/logout', {
      method: 'POST',
    });

    this.clearAuthToken();
    return response;
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }

    const response = await this.makeRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.success && response.data) {
      this.setAuthToken(response.data.access_token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/auth/me');
  }

  // User Management
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.makeRequest<User[]>('/users');
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${userId}`);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    return this.makeRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Trends
  async getTrends(params?: {
    category?: string;
    source?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<TrendData[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/trends${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<TrendData[]>(endpoint);
  }

  async getTrend(trendId: string): Promise<ApiResponse<TrendData>> {
    return this.makeRequest<TrendData>(`/trends/${trendId}`);
  }

  async createTrend(trendData: Partial<TrendData>): Promise<ApiResponse<TrendData>> {
    return this.makeRequest<TrendData>('/trends', {
      method: 'POST',
      body: JSON.stringify(trendData),
    });
  }

  async updateTrend(trendId: string, trendData: Partial<TrendData>): Promise<ApiResponse<TrendData>> {
    return this.makeRequest<TrendData>(`/trends/${trendId}`, {
      method: 'PUT',
      body: JSON.stringify(trendData),
    });
  }

  async deleteTrend(trendId: string): Promise<ApiResponse> {
    return this.makeRequest(`/trends/${trendId}`, {
      method: 'DELETE',
    });
  }

  // Chatbot
  async sendChatMessage(message: string, sessionId?: string): Promise<ApiResponse<ChatbotMessage>> {
    return this.makeRequest<ChatbotMessage>('/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message, session_id: sessionId }),
    });
  }

  async getChatHistory(sessionId: string): Promise<ApiResponse<ChatbotMessage[]>> {
    return this.makeRequest<ChatbotMessage[]>(`/chatbot/sessions/${sessionId}/messages`);
  }

  async createChatSession(): Promise<ApiResponse<{ session_id: string }>> {
    return this.makeRequest<{ session_id: string }>('/chatbot/sessions', {
      method: 'POST',
    });
  }

  async deleteChatSession(sessionId: string): Promise<ApiResponse> {
    return this.makeRequest(`/chatbot/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Data Pipeline
  async getDataSources(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/data-pipeline/sources');
  }

  async createDataSource(sourceData: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/data-pipeline/sources', {
      method: 'POST',
      body: JSON.stringify(sourceData),
    });
  }

  async testDataSourceConnection(sourceData: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/data-pipeline/sources/test', {
      method: 'POST',
      body: JSON.stringify(sourceData),
    });
  }

  async runDataPipeline(pipelineId: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/data-pipeline/pipelines/${pipelineId}/run`, {
      method: 'POST',
    });
  }

  async getPipelineStatus(pipelineId: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/data-pipeline/pipelines/${pipelineId}/status`);
  }

  // Export Service
  async exportData(format: 'pdf' | 'excel' | 'csv', data: any): Promise<ApiResponse<{ download_url: string }>> {
    return this.makeRequest<{ download_url: string }>('/export', {
      method: 'POST',
      body: JSON.stringify({ format, data }),
    });
  }

  async getExportHistory(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/export/history');
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse> {
    return this.makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async createNotification(notificationData: any): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // Utility Methods
  setAuthToken(token: string) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearAuthToken() {
    this.authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
