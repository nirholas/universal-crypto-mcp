/**
 * Heartbeat System
 * 
 * Manages connection health through ping/pong mechanism
 * with connection timeout detection and quality monitoring
 */

import type { Connection, ConnectionQuality } from './types';
import { ConnectionManager } from './connectionManager';

export interface HeartbeatConfig {
  // Interval between ping messages (ms)
  pingInterval: number;
  // Time to wait for pong response (ms)
  pongTimeout: number;
  // How many missed pongs before disconnect
  maxMissedPongs: number;
  // Enable latency tracking
  trackLatency: boolean;
}

export interface HeartbeatStats {
  totalPingsSent: number;
  totalPongsReceived: number;
  missedPongs: number;
  averageLatency: number;
  lastPingTime: number;
  connectionQuality: ConnectionQuality['status'];
}

const DEFAULT_CONFIG: HeartbeatConfig = {
  pingInterval: 30000, // 30 seconds
  pongTimeout: 5000,   // 5 seconds
  maxMissedPongs: 3,   // Disconnect after 3 missed pongs
  trackLatency: true,
};

export class HeartbeatManager {
  private config: HeartbeatConfig;
  private connectionManager: ConnectionManager;
  private pingTimers: Map<string, NodeJS.Timeout> = new Map();
  private pongTimers: Map<string, NodeJS.Timeout> = new Map();
  private pendingPings: Map<string, number> = new Map(); // socketId -> pingTimestamp
  private missedPongs: Map<string, number> = new Map();
  private latencyHistory: Map<string, number[]> = new Map();
  private stats: Map<string, HeartbeatStats> = new Map();
  private globalStats = {
    totalPingsSent: 0,
    totalPongsReceived: 0,
    totalMissedPongs: 0,
    totalDisconnections: 0,
  };

