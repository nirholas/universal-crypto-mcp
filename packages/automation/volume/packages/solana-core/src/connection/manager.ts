/**
 * Solana Connection Manager
 * Production-ready multi-RPC connection management with health checking and failover
 */

import {
  Connection,
  PublicKey,
  Commitment,
  AccountInfo,
  GetProgramAccountsFilter,
  SignatureStatus,
} from '@solana/web3.js';
import {
  SolanaConnectionManager as IConnectionManager,
  ConnectionManagerConfig,
  RpcEndpoint,
  RpcHealth,
  SolanaCluster,
} from '../types.js';
import { HealthChecker } from './health-checker.js';
import { WebSocketManager } from './websocket-manager.js';
import { RpcPool } from './rpc-pool.js';
import { logger } from '../utils/logger.js';

// Default RPC endpoints for mainnet
const DEFAULT_MAINNET_ENDPOINTS: RpcEndpoint[] = [
  {
    url: `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY || ''}`,
    name: 'Helius',
    weight: 100,
    rateLimit: 50,
    wsUrl: `wss://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY || ''}`,
    features: {
      getPriorityFeeEstimate: true,
      enhancedTransactions: true,
      dasApi: true,
      webhooks: true,
    },
  },
  {
    url: process.env.QUICKNODE_ENDPOINT || '',
    name: 'QuickNode',
    weight: 90,
    rateLimit: 25,
    features: {
      getPriorityFeeEstimate: true,
      enhancedTransactions: true,
      dasApi: false,
      webhooks: false,
    },
  },
  {
    url: 'https://solana-mainnet.rpc.extrnode.com',
    name: 'Triton',
    weight: 70,
    rateLimit: 40,
    features: {
      getPriorityFeeEstimate: false,
      enhancedTransactions: false,
      dasApi: false,
      webhooks: false,
    },
  },
  {
    url: 'https://api.mainnet-beta.solana.com',
    name: 'Solana Public',
    weight: 10,
    rateLimit: 10,
    features: {
      getPriorityFeeEstimate: false,
      enhancedTransactions: false,
      dasApi: false,
      webhooks: false,
    },
  },
];

const DEFAULT_DEVNET_ENDPOINTS: RpcEndpoint[] = [
  {
    url: 'https://api.devnet.solana.com',
    name: 'Solana Devnet',
    weight: 100,
    rateLimit: 10,
    features: {
      getPriorityFeeEstimate: false,
      enhancedTransactions: false,
      dasApi: false,
      webhooks: false,
    },
  },
];

export class ConnectionManager implements IConnectionManager {
  private readonly config: ConnectionManagerConfig;
  private readonly rpcPool: RpcPool;
  private readonly wsManager: WebSocketManager;
  private isRunning: boolean = false;

  constructor(config: Partial<ConnectionManagerConfig> = {}) {
    const cluster = config.cluster || (process.env.SOLANA_CLUSTER as SolanaCluster) || 'mainnet-beta';
    const defaultEndpoints = cluster === 'mainnet-beta' ? DEFAULT_MAINNET_ENDPOINTS : DEFAULT_DEVNET_ENDPOINTS;
    
    // Filter out endpoints without URLs
    const endpoints = (config.endpoints || defaultEndpoints).filter(e => e.url && e.url.length > 10);
    
    this.config = {
      cluster,
      commitment: config.commitment || 'confirmed',
      endpoints,
      healthCheckIntervalMs: config.healthCheckIntervalMs || 30000,
      maxRetries: config.maxRetries || 3,
      timeoutMs: config.timeoutMs || 30000,
      enableLogging: config.enableLogging ?? true,
    };

    if (endpoints.length === 0) {
      throw new Error('No valid RPC endpoints configured');
    }

    this.rpcPool = new RpcPool(endpoints, this.config.commitment, {
      healthCheckIntervalMs: this.config.healthCheckIntervalMs,
    });

    // Use the highest weighted endpoint for WebSocket
    const wsEndpoint = endpoints.sort((a, b) => b.weight - a.weight)[0];
    this.wsManager = new WebSocketManager(wsEndpoint, this.config.commitment as 'processed' | 'confirmed' | 'finalized');

    logger.info('Connection manager initialized', {
      cluster,
      endpoints: endpoints.map(e => e.name),
      commitment: this.config.commitment,
    });
  }

  /**
   * Start the connection manager
   */
  start(): void {
    if (this.isRunning) return;
    this.rpcPool.start();
    this.isRunning = true;
    logger.info('Connection manager started');
  }

  /**
   * Get a connection (automatically selects best available)
   */
  getConnection(): Connection {
    return this.rpcPool.getConnection();
  }

  /**
   * Get the healthiest endpoint
   */
  async getHealthyEndpoint(): Promise<RpcEndpoint> {
    const endpoint = this.rpcPool.getHealthChecker().getBestEndpoint();
    if (!endpoint) {
      throw new Error('No healthy endpoints available');
    }
    return endpoint;
  }

  /**
   * Get health status of all endpoints
   */
  async getAllEndpointHealth(): Promise<RpcHealth[]> {
    return this.rpcPool.getHealthChecker().getAllHealth();
  }

