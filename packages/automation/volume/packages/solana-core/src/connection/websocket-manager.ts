/**
 * WebSocket Manager
 * Manages Solana WebSocket subscriptions with automatic reconnection
 */

import {
  Connection,
  PublicKey,
  AccountInfo,
  GetProgramAccountsFilter,
  SignatureStatus,
  Context,
} from '@solana/web3.js';
import { RpcEndpoint } from '../types.js';
import { logger, logSubscription } from '../utils/logger.js';

type AccountCallback = (accountInfo: AccountInfo<Buffer>, slot: number) => void;
type ProgramCallback = (keyedAccountInfo: { pubkey: PublicKey; accountInfo: AccountInfo<Buffer> }) => void;
type SlotCallback = (slot: number) => void;
type SignatureCallback = (result: SignatureStatus | null, context: Context) => void;

interface Subscription {
  id: number;
  type: 'account' | 'program' | 'slot' | 'signature';
  target: string;
  wsSubscriptionId?: number;
  callback: AccountCallback | ProgramCallback | SlotCallback | SignatureCallback;
  filters?: GetProgramAccountsFilter[];
}

export class WebSocketManager {
  private connection: Connection;
  private subscriptions: Map<number, Subscription> = new Map();
  private nextSubscriptionId: number = 1;
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 10;
  private isConnected: boolean = false;

  constructor(
    private readonly endpoint: RpcEndpoint,
    private readonly commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
  ) {
    const wsUrl = endpoint.wsUrl || endpoint.url.replace('https://', 'wss://').replace('http://', 'ws://');
    this.connection = new Connection(endpoint.url, {
      commitment: this.commitment,
      wsEndpoint: wsUrl,
    });
    this.isConnected = true;
    
    logger.info('WebSocket manager initialized', { endpoint: endpoint.name });
  }

  /**
   * Subscribe to account changes
   */
  subscribeToAccount(pubkey: PublicKey, callback: AccountCallback): number {
    const subscriptionId = this.nextSubscriptionId++;
    
    try {
      const wsSubId = this.connection.onAccountChange(
        pubkey,
        (accountInfo, context) => {
          callback(accountInfo, context.slot);
        },
        this.commitment
      );

      const subscription: Subscription = {
        id: subscriptionId,
        type: 'account',
        target: pubkey.toBase58(),
        wsSubscriptionId: wsSubId,
        callback,
      };

      this.subscriptions.set(subscriptionId, subscription);
      logSubscription('account', subscriptionId, pubkey.toBase58());
      
      return subscriptionId;
    } catch (error) {
      logger.error('Failed to subscribe to account', { 
        pubkey: pubkey.toBase58(), 
        error: (error as Error).message 
      });
      throw error;
    }
  }

  /**
   * Subscribe to program account changes
   */
  subscribeToProgramAccounts(
    programId: PublicKey,
    filters: GetProgramAccountsFilter[],
    callback: ProgramCallback
  ): number {
    const subscriptionId = this.nextSubscriptionId++;
    
    try {
      const wsSubId = this.connection.onProgramAccountChange(
        programId,
        (keyedAccountInfo) => {
          callback({
            pubkey: keyedAccountInfo.accountId,
            accountInfo: keyedAccountInfo.accountInfo,
          });
        },
        this.commitment,
        filters
      );

      const subscription: Subscription = {
        id: subscriptionId,
        type: 'program',
        target: programId.toBase58(),
        wsSubscriptionId: wsSubId,
        callback,
        filters,
      };

      this.subscriptions.set(subscriptionId, subscription);
      logSubscription('program', subscriptionId, programId.toBase58());
      
      return subscriptionId;
    } catch (error) {
      logger.error('Failed to subscribe to program accounts', { 
        programId: programId.toBase58(), 
        error: (error as Error).message 
      });
      throw error;
    }
  }

  /**
   * Subscribe to slot changes
   */
  subscribeToSlot(callback: SlotCallback): number {
    const subscriptionId = this.nextSubscriptionId++;
    
    try {
      const wsSubId = this.connection.onSlotChange((slotInfo) => {
        callback(slotInfo.slot);
      });

      const subscription: Subscription = {
        id: subscriptionId,
        type: 'slot',
        target: 'slot',
        wsSubscriptionId: wsSubId,
        callback,
      };

      this.subscriptions.set(subscriptionId, subscription);
      logSubscription('slot', subscriptionId, 'slot');
      
      return subscriptionId;
    } catch (error) {
      logger.error('Failed to subscribe to slot', { error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Subscribe to signature status
   */
  subscribeToSignature(signature: string, callback: SignatureCallback): number {
    const subscriptionId = this.nextSubscriptionId++;
    
    try {
      const wsSubId = this.connection.onSignature(
        signature,
        (result, context) => {
          callback(result.err ? null : { slot: context.slot } as SignatureStatus, context);
          // Auto-unsubscribe after receiving status
          this.unsubscribe(subscriptionId);
        },
        this.commitment
      );

      const subscription: Subscription = {
        id: subscriptionId,
        type: 'signature',
        target: signature,
        wsSubscriptionId: wsSubId,
        callback,
      };

      this.subscriptions.set(subscriptionId, subscription);
      logSubscription('signature', subscriptionId, signature.slice(0, 16) + '...');
      
      return subscriptionId;
    } catch (error) {
      logger.error('Failed to subscribe to signature', { 
        signature: signature.slice(0, 16) + '...', 
        error: (error as Error).message 
      });
      throw error;
    }
  }

  /**
   * Unsubscribe from a subscription
   */
  async unsubscribe(subscriptionId: number): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || subscription.wsSubscriptionId === undefined) {
      return;
    }

    try {
      switch (subscription.type) {
        case 'account':
          await this.connection.removeAccountChangeListener(subscription.wsSubscriptionId);
          break;
        case 'program':
          await this.connection.removeProgramAccountChangeListener(subscription.wsSubscriptionId);
          break;
        case 'slot':
          await this.connection.removeSlotChangeListener(subscription.wsSubscriptionId);
          break;
        case 'signature':
          await this.connection.removeSignatureListener(subscription.wsSubscriptionId);
          break;
      }

      this.subscriptions.delete(subscriptionId);
      logger.debug('Unsubscribed', { subscriptionId, type: subscription.type });
    } catch (error) {
      logger.warn('Failed to unsubscribe', { 
        subscriptionId, 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  async unsubscribeAll(): Promise<void> {
    const subscriptionIds = Array.from(this.subscriptions.keys());
    await Promise.allSettled(subscriptionIds.map(id => this.unsubscribe(id)));
    logger.info('Unsubscribed from all', { count: subscriptionIds.length });
  }

  /**
   * Get active subscription count
   */
  getSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Get connection status
   */
  isActive(): boolean {
    return this.isConnected;
  }

  /**
   * Close the WebSocket connection
   */
  async close(): Promise<void> {
    await this.unsubscribeAll();
    this.isConnected = false;
    logger.info('WebSocket manager closed');
  }
}
