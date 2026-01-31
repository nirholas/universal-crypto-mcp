'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { MarketplaceService } from '@/lib/marketplace/types';
import { ReputationBadge } from './ReputationBadge';
import { StatusIndicator } from './StatusIndicator';

interface ServiceCardProps {
  service: MarketplaceService;
  variant?: 'grid' | 'list';
  className?: string;
}

export function ServiceCard({ service, variant = 'grid', className }: ServiceCardProps) {
  const formatPrice = (service: MarketplaceService) => {
    if (service.pricing.payPerUse) {
      return `$${service.pricing.payPerUse.pricePerRequest}/req`;
    }
    if (service.pricing.subscription?.plans?.[0]) {
      return `From $${service.pricing.subscription.plans[0].price}/mo`;
    }
    return 'Free';
  };

  const formatUsage = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  if (variant === 'list') {
    return (
      <div
        className={cn(
          'group flex items-center gap-6 rounded-xl border-2 border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md',
          className
        )}
      >
        {/* Icon/Category */}
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
          {getCategoryIcon(service.category)}
        </div>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/marketplace/service/${service.id}`}
              className="truncate font-semibold text-gray-900 hover:text-black"
            >
              {service.name}
            </Link>
            <StatusIndicator online={service.isOnline} />
            {service.badges.map((badge) => (
              <span
                key={badge.id}
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  badge.color === 'green' && 'bg-green-100 text-green-700',
                  badge.color === 'yellow' && 'bg-yellow-100 text-yellow-700',
                  badge.color === 'blue' && 'bg-blue-100 text-blue-700'
                )}
              >
                {badge.icon} {badge.name}
              </span>
            ))}
          </div>
          <p className="mt-1 truncate text-sm text-gray-600">{service.shortDescription}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>{service.provider.name}</span>
            <span>•</span>
            <span>{formatUsage(service.usageCount)} calls</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex-shrink-0 text-center">
          <ReputationBadge score={service.reputation.score} size="sm" />
          <div className="mt-1 flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{service.reputation.rating}</span>
            <span className="text-gray-400">({service.reputation.totalReviews})</span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <span className="font-semibold text-gray-900">{formatPrice(service)}</span>
          <Link
            href={`/marketplace/service/${service.id}`}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex flex-col rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
          {getCategoryIcon(service.category)}
        </div>
        <div className="flex items-center gap-2">
          <StatusIndicator online={service.isOnline} />
          {service.featured && (
            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="mt-4 flex-1">
        <Link
          href={`/marketplace/service/${service.id}`}
          className="font-semibold text-gray-900 transition-colors hover:text-black"
        >
          {service.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{service.shortDescription}</p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1">
        {service.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
        {service.tags.length > 3 && (
          <span className="text-xs text-gray-400">+{service.tags.length - 3}</span>
        )}
      </div>

      {/* Provider */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
          {service.provider.name[0]}
        </div>
        <span className="text-sm text-gray-600">{service.provider.name}</span>
        {service.provider.verified && (
          <span className="text-xs text-green-600">✓ Verified</span>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{service.reputation.rating}</span>
          <span className="text-gray-400">({service.reputation.totalReviews})</span>
        </div>
        <span className="text-sm text-gray-500">{formatUsage(service.usageCount)} calls</span>
      </div>

      {/* Price & CTA */}
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900">{formatPrice(service)}</span>
        <Link
          href={`/marketplace/service/${service.id}`}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 active:scale-95"
        >
          View
        </Link>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'ai-models': '🤖',
    'data-apis': '📊',
    'trading-signals': '📈',
    analytics: '📉',
    'machine-learning': '🧠',
    nlp: '💬',
    'computer-vision': '👁️',
    speech: '🎙️',
    translation: '🌐',
    'blockchain-data': '⛓️',
    'market-data': '💹',
    weather: '🌤️',
    geolocation: '📍',
    sentiment: '😊',
    other: '📦',
  };
  return icons[category] || '📦';
}
