/**
 * Unified Blockchain API Layer
 * 
 * Real API integrations for multi-chain data fetching
 * Supports EVM chains (Alchemy) and Solana (Helius)
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// Alchemy APIs for EVM chains
export {
  getTokenBalances,
  getNativeBalance,
  getTokenMetadata,
  getNFTsForOwner,
  getAssetTransfers,
  getGasPrice,
  estimateGas,
  getTokenApprovals,
  isAlchemyConfigured,
} from './alchemy';

// Helius APIs for Solana
export {
  getSolanaTokenBalances,
  getSolanaBalance,
  getSolanaNFTs,
  getSolanaTransactionHistory,
  getSolanaPriorityFees,
  isHeliusConfigured,
} from './helius';

import { TokenBalance, NFT, Transaction, GasEstimate } from '../types';
import * as alchemy from './alchemy';
import * as helius from './helius';

// ============================================
// Chain Family Detection
// ============================================

const SOLANA_CHAIN_IDS = [101, 102, 103]; // Mainnet, testnet, devnet

export function isSolanaChain(chainId: number): boolean {
  return SOLANA_CHAIN_IDS.includes(chainId);
}

export function isEvmChain(chainId: number): boolean {
  return !SOLANA_CHAIN_IDS.includes(chainId);
}

// ============================================
// Unified Token Balance Fetching
// ============================================

/**
 * Get all token balances for an address on any supported chain
 */
export async function getBalances(
  address: string,
  chainId: number
): Promise<TokenBalance[]> {
  if (isSolanaChain(chainId)) {
    const cluster = chainId === 101 ? 'mainnet' : 'devnet';
    return helius.getSolanaTokenBalances(address, cluster);
  }
  
  // EVM chain
  const erc20Balances = await alchemy.getTokenBalances(address, chainId);
  const nativeBalance = await alchemy.getNativeBalance(address, chainId);
  
  return [nativeBalance, ...erc20Balances];
}

/**
 * Get native token balance (ETH, MATIC, SOL, etc.)
 */
export async function getNativeTokenBalance(
  address: string,
  chainId: number
): Promise<TokenBalance> {
  if (isSolanaChain(chainId)) {
    const cluster = chainId === 101 ? 'mainnet' : 'devnet';
    return helius.getSolanaBalance(address, cluster);
  }
  
  return alchemy.getNativeBalance(address, chainId);
}

// ============================================
// Unified NFT Fetching
// ============================================

/**
 * Get NFTs for an address on any supported chain
 */
export async function getNFTs(
  address: string,
  chainId: number,
  options?: { page?: number; limit?: number; pageKey?: string }
): Promise<{ nfts: NFT[]; total: number; pageKey?: string }> {
  if (isSolanaChain(chainId)) {
    const cluster = chainId === 101 ? 'mainnet' : 'devnet';
    return helius.getSolanaNFTs(address, cluster, options?.page, options?.limit);
  }
  
  const result = await alchemy.getNFTsForOwner(address, chainId, options?.pageKey);
  return {
    nfts: result.nfts,
    total: result.nfts.length,
    pageKey: result.pageKey,
  };
}

// ============================================
// Unified Transaction History
// ============================================

/**
 * Get transaction history for an address on any supported chain
 */
export async function getTransactionHistory(
  address: string,
  chainId: number,
  options?: { before?: string; limit?: number; pageKey?: string }
): Promise<{ transactions: Transaction[]; hasMore: boolean; pageKey?: string }> {
  if (isSolanaChain(chainId)) {
    const cluster = chainId === 101 ? 'mainnet' : 'devnet';
    return helius.getSolanaTransactionHistory(address, cluster, options);
  }
  
  const result = await alchemy.getAssetTransfers(address, chainId, {
    maxCount: options?.limit,
    pageKey: options?.pageKey,
  });
  
  return {
    transactions: result.transfers,
    hasMore: result.pageKey !== undefined,
    pageKey: result.pageKey,
  };
}

// ============================================
// Unified Gas Estimation
// ============================================

/**
 * Get gas prices for a chain
 */
export async function getGasPrices(
  chainId: number
): Promise<GasEstimate> {
  if (isSolanaChain(chainId)) {
    const cluster = chainId === 101 ? 'mainnet' : 'devnet';
    const fees = await helius.getSolanaPriorityFees(cluster);
    
    // Convert to GasEstimate format
    return {
      chainId,
      slow: BigInt(fees.low),
      standard: BigInt(fees.medium),
      fast: BigInt(fees.high),
      instant: BigInt(fees.veryHigh),
      estimatedCost: BigInt(fees.medium),
      estimatedCostUsd: 0, // Would need SOL price
    };
  }
  
  const gasPrices = await alchemy.getGasPrice(chainId);
  return {
    chainId,
    slow: gasPrices.slow,
    standard: gasPrices.standard,
    fast: gasPrices.fast,
    instant: gasPrices.instant,
    baseFee: gasPrices.baseFee,
  };
}

// ============================================
// API Health Check
// ============================================

/**
 * Check if APIs are configured for a chain
 */
export function isApiConfigured(chainId: number): boolean {
  if (isSolanaChain(chainId)) {
    return helius.isHeliusConfigured();
  }
  return alchemy.isAlchemyConfigured();
}

/**
 * Get API status for all chains
 */
export function getApiStatus(): {
  evm: boolean;
  solana: boolean;
  configured: string[];
  missing: string[];
} {
  const evmConfigured = alchemy.isAlchemyConfigured();
  const solanaConfigured = helius.isHeliusConfigured();
  
  const configured: string[] = [];
  const missing: string[] = [];
  
  if (evmConfigured) {
    configured.push('Alchemy (EVM)');
  } else {
    missing.push('NEXT_PUBLIC_ALCHEMY_API_KEY');
  }
  
  if (solanaConfigured) {
    configured.push('Helius (Solana)');
  } else {
    missing.push('NEXT_PUBLIC_HELIUS_API_KEY');
  }
  
  return {
    evm: evmConfigured,
    solana: solanaConfigured,
    configured,
    missing,
  };
}
