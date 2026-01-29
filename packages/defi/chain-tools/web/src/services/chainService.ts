import { api } from './api';

export interface Chain {
  id: string;
  name: string;
  currency: string;
  rpcUrl: string;
  explorerUrl: string;
  isTestnet: boolean;
  isActive: boolean;
}

/**
 * Get all supported chains
 */
export async function getChains(): Promise<Chain[]> {
  try {
    const response = await api.chains.list();
    return response.chains;
  } catch (error) {
    console.error('Error fetching chains:', error);
    throw error;
  }
}

/**
 * Get chain by ID
 */
export async function getChainById(chainId: string): Promise<Chain | null> {
  try {
    const response = await api.chains.getById(chainId);
    return response;
  } catch (error) {
    console.error(`Error fetching chain ${chainId}:`, error);
    throw error;
  }
}

/**
 * Get native token balance for an address on a specific chain
 */
export async function getBalance(
  chainId: string, 
  address: string
): Promise<{ address: string; balance: string; currency: string }> {
  try {
    const response = await api.chains.getBalance(chainId, address);
    return response;
  } catch (error) {
    console.error(`Error fetching balance for ${address} on chain ${chainId}:`, error);
    throw error;
  }
}

/**
 * Read data from a contract
 */
export async function readContract(
  chainId: string,
  address: string,
  method: string,
  args: any[] = []
): Promise<any> {
  try {
    const response = await api.chains.readContract(chainId, address, method, args);
    return response.result;
  } catch (error) {
    console.error(`Error reading contract ${address} method ${method}:`, error);
    throw error;
  }
}
