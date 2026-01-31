/**
 * Payment Gateway Configuration
 * 
 * Network and token configurations for x402 payment protocol
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import type { 
  X402Config, 
  PaymentGatewayConfig, 
  Token, 
  NetworkPaymentConfig,
  Address,
  ChainId 
} from './types';

// ============================================
// Supported Tokens
// ============================================

export const USDC_ETHEREUM: Token = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  chainId: 1,
  logoUrl: '/icons/tokens/usdc.svg',
};

export const USDC_POLYGON: Token = {
  address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' as Address,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  chainId: 137,
  logoUrl: '/icons/tokens/usdc.svg',
};

export const USDC_ARBITRUM: Token = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as Address,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  chainId: 42161,
  logoUrl: '/icons/tokens/usdc.svg',
};

export const USDC_BASE: Token = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  chainId: 8453,
  logoUrl: '/icons/tokens/usdc.svg',
};

export const USDC_OPTIMISM: Token = {
  address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85' as Address,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  chainId: 10,
  logoUrl: '/icons/tokens/usdc.svg',
};

export const USDS_ETHEREUM: Token = {
  address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F' as Address,
  symbol: 'USDs',
  name: 'Sperax USD',
  decimals: 18,
  chainId: 1,
  logoUrl: '/icons/tokens/usds.svg',
};

export const USDS_ARBITRUM: Token = {
  address: '0xD74f5255D557944cf7Dd0E45FF521520002D5748' as Address,
  symbol: 'USDs',
  name: 'Sperax USD',
  decimals: 18,
  chainId: 42161,
  logoUrl: '/icons/tokens/usds.svg',
};

// ============================================
// Payment Contract Addresses
// ============================================

export const PAYMENT_CONTRACTS: Record<ChainId, Address> = {
  1: '0x1234567890123456789012345678901234567890' as Address,      // Ethereum
  137: '0x2345678901234567890123456789012345678901' as Address,    // Polygon
  42161: '0x3456789012345678901234567890123456789012' as Address,  // Arbitrum
  8453: '0x4567890123456789012345678901234567890123' as Address,   // Base
  10: '0x5678901234567890123456789012345678901234' as Address,     // Optimism
};

// ============================================
// Network Configurations
// ============================================

export const NETWORK_CONFIGS: Record<ChainId, NetworkPaymentConfig> = {
  // Ethereum Mainnet
  1: {
    rpc: process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://eth.llamarpc.com',
    paymentContract: PAYMENT_CONTRACTS[1],
    supportedTokens: [USDC_ETHEREUM, USDS_ETHEREUM],
    confirmationsRequired: 2,
    gasLimit: 150000n,
  },
  // Polygon
  137: {
    rpc: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon.llamarpc.com',
    paymentContract: PAYMENT_CONTRACTS[137],
    supportedTokens: [USDC_POLYGON],
    confirmationsRequired: 5,
    gasLimit: 150000n,
  },
  // Arbitrum
  42161: {
    rpc: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://arbitrum.llamarpc.com',
    paymentContract: PAYMENT_CONTRACTS[42161],
    supportedTokens: [USDC_ARBITRUM, USDS_ARBITRUM],
    confirmationsRequired: 1,
    gasLimit: 1000000n,
  },
  // Base
  8453: {
    rpc: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://base.llamarpc.com',
    paymentContract: PAYMENT_CONTRACTS[8453],
    supportedTokens: [USDC_BASE],
    confirmationsRequired: 1,
    gasLimit: 150000n,
  },
  // Optimism
  10: {
    rpc: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || 'https://optimism.llamarpc.com',
    paymentContract: PAYMENT_CONTRACTS[10],
    supportedTokens: [USDC_OPTIMISM],
    confirmationsRequired: 1,
    gasLimit: 150000n,
  },
};

// ============================================
// Default X402 Configuration
// ============================================

export const DEFAULT_X402_CONFIG: X402Config = {
  networks: NETWORK_CONFIGS,
  defaultToken: 'USDC',
  defaultChainId: 8453, // Base
  minPayment: 1000n, // 0.001 USDC (6 decimals)
  maxPayment: 1000000000000n, // 1,000,000 USDC
  paymentTimeout: 3600, // 1 hour
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds
};

// ============================================
// Payment Gateway Configuration
// ============================================

export const DEFAULT_GATEWAY_CONFIG: PaymentGatewayConfig = {
  ...DEFAULT_X402_CONFIG,
  enableSubscriptions: true,
  enableRefunds: true,
  enableAnalytics: true,
  feePercentage: 1, // 1%
  feeRecipient: '0x0000000000000000000000000000000000000000' as Address,
};

// ============================================
// Helper Functions
// ============================================

/**
 * Get token by symbol and chain
 */
export function getToken(symbol: string, chainId: ChainId): Token | undefined {
  const networkConfig = NETWORK_CONFIGS[chainId];
  if (!networkConfig) return undefined;
  
  return networkConfig.supportedTokens.find(
    (t) => t.symbol.toLowerCase() === symbol.toLowerCase()
  );
}

/**
 * Get all tokens for a chain
 */
export function getChainTokens(chainId: ChainId): Token[] {
  return NETWORK_CONFIGS[chainId]?.supportedTokens || [];
}

/**
 * Get all supported chain IDs
 */
export function getSupportedChainIds(): ChainId[] {
  return Object.keys(NETWORK_CONFIGS).map(Number);
}

/**
 * Check if a chain is supported
 */
export function isChainSupported(chainId: ChainId): boolean {
  return chainId in NETWORK_CONFIGS;
}

/**
 * Get payment contract address for chain
 */
export function getPaymentContract(chainId: ChainId): Address | undefined {
  return NETWORK_CONFIGS[chainId]?.paymentContract;
}

/**
 * Get required confirmations for chain
 */
export function getRequiredConfirmations(chainId: ChainId): number {
  return NETWORK_CONFIGS[chainId]?.confirmationsRequired || 1;
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return `${integerPart}.${trimmedFractional}`;
}

/**
 * Parse token amount to wei/smallest unit
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [integerPart, fractionalPart = ''] = amount.split('.');
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  
  return BigInt(integerPart + paddedFractional);
}

/**
 * Calculate fee amount
 */
export function calculateFee(amount: bigint, feePercentage: number): bigint {
  return (amount * BigInt(Math.floor(feePercentage * 100))) / 10000n;
}

/**
 * Get chain name by ID
 */
export function getChainName(chainId: ChainId): string {
  const names: Record<ChainId, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    42161: 'Arbitrum',
    8453: 'Base',
    10: 'Optimism',
  };
  return names[chainId] || `Chain ${chainId}`;
}

/**
 * Get block explorer URL for transaction
 */
export function getExplorerTxUrl(chainId: ChainId, txHash: string): string {
  const explorers: Record<ChainId, string> = {
    1: 'https://etherscan.io/tx/',
    137: 'https://polygonscan.com/tx/',
    42161: 'https://arbiscan.io/tx/',
    8453: 'https://basescan.org/tx/',
    10: 'https://optimistic.etherscan.io/tx/',
  };
  return `${explorers[chainId] || ''}${txHash}`;
}
