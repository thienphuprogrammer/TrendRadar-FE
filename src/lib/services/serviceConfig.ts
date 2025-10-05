/**
 * Service Configuration
 * Centralized configuration for all microservices
 */

export interface ServiceConfig {
  name: string;
  url: string;
  port: number;
  healthEndpoint: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  lastChecked?: Date;
}

export interface ServiceEndpoints {
  apiGateway: ServiceConfig;
  authService: ServiceConfig;
  wrenAIService: ServiceConfig;
  chatbotService: ServiceConfig;
  trendService: ServiceConfig;
  dataPipelineService: ServiceConfig;
  exportService: ServiceConfig;
  notificationService: ServiceConfig;
  postgres: ServiceConfig;
  redis: ServiceConfig;
  qdrant: ServiceConfig;
  wrenEngine: ServiceConfig;
  wrenUI: ServiceConfig;
}

// Default service configuration based on docker-compose.dev.yml
export const defaultServiceConfig: ServiceEndpoints = {
  apiGateway: {
    name: 'API Gateway',
    url: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000',
    port: parseInt(process.env.NEXT_PUBLIC_API_GATEWAY_PORT || '8000'),
    healthEndpoint: '/health',
    description: 'Main API gateway for routing requests',
    status: 'inactive',
  },
  
  authService: {
    name: 'Auth Service',
    url: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8001',
    port: parseInt(process.env.NEXT_PUBLIC_AUTH_SERVICE_PORT || '8001'),
    healthEndpoint: '/health',
    description: 'Authentication and user management',
    status: 'inactive',
  },
  
  wrenAIService: {
    name: 'Wren AI Service',
    url: process.env.NEXT_PUBLIC_WREN_AI_SERVICE_URL || 'http://localhost:8007',
    port: parseInt(process.env.NEXT_PUBLIC_WREN_AI_SERVICE_PORT || '8007'),
    healthEndpoint: '/health',
    description: 'AI-powered data analysis and natural language queries',
    status: 'inactive',
  },
  
  chatbotService: {
    name: 'Chatbot Service',
    url: process.env.NEXT_PUBLIC_CHATBOT_SERVICE_URL || 'http://localhost:8002',
    port: parseInt(process.env.NEXT_PUBLIC_CHATBOT_SERVICE_PORT || '8002'),
    healthEndpoint: '/health',
    description: 'Chatbot and conversational AI',
    status: 'inactive',
  },
  
  trendService: {
    name: 'Trend Service',
    url: process.env.NEXT_PUBLIC_TREND_SERVICE_URL || 'http://localhost:8003',
    port: parseInt(process.env.NEXT_PUBLIC_TREND_SERVICE_PORT || '8003'),
    healthEndpoint: '/health',
    description: 'Trend analysis and monitoring',
    status: 'inactive',
  },
  
  dataPipelineService: {
    name: 'Data Pipeline Service',
    url: process.env.NEXT_PUBLIC_DATA_PIPELINE_SERVICE_URL || 'http://localhost:8004',
    port: parseInt(process.env.NEXT_PUBLIC_DATA_PIPELINE_SERVICE_PORT || '8004'),
    healthEndpoint: '/health',
    description: 'Data processing and ETL pipelines',
    status: 'inactive',
  },
  
  exportService: {
    name: 'Export Service',
    url: process.env.NEXT_PUBLIC_EXPORT_SERVICE_URL || 'http://localhost:8005',
    port: parseInt(process.env.NEXT_PUBLIC_EXPORT_SERVICE_PORT || '8005'),
    healthEndpoint: '/health',
    description: 'Data export and reporting',
    status: 'inactive',
  },
  
  notificationService: {
    name: 'Notification Service',
    url: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 'http://localhost:8006',
    port: parseInt(process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_PORT || '8006'),
    healthEndpoint: '/health',
    description: 'Notifications and alerts',
    status: 'inactive',
  },
  
  postgres: {
    name: 'PostgreSQL',
    url: process.env.NEXT_PUBLIC_POSTGRES_URL || 'http://localhost:5432',
    port: parseInt(process.env.NEXT_PUBLIC_POSTGRES_PORT || '5432'),
    healthEndpoint: '/health',
    description: 'Primary database',
    status: 'inactive',
  },
  
  redis: {
    name: 'Redis',
    url: process.env.NEXT_PUBLIC_REDIS_URL || 'http://localhost:6379',
    port: parseInt(process.env.NEXT_PUBLIC_REDIS_PORT || '6379'),
    healthEndpoint: '/health',
    description: 'Caching and session storage',
    status: 'inactive',
  },
  
  qdrant: {
    name: 'Qdrant',
    url: process.env.NEXT_PUBLIC_QDRANT_URL || 'http://localhost:6333',
    port: parseInt(process.env.NEXT_PUBLIC_QDRANT_PORT || '6333'),
    healthEndpoint: '/health',
    description: 'Vector database for AI embeddings',
    status: 'inactive',
  },
  
  wrenEngine: {
    name: 'Wren Engine',
    url: process.env.NEXT_PUBLIC_WREN_ENGINE_URL || 'http://localhost:7432',
    port: parseInt(process.env.NEXT_PUBLIC_WREN_ENGINE_PORT || '7432'),
    healthEndpoint: '/health',
    description: 'Data modeling and query engine',
    status: 'inactive',
  },
  
  wrenUI: {
    name: 'Wren UI',
    url: process.env.NEXT_PUBLIC_WREN_UI_URL || 'http://localhost:3001',
    port: parseInt(process.env.NEXT_PUBLIC_WREN_UI_PORT || '3001'),
    healthEndpoint: '/health',
    description: 'Wren AI user interface',
    status: 'inactive',
  },
};

