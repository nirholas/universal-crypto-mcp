/**
 * WebSocket React Hooks
 * 
 * React hooks for WebSocket integration in components
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { WebSocketClient, createWebSocketClient, getDefaultClient } from './client';
import type {
  WSClientOptions,
  WSMessage,
  Price,
  PriceUpdate,
  TransactionStatus,
  WalletUpdate,
  Notification,
  ConnectionQuality,
} from './types';

// ============================================================================
// Connection Hooks
// ============================================================================

export interface UseWebSocketOptions extends Partial<WSClientOptions> {
  // Use default singleton client
  useDefault?: boolean;
}

export interface UseWebSocketReturn {
  client: WebSocketClient;
  connected: boolean;
  connecting: boolean;
  error: Error | null;
  reconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  send: (type: string, payload?: unknown) => void;
  request: <T>(type: string, payload?: unknown) => Promise<T>;
  subscribe: (channel: string) => Promise<void>;
  unsubscribe: (channel: string) => Promise<void>;
}

/**
 * Main WebSocket hook for connection management
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { useDefault = true, ...clientOptions } = options;
  
  const clientRef = useRef<WebSocketClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create or get client
  useEffect(() => {
    if (useDefault) {
      clientRef.current = getDefaultClient(clientOptions);
    } else {
      clientRef.current = createWebSocketClient(clientOptions);
    }

    const client = clientRef.current;

    // Set up event handlers
    const unsubConnect = client.on('connect', () => {
      setConnected(true);
      setConnecting(false);
      setReconnecting(false);
      setError(null);
    });

    const unsubDisconnect = client.on('disconnect', () => {
      setConnected(false);
    });

    const unsubReconnecting = client.on('reconnecting', () => {
      setReconnecting(true);
    });

    const unsubError = client.on('error', (err) => {
      setError(err instanceof Error ? err : new Error(String(err)));
    });

    // Initial connection state
    setConnected(client.connected);
    setConnecting(client.connecting);

    return () => {
      unsubConnect();
      unsubDisconnect();
      unsubReconnecting();
      unsubError();

      if (!useDefault && clientRef.current) {
        clientRef.current.destroy();
      }
    };
  }, [useDefault]);

  const connect = useCallback(async () => {
    if (!clientRef.current) return;
    setConnecting(true);
    try {
      await clientRef.current.connect();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setConnecting(false);
      throw err;
    }
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
  }, []);

  const send = useCallback((type: string, payload?: unknown) => {
    clientRef.current?.send(type, payload);
  }, []);

  const request = useCallback(<T,>(type: string, payload?: unknown) => {
    if (!clientRef.current) {
      return Promise.reject(new Error('Client not initialized'));
    }
    return clientRef.current.request<T>(type, payload);
  }, []);

  const subscribe = useCallback(async (channel: string) => {
    await clientRef.current?.subscribe(channel);
  }, []);

  const unsubscribe = useCallback(async (channel: string) => {
    await clientRef.current?.unsubscribe(channel);
  }, []);

  return {
    client: clientRef.current!,
    connected,
    connecting,
    error,
    reconnecting,
    connect,
    disconnect,
    send,
    request,
    subscribe,
    unsubscribe,
  };
}

// ============================================================================
// Price Subscription Hooks
// ============================================================================

export interface UsePriceSubscriptionOptions {
  symbols: string[];
  enabled?: boolean;
  baseCurrency?: string;
}

export interface UsePriceSubscriptionReturn {
  prices: Map<string, Price>;
  loading: boolean;
  error: Error | null;
  subscribe: (symbols: string[]) => Promise<void>;
  unsubscribe: (symbols?: string[]) => Promise<void>;
  getPrice: (symbol: string) => Price | undefined;
}

/**
 * Hook for subscribing to real-time price updates
 */
