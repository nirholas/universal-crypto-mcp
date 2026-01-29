import type { Chain } from './types.js';

/**
 * List of all supported blockchain networks
 */
export const SUPPORTED_CHAINS: readonly Chain[] = [
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygon',
  'avalanche',
  'bsc',
  'solana',
] as const;

/**
 * EVM chain IDs
 */
export const CHAIN_IDS: Partial<Record<Chain, number>> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  optimism: 10,
  polygon: 137,
  avalanche: 43114,
  bsc: 56,
} as const;

/**
 * Native token addresses (zero address for EVM, special address for Solana)
 */
export const NATIVE_TOKEN_ADDRESS: Record<Chain, string> = {
  ethereum: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  arbitrum: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  base: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  optimism: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  polygon: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  avalanche: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  bsc: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  solana: 'So11111111111111111111111111111111111111112',
} as const;

/**
 * Native token symbols
 */
export const NATIVE_TOKEN_SYMBOL: Record<Chain, string> = {
  ethereum: 'ETH',
  arbitrum: 'ETH',
  base: 'ETH',
  optimism: 'ETH',
  polygon: 'POL',
  avalanche: 'AVAX',
  bsc: 'BNB',
  solana: 'SOL',
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Price APIs
  COINGECKO: 'https://api.coingecko.com/api/v3',
  DEFILLAMA: 'https://api.llama.fi',
  DEFILLAMA_COINS: 'https://coins.llama.fi',
  DEFILLAMA_YIELDS: 'https://yields.llama.fi',

  // Wallet/Portfolio APIs
  ZERION: 'https://api.zerion.io/v1',
  ZAPPER: 'https://api.zapper.xyz/v2',
  DEBANK: 'https://pro-openapi.debank.com/v1',

  // Gas APIs
  ETHERSCAN_GAS: 'https://api.etherscan.io/api',
  POLYGON_GAS: 'https://api.polygonscan.com/api',
  ARBISCAN_GAS: 'https://api.arbiscan.io/api',
  BASESCAN_GAS: 'https://api.basescan.org/api',

  // RPC Endpoints (public)
  ETHEREUM_RPC: 'https://eth.llamarpc.com',
  ARBITRUM_RPC: 'https://arb1.arbitrum.io/rpc',
  BASE_RPC: 'https://mainnet.base.org',
  POLYGON_RPC: 'https://polygon-rpc.com',
  SOLANA_RPC: 'https://api.mainnet-beta.solana.com',
} as const;

/**
 * RPC endpoints by chain
 */
export const RPC_ENDPOINTS: Record<Chain, string> = {
  ethereum: API_ENDPOINTS.ETHEREUM_RPC,
  arbitrum: API_ENDPOINTS.ARBITRUM_RPC,
  base: API_ENDPOINTS.BASE_RPC,
  optimism: 'https://mainnet.optimism.io',
  polygon: API_ENDPOINTS.POLYGON_RPC,
  avalanche: 'https://api.avax.network/ext/bc/C/rpc',
  bsc: 'https://bsc-dataseed.binance.org',
  solana: API_ENDPOINTS.SOLANA_RPC,
} as const;

/**
 * Block explorer URLs
 */
export const BLOCK_EXPLORERS: Record<Chain, string> = {
  ethereum: 'https://etherscan.io',
  arbitrum: 'https://arbiscan.io',
  base: 'https://basescan.org',
  optimism: 'https://optimistic.etherscan.io',
  polygon: 'https://polygonscan.com',
  avalanche: 'https://snowtrace.io',
  bsc: 'https://bscscan.com',
  solana: 'https://solscan.io',
} as const;

/**
 * Default timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  /** Default API request timeout */
  DEFAULT: 10_000,
  /** Short timeout for fast operations */
  SHORT: 5_000,
  /** Long timeout for complex operations */
  LONG: 30_000,
  /** RPC call timeout */
  RPC: 15_000,
} as const;

/**
 * Cache TTLs (in milliseconds)
 */
export const CACHE_TTL = {
  /** Price data - 30 seconds */
  PRICE: 30_000,
  /** Gas prices - 15 seconds */
  GAS: 15_000,
  /** Token info - 1 hour */
  TOKEN_INFO: 3_600_000,
  /** Wallet balance - 1 minute */
  WALLET_BALANCE: 60_000,
  /** Yield data - 5 minutes */
  YIELDS: 300_000,
  /** NFT data - 5 minutes */
  NFT: 300_000,
} as const;

/**
 * Rate limit defaults
 */
export const RATE_LIMITS = {
  /** Default requests per second */
  DEFAULT_RPS: 10,
  /** CoinGecko free tier */
  COINGECKO_RPS: 5,
  /** DefiLlama (generous limits) */
  DEFILLAMA_RPS: 20,
} as const;

/**
 * Common stablecoin addresses on Ethereum
 */
export const STABLECOINS_ETH: Record<string, string> = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  FRAX: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  LUSD: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
  USDS: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
} as const;

/**
 * Maximum values
 */
export const MAX_VALUES = {
  /** Maximum results per page */
  PAGE_SIZE: 100,
  /** Maximum retries for failed requests */
  RETRIES: 3,
  /** Maximum concurrent requests */
  CONCURRENT_REQUESTS: 5,
} as const;
