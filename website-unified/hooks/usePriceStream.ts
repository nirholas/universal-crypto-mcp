/**
 * usePriceStream Hook
 * 
 * React hook for real-time price streaming via WebSocket
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useWebSocketContext } from '../providers/WebSocketProvider';
import type { Price, PriceUpdate } from '../lib/websocket/types';

// ============================================================================
// Types
// ============================================================================

export interface UsePriceStreamOptions {
  // Enable/disable the subscription
  enabled?: boolean;
  
  // Throttle updates (ms)
  throttle?: number;
  
  // Auto-subscribe on mount
  autoSubscribe?: boolean;
  
  // Filter by source
  source?: string;
  
  // Custom update handler
  onUpdate?: (update: PriceUpdate) => void;
  
  // Error handler
  onError?: (error: Error) => void;
}

export interface UsePriceStreamReturn {
  // Price data
  prices: Map<string, Price>;
  
  // Get specific price
  getPrice: (symbol: string) => Price | undefined;
  
  // Loading state
  loading: boolean;
  
  // Error state
  error: Error | null;
  
  // Last update timestamp
  lastUpdate: number;
  
  // Subscription management
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
  subscribeMultiple: (symbols: string[]) => void;
  unsubscribeAll: () => void;
  
  // Get list of subscribed symbols
  subscribedSymbols: string[];
  
  // Connection status
  connected: boolean;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function usePriceStream(
  symbols: string[] = [],
  options: UsePriceStreamOptions = {}
): UsePriceStreamReturn {
  const {
    enabled = true,
    throttle = 100,
    autoSubscribe = true,
    source,
    onUpdate,
    onError,
  } = options;

  // Get WebSocket context
  const { connected, client, subscribe: wsSubscribe, unsubscribe: wsUnsubscribe, onMessage } = useWebSocketContext();
  
  // State
  const [prices, setPrices] = useState<Map<string, Price>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState(0);
  
  // Track subscribed symbols
  const subscribedRef = useRef<Set<string>>(new Set());
  const throttleRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<PriceUpdate[]>([]);
  const onUpdateRef = useRef(onUpdate);
  const onErrorRef = useRef(onError);
  
  // Keep refs updated
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onErrorRef.current = onError;
  }, [onUpdate, onError]);
  
  // Process batched updates
  const processBatchedUpdates = useCallback(() => {
    if (pendingUpdatesRef.current.length === 0) return;
    
    setPrices(prev => {
      const next = new Map(prev);
      
      for (const update of pendingUpdatesRef.current) {
        // Filter by source if specified
        if (source && update.source !== source) continue;
        
        next.set(update.symbol, update.price);
        onUpdateRef.current?.(update);
      }
      
      return next;
    });
    
    setLastUpdate(Date.now());
    pendingUpdatesRef.current = [];
  }, [source]);
  
  // Handle price updates
  useEffect(() => {
    if (!connected || !enabled) return;
    
    const handlePriceUpdate = (data: unknown) => {
      try {
        const updates = data as PriceUpdate[] | PriceUpdate;
        const updateArray = Array.isArray(updates) ? updates : [updates];
        
        // Filter to only subscribed symbols
        const relevantUpdates = updateArray.filter(
          u => subscribedRef.current.has(u.symbol)
        );
        
        if (relevantUpdates.length === 0) return;
        
        // Add to pending updates
        pendingUpdatesRef.current.push(...relevantUpdates);
        
        // Throttle updates
        if (throttle > 0) {
          if (!throttleRef.current) {
            throttleRef.current = setTimeout(() => {
              processBatchedUpdates();
              throttleRef.current = null;
            }, throttle);
          }
        } else {
          processBatchedUpdates();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onErrorRef.current?.(error);
      }
    };
    
    const unsubscribe = onMessage<PriceUpdate[] | PriceUpdate>('prices:update', handlePriceUpdate);
    
    return () => {
      unsubscribe();
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
    };
  }, [connected, enabled, throttle, onMessage, processBatchedUpdates]);
  
  // Subscribe to a symbol
  const subscribe = useCallback(async (symbol: string) => {
    if (!client || !connected) return;
    if (subscribedRef.current.has(symbol)) return;
    
    try {
      await wsSubscribe(`prices:${symbol}`);
      subscribedRef.current.add(symbol);
      
      // Request initial price
      const response = await client.request<{ price: Price }>('price:get', { symbol });
      if (response.price) {
        setPrices(prev => new Map(prev).set(symbol, response.price));
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onErrorRef.current?.(error);
    }
  }, [client, connected, wsSubscribe]);
  
  // Unsubscribe from a symbol
  const unsubscribe = useCallback(async (symbol: string) => {
    if (!connected) return;
    if (!subscribedRef.current.has(symbol)) return;
    
    try {
      await wsUnsubscribe(`prices:${symbol}`);
      subscribedRef.current.delete(symbol);
      
      // Remove from prices
      setPrices(prev => {
        const next = new Map(prev);
        next.delete(symbol);
        return next;
      });
    } catch (err) {
      // Ignore unsubscribe errors
    }
  }, [connected, wsUnsubscribe]);
  
  // Subscribe to multiple symbols
  const subscribeMultiple = useCallback(async (symbols: string[]) => {
    setLoading(true);
    
    try {
      await Promise.all(symbols.map(subscribe));
    } finally {
      setLoading(false);
    }
  }, [subscribe]);
  
  // Unsubscribe from all
  const unsubscribeAll = useCallback(async () => {
    const symbols = Array.from(subscribedRef.current);
    await Promise.all(symbols.map(unsubscribe));
    setPrices(new Map());
  }, [unsubscribe]);
  
  // Get specific price
  const getPrice = useCallback((symbol: string): Price | undefined => {
    return prices.get(symbol);
  }, [prices]);
  
  // Auto-subscribe to initial symbols
  useEffect(() => {
    if (!connected || !enabled || !autoSubscribe) {
      setLoading(false);
      return;
    }
    
    if (symbols.length === 0) {
      setLoading(false);
      return;
    }
    
    // Find new symbols to subscribe to
    const newSymbols = symbols.filter(s => !subscribedRef.current.has(s));
    
    if (newSymbols.length > 0) {
      subscribeMultiple(newSymbols);
    } else {
      setLoading(false);
    }
    
    return () => {
      // Cleanup: unsubscribe from symbols no longer in the list
      const toUnsubscribe = Array.from(subscribedRef.current).filter(
        s => !symbols.includes(s)
      );
      toUnsubscribe.forEach(unsubscribe);
    };
  }, [symbols, connected, enabled, autoSubscribe, subscribeMultiple, unsubscribe]);
  
  // Get subscribed symbols
  const subscribedSymbols = useMemo(() => {
    return Array.from(subscribedRef.current);
  }, [prices]); // Update when prices change
  
  return {
    prices,
    getPrice,
    loading,
    error,
    lastUpdate,
    subscribe,
    unsubscribe,
    subscribeMultiple,
    unsubscribeAll,
    subscribedSymbols,
    connected,
  };
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook for a single price
 */
