/**
 * WebSocket Provider
 * 
 * React context provider for WebSocket connection management
 * Provides auto-connect, auto-reconnect, and connection state to children
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { WebSocketClient, createWebSocketClient, getDefaultClient } from '../lib/websocket/client';
import type { WSClientOptions, ConnectionQuality } from '../lib/websocket/types';

// ============================================================================
// Types
// ============================================================================

export interface WebSocketContextValue {
  // Connection state
  connected: boolean;
  connecting: boolean;
  reconnecting: boolean;
  error: Error | null;
  
  // Connection quality
  quality: ConnectionQuality | null;
  latency: number;
  
  // Client instance
  client: WebSocketClient | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  
  // Messaging
  send: (type: string, payload?: unknown) => void;
  request: <T>(type: string, payload?: unknown) => Promise<T>;
  
  // Subscriptions
  subscribe: (channel: string) => Promise<void>;
  unsubscribe: (channel: string) => Promise<void>;
  
  // Message handlers
  onMessage: <T>(type: string, handler: (data: T) => void) => () => void;
}

export interface WebSocketProviderProps extends PropsWithChildren {
  // WebSocket URL (defaults to env variable)
  url?: string;
  
  // Client options
  options?: Partial<WSClientOptions>;
  
  // Auto-connect on mount (default: true)
  autoConnect?: boolean;
  
  // Use singleton client (default: true)
  useSingleton?: boolean;
  
  // Auth token for authentication
  authToken?: string;
  
  // Custom error handler
  onError?: (error: Error) => void;
  
  // Custom connection handler
  onConnect?: () => void;
  
  // Custom disconnect handler
  onDisconnect?: () => void;
  
  // Loading component while connecting
  loadingComponent?: ReactNode;
  
  // Error component when connection fails
  errorComponent?: ReactNode | ((error: Error) => ReactNode);
  
  // Require connection before rendering children
  requireConnection?: boolean;
}

// ============================================================================
// Context
// ============================================================================

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

export function WebSocketProvider({
  children,
  url,
  options = {},
  autoConnect = true,
  useSingleton = true,
  authToken,
  onError,
  onConnect,
  onDisconnect,
  loadingComponent,
  errorComponent,
  requireConnection = false,
}: WebSocketProviderProps): JSX.Element {
  // State
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [quality, setQuality] = useState<ConnectionQuality | null>(null);
  const [latency, setLatency] = useState(0);
  
  // Refs
  const clientRef = useRef<WebSocketClient | null>(null);
  const mountedRef = useRef(true);
  
  // Determine WebSocket URL
  const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
  
  // Initialize client
  useEffect(() => {
    mountedRef.current = true;
    
    const clientOptions: Partial<WSClientOptions> = {
      url: wsUrl,
      authToken,
      autoConnect: false, // We handle auto-connect ourselves
      ...options,
    };
    
    // Create or get singleton client
    if (useSingleton) {
      clientRef.current = getDefaultClient(clientOptions);
    } else {
      clientRef.current = createWebSocketClient(clientOptions);
    }
    
    const client = clientRef.current;
    
    // Event handlers
    const handleConnect = () => {
      if (!mountedRef.current) return;
      setConnected(true);
      setConnecting(false);
      setReconnecting(false);
      setError(null);
      onConnect?.();
    };
    
    const handleDisconnect = () => {
      if (!mountedRef.current) return;
      setConnected(false);
      onDisconnect?.();
    };
    
    const handleReconnecting = () => {
      if (!mountedRef.current) return;
      setReconnecting(true);
    };
    
    const handleError = (err: unknown) => {
      if (!mountedRef.current) return;
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setConnecting(false);
      onError?.(error);
    };
    
    const handleQuality = (data: unknown) => {
      if (!mountedRef.current) return;
      const q = data as ConnectionQuality;
      setQuality(q);
      setLatency(q.latency);
    };
    
    // Subscribe to events
    const unsubs = [
      client.on('connect', handleConnect),
      client.on('disconnect', handleDisconnect),
      client.on('reconnecting', handleReconnecting),
      client.on('error', handleError),
      client.on('quality', handleQuality),
    ];
    
    // Set initial state
    setConnected(client.connected);
    setConnecting(client.connecting);
    
    // Auto-connect
    if (autoConnect && !client.connected && !client.connecting) {
      setConnecting(true);
      client.connect().catch(handleError);
    }
    
    // Cleanup
    return () => {
      mountedRef.current = false;
      unsubs.forEach(unsub => unsub());
      
      if (!useSingleton && clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [wsUrl, authToken, autoConnect, useSingleton, options, onConnect, onDisconnect, onError]);
  
  // Actions
  const connect = useCallback(async () => {
    const client = clientRef.current;
    if (!client || client.connected || client.connecting) return;
    
    setConnecting(true);
    setError(null);
    
    try {
      await client.connect();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, []);
  
  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
  }, []);
  
  const reconnect = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    
    client.disconnect();
    setReconnecting(true);
    
    try {
      await client.connect();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, []);
  
  const send = useCallback((type: string, payload?: unknown) => {
    clientRef.current?.send(type, payload);
  }, []);
  
  const request = useCallback(<T,>(type: string, payload?: unknown): Promise<T> => {
    if (!clientRef.current) {
      return Promise.reject(new Error('WebSocket client not initialized'));
    }
    return clientRef.current.request<T>(type, payload);
  }, []);
  
  const subscribe = useCallback(async (channel: string) => {
    await clientRef.current?.subscribe(channel);
  }, []);
  
  const unsubscribe = useCallback(async (channel: string) => {
    await clientRef.current?.unsubscribe(channel);
  }, []);
  
  const onMessage = useCallback(<T,>(type: string, handler: (data: T) => void) => {
    if (!clientRef.current) {
      return () => {};
    }
    return clientRef.current.onMessage(type, handler as (data: unknown) => void);
  }, []);
  
  // Context value
  const value: WebSocketContextValue = {
    connected,
    connecting,
    reconnecting,
    error,
    quality,
    latency,
    client: clientRef.current,
    connect,
    disconnect,
    reconnect,
    send,
    request,
    subscribe,
    unsubscribe,
    onMessage,
  };
  
  // Render
  if (requireConnection) {
    if (connecting) {
      return (
        <>
          {loadingComponent || (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <span className="ml-2">Connecting to server...</span>
            </div>
          )}
        </>
      );
    }
    
    if (error && !connected) {
      return (
        <>
          {typeof errorComponent === 'function' 
            ? errorComponent(error)
            : errorComponent || (
              <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
                <span>Connection failed: {error.message}</span>
                <button
                  onClick={connect}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            )
          }
        </>
      );
    }
  }
  
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access WebSocket context
 */
