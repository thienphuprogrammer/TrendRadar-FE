/**
 * Wren AI Service Integration
 * Handles communication with Wren AI Service endpoints
 */

export interface WrenAIResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    sql?: string;
    chart?: any;
    data?: any[];
    threadId?: string;
  };
}

export interface Thread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataModel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  tableType: 'source' | 'view' | 'calculated';
  columns: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  status: 'active' | 'draft' | 'error';
  lastUpdated: string;
}

export interface Relationship {
  id: string;
  fromModel: string;
  fromColumn: string;
  toModel: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  status: 'active' | 'draft' | 'error';
}

export interface CalculatedField {
  id: string;
  name: string;
  model: string;
  expression: string;
  type: string;
  description: string;
}

class WrenAIService {
  private baseURL: string;
  private apiKey?: string;

  constructor() {
    // Get base URL from environment or use default
    this.baseURL = process.env.NEXT_PUBLIC_WREN_AI_SERVICE_URL || 'http://localhost:5556';
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WrenAIResponse> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Wren AI Service request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Chat/Conversation Methods
  async sendMessage(message: string, threadId?: string): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        threadId,
      }),
    });
  }

  async getThreads(): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/threads');
  }

  async getThread(threadId: string): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/threads/${threadId}`);
  }

  async createThread(title: string): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/threads', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async deleteThread(threadId: string): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/threads/${threadId}`, {
      method: 'DELETE',
    });
  }

  // Data Model Methods
  async getModels(): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/models');
  }

  async getModel(modelId: string): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/models/${modelId}`);
  }

  async createModel(modelData: Partial<DataModel>): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/models', {
      method: 'POST',
      body: JSON.stringify(modelData),
    });
  }

  async updateModel(modelId: string, modelData: Partial<DataModel>): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/models/${modelId}`, {
      method: 'PUT',
      body: JSON.stringify(modelData),
    });
  }

  async deleteModel(modelId: string): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/models/${modelId}`, {
      method: 'DELETE',
    });
  }

  // Relationship Methods
  async getRelationships(): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/relationships');
  }

  async createRelationship(relationshipData: Partial<Relationship>): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/relationships', {
      method: 'POST',
      body: JSON.stringify(relationshipData),
    });
  }

  async updateRelationship(relationshipId: string, relationshipData: Partial<Relationship>): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/relationships/${relationshipId}`, {
      method: 'PUT',
      body: JSON.stringify(relationshipData),
    });
  }

  async deleteRelationship(relationshipId: string): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/relationships/${relationshipId}`, {
      method: 'DELETE',
    });
  }

  // Calculated Field Methods
  async getCalculatedFields(): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/calculated-fields');
  }

  async createCalculatedField(fieldData: Partial<CalculatedField>): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/calculated-fields', {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  }

  async updateCalculatedField(fieldId: string, fieldData: Partial<CalculatedField>): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/calculated-fields/${fieldId}`, {
      method: 'PUT',
      body: JSON.stringify(fieldData),
    });
  }

  async deleteCalculatedField(fieldId: string): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/calculated-fields/${fieldId}`, {
      method: 'DELETE',
    });
  }

  // Data Source Methods
  async getDataSources(): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/data-sources');
  }

  async testConnection(connectionConfig: any): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/data-sources/test', {
      method: 'POST',
      body: JSON.stringify(connectionConfig),
    });
  }

  async createDataSource(dataSourceConfig: any): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/data-sources', {
      method: 'POST',
      body: JSON.stringify(dataSourceConfig),
    });
  }

  async getDataSourceTables(dataSourceId: string): Promise<WrenAIResponse> {
    return this.makeRequest(`/api/v1/data-sources/${dataSourceId}/tables`);
  }

  // Deployment Methods
  async deployModel(): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/deploy', {
      method: 'POST',
    });
  }

  async getDeployStatus(): Promise<WrenAIResponse> {
    return this.makeRequest('/api/v1/deploy/status');
  }

  // Health Check
  async healthCheck(): Promise<WrenAIResponse> {
    return this.makeRequest('/health');
  }

  // Utility Methods
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

// Export singleton instance
export const wrenAIService = new WrenAIService();
export default wrenAIService;