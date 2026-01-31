'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface StatusIndicatorProps {
  online: boolean;
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({ online, showLabel = false, className }: StatusIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'relative flex h-2.5 w-2.5',
        )}
      >
        {online && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2.5 w-2.5 rounded-full',
            online ? 'bg-green-500' : 'bg-gray-300'
          )}
        />
      </span>
      {showLabel && (
        <span className={cn('text-xs font-medium', online ? 'text-green-600' : 'text-gray-500')}>
          {online ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  );
}
