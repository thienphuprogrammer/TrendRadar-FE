import React from 'react';
import { Logo } from '@/components/common/display/Logo';

export function LogoBar() {
  return (
    <div className="flex items-center space-x-2">
      <Logo size={24} color="currentColor" />
      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        TrendRadar
      </span>
    </div>
  );
}
