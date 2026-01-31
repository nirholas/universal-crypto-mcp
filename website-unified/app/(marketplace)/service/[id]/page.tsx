'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useService, useReviews } from '@/lib/marketplace/hooks';
import { ReputationBadge, VerificationBadges, TrustIndicators } from '@/components/marketplace/ReputationBadge';
import { StatusIndicator } from '@/components/marketplace/StatusIndicator';
import { SubscriptionFlow } from '@/components/marketplace/SubscriptionFlow';
import type { ServiceBadge, SubscriptionTier } from '@/lib/marketplace/types';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { service, loading, error } = useService(params.id as string);
  const { reviews } = useReviews(params.id as string);
  const [showSubscriptionModal, setShowSubscriptionModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'pricing' | 'docs' | 'reviews'>('overview');

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="col-span-2 h-96 rounded-2xl bg-gray-200" />
            <div className="h-64 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-6xl">🔍</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Service Not Found</h1>
        <p className="mt-2 text-gray-600">{error || 'The service you are looking for does not exist.'}</p>
        <Link
          href="/marketplace/discover"
          className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Back to Discover
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/marketplace/discover" className="hover:text-black">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-gray-900">{service.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
              {getCategoryIcon(service.category)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
                <StatusIndicator online={service.isOnline} showLabel />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {service.badges.map((badge: ServiceBadge) => (
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
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowSubscriptionModal(true)}
              className="rounded-xl bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              Subscribe Now
            </button>
            <button
              type="button"
              className="rounded-xl border-2 border-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:border-black"
            >
              Try Free
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
              {(['overview', 'pricing', 'docs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors',
                    activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">About</h2>
                  <p className="text-gray-600 whitespace-pre-line">{service.description}</p>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.tags.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Trust & Performance</h2>
                  <TrustIndicators
                    uptime={service.reputation.uptime}
                    responseTime={service.reputation.responseTime}
                    successRate={service.reputation.successRate}
                  />
                </div>

                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Usage Example</h2>
                  <pre className="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`// Using the ${service.name} API
const response = await fetch('${service.endpoint}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // Your request data
  }),
});

const data = await response.json();
console.log(data);`}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">Pricing Plans</h2>
                
                {service.pricing.type === 'pay-per-use' && (
                  <div className="rounded-xl bg-gray-50 p-6 text-center">
                    <p className="text-sm text-gray-500">Pay Per Request</p>
                    <p className="mt-2 text-4xl font-bold text-gray-900">
                      ${service.pricing.payPerUse?.pricePerRequest}
                    </p>
                    <p className="mt-1 text-gray-500">per API request</p>
                    <button
                      type="button"
                      onClick={() => setShowSubscriptionModal(true)}
                      className="mt-6 w-full rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-800"
                    >
                      Get Started
                    </button>
                  </div>
                )}

                {service.pricing.subscription?.plans && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {service.pricing.subscription.plans.map((plan: SubscriptionTier, index: number) => (
                      <div
                        key={plan.name}
                        className={cn(
                          'rounded-xl border-2 p-6',
                          index === 1 ? 'border-black' : 'border-gray-200'
                        )}
                      >
                        {index === 1 && (
                          <span className="mb-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                            Popular
                          </span>
                        )}
                        <h3 className="text-lg font-semibold capitalize text-gray-900">{plan.name}</h3>
                        <p className="mt-2">
                          <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-gray-500">/{plan.billingPeriod}</span>
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {plan.requestsIncluded.toLocaleString()} requests included
                        </p>
                        <ul className="mt-4 space-y-2">
                          {plan.features.map((feature: string) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="text-green-500">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => setShowSubscriptionModal(true)}
                          className={cn(
                            'mt-6 w-full rounded-xl py-3 font-medium transition-colors',
                            index === 1
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'border-2 border-gray-200 text-gray-700 hover:border-black'
                          )}
                        >
                          Choose {plan.name}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">API Documentation</h2>
                <p className="text-gray-600">
                  Full documentation is available after subscribing. Preview the basic usage below.
                </p>
                
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="font-medium text-gray-900">Endpoint</h3>
                    <code className="mt-2 block rounded bg-gray-200 px-3 py-2 font-mono text-sm">
                      {service.endpoint}
                    </code>
                  </div>
                  
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="font-medium text-gray-900">Authentication</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Include your API key in the Authorization header:
                    </p>
                    <code className="mt-2 block rounded bg-gray-200 px-3 py-2 font-mono text-sm">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>
                </div>

                {service.documentationUrl && (
                  <a
                    href={service.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-black hover:underline"
                  >
                    View Full Documentation →
                  </a>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 text-center">
                    <p className="text-4xl">💬</p>
                    <h3 className="mt-4 font-semibold text-gray-900">No reviews yet</h3>
                    <p className="mt-1 text-gray-600">Be the first to review this service!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-medium">
                            {review.reviewerName?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{review.reviewerName || 'Anonymous'}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <h4 className="mt-4 font-medium text-gray-900">{review.title}</h4>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                      {review.verifiedPurchase && (
                        <span className="mt-3 inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Provider Card */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-medium text-gray-500">Provider</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold">
                  {service.provider.name[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{service.provider.name}</p>
                  <VerificationBadges verified={service.provider.verified} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Reputation</span>
                <ReputationBadge score={service.provider.reputationScore} size="sm" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Services</span>
                <span className="font-medium text-gray-900">{service.provider.totalServices}</span>
              </div>
              <Link
                href={`/marketplace/provider/${service.provider.id}`}
                className="mt-4 block w-full rounded-xl border-2 border-gray-200 py-2 text-center text-sm font-medium text-gray-700 hover:border-black"
              >
                View Profile
              </Link>
            </div>

            {/* Stats Card */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-medium text-gray-500">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="flex items-center gap-1 font-medium">
                    <span className="text-yellow-400">★</span>
                    {service.reputation.rating} ({service.reputation.totalReviews})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Calls</span>
                  <span className="font-medium">{formatNumber(service.usageCount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verified Payments</span>
                  <span className="font-medium">{service.reputation.verifiedPayments.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="font-medium capitalize">{service.category.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Quick Price */}
            <div className="rounded-2xl border-2 border-black bg-black p-6 text-white">
              <p className="text-sm text-gray-300">Starting at</p>
              <p className="mt-1 text-3xl font-bold">
                {service.pricing.payPerUse
                  ? `$${service.pricing.payPerUse.pricePerRequest}/req`
                  : service.pricing.subscription?.plans?.[0]
                    ? `$${service.pricing.subscription.plans[0].price}/mo`
                    : 'Free'}
              </p>
              <button
                type="button"
                onClick={() => setShowSubscriptionModal(true)}
                className="mt-4 w-full rounded-xl bg-white py-3 font-medium text-black hover:bg-gray-100"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionFlow
          service={service}
          onClose={() => setShowSubscriptionModal(false)}
          onSuccess={() => {
            setShowSubscriptionModal(false);
            router.push('/marketplace/subscriptions?new=true');
          }}
        />
      )}
    </>
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
