'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { SERVICE_CATEGORIES, type ServiceCategory, type PricingType, type DiscoveryFilters } from '@/lib/marketplace/types';

interface ServiceFiltersProps {
  filters: DiscoveryFilters;
  onFiltersChange: (filters: DiscoveryFilters) => void;
  className?: string;
}

export function ServiceFilters({ filters, onFiltersChange, className }: ServiceFiltersProps) {
  const updateFilter = <K extends keyof DiscoveryFilters>(key: K, value: DiscoveryFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
        <div className="relative">
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-10 text-sm transition-colors focus:border-black focus:outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', (e.target.value || undefined) as ServiceCategory | undefined)}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-colors focus:border-black focus:outline-none"
        >
          <option value="">All Categories</option>
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pricing Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Pricing</label>
        <div className="space-y-2">
          {[
            { value: '', label: 'All' },
            { value: 'pay-per-use', label: 'Pay Per Use' },
            { value: 'subscription', label: 'Subscription' },
            { value: 'freemium', label: 'Freemium' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
            >
              <input
                type="radio"
                name="pricingType"
                checked={(filters.pricingType || '') === option.value}
                onChange={() => updateFilter('pricingType', (option.value || undefined) as PricingType | undefined)}
                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Minimum Rating: {filters.minRating || 0} ★
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating || 0}
          onChange={(e) => updateFilter('minRating', parseFloat(e.target.value) || undefined)}
          className="w-full accent-black"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>0</span>
          <span>5</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <label className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50">
          <span className="text-sm text-gray-700">Verified Only</span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.verified || false}
            onClick={() => updateFilter('verified', !filters.verified)}
            className={cn(
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              filters.verified ? 'bg-black' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition',
                filters.verified ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50">
          <span className="text-sm text-gray-700">Online Only</span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.onlineOnly || false}
            onClick={() => updateFilter('onlineOnly', !filters.onlineOnly)}
            className={cn(
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              filters.onlineOnly ? 'bg-black' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition',
                filters.onlineOnly ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </label>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Sort By</label>
        <select
          value={filters.sortBy || 'popularity'}
          onChange={(e) => updateFilter('sortBy', e.target.value as DiscoveryFilters['sortBy'])}
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-colors focus:border-black focus:outline-none"
        >
          <option value="popularity">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        type="button"
        onClick={() => onFiltersChange({})}
        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-black"
      >
        Clear All Filters
      </button>
    </div>
  );
}
