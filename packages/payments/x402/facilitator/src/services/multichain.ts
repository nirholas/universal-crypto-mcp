/**
 * Multi-Chain EVM Client
 * 
 * Provides blockchain interaction for all supported EVM networks.
 * Uses viem for type-safe, efficient RPC calls.
 * 
 * @author nich
 * @license MIT
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
  type WalletClient,
  type Address,
  type Hash,
  parseUnits,
  formatUnits,
} from 'viem';
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';
import { 
  type NetworkId, 
  type NetworkConfig,
  getNetworkById,
  getNetwork,
  NETWORKS,
} from './networks.js';
import { logger } from '../middleware/logger.js';
import { rpcLatency, rpcErrorsTotal, blockHeight } from './metrics.js';

/**
 * Token decimals by symbol
 */
const TOKEN_DECIMALS: Record<string, number> = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  USDs: 18,
};

/**
 * ERC-20 ABI subset
 */
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

/**
 * EIP-3009 Transfer With Authorization ABI
 */
const TRANSFER_WITH_AUTHORIZATION_ABI = [
  {
    name: 'transferWithAuthorization',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'validAfter', type: 'uint256' },
      { name: 'validBefore', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    name: 'authorizationState',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'authorizer', type: 'address' },
      { name: 'nonce', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

/**
 * Multi-chain client for EVM networks
 */
export class MultiChainClient {
  private publicClients: Map<NetworkId, PublicClient> = new Map();
  private walletClients: Map<NetworkId, WalletClient> = new Map();
  private account?: PrivateKeyAccount;
  private enabledNetworks: Set<NetworkId>;

  constructor(config: {
    privateKey?: `0x${string}`;
    networks?: NetworkId[];
    customRpcUrls?: Record<NetworkId, string>;
  }) {
    // Initialize account if private key provided
    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey);
      logger.info('MultiChainClient initialized with wallet', {
        address: this.account.address,
      });
    }

    // Determine which networks to enable
    this.enabledNetworks = new Set(
      config.networks || Object.keys(NETWORKS) as NetworkId[]
    );

    // Initialize clients for each enabled network
    for (const networkId of this.enabledNetworks) {
      const networkConfig = getNetworkById(networkId);
      if (!networkConfig) continue;

      const rpcUrl = config.customRpcUrls?.[networkId] || networkConfig.rpcUrl;

      // Create public client
      const publicClient = createPublicClient({
        chain: networkConfig.chain,
        transport: http(rpcUrl),
      });
      this.publicClients.set(networkId, publicClient);

      // Create wallet client if we have an account
      if (this.account) {
        const walletClient = createWalletClient({
          account: this.account,
          chain: networkConfig.chain,
          transport: http(rpcUrl),
        });
        this.walletClients.set(networkId, walletClient);
      }
    }

    logger.info('MultiChainClient ready', {
      networks: Array.from(this.enabledNetworks),
      hasWallet: !!this.account,
    });
  }

  /**
   * Get public client for a network
   */
  getPublicClient(network: NetworkId): PublicClient {
    const client = this.publicClients.get(network);
    if (!client) {
      throw new Error(`Network not enabled: ${network}`);
    }
    return client;
  }

  /**
   * Get wallet client for a network
   */
  getWalletClient(network: NetworkId): WalletClient {
    const client = this.walletClients.get(network);
    if (!client) {
      throw new Error(`Wallet not available for network: ${network}`);
    }
    return client;
  }

  /**
   * Get current block number
   */
  async getBlockNumber(network: NetworkId): Promise<bigint> {
    const start = Date.now();
    try {
      const client = this.getPublicClient(network);
      const block = await client.getBlockNumber();
      
      rpcLatency.observe(
        { network, method: 'getBlockNumber' },
        (Date.now() - start) / 1000
      );
      blockHeight.set({ network }, Number(block));
      
      return block;
    } catch (error) {
      rpcErrorsTotal.inc({ network, method: 'getBlockNumber' });
      throw error;
    }
  }

  /**
   * Get token balance
   */
  async getBalance(
    network: NetworkId,
    token: 'USDC' | 'USDT' | 'DAI' | 'USDs',
    address: Address
  ): Promise<string> {
    const networkConfig = getNetworkById(network);
    if (!networkConfig) throw new Error(`Unknown network: ${network}`);

    const tokenAddress = networkConfig.tokens[token];
    if (!tokenAddress) throw new Error(`Token ${token} not available on ${network}`);

    const client = this.getPublicClient(network);
    const decimals = TOKEN_DECIMALS[token] || 6;

    const balance = await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    return formatUnits(balance, decimals);
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(network: NetworkId, hash: Hash) {
    const start = Date.now();
    try {
      const client = this.getPublicClient(network);
      const receipt = await client.getTransactionReceipt({ hash });
      
      rpcLatency.observe(
        { network, method: 'getTransactionReceipt' },
        (Date.now() - start) / 1000
      );
      
      return receipt;
    } catch (error) {
      rpcErrorsTotal.inc({ network, method: 'getTransactionReceipt' });
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(
    network: NetworkId,
    hash: Hash,
    confirmations?: number
  ) {
    const networkConfig = getNetworkById(network);
    const client = this.getPublicClient(network);
    
    return client.waitForTransactionReceipt({
      hash,
      confirmations: confirmations || networkConfig?.confirmationsRequired || 1,
    });
  }

  /**
   * Execute EIP-3009 transferWithAuthorization
   */
  async executeTransferWithAuthorization(
    network: NetworkId,
    tokenAddress: Address,
    params: {
      from: Address;
      to: Address;
      value: bigint;
      validAfter: bigint;
      validBefore: bigint;
      nonce: `0x${string}`;
      v: number;
      r: `0x${string}`;
      s: `0x${string}`;
    }
  ): Promise<Hash> {
    const walletClient = this.getWalletClient(network);
    const publicClient = this.getPublicClient(network);

    // Simulate first
    await publicClient.simulateContract({
      address: tokenAddress,
      abi: TRANSFER_WITH_AUTHORIZATION_ABI,
      functionName: 'transferWithAuthorization',
      args: [
        params.from,
        params.to,
        params.value,
        params.validAfter,
        params.validBefore,
        params.nonce,
        params.v,
        params.r,
        params.s,
      ],
      account: this.account!,
    });

    // Execute
    const hash = await walletClient.writeContract({
      address: tokenAddress,
      abi: TRANSFER_WITH_AUTHORIZATION_ABI,
      functionName: 'transferWithAuthorization',
      args: [
        params.from,
        params.to,
        params.value,
        params.validAfter,
        params.validBefore,
        params.nonce,
        params.v,
        params.r,
        params.s,
      ],
    });

    logger.info('EIP-3009 transfer executed', {
      network,
      hash,
      from: params.from,
      to: params.to,
      value: params.value.toString(),
    });

    return hash;
  }

  /**
   * Check if authorization nonce is used
   */
  async isAuthorizationUsed(
    network: NetworkId,
    tokenAddress: Address,
    authorizer: Address,
    nonce: `0x${string}`
  ): Promise<boolean> {
    const client = this.getPublicClient(network);
    
    return client.readContract({
      address: tokenAddress,
      abi: TRANSFER_WITH_AUTHORIZATION_ABI,
      functionName: 'authorizationState',
      args: [authorizer, nonce],
    });
  }

  /**
   * Get enabled networks
   */
  getEnabledNetworks(): NetworkId[] {
    return Array.from(this.enabledNetworks);
  }

  /**
   * Check if network is enabled
   */
  isNetworkEnabled(network: NetworkId): boolean {
    return this.enabledNetworks.has(network);
  }

  /**
   * Get facilitator address (if wallet enabled)
   */
  getAddress(): Address | undefined {
    return this.account?.address;
  }
}

/**
 * Create a multi-chain client
 */
export function createMultiChainClient(config: {
  privateKey?: `0x${string}`;
  networks?: NetworkId[];
  customRpcUrls?: Record<NetworkId, string>;
}): MultiChainClient {
  return new MultiChainClient(config);
}
