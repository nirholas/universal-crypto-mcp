/**
 * Connection Manager
 * 
 * Manages WebSocket connections, user mappings, and channel subscriptions
 */

import type {
  Connection,
  ConnectionQuality,
  ChannelSubscription,
} from './types';
import type { WebSocket as WSWebSocket } from 'ws';

export class ConnectionManager {
  // Track active connections by socket ID
  private connections: Map<string, Connection> = new Map();
  
  // Map user IDs to their connection socket IDs
  private userConnections: Map<string, Set<string>> = new Map();
  
  // Map channels to subscribed socket IDs
  private channelSubscriptions: Map<string, Set<string>> = new Map();
  
  // Connection metadata
  private connectionMetadata: Map<string, ChannelSubscription[]> = new Map();

  // ============================================================================
  // Connection Lifecycle
  // ============================================================================

  /**
   * Add a new connection
   */
  addConnection(socket: WSWebSocket | WebSocket, userId?: string): string {
    const id = this.generateConnectionId();
    
    const connection: Connection = {
      id,
      socket,
      userId,
      channels: new Set(),
      connectedAt: Date.now(),
      lastPing: Date.now(),
      quality: {
        latency: 0,
        packetLoss: 0,
        status: 'excellent',
      },
      metadata: {},
    };

    this.connections.set(id, connection);

    if (userId) {
      this.associateUser(id, userId);
    }

    console.log(`[WS] Connection added: ${id}${userId ? ` (user: ${userId})` : ''}`);
    return id;
  }

  /**
   * Remove a connection
   */
  removeConnection(socketId: string): void {
    const connection = this.connections.get(socketId);
    if (!connection) return;

    // Remove from user mapping
    if (connection.userId) {
      const userSockets = this.userConnections.get(connection.userId);
      if (userSockets) {
        userSockets.delete(socketId);
        if (userSockets.size === 0) {
          this.userConnections.delete(connection.userId);
        }
      }
    }

    // Remove from all channel subscriptions
    for (const channel of connection.channels) {
      this.unsubscribeFromChannel(socketId, channel);
    }

    // Remove connection
    this.connections.delete(socketId);
    this.connectionMetadata.delete(socketId);

    console.log(`[WS] Connection removed: ${socketId}`);
  }

  /**
   * Get a connection by ID
   */
  getConnection(socketId: string): Connection | undefined {
    return this.connections.get(socketId);
  }

  /**
   * Get all active connections
   */
  getAllConnections(): Connection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  // ============================================================================
  // User Mapping
  // ============================================================================

  /**
   * Associate a socket with a user
   */
  associateUser(socketId: string, userId: string): void {
    const connection = this.connections.get(socketId);
    if (!connection) return;

    // Remove from previous user if any
    if (connection.userId && connection.userId !== userId) {
      const prevUserSockets = this.userConnections.get(connection.userId);
      if (prevUserSockets) {
        prevUserSockets.delete(socketId);
        if (prevUserSockets.size === 0) {
          this.userConnections.delete(connection.userId);
        }
      }
    }

    // Update connection
    connection.userId = userId;

    // Add to new user mapping
    let userSockets = this.userConnections.get(userId);
    if (!userSockets) {
      userSockets = new Set();
      this.userConnections.set(userId, userSockets);
    }
    userSockets.add(socketId);

    console.log(`[WS] User ${userId} associated with connection ${socketId}`);
  }

  /**
   * Get all connections for a user
   */
  getUserConnections(userId: string): Connection[] {
    const socketIds = this.userConnections.get(userId);
    if (!socketIds) return [];

    return Array.from(socketIds)
      .map((id) => this.connections.get(id))
      .filter((conn): conn is Connection => conn !== undefined);
  }

  /**
   * Check if a user is online
   */
  isUserOnline(userId: string): boolean {
    const sockets = this.userConnections.get(userId);
    return sockets !== undefined && sockets.size > 0;
  }

  /**
   * Get all online user IDs
   */
  getOnlineUsers(): string[] {
    return Array.from(this.userConnections.keys());
  }

  // ============================================================================
  // Channel Subscriptions
  // ============================================================================

