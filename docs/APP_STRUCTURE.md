# App Directory Structure Guide

## Overview

The `app/` directory follows Next.js 13+ App Router conventions with professional organization and scalability in mind.

## Current Structure

```
app/
├── (auth)/              # Route group for authentication
│   └── auth/
│       ├── login/
│       ├── register/
│       └── forgot-password/
│
├── (dashboard)/         # Route group for main app
│   ├── dashboard/       # Main dashboard
│   ├── trends/          # Trend analysis
│   ├── analytics/       # Analytics views
│   ├── chatbot/         # AI Chatbot
│   ├── content/         # Content management
│   ├── data-lab/        # Data laboratory
│   ├── reports/         # Reports
│   ├── users/           # User management
│   ├── settings/        # Settings
│   ├── billing/         # Billing
│   ├── integrations/    # Integrations
│   └── notifications/   # Notifications
│
├── api/                 # API routes
│   ├── auth/
│   ├── users/
│   └── [...etc]/
│
├── _lib/                # App-specific utilities (prefix with _)
│   ├── metadata.ts
│   ├── providers.tsx
│   └── types.ts
│
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── not-found.tsx        # 404 page
├── error.tsx            # Error page
├── loading.tsx          # Loading page
└── globals.css          # Global styles
```

## Improved Structure

### 1. Route Groups

Use route groups to organize routes without affecting URL structure:

```
app/
├── (auth)/              # Authentication pages (no /auth in URL)
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── layout.tsx       # Auth-specific layout
│
├── (dashboard)/         # Protected dashboard routes
│   ├── layout.tsx       # Dashboard layout with sidebar
│   ├── page.tsx         # Dashboard home
│   ├── trends/
│   ├── analytics/
│   └── ...
│
└── (marketing)/         # Public marketing pages
    ├── page.tsx         # Landing page
    ├── about/
    ├── pricing/
    └── contact/
```

### 2. Route Structure Pattern

Each route should follow this pattern:

```
route-name/
├── page.tsx             # Page component (required)
├── layout.tsx           # Layout (optional)
├── loading.tsx          # Loading UI (optional)
├── error.tsx            # Error UI (optional)
├── not-found.tsx        # Not found UI (optional)
├── _components/         # Route-specific components
│   ├── ComponentA.tsx
│   └── ComponentB.tsx
├── _lib/                # Route-specific utilities
│   ├── actions.ts       # Server actions
│   ├── queries.ts       # Data fetching
│   └── utils.ts         # Utilities
└── [dynamic]/           # Dynamic routes
    └── page.tsx
```

### 3. File Naming Conventions

#### Special Files (Next.js conventions)
- `layout.tsx` - Layout component
- `page.tsx` - Page component
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page
- `route.ts` - API route handler
- `middleware.ts` - Middleware
- `template.tsx` - Template component

#### Private Files (prefix with `_`)
- `_components/` - Route-specific components
- `_lib/` - Route-specific utilities
- `_types.ts` - Route-specific types
- `_constants.ts` - Route-specific constants

---

## Best Practices

### 1. Layout Composition

```tsx
// app/layout.tsx - Root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// app/(dashboard)/layout.tsx - Dashboard layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  );
}
```

### 2. Metadata Management

```tsx
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'TrendRadar Hub',
    template: '%s | TrendRadar Hub',
  },
  description: 'AI-powered trend analysis platform',
  keywords: ['trends', 'analytics', 'AI'],
  authors: [{ name: 'TrendRadar Team' }],
  openGraph: {
    title: 'TrendRadar Hub',
    description: 'AI-powered trend analysis platform',
    url: 'https://trendradar.com',
    siteName: 'TrendRadar Hub',
    locale: 'en_US',
    type: 'website',
  },
};

// app/trends/page.tsx
export const metadata: Metadata = {
  title: 'Trends',
  description: 'Discover trending topics and insights',
};
```

### 3. Server vs Client Components

```tsx
// ✅ Server Component (default)
export default async function Page() {
  const data = await fetchData(); // Fetch on server
  return <Display data={data} />;
}

// ✅ Client Component (use 'use client')
'use client';
export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

### 4. Data Fetching

```tsx
// Server Component - Direct fetch
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store', // or 'force-cache'
  }).then(res => res.json());
  
  return <div>{data.title}</div>;
}

