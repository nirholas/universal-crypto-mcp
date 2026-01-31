'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo?: string;
  balance?: number;
  price?: number;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  rate: number;
  priceImpact: number;
  fee: number;
  estimatedGas: string;
  route: string[];
}

export interface SwapParams {
  fromToken: Token;
  toToken: Token;
  amount: string;
  slippage?: number;
  deadline?: number;
}

export interface SwapResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

// API Functions
async function fetchSwapQuote(params: {
  fromToken: string;
  toToken: string;
  amount: string;
  chain?: string;
}): Promise<SwapQuote> {
  const response = await fetch('/api/defi/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch swap quote');
  }

  return response.json();
}

async function executeSwap(params: SwapParams): Promise<SwapResult> {
  const response = await fetch('/api/defi/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromToken: params.fromToken.address,
      toToken: params.toToken.address,
      amount: params.amount,
      slippage: params.slippage || 0.5,
      deadline: params.deadline || Math.floor(Date.now() / 1000) + 1200, // 20 minutes
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return response.json();
}

async function fetchTokens(chain: string = 'ethereum'): Promise<Token[]> {
  const response = await fetch(`/api/defi/tokens?chain=${chain}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tokens');
  }
  return response.json();
}

// Hooks
export function useSwapQuote(
  fromToken: Token | null,
  toToken: Token | null,
  amount: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['swap-quote', fromToken?.address, toToken?.address, amount],
    queryFn: () =>
      fetchSwapQuote({
        fromToken: fromToken!.address,
        toToken: toToken!.address,
        amount,
      }),
    enabled: enabled && !!fromToken && !!toToken && !!amount && parseFloat(amount) > 0,
    staleTime: 10000, // 10 seconds - quotes expire quickly
    refetchInterval: 15000, // Refresh every 15 seconds
  });
}

export function useSwap() {
  const queryClient = useQueryClient();
  const [isSwapping, setIsSwapping] = useState(false);

  const swapMutation = useMutation({
    mutationFn: executeSwap,
    onSuccess: () => {
      // Invalidate balances and quotes after successful swap
      queryClient.invalidateQueries({ queryKey: ['token-balances'] });
      queryClient.invalidateQueries({ queryKey: ['swap-quote'] });
    },
  });

  const swap = useCallback(
    async (params: SwapParams): Promise<SwapResult> => {
      setIsSwapping(true);
      try {
        const result = await swapMutation.mutateAsync(params);
        return result;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Swap failed',
        };
      } finally {
        setIsSwapping(false);
      }
    },
    [swapMutation]
  );

  return {
    swap,
    isSwapping,
    isError: swapMutation.isError,
    error: swapMutation.error,
  };
}

export function useTokens(chain: string = 'ethereum') {
  return useQuery({
    queryKey: ['tokens', chain],
    queryFn: () => fetchTokens(chain),
    staleTime: 300000, // 5 minutes
  });
}

export function useTokenBalances(address: string | undefined, tokens: Token[]) {
  return useQuery({
    queryKey: ['token-balances', address, tokens.map((t) => t.address)],
    queryFn: async () => {
      if (!address) return {};

      const response = await fetch('/api/defi/balances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          tokens: tokens.map((t) => t.address),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balances');
      }

      return response.json() as Promise<Record<string, string>>;
    },
    enabled: !!address && tokens.length > 0,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

// Combined hook for the swap widget
export function useSwapWidget(chain: string = 'ethereum', walletAddress?: string) {
  const { data: tokens = [], isLoading: tokensLoading } = useTokens(chain);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  // Set defaults once tokens load
  if (tokens.length >= 2 && !fromToken && !toToken) {
    const eth = tokens.find((t) => t.symbol === 'ETH' || t.symbol === 'WETH');
    const usdc = tokens.find((t) => t.symbol === 'USDC');
    if (eth) setFromToken(eth);
    if (usdc) setToToken(usdc);
  }

  const { data: balances = {} } = useTokenBalances(walletAddress, tokens);

  const {
    data: quote,
    isLoading: quoteLoading,
    error: quoteError,
  } = useSwapQuote(fromToken, toToken, amount);

  const { swap, isSwapping } = useSwap();

  const handleSwap = useCallback(async () => {
    if (!fromToken || !toToken || !amount) return { success: false, error: 'Invalid params' };

    return swap({
      fromToken,
      toToken,
      amount,
      slippage,
    });
  }, [fromToken, toToken, amount, slippage, swap]);

  const switchTokens = useCallback(() => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount('');
  }, [fromToken, toToken]);

  return {
    // Token state
    tokens,
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    switchTokens,

    // Amount state
    amount,
    setAmount,

    // Slippage
    slippage,
    setSlippage,

    // Quote
    quote,
    quoteLoading,
    quoteError,

    // Balances
    balances,

    // Actions
    swap: handleSwap,
    isSwapping,
    isLoading: tokensLoading,
  };
}

export default useSwap;
