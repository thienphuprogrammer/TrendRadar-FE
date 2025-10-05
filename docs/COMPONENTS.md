# Component Organization Guide

## Overview

The components folder is organized following professional standards with clear separation of concerns and optimal maintainability.

## Folder Structure

```
components/
├── common/              # Generic, reusable components
├── layout/              # Layout and navigation
├── features/            # Feature-specific components
├── shared/              # Shared business components
├── providers/           # Context providers
└── ui/                  # shadcn/ui primitives
```

## Component Categories

### 1. Common Components (`/common`)

Generic, highly reusable components without business logic.

#### Buttons (`/common/buttons`)
- `ActionButton` - Generic action button component

#### Feedback (`/common/feedback`)
- `LoadingSpinner` - Simple loading indicator
- `PageLoading` - Full-page loading state
- `ErrorBoundary` - Error boundary wrapper
- `ErrorCollapse` - Collapsible error display

#### Display (`/common/display`)
- `KPICard` - Key Performance Indicator card
- `Logo` - Application logo
- `LogoBar` - Logo with navigation bar

#### Wrappers (`/common/wrappers`)
- `EditableWrapper` - Makes content editable
- `EllipsisWrapper` - Truncates text with ellipsis

**Usage Example:**
```tsx
import { LoadingSpinner, KPICard, ActionButton } from '@/components/common';
// or
import { LoadingSpinner } from '@/components/common/feedback';
```

---

### 2. Layout Components (`/layout`)

Components that define the application structure and navigation.

- `Header` - Main application header
- `HeaderBar` - Secondary header bar
- `Sidebar` - Main navigation sidebar
- `RootLayoutContent` - Root layout wrapper
- `HomeLayout` - Home page layout
- `HomeNavigation` - Home navigation component
- `HomeSidebar` - Home-specific sidebar

**Usage Example:**
```tsx
import { Header, Sidebar, RootLayoutContent } from '@/components/layout';
```

---

### 3. Feature Components (`/features`)

Components specific to business features, organized by domain.

#### Auth (`/features/auth`)
- `AuthGuard` - Protected route wrapper
- `AuthLoading` - Authentication loading state

#### Analytics (`/features/analytics`)
Analytics dashboard components

#### Billing (`/features/billing`)
Billing and subscription components

#### Chatbot (`/features/chatbot`)
AI chatbot interface components

#### Content (`/features/content`)
Content management components

#### Data Lab (`/features/data-lab`)
Data analysis and visualization

#### Notifications (`/features/notifications`)
Notification system components

#### Trends (`/features/trends`)
Trend analysis components

#### Users (`/features/users`)
User management components

#### Wren AI (`/features/wren-ai`)
Wren AI integration components

**Usage Example:**
```tsx
import { AuthGuard } from '@/components/features/auth';
// Feature components are typically imported directly
import ChatbotInterface from '@/components/features/chatbot/ChatbotInterface';
```

---

### 4. Shared Components (`/shared`)

Reusable business logic components used across features.

#### Filters (`/shared/filters`)
- `GlobalFilterBar` - Global filter interface
- Filter utilities and components

#### Modals (`/shared/modals`)
- `ImportModal` - Data import modal
- Other modal dialogs

#### Forms (`/shared/forms`)
Reusable form components and builders

#### Tables (`/shared/tables`)
Data table components

#### Charts (`/shared/charts`)
Chart and visualization components

#### Editors (`/shared/editors`)
Text and code editor components

**Usage Example:**
```tsx
import { GlobalFilterBar, ImportModal } from '@/components/shared';
// or
import { GlobalFilterBar } from '@/components/shared/filters';
```

---

### 5. Providers (`/providers`)

React context providers and theme configuration.

- `ThemeProvider` - Theme context provider
- `ThemeToggle` - Theme switcher component

**Usage Example:**
```tsx
import { ThemeProvider, ThemeToggle } from '@/components/providers';
```

---

### 6. UI Components (`/ui`)

Primitive UI components from shadcn/ui library. Keep as is.

**Usage Example:**
```tsx
import { Button, Card, Dialog } from '@/components/ui';
```

---

## Naming Conventions

### Files and Folders
- **Components**: PascalCase - `MyComponent.tsx`
- **Folders**: kebab-case - `my-folder/`
- **Index files**: `index.ts` or `index.tsx`

### Component Structure
```tsx
// MyComponent.tsx
import { ComponentProps } from './types';

export interface MyComponentProps {
  // Props interface
}

export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Component logic
  return <div>...</div>;
}
```

### Barrel Exports
Each folder should have an `index.ts` for clean imports:

```ts
// index.ts
export { default as ComponentA } from './ComponentA';
export { default as ComponentB } from './ComponentB';
export * from './types';
```

---

## Best Practices

### 1. Component Location
Ask these questions to determine where a component belongs:

- **Is it generic and reusable?** → `/common`
- **Does it define layout/navigation?** → `/layout`
- **Is it feature-specific?** → `/features/{feature-name}`
- **Is it shared business logic?** → `/shared`
- **Is it a provider?** → `/providers`
- **Is it a primitive UI element?** → `/ui`

### 2. Import Paths
```tsx
// ✅ Good - Use barrel exports
import { LoadingSpinner, KPICard } from '@/components/common';

// ✅ Good - Direct import for specificity
import { LoadingSpinner } from '@/components/common/feedback';

// ❌ Avoid - Direct file paths bypass barrel exports
import LoadingSpinner from '@/components/common/feedback/LoadingSpinner';
```

### 3. Component Composition
```tsx
// ✅ Good - Compose from smaller components
export function Dashboard() {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainContent />
    </div>
  );
}

// ❌ Avoid - Monolithic components
export function Dashboard() {
  return (
    <div>
      {/* 500 lines of JSX */}
    </div>
  );
}
```

### 4. Props Interface
```tsx
// ✅ Good - Export interface for reusability
export interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ✅ Good - Use type for simple props
type ButtonProps = {
  label: string;
  onClick: () => void;
};
```

---

## Migration Guide

### Updating Imports

When you see old imports, update them to the new structure:

```tsx
// Old
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthGuard from '@/components/AuthGuard';

// New
import { Header } from '@/components/layout';
import { LoadingSpinner } from '@/components/common/feedback';
import { AuthGuard } from '@/components/features/auth';
```

### Find and Replace Strategy

Use your IDE to find and replace imports:

1. Search for: `from '@/components/Header'`
   Replace with: `from '@/components/layout'`

2. Search for: `from '@/components/LoadingSpinner'`
   Replace with: `from '@/components/common/feedback'`

3. Update component names if needed

---

## Component Template

Use this template for new components:

```tsx
/**
 * ComponentName
 * Brief description of what this component does
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/helpers';

export interface ComponentNameProps {
  children?: ReactNode;
  className?: string;
  // Add other props
}

export default function ComponentName({
  children,
  className,
}: ComponentNameProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
}
```

---

## Testing Components

Each component should be testable:

```tsx
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### Code Splitting
```tsx
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('@/components/features/data-lab/Analyzer'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### Memoization
```tsx
// Use memo for expensive renders
export const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // ... expensive computation
  return <div>{/* render */}</div>;
});
```

### Lazy Loading
```tsx
// Lazy load feature components
const ChatbotInterface = lazy(() => import('@/components/features/chatbot/ChatbotInterface'));
```

---

## Additional Resources

- [React Best Practices](https://react.dev/learn)
- [Next.js Component Patterns](https://nextjs.org/docs)
- [TypeScript with React](https://www.typescriptlang.org/docs/handbook/react.html)

