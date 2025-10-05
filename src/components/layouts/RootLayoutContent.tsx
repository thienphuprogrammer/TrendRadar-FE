"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/hooks/use-theme-store";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import { Sidebar } from "@/components/layouts/Sidebar";
import { HeaderBar } from "@/components/layouts/HeaderBar";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { fontSize, reducedMotion } = useThemeStore();
  const pathname = usePathname();
  
  // Check if current route is an auth route (route groups like (auth) are not in the URL)
  const authPaths = new Set(['/login', '/register', '/forgot-password', '/reset-password']);
  const isAuthRoute = pathname ? authPaths.has(pathname) : false;

  return (
    <div
      className={cn(
        "relative min-h-screen bg-gradient-to-b from-background to-background/80",
        {
          "text-sm": fontSize === "sm",
          "text-base": fontSize === "base",
          "text-lg": fontSize === "lg",
          "text-xl": fontSize === "xl",
          "motion-reduce": reducedMotion,
        }
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none dark:opacity-[0.04]" />

      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-tr from-secondary/20 to-transparent blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {isAuthRoute ? (
          // Auth routes don't need authentication guard
          <AuthGuard requireAuth={false}>
            {children}
          </AuthGuard>
        ) : (
          // Protected routes need authentication
          <AuthGuard requireAuth={true}>
            <div className="flex flex-col h-screen bg-background">
              <HeaderBar />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <div className="p-6">{children}</div>
                </main>
              </div>
            </div>
          </AuthGuard>
        )}
      </div>
    </div>
  );
}