  /**
   * Subscribe a socket to a channel
   */
  subscribeToChannel(socketId: string, channel: string, filters?: Record<string, unknown>): void {
    const connection = this.connections.get(socketId);
    if (!connection) return;

    // Add to connection's channels
    connection.channels.add(channel);

    // Add to channel subscriptions
    let subscribers = this.channelSubscriptions.get(channel);
    if (!subscribers) {
      subscribers = new Set();
      this.channelSubscriptions.set(channel, subscribers);
    }
    subscribers.add(socketId);

    // Store subscription metadata
    let metadata = this.connectionMetadata.get(socketId);
    if (!metadata) {
      metadata = [];
      this.connectionMetadata.set(socketId, metadata);
    }
    metadata.push({
      channel,
      socketId,
      subscribedAt: Date.now(),
      filters,
    });

    console.log(`[WS] ${socketId} subscribed to channel: ${channel}`);
  }

  /**
   * Unsubscribe a socket from a channel
   */
  unsubscribeFromChannel(socketId: string, channel: string): void {
    const connection = this.connections.get(socketId);
    if (connection) {
      connection.channels.delete(channel);
    }

    const subscribers = this.channelSubscriptions.get(channel);
    if (subscribers) {
      subscribers.delete(socketId);
      if (subscribers.size === 0) {
        this.channelSubscriptions.delete(channel);
      }
    }

    // Remove from metadata
    const metadata = this.connectionMetadata.get(socketId);
    if (metadata) {
      const index = metadata.findIndex((m) => m.channel === channel);
      if (index !== -1) {
        metadata.splice(index, 1);
      }
    }

    console.log(`[WS] ${socketId} unsubscribed from channel: ${channel}`);
  }

  /**
   * Get all subscribers for a channel
   */
  getChannelSubscribers(channel: string): Connection[] {
    const socketIds = this.channelSubscriptions.get(channel);
    if (!socketIds) return [];

    return Array.from(socketIds)
      .map((id) => this.connections.get(id))
      .filter((conn): conn is Connection => conn !== undefined);
  }

  /**
   * Get subscriber count for a channel
   */
  getChannelSubscriberCount(channel: string): number {
    return this.channelSubscriptions.get(channel)?.size ?? 0;
  }

  /**
   * Get all active channels
   */
  getActiveChannels(): string[] {
    return Array.from(this.channelSubscriptions.keys());
  }

  // ============================================================================
  // Connection Quality
  // ============================================================================

  /**
   * Update connection ping time
   */
  updatePing(socketId: string, latency: number): void {
    const connection = this.connections.get(socketId);
    if (!connection) return;

    connection.lastPing = Date.now();
    connection.quality.latency = latency;
    connection.quality.status = this.calculateQualityStatus(latency);
  }

  /**
   * Get stale connections (haven't pinged recently)
   */
  getStaleConnections(timeoutMs: number): Connection[] {
    const now = Date.now();
    return this.getAllConnections().filter(
      (conn) => now - conn.lastPing > timeoutMs
    );
  }

  /**
   * Calculate quality status based on latency
   */
  private calculateQualityStatus(latency: number): ConnectionQuality['status'] {
    if (latency < 50) return 'excellent';
    if (latency < 100) return 'good';
    if (latency < 200) return 'fair';
    return 'poor';
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Generate a unique connection ID
   */
  private generateConnectionId(): string {
    return `ws_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalConnections: number;
    authenticatedConnections: number;
    totalChannels: number;
    channelStats: Record<string, number>;
    onlineUsers: number;
  } {
    const channelStats: Record<string, number> = {};
    for (const [channel, subscribers] of this.channelSubscriptions) {
      channelStats[channel] = subscribers.size;
    }

    return {
      totalConnections: this.connections.size,
      authenticatedConnections: Array.from(this.connections.values()).filter(
        (c) => c.userId
      ).length,
      totalChannels: this.channelSubscriptions.size,
      channelStats,
      onlineUsers: this.userConnections.size,
    };
  }

  /**
   * Clean up (for graceful shutdown)
   */
  cleanup(): void {
    for (const connection of this.connections.values()) {
      try {
        connection.socket.close(1001, 'Server shutting down');
      } catch {
        // Ignore close errors
      }
    }
    this.connections.clear();
    this.userConnections.clear();
    this.channelSubscriptions.clear();
    this.connectionMetadata.clear();
  }
}

// Export singleton instance
export const connectionManager = new ConnectionManager();
