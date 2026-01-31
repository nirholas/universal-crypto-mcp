/**
 * Tool Categories - Category definitions and data for 380+ MCP tools
 * @module lib/playground/categories
 */

import { ToolCategory, ToolCategoryId } from './types';

export const TOOL_CATEGORIES: ToolCategory[] = [
  // Blockchain Categories
  {
    id: 'blockchain-evm',
    name: 'Blockchain (EVM)',
    description: 'Ethereum Virtual Machine compatible chains - Ethereum, Base, Arbitrum, Polygon, etc.',
    icon: 'Blocks',
    toolCount: 45,
    subcategories: [
      { id: 'blockchain-evm', name: 'Read Operations', description: 'Query blockchain state', icon: 'Eye', toolCount: 20 },
      { id: 'blockchain-evm', name: 'Write Operations', description: 'Submit transactions', icon: 'Pencil', toolCount: 15 },
      { id: 'blockchain-evm', name: 'Contract Interactions', description: 'Smart contract calls', icon: 'FileCode', toolCount: 10 },
    ],
  },
  {
    id: 'blockchain-solana',
    name: 'Blockchain (Solana)',
    description: 'Solana blockchain operations and program interactions',
    icon: 'Zap',
    toolCount: 28,
  },
  {
    id: 'blockchain-multichain',
    name: 'Multi-chain',
    description: 'Cross-chain operations and aggregated data',
    icon: 'Network',
    toolCount: 15,
  },

  // DeFi Categories
  {
    id: 'defi-lending',
    name: 'DeFi Lending',
    description: 'Lending protocols - Aave, Compound, Morpho, etc.',
    icon: 'Landmark',
    toolCount: 32,
  },
  {
    id: 'defi-dex',
    name: 'DeFi DEX',
    description: 'Decentralized exchanges - Uniswap, Curve, 1inch, etc.',
    icon: 'ArrowLeftRight',
    toolCount: 38,
  },
  {
    id: 'defi-staking',
    name: 'DeFi Staking',
    description: 'Staking protocols - Lido, Rocket Pool, EigenLayer, etc.',
    icon: 'Coins',
    toolCount: 22,
  },
  {
    id: 'defi-yield',
    name: 'DeFi Yield',
    description: 'Yield optimization and farming strategies',
    icon: 'TrendingUp',
    toolCount: 18,
  },

  // Trading Categories
  {
    id: 'trading-cex',
    name: 'CEX Trading',
    description: 'Centralized exchange integrations - Binance, Coinbase, etc.',
    icon: 'Building2',
    toolCount: 25,
  },
  {
    id: 'trading-bots',
    name: 'Trading Bots',
    description: 'Automated trading strategies and bot operations',
    icon: 'Bot',
    toolCount: 15,
  },
  {
    id: 'trading-signals',
    name: 'Trading Signals',
    description: 'Trading signals, alerts, and analysis',
    icon: 'Bell',
    toolCount: 12,
  },

  // Market Data Categories
  {
    id: 'market-data-prices',
    name: 'Price Data',
    description: 'Real-time and historical price feeds',
    icon: 'DollarSign',
    toolCount: 20,
  },
  {
    id: 'market-data-analytics',
    name: 'Market Analytics',
    description: 'Market analysis, metrics, and insights',
    icon: 'BarChart3',
    toolCount: 18,
  },
  {
    id: 'market-data-onchain',
    name: 'On-chain Data',
    description: 'On-chain analytics and blockchain data',
    icon: 'Database',
    toolCount: 22,
  },

  // Wallet Categories
  {
    id: 'wallets-management',
    name: 'Wallet Management',
    description: 'Wallet creation, import, and management',
    icon: 'Wallet',
    toolCount: 15,
  },
  {
    id: 'wallets-signing',
    name: 'Signing',
    description: 'Message and transaction signing',
    icon: 'PenTool',
    toolCount: 10,
  },
  {
    id: 'wallets-ens',
    name: 'ENS & Domains',
    description: 'ENS, Unstoppable Domains, and identity',
    icon: 'AtSign',
    toolCount: 8,
  },

  // NFT Categories
  {
    id: 'nft-trading',
    name: 'NFT Trading',
    description: 'NFT marketplace operations - OpenSea, Blur, etc.',
    icon: 'Image',
    toolCount: 18,
  },
  {
    id: 'nft-analytics',
    name: 'NFT Analytics',
    description: 'NFT collection and market analytics',
    icon: 'PieChart',
    toolCount: 12,
  },
  {
    id: 'nft-metadata',
    name: 'NFT Metadata',
    description: 'NFT metadata and asset management',
    icon: 'FileImage',
    toolCount: 8,
  },

  // Security Categories
  {
    id: 'security-audit',
    name: 'Security Audit',
    description: 'Smart contract security analysis',
    icon: 'Shield',
    toolCount: 10,
  },
  {
    id: 'security-scanning',
    name: 'Scanning',
    description: 'Vulnerability scanning and detection',
    icon: 'Scan',
    toolCount: 8,
  },
  {
    id: 'security-monitoring',
    name: 'Monitoring',
    description: 'Real-time security monitoring and alerts',
    icon: 'Activity',
    toolCount: 6,
  },

  // AI Agent Categories
  {
    id: 'ai-agents-frameworks',
    name: 'AI Frameworks',
    description: 'AI agent frameworks and SDK integrations',
    icon: 'Brain',
    toolCount: 12,
  },
  {
    id: 'ai-agents-orchestration',
    name: 'AI Orchestration',
    description: 'Multi-agent coordination and workflows',
    icon: 'GitBranch',
    toolCount: 8,
  },

  // Other Categories
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'RPC, indexing, and infrastructure tools',
    icon: 'Server',
    toolCount: 15,
  },
  {
    id: 'payments',
    name: 'Payments',
    description: 'Payment processing and x402 protocol',
    icon: 'CreditCard',
    toolCount: 10,
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Social features and community tools',
    icon: 'Users',
    toolCount: 8,
  },
  {
    id: 'governance',
    name: 'Governance',
    description: 'DAO governance and voting tools',
    icon: 'Vote',
    toolCount: 6,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Portfolio and performance analytics',
    icon: 'LineChart',
    toolCount: 10,
  },
];