export function usePriceSubscription(
  options: UsePriceSubscriptionOptions
): UsePriceSubscriptionReturn {
  const { symbols, enabled = true, baseCurrency = 'USD' } = options;
  const { client, connected } = useWebSocket({ useDefault: true });
  
  const [prices, setPrices] = useState<Map<string, Price>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const subscribedSymbols = useRef<Set<string>>(new Set());

  // Handle price updates
  useEffect(() => {
    if (!client || !connected || !enabled) return;

    const handlePriceUpdate = (data: unknown) => {
      const updates = data as PriceUpdate[] | PriceUpdate;
      const updateArray = Array.isArray(updates) ? updates : [updates];

      setPrices((prev) => {
        const next = new Map(prev);
        for (const update of updateArray) {
          // PriceUpdate contains a Price object in its price field
          next.set(update.symbol, update.price);
        }
        return next;
      });
    };

    const unsubscribe = client.onMessage('prices:update', handlePriceUpdate);
    return () => unsubscribe();
  }, [client, connected, enabled]);

  // Subscribe to symbols
  useEffect(() => {
    if (!client || !connected || !enabled || symbols.length === 0) return;

    const newSymbols = symbols.filter((s) => !subscribedSymbols.current.has(s));
    if (newSymbols.length === 0) return;

    const doSubscribe = async () => {
      setLoading(true);
      try {
        const response = await client.request<{ currentPrices: Price[] }>(
          'prices:subscribe',
          { symbols: newSymbols, baseCurrency }
        );

        // Store initial prices
        setPrices((prev) => {
          const next = new Map(prev);
          for (const price of response.currentPrices) {
            next.set(price.symbol, price);
          }
          return next;
        });

        newSymbols.forEach((s) => subscribedSymbols.current.add(s));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    doSubscribe();
  }, [client, connected, enabled, symbols, baseCurrency]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client && subscribedSymbols.current.size > 0) {
        client.request('prices:unsubscribe', {
          symbols: Array.from(subscribedSymbols.current),
        }).catch(() => {});
      }
    };
  }, [client]);

  const subscribe = useCallback(async (newSymbols: string[]) => {
    if (!client) return;
    await client.request('prices:subscribe', { symbols: newSymbols, baseCurrency });
    newSymbols.forEach((s) => subscribedSymbols.current.add(s));
  }, [client, baseCurrency]);

  const unsubscribe = useCallback(async (symbolsToRemove?: string[]) => {
    if (!client) return;
    const symbols = symbolsToRemove || Array.from(subscribedSymbols.current);
    await client.request('prices:unsubscribe', { symbols });
    symbols.forEach((s) => subscribedSymbols.current.delete(s));
  }, [client]);

  const getPrice = useCallback((symbol: string) => {
    return prices.get(symbol.toUpperCase());
  }, [prices]);

  return {
    prices,
    loading,
    error,
    subscribe,
    unsubscribe,
    getPrice,
  };
}

// ============================================================================
// Wallet Subscription Hooks
// ============================================================================

export interface UseWalletSubscriptionOptions {
  addresses: string[];
  chains?: string[];
  enabled?: boolean;
}

export interface UseWalletSubscriptionReturn {
  updates: WalletUpdate[];
  transactions: Map<string, TransactionStatus>;
  loading: boolean;
  error: Error | null;
  trackTransaction: (hash: string, chain: string, from: string, to: string, value: string) => Promise<void>;
}

/**
 * Hook for subscribing to wallet updates
 */