// Client Component - Use React Query
'use client';
export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });
  
  if (isLoading) return <LoadingSpinner />;
  return <div>{data.title}</div>;
}
```

### 5. Loading States

```tsx
// app/trends/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
```

### 6. Error Handling

```tsx
// app/trends/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 7. Server Actions

```tsx
// app/trends/_lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createTrend(formData: FormData) {
  const title = formData.get('title');
  
  // Validate and process data
  // ...
  
  // Revalidate the trends page
  revalidatePath('/trends');
  
  return { success: true };
}

// Usage in component
'use client';
export function CreateTrendForm() {
  return (
    <form action={createTrend}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## Route Organization Examples

### 1. Dashboard Route

```
app/(dashboard)/
├── layout.tsx           # Dashboard layout with sidebar
├── page.tsx             # Dashboard home
├── _components/
│   ├── DashboardHeader.tsx
│   ├── StatsCard.tsx
│   └── RecentActivity.tsx
└── _lib/
    ├── actions.ts
    └── queries.ts
```

### 2. Trends Route

```
app/(dashboard)/trends/
├── page.tsx             # Trends list page
├── loading.tsx          # Loading state
├── error.tsx            # Error state
├── [id]/                # Dynamic trend detail
│   ├── page.tsx
│   ├── loading.tsx
│   └── edit/
│       └── page.tsx
├── _components/
│   ├── TrendCard.tsx
│   ├── TrendFilters.tsx
│   └── TrendChart.tsx
└── _lib/
    ├── actions.ts       # Server actions for trends
    ├── queries.ts       # Data fetching functions
    └── utils.ts         # Trend-specific utilities
```

### 3. Auth Route

```
app/(auth)/
├── layout.tsx           # Centered auth layout
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── forgot-password/
│   └── page.tsx
└── _components/
    ├── AuthForm.tsx
    └── SocialLogin.tsx
```

---

## API Routes

### Structure

```
app/api/
├── auth/
│   ├── login/
│   │   └── route.ts
│   ├── logout/
│   │   └── route.ts
│   └── [...nextauth]/
│       └── route.ts
├── users/
│   ├── route.ts         # GET /api/users, POST /api/users
│   └── [id]/
│       └── route.ts     # GET /api/users/:id, PATCH, DELETE
├── trends/
│   └── route.ts
└── health/
    └── route.ts
```

### API Route Example

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  
  const users = await fetchUsers(page);
  
  return NextResponse.json({
    data: users,
    meta: { page },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const user = await createUser(body);
  
  return NextResponse.json(
    { data: user },
    { status: 201 }
  );
}
```

---

## Parallel Routes

For complex layouts with multiple simultaneous views:

```
app/@modal/
app/@sidebar/
app/layout.tsx

// layout.tsx
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <>
      {sidebar}
      {children}
      {modal}
    </>
  );
}
```

---

## Intercepting Routes

For modal-like navigation:

```
app/
├── photos/
│   ├── [id]/
│   │   └── page.tsx
│   └── (..)photos/      # Intercept from same level
│       └── [id]/
│           └── page.tsx # Renders as modal
```

---

## Middleware

```tsx
// middleware.ts (root level)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
```

---

## Performance Optimization

### 1. Static Generation

```tsx
// Generate static pages at build time
export async function generateStaticParams() {
  const trends = await fetchTrends();
  
  return trends.map((trend) => ({
    id: trend.id,
  }));
}
```

### 2. Streaming

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

### 3. Partial Prerendering

```tsx
// next.config.js
module.exports = {
  experimental: {
    ppr: true,
  },
};
```

---

## Testing

### Route Testing

```tsx
// __tests__/trends/page.test.tsx
import { render, screen } from '@testing-library/react';
import Page from '@/app/trends/page';

describe('Trends Page', () => {
  it('renders trends list', async () => {
    render(await Page());
    expect(screen.getByText('Trends')).toBeInTheDocument();
  });
});
```

---

## Migration Checklist

- [ ] Organize routes into route groups
- [ ] Create consistent folder structure for each route
- [ ] Add loading.tsx to all routes
- [ ] Add error.tsx to all routes
- [ ] Move route-specific components to _components/
- [ ] Extract server actions to _lib/actions.ts
- [ ] Add proper metadata to all pages
- [ ] Implement proper error boundaries
- [ ] Add loading states
- [ ] Update imports to use new structure
- [ ] Test all routes
- [ ] Update documentation

---

## Additional Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Routing Guide](https://nextjs.org/docs/app/building-your-application/routing)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)

