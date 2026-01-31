/**
 * Hooks Integration Tests
 * 
 * Tests for React hooks with mocked API responses
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSwap hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch tokens successfully', async () => {
    const mockTokens = [
      { symbol: 'ETH', name: 'Ethereum', address: '0x...', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0x...', decimals: 6 },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTokens),
    });

    // Dynamic import to avoid module resolution issues in test
    const { useTokens } = await import('../hooks/useSwap');

    const { result } = renderHook(() => useTokens(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(mockTokens);
  });
});

describe('useMarketData hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch token prices', async () => {
    const mockPrices = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        current_price: 62500,
        price_change_percentage_24h: 2.5,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPrices),
    });

    const { useTokenPrices } = await import('../hooks/useMarketData');

    const { result } = renderHook(() => useTokenPrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(mockPrices);
  });
});

describe('useAgents hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch agents list', async () => {
    const mockAgents = [
      {
        id: 'agent-1',
        name: 'Trading Bot',
        status: 'active',
        type: 'trading',
        metrics: { totalRuns: 100, successfulRuns: 95 },
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAgents),
    });

    const { useAgents } = await import('../hooks/useAgents');

    const { result } = renderHook(() => useAgents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(mockAgents);
  });
});

describe('useCredits hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch credit balance', async () => {
    const mockBalance = {
      available: 1500.50,
      pending: 50.00,
      spent: 350.00,
      currency: 'USD',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockBalance),
    });

    const { useCreditBalance } = await import('../hooks/useCredits');

    const { result } = renderHook(() => useCreditBalance(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(mockBalance);
  });
});

describe('useLiquidity hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch liquidity pools', async () => {
    const mockPools = [
      {
        id: 'pool-1',
        protocol: 'uniswap-v3',
        name: 'ETH-USDC',
        tvl: 150000000,
        apy: 12.5,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPools),
    });

    const { useLiquidityPools } = await import('../hooks/useLiquidity');

    const { result } = renderHook(() => useLiquidityPools(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(mockPools);
  });
});

describe('useYield hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch yield farms', async () => {
    const mockFarms = [
      {
        id: 'farm-1',
        protocol: 'yearn',
        name: 'ETH Vault',
        apy: 5.2,
        tvl: 500000000,
        risk: 'low',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFarms),
    });

    const { useYieldFarms } = await import('../hooks/useYield');

    const { result } = renderHook(() => useYieldFarms(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(mockFarms);
  });
});

describe('useServices hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch marketplace services', async () => {
    const mockServices = {
      services: [
        {
          id: 'svc-1',
          name: 'Premium API',
          category: 'data',
          provider: { name: 'Test Provider', verified: true },
        },
      ],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockServices),
    });

    const { useServices } = await import('../hooks/useServices');

    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(mockServices);
  });
});
