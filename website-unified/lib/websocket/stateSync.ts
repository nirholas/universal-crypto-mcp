/**
 * State Synchronization
 * 
 * Manages state synchronization after reconnection,
 * including optimistic updates and conflict resolution
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import type { WSMessage, SyncState, Update } from './types';
import { WebSocketClient } from './client';

export interface StateSyncConfig {
  // Enable optimistic updates
  enableOptimistic: boolean;
  // Maximum pending messages to queue
  maxQueueSize: number;
  // Sync timeout
  syncTimeout: number;
  // Enable automatic state recovery
  autoRecover: boolean;
}

export interface OptimisticUpdate<T = unknown> {
  id: string;
  type: string;
  previousState: T;
  optimisticState: T;
  createdAt: number;
  confirmed: boolean;
}

const DEFAULT_CONFIG: StateSyncConfig = {
  enableOptimistic: true,
  maxQueueSize: 100,
  syncTimeout: 10000,
  autoRecover: true,
};

export class StateSync {
  private config: StateSyncConfig;
  private client: WebSocketClient;
  private lastSeq: number = 0;
  private pendingMessages: Map<string, WSMessage> = new Map();
  private optimisticUpdates: Map<string, OptimisticUpdate> = new Map();
  private stateSnapshots: Map<string, unknown> = new Map();
  private syncInProgress = false;
  private onStateChange: ((key: string, value: unknown) => void) | null = null;
  private onConflict: ((update: OptimisticUpdate, serverState: unknown) => unknown) | null = null;

  constructor(client: WebSocketClient, config: Partial<StateSyncConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.client = client;

    this.setupEventHandlers();
  }

  // ============================================================================
  // Setup
  // ============================================================================

  /**
   * Set up event handlers
   */
  private setupEventHandlers(): void {
    // Handle reconnection
    this.client.on('connect', () => {
      if (this.config.autoRecover) {
        this.syncState();
      }
    });

    // Handle incoming updates
    this.client.onMessage('state:update', (data) => {
      this.handleStateUpdate(data as Update);
    });

    // Handle sync response
    this.client.onMessage('state:sync', (data) => {
      this.handleSyncResponse(data as { seq: number; state: Record<string, unknown> });
    });
  }

  // ============================================================================
  // Optimistic Updates
  // ============================================================================

  /**
   * Apply an optimistic update
   */
  optimisticUpdate<T>(
    key: string,
    updater: (current: T | undefined) => T,
    rollback?: (current: T) => T
  ): string {
    const updateId = this.generateUpdateId();
    const currentState = this.stateSnapshots.get(key) as T | undefined;
    const newState = updater(currentState);

    // Store optimistic update
    this.optimisticUpdates.set(updateId, {
      id: updateId,
      type: key,
      previousState: currentState,
      optimisticState: newState,
      createdAt: Date.now(),
      confirmed: false,
    });

    // Apply optimistically
    this.stateSnapshots.set(key, newState);
    
    if (this.onStateChange) {
      this.onStateChange(key, newState);
    }

    return updateId;
  }

  /**
   * Confirm an optimistic update
   */
  confirmUpdate(updateId: string): void {
    const update = this.optimisticUpdates.get(updateId);
    if (update) {
      update.confirmed = true;
      // Clean up after confirmation
      setTimeout(() => {
        this.optimisticUpdates.delete(updateId);
      }, 5000);
    }
  }

  /**
   * Rollback an optimistic update
   */
  rollbackUpdate(updateId: string): void {
    const update = this.optimisticUpdates.get(updateId);
    if (update && !update.confirmed) {
      // Restore previous state
      this.stateSnapshots.set(update.type, update.previousState);
      this.optimisticUpdates.delete(updateId);

      if (this.onStateChange) {
        this.onStateChange(update.type, update.previousState);
      }
    }
  }

  /**
   * Rollback all pending optimistic updates
   */
  rollbackAll(): void {
    for (const [id, update] of this.optimisticUpdates) {
      if (!update.confirmed) {
        this.rollbackUpdate(id);
      }
    }
  }

  // ============================================================================
  // State Sync
  // ============================================================================

  /**
   * Request full state sync from server
   */
  async syncState(): Promise<void> {
    if (this.syncInProgress) return;

    this.syncInProgress = true;

    try {
      await this.client.request('state:sync', {
        lastSeq: this.lastSeq,
        keys: Array.from(this.stateSnapshots.keys()),
      });
    } catch (error) {
      console.error('[StateSync] Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Handle sync response
   */
  private handleSyncResponse(data: { seq: number; state: Record<string, unknown> }): void {
    this.lastSeq = data.seq;

    // Apply server state
    for (const [key, value] of Object.entries(data.state)) {
      const pendingUpdate = this.findPendingUpdateForKey(key);

      if (pendingUpdate && !pendingUpdate.confirmed) {
        // Conflict resolution
        if (this.onConflict) {
          const resolved = this.onConflict(pendingUpdate, value);
          this.stateSnapshots.set(key, resolved);
        } else {
          // Default: server wins
          this.stateSnapshots.set(key, value);
        }
        this.optimisticUpdates.delete(pendingUpdate.id);
      } else {
        this.stateSnapshots.set(key, value);
      }

      if (this.onStateChange) {
        this.onStateChange(key, this.stateSnapshots.get(key));
      }
    }
  }

  /**
   * Handle state update from server
   */
  private handleStateUpdate(update: Update): void {
    // Check sequence number
    if (update.id && typeof update.timestamp === 'number') {
      this.lastSeq = update.timestamp;
    }

    const key = update.type;
    const pendingUpdate = this.findPendingUpdateForKey(key);

    if (pendingUpdate && !pendingUpdate.confirmed) {
      // Check if this confirms our optimistic update
      if (this.statesMatch(pendingUpdate.optimisticState, update.data)) {
        this.confirmUpdate(pendingUpdate.id);
      } else {
        // Conflict - apply server state
        if (this.onConflict) {
          const resolved = this.onConflict(pendingUpdate, update.data);
          this.stateSnapshots.set(key, resolved);
        } else {
          this.stateSnapshots.set(key, update.data);
        }
        this.optimisticUpdates.delete(pendingUpdate.id);
      }
    } else {
      this.stateSnapshots.set(key, update.data);
    }

    if (this.onStateChange) {
      this.onStateChange(key, this.stateSnapshots.get(key));
    }
  }

  // ============================================================================
  // Message Queue
  // ============================================================================

  /**
   * Queue a message for sending
   */
  queueMessage(message: WSMessage): void {
    if (this.pendingMessages.size >= this.config.maxQueueSize) {
      // Remove oldest message
      const oldestKey = this.pendingMessages.keys().next().value;
      if (oldestKey) {
        this.pendingMessages.delete(oldestKey);
      }
    }

    this.pendingMessages.set(message.id || this.generateUpdateId(), message);
  }

  /**
   * Get queued messages
   */
  getQueuedMessages(): WSMessage[] {
    return Array.from(this.pendingMessages.values());
  }

  /**
   * Clear message queue
   */
  clearQueue(): void {
    this.pendingMessages.clear();
  }

  // ============================================================================
  // State Management
  // ============================================================================

  /**
   * Get current state for a key
   */
  getState<T>(key: string): T | undefined {
    return this.stateSnapshots.get(key) as T | undefined;
  }

  /**
   * Set state directly
   */
  setState<T>(key: string, value: T): void {
    this.stateSnapshots.set(key, value);
    
    if (this.onStateChange) {
      this.onStateChange(key, value);
    }
  }

  /**
   * Delete state
   */
  deleteState(key: string): void {
    this.stateSnapshots.delete(key);
  }

  /**
   * Get all state
   */
  getAllState(): Record<string, unknown> {
    const state: Record<string, unknown> = {};
    for (const [key, value] of this.stateSnapshots) {
      state[key] = value;
    }
    return state;
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Set state change handler
   */
  onStateChangeHandler(handler: (key: string, value: unknown) => void): void {
    this.onStateChange = handler;
  }

  /**
   * Set conflict resolution handler
   */
  onConflictHandler(
    handler: (update: OptimisticUpdate, serverState: unknown) => unknown
  ): void {
    this.onConflict = handler;
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Generate unique update ID
   */
  private generateUpdateId(): string {
    return `upd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Find pending update for a key
   */
  private findPendingUpdateForKey(key: string): OptimisticUpdate | undefined {
    for (const update of this.optimisticUpdates.values()) {
      if (update.type === key && !update.confirmed) {
        return update;
      }
    }
    return undefined;
  }

  /**
   * Check if two states match (deep comparison)
   */
  private statesMatch(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  /**
   * Get sync state
   */
  getSyncState(): SyncState {
    return {
      lastSeq: this.lastSeq,
      subscriptions: this.client.getSubscriptions(),
      pendingMessages: this.getQueuedMessages(),
      optimisticUpdates: this.optimisticUpdates,
    };
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      lastSeq: this.lastSeq,
      pendingMessages: this.pendingMessages.size,
      optimisticUpdates: this.optimisticUpdates.size,
      confirmedUpdates: Array.from(this.optimisticUpdates.values()).filter((u) => u.confirmed).length,
      stateKeys: this.stateSnapshots.size,
      syncInProgress: this.syncInProgress,
    };
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.pendingMessages.clear();
    this.optimisticUpdates.clear();
    this.stateSnapshots.clear();
    this.lastSeq = 0;
  }
}

// Export factory function
export function createStateSync(
  client: WebSocketClient,
  config?: Partial<StateSyncConfig>
): StateSync {
  return new StateSync(client, config);
}
