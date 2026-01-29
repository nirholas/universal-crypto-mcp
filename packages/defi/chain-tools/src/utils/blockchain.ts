import { ethers } from 'ethers';
import { logger } from './logger.js';
import { getChainById } from '../services/chainService.js';

// Cache providers to avoid creating too many connections
const providerCache: Record<string, ethers.JsonRpcProvider> = {};

/**
 * Get a configured provider for a specific chain
 */
export function getProvider(chainId: string): ethers.JsonRpcProvider {
  // Check cache first
  if (providerCache[chainId]) {
    return providerCache[chainId];
  }

  // For default chains, use pre-defined RPC URLs
  const infuraKey = process.env.INFURA_API_KEY;
  
  if (!infuraKey) {
    throw new Error('INFURA_API_KEY environment variable is required');
  }

  let rpcUrl: string;

  switch (chainId) {
    case '1': // Ethereum Mainnet
      rpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`;
      break;
    case '11155111': // Sepolia Testnet
      rpcUrl = `https://sepolia.infura.io/v3/${infuraKey}`;
      break;
    case '137': // Polygon Mainnet
      rpcUrl = `https://polygon-mainnet.infura.io/v3/${infuraKey}`;
      break;
    case '80001': // Polygon Mumbai
      rpcUrl = `https://polygon-mumbai.infura.io/v3/${infuraKey}`;
      break;
    default:
      // For unknown chains, look up in the database
      rpcUrl = ''; // Will be set below
  }

  // If RPC URL is not pre-defined, try to get from database
  if (!rpcUrl) {
    // This is async, but we need a sync result
    // In practice, you'd want to refactor to make getProvider async
    // or pre-cache providers at startup
    throw new Error(`No RPC URL configured for chain ID ${chainId}`);
  }

  try {
    // Create provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Cache provider
    providerCache[chainId] = provider;
    
    logger.debug(`Created provider for chain ID ${chainId}`);
    
    return provider;
  } catch (error) {
    logger.error(`Failed to create provider for chain ID ${chainId}:`, error);
    throw new Error(`Could not connect to RPC for chain ${chainId}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get a list of supported chain IDs
 */
export async function getSupportedChainIds(): Promise<string[]> {
  const chains = await getChainById('1'); // Just to load the initial chains
  
  return Object.keys(providerCache);
}

/**
 * Format an address to checksum format
 */
export function formatAddress(address: string): string {
  try {
    return ethers.getAddress(address);
  } catch (error) {
    throw new Error(`Invalid address: ${address}`);
  }
}

/**
 * Check if an address is valid
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

/**
 * Clean up and close all providers
 */
export function closeAllProviders(): void {
  for (const chainId in providerCache) {
    try {
      // There's no explicit close method in ethers v6, but we can clear the cache
      delete providerCache[chainId];
    } catch (error) {
      logger.error(`Error closing provider for chain ${chainId}:`, error);
    }
  }
}