  constructor(
    connectionManager: ConnectionManager,
    config: Partial<HeartbeatConfig> = {}
  ) {
    this.connectionManager = connectionManager;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Start heartbeat for a connection
   */
  startHeartbeat(socketId: string): void {
    // Clear any existing timers
    this.stopHeartbeat(socketId);

    // Initialize stats
    this.stats.set(socketId, {
      totalPingsSent: 0,
      totalPongsReceived: 0,
      missedPongs: 0,
      averageLatency: 0,
      lastPingTime: 0,
      connectionQuality: 'excellent',
    });
    this.missedPongs.set(socketId, 0);
    this.latencyHistory.set(socketId, []);

    // Start ping interval
    this.schedulePing(socketId);
    
    console.log(`[Heartbeat] Started for connection: ${socketId}`);
  }

  /**
   * Stop heartbeat for a connection
   */
  stopHeartbeat(socketId: string): void {
    // Clear timers
    const pingTimer = this.pingTimers.get(socketId);
    if (pingTimer) {
      clearInterval(pingTimer);
      this.pingTimers.delete(socketId);
    }

    const pongTimer = this.pongTimers.get(socketId);
    if (pongTimer) {
      clearTimeout(pongTimer);
      this.pongTimers.delete(socketId);
    }

    // Clear state
    this.pendingPings.delete(socketId);
    this.missedPongs.delete(socketId);
    this.latencyHistory.delete(socketId);
    this.stats.delete(socketId);

    console.log(`[Heartbeat] Stopped for connection: ${socketId}`);
  }

  // ============================================================================
  // Ping/Pong Handling
  // ============================================================================

  /**
   * Schedule the next ping
   */
  private schedulePing(socketId: string): void {
    const timer = setInterval(() => {
      this.sendPing(socketId);
    }, this.config.pingInterval);

    this.pingTimers.set(socketId, timer);

    // Send initial ping
    this.sendPing(socketId);
  }

  /**
   * Send a ping to a connection
   */
  private sendPing(socketId: string): void {
    const connection = this.connectionManager.getConnection(socketId);
    if (!connection) {
      this.stopHeartbeat(socketId);
      return;
    }

    const pingTime = Date.now();
    this.pendingPings.set(socketId, pingTime);

    // Update stats
    const stats = this.stats.get(socketId);
    if (stats) {
      stats.totalPingsSent++;
      stats.lastPingTime = pingTime;
    }
    this.globalStats.totalPingsSent++;

    // Send ping message
    const pingMessage = JSON.stringify({
      type: 'ping',
      timestamp: pingTime,
    });

    try {
      connection.socket.send(pingMessage);
    } catch (error) {
      console.error(`[Heartbeat] Failed to send ping to ${socketId}:`, error);
      this.handleMissedPong(socketId);
      return;
    }

    // Set pong timeout
    const pongTimer = setTimeout(() => {
      this.handlePongTimeout(socketId);
    }, this.config.pongTimeout);

    this.pongTimers.set(socketId, pongTimer);
  }

  /**
   * Handle pong response
   */
  handlePong(socketId: string, timestamp?: number): void {
    // Clear pong timeout
    const pongTimer = this.pongTimers.get(socketId);
    if (pongTimer) {
      clearTimeout(pongTimer);
      this.pongTimers.delete(socketId);
    }

    // Calculate latency
    const pingTime = this.pendingPings.get(socketId);
    if (pingTime) {
      const latency = Date.now() - pingTime;
      this.pendingPings.delete(socketId);

      // Update connection manager with latency
      this.connectionManager.updatePing(socketId, latency);

      // Track latency history
      if (this.config.trackLatency) {
        const history = this.latencyHistory.get(socketId) || [];
        history.push(latency);
        // Keep last 10 readings
        if (history.length > 10) {
          history.shift();
        }
        this.latencyHistory.set(socketId, history);

        // Update stats
        const stats = this.stats.get(socketId);
        if (stats) {
          stats.totalPongsReceived++;
          stats.averageLatency = this.calculateAverageLatency(history);
          stats.connectionQuality = this.getQualityStatus(stats.averageLatency);
        }
      }
    }

    // Reset missed pongs counter
    this.missedPongs.set(socketId, 0);
    this.globalStats.totalPongsReceived++;
  }

  /**
   * Handle pong timeout
   */
  private handlePongTimeout(socketId: string): void {
    console.warn(`[Heartbeat] Pong timeout for connection: ${socketId}`);
    this.pongTimers.delete(socketId);
    this.handleMissedPong(socketId);
  }

  /**
   * Handle missed pong
   */
  private handleMissedPong(socketId: string): void {
    const missed = (this.missedPongs.get(socketId) || 0) + 1;
    this.missedPongs.set(socketId, missed);
    this.globalStats.totalMissedPongs++;

    const stats = this.stats.get(socketId);
    if (stats) {
      stats.missedPongs = missed;
    }

    console.warn(`[Heartbeat] Connection ${socketId} missed ${missed}/${this.config.maxMissedPongs} pongs`);

    if (missed >= this.config.maxMissedPongs) {
      this.handleConnectionDead(socketId);
    }
  }

  /**
   * Handle dead connection
   */
  private handleConnectionDead(socketId: string): void {
    console.error(`[Heartbeat] Connection ${socketId} is dead, removing...`);
    
    // Stop heartbeat
    this.stopHeartbeat(socketId);

    // Get connection and close it
    const connection = this.connectionManager.getConnection(socketId);
    if (connection) {
      try {
        connection.socket.close(1001, 'Connection timeout');
      } catch {
        // Ignore close errors
      }
    }

    // Remove from connection manager
    this.connectionManager.removeConnection(socketId);
  }

  // ============================================================================
  // Health Status
  // ============================================================================

  /**
   * Get connection health status
   */
  getConnectionHealth(socketId: string): {
    isAlive: boolean;
    quality: ConnectionQuality['status'];
    latency: number;
    missedPongs: number;
    uptime: number;
  } | null {
    const connection = this.connectionManager.getConnection(socketId);
    if (!connection) return null;

    const stats = this.stats.get(socketId);
    const missed = this.missedPongs.get(socketId) || 0;

    return {
      isAlive: missed < this.config.maxMissedPongs,
      quality: stats?.connectionQuality || 'unknown' as ConnectionQuality['status'],
      latency: stats?.averageLatency || 0,
      missedPongs: missed,
      uptime: Date.now() - connection.connectedAt,
    };
  }

  /**
   * Get overall health report
   */
  getHealthReport(): {
    totalConnections: number;
    healthyConnections: number;
    unhealthyConnections: number;
    averageLatency: number;
    qualityDistribution: Record<ConnectionQuality['status'], number>;
    globalStats: {
      totalPingsSent: number;
      totalPongsReceived: number;
      totalMissedPongs: number;
      totalDisconnections: number;
    };
  } {
    const connections = this.connectionManager.getAllConnections();
    let totalLatency = 0;
    let latencyCount = 0;
    const qualityDistribution: Record<ConnectionQuality['status'], number> = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
    };

    let healthyCount = 0;

    for (const conn of connections) {
      const health = this.getConnectionHealth(conn.id);
      if (health) {
        if (health.isAlive) healthyCount++;
        if (health.latency > 0) {
          totalLatency += health.latency;
          latencyCount++;
        }
        qualityDistribution[health.quality]++;
      }
    }

    return {
      totalConnections: connections.length,
      healthyConnections: healthyCount,
      unhealthyConnections: connections.length - healthyCount,
      averageLatency: latencyCount > 0 ? totalLatency / latencyCount : 0,
      qualityDistribution,
      globalStats: { ...this.globalStats },
    };
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Calculate average latency from history
   */
  private calculateAverageLatency(history: number[]): number {
    if (history.length === 0) return 0;
    return history.reduce((sum, val) => sum + val, 0) / history.length;
  }

  /**
   * Get quality status from latency
   */
  private getQualityStatus(latency: number): ConnectionQuality['status'] {
    if (latency < 50) return 'excellent';
    if (latency < 100) return 'good';
    if (latency < 200) return 'fair';
    return 'poor';
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<HeartbeatConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Force ping a specific connection
   */
  forcePing(socketId: string): void {
    this.sendPing(socketId);
  }

  /**
   * Cleanup (for graceful shutdown)
   */
  cleanup(): void {
    // Clear all timers
    for (const timer of this.pingTimers.values()) {
      clearInterval(timer);
    }
    for (const timer of this.pongTimers.values()) {
      clearTimeout(timer);
    }

    this.pingTimers.clear();
    this.pongTimers.clear();
    this.pendingPings.clear();
    this.missedPongs.clear();
    this.latencyHistory.clear();
    this.stats.clear();
  }
}

// Factory function for creating HeartbeatManager
export function createHeartbeatManager(
  connectionManager: ConnectionManager,
  config?: Partial<HeartbeatConfig>
): HeartbeatManager {
  return new HeartbeatManager(connectionManager, config);
}
