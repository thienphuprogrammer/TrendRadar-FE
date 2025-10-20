import { 
  ThreadResponse, 
  CreateThreadInput, 
  CreateThreadResponseInput,
  CreateSqlPairInput,
  CreateViewInput,
  AdjustThreadResponseInput,
  AdjustThreadResponseChartInput
} from '@/apollo/client/graphql/__types__';

// Mock data for development
const mockThreads: Record<number, { id: number; summary?: string; responses: ThreadResponse[] }> = {};
let nextThreadId = 1;
let nextResponseId = 1;

export class MockChatService {
  // Thread operations
  async createThread(data: CreateThreadInput) {
    const threadId = nextThreadId++;
    const thread = {
      id: threadId,
      summary: data.summary || `Thread ${threadId}`,
      responses: []
    };
    mockThreads[threadId] = thread;
    return { id: threadId };
  }

  async getThread(threadId: number) {
    return mockThreads[threadId] || null;
  }

  async getThreads() {
    return Object.values(mockThreads);
  }

  // Thread response operations
  async createThreadResponse(threadId: number, data: CreateThreadResponseInput) {
    const responseId = nextResponseId++;
    const response: ThreadResponse = {
      id: responseId,
      threadId,
      question: data.question,
      sql: data.sql,
      view: data.viewId ? {
        id: data.viewId,
        name: `View ${data.viewId}`,
        statement: 'SELECT * FROM table',
        displayName: `View ${data.viewId}`
      } : undefined,
      breakdownDetail: {
        queryId: `query_${responseId}`,
        status: 'COMPLETED',
        description: 'Analysis completed successfully',
        steps: [
          {
            summary: 'Data extraction',
            sql: data.sql || 'SELECT * FROM data',
            cteName: 'extracted_data'
          }
        ]
      },
      answerDetail: {
        queryId: `answer_${responseId}`,
        status: 'COMPLETED',
        content: this.generateMockAnswer(data.question),
        numRowsUsedInLLM: 150
      },
      chartDetail: this.shouldIncludeChart(data.question) ? {
        queryId: `chart_${responseId}`,
        status: 'COMPLETED',
        description: 'Chart generated successfully',
        chartType: 'line',
        chartSchema: this.generateMockChartSchema()
      } : undefined,
      askingTask: {
        status: 'COMPLETED',
        type: 'QUESTION_ANSWERING',
        candidates: [],
        rephrasedQuestion: data.question,
        intentReasoning: 'User wants to analyze data trends',
        sqlGenerationReasoning: 'Generated SQL to extract relevant data',
        retrievedTables: ['analytics_data', 'user_metrics'],
        queryId: `task_${responseId}`
      }
    };

    if (mockThreads[threadId]) {
      mockThreads[threadId].responses.push(response);
    }

    return response;
  }

  async updateThreadResponse(responseId: number, data: { sql?: string }) {
    // Find and update the response
    for (const thread of Object.values(mockThreads)) {
      const response = thread.responses.find(r => r.id === responseId);
      if (response) {
        if (data.sql) {
          response.sql = data.sql;
        }
        return response;
      }
    }
    throw new Error('Response not found');
  }

  async adjustThreadResponse(responseId: number, data: AdjustThreadResponseInput) {
    // Find and update the response
    for (const thread of Object.values(mockThreads)) {
      const response = thread.responses.find(r => r.id === responseId);
      if (response) {
        if (data.type === 'sql' && data.data.sql) {
          response.sql = data.data.sql;
        }
        if (data.type === 'reasoning' && data.data.sqlGenerationReasoning) {
          if (response.askingTask) {
            response.askingTask.sqlGenerationReasoning = data.data.sqlGenerationReasoning;
          }
        }
        return response;
      }
    }
    throw new Error('Response not found');
  }

  async adjustThreadResponseChart(responseId: number, data: AdjustThreadResponseChartInput) {
    // Find and update the response
    for (const thread of Object.values(mockThreads)) {
      const response = thread.responses.find(r => r.id === responseId);
      if (response && response.chartDetail) {
        if (data.chartType) {
          response.chartDetail.chartType = data.chartType;
        }
        if (data.chartSchema) {
          response.chartDetail.chartSchema = data.chartSchema;
        }
        return response;
      }
    }
    throw new Error('Response not found');
  }