export function useWebSocketContext(): WebSocketContextValue {
  const context = useContext(WebSocketContext);
  
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  
  return context;
}

// ============================================================================
// Utility Components
// ============================================================================

/**
 * Component that renders only when connected
 */
export function WhenConnected({ children, fallback }: {
  children: ReactNode;
  fallback?: ReactNode;
}): JSX.Element {
  const { connected } = useWebSocketContext();
  return <>{connected ? children : fallback}</>;
}

/**
 * Component that renders only when disconnected
 */
export function WhenDisconnected({ children }: {
  children: ReactNode;
}): JSX.Element {
  const { connected, connecting } = useWebSocketContext();
  return <>{!connected && !connecting ? children : null}</>;
}

/**
 * Connection status indicator component
 */
export function ConnectionStatus({
  showLatency = true,
  className = '',
}: {
  showLatency?: boolean;
  className?: string;
}): JSX.Element {
  const { connected, connecting, reconnecting, latency, quality } = useWebSocketContext();
  
  const getStatusColor = () => {
    if (connecting || reconnecting) return 'bg-yellow-500';
    if (!connected) return 'bg-red-500';
    if (quality?.status === 'excellent') return 'bg-green-500';
    if (quality?.status === 'good') return 'bg-green-400';
    if (quality?.status === 'fair') return 'bg-yellow-400';
    return 'bg-red-400';
  };
  
  const getStatusText = () => {
    if (connecting) return 'Connecting...';
    if (reconnecting) return 'Reconnecting...';
    if (!connected) return 'Disconnected';
    return 'Connected';
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-sm">{getStatusText()}</span>
      {showLatency && connected && latency > 0 && (
        <span className="text-xs text-gray-500">({latency}ms)</span>
      )}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default WebSocketProvider;
