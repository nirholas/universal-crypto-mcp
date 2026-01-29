/**
 * x402 Payment Configuration
 * Default pricing and configuration for MCP tool payments
 */

import type { X402Config, CategoryPricing, ToolPricing, PaymentNetwork } from './types.js';

/**
 * Default category-based pricing
 * These are baseline prices - can be overridden per-tool
 */
export const DEFAULT_CATEGORY_PRICING: CategoryPricing[] = [
  {
    category: 'swaps',
    price: '$0.01',        // $0.01 per swap execution
    network: 'eip155:8453', // Base Mainnet
    requiresPayment: true,
  },
  {
    category: 'walletOps',
    price: '$0.001',       // $0.001 per wallet operation
    network: 'eip155:8453',
    requiresPayment: true,
  },
  {
    category: 'campaigns',
    price: '$0.05',        // $0.05 per campaign operation
    network: 'eip155:8453',
    requiresPayment: true,
  },
  {
    category: 'queries',
    price: '$0.0001',      // $0.0001 per query (nearly free)
    network: 'eip155:8453',
    requiresPayment: false, // Queries are free by default
  },
  {
    category: 'bots',
    price: '$0.02',        // $0.02 per bot operation
    network: 'eip155:8453',
    requiresPayment: true,
  },
  {
    category: 'analysis',
    price: '$0.005',       // $0.005 per analysis
    network: 'eip155:8453',
    requiresPayment: true,
  },
];

/**
 * Default per-tool pricing overrides
 * These take precedence over category pricing
 */
export const DEFAULT_TOOL_PRICING: ToolPricing[] = [
  // Trading tools - higher value operations
  {
    tool: 'executeSwap',
    price: '$0.01',
    network: 'eip155:8453',
    description: 'Execute a token swap via Jupiter/Raydium',
    requiresPayment: true,
  },
  {
    tool: 'executeBatchSwap',
    price: '$0.05',
    network: 'eip155:8453',
    description: 'Execute multiple swaps in a batch',
    requiresPayment: true,
  },
  {
    tool: 'getSwapQuote',
    price: '$0.001',
    network: 'eip155:8453',
    description: 'Get a swap quote without execution',
    requiresPayment: false, // Quotes are free
  },
  
  // Wallet tools
  {
    tool: 'createWalletGroup',
    price: '$0.02',
    network: 'eip155:8453',
    description: 'Create a new HD wallet group',
    requiresPayment: true,
  },
  {
    tool: 'deriveWallets',
    price: '$0.005',
    network: 'eip155:8453',
    description: 'Derive new wallets from existing group',
    requiresPayment: true,
  },
  {
    tool: 'getWalletBalance',
    price: '$0.0001',
    network: 'eip155:8453',
    description: 'Check wallet balance',
    requiresPayment: false, // Balance checks are free
  },
  {
    tool: 'distributeFunds',
    price: '$0.01',
    network: 'eip155:8453',
    description: 'Distribute funds across wallets',
    requiresPayment: true,
  },
  {
    tool: 'consolidateFunds',
    price: '$0.01',
    network: 'eip155:8453',
    description: 'Consolidate funds from multiple wallets',
    requiresPayment: true,
  },
  
  // Campaign tools - premium operations
  {
    tool: 'createCampaign',
    price: '$0.10',
    network: 'eip155:8453',
    description: 'Create a new volume generation campaign',
    requiresPayment: true,
  },
  {
    tool: 'startCampaign',
    price: '$0.05',
    network: 'eip155:8453',
    description: 'Start an existing campaign',
    requiresPayment: true,
  },
  {
    tool: 'stopCampaign',
    price: '$0.01',
    network: 'eip155:8453',
    description: 'Stop a running campaign',
    requiresPayment: true,
  },
  {
    tool: 'getCampaignStatus',
    price: '$0.001',
    network: 'eip155:8453',
    description: 'Get campaign status and metrics',
    requiresPayment: false,
  },
  
  // Bot tools
  {
    tool: 'createBot',
    price: '$0.05',
    network: 'eip155:8453',
    description: 'Create a new trading bot',
    requiresPayment: true,
  },
  {
    tool: 'startBot',
    price: '$0.02',
    network: 'eip155:8453',
    description: 'Start a trading bot',
    requiresPayment: true,
  },
  {
    tool: 'stopBot',
    price: '$0.005',
    network: 'eip155:8453',
    description: 'Stop a trading bot',
    requiresPayment: true,
  },
  
  // Analysis tools
  {
    tool: 'analyzeToken',
    price: '$0.01',
    network: 'eip155:8453',
    description: 'Analyze token metrics and liquidity',
    requiresPayment: true,
  },
  {
    tool: 'getMarketDepth',
    price: '$0.005',
    network: 'eip155:8453',
    description: 'Get market depth analysis',
    requiresPayment: true,
  },
];

