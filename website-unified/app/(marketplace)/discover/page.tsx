'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { useServices, useDebounce } from '@/lib/marketplace/hooks';
import { SERVICE_CATEGORIES, type DiscoveryFilters } from '@/lib/marketplace/types';
import { ServiceGrid } from '@/components/marketplace/ServiceGrid';
import { ServiceFilters } from '@/components/marketplace/ServiceFilters';

export default function DiscoverPage() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = React.useState(true);
  const [filters, setFilters] = React.useState<DiscoveryFilters>({
    sortBy: 'popularity',
  });

  const debouncedFilters = useDebounce(filters, 300);
  const { services, loading, hasMore, loadMore, refresh } = useServices(debouncedFilters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-display-sm font-bold text-gray-900 sm:text-display-md">
          Discover AI Services
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Browse 1,200+ AI services from verified providers. Pay with crypto, subscribe with x402.
        </p>
      </div>

      {/* Quick Categories */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilters((f) => ({ ...f, category: undefined }))}
            className={cn(
              'flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              !filters.category
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            All
          </button>
          {SERVICE_CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, category: cat.value }))}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                filters.category === cat.value
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-medium transition-colors',
              showFilters ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-black'
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>
          <span className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${services.length} services`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-xl border-2 border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-lg p-2 transition-colors',
                viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              )}
              aria-label="Grid view"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-lg p-2 transition-colors',
                viewMode === 'list' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              )}
              aria-label="List view"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="rounded-xl border-2 border-gray-200 p-2 text-gray-500 transition-colors hover:border-black hover:text-black"
            aria-label="Refresh"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        {showFilters && (
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border-2 border-gray-200 bg-white p-6">
              <ServiceFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>
        )}

        {/* Services Grid */}
        <div className="flex-1">
          <ServiceGrid
            services={services}
            loading={loading}
            viewMode={viewMode}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </div>
      </div>
    </div>
  );
}
