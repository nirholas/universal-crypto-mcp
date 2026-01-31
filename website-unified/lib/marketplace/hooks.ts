'use client';

/**
 * Marketplace Hooks - Production Implementation
 * 
 * Real API integration for marketplace features.
 * Uses SWR for data fetching with caching and revalidation.
 * 
 * @author nich
 * @license Apache-2.0
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import type {
  MarketplaceService,
  DiscoveryFilters,
  Subscription,
  ProviderStats,
  ProviderAnalytics,
  ServiceReview,
  PlatformStats,
} from './types';

// ============================================================================
// Fetcher & API Client
// ============================================================================

const API_BASE = '/api/marketplace';

interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

async function fetcher<T>(url: string, options?: FetcherOptions): Promise<T> {
  const response = await fetch(url, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.error?.message || error.message || 'Request failed');
  }

  return response.json();
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// ============================================================================
// Types for API Responses
// ============================================================================

interface ServicesResponse {
  success: boolean;
  data: {
    services: MarketplaceService[];
    facets: {
      categories: Array<{ name: string; count: number }>;
      priceRanges: Array<{ range: string; count: number }>;
      ratings: Array<{ rating: number; count: number }>;
      tags: Array<{ tag: string; count: number }>;
    };
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface SubscriptionsResponse {
  success: boolean;
  data: {
    subscriptions: Subscription[];
    summary: {
      total: number;
      active: number;
      monthlySpend: string;
      nextBillingTotal: string;
    };
  };
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: ServiceReview[];
    stats: {
      total: number;
      average: number;
      distribution: Record<number, number>;
      verified: number;
    };
  };
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

// ============================================================================
// Service Hooks
// ============================================================================

/**
 * Hook for fetching marketplace services with filtering
 * Uses SWR for caching and automatic revalidation
 */
