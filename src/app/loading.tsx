/**
 * Global Loading State
 * Displayed while the application is loading
 */

import { LoadingSpinner } from '@/components/common/feedback';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

