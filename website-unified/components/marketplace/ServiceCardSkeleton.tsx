'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface ServiceCardSkeletonProps {
  variant?: 'grid' | 'list';
  className?: string;
}

export function ServiceCardSkeleton({ variant = 'grid', className }: ServiceCardSkeletonProps) {
  if (variant === 'list') {
    return (
      <div
        className={cn(
          'flex animate-pulse items-center gap-6 rounded-xl border-2 border-gray-200 bg-white p-4',
          className
        )}
      >
        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gray-200" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="flex-shrink-0 space-y-2 text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <div className="h-5 w-20 rounded bg-gray-200" />
          <div className="h-10 w-28 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex animate-pulse flex-col rounded-2xl border-2 border-gray-200 bg-white p-6',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="h-12 w-12 rounded-xl bg-gray-200" />
        <div className="h-6 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="mt-4 flex-1 space-y-3">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-12 rounded-full bg-gray-200" />
        <div className="h-5 w-16 rounded-full bg-gray-200" />
        <div className="h-5 w-10 rounded-full bg-gray-200" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-4 w-16 rounded bg-gray-200" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-20 rounded bg-gray-200" />
        <div className="h-10 w-20 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