export function usePrice(
  symbol: string,
  options: Omit<UsePriceStreamOptions, 'symbols'> = {}
): {
  price: Price | undefined;
  loading: boolean;
  error: Error | null;
} {
  const { prices, loading, error } = usePriceStream([symbol], options);
  
  return {
    price: prices.get(symbol),
    loading,
    error,
  };
}

/**
 * Hook for top movers (most price change)
 */
export function useTopMovers(
  count: number = 10,
  options: UsePriceStreamOptions = {}
): {
  gainers: Price[];
  losers: Price[];
  loading: boolean;
  error: Error | null;
} {
  const [gainers, setGainers] = useState<Price[]>([]);
  const [losers, setLosers] = useState<Price[]>([]);
  const { connected, client, onMessage } = useWebSocketContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!connected || !options.enabled) {
      setLoading(false);
      return;
    }
    
    // Subscribe to market overview
    const fetchTopMovers = async () => {
      try {
        const response = await client?.request<{ gainers: Price[]; losers: Price[] }>(
          'market:topMovers',
          { count }
        );
        
        if (response) {
          setGainers(response.gainers);
          setLosers(response.losers);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };
    
    fetchTopMovers();
    
    // Subscribe to updates
    const unsubscribe = onMessage<{ gainers: Price[]; losers: Price[] }>(
      'market:topMoversUpdate',
      (data) => {
        setGainers(data.gainers);
        setLosers(data.losers);
      }
    );
    
    return () => unsubscribe();
  }, [connected, count, client, onMessage, options.enabled]);
  
  return { gainers, losers, loading, error };
}

// ============================================================================
// Export
// ============================================================================

export default usePriceStream;
