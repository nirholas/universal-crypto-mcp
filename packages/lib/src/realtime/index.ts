/**
 * Real-time Communication Layer
 * 
 * Unified WebSocket and real-time utilities.
 * 
 * Reference: /vendor/realtime/
 */

// ============================================================
// Types
// ============================================================

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

export type MessageHandler<T = unknown> = (message: WebSocketMessage<T>) => void;
export type ConnectionHandler = () => void;
export type ErrorHandler = (error: Event) => void;

// ============================================================
// WebSocket Client
// ============================================================

export class RealtimeClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            this.dispatch(message.type, message);
          } catch {
            // Handle non-JSON messages
          }
        };

        this.ws.onclose = () => {
          if (this.config.reconnect && this.reconnectAttempts < (this.config.maxReconnectAttempts || 10)) {
            setTimeout(() => {
              this.reconnectAttempts++;
              this.connect();
            }, this.config.reconnectInterval);
          }
        };

        this.ws.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send<T>(type: string, payload: T): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    const message: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
    };

    this.ws.send(JSON.stringify(message));
  }

  on<T>(type: string, handler: MessageHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as MessageHandler);

    return () => {
      this.handlers.get(type)?.delete(handler as MessageHandler);
    };
  }

  private dispatch(type: string, message: WebSocketMessage): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }

    // Also dispatch to wildcard handlers
    const wildcardHandlers = this.handlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => handler(message));
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// ============================================================
// Price Feed Types
// ============================================================

export interface PriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}

export interface OrderbookUpdate {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

// ============================================================
// Factory
// ============================================================

export function createRealtimeClient(config: WebSocketConfig): RealtimeClient {
  return new RealtimeClient(config);
}