/**
 * Tools that are always free regardless of configuration
 */
export const ALWAYS_FREE_TOOLS: string[] = [
  // Info/status tools
  'getServerInfo',
  'getToolList',
  'ping',
  'healthCheck',
  
  // Read-only queries
  'getSwapQuote',
  'getWalletBalance',
  'getCampaignStatus',
  'getBotStatus',
  'getTokenPrice',
  'getGasPrice',

  // Payment info tools (always free)
  'get_payment_pricing',
  'get_tool_price',
  'get_payment_networks',
  'get_payment_analytics',
  'validate_payment_network',
  
  // List tools (always free)
  'list_wallets',
  'list_campaigns',
  'list_active_bots',
];

/**
 * Create default x402 configuration
 */
export function createDefaultX402Config(
  payToAddress?: string,
  network?: PaymentNetwork
): X402Config {
  return {
    enabled: !!payToAddress,
    payToAddress: payToAddress || '',
    defaultNetwork: network || 'eip155:8453',
    facilitatorUrl: process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator',
    defaultPrice: '$0.001',
    categoryPricing: DEFAULT_CATEGORY_PRICING,
    toolPricing: DEFAULT_TOOL_PRICING,
    freeTools: ALWAYS_FREE_TOOLS,
    paywall: {
      appName: 'Boosty DeFi',
      appLogo: '/logo.png',
    },
  };
}

/**
 * Get pricing for a specific tool
 */
export function getToolPrice(
  config: X402Config,
  toolName: string,
  category?: string
): { price: string; requiresPayment: boolean; network: PaymentNetwork } {
  // Check if tool is always free
  if (config.freeTools?.includes(toolName)) {
    return {
      price: '$0',
      requiresPayment: false,
      network: config.defaultNetwork,
    };
  }
  
  // Check tool-specific pricing
  const toolPricing = config.toolPricing?.find(t => t.tool === toolName);
  if (toolPricing) {
    return {
      price: typeof toolPricing.price === 'string' ? toolPricing.price : `${toolPricing.price.amount}`,
      requiresPayment: toolPricing.requiresPayment,
      network: toolPricing.network,
    };
  }
  
  // Check category pricing
  if (category) {
    const categoryPricing = config.categoryPricing?.find(
      c => c.category === category
    );
    if (categoryPricing) {
      return {
        price: typeof categoryPricing.price === 'string' ? categoryPricing.price : `${categoryPricing.price.amount}`,
        requiresPayment: categoryPricing.requiresPayment,
        network: categoryPricing.network,
      };
    }
  }
  
  // Fall back to default
  return {
    price: typeof config.defaultPrice === 'string' ? config.defaultPrice : `${config.defaultPrice.amount}`,
    requiresPayment: true,
    network: config.defaultNetwork,
  };
}

/**
 * Parse price string to atomic amount
 * e.g., "$0.01" -> "10000" (USDC has 6 decimals)
 */
export function parsePrice(price: string, decimals: number = 6): string {
  // Handle dollar format: "$0.01"
  if (price.startsWith('$')) {
    const amount = parseFloat(price.slice(1));
    return Math.floor(amount * Math.pow(10, decimals)).toString();
  }
  
  // Already atomic amount
  return price;
}

/**
 * Format atomic amount to display price
 */
export function formatPrice(atomicAmount: string, decimals: number = 6): string {
  const amount = parseInt(atomicAmount, 10) / Math.pow(10, decimals);
  return `$${amount.toFixed(decimals)}`;
}
