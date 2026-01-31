'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { mockServices } from '@/lib/marketplace/mock-data';
import { StatusIndicator } from '@/components/marketplace/StatusIndicator';

export default function ProviderServicesPage() {
  const [filter, setFilter] = React.useState<'all' | 'active' | 'paused' | 'pending'>('all');
  
  // Use first 4 mock services as provider's services
  const services = mockServices.slice(0, 4);
  
  const filteredServices = services.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="mt-1 text-gray-600">Manage and monitor your registered services</p>
        </div>
        <Link
          href="/marketplace/provider/register"
          className="rounded-xl bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
        >
          + Add New Service
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {(['all', 'active', 'paused', 'pending'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors',
              filter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-gray-300"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Service Info */}
              <div className="flex gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                  {getCategoryIcon(service.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <StatusIndicator online={service.isOnline} showLabel />
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                        service.status === 'active' && 'bg-green-100 text-green-700',
                        service.status === 'paused' && 'bg-yellow-100 text-yellow-700',
                        service.status === 'pending' && 'bg-blue-100 text-blue-700'
                      )}
                    >
                      {service.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{service.shortDescription}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>{service.reputation.totalReviews} reviews</span>
                    <span>•</span>
                    <span>⭐ {service.reputation.rating}</span>
                    <span>•</span>
                    <span>{formatNumber(service.usageCount)} calls</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${formatNumber(Math.floor(Math.random() * 5000 + 500))}</p>
                  <p className="text-xs text-gray-500">Revenue (30d)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{service.reputation.uptime}%</p>
                  <p className="text-xs text-gray-500">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{service.reputation.responseTime}ms</p>
                  <p className="text-xs text-gray-500">Avg Response</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/marketplace/provider/services/${service.id}`}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Edit
                </Link>
                <Link
                  href={`/marketplace/provider/services/${service.id}/analytics`}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Analytics
                </Link>
                <button
                  type="button"
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    service.status === 'active'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  )}
                >
                  {service.status === 'active' ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-4xl">📦</p>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No services found</h3>
          <p className="mt-1 text-gray-600">
            {filter === 'all'
              ? "You haven't registered any services yet."
              : `No ${filter} services found.`}
          </p>
          {filter === 'all' && (
            <Link
              href="/marketplace/provider/register"
              className="mt-4 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Register Your First Service
            </Link>
          )}
        </div>
      )}
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

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}
