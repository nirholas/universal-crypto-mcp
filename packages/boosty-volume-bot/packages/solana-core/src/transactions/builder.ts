/**
 * Transaction Builder
 * Construct versioned transactions with Address Lookup Tables support
 */

import {
  Connection,
  PublicKey,
  Keypair,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  AddressLookupTableAccount,
  Transaction,
  MessageV0,
} from '@solana/web3.js';
import {
  TransactionBuilder as ITransactionBuilder,
  SimulationResult,
  TransactionBuilderConfig,
} from '../types.js';
import {
  estimateComputeUnits,
  createComputeBudgetInstructions,
  calculateTransactionFee,
} from './compute-budget.js';
import { logger } from '../utils/logger.js';

export class TransactionBuilder implements ITransactionBuilder {
  private instructions: TransactionInstruction[] = [];
  private computeUnits: number = 0;
  private priorityFee: number = 0;
  private feePayer: PublicKey;
  private lookupTables: AddressLookupTableAccount[] = [];
  private recentBlockhash?: string;
  private lastValidBlockHeight?: number;

  constructor(
    private readonly connection: Connection,
    config: Partial<TransactionBuilderConfig> = {}
  ) {
    if (!config.payer) {
      throw new Error('Payer public key is required');
    }
    this.feePayer = config.payer;
    this.computeUnits = config.computeUnitLimit || 0;
    this.priorityFee = config.computeUnitPrice || 0;
    this.lookupTables = config.addressLookupTables || [];
    this.recentBlockhash = config.recentBlockhash;
  }

  /**
   * Add a single instruction
   */
  addInstruction(ix: TransactionInstruction): TransactionBuilder {
    this.instructions.push(ix);
    return this;
  }

  /**
   * Add multiple instructions
   */
  addInstructions(ixs: TransactionInstruction[]): TransactionBuilder {
    this.instructions.push(...ixs);
    return this;
  }

  /**
   * Set compute unit limit
   */
  setComputeUnits(units: number): TransactionBuilder {
    this.computeUnits = units;
    return this;
  }

  /**
   * Set priority fee (micro lamports per compute unit)
   */
  setPriorityFee(microLamports: number): TransactionBuilder {
    this.priorityFee = microLamports;
    return this;
  }

  /**
   * Set fee payer
   */
  setFeePayer(payer: PublicKey): TransactionBuilder {
    this.feePayer = payer;
    return this;
  }

  /**
   * Use an Address Lookup Table
   */
  useAddressLookupTable(alt: AddressLookupTableAccount): TransactionBuilder {
    this.lookupTables.push(alt);
    return this;
  }

  /**
   * Use multiple Address Lookup Tables
   */
  useAddressLookupTables(alts: AddressLookupTableAccount[]): TransactionBuilder {
    this.lookupTables.push(...alts);
    return this;
  }

  /**
   * Simulate the transaction
   */
  async simulate(): Promise<SimulationResult> {
    const transaction = await this.build();
    
    const simulation = await this.connection.simulateTransaction(transaction, {
      sigVerify: false,
      replaceRecentBlockhash: true,
    });

    const result: SimulationResult = {
      success: simulation.value.err === null,
      unitsConsumed: simulation.value.unitsConsumed || 0,
      logs: simulation.value.logs || [],
      error: simulation.value.err ? JSON.stringify(simulation.value.err) : undefined,
      accounts: simulation.value.accounts,
    };

    if (!result.success) {
      logger.warn('Transaction simulation failed', {
        error: result.error,
        logs: result.logs.slice(-5),
      });
    }

    return result;
  }

  /**
   * Estimate compute units needed
   */
  async estimateComputeUnits(): Promise<number> {
    const units = await estimateComputeUnits(
      this.connection,
      this.instructions,
      this.feePayer,
      this.lookupTables
    );
    return units;
  }

  /**
   * Build the versioned transaction
   */
  async build(): Promise<VersionedTransaction> {
    if (this.instructions.length === 0) {
      throw new Error('No instructions added to transaction');
    }

    // Get blockhash if not provided
    if (!this.recentBlockhash) {
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
      this.recentBlockhash = blockhash;
      this.lastValidBlockHeight = lastValidBlockHeight;
    }

    // Build final instructions with compute budget
    const finalInstructions: TransactionInstruction[] = [];

    // Add compute budget instructions if needed
    if (this.computeUnits > 0 || this.priorityFee > 0) {
      const budgetIxs = createComputeBudgetInstructions(
        this.computeUnits || 200_000,
        this.priorityFee
      );
      finalInstructions.push(...budgetIxs);
    }

    finalInstructions.push(...this.instructions);

    // Compile message
    const message = MessageV0.compile({
      payerKey: this.feePayer,
      recentBlockhash: this.recentBlockhash,
      instructions: finalInstructions,
      addressLookupTableAccounts: this.lookupTables,
    });

    return new VersionedTransaction(message);
  }

  /**
   * Build and sign the transaction
   */
  async buildAndSign(signers: Keypair[]): Promise<VersionedTransaction> {
    const transaction = await this.build();
    transaction.sign(signers);
    return transaction;
  }