  /**
   * Subscribe to account changes
   */
  subscribeToAccount(
    pubkey: PublicKey,
    callback: (accountInfo: AccountInfo<Buffer>, slot: number) => void
  ): number {
    return this.wsManager.subscribeToAccount(pubkey, callback);
  }

  /**
   * Subscribe to program account changes
   */
  subscribeToProgramAccounts(
    programId: PublicKey,
    filters: GetProgramAccountsFilter[],
    callback: (keyedAccountInfo: { pubkey: PublicKey; accountInfo: AccountInfo<Buffer> }) => void
  ): number {
    return this.wsManager.subscribeToProgramAccounts(programId, filters, callback);
  }

  /**
   * Subscribe to slot changes
   */
  subscribeToSlot(callback: (slot: number) => void): number {
    return this.wsManager.subscribeToSlot(callback);
  }

  /**
   * Subscribe to signature status
   */
  subscribeToSignature(
    signature: string,
    callback: (result: SignatureStatus | null, context: { slot: number }) => void
  ): number {
    return this.wsManager.subscribeToSignature(signature, callback);
  }

  /**
   * Estimate priority fee based on recent transactions
   */
  async estimatePriorityFee(accounts: PublicKey[], percentile: number = 50): Promise<number> {
    const connection = this.getConnection();
    
    // Check if we have Helius endpoint for enhanced fee estimation
    const healthyEndpoint = await this.getHealthyEndpoint();
    
    if (healthyEndpoint.features.getPriorityFeeEstimate && healthyEndpoint.name === 'Helius') {
      try {
        // Use Helius priority fee estimation API
        const response = await fetch(healthyEndpoint.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getPriorityFeeEstimate',
            params: [{
              accountKeys: accounts.map(a => a.toBase58()),
              options: { recommended: true },
            }],
          }),
        });
        
        const data = await response.json() as { result?: { priorityFeeEstimate: number } };
        if (data.result?.priorityFeeEstimate) {
          return Math.ceil(data.result.priorityFeeEstimate);
        }
      } catch (error) {
        logger.warn('Helius priority fee estimation failed, falling back', { 
          error: (error as Error).message 
        });
      }
    }

    // Fallback: Use recent prioritization fees
    try {
      const fees = await connection.getRecentPrioritizationFees({
        lockedWritableAccounts: accounts,
      });
      
      if (fees.length === 0) {
        return 1000; // Default 1000 microlamports
      }

      // Sort and get percentile
      const sorted = fees.map(f => f.prioritizationFee).sort((a, b) => a - b);
      const index = Math.floor(sorted.length * (percentile / 100));
      const fee = sorted[Math.min(index, sorted.length - 1)];
      
      // Add 20% buffer
      return Math.ceil(fee * 1.2) || 1000;
    } catch (error) {
      logger.warn('Priority fee estimation failed', { error: (error as Error).message });
      return 5000; // Safe default
    }
  }

  /**
   * Unsubscribe from a subscription
   */
  async unsubscribe(subscriptionId: number): Promise<void> {
    await this.wsManager.unsubscribe(subscriptionId);
  }

  /**
   * Execute an RPC call with automatic failover
   */
  async execute<T>(method: string, fn: (connection: Connection) => Promise<T>): Promise<T> {
    return this.rpcPool.execute(method, fn, this.config.maxRetries);
  }

  /**
   * Get a recent blockhash
   */
  async getRecentBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
    return this.rpcPool.getRecentBlockhash();
  }

  /**
   * Get current slot
   */
  async getSlot(): Promise<number> {
    return this.execute('getSlot', conn => conn.getSlot(this.config.commitment));
  }

  /**
   * Get account info
   */
  async getAccountInfo(pubkey: PublicKey): Promise<AccountInfo<Buffer> | null> {
    return this.execute('getAccountInfo', conn => conn.getAccountInfo(pubkey, this.config.commitment));
  }

  /**
   * Get multiple accounts
   */
  async getMultipleAccounts(pubkeys: PublicKey[]): Promise<(AccountInfo<Buffer> | null)[]> {
    return this.execute('getMultipleAccountsInfo', conn => 
      conn.getMultipleAccountsInfo(pubkeys, this.config.commitment)
    );
  }

  /**
   * Get balance
   */
  async getBalance(pubkey: PublicKey): Promise<number> {
    return this.execute('getBalance', conn => conn.getBalance(pubkey, this.config.commitment));
  }

  /**
   * Close the connection manager
   */
  async close(): Promise<void> {
    this.rpcPool.stop();
    await this.wsManager.close();
    this.isRunning = false;
    logger.info('Connection manager closed');
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      pool: this.rpcPool.getStats(),
      subscriptions: this.wsManager.getSubscriptionCount(),
      health: this.rpcPool.getHealthChecker().getAllHealth(),
    };
  }
}

/**
 * Create a connection manager with sensible defaults
 */
export function createConnectionManager(
  config: Partial<ConnectionManagerConfig> = {}
): ConnectionManager {
  const manager = new ConnectionManager(config);
  manager.start();
  return manager;
}
