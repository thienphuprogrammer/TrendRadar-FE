# TrendRadar Frontend

Modern Next.js 13 application for trend analysis and AI-powered insights.

## 🚀 Features

- **Next.js 13** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Shadcn UI** components
- **Apollo Client** for GraphQL
- **React Query (TanStack Query)** for data fetching and caching
- **Zustand** for state management
- **React Hook Form + Zod** for form validation
- **Error Boundaries** for robust error handling
- **Loading States** with skeleton components

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js 13 App Router
│   ├── actions/             # Server actions
│   ├── auth/                # Authentication pages
│   ├── chatbot/             # Chatbot pages
│   └── ...                  # Other feature pages
├── components/              # React components
│   ├── forms/              # Form components with validation
│   ├── ui/                 # Shadcn UI components
│   ├── ErrorBoundary.tsx   # Error boundary component
│   └── ...                 # Feature components
├── hooks/                   # Custom React hooks
│   ├── queries/            # React Query hooks
│   ├── chatbot/            # Chatbot-specific hooks
│   └── ...                 # Generic hooks
├── lib/                     # Libraries and utilities
│   ├── api/                # HTTP client and API services
│   ├── apollo/             # Apollo Client setup
│   ├── react-query/        # React Query configuration
│   ├── services/           # Business logic services
│   └── validations/        # Zod schemas
├── stores/                  # Zustand stores
│   ├── useAppStore.ts      # Global app state
│   └── useChatbotStore.ts  # Chatbot state
├── types/                   # TypeScript type definitions
├── contexts/               # React contexts
└── utils/                  # Utility functions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# or
pnpm install
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Styling

This project uses:
- **TailwindCSS** for utility-first styling
- **Shadcn UI** for pre-built, customizable components
- **CSS Variables** for theming

## 📝 Code Standards

### Folder Organization

- **Feature-based structure**: Group related components, hooks, and utils together
- **Shared components**: Place reusable components in `components/`
- **Domain-specific logic**: Keep business logic in `lib/services/`

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useUserData.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User`, `ApiResponse`)

### Import Order

```typescript
// 1. External libraries
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal modules
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';

// 3. Types
import type { User } from '@/types';

// 4. Styles (if any)
import styles from './Component.module.css';
```

## 🔧 Key Technologies

### State Management

- **Zustand**: Global app state and chatbot state
- **React Query**: Server state caching and synchronization
- **React Context**: Theme and loading contexts

### Data Fetching

- **Apollo Client**: GraphQL queries and mutations
- **React Query**: REST API calls with caching
- **Axios**: HTTP client with interceptors

### Form Handling

- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Custom Form Components**: Reusable validated form fields

### Error Handling

- **Error Boundaries**: Catch and display errors gracefully
- **Toast Notifications**: User feedback with Sonner
- **API Error Interceptors**: Centralized error handling

## 📚 Important Patterns

### Using React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query/client';
import { threadApi } from '@/lib/api/services';

export function useThreads() {
  return useQuery({
    queryKey: queryKeys.threads.lists(),
    queryFn: () => threadApi.getThreads(),
  });
}
```

### Using Zustand Store

```typescript
import { useAppStore } from '@/stores/useAppStore';

export function MyComponent() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  
  return (
    <button onClick={toggleSidebar}>
      {sidebarCollapsed ? 'Expand' : 'Collapse'}
    </button>
  );
}
```

### Form Validation with Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations/schemas';

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  // ...
}
```

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## 📦 Building

```bash
# Production build
npm run build

# Analyze bundle size
npm run analyze
```

## 🔐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
```

## 🤝 Contributing

1. Follow the code standards
2. Write meaningful commit messages
3. Add JSDoc comments for complex functions
4. Update README when adding new features

## 📄 License

[Add your license here]

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Shadcn UI](https://ui.shadcn.com/)
