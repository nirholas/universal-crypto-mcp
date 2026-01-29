import type { Chain } from './types.js';

export type { Chain };

export interface ChainConfig {
  id: number | string; // string for non-EVM chains like Solana
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  explorerUrl: string;
  explorerApiUrl?: string;
  coingeckoId: string;
  isEVM: boolean;
}

export const SUPPORTED_CHAINS: Record<Chain, ChainConfig> = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    shortName: 'ETH',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    explorerApiUrl: 'https://api.etherscan.io/api',
    coingeckoId: 'ethereum',
    isEVM: true,
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'ARB',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    explorerApiUrl: 'https://api.arbiscan.io/api',
    coingeckoId: 'arbitrum-one',
    isEVM: true,
  },
  base: {
    id: 8453,
    name: 'Base',
    shortName: 'BASE',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    explorerApiUrl: 'https://api.basescan.org/api',
    coingeckoId: 'base',
    isEVM: true,
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    shortName: 'OP',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    explorerApiUrl: 'https://api-optimistic.etherscan.io/api',
    coingeckoId: 'optimistic-ethereum',
    isEVM: true,
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    shortName: 'MATIC',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    explorerApiUrl: 'https://api.polygonscan.com/api',
    coingeckoId: 'polygon-pos',
    isEVM: true,
  },
  avalanche: {
    id: 43114,
    name: 'Avalanche C-Chain',
    shortName: 'AVAX',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    explorerApiUrl: 'https://api.snowtrace.io/api',
    coingeckoId: 'avalanche',
    isEVM: true,
  },
  bsc: {
    id: 56,
    name: 'BNB Smart Chain',
    shortName: 'BSC',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    explorerApiUrl: 'https://api.bscscan.com/api',
    coingeckoId: 'binance-smart-chain',
    isEVM: true,
  },
  solana: {
    id: 'mainnet-beta',
    name: 'Solana',
    shortName: 'SOL',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    coingeckoId: 'solana',
    isEVM: false,
  },
};

export function getChainConfig(chain: Chain): ChainConfig {
  const config = SUPPORTED_CHAINS[chain];
  if (!config) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  return config;
}

export function getChainById(chainId: number | string): Chain | undefined {
  for (const [chain, config] of Object.entries(SUPPORTED_CHAINS)) {
    if (config.id === chainId) {
      return chain as Chain;
    }
  }
  return undefined;
}

/**
 * Get all EVM-compatible chains
 */
export function getEVMChains(): Chain[] {
  return (Object.entries(SUPPORTED_CHAINS) as [Chain, ChainConfig][])
    .filter(([_, config]) => config.isEVM)
    .map(([chain]) => chain);
}

/**
 * Check if a chain is EVM-compatible
 */
export function isEVMChain(chain: Chain): boolean {
  return SUPPORTED_CHAINS[chain]?.isEVM ?? false;
}

/**
 * List of all supported chain names
 */
export const CHAIN_NAMES = Object.keys(SUPPORTED_CHAINS) as Chain[];
