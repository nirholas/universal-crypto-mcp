/**
 * Snipe Module
 * Snipe token launches across multiple wallets
 */

import {
  Connection,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js';
import type { SnipeLaunchParams, SnipeResult } from '../types.js';
import { TokenLaunchError, TokenLaunchErrorCode } from '../types.js';
import { logger } from '../utils/logger.js';
import { toBaseUnits } from '../utils/amounts.js';
import { buildPumpFunBuyTransaction, buyOnPumpFun, fetchPumpFunCurve } from '../pumpfun/client.js';

/** Jito bundles carry at most five transactions. */
const JITO_MAX_BUNDLE_TRANSACTIONS = 5;

type WalletSigner = (walletId: string) => Promise<{
  publicKey: PublicKey;
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
}>;

/**
 * Per-wallet spend in base units of the coin's quote mint. `amountPerWallet`
 * is in whole quote units, so a pump coin paired with a token quote is
 * converted with that quote mint's decimals.
 */
async function pumpFunQuoteAmount(
  connection: Connection,
  tokenMint: string,
  amountPerWallet: string
): Promise<bigint> {
  const curve = await fetchPumpFunCurve(connection, tokenMint);
  if (!curve) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.POOL_NOT_FOUND,
      `${tokenMint} has no pump bonding curve`
    );
  }
  return toBaseUnits(amountPerWallet, curve.state.quoteDecimals);
}

/**
 * Snipe a token launch with multiple wallets
 */
export async function snipeLaunch(
  connection: Connection,
  params: SnipeLaunchParams,
  getWalletKeypair: WalletSigner
): Promise<SnipeResult> {
  const {
    tokenMint,
    dex,
    walletIds,
    amountPerWallet,
    slippageBps,
    useJito: _useJito,
    maxRetries = 3,
  } = params;
  
  logger.info('Starting snipe operation', {
    tokenMint,
    dex,
    walletCount: walletIds.length,
    amountPerWallet,
  });
  
  if (dex !== 'pumpfun') {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.INVALID_PARAMS,
      `Sniping on ${dex} is not supported; snipeLaunch buys pump coins (dex: 'pumpfun')`
    );
  }

  const results: SnipeResult['results'] = [];
  let successfulSnipes = 0;
  let failedSnipes = 0;
  let totalQuoteSpent = 0n;
  let totalTokensReceived = 0n;
  
  // Process wallets in parallel (with concurrency limit)
  const CONCURRENCY = 10;
  const quoteAmount = await pumpFunQuoteAmount(connection, tokenMint, amountPerWallet);
  
  for (let i = 0; i < walletIds.length; i += CONCURRENCY) {
    const batch = walletIds.slice(i, i + CONCURRENCY);
    
    const batchPromises = batch.map(async (walletId) => {
      const wallet = await getWalletKeypair(walletId);
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await buyOnPumpFun(
            connection,
            tokenMint,
            wallet.publicKey,
            quoteAmount,
            slippageBps,
            wallet.signTransaction
          );
          
          return {
            walletId,
            success: true,
            signature: result.signature,
            tokensReceived: result.tokensReceived.toString(),
            solSpent: amountPerWallet,
          };
        } catch (error) {
          if (attempt === maxRetries - 1) {
            return {
              walletId,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      return {
        walletId,
        success: false,
        error: 'Max retries exceeded',
      };
    });
    
    const batchResults = await Promise.all(batchPromises);
    
    for (const result of batchResults) {
      results.push(result);
      if (result.success) {
        successfulSnipes++;
        totalQuoteSpent += quoteAmount;
        totalTokensReceived += BigInt(result.tokensReceived || '0');
      } else {
        failedSnipes++;
      }
    }
  }
  
  logger.info('Snipe operation completed', {
    successfulSnipes,
    failedSnipes,
    totalQuoteSpent: totalQuoteSpent.toString(),
    totalTokensReceived: totalTokensReceived.toString(),
  });
  
  return {
    success: successfulSnipes > 0,
    totalWallets: walletIds.length,
    successfulSnipes,
    failedSnipes,
    totalSolSpent: totalQuoteSpent.toString(),
    totalTokensReceived: totalTokensReceived.toString(),
    results,
  };
}

/**
 * Snipe a pump coin with one Jito bundle: one signed buy per wallet, landed
 * atomically. Each buy is quoted against the curve as read before the
 * bundle, so later buys in the bundle see a higher price than their quote;
 * `slippageBps` must cover the bundle's own price impact or the bundle
 * reverts as a whole. The tip is added by `jitoClient`.
 */
export async function snipeWithJitoBundle(
  connection: Connection,
  params: SnipeLaunchParams,
  getWalletKeypair: WalletSigner,
  jitoClient: {
    sendBundle: (txs: VersionedTransaction[], tipLamports: string) => Promise<{ bundleId: string }>;
  }
): Promise<SnipeResult> {
  const {
    tokenMint,
    dex,
    walletIds,
    amountPerWallet,
    slippageBps,
    jitoTipLamports = '10000000', // 0.01 SOL default
  } = params;

  if (dex !== 'pumpfun') {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.INVALID_PARAMS,
      `Jito bundle sniping supports pump coins (dex: 'pumpfun'), not ${dex}`
    );
  }
  if (walletIds.length > JITO_MAX_BUNDLE_TRANSACTIONS) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.BUNDLE_FAILED,
      `Jito bundles support max ${JITO_MAX_BUNDLE_TRANSACTIONS} transactions. Split into multiple bundles.`
    );
  }
  
  logger.info('Starting Jito bundle snipe', {
    tokenMint,
    walletCount: walletIds.length,
    tipLamports: jitoTipLamports,
  });
  
  const quoteAmount = await pumpFunQuoteAmount(connection, tokenMint, amountPerWallet);
  const transactions: VersionedTransaction[] = [];
  const quotedTokens: bigint[] = [];

  for (const walletId of walletIds) {
    const wallet = await getWalletKeypair(walletId);
    const built = await buildPumpFunBuyTransaction(
      connection,
      tokenMint,
      wallet.publicKey,
      quoteAmount,
      slippageBps,
      wallet.signTransaction
    );
    transactions.push(built.transaction);
    quotedTokens.push(built.expectedTokens);
    logger.debug('Built transaction for wallet', { walletId, venue: built.venue });
  }
  
  try {
    const result = await jitoClient.sendBundle(transactions, jitoTipLamports);
    const totalTokens = quotedTokens.reduce((sum, tokens) => sum + tokens, 0n);
    
    return {
      success: true,
      totalWallets: walletIds.length,
      successfulSnipes: walletIds.length,
      failedSnipes: 0,
      totalSolSpent: (quoteAmount * BigInt(walletIds.length)).toString(),
      totalTokensReceived: totalTokens.toString(),
      bundleId: result.bundleId,
      results: walletIds.map((walletId, index) => ({
        walletId,
        success: true,
        tokensReceived: quotedTokens[index]?.toString(),
        solSpent: amountPerWallet,
      })),
    };
  } catch (error) {
    logger.error('Jito bundle failed', { error });
    
    return {
      success: false,
      totalWallets: walletIds.length,
      successfulSnipes: 0,
      failedSnipes: walletIds.length,
      totalSolSpent: '0',
      totalTokensReceived: '0',
      results: walletIds.map(walletId => ({
        walletId,
        success: false,
        error: error instanceof Error ? error.message : 'Bundle failed',
      })),
    };
  }
}
