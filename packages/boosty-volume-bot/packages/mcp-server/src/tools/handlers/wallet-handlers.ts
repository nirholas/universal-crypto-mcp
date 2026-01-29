/**
 * Tool Handlers - Wallet Operations
 * Real integration with @boosty/mcp-wallet-manager
 */

import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import type {
  WalletSwarmResult,
  WalletBalanceResult,
  FundDistributionResult,
  ConsolidationResult,
  WalletInfo,
  ToolResult,
} from '../../types.js';
import { logger } from '../../utils/logger.js';
import {
  hdWalletFactory,
  keyVault,
  getWalletBalance,
  getWalletBalances as getBalancesBatch,
  createFundDistributor,
  consolidateSolSequential,
  type DerivedWallet,
  type WalletBalance,
} from '@boosty/mcp-wallet-manager';

// Connection singleton
let connection: Connection | null = null;

function getConnection(): Connection {
  if (!connection) {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    connection = new Connection(rpcUrl, 'confirmed');
  }
  return connection;
}

// In-memory wallet registry (in production, use database)
const walletRegistry = new Map<string, {
  wallet: DerivedWallet;
  tag: string;
  createdAt: Date;
}>();

/**
 * Create a swarm of wallets using HD derivation
 */
export async function createWalletSwarm(args: {
  count: number;
  tag?: string;
  fundEach?: number;
}): Promise<ToolResult<WalletSwarmResult>> {
  logger.info({ args }, 'Creating wallet swarm');
  
  if (args.count < 1 || args.count > 1000) {
    return {
      success: false,
      error: {
        code: 'INVALID_COUNT',
        message: 'Wallet count must be between 1 and 1000',
      },
    };
  }

  try {
    const tag = args.tag || `swarm-${Date.now()}`;
    
    // Check if we have a master wallet, create one if not
    let masterWalletId = process.env.MASTER_WALLET_ID;
    
    if (!masterWalletId) {
      // Generate a new master wallet for this swarm
      const masterResult = await hdWalletFactory.createMasterWallet();
      masterWalletId = masterResult.wallet.id;
      
      // Store the mnemonic securely (encrypted)
      const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
      await keyVault.storeKey(
        masterWalletId,
        Buffer.from(masterResult.mnemonic),
        encryptionKey
      );
      
      logger.info({ masterWalletId }, 'Created new master wallet for swarm');
    }
    
    // Derive child wallets
    const startIndex = walletRegistry.size;
    const wallets: { id: string; address: string }[] = [];
    
    for (let i = 0; i < args.count; i++) {
      const derivationIndex = startIndex + i;
      const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
      const storedKey = await keyVault.getKey(masterWalletId, encryptionKey);
      
      if (!storedKey) {
        throw new Error('Master wallet key not found');
      }
      
      const mnemonic = Buffer.from(storedKey).toString('utf-8');
      const derived = await hdWalletFactory.deriveWallet(mnemonic, derivationIndex);
      
      const walletId = `${tag}-${derivationIndex}`;
      walletRegistry.set(walletId, {
        wallet: derived,
        tag,
        createdAt: new Date(),
      });
      
      wallets.push({
        id: walletId,
        address: derived.publicKey,
      });
    }
    
    // Fund wallets if requested
    let totalFunded = 0n;
    if (args.fundEach && args.fundEach > 0) {
      const fundingWalletId = process.env.FUNDING_WALLET_ID;
      if (fundingWalletId) {
        const fundingEntry = walletRegistry.get(fundingWalletId);
        if (fundingEntry) {
          const conn = getConnection();
          const distributor = createFundDistributor(conn);
          
          const targetAddresses = wallets.map(w => w.address);
          const amountLamports = BigInt(Math.floor(args.fundEach * LAMPORTS_PER_SOL));
          
          const result = await distributor.distribute({
            sourceKeypair: fundingEntry.wallet.keypair,
            targets: targetAddresses.map(addr => ({
              address: addr,
              amount: amountLamports,
            })),
            strategy: 'equal',
          });
          
          totalFunded = result.totalTransferred;
          logger.info({ totalFunded: totalFunded.toString() }, 'Funded swarm wallets');
        }
      }
    }
    
    logger.info({ count: args.count, tag }, 'Created wallet swarm');
    
    return {
      success: true,
      data: {
        count: args.count,
        tag,
        wallets,
        totalFunded: totalFunded.toString(),
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to create wallet swarm');
    return {
      success: false,
      error: {
        code: 'CREATE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error creating wallet swarm',
      },
    };
  }
}

/**
 * Get balances for specified wallets
 */
export async function getWalletBalances(args: {
  walletIds?: string[];
  tag?: string;
  includeTokens?: boolean;
}): Promise<ToolResult<WalletBalanceResult[]>> {
  logger.info({ args }, 'Getting wallet balances');

  try {
    const conn = getConnection();
    
    // Get wallet addresses to query
    let walletsToQuery: { id: string; address: string }[] = [];
    
    if (args.walletIds && args.walletIds.length > 0) {
      for (const id of args.walletIds) {
        const entry = walletRegistry.get(id);
        if (entry) {
          walletsToQuery.push({ id, address: entry.wallet.publicKey });
        }
      }
    } else if (args.tag) {
      for (const [id, entry] of walletRegistry.entries()) {
        if (entry.tag === args.tag) {
          walletsToQuery.push({ id, address: entry.wallet.publicKey });
        }
      }
    } else {
      // Return all wallets
      for (const [id, entry] of walletRegistry.entries()) {
        walletsToQuery.push({ id, address: entry.wallet.publicKey });
      }
    }
    
    if (walletsToQuery.length === 0) {
      return {
        success: true,
        data: [],
      };
    }
    
    // Fetch balances
    const results: WalletBalanceResult[] = [];
    
    for (const wallet of walletsToQuery) {
      try {
        const balance = await getWalletBalance(
          conn,
          new PublicKey(wallet.address),
          args.includeTokens
        );
        
        results.push({
          walletId: wallet.id,
          address: wallet.address,
          solBalance: (balance.lamports / BigInt(LAMPORTS_PER_SOL)).toString(),
          lamports: balance.lamports.toString(),
          tokens: args.includeTokens ? balance.tokens?.map(t => ({
            mint: t.mint,
            balance: t.balance.toString(),
            decimals: t.decimals,
            symbol: t.symbol,
          })) : undefined,
        });
      } catch (err) {
        logger.warn({ walletId: wallet.id, error: err }, 'Failed to get balance for wallet');
        results.push({
          walletId: wallet.id,
          address: wallet.address,
          solBalance: '0',
          lamports: '0',
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
    
    return {
      success: true,
      data: results,
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to get wallet balances');
    return {
      success: false,
      error: {
        code: 'BALANCE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error getting balances',
      },
    };
  }
}

/**
 * Distribute funds from source to target wallets
 */
export async function distributeFunds(args: {
  sourceWalletId: string;
  targetWalletIds?: string[];
  targetTag?: string;
  amountEach: string;
}): Promise<ToolResult<FundDistributionResult>> {
  logger.info({ args }, 'Distributing funds');

  if (!args.targetWalletIds && !args.targetTag) {
    return {
      success: false,
      error: {
        code: 'MISSING_TARGET',
        message: 'Must specify either targetWalletIds or targetTag',
      },
    };
  }

  try {
    const conn = getConnection();
    
    // Get source wallet
    const sourceEntry = walletRegistry.get(args.sourceWalletId);
    if (!sourceEntry) {
      return {
        success: false,
        error: {
          code: 'SOURCE_NOT_FOUND',
          message: `Source wallet ${args.sourceWalletId} not found`,
        },
      };
    }
    
    // Get target wallets
    const targets: { id: string; address: string }[] = [];
    
    if (args.targetWalletIds) {
      for (const id of args.targetWalletIds) {
        const entry = walletRegistry.get(id);
        if (entry) {
          targets.push({ id, address: entry.wallet.publicKey });
        }
      }
    } else if (args.targetTag) {
      for (const [id, entry] of walletRegistry.entries()) {
        if (entry.tag === args.targetTag) {
          targets.push({ id, address: entry.wallet.publicKey });
        }
      }
    }
    
    if (targets.length === 0) {
      return {
        success: false,
        error: {
          code: 'NO_TARGETS',
          message: 'No target wallets found',
        },
      };
    }
    
    const distributor = createFundDistributor(conn);
    const amountLamports = BigInt(Math.floor(parseFloat(args.amountEach) * LAMPORTS_PER_SOL));
    
    const result = await distributor.distribute({
      sourceKeypair: sourceEntry.wallet.keypair,
      targets: targets.map(t => ({
        address: t.address,
        amount: amountLamports,
      })),
      strategy: 'equal',
    });
    
    const distributions = result.results.map((r, i) => ({
      walletId: targets[i]?.id || 'unknown',
      address: targets[i]?.address || 'unknown',
      amount: amountLamports.toString(),
      signature: r.signature || undefined,
      success: r.success,
      error: r.error,
    }));
    
    return {
      success: true,
      data: {
        sourceWallet: args.sourceWalletId,
        distributions,
        totalDistributed: result.totalTransferred.toString(),
        successCount: result.successCount,
        failCount: result.failCount,
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to distribute funds');
    return {
      success: false,
      error: {
        code: 'DISTRIBUTE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error distributing funds',
      },
    };
  }
}

/**
 * Consolidate funds from multiple wallets to a target
 */
export async function consolidateFunds(args: {
  sourceWalletIds?: string[];
  sourceTag?: string;
  targetWalletId: string;
  leaveMinimum?: string;
}): Promise<ToolResult<ConsolidationResult>> {
  logger.info({ args }, 'Consolidating funds');

  if (!args.sourceWalletIds && !args.sourceTag) {
    return {
      success: false,
      error: {
        code: 'MISSING_SOURCE',
        message: 'Must specify either sourceWalletIds or sourceTag',
      },
    };
  }

  try {
    const conn = getConnection();
    
    // Get target wallet
    const targetEntry = walletRegistry.get(args.targetWalletId);
    if (!targetEntry) {
      return {
        success: false,
        error: {
          code: 'TARGET_NOT_FOUND',
          message: `Target wallet ${args.targetWalletId} not found`,
        },
      };
    }
    
    // Get source wallets
    const sources: { id: string; entry: typeof targetEntry }[] = [];
    
    if (args.sourceWalletIds) {
      for (const id of args.sourceWalletIds) {
        const entry = walletRegistry.get(id);
        if (entry) {
          sources.push({ id, entry });
        }
      }
    } else if (args.sourceTag) {
      for (const [id, entry] of walletRegistry.entries()) {
        if (entry.tag === args.sourceTag && id !== args.targetWalletId) {
          sources.push({ id, entry });
        }
      }
    }
    
    if (sources.length === 0) {
      return {
        success: false,
        error: {
          code: 'NO_SOURCES',
          message: 'No source wallets found',
        },
      };
    }
    
    const leaveMinimumLamports = args.leaveMinimum 
      ? BigInt(Math.floor(parseFloat(args.leaveMinimum) * LAMPORTS_PER_SOL))
      : 5000n; // Leave minimum for rent
    
    const result = await consolidateSolSequential(
      conn,
      sources.map(s => s.entry.wallet.keypair),
      new PublicKey(targetEntry.wallet.publicKey),
      leaveMinimumLamports
    );
    
    const consolidations = result.results.map((r, i) => ({
      walletId: sources[i]?.id || 'unknown',
      address: sources[i]?.entry.wallet.publicKey || 'unknown',
      amount: r.amount?.toString() || '0',
      signature: r.signature || undefined,
      success: r.success,
      error: r.error,
    }));
    
    return {
      success: true,
      data: {
        targetWallet: args.targetWalletId,
        consolidations,
        totalConsolidated: result.totalConsolidated.toString(),
        successCount: result.successCount,
        failCount: result.failCount,
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to consolidate funds');
    return {
      success: false,
      error: {
        code: 'CONSOLIDATE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error consolidating funds',
      },
    };
  }
}

/**
 * List wallets with optional filtering
 */
export async function listWallets(args: {
  tag?: string;
  limit?: number;
  offset?: number;
}): Promise<ToolResult<WalletInfo[]>> {
  logger.info({ args }, 'Listing wallets');

  try {
    const limit = args.limit || 100;
    const offset = args.offset || 0;
    
    let wallets: WalletInfo[] = [];
    let index = 0;
    
    for (const [id, entry] of walletRegistry.entries()) {
      if (args.tag && entry.tag !== args.tag) {
        continue;
      }
      
      if (index >= offset && wallets.length < limit) {
        wallets.push({
          id,
          address: entry.wallet.publicKey,
          tag: entry.tag,
          createdAt: entry.createdAt.toISOString(),
          derivationIndex: entry.wallet.derivationIndex,
        });
      }
      index++;
    }
    
    return {
      success: true,
      data: wallets,
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to list wallets');
    return {
      success: false,
      error: {
        code: 'LIST_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error listing wallets',
      },
    };
  }
}

/**
 * Delete a wallet from the registry
 */
export async function deleteWallet(args: {
  walletId: string;
  force?: boolean;
}): Promise<ToolResult<{ deleted: boolean; walletId: string }>> {
  logger.info({ args }, 'Deleting wallet');

  try {
    const entry = walletRegistry.get(args.walletId);
    
    if (!entry) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Wallet ${args.walletId} not found`,
        },
      };
    }
    
    // Check balance if not force delete
    if (!args.force) {
      const conn = getConnection();
      const balance = await conn.getBalance(new PublicKey(entry.wallet.publicKey));
      
      if (balance > 0) {
        return {
          success: false,
          error: {
            code: 'HAS_BALANCE',
            message: `Wallet has ${balance / LAMPORTS_PER_SOL} SOL. Use force=true to delete anyway.`,
          },
        };
      }
    }
    
    // Securely clear the keypair
    entry.wallet.keypair.secretKey.fill(0);
    walletRegistry.delete(args.walletId);
    
    logger.info({ walletId: args.walletId }, 'Wallet deleted');
    
    return {
      success: true,
      data: {
        deleted: true,
        walletId: args.walletId,
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to delete wallet');
    return {
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error deleting wallet',
      },
    };
  }
}