  /**
   * Build legacy transaction (for compatibility)
   */
  async buildLegacy(): Promise<Transaction> {
    if (!this.recentBlockhash) {
      const { blockhash } = await this.connection.getLatestBlockhash();
      this.recentBlockhash = blockhash;
    }

    const transaction = new Transaction();
    transaction.feePayer = this.feePayer;
    transaction.recentBlockhash = this.recentBlockhash;

    // Add compute budget if needed
    if (this.computeUnits > 0 || this.priorityFee > 0) {
      const budgetIxs = createComputeBudgetInstructions(
        this.computeUnits || 200_000,
        this.priorityFee
      );
      budgetIxs.forEach(ix => transaction.add(ix));
    }

    this.instructions.forEach(ix => transaction.add(ix));

    return transaction;
  }

  /**
   * Get serialized transaction size
   */
  async getSerializedSize(): Promise<number> {
    const transaction = await this.build();
    return transaction.serialize().length;
  }

  /**
   * Calculate estimated fee
   */
  getEstimatedFee(): number {
    return calculateTransactionFee(
      this.computeUnits || 200_000,
      this.priorityFee
    );
  }

  /**
   * Get instruction count
   */
  getInstructionCount(): number {
    return this.instructions.length;
  }

  /**
   * Clear all instructions
   */
  clear(): TransactionBuilder {
    this.instructions = [];
    this.recentBlockhash = undefined;
    this.lastValidBlockHeight = undefined;
    return this;
  }

  /**
   * Clone builder with same configuration
   */
  clone(): TransactionBuilder {
    const builder = new TransactionBuilder(this.connection, {
      payer: this.feePayer,
      computeUnitLimit: this.computeUnits,
      computeUnitPrice: this.priorityFee,
      addressLookupTables: [...this.lookupTables],
      recentBlockhash: this.recentBlockhash,
    });
    builder.addInstructions([...this.instructions]);
    return builder;
  }

  /**
   * Auto-optimize transaction by simulating and adjusting compute units
   */
  async optimize(): Promise<TransactionBuilder> {
    const simulation = await this.simulate();
    
    if (simulation.success && simulation.unitsConsumed) {
      // Add 20% buffer to actual consumption
      const optimizedUnits = Math.ceil(simulation.unitsConsumed * 1.2);
      this.setComputeUnits(Math.min(optimizedUnits, 1_400_000));
    }
    
    return this;
  }

  /**
   * Check if transaction will likely succeed
   */
  async validate(): Promise<{ valid: boolean; error?: string; logs?: string[] }> {
    try {
      const simulation = await this.simulate();
      return {
        valid: simulation.success,
        error: simulation.error,
        logs: simulation.logs,
      };
    } catch (error) {
      return {
        valid: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Get all unique accounts that will be accessed
   */
  getAccounts(): PublicKey[] {
    const accounts = new Set<string>();
    
    for (const ix of this.instructions) {
      accounts.add(ix.programId.toBase58());
      for (const key of ix.keys) {
        accounts.add(key.pubkey.toBase58());
      }
    }
    
    return Array.from(accounts).map(addr => new PublicKey(addr));
  }

  /**
   * Check if transaction exceeds size limit
   */
  async exceedsSizeLimit(): Promise<boolean> {
    const size = await this.getSerializedSize();
    return size > 1232; // Max transaction size
  }
}

/**
 * Create a new transaction builder
 */
export function createTransactionBuilder(
  connection: Connection,
  payer: PublicKey,
  options: Partial<TransactionBuilderConfig> = {}
): TransactionBuilder {
  return new TransactionBuilder(connection, { ...options, payer });
}

/**
 * Load Address Lookup Table
 */
export async function loadAddressLookupTable(
  connection: Connection,
  address: PublicKey
): Promise<AddressLookupTableAccount | null> {
  const account = await connection.getAddressLookupTable(address);
  return account.value;
}

/**
 * Load multiple Address Lookup Tables
 */
export async function loadAddressLookupTables(
  connection: Connection,
  addresses: PublicKey[]
): Promise<AddressLookupTableAccount[]> {
  const results = await Promise.all(
    addresses.map(addr => loadAddressLookupTable(connection, addr))
  );
  return results.filter((r): r is AddressLookupTableAccount => r !== null);
}

/**
 * Find commonly used ALTs for popular programs
 */
export const COMMON_LOOKUP_TABLES = {
  // Jupiter
  JUPITER_V6: new PublicKey('GxS6FiQ3mNnAar9HGQ6MxvVUxL2PBRmMCpB1vmLtKs9q'),
  // Raydium
  RAYDIUM_V4: new PublicKey('B1gSV5VQYBA6BFd3SVFR9qLVtC6tLJ89MHUXz8nL9j6K'),
  // Orca
  ORCA_WHIRLPOOL: new PublicKey('EwHjUn4HvnbQuPmQQWC7R4kAVSYLYkwXnU9F8gKVYPU3'),
};

