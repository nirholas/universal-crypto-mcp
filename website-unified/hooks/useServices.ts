'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'data' | 'trading' | 'analytics' | 'ai' | 'infrastructure' | 'other';
  provider: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
    reputation: number;
  };
  endpoint: string;
  pricing: {
    payPerUse?: {
      amount: string;
      currency: string;
      unit: string;
    };
    subscription?: {
      monthly?: string;
      annually?: string;
    };
  };
  features: string[];
  tags: string[];
  stats: {
    requests: number;
    subscribers: number;
    rating: number;
    uptime: number;
  };
  documentation?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ServiceSubscription {
  id: string;
  service: Service;
  plan: 'payPerUse' | 'monthly' | 'annually';
  status: 'active' | 'cancelled' | 'expired';
  startedAt: number;
  expiresAt?: number;
  usage: {
    requests: number;
    credits: number;
    lastUsedAt?: number;
  };
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

// API Functions
async function fetchServices(params?: {
  category?: string;
  search?: string;
  tags?: string[];
  sortBy?: 'rating' | 'requests' | 'newest';
  limit?: number;
  offset?: number;
}): Promise<{ services: Service[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.tags?.length) searchParams.set('tags', params.tags.join(','));
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const response = await fetch(`/api/marketplace/services?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
}

async function fetchService(id: string): Promise<Service> {
  const response = await fetch(`/api/marketplace/services/${id}`);
  if (!response.ok) throw new Error('Failed to fetch service');
  return response.json();
}

async function fetchFeaturedServices(): Promise<Service[]> {
  const response = await fetch('/api/marketplace/featured');
  if (!response.ok) throw new Error('Failed to fetch featured services');
  return response.json();
}

async function fetchServiceReviews(serviceId: string): Promise<ServiceReview[]> {
  const response = await fetch(`/api/marketplace/services/${serviceId}/reviews`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}

async function subscribeToService(params: {
  serviceId: string;
  plan: 'payPerUse' | 'monthly' | 'annually';
}): Promise<ServiceSubscription> {
  const response = await fetch('/api/marketplace/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error('Failed to subscribe');
  return response.json();
}

async function cancelSubscription(subscriptionId: string): Promise<void> {
  const response = await fetch(`/api/marketplace/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to cancel subscription');
}

async function fetchUserSubscriptions(): Promise<ServiceSubscription[]> {
  const response = await fetch('/api/marketplace/subscriptions');
  if (!response.ok) throw new Error('Failed to fetch subscriptions');
  return response.json();
}

async function submitReview(params: {
  serviceId: string;
  rating: number;
  comment: string;
}): Promise<ServiceReview> {
  const response = await fetch(`/api/marketplace/services/${params.serviceId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: params.rating, comment: params.comment }),
  });
  if (!response.ok) throw new Error('Failed to submit review');
  return response.json();
}

// Hooks
export function useServices(params?: {
  category?: string;
  search?: string;
  tags?: string[];
  sortBy?: 'rating' | 'requests' | 'newest';
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => fetchServices(params),
    staleTime: 60000, // 1 minute
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchService(id!),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useFeaturedServices() {
  return useQuery({
    queryKey: ['featured-services'],
    queryFn: fetchFeaturedServices,
    staleTime: 300000, // 5 minutes
  });
}

export function useServiceReviews(serviceId: string | undefined) {
  return useQuery({
    queryKey: ['service-reviews', serviceId],
    queryFn: () => fetchServiceReviews(serviceId!),
    enabled: !!serviceId,
    staleTime: 60000,
  });
}

export function useUserSubscriptions() {
  return useQuery({
    queryKey: ['user-subscriptions'],
    queryFn: fetchUserSubscriptions,
    staleTime: 30000,
  });
}

export function useSubscriptionMutations() {
  const queryClient = useQueryClient();

  const subscribeMutation = useMutation({
    mutationFn: subscribeToService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['service-reviews', variables.serviceId] });
      queryClient.invalidateQueries({ queryKey: ['service', variables.serviceId] });
    },
  });

  return {
    subscribe: subscribeMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
    submitReview: reviewMutation.mutateAsync,
    isSubscribing: subscribeMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isSubmittingReview: reviewMutation.isPending,
  };
}

// Combined hook for marketplace discovery
export function useMarketplace(category?: string, search?: string) {
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, isLoading } = useServices({
    category,
    search,
    limit: pageSize,
    offset: page * pageSize,
    sortBy: 'rating',
  });

  const { data: featured = [], isLoading: featuredLoading } = useFeaturedServices();
  const { data: subscriptions = [], isLoading: subsLoading } = useUserSubscriptions();
  const mutations = useSubscriptionMutations();

  const services = data?.services || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Check if user is subscribed to a service
  const isSubscribed = useCallback(
    (serviceId: string) => subscriptions.some(
      (sub) => sub.service.id === serviceId && sub.status === 'active'
    ),
    [subscriptions]
  );

  return {
    // Services
    services,
    total,
    isLoading,

    // Pagination
    page,
    setPage,
    totalPages,
    hasNextPage: page < totalPages - 1,
    hasPrevPage: page > 0,

    // Featured
    featured,
    featuredLoading,

    // Subscriptions
    subscriptions,
    subsLoading,
    isSubscribed,

    // Actions
    ...mutations,
  };
}

export default useServices;