export function useWalletSubscription(
  options: UseWalletSubscriptionOptions
): UseWalletSubscriptionReturn {
  const { addresses, chains = ['ethereum'], enabled = true } = options;
  const { client, connected } = useWebSocket({ useDefault: true });

  const [updates, setUpdates] = useState<WalletUpdate[]>([]);
  const [transactions, setTransactions] = useState<Map<string, TransactionStatus>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Handle wallet updates
  useEffect(() => {
    if (!client || !connected || !enabled) return;

    const handleWalletUpdate = (data: unknown) => {
      const update = data as WalletUpdate;
      setUpdates((prev) => [update, ...prev].slice(0, 100));
    };

    const handleTxUpdate = (data: unknown) => {
      const tx = data as TransactionStatus;
      setTransactions((prev) => {
        const next = new Map(prev);
        next.set(tx.hash, tx);
        return next;
      });
    };

    const unsubWallet = client.onMessage('wallet:update', handleWalletUpdate);
    const unsubTx = client.onMessage('tx:update', handleTxUpdate);

    return () => {
      unsubWallet();
      unsubTx();
    };
  }, [client, connected, enabled]);

  // Subscribe to wallets
  useEffect(() => {
    if (!client || !connected || !enabled || addresses.length === 0) return;

    const doSubscribe = async () => {
      setLoading(true);
      try {
        await client.request('wallet:subscribe', { addresses, chains });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    doSubscribe();

    return () => {
      client.request('wallet:unsubscribe', { addresses }).catch(() => {});
    };
  }, [client, connected, enabled, addresses, chains]);

  const trackTransaction = useCallback(
    async (hash: string, chain: string, from: string, to: string, value: string) => {
      if (!client) return;
      await client.request('tx:track', { hash, chain, from, to, value });
    },
    [client]
  );

  return {
    updates,
    transactions,
    loading,
    error,
    trackTransaction,
  };
}

// ============================================================================
// Notification Hooks
// ============================================================================

export interface UseNotificationsOptions {
  enabled?: boolean;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

/**
 * Hook for real-time notifications
 */
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { enabled = true } = options;
  const { client, connected } = useWebSocket({ useDefault: true });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Handle new notifications
  useEffect(() => {
    if (!client || !connected || !enabled) return;

    const handleNotification = (data: unknown) => {
      const notification = data as Notification;
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    const unsubscribe = client.onMessage('notification', handleNotification);
    return () => unsubscribe();
  }, [client, connected, enabled]);

  // Subscribe to notifications
  useEffect(() => {
    if (!client || !connected || !enabled) return;

    const doSubscribe = async () => {
      setLoading(true);
      try {
        const response = await client.request<{
          subscribed: boolean;
          unreadCount: number;
        }>('notifications:subscribe', {});
        
        setUnreadCount(response.unreadCount);

        // Fetch existing notifications
        const { notifications: existing } = await client.request<{
          notifications: Notification[];
        }>('notifications:list', { limit: 50 });
        
        setNotifications(existing);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    doSubscribe();
  }, [client, connected, enabled]);

  const markAsRead = useCallback(async (id: string) => {
    if (!client) return;
    await client.request('notifications:read', { notificationId: id });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, [client]);

  const markAllAsRead = useCallback(async () => {
    if (!client) return;
    await client.request('notifications:read', { all: true });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [client]);

  const deleteNotification = useCallback(async (id: string) => {
    if (!client) return;
    await client.request('notifications:delete', { notificationId: id });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, [client]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}

// ============================================================================
// Connection Quality Hook
// ============================================================================

export interface UseConnectionQualityReturn {
  quality: ConnectionQuality['status'];
  latency: number;
  isHealthy: boolean;
}

/**
 * Hook for monitoring connection quality
 */
export function useConnectionQuality(): UseConnectionQualityReturn {
  const { client, connected } = useWebSocket({ useDefault: true });
  const [quality, setQuality] = useState<ConnectionQuality['status']>('good');
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    if (!client || !connected) {
      setQuality('poor');
      return;
    }

    const checkLatency = async () => {
      const start = Date.now();
      try {
        await client.request('status', {}, 5000);
        const rtt = Date.now() - start;
        setLatency(rtt);

        if (rtt < 50) setQuality('excellent');
        else if (rtt < 100) setQuality('good');
        else if (rtt < 200) setQuality('fair');
        else setQuality('poor');
      } catch {
        setQuality('poor');
      }
    };

    checkLatency();
    const interval = setInterval(checkLatency, 30000);

    return () => clearInterval(interval);
  }, [client, connected]);

  return {
    quality,
    latency,
    isHealthy: quality !== 'poor',
  };
}

// ============================================================================
// Message Hook
// ============================================================================

/**
 * Hook for listening to specific message types
 */
export function useMessage<T = unknown>(
  type: string,
  handler: (data: T) => void
): void {
  const { client, connected } = useWebSocket({ useDefault: true });
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!client || !connected) return;

    const unsubscribe = client.onMessage(type, (data) => {
      handlerRef.current(data as T);
    });

    return () => unsubscribe();
  }, [client, connected, type]);
}

// ============================================================================
// Subscription Hook
// ============================================================================

/**
 * Hook for managing channel subscriptions
 */
export function useSubscription(
  channel: string,
  options: { enabled?: boolean; filters?: Record<string, unknown> } = {}
): { subscribed: boolean; error: Error | null } {
  const { enabled = true, filters } = options;
  const { client, connected, subscribe, unsubscribe } = useWebSocket({ useDefault: true });
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!connected || !enabled) {
      setSubscribed(false);
      return;
    }

    const doSubscribe = async () => {
      try {
        await subscribe(channel);
        setSubscribed(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    doSubscribe();

    return () => {
      unsubscribe(channel).catch(() => {});
      setSubscribed(false);
    };
  }, [connected, enabled, channel, subscribe, unsubscribe]);

  return { subscribed, error };
}
