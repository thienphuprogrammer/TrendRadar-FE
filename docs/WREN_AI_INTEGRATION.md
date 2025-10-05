# Wren AI Integration Guide

## Tổng quan

Tài liệu này mô tả cách tích hợp Wren AI vào TrendRadar frontend, bao gồm các page mới và service integration.

## Cấu trúc Pages

### 1. Wren AI Chat (`/wren-ai`)
- **File**: `app/wren-ai/page.tsx`
- **Mô tả**: Giao diện chat với Wren AI để hỏi đáp về dữ liệu
- **Tính năng**:
  - Chat interface với AI assistant
  - Quản lý conversation threads
  - Hiển thị SQL queries được generate
  - Export chat history
  - Sample questions

### 2. Data Modeling (`/data-modeling`)
- **File**: `app/data-modeling/page.tsx`
- **Mô tả**: Quản lý data models, relationships và calculated fields
- **Tính năng**:
  - Tạo và quản lý data models
  - Thiết lập relationships giữa các models
  - Tạo calculated fields
  - Deploy models lên Wren AI service
  - Visual diagram của data model

### 3. Data Setup (`/data-setup`)
- **File**: `app/data-setup/page.tsx`
- **Mô tả**: Setup và kết nối data sources
- **Tính năng**:
  - Kết nối database (PostgreSQL, MySQL, SQLite, BigQuery, Snowflake)
  - Test connection
  - Chọn tables để import
  - Progress tracking

### 4. Wren AI Demo (`/wren-ai-demo`)
- **File**: `app/wren-ai-demo/page.tsx`
- **Mô tả**: Demo và test Wren AI integration
- **Tính năng**:
  - Service health monitoring
  - Test connections
  - Quick actions
  - Status overview

## Service Integration

### 1. Wren AI Service (`lib/services/wrenAIService.ts`)
- **Mô tả**: Service để giao tiếp với Wren AI Service
- **Endpoints**:
  - `/api/v1/chat` - Chat với AI
  - `/api/v1/threads` - Quản lý conversation threads
  - `/api/v1/models` - Quản lý data models
  - `/api/v1/relationships` - Quản lý relationships
  - `/api/v1/calculated-fields` - Quản lý calculated fields
  - `/api/v1/deploy` - Deploy models

### 2. API Service (`lib/services/apiService.ts`)
- **Mô tả**: Service chính để giao tiếp với TrendRadar microservices
- **Endpoints**:
  - `/auth/*` - Authentication
  - `/users/*` - User management
  - `/trends/*` - Trend data
  - `/chatbot/*` - Chatbot functionality
  - `/data-pipeline/*` - Data pipeline
  - `/export/*` - Export functionality
  - `/notifications/*` - Notifications

### 3. Service Configuration (`lib/services/serviceConfig.ts`)
- **Mô tả**: Cấu hình và health check cho tất cả services
- **Tính năng**:
  - Service discovery
  - Health monitoring
  - Environment-specific configuration
  - Status tracking

## Custom Hooks

### 1. useWrenAI (`hooks/useWrenAI.ts`)
- **Mô tả**: Hook chính để quản lý Wren AI state và actions
- **State**:
  - Connection status
  - Chat messages và threads
  - Data models, relationships, calculated fields
  - Deployment status
- **Actions**:
  - Send messages
  - Manage threads
  - CRUD operations cho models
  - Deploy models

## Environment Configuration

### Environment Variables
Tạo file `.env.local` từ `env.example`:

```bash
# Copy environment template
cp env.example .env.local
```

### Các biến quan trọng:
- `NEXT_PUBLIC_WREN_AI_SERVICE_URL`: URL của Wren AI Service
- `NEXT_PUBLIC_API_URL`: URL của API Gateway
- `NEXT_PUBLIC_ENABLE_WREN_AI`: Enable/disable Wren AI features

## Cách sử dụng

### 1. Khởi động Services
```bash
# Khởi động tất cả services
cd ops
docker-compose -f docker-compose.dev.yml up -d

# Kiểm tra status
docker-compose -f docker-compose.dev.yml ps
```

### 2. Khởi động Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test Integration
1. Truy cập `/wren-ai-demo` để kiểm tra service health
2. Test connection với Wren AI service
3. Thử các tính năng chat và data modeling

## API Endpoints

### Wren AI Service (Port 5556)
- `GET /health` - Health check
- `POST /api/v1/chat` - Send chat message
- `GET /api/v1/threads` - Get conversation threads
- `POST /api/v1/threads` - Create new thread
- `GET /api/v1/models` - Get data models
- `POST /api/v1/models` - Create data model
- `POST /api/v1/deploy` - Deploy models

### API Gateway (Port 8000)
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `GET /trends` - Get trend data
- `POST /chatbot/message` - Send chatbot message
- `GET /data-pipeline/sources` - Get data sources

## Troubleshooting

### 1. Connection Issues
- Kiểm tra service health tại `/wren-ai-demo`
- Verify environment variables
- Check docker-compose logs

### 2. CORS Issues
- Đảm bảo API Gateway có CORS configuration
- Check service URLs trong environment

### 3. Authentication Issues
- Verify JWT token trong localStorage
- Check auth service status

## Development Notes

### 1. Mock Data
- Các page sử dụng mock data để demo
- Thay thế bằng real API calls khi services ready

### 2. Error Handling
- Tất cả API calls có error handling
- Toast notifications cho user feedback

### 3. TypeScript
- Full TypeScript support
- Type definitions cho tất cả interfaces

## Next Steps

1. **Real API Integration**: Thay thế mock data bằng real API calls
2. **Authentication**: Implement proper auth flow
3. **Real-time Updates**: WebSocket cho real-time chat
4. **Advanced Features**: 
   - Data visualization
   - Advanced query builder
   - Model versioning
   - Collaboration features

## Resources

- [Wren AI Documentation](https://github.com/Canner/WrenAI)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