// Service health check function
export async function checkServiceHealth(service: ServiceConfig): Promise<ServiceConfig> {
  try {
    const response = await fetch(`${service.url}${service.healthEndpoint}`, {
      method: 'GET',
      timeout: 5000,
    } as any);

    return {
      ...service,
      status: response.ok ? 'active' : 'error',
      lastChecked: new Date(),
    };
  } catch (error) {
    return {
      ...service,
      status: 'error',
      lastChecked: new Date(),
    };
  }
}

// Check all services health
export async function checkAllServicesHealth(): Promise<ServiceEndpoints> {
  const services = Object.keys(defaultServiceConfig) as Array<keyof ServiceEndpoints>;
  const healthChecks = await Promise.allSettled(
    services.map(async (serviceKey) => {
      const service = defaultServiceConfig[serviceKey];
      const healthCheck = await checkServiceHealth(service);
      return { serviceKey, healthCheck };
    })
  );

  const updatedConfig = { ...defaultServiceConfig };

  healthChecks.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { serviceKey, healthCheck } = result.value;
      updatedConfig[serviceKey] = healthCheck;
    }
  });

  return updatedConfig;
}

// Get service by name
export function getServiceByName(name: string): ServiceConfig | undefined {
  const services = Object.values(defaultServiceConfig);
  return services.find(service => service.name === name);
}

// Get active services
export function getActiveServices(config: ServiceEndpoints): ServiceConfig[] {
  return Object.values(config).filter(service => service.status === 'active');
}

// Get inactive services
export function getInactiveServices(config: ServiceEndpoints): ServiceConfig[] {
  return Object.values(config).filter(service => service.status === 'inactive');
}

// Get error services
export function getErrorServices(config: ServiceEndpoints): ServiceConfig[] {
  return Object.values(config).filter(service => service.status === 'error');
}

// Service status summary
export function getServiceStatusSummary(config: ServiceEndpoints) {
  const services = Object.values(config);
  const active = services.filter(s => s.status === 'active').length;
  const inactive = services.filter(s => s.status === 'inactive').length;
  const error = services.filter(s => s.status === 'error').length;
  const total = services.length;

  return {
    total,
    active,
    inactive,
    error,
    healthPercentage: Math.round((active / total) * 100),
  };
}

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...defaultServiceConfig,
        // Override with production URLs
        apiGateway: {
          ...defaultServiceConfig.apiGateway,
          url: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'https://api.trendradar.com',
        },
      };
    
    case 'test':
      return {
        ...defaultServiceConfig,
        // Override with staging URLs
        apiGateway: {
          ...defaultServiceConfig.apiGateway,
          url: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'https://staging-api.trendradar.com',
        },
      };
    
    default:
      return defaultServiceConfig;
  }
};

export default defaultServiceConfig;
