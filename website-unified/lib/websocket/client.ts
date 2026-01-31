/**
 * WebSocket Client
 * 
 * Client-side WebSocket wrapper with automatic reconnection,
 * message queuing, and request/response matching
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import type {
  WSClientOptions,
  WSMessage,
  WSRequest,
  WSResponse,
  WSEventType,
  EventHandler,
} from './types';
import { ReconnectionManager, createReconnectionManager } from './reconnection';

export interface PendingRequest {
  id: string;
  type: string;
  resolve: (response: WSResponse) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
  createdAt: number;
}

export interface ClientStats {
  connected: boolean;
  reconnectAttempts: number;
  messagesSent: number;
  messagesReceived: number;
  pendingRequests: number;
  queuedMessages: number;
  lastConnectedAt: number | null;
  lastDisconnectedAt: number | null;
  uptime: number;
}

const DEFAULT_OPTIONS: WSClientOptions = {
  url: 'ws://localhost:8080/ws',
  autoConnect: true,
  autoReconnect: true,
  reconnectMaxAttempts: 10,
  reconnectBaseDelay: 1000,
  reconnectMaxDelay: 30000,
  heartbeatInterval: 30000,
  debug: false,
};

export class WebSocketClient {
  private options: WSClientOptions;
  private socket: WebSocket | null = null;
  private reconnectionManager: ReconnectionManager;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private messageQueue: WSMessage[] = [];
  private eventHandlers: Map<WSEventType, Set<EventHandler>> = new Map();
  private messageHandlers: Map<string, Set<(data: unknown) => void>> = new Map();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private messageIdCounter = 0;
  private seqCounter = 0;
  private isConnected = false;
  private isConnecting = false;
  private lastConnectedAt: number | null = null;
  private lastDisconnectedAt: number | null = null;
  private subscriptions: Set<string> = new Set();

  // Stats
  private stats = {
    messagesSent: 0,
    messagesReceived: 0,
  };

  constructor(options: Partial<WSClientOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    this.reconnectionManager = createReconnectionManager({
      maxAttempts: this.options.reconnectMaxAttempts,
      baseDelay: this.options.reconnectBaseDelay,
      maxDelay: this.options.reconnectMaxDelay,
      onReconnect: () => this.connect(),
      onMaxAttemptsReached: () => this.handleMaxReconnectAttempts(),
    });

    if (this.options.autoConnect) {
      this.connect();
    }
  }

  // ============================================================================
  // Connection Lifecycle
  // ============================================================================

  /**
   * Connect to the WebSocket server
   */
  connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.isConnecting = true;
      this.log('Connecting to', this.options.url);

      try {
        this.socket = new WebSocket(this.options.url);

        this.socket.onopen = () => {
          this.handleOpen();
          resolve();
        };

        this.socket.onclose = (event) => {
          this.handleClose(event);
        };

        this.socket.onerror = (event) => {
          this.handleError(event);
          if (this.isConnecting) {
            reject(new Error('WebSocket connection failed'));
          }
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the server
   */
  disconnect(code: number = 1000, reason: string = 'Client disconnect'): void {
    this.reconnectionManager.stop();
    
    if (this.socket) {
      this.socket.close(code, reason);
      this.socket = null;
    }

    this.cleanup();
    this.emit('disconnect', { code, reason });
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Check if connecting
   */
  get connecting(): boolean {
    return this.isConnecting;
  }

  // ============================================================================
  // Message Sending
  // ============================================================================

  /**
   * Send a message (fire and forget)
   */
  send(type: string, payload: unknown = {}): void {
    const message: WSMessage = {
      type,
      payload,
      id: this.generateMessageId(),
      timestamp: Date.now(),
      seq: ++this.seqCounter,
    };

    this.sendRaw(message);
  }

  /**
   * Send a request and wait for response
   */
  request<T = unknown>(
    type: string,
    payload: unknown = {},
    timeout: number = 30000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = this.generateMessageId();
      
      const message: WSRequest = {
        type,
        payload,
        id,
        requestId: id,
        timestamp: Date.now(),
        seq: ++this.seqCounter,
      };

      // Set up timeout
      const timeoutId = setTimeout(() => {
        const pending = this.pendingRequests.get(id);
        if (pending) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout: ${type}`));
        }
      }, timeout);

      // Store pending request
      this.pendingRequests.set(id, {
        id,
        type,
        resolve: (response: WSResponse) => resolve(response.payload as T),
        reject,
        timeout: timeoutId,
        createdAt: Date.now(),
      });

      // Send the message
      this.sendRaw(message);
    });
  }

  /**
   * Send raw message
   */
  private sendRaw(message: WSMessage): void {
    if (!this.isConnected || !this.socket) {
      // Queue message for later
      this.messageQueue.push(message);
      this.log('Message queued:', message.type);
      return;
    }

    try {
      this.socket.send(JSON.stringify(message));
      this.stats.messagesSent++;
      this.log('Sent:', message.type);
    } catch (error) {
      this.log('Send error:', error);
      this.messageQueue.push(message);
    }
  }

  /**
   * Flush queued messages
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendRaw(message);
      }
    }
  }

  // ============================================================================
  // Subscriptions
  // ============================================================================

  /**
   * Subscribe to a channel
   */
  async subscribe(channel: string, filters?: Record<string, unknown>): Promise<void> {
    await this.request('subscribe', { channel, filters });
    this.subscriptions.add(channel);
    this.log('Subscribed to:', channel);
  }

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(channel: string): Promise<void> {
    await this.request('unsubscribe', { channel });
    this.subscriptions.delete(channel);
    this.log('Unsubscribed from:', channel);
  }

  /**
   * Get current subscriptions
   */
  getSubscriptions(): string[] {
    return Array.from(this.subscriptions);
  }

  /**
   * Resubscribe to all channels after reconnect
   */
  private async resubscribe(): Promise<void> {
    for (const channel of this.subscriptions) {
      try {
        await this.request('subscribe', { channel });
        this.log('Resubscribed to:', channel);
      } catch (error) {
        this.log('Resubscribe failed for:', channel, error);
      }
    }
  }

  // ============================================================================
  // Event Handling
  // ============================================================================

  /**
   * Add event listener
   */
  on(event: WSEventType, handler: EventHandler): () => void {
    let handlers = this.eventHandlers.get(event);
    if (!handlers) {
      handlers = new Set();
      this.eventHandlers.set(event, handlers);
    }
    handlers.add(handler);

    // Return unsubscribe function
    return () => {
      handlers?.delete(handler);
    };
  }

  /**
   * Remove event listener
   */
  off(event: WSEventType, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Add message type handler
   */
  onMessage(type: string, handler: (data: unknown) => void): () => void {
    let handlers = this.messageHandlers.get(type);
    if (!handlers) {
      handlers = new Set();
      this.messageHandlers.set(type, handlers);
    }
    handlers.add(handler);

    return () => {
      handlers?.delete(handler);
    };
  }

  /**
   * Remove message type handler
   */
  offMessage(type: string, handler: (data: unknown) => void): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit event to handlers
   */
  private emit(event: WSEventType, data?: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  // ============================================================================
  // Socket Event Handlers
  // ============================================================================

  /**
   * Handle connection open
   */
  private handleOpen(): void {
    this.isConnected = true;
    this.isConnecting = false;
    this.lastConnectedAt = Date.now();
    this.reconnectionManager.reset();

    this.log('Connected');
    this.startHeartbeat();
    this.flushMessageQueue();
    
    // Authenticate if token provided
    if (this.options.authToken) {
      this.authenticate(this.options.authToken);
    }

    // Resubscribe to channels
    if (this.subscriptions.size > 0) {
      this.resubscribe();
    }

    this.emit('connect', { timestamp: Date.now() });
  }

  /**
   * Handle connection close
   */
  private handleClose(event: CloseEvent): void {
    const wasConnected = this.isConnected;
    this.isConnected = false;
    this.isConnecting = false;
    this.lastDisconnectedAt = Date.now();

    this.stopHeartbeat();
    this.log('Disconnected:', event.code, event.reason);

    // Reject all pending requests
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Connection closed'));
      this.pendingRequests.delete(id);
    }

    this.emit('disconnect', { code: event.code, reason: event.reason });

    // Auto reconnect if enabled and not intentional close
    if (this.options.autoReconnect && wasConnected && event.code !== 1000) {
      this.emit('reconnecting', { attempt: this.reconnectionManager.attempts + 1 });
      this.reconnectionManager.scheduleReconnect();
    }
  }

  /**
   * Handle connection error
   */
  private handleError(event: Event): void {
    this.log('Error:', event);
    this.emit('error', event);
  }

  /**
   * Handle incoming message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as WSMessage;
      this.stats.messagesReceived++;

      // Handle pong
      if (message.type === 'ping') {
        this.sendPong(message.timestamp as number);
        return;
      }

      // Handle response to pending request
      if (message.id && this.pendingRequests.has(message.id)) {
        const pending = this.pendingRequests.get(message.id)!;
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(message.id);

        const response = message as WSResponse;
        if (response.success === false && response.error) {
          pending.reject(new Error(response.error.message || 'Request failed'));
        } else {
          pending.resolve(response);
        }
        return;
      }

      // Emit message event
      this.emit('message', message);

      // Call type-specific handlers
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(message.payload);
          } catch (error) {
            console.error(`Error in message handler for ${message.type}:`, error);
          }
        });
      }

    } catch (error) {
      this.log('Failed to parse message:', error);
    }
  }

  // ============================================================================
  // Heartbeat
  // ============================================================================

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    if (!this.options.heartbeatInterval) return;

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send('pong', { timestamp: Date.now() });
      }
    }, this.options.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Send pong response
   */
  private sendPong(timestamp?: number): void {
    this.send('pong', { timestamp: timestamp || Date.now() });
  }

  // ============================================================================
  // Authentication
  // ============================================================================

  /**
   * Authenticate with the server
   */
  async authenticate(token: string): Promise<boolean> {
    try {
      const response = await this.request<{ authenticated: boolean }>('authenticate', { token });
      return response.authenticated;
    } catch {
      return false;
    }
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${++this.messageIdCounter}`;
  }

  /**
   * Handle max reconnect attempts reached
   */
  private handleMaxReconnectAttempts(): void {
    this.log('Max reconnection attempts reached');
    this.emit('error', new Error('Max reconnection attempts reached'));
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.isConnected = false;
    this.isConnecting = false;
    this.stopHeartbeat();
    
    // Clear pending requests
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      this.pendingRequests.delete(id);
    }
  }

  /**
   * Log message if debug enabled
   */
  private log(...args: unknown[]): void {
    if (this.options.debug) {
      console.log('[WSClient]', ...args);
    }
  }

  /**
   * Get client statistics
   */
  getStats(): ClientStats {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectionManager.attempts,
      messagesSent: this.stats.messagesSent,
      messagesReceived: this.stats.messagesReceived,
      pendingRequests: this.pendingRequests.size,
      queuedMessages: this.messageQueue.length,
      lastConnectedAt: this.lastConnectedAt,
      lastDisconnectedAt: this.lastDisconnectedAt,
      uptime: this.lastConnectedAt && this.isConnected
        ? Date.now() - this.lastConnectedAt
        : 0,
    };
  }

  /**
   * Update options
   */
  updateOptions(options: Partial<WSClientOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Destroy the client
   */
  destroy(): void {
    this.disconnect(1000, 'Client destroyed');
    this.eventHandlers.clear();
    this.messageHandlers.clear();
    this.subscriptions.clear();
    this.messageQueue.length = 0;
  }
}

// Export factory function
export function createWebSocketClient(
  options?: Partial<WSClientOptions>
): WebSocketClient {
  return new WebSocketClient(options);
}

// Export singleton for convenience
let defaultClient: WebSocketClient | null = null;

export function getDefaultClient(options?: Partial<WSClientOptions>): WebSocketClient {
  if (!defaultClient) {
    defaultClient = new WebSocketClient({ ...options, autoConnect: false });
  }
  return defaultClient;
}
