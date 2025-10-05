import { wrenAIService } from './wrenAIService';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string; // Always required, never undefined
  timestamp: Date;
  chart?: {
    type: 'line' | 'bar' | 'pie';
    data: any;
    title: string;
  };
  deepDiveLink?: string;
  streaming?: boolean;
  suggestions?: string[];
  workflowId?: string;
  intent?: string;
  executionTime?: number;
  success?: boolean;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  context?: Record<string, any>;
  enable_evaluation?: boolean;
  enable_chart_generation?: boolean;
  enable_insights?: boolean;
  language?: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  workflow_id: string;
  intent: string;
  execution_time: number;
  metadata: {
    session_id: string;
    timestamp: string;
  };
  suggestions?: string[];
  chart?: {
    type: string;
    data: any;
    title: string;
  };
}

export interface SessionHistory {
  session_id: string;
  history: ChatMessage[];
}

export interface SuggestionsResponse {
  suggestions: string[];
}

export class ChatbotService {
  private static instance: ChatbotService;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  public async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Ensure we have a valid token before making the request
      const hasValidToken = await this.ensureValidToken();
      if (!hasValidToken) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`${this.baseUrl}/api/v1/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  public async getSuggestions(): Promise<SuggestionsResponse> {
    try {
      // Ensure we have a valid token before making the request
      const hasValidToken = await this.ensureValidToken();
      if (!hasValidToken) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`${this.baseUrl}/api/v1/chatbot/suggestions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }

  public async getSessionHistory(sessionId: string, limit: number = 10): Promise<SessionHistory> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chatbot/sessions/${sessionId}/history?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting session history:', error);
      throw error;
    }
  }

  public async clearSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chatbot/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  }

  public async submitFeedback(workflowId: string, score: number, comment?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chatbot/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          score,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  public async getHealthStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chatbot/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting health status:', error);
      throw error;
    }
  }

  /**
   * Enhanced message sending with Wren AI integration
   */
  public async sendMessageWithWrenAI(
    message: string,
    deploymentId: string,
    options: {
      generateAnswer?: boolean;
      generateChart?: boolean;
      language?: string;
    } = {}
  ): Promise<ChatResponse> {
    try {
      // First try to use Wren AI for SQL-based questions
      // const wrenResult = await wrenAIService.askWithAnswer(
      //   message,
      //   deploymentId,
      //   {
      //     language: options.language || 'en',
      //     generateAnswer: options.generateAnswer ?? true,
      //   }
      // );

      // if (wrenResult.sql) {
      //   // Wren AI successfully generated SQL
      //   return {
      //     success: true,
      //     message: wrenResult.answer || `Generated SQL: ${wrenResult.sql}`,
      //     workflow_id: `wren-${Date.now()}`,
      //     intent: 'sql_query',
      //     execution_time: 1500,
      //     metadata: {
      //       session_id: `session-${Date.now()}`,
      //       timestamp: new Date().toISOString(),
      //     },
      //     suggestions: [
      //       'Show me the data in a chart',
      //       'Explain this query',
      //       'Generate similar questions',
      //       'Export the results'
      //     ],
      //     chart: wrenResult.chart ? {
      //       type: 'bar',
      //       data: wrenResult.chart,
      //       title: 'Query Results'
      //     } : undefined,
      //   };
      // }
    } catch (wrenError) {
      console.warn('Wren AI failed, falling back to regular chatbot:', wrenError);
    }

    // Fallback to regular chatbot service
    return await this.sendMessage({
      message,
      enable_evaluation: true,
      enable_chart_generation: options.generateChart ?? false,
      enable_insights: true,
      language: options.language || 'en',
    });
  }

  /**
   * Generate chart from SQL using Wren AI
   */
  public async generateChartFromSQL(
    question: string,
    sql: string,
    sqlData: any
  ): Promise<{ chart: any; success: boolean }> {
    try {
      // const result = await wrenAIService.generateChart({
      //   query: question,
      //   sql,
      //   sql_data: sqlData,
      //   configurations: {
      //     language: 'en',
      //   },
      // });

      // if (result.error) {
      //   throw new Error(result.error.message);
      // }

      // return {
      //   chart: result.response?.chart_schema,
      //   success: true,
      // };
      
      // Temporary fallback
      return {
        chart: null,
        success: false,
      };
    } catch (error) {
      console.error('Error generating chart:', error);
      return {
        chart: null,
        success: false,
      };
    }
  }

  /**
   * Get question recommendations using Wren AI
   */
  public async getWrenAIRecommendations(
    manifest: string,
    previousQuestions: string[] = []
  ): Promise<string[]> {
    try {
      // const result = await wrenAIService.getQuestionRecommendations({
      //   mdl: manifest,
      //   previous_questions: previousQuestions,
      //   max_questions: 5,
      //   max_categories: 3,
      //   configuration: {
      //     language: 'en',
      //   },
      // });

      // if (result.error) {
      //   throw new Error(result.error.message);
      // }

      // return result.response?.questions || [];
      
      // Temporary fallback
      return [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  private getAuthToken(): string {
    // Get token from localStorage - use the same key as authService
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  }

  private async ensureValidToken(): Promise<boolean> {
    try {
      // Import authService dynamically to avoid circular dependency
      const { authService } = await import('@/lib/services/authService');
      return await authService.ensureValidToken();
    } catch (error) {
      console.error('Error ensuring valid token:', error);
      return false;
    }
  }

  private generateResponse(question: string): {
    content: string;
    chart?: any;
    deepDiveLink?: string;
    suggestions: string[];
  } {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('trending') || lowerQuestion.includes('hashtag')) {
      return {
        content: "📈 **Current Trending Analysis:**\n\n#SustainableFashion is leading with **+245% growth** this week, driven by increased eco-consciousness. #TechGadgets2024 follows at **+189%** with strong TikTok engagement.\n\n**Key Insights:**\n• Peak engagement: 2-4 PM daily\n• Best platforms: TikTok, Instagram\n• Audience: 18-34 demographics\n\n*The chart below shows detailed performance metrics.*",
        chart: {
          type: 'line',
          data: [
            { day: 'Mon', revenue: 4200, searches: 1200 },
            { day: 'Tue', revenue: 3800, searches: 1100 },
            { day: 'Wed', revenue: 5200, searches: 1500 },
            { day: 'Thu', revenue: 4900, searches: 1400 },
            { day: 'Fri', revenue: 6100, searches: 1800 },
            { day: 'Sat', revenue: 5800, searches: 1600 },
            { day: 'Sun', revenue: 4600, searches: 1300 }
          ],
          title: "Trending Hashtags Performance"
        },
        deepDiveLink: '/trends',
        suggestions: [
          "Show me detailed breakdown",
          "Compare with last month",
          "What's driving this trend?",
          "Suggest optimization strategies"
        ]
      };
    }
    
    if (lowerQuestion.includes('revenue') || lowerQuestion.includes('sales')) {
      return {
        content: "💰 **Revenue Performance Summary:**\n\nYour revenue shows **+12.5% growth** this week with Friday being the peak day at **$6,100**. The correlation with search volume indicates strong organic demand.\n\n**Highlights:**\n• Total weekly revenue: $34,600\n• Best performing day: Friday\n• Growth trend: Accelerating\n• Conversion rate: 3.2% (↑0.4%)",
        suggestions: [
          "Show revenue by platform",
          "Analyze conversion funnel",
          "Compare with competitors",
          "Forecast next month"
        ]
      };
    }
    
    if (lowerQuestion.includes('engagement') || lowerQuestion.includes('performance')) {
      return {
        content: "🎯 **Engagement Analysis:**\n\nSustainable fashion content leads with **8.4% average engagement**, significantly above industry standard (5.2%). Video content performs **3x better** than static posts.\n\n**Top Performers:**\n• #SustainableFashion: 8.4% engagement\n• #TechGadgets: 6.2% engagement\n• #Fitness: 7.1% engagement\n\n**Recommendation:** Focus on video content during 2-4 PM peak hours.",
        suggestions: [
          "Content optimization tips",
          "Best posting times",
          "Platform comparison",
          "Audience insights"
        ]
      };
    }
    
    if (lowerQuestion.includes('competitor')) {
      return {
        content: "🏆 **Competitive Landscape:**\n\nYour market position is strong with **15% market share** in the sustainable fashion segment. BrandA leads at 23% but shows slowing growth.\n\n**Key Findings:**\n• Your engagement rate (7.3%) exceeds BrandA (6.8%)\n• Pricing advantage: 15% below market average\n• Growth rate: +15% vs industry +8%\n\n**Opportunity:** Capitalize on sustainability trend momentum.",
        suggestions: [
          "Detailed competitor analysis",
          "Pricing strategy review",
          "Market share trends",
          "Competitive advantages"
        ]
      };
    }
    
    return {
      content: "🤖 **Analysis Complete:**\n\nI've processed your query and found relevant insights across your data sources. The metrics show positive trends with opportunities for optimization.\n\n**Quick Summary:**\n• Data sources: 5 platforms analyzed\n• Time range: Last 7 days\n• Confidence level: 94%\n\nWould you like me to dive deeper into any specific area?",
      suggestions: [
        "Show me trending topics",
        "Analyze revenue performance",
        "Compare platform metrics",
        "Generate content ideas"
      ]
    };
  }
}