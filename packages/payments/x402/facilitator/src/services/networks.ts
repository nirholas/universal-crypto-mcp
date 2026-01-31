/**
 * Multi-Chain Configuration
 * 
 * Defines supported networks for the facilitator with RPC endpoints,
 * token addresses, and chain-specific configuration.
 * 
 * @author nich
 * @license MIT
 */

import { type Chain, type Address } from 'viem';
import { arbitrum, arbitrumSepolia, base, baseSepolia, optimism, optimismSepolia, polygon, polygonMumbai } from 'viem/chains';

/**
 * CAIP-2 Network Identifier
 */
export type NetworkId = 
  | 'eip155:42161'    // Arbitrum One
  | 'eip155:421614'   // Arbitrum Sepolia
  | 'eip155:8453'     // Base
  | 'eip155:84532'    // Base Sepolia
  | 'eip155:10'       // Optimism
  | 'eip155:11155420' // Optimism Sepolia
  | 'eip155:137'      // Polygon
  | 'eip155:80001';   // Polygon Mumbai

/**
 * Legacy network names for backwards compatibility
 */
export type NetworkName = 
  | 'arbitrum'
  | 'arbitrum-sepolia'
  | 'base'
  | 'base-sepolia'
  | 'optimism'
  | 'optimism-sepolia'
  | 'polygon'
  | 'polygon-mumbai';

/**
 * Token addresses by network
 */
export interface TokenAddresses {
  USDC: Address;
  USDT?: Address;
  DAI?: Address;
  USDs?: Address;  // Sperax USD (Arbitrum)
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  id: NetworkId;
  name: NetworkName;
  chain: Chain;
  displayName: string;
  isTestnet: boolean;
  rpcUrl: string;
  blockExplorer: string;
  tokens: TokenAddresses;
  avgBlockTime: number;  // seconds
  confirmationsRequired: number;
  supportsEIP3009: boolean;
}

/**
 * All supported networks
 */
export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  // Arbitrum One (Production)
  'eip155:42161': {
    id: 'eip155:42161',
    name: 'arbitrum',
    chain: arbitrum,
    displayName: 'Arbitrum One',
    isTestnet: false,
    rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    tokens: {
      USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      USDs: '0xD74f5255D557944cf7Dd0E45FF521520002D5748',
    },
    avgBlockTime: 0.25,
    confirmationsRequired: 1,
    supportsEIP3009: true,
  },

  // Arbitrum Sepolia (Testnet)
  'eip155:421614': {
    id: 'eip155:421614',
    name: 'arbitrum-sepolia',
    chain: arbitrumSepolia,
    displayName: 'Arbitrum Sepolia',
    isTestnet: true,
    rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: 'https://sepolia.arbiscan.io',
    tokens: {
      USDC: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    },
    avgBlockTime: 0.25,
    confirmationsRequired: 1,
    supportsEIP3009: true,
  },

  // Base (Production)
  'eip155:8453': {
    id: 'eip155:8453',
    name: 'base',
    chain: base,
    displayName: 'Base',
    isTestnet: false,
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    tokens: {
      USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    },
    avgBlockTime: 2,
    confirmationsRequired: 1,
    supportsEIP3009: true,
  },

  // Base Sepolia (Testnet)
  'eip155:84532': {
    id: 'eip155:84532',
    name: 'base-sepolia',
    chain: baseSepolia,
    displayName: 'Base Sepolia',
    isTestnet: true,
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
    tokens: {
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    },
    avgBlockTime: 2,
    confirmationsRequired: 1,
    supportsEIP3009: true,
  },

  // Optimism (Production)
  'eip155:10': {
    id: 'eip155:10',
    name: 'optimism',
    chain: optimism,
    displayName: 'Optimism',
    isTestnet: false,
    rpcUrl: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    tokens: {
      USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    },
    avgBlockTime: 2,
    confirmationsRequired: 1,
    supportsEIP3009: true,
  },

  // Optimism Sepolia (Testnet)
  'eip155:11155420': {
    id: 'eip155:11155420',
    name: 'optimism-sepolia',
    chain: optimismSepolia,
    displayName: 'Optimism Sepolia',
    isTestnet: true,
    rpcUrl: process.env.OPTIMISM_SEPOLIA_RPC_URL || 'https://sepolia.optimism.io',
    blockExplorer: 'https://sepolia-optimism.etherscan.io',
    tokens: {
      USDC: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
    },
    avgBlockTime: 2,
    confirmationsRequired: 1,
    supportsEIP3009: true,
  },

  // Polygon (Production)
  'eip155:137': {
    id: 'eip155:137',
    name: 'polygon',
    chain: polygon,
    displayName: 'Polygon',
    isTestnet: false,
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    tokens: {
      USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    },
    avgBlockTime: 2,
    confirmationsRequired: 5,
    supportsEIP3009: true,
  },

  // Polygon Mumbai (Testnet)
  'eip155:80001': {
    id: 'eip155:80001',
    name: 'polygon-mumbai',
    chain: polygonMumbai,
    displayName: 'Polygon Mumbai',
    isTestnet: true,
    rpcUrl: process.env.POLYGON_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
    tokens: {
      USDC: '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23',
    },
    avgBlockTime: 2,
    confirmationsRequired: 5,
    supportsEIP3009: true,
  },
};

/**
 * Get network config by CAIP-2 ID
 */
export function getNetworkById(id: NetworkId): NetworkConfig | undefined {
  return NETWORKS[id];
}

/**
 * Get network config by legacy name
 */
export function getNetworkByName(name: NetworkName): NetworkConfig | undefined {
  return Object.values(NETWORKS).find(n => n.name === name);
}

/**
 * Get network from either ID or name
 */
export function getNetwork(idOrName: NetworkId | NetworkName): NetworkConfig | undefined {
  return NETWORKS[idOrName as NetworkId] || getNetworkByName(idOrName as NetworkName);
}

/**
 * Get all production networks
 */
export function getProductionNetworks(): NetworkConfig[] {
  return Object.values(NETWORKS).filter(n => !n.isTestnet);
}

/**
 * Get all testnet networks
 */
export function getTestnetNetworks(): NetworkConfig[] {
  return Object.values(NETWORKS).filter(n => n.isTestnet);
}

/**
 * Get token address for a network
 */
export function getTokenAddress(
  network: NetworkId | NetworkName,
  token: keyof TokenAddresses
): Address | undefined {
  const config = getNetwork(network);
  return config?.tokens[token];
}

/**
 * Validate a network ID
 */
export function isValidNetwork(id: string): id is NetworkId {
  return id in NETWORKS;
}

/**
 * Parse CAIP-2 network ID
 */
export function parseNetworkId(id: NetworkId): { namespace: string; reference: string } {
  const [namespace, reference] = id.split(':');
  return { namespace, reference };
}

/**
 * Get chain ID from CAIP-2 network ID
 */
export function getChainId(id: NetworkId): number {
  const { reference } = parseNetworkId(id);
  return parseInt(reference, 10);
}

/**
 * Default networks for the facilitator
 */
export const DEFAULT_NETWORKS: NetworkId[] = [
  'eip155:42161',   // Arbitrum
  'eip155:8453',    // Base
  'eip155:10',      // Optimism
];

/**
 * Default testnets for development
 */
export const DEFAULT_TESTNETS: NetworkId[] = [
  'eip155:421614',  // Arbitrum Sepolia
  'eip155:84532',   // Base Sepolia
];
