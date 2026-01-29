/**
 * Payment Tool Handlers
 */

import { 
  DEFAULT_CATEGORY_PRICING, 
  ALWAYS_FREE_TOOLS,
  createDefaultX402Config,
  getToolPrice,
} from '../../payments/config.js';
import { allToolDefinitions } from '../index.js';

export interface PaymentPricingResult {
  enabled: boolean;
  defaultCurrency: string;
  facilitatorUrl: string;
  pricing: {
    categories: Record<string, { price: string; currency: string }>;
    tools: Record<string, { price: string; currency: string; category: string }>;
    freeTools: string[];
  };
}

export interface ToolPriceResult {
  toolName: string;
  price: string;
  priceUsd: number;
  currency: string;
  category: string;
  isFree: boolean;
}

export interface PaymentNetworksResult {
  networks: Array<{
    name: string;
    chainId: string;
    usdcAddress: string;
    supported: boolean;
  }>;
  currentNetwork: string;
}

/**
 * Helper to determine tool category
 */
function getToolCategory(toolName: string): string {
  if (toolName.includes('wallet') || toolName.includes('fund')) {
    return 'walletOps';
  }
  if (toolName.includes('swap') || toolName.includes('buy') || toolName.includes('sell')) {
    return 'swaps';
  }
  if (toolName.includes('campaign')) {
    return 'campaigns';
  }
  if (toolName.includes('bot')) {
    return 'bots';
  }
  if (toolName.includes('token') || toolName.includes('pool') || toolName.includes('price') || 
      toolName.includes('liquidity') || toolName.includes('holder') || toolName.includes('market') ||
      toolName.includes('analyze')) {
    return 'analysis';
  }
  return 'queries';
}

/**
 * Parse price string to number
 */