  // SQL Pair operations
  async createSqlPair(data: CreateSqlPairInput) {
    const sqlPair = {
      id: Math.floor(Math.random() * 1000),
      projectId: 1,
      sql: data.sql,
      question: data.question,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return sqlPair;
  }

  async getSqlPairs() {
    return [
      {
        id: 1,
        projectId: 1,
        sql: 'SELECT * FROM users WHERE created_at > NOW() - INTERVAL 7 DAY',
        question: 'Show me recent users',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // View operations
  async createView(data: CreateViewInput) {
    const view = {
      id: Math.floor(Math.random() * 1000),
      name: data.name,
      statement: data.statement
    };
    return view;
  }

  async validateView(data: { name: string }) {
    // Mock validation - always valid for demo
    return {
      valid: true,
      message: 'View name is available'
    };
  }

  // Helper methods
  private generateMockAnswer(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('revenue')) {
      return `**Revenue Analysis Results:**\n\nYour revenue shows strong performance with **$34,600** total this week, representing a **+12.5% growth** compared to last week. Friday was the peak day at **$6,100**.\n\n**Key Insights:**\n• Best performing day: Friday\n• Growth trend: Accelerating\n• Conversion rate: 3.2% (↑0.4%)\n\n*The chart below shows detailed performance metrics.*`;
    }
    
    if (lowerQuestion.includes('trending')) {
      return `**Current Trending Analysis:**\n\n#SustainableFashion is leading with **+245% growth** this week, driven by increased eco-consciousness. #TechGadgets2024 follows at **+189%** with strong TikTok engagement.\n\n**Key Insights:**\n• Peak engagement: 2-4 PM daily\n• Best platforms: TikTok, Instagram\n• Audience: 18-34 demographics\n\n*The chart below shows detailed performance metrics.*`;
    }
    
    if (lowerQuestion.includes('engagement')) {
      return `**Engagement Analysis:**\n\nSustainable fashion content leads with **8.4% average engagement**, significantly above industry standard (5.2%). Video content performs **3x better** than static posts.\n\n**Top Performers:**\n• #SustainableFashion: 8.4% engagement\n• #TechGadgets: 6.2% engagement\n• #Fitness: 7.1% engagement\n\n**Recommendation:** Focus on video content during 2-4 PM peak hours.`;
    }
    
    return `**Analysis Complete:**\n\nI've processed your query and found relevant insights across your data sources. The metrics show positive trends with opportunities for optimization.\n\n**Quick Summary:**\n• Data sources: 5 platforms analyzed\n• Time range: Last 7 days\n• Confidence level: 94%\n\nWould you like me to dive deeper into any specific area?`;
  }

  private shouldIncludeChart(question: string): boolean {
    const chartKeywords = ['revenue', 'trend', 'performance', 'comparison', 'show me', 'analyze', 'chart'];
    return chartKeywords.some(keyword => question.toLowerCase().includes(keyword));
  }

  private generateMockChartSchema() {
    return {
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
      title: 'Revenue Trend (Last 7 Days)'
    };
  }

  // Polling simulation
  async pollThreadResponse(responseId: number) {
    // Simulate polling by returning the same response
    for (const thread of Object.values(mockThreads)) {
      const response = thread.responses.find(r => r.id === responseId);
      if (response) {
        return response;
      }
    }
    return null;
  }

  // Recommended questions
  async getRecommendedQuestions(threadId: number) {
    return {
      status: 'COMPLETED',
      questions: [
        {
          question: 'Show me detailed breakdown',
          category: 'analysis',
          sql: 'SELECT * FROM detailed_metrics'
        },
        {
          question: 'Compare with last month',
          category: 'comparison',
          sql: 'SELECT * FROM monthly_comparison'
        },
        {
          question: 'What\'s driving this trend?',
          category: 'insights',
          sql: 'SELECT * FROM trend_analysis'
        }
      ]
    };
  }
}

export const mockChatService = new MockChatService();
