/**
 * Solana Client
 * Production Solana connection management
 */

import { Connection, Commitment } from '@solana/web3.js';

export interface SolanaClientConfig {
  rpcUrl: string;
  wsUrl?: string;
  commitment?: Commitment;
  confirmTransactionInitialTimeout?: number;
}

export interface SolanaConnectionConfig {
  endpoints: string[];
  commitment?: Commitment;
  disableRetryOnRateLimit?: boolean;
}

export class SolanaConnectionManager {
  private connections: Map<string, Connection> = new Map();
  private config: SolanaConnectionConfig;

  constructor(config: SolanaConnectionConfig) {
    this.config = config;
  }

  getConnection(endpoint?: string): Connection {
    const url = endpoint ?? this.config.endpoints[0];
    if (!url) {
      throw new Error('No RPC endpoint configured');
    }
    
    let conn = this.connections.get(url);
    if (!conn) {
      conn = new Connection(url, {
        commitment: this.config.commitment ?? 'confirmed',
        disableRetryOnRateLimit: this.config.disableRetryOnRateLimit,
      });
      this.connections.set(url, conn);
    }
    return conn;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const conn = this.getConnection();
      const slot = await conn.getSlot();
      return slot > 0;
    } catch {
      return false;
    }
  }
}

export class SolanaClient {
  private connection: Connection;
  private readonly rpcUrl: string;

  constructor(config: SolanaClientConfig) {
    this.rpcUrl = config.rpcUrl;
    this.connection = new Connection(config.rpcUrl, {
      commitment: config.commitment ?? 'confirmed',
      wsEndpoint: config.wsUrl,
      confirmTransactionInitialTimeout: config.confirmTransactionInitialTimeout,
    });
  }

  getConnection(): Connection {
    return this.connection;
  }

  getRpcUrl(): string {
    return this.rpcUrl;
  }

  async getSlot(): Promise<number> {
    return this.connection.getSlot();
  }

  async getBalance(address: string): Promise<bigint> {
    const { PublicKey } = await import('@solana/web3.js');
    const balance = await this.connection.getBalance(new PublicKey(address));
    return BigInt(balance);
  }

  async getRecentBlockhash(): Promise<string> {
    const { blockhash } = await this.connection.getLatestBlockhash();
    return blockhash;
  }
}
