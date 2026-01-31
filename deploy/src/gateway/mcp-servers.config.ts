/**
 * MCP Servers Configuration
 * 
 * Defines all available MCP servers for the gateway
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { MCPServerConfig } from './mcp-manager.js';
import path from 'path';

const WORKSPACE_ROOT = path.resolve(process.cwd(), '..');

export const MCP_SERVERS: MCPServerConfig[] = [
  // ============================================================================
  // DeFi Protocols
  // ============================================================================
  {
    id: 'aave',
    name: 'Aave Protocol',
    category: 'defi',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/defi/aave-mcp'),
    autoRestart: true,
  },
  {
    id: 'uniswap-v3',
    name: 'Uniswap V3',
    category: 'defi',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/defi/uniswap-v3-mcp'),
    autoRestart: true,
  },
  {
    id: 'curve',
    name: 'Curve Finance',
    category: 'defi',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/curve-mcp'),
    autoRestart: true,
  },
  {
    id: 'compound-v3',
    name: 'Compound V3',
    category: 'defi',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/compound-v3-mcp'),
    autoRestart: true,
  },
  {
    id: 'lido',
    name: 'Lido Staking',
    category: 'defi',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/lido-mcp'),
    autoRestart: true,
  },

  // ============================================================================
  // Market Data
  // ============================================================================
  {
    id: 'coingecko-pro',
    name: 'CoinGecko Pro',
    category: 'market-data',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/coingecko-pro-mcp'),
    autoRestart: true,
  },
  {
    id: 'defillama',
    name: 'DefiLlama',
    category: 'market-data',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/defillama-mcp'),
    autoRestart: true,
  },
  {
    id: 'dune-analytics',
    name: 'Dune Analytics',
    category: 'market-data',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/dune-analytics-mcp'),
    autoRestart: true,
  },

  // ============================================================================
  // Layer 2
  // ============================================================================
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    category: 'layer2',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/arbitrum-mcp'),
    autoRestart: true,
  },
  {
    id: 'optimism',
    name: 'Optimism',
    category: 'layer2',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/optimism-mcp'),
    autoRestart: true,
  },
  {
    id: 'base-chain',
    name: 'Base Chain',
    category: 'layer2',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/base-chain-mcp'),
    autoRestart: true,
  },
  {
    id: 'polygon-zkevm',
    name: 'Polygon zkEVM',
    category: 'layer2',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/polygon-zkevm-mcp'),
    autoRestart: true,
  },

  // ============================================================================
  // NFT & Gaming
  // ============================================================================
  {
    id: 'opensea',
    name: 'OpenSea',
    category: 'nft',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/opensea-mcp'),
    autoRestart: true,
  },
  {
    id: 'blur',
    name: 'Blur',
    category: 'nft',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/blur-mcp'),
    autoRestart: true,
  },
  {
    id: 'axie-infinity',
    name: 'Axie Infinity',
    category: 'nft',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/axie-infinity-mcp'),
    autoRestart: true,
  },

  // ============================================================================
  // Wallet & Identity
  // ============================================================================
  {
    id: 'ens-domains',
    name: 'ENS Domains',
    category: 'wallets',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/wallets/ens-domains-mcp'),
    autoRestart: true,
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    category: 'wallets',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/wallets/walletconnect-mcp'),
    autoRestart: true,
  },
  {
    id: 'safe-gnosis',
    name: 'Safe (Gnosis)',
    category: 'wallets',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/wallets/safe-gnosis-mcp'),
    autoRestart: true,
  },

  // ============================================================================
  // Additional DeFi
  // ============================================================================
  {
    id: 'gmx-v2',
    name: 'GMX V2',
    category: 'defi',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/gmx-v2-mcp'),
    autoRestart: true,
  },
  {
    id: 'yearn',
    name: 'Yearn Finance',
    category: 'defi',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/yearn-mcp'),
    autoRestart: true,
  },
];

/**
 * Get server config by ID
 */
export function getServerConfig(id: string): MCPServerConfig | undefined {
  return MCP_SERVERS.find(server => server.id === id);
}

/**
 * Get servers by category
 */
export function getServersByCategory(category: string): MCPServerConfig[] {
  return MCP_SERVERS.filter(server => server.category === category);
}

/**
 * Get all server IDs
 */
export function getAllServerIds(): string[] {
  return MCP_SERVERS.map(server => server.id);
}

