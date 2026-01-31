/**
 * WebSocket Server
 * 
 * Core WebSocket server with connection handling, message routing,
 * broadcasting, and channel subscriptions
 */

import { WebSocketServer, WebSocket as WSWebSocket, type RawData } from 'ws';
import type { IncomingMessage } from 'http';
import type {
  WSServerOptions,
  WSMessage,
  WSRequest,
  WSResponse,
  Connection,
} from './types';
import { ConnectionManager, connectionManager } from './connectionManager';
import { MessageRouter, messageRouter, loggingMiddleware } from './messageRouter';
import { HeartbeatManager, createHeartbeatManager } from './heartbeat';

export interface WSServerConfig {
  port: number;
  path?: string;
  maxPayloadSize?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  enableCompression?: boolean;
  enableLogging?: boolean;
  authHandler?: (request: IncomingMessage) => Promise<string | null>;
}

const DEFAULT_CONFIG: WSServerConfig = {
  port: 8080,
  path: '/ws',
  maxPayloadSize: 64 * 1024, // 64KB
  heartbeatInterval: 30000,
  heartbeatTimeout: 5000,
  enableCompression: true,
  enableLogging: true,
};

export class WebSocketServerInstance {
  private wss: WebSocketServer | null = null;
  private config: WSServerConfig;
  private connectionManager: ConnectionManager;
  private messageRouter: MessageRouter;
  private heartbeatManager: HeartbeatManager | null = null;
  private isRunning = false;
  private startTime = 0;

  constructor(
    config: Partial<WSServerConfig> = {},
    connManager?: ConnectionManager,
    msgRouter?: MessageRouter
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.connectionManager = connManager || connectionManager;
    this.messageRouter = msgRouter || messageRouter;
  }

  // ============================================================================
  // Server Lifecycle
  // ============================================================================

  /**
   * Start the WebSocket server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('WebSocket server is already running');
    }

    return new Promise((resolve, reject) => {
      try {
        this.wss = new WebSocketServer({
          port: this.config.port,
          path: this.config.path,
          maxPayload: this.config.maxPayloadSize,
          perMessageDeflate: this.config.enableCompression
            ? {
                zlibDeflateOptions: { level: 6 },
                threshold: 1024, // Only compress messages > 1KB
              }
            : false,
        });

        // Add logging middleware if enabled
        if (this.config.enableLogging) {
          this.messageRouter.use(loggingMiddleware);
        }

        // Initialize heartbeat manager
        this.heartbeatManager = createHeartbeatManager(this.connectionManager, {
          pingInterval: this.config.heartbeatInterval,
          pongTimeout: this.config.heartbeatTimeout,
        });

        // Set up event handlers
        this.wss.on('connection', (socket, request) => {
          this.handleConnection(socket, request);
        });

        this.wss.on('error', (error) => {
          console.error('[WS Server] Error:', error);
        });

        this.wss.on('listening', () => {
          this.isRunning = true;
          this.startTime = Date.now();
          console.log(`[WS Server] Started on port ${this.config.port}${this.config.path}`);
          resolve();
        });

        // Register built-in handlers
        this.registerBuiltInHandlers();

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop the WebSocket server
   */
  async stop(): Promise<void> {
    if (!this.isRunning || !this.wss) {
      return;
    }

    return new Promise((resolve) => {
      // Cleanup heartbeat
      if (this.heartbeatManager) {
        this.heartbeatManager.cleanup();
      }

      // Cleanup connections
      this.connectionManager.cleanup();

      // Close server
      this.wss!.close(() => {
        this.isRunning = false;
        this.wss = null;
        console.log('[WS Server] Stopped');
        resolve();
      });
    });
  }

  // ============================================================================
  // Connection Handling
  // ============================================================================

