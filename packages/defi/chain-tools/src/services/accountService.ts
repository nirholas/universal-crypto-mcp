import { ethers } from "ethers";
import { getChainById } from "./chainService.js";
import { getProvider } from "../utils/blockchain.js";
import { logger } from "../utils/logger.js";

export type BalanceInfo = {
  address: string;
  balance: string;
  currency: string;
};

/**
 * Get account balance for an address on a specific chain
 * 
 * @param chainId Chain ID
 * @param address Wallet address to check balance for
 * @returns Balance information
 */
export async function getBalance(chainId: string, address: string): Promise<BalanceInfo> {
  try {
    // Validate address
    if (!ethers.isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    // Get chain info
    const chain = await getChainById(chainId);
    if (!chain) {
      throw new Error(`Chain with ID ${chainId} not found`);
    }

    // Get provider for the chain
    const provider = getProvider(chainId);
    
    // Get balance in wei
    const balanceWei = await provider.getBalance(address);
    
    // Convert to ETH/native token
    const balance = ethers.formatEther(balanceWei);
    
    return {
      address,
      balance,
      currency: chain.currency,
    };
  } catch (error) {
    logger.error(`Error getting balance for ${address} on chain ${chainId}:`, error);
    throw error;
  }
}