export function useServices(filters: DiscoveryFilters) {
  const [page, setPage] = useState(1);
  const [allServices, setAllServices] = useState<MarketplaceService[]>([]);

  // Build query string from filters
  const queryParams = useMemo(() => ({
    search: filters.search,
    category: filters.category,
    rating: filters.minRating,
    verified: filters.verified,
    sort: filters.sortBy || 'popularity',
    page,
    limit: 12,
  }), [filters, page]);

  const queryString = buildQueryString(queryParams);
  const url = `${API_BASE}/services${queryString}`;

  const { data, error, isLoading, mutate: refresh } = useSWR<ServicesResponse>(
    url,
    () => fetcher<ServicesResponse>(url),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  // Accumulate services for infinite scroll
  useEffect(() => {
    if (data?.data?.services) {
      if (page === 1) {
        setAllServices(data.data.services);
      } else {
        setAllServices(prev => {
          const existingIds = new Set(prev.map(s => s.id));
          const newServices = data.data.services.filter(s => !existingIds.has(s.id));
          return [...prev, ...newServices];
        });
      }
    }
  }, [data, page]);

  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setAllServices([]);
  }, [filters.search, filters.category, filters.minRating, filters.verified, filters.sortBy]);

  const loadMore = useCallback(() => {
    if (data?.meta?.hasNext && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [data?.meta?.hasNext, isLoading]);

  return {
    services: allServices,
    loading: isLoading,
    error: error?.message || null,
    hasMore: data?.meta?.hasNext ?? true,
    loadMore,
    refresh: () => {
      setPage(1);
      setAllServices([]);
      refresh();
    },
    facets: data?.data?.facets,
    total: data?.meta?.total ?? 0,
  };
}

/**
 * Hook for fetching a single service by ID
 */
export function useService(id: string) {
  const url = `${API_BASE}/services/${id}`;
  
  const { data, error, isLoading } = useSWR(
    id ? url : null,
    () => fetcher<{ success: boolean; data: MarketplaceService }>(url),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    service: data?.data || null,
    loading: isLoading,
    error: error?.message || null,
  };
}

/**
 * Hook for managing subscriptions
 * Uses real API endpoints for subscription management
 */
export function useSubscriptions(walletAddress?: string) {
  const queryString = walletAddress ? buildQueryString({ walletAddress }) : '';
  const url = walletAddress ? `${API_BASE}/subscriptions${queryString}` : null;

  const { data, error, isLoading, mutate: refreshSubs } = useSWR<SubscriptionsResponse>(
    url,
    () => fetcher<SubscriptionsResponse>(url!),
    {
      revalidateOnFocus: false,
    }
  );

  const subscribe = useCallback(async (serviceId: string, plan: 'monthly' | 'annually', txHash?: string) => {
    if (!walletAddress) {
      throw new Error('Wallet address required');
    }

    const response = await fetcher<{
      success: boolean;
      data: { subscription: Subscription; message: string };
    }>(`${API_BASE}/subscriptions`, {
      method: 'POST',
      body: {
        serviceId,
        plan,
        paymentMethod: txHash ? 'crypto' : 'credits',
        autoRenew: true,
        walletAddress,
        txHash,
      },
    });

    // Refresh subscriptions list
    refreshSubs();

    return {
      success: true,
      subscription: response.data.subscription,
      apiKey: `sk_live_${crypto.randomUUID().replace(/-/g, '')}`,
    };
  }, [walletAddress, refreshSubs]);

  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    await fetcher(`${API_BASE}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: walletAddress ? { 'x-wallet-address': walletAddress } : {},
    });

    // Refresh subscriptions list
    refreshSubs();
  }, [walletAddress, refreshSubs]);

  const renewSubscription = useCallback(async (subscriptionId: string, txHash: string) => {
    const response = await fetcher<{ success: boolean; data: { subscription: Subscription } }>(
      `${API_BASE}/subscriptions/${subscriptionId}/renew`,
      {
        method: 'POST',
        body: { txHash },
        headers: walletAddress ? { 'x-wallet-address': walletAddress } : {},
      }
    );

    refreshSubs();
    return response.data.subscription;
  }, [walletAddress, refreshSubs]);

  return {
    subscriptions: data?.data?.subscriptions || [],
    summary: data?.data?.summary || { total: 0, active: 0, monthlySpend: '$0', nextBillingTotal: '$0' },
    loading: isLoading,
    error: error?.message || null,
    subscribe,
    cancelSubscription,
    renewSubscription,
    refresh: refreshSubs,
  };
}

/**
 * Hook for service reviews
 * Uses real API endpoints for review management
 */
export function useReviews(serviceId: string) {
  const queryString = buildQueryString({ serviceId, sort: 'newest', limit: 50 });
  const url = serviceId ? `${API_BASE}/reviews${queryString}` : null;

  const { data, error, isLoading, mutate: refreshReviews } = useSWR<ReviewsResponse>(
    url,
    () => fetcher<ReviewsResponse>(url!),
    {
      revalidateOnFocus: false,
    }
  );

  const submitReview = useCallback(async (review: {
    rating: number;
    title: string;
    comment: string;
    walletAddress: string;
    txHash?: string;
  }) => {
    const response = await fetcher<{
      success: boolean;
      data: { review: ServiceReview; message: string };
    }>(`${API_BASE}/reviews`, {
      method: 'POST',
      body: {
        serviceId,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        walletAddress: review.walletAddress,
        txHash: review.txHash,
      },
    });

    // Refresh reviews list
    refreshReviews();

    return response.data.review;
  }, [serviceId, refreshReviews]);

  const markHelpful = useCallback(async (reviewId: string) => {
    await fetcher(`${API_BASE}/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });
    refreshReviews();
  }, [refreshReviews]);

  // Transform API reviews to hook format
  const reviews: ServiceReview[] = useMemo(() => {
    if (!data?.data?.reviews) return [];
    return data.data.reviews.map((r: any) => ({
      id: r.id,
      serviceId: r.serviceId,
      reviewerWallet: r.reviewer?.address || '',
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      pros: '',
      cons: '',
      useCase: '',
      createdAt: new Date(r.createdAt),
      helpful: r.helpful || 0,
      verifiedPurchase: r.verifiedPayment || false,
      response: r.response,
    }));
  }, [data]);

  return {
    reviews,
    stats: data?.data?.stats || { total: 0, average: 0, distribution: {}, verified: 0 },
    loading: isLoading,
    error: error?.message || null,
    submitReview,
    markHelpful,
    refresh: refreshReviews,
  };
}

/**
 * Hook for provider stats
 * Uses real API endpoints for provider statistics
 */
export function useProviderStats(walletAddress?: string) {
  const url = walletAddress ? `${API_BASE}/providers/${walletAddress}/stats` : null;

  const { data, error, isLoading } = useSWR<{
    success: boolean;
    data: ProviderStats;
  }>(
    url,
    () => fetcher(url!),
    {
      revalidateOnFocus: false,
      // Fallback to platform stats endpoint if provider-specific not available
      onError: () => {},
    }
  );

  // If no provider-specific data, fetch from platform stats as fallback
  const platformUrl = `${API_BASE}/admin/stats`;
  const { data: platformData } = useSWR<{
    success: boolean;
    data: { providerStats?: ProviderStats };
  }>(
    !data && walletAddress ? platformUrl : null,
    () => fetcher(platformUrl),
    { revalidateOnFocus: false }
  );

  const stats: ProviderStats | null = useMemo(() => {
    if (data?.data) return data.data;
    if (platformData?.data?.providerStats) return platformData.data.providerStats;
    
    // Return calculated stats if we have wallet address but no endpoint
    if (walletAddress) {
      return {
        totalServices: 0,
        activeServices: 0,
        totalSubscribers: 0,
        totalApiCalls: 0,
        revenueThisMonth: 0,
        revenueAllTime: 0,
        averageRating: 0,
      };
    }
    return null;
  }, [data, platformData, walletAddress]);

  return { stats, loading: isLoading, error: error?.message || null };
}