export const CATEGORY_GROUPS = [
  {
    name: 'Blockchain',
    categories: ['blockchain-evm', 'blockchain-solana', 'blockchain-multichain'],
  },
  {
    name: 'DeFi',
    categories: ['defi-lending', 'defi-dex', 'defi-staking', 'defi-yield'],
  },
  {
    name: 'Trading',
    categories: ['trading-cex', 'trading-bots', 'trading-signals'],
  },
  {
    name: 'Market Data',
    categories: ['market-data-prices', 'market-data-analytics', 'market-data-onchain'],
  },
  {
    name: 'Wallets',
    categories: ['wallets-management', 'wallets-signing', 'wallets-ens'],
  },
  {
    name: 'NFT',
    categories: ['nft-trading', 'nft-analytics', 'nft-metadata'],
  },
  {
    name: 'Security',
    categories: ['security-audit', 'security-scanning', 'security-monitoring'],
  },
  {
    name: 'AI Agents',
    categories: ['ai-agents-frameworks', 'ai-agents-orchestration'],
  },
  {
    name: 'Other',
    categories: ['infrastructure', 'payments', 'social', 'governance', 'analytics'],
  },
];

export function getCategoryById(id: ToolCategoryId): ToolCategory | undefined {
  return TOOL_CATEGORIES.find(c => c.id === id);
}

export function getCategoryGroup(categoryId: ToolCategoryId): string | undefined {
  for (const group of CATEGORY_GROUPS) {
    if (group.categories.includes(categoryId)) {
      return group.name;
    }
  }
  return undefined;
}

export function getTotalToolCount(): number {
  return TOOL_CATEGORIES.reduce((sum, cat) => sum + cat.toolCount, 0);
}
