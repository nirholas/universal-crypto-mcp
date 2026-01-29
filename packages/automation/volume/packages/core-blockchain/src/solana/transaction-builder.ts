/**
 * Solana Transaction Builder
 * Build and manage Solana transactions
 */

import {
  Transaction,
  TransactionInstruction as SolanaTransactionInstruction,
  PublicKey,
  Keypair,
  Connection,
} from '@solana/web3.js';

export interface TransactionInstruction {
  programId: string;
  keys: Array<{
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
  }>;
  data: Buffer;
}

export interface TransactionOptions {
  feePayer?: string;
  recentBlockhash?: string;
  signers?: Keypair[];
  priorityFee?: number;
}

export class SolanaTransactionBuilder {
  private instructions: SolanaTransactionInstruction[] = [];
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  addInstruction(instruction: TransactionInstruction): this {
    const ix = new SolanaTransactionInstruction({
      programId: new PublicKey(instruction.programId),
      keys: instruction.keys.map(k => ({
        pubkey: new PublicKey(k.pubkey),
        isSigner: k.isSigner,
        isWritable: k.isWritable,
      })),
      data: instruction.data,
    });
    this.instructions.push(ix);
    return this;
  }

  async build(options: TransactionOptions): Promise<Transaction> {
    const tx = new Transaction();
    
    if (options.feePayer) {
      tx.feePayer = new PublicKey(options.feePayer);
    }

    if (options.recentBlockhash) {
      tx.recentBlockhash = options.recentBlockhash;
    } else {
      const { blockhash } = await this.connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
    }

    for (const ix of this.instructions) {
      tx.add(ix);
    }

    return tx;
  }

  clear(): void {
    this.instructions = [];
  }
}