function parsePriceToNumber(price: string): number {
  const cleaned = price.replace(/[$,]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format PriceSpec to string
 */
function formatPriceSpec(price: string | { amount: string; asset: { address: string; decimals: number; symbol: string; } }): string {
  if (typeof price === 'string') {
    return price;
  }
  // For object format, format as dollar amount
  const decimals = price.asset?.decimals || 6;
  const amount = parseFloat(price.amount) / Math.pow(10, decimals);
  return `$${amount.toFixed(4)}`;
}

/**
 * Get pricing for all tools
 */
export async function getPaymentPricing(args?: { category?: string }): Promise<PaymentPricingResult> {
  const categoryFilter = args?.category?.toLowerCase();
  const config = createDefaultX402Config(process.env.X402_PAY_TO_ADDRESS);
  
  // Build category pricing from array
  const categories: Record<string, { price: string; currency: string }> = {};
  for (const catPricing of DEFAULT_CATEGORY_PRICING) {
    if (!categoryFilter || catPricing.category.toLowerCase().includes(categoryFilter)) {
      categories[catPricing.category] = {
        price: formatPriceSpec(catPricing.price),
        currency: 'USDC',
      };
    }
  }

  // Build tool-specific pricing
  const tools: Record<string, { price: string; currency: string; category: string }> = {};
  
  for (const tool of allToolDefinitions) {
    const category = getToolCategory(tool.name);
    
    if (categoryFilter && !category.toLowerCase().includes(categoryFilter)) {
      continue;
    }

    if (ALWAYS_FREE_TOOLS.includes(tool.name)) {
      tools[tool.name] = {
        price: '$0.00',
        currency: 'USDC',
        category,
      };
    } else {
      const pricing = getToolPrice(config, tool.name, category);
      tools[tool.name] = {
        price: pricing.price,
        currency: 'USDC',
        category,
      };
    }
  }

  // Filter free tools
  const freeTools = allToolDefinitions
    .filter(t => ALWAYS_FREE_TOOLS.includes(t.name))
    .filter(t => !categoryFilter || getToolCategory(t.name).toLowerCase().includes(categoryFilter))
    .map(t => t.name);

  return {
    enabled: !!process.env.X402_PAY_TO_ADDRESS,
    defaultCurrency: 'USDC',
    facilitatorUrl: process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator',
    pricing: {
      categories,
      tools,
      freeTools,
    },
  };
}

/**
 * Get price for a specific tool
 */
export async function getToolPriceHandler(args: { tool_name: string }): Promise<ToolPriceResult> {
  const toolName = args.tool_name;
  
  // Check if tool exists
  const toolDef = allToolDefinitions.find(t => t.name === toolName);
  if (!toolDef) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  const category = getToolCategory(toolName);
  const isFree = ALWAYS_FREE_TOOLS.includes(toolName);
  const config = createDefaultX402Config(process.env.X402_PAY_TO_ADDRESS);
  
  const pricing = getToolPrice(config, toolName, category);
  const priceUsd = isFree ? 0 : parsePriceToNumber(pricing.price);

  return {
    toolName,
    price: isFree ? '$0.00' : pricing.price,
    priceUsd,
    currency: 'USDC',
    category,
    isFree,
  };
}

// Comprehensive USDC addresses for all supported networks
const NETWORK_INFO: Record<string, { name: string; chainId: string; usdcAddress: string }> = {
  'base-mainnet': {
    name: 'Base Mainnet',
    chainId: 'eip155:8453',
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  'base-sepolia': {
    name: 'Base Sepolia (Testnet)',
    chainId: 'eip155:84532',
    usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  },
  'ethereum-mainnet': {
    name: 'Ethereum Mainnet',
    chainId: 'eip155:1',
    usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  'arbitrum-one': {
    name: 'Arbitrum One',
    chainId: 'eip155:42161',
    usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  'optimism': {
    name: 'Optimism',
    chainId: 'eip155:10',
    usdcAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  },
  'polygon': {
    name: 'Polygon',
    chainId: 'eip155:137',
    usdcAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  },
  'solana-mainnet': {
    name: 'Solana Mainnet',
    chainId: 'solana:mainnet',
    usdcAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  'solana-devnet': {
    name: 'Solana Devnet',
    chainId: 'solana:devnet',
    usdcAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  },
};

// Reverse lookup by chainId
const NETWORK_BY_CHAIN_ID: Record<string, string> = Object.fromEntries(
  Object.entries(NETWORK_INFO).map(([key, info]) => [info.chainId, key])
);

/**
 * Get supported payment networks
 */
export async function getPaymentNetworks(): Promise<PaymentNetworksResult> {
  const currentNetwork = process.env.X402_NETWORK || 'eip155:8453';
  
  const networks: PaymentNetworksResult['networks'] = Object.values(NETWORK_INFO).map(info => ({
    name: info.name,
    chainId: info.chainId,
    usdcAddress: info.usdcAddress,
    supported: true,
  }));

  return {
    networks,
    currentNetwork,
  };
}

export interface PaymentAnalyticsResult {
  enabled: boolean;
  totalPayments: number;
  totalRevenue: string;
  failedPayments: number;
  successRate: number;
  averageSettlementTimeMs: number;
  topTools: Array<{ tool: string; count: number; revenue: string }>;
  networkBreakdown: Array<{ network: string; count: number; revenue: string }>;
}

/**
 * Get payment analytics (requires payment middleware to be active)
 */
export async function getPaymentAnalytics(): Promise<PaymentAnalyticsResult> {
  // Note: In a real implementation, this would pull from the payment service
  // For now, we return stats indicating payments are not yet tracked in this session
  const enabled = !!process.env.X402_PAY_TO_ADDRESS;
  
  return {
    enabled,
    totalPayments: 0,
    totalRevenue: '$0.00',
    failedPayments: 0,
    successRate: 100,
    averageSettlementTimeMs: 0,
    topTools: [],
    networkBreakdown: [],
  };
}

export interface NetworkValidationResult {
  network: string;
  isSupported: boolean;
  chainName?: string;
  usdcAddress?: string;
  decimals?: number;
  symbol?: string;
  explorerUrl?: string;
}

/**
 * Validate a payment network and get its info
 */
export async function validatePaymentNetwork(args: { network: string }): Promise<NetworkValidationResult> {
  const { network } = args;
  
  // Check by chainId directly or by short name
  const networkKey = NETWORK_BY_CHAIN_ID[network] || network;
  const info = NETWORK_INFO[networkKey];
  
  if (!info) {
    return {
      network,
      isSupported: false,
    };
  }

  // Build explorer URL based on network
  let explorerUrl: string | undefined;
  if (network.startsWith('eip155:')) {
    const chainIdStr = network.split(':')[1];
    const chainId = chainIdStr ? parseInt(chainIdStr, 10) : 0;
    const explorerUrls: Record<number, string> = {
      1: 'https://etherscan.io',
      8453: 'https://basescan.org',
      84532: 'https://sepolia.basescan.org',
      42161: 'https://arbiscan.io',
      10: 'https://optimistic.etherscan.io',
      137: 'https://polygonscan.com',
    };
    explorerUrl = explorerUrls[chainId];
  } else if (network.startsWith('solana:')) {
    explorerUrl = network.includes('devnet') 
      ? 'https://explorer.solana.com/?cluster=devnet'
      : 'https://explorer.solana.com';
  }

  return {
    network: info.chainId,
    isSupported: true,
    chainName: info.name,
    usdcAddress: info.usdcAddress,
    decimals: 6,
    symbol: 'USDC',
    explorerUrl,
  };
}
