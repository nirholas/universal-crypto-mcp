/**
 * EVM Client
 * Production EVM connection management using viem
 */

import { createPublicClient, createWalletClient, http, type PublicClient, type WalletClient, type Chain } from 'viem';
import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';

export interface EVMClientConfig {
  rpcUrl: string;
  chainId: number;
  privateKey?: string;
}

export interface EVMChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrl?: string;
}

const CHAIN_MAP: Record<number, Chain> = {
  1: mainnet,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  8453: base,
  56: bsc,
};

export class EVMConnectionManager {
  private clients: Map<number, PublicClient> = new Map();
  private configs: Map<number, EVMChainConfig> = new Map();

  addChain(config: EVMChainConfig): void {
    this.configs.set(config.chainId, config);
  }

  getClient(chainId: number): PublicClient {
    let client = this.clients.get(chainId);
    if (!client) {
      const config = this.configs.get(chainId);
      const chain = CHAIN_MAP[chainId];
      
      if (!chain && !config) {
        throw new Error(`Chain ${chainId} not configured`);
      }

      client = createPublicClient({
        chain: chain,
        transport: http(config?.rpcUrl),
      });
      this.clients.set(chainId, client);
    }
    return client;
  }

  async healthCheck(chainId: number): Promise<boolean> {
    try {
      const client = this.getClient(chainId);
      const blockNumber = await client.getBlockNumber();
      return blockNumber > 0n;
    } catch {
      return false;
    }
  }
}

export class EVMClient {
  private publicClient: PublicClient;
  private walletClient?: WalletClient;
  private readonly chainId: number;

  constructor(config: EVMClientConfig) {
    this.chainId = config.chainId;
    const chain = CHAIN_MAP[config.chainId];
    
    if (!chain) {
      throw new Error(`Unsupported chain ID: ${config.chainId}`);
    }

    this.publicClient = createPublicClient({
      chain,
      transport: http(config.rpcUrl),
    });

    if (config.privateKey) {
      this.walletClient = createWalletClient({
        chain,
        transport: http(config.rpcUrl),
      });
    }
  }

  getPublicClient(): PublicClient {
    return this.publicClient;
  }

  getChainId(): number {
    return this.chainId;
  }

  getWalletClient(): WalletClient | undefined {
    return this.walletClient;
  }

  async getBlockNumber(): Promise<bigint> {
    return this.publicClient.getBlockNumber();
  }

  async getBalance(address: `0x${string}`): Promise<bigint> {
    return this.publicClient.getBalance({ address });
  }

  async getGasPrice(): Promise<bigint> {
    return this.publicClient.getGasPrice();
  }
}
