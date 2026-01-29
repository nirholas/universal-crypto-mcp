import type { SolanaNetwork, EVMNetwork } from './types.js';

// Solana network configurations
export const SOLANA_NETWORKS: Record<SolanaNetwork, {
  name: string;
  rpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
  isMainnet: boolean;
}> = {
  'mainnet-beta': {
    name: 'Solana Mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    wsUrl: 'wss://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    isMainnet: true,
  },
  devnet: {
    name: 'Solana Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    wsUrl: 'wss://api.devnet.solana.com',
    explorerUrl: 'https://solscan.io?cluster=devnet',
    isMainnet: false,
  },
  testnet: {
    name: 'Solana Testnet',
    rpcUrl: 'https://api.testnet.solana.com',
    wsUrl: 'wss://api.testnet.solana.com',
    explorerUrl: 'https://solscan.io?cluster=testnet',
    isMainnet: false,
  },
  localnet: {
    name: 'Solana Localnet',
    rpcUrl: 'http://127.0.0.1:8899',
    wsUrl: 'ws://127.0.0.1:8900',
    explorerUrl: 'http://localhost:3000',
    isMainnet: false,
  },
};

// EVM network configurations with real RPC endpoints
export const EVM_NETWORKS: Record<EVMNetwork, {
  name: string;
  chainId: number;
  rpcUrl: string;
  wsUrl?: string;
  explorerUrl: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  isMainnet: boolean;
}> = {
  ethereum: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    wsUrl: 'wss://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isMainnet: true,
  },
  polygon: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon.llamarpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    isMainnet: true,
  },
  arbitrum: {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arbitrum.llamarpc.com',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isMainnet: true,
  },
  optimism: {
    name: 'Optimism Mainnet',
    chainId: 10,
    rpcUrl: 'https://optimism.llamarpc.com',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isMainnet: true,
  },
  base: {
    name: 'Base Mainnet',
    chainId: 8453,
    rpcUrl: 'https://base.llamarpc.com',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isMainnet: true,
  },
  bsc: {
    name: 'BNB Smart Chain',
    chainId: 56,
    rpcUrl: 'https://bsc.llamarpc.com',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    isMainnet: true,
  },
  avalanche: {
    name: 'Avalanche C-Chain',
    chainId: 43114,
    rpcUrl: 'https://avalanche.llamarpc.com',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    isMainnet: true,
  },
};

// Default commitment level for Solana
export const DEFAULT_COMMITMENT = 'confirmed' as const;

// Retry configuration
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const MAX_RETRY_DELAY_MS = 10000;

// Timeout configuration
export const DEFAULT_TIMEOUT_MS = 30000;
export const TRANSACTION_TIMEOUT_MS = 60000;
export const HEALTH_CHECK_TIMEOUT_MS = 5000;

// Solana program IDs
export const SOLANA_PROGRAMS = {
  TOKEN_PROGRAM_ID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TOKEN_2022_PROGRAM_ID: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
  ASSOCIATED_TOKEN_PROGRAM_ID: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  SYSTEM_PROGRAM_ID: '11111111111111111111111111111111',
  RENT_PROGRAM_ID: 'SysvarRent111111111111111111111111111111111',
  MEMO_PROGRAM_ID: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
  METADATA_PROGRAM_ID: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
} as const;

// Priority fee configurations (in microLamports per compute unit)
export const PRIORITY_FEES = {
  low: 1000,
  medium: 10000,
  high: 100000,
  turbo: 1000000,
} as const;

// Default compute units
export const DEFAULT_COMPUTE_UNITS = 200000;
export const MAX_COMPUTE_UNITS = 1400000;

// Lamports per SOL
export const LAMPORTS_PER_SOL = 1_000_000_000n;

// Wei per ETH
export const WEI_PER_ETH = 1_000_000_000_000_000_000n;