  /**
   * Handle new connection
   */
  private async handleConnection(
    socket: WSWebSocket,
    request: IncomingMessage
  ): Promise<void> {
    // Authenticate if handler provided
    let userId: string | undefined;
    if (this.config.authHandler) {
      try {
        const result = await this.config.authHandler(request);
        if (result) {
          userId = result;
        }
      } catch (error) {
        console.error('[WS Server] Auth error:', error);
        socket.close(4001, 'Authentication failed');
        return;
      }
    }

    // Add connection
    const socketId = this.connectionManager.addConnection(socket, userId);

    // Start heartbeat
    if (this.heartbeatManager) {
      this.heartbeatManager.startHeartbeat(socketId);
    }

    // Set up socket event handlers
    socket.on('message', (data) => {
      this.handleMessage(socketId, data);
    });

    socket.on('close', (code, reason) => {
      this.handleDisconnection(socketId, code, reason.toString());
    });

    socket.on('error', (error) => {
      console.error(`[WS Server] Socket ${socketId} error:`, error);
    });

    socket.on('pong', () => {
      if (this.heartbeatManager) {
        this.heartbeatManager.handlePong(socketId);
      }
    });

    // Send welcome message
    this.sendToSocket(socket, {
      type: 'connected',
      success: true,
      data: {
        socketId,
        authenticated: !!userId,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    });

    console.log(`[WS Server] Client connected: ${socketId}${userId ? ` (user: ${userId})` : ''}`);
  }

  /**
   * Handle disconnection
   */
  private handleDisconnection(
    socketId: string,
    code: number,
    reason: string
  ): void {
    // Stop heartbeat
    if (this.heartbeatManager) {
      this.heartbeatManager.stopHeartbeat(socketId);
    }

    // Remove connection
    this.connectionManager.removeConnection(socketId);

    console.log(`[WS Server] Client disconnected: ${socketId} (code: ${code}, reason: ${reason || 'none'})`);
  }

  /**
   * Handle incoming message
   */
  private async handleMessage(socketId: string, data: RawData): Promise<void> {
    const connection = this.connectionManager.getConnection(socketId);
    if (!connection) return;

    try {
      const message = JSON.parse(data.toString()) as WSRequest;

      // Handle pong messages specially
      if (message.type === 'pong') {
        if (this.heartbeatManager) {
          this.heartbeatManager.handlePong(socketId, message.timestamp as number);
        }
        return;
      }

      // Validate message structure
      if (!message.type || !message.id) {
        this.sendError(connection.socket, 'INVALID_MESSAGE', 'Message must have type and id');
        return;
      }

      // Route message
      const response = await this.messageRouter.route(connection, message);
      this.sendToSocket(connection.socket, response);

    } catch (error) {
      console.error(`[WS Server] Failed to handle message from ${socketId}:`, error);
      this.sendError(connection.socket, 'PARSE_ERROR', 'Failed to parse message');
    }
  }

  // ============================================================================
  // Broadcasting
  // ============================================================================

  /**
   * Broadcast message to all connected clients
   */
  broadcast(message: WSMessage, excludeSocketId?: string): void {
    const connections = this.connectionManager.getAllConnections();
    
    for (const conn of connections) {
      if (excludeSocketId && conn.id === excludeSocketId) continue;
      this.sendToSocket(conn.socket, message);
    }
  }

  /**
   * Broadcast to a specific channel
   */
  broadcastToChannel(channel: string, message: WSMessage): void {
    const subscribers = this.connectionManager.getChannelSubscribers(channel);
    
    for (const conn of subscribers) {
      this.sendToSocket(conn.socket, message);
    }
  }

  /**
   * Send message to a specific user
   */
  sendToUser(userId: string, message: WSMessage): boolean {
    const connections = this.connectionManager.getUserConnections(userId);
    
    if (connections.length === 0) {
      return false;
    }

    for (const conn of connections) {
      this.sendToSocket(conn.socket, message);
    }

    return true;
  }

  /**
   * Send message to specific socket ID
   */
  sendToSocketId(socketId: string, message: WSMessage): boolean {
    const connection = this.connectionManager.getConnection(socketId);
    if (!connection) return false;

    this.sendToSocket(connection.socket, message);
    return true;
  }

  // ============================================================================
  // Channel Management
  // ============================================================================

  /**
   * Subscribe a client to a channel
   */
  subscribe(socketId: string, channel: string, filters?: Record<string, unknown>): void {
    this.connectionManager.subscribeToChannel(socketId, channel, filters);
  }

  /**
   * Unsubscribe a client from a channel
   */
  unsubscribe(socketId: string, channel: string): void {
    this.connectionManager.unsubscribeFromChannel(socketId, channel);
  }

  // ============================================================================
  // Built-in Handlers
  // ============================================================================

  /**
   * Register built-in message handlers
   */
  private registerBuiltInHandlers(): void {
    // Subscribe to channel
    this.messageRouter.register('subscribe', async (message, connection) => {
      const { channel, filters } = message.payload as { channel: string; filters?: Record<string, unknown> };
      
      if (!channel) {
        throw new Error('Channel is required');
      }

      this.connectionManager.subscribeToChannel(connection.id, channel, filters);
      
      return {
        channel,
        subscribed: true,
      };
    });

    // Unsubscribe from channel
    this.messageRouter.register('unsubscribe', async (message, connection) => {
      const { channel } = message.payload as { channel: string };
      
      if (!channel) {
        throw new Error('Channel is required');
      }

      this.connectionManager.unsubscribeFromChannel(connection.id, channel);
      
      return {
        channel,
        unsubscribed: true,
      };
    });

    // Get server status
    this.messageRouter.register('status', async () => {
      return this.getStatus();
    });

    // Authenticate
    this.messageRouter.register('authenticate', async (message, connection) => {
      const { token, userId } = message.payload as { token?: string; userId?: string };
      
      if (userId) {
        this.connectionManager.associateUser(connection.id, userId);
        return { authenticated: true, userId };
      }

      throw new Error('Invalid authentication');
    });
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Send message to a socket
   */
  private sendToSocket(socket: WSWebSocket | WebSocket, message: WSMessage): void {
    if (socket.readyState === 1) { // OPEN state
      socket.send(JSON.stringify(message));
    }
  }

  /**
   * Send error message
   */
  private sendError(socket: WSWebSocket | WebSocket, code: string, message: string): void {
    this.sendToSocket(socket, {
      type: 'error',
      success: false,
      error: { code, message },
      timestamp: Date.now(),
    });
  }

  /**
   * Get server status
   */
  getStatus(): {
    running: boolean;
    uptime: number;
    connections: number;
    channels: number;
    port: number;
  } {
    return {
      running: this.isRunning,
      uptime: this.isRunning ? Date.now() - this.startTime : 0,
      connections: this.connectionManager.getConnectionCount(),
      channels: this.connectionManager.getActiveChannels().length,
      port: this.config.port,
    };
  }

  /**
   * Get detailed stats
   */
  getStats() {
    return {
      server: this.getStatus(),
      connections: this.connectionManager.getStats(),
      health: this.heartbeatManager?.getHealthReport() || null,
    };
  }

  /**
   * Check if server is running
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get the message router for custom handler registration
   */
  getRouter(): MessageRouter {
    return this.messageRouter;
  }

  /**
   * Get connection manager
   */
  getConnectionManager(): ConnectionManager {
    return this.connectionManager;
  }
}

// Export factory function
export function createWebSocketServer(
  config?: Partial<WSServerConfig>
): WebSocketServerInstance {
  return new WebSocketServerInstance(config);
}

// Export singleton instance
export const wsServer = new WebSocketServerInstance();
