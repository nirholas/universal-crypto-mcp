'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import type { MarketplaceService } from '@/lib/marketplace/types';
import { ServiceCard } from './ServiceCard';
import { ServiceCardSkeleton } from './ServiceCardSkeleton';

interface ServiceGridProps {
  services: MarketplaceService[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export function ServiceGrid({
  services,
  loading = false,
  viewMode = 'grid',
  onLoadMore,
  hasMore = false,
  className,
}: ServiceGridProps) {
  const observerRef = React.useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  React.useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading]);

  if (!loading && services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900">No services found</h3>
        <p className="mt-2 text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-4'
        )}
      >
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} variant={viewMode} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={`skeleton-${i}`} variant={viewMode} />
          ))}
      </div>

      {/* Load more trigger */}
      {hasMore && <div ref={observerRef} className="h-20" />}

      {/* Load more button (fallback) */}
      {hasMore && !loading && onLoadMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-xl border-2 border-gray-200 px-8 py-3 font-medium text-gray-700 transition-colors hover:border-black"
          >
            Load More Services
          </button>
        </div>
      )}
    </div>
  );
}
