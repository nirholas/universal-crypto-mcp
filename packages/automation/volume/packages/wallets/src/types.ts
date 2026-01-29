/**
 * Type definitions for the Wallets MCP Server
 */

// Chain identifiers
export type ChainId = 
  | 'ethereum'
  | 'arbitrum'
  | 'polygon'
  | 'optimism'
  | 'base'
  | 'avalanche'
  | 'bsc';

// Token balance
export interface TokenBalance {
  token: string;
  symbol: string;
  balance: string;
  decimals: number;
  value?: number;
  price?: number;
  chain?: ChainId;
}

// Portfolio overview
export interface WalletPortfolio {
  address: string;
  totalValue: number;
  tokens: Array<{
    symbol: string;
    balance: string;
    value: number;
    chain: ChainId;
    address?: string;
  }>;
  lastUpdated: string;
}

// NFT
export interface NFT {
  collection: string;
  collectionAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  floorPrice?: number;
  chain: ChainId;
}

// DeFi position types
export type DeFiPositionType = 
  | 'lending'
  | 'borrowing'
  | 'staking'
  | 'liquidity'
  | 'farming'
  | 'vesting'
  | 'reward';

// DeFi position
export interface DeFiPosition {
  protocol: string;
  protocolLogo?: string;
  type: DeFiPositionType;
  tokens: Array<{
    symbol: string;
    balance: string;
    value: number;
  }>;
  value: number;
  apy?: number;
  healthFactor?: number;
  chain: ChainId;
}

// Transaction types
export type TransactionType =
  | 'transfer'
  | 'swap'
  | 'approve'
  | 'mint'
  | 'burn'
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'deposit'
  | 'withdraw'
  | 'contract_interaction'
  | 'unknown';

// Transaction history entry
export interface Transaction {
  hash: string;
  type: TransactionType;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  chain: ChainId;
}

// Token approval
export interface TokenApproval {
  token: string;
  tokenSymbol: string;
  spender: string;
  spenderName?: string;
  allowance: string;
  isUnlimited: boolean;
  lastUpdated?: string;
}

// ENS resolution result
export interface ENSResult {
  address?: string;
  name?: string;
  avatar?: string;
  records?: Record<string, string>;
}

// Address type
export type AddressType = 'eoa' | 'contract' | 'unknown';

// API response wrapper
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  timestamp: string;
}

// Chain configuration
export interface ChainConfig {
  id: ChainId;
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Supported chains configuration
export const SUPPORTED_CHAINS: Record<ChainId, ChainConfig> = {
  ethereum: {
    id: 'ethereum',
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  arbitrum: {
    id: 'arbitrum',
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  polygon: {
    id: 'polygon',
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
  optimism: {
    id: 'optimism',
    chainId: 10,
    name: 'Optimism',
    rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  base: {
    id: 'base',
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  avalanche: {
    id: 'avalanche',
    chainId: 43114,
    name: 'Avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  },
  bsc: {
    id: 'bsc',
    chainId: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  },
};