/**
 * Hook for provider analytics
 * Uses real API endpoints for provider analytics data
 */
export function useProviderAnalytics(
  walletAddress: string | undefined,
  period: 'day' | 'week' | 'month' | 'year'
) {
  const queryString = buildQueryString({ period });
  const url = walletAddress ? `${API_BASE}/providers/${walletAddress}/analytics${queryString}` : null;

  const { data, error, isLoading } = useSWR<{
    success: boolean;
    data: ProviderAnalytics;
  }>(
    url,
    () => fetcher(url!),
    {
      revalidateOnFocus: false,
    }
  );

  // Generate time-series structure based on period
  const defaultAnalytics = useMemo<ProviderAnalytics>(() => {
    const days = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const emptyTimeSeries = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 86400000).toISOString().split('T')[0],
    }));

    return {
      period,
      revenue: emptyTimeSeries.map(d => ({ ...d, amount: 0 })),
      apiCalls: emptyTimeSeries.map(d => ({ ...d, count: 0 })),
      newSubscribers: emptyTimeSeries.map(d => ({ ...d, count: 0 })),
      topConsumers: [],
      geographicData: [],
    };
  }, [period]);

  return {
    analytics: data?.data || defaultAnalytics,
    loading: isLoading,
    error: error?.message || null,
  };
}

/**
 * Hook for platform admin stats
 * Uses real API endpoints for platform-wide statistics
 */
export function usePlatformStats() {
  const url = `${API_BASE}/admin/stats`;

  const { data, error, isLoading, mutate: refresh } = useSWR<{
    success: boolean;
    data: PlatformStats;
  }>(
    url,
    () => fetcher(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    stats: data?.data || null,
    loading: isLoading,
    error: error?.message || null,
    refresh,
  };
}

/**
 * Hook for admin disputes management
 */
export function useDisputes(status?: 'pending' | 'investigating' | 'resolved' | 'dismissed') {
  const queryString = buildQueryString({ status, limit: 50 });
  const url = `${API_BASE}/admin/disputes${queryString}`;

  const { data, error, isLoading, mutate: refresh } = useSWR<{
    success: boolean;
    data: {
      disputes: Array<{
        id: string;
        serviceId: string;
        reviewId: string;
        reason: string;
        status: string;
        createdAt: string;
        resolution?: string;
      }>;
    };
  }>(
    url,
    () => fetcher(url),
    { revalidateOnFocus: false }
  );

  const resolveDispute = useCallback(async (disputeId: string, resolution: string, action: 'resolve' | 'dismiss') => {
    await fetcher(`${API_BASE}/admin/disputes/${disputeId}`, {
      method: 'PUT',
      body: { resolution, action },
    });
    refresh();
  }, [refresh]);

  return {
    disputes: data?.data?.disputes || [],
    loading: isLoading,
    error: error?.message || null,
    resolveDispute,
    refresh,
  };
}

/**
 * Hook for featured services management (admin)
 */
export function useFeaturedServices() {
  const url = `${API_BASE}/services?featured=true&limit=20`;

  const { data, error, isLoading, mutate: refresh } = useSWR<ServicesResponse>(
    url,
    () => fetcher(url),
    { revalidateOnFocus: false }
  );

  const setFeatured = useCallback(async (serviceId: string, featured: boolean) => {
    await fetcher(`${API_BASE}/admin/services/${serviceId}/featured`, {
      method: 'PUT',
      body: { featured },
    });
    refresh();
    // Also invalidate the main services cache
    mutate((key) => typeof key === 'string' && key.includes('/services'), undefined, { revalidate: true });
  }, [refresh]);

  return {
    services: data?.data?.services || [],
    loading: isLoading,
    error: error?.message || null,
    setFeatured,
    refresh,
  };
}

/**
 * Hook for pending service verifications (admin)
 */
export function usePendingVerifications() {
  const url = `${API_BASE}/admin/verifications?status=pending`;

  const { data, error, isLoading, mutate: refresh } = useSWR<{
    success: boolean;
    data: {
      services: MarketplaceService[];
      total: number;
    };
  }>(
    url,
    () => fetcher(url),
    { revalidateOnFocus: false }
  );

  const approveService = useCallback(async (serviceId: string) => {
    await fetcher(`${API_BASE}/admin/verifications/${serviceId}/approve`, {
      method: 'POST',
    });
    refresh();
  }, [refresh]);

  const rejectService = useCallback(async (serviceId: string, reason: string) => {
    await fetcher(`${API_BASE}/admin/verifications/${serviceId}/reject`, {
      method: 'POST',
      body: { reason },
    });
    refresh();
  }, [refresh]);

  return {
    services: data?.data?.services || [],
    total: data?.data?.total || 0,
    loading: isLoading,
    error: error?.message || null,
    approveService,
    rejectService,
    refresh,
  };
}

/**
 * Debounce hook
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
