/**
 * Jupiter DCA (Dollar Cost Average) Service
 * 
 * Handles creating and managing DCA orders via Jupiter.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import type {
  DCAParams,
  TransactionResult,
  TradingEngineConfig,
} from '../types.js';

// Jupiter DCA Program ID
const JUPITER_DCA_PROGRAM_ID = new PublicKey('DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M');

/**
 * DCA Account state
 */
export interface DCAAccountState {
  /** DCA account address */
  address: string;
  /** User (owner) */
  user: string;
  /** Input token mint */
  inputMint: string;
  /** Output token mint */
  outputMint: string;
  /** Total input amount */
  inDeposited: bigint;
  /** Amount per cycle */
  inAmountPerCycle: bigint;
  /** Cycle frequency in seconds */
  cycleFrequency: number;
  /** Next cycle timestamp */
  nextCycleAt: number;
  /** Total input used */
  inUsed: bigint;
  /** Total output received */
  outReceived: bigint;
  /** Number of fills */
  fillsCount: number;
  /** Created timestamp */
  createdAt: number;
}

/**
 * Jupiter DCA service for dollar cost averaging
 */
export class JupiterDCA {
  private readonly connection: Connection;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
  }

  /**
   * Create a new DCA order
   */
  async createDCAOrder(
    params: DCAParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    const userPublicKey = new PublicKey(params.userPublicKey);
    const inputMint = new PublicKey(params.inputMint);
    const outputMint = new PublicKey(params.outputMint);

    // Calculate DCA account PDA
    const [dcaAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('dca'),
        userPublicKey.toBuffer(),
        inputMint.toBuffer(),
        outputMint.toBuffer(),
        Buffer.from(new Uint8Array(new BigUint64Array([BigInt(Date.now())]).buffer)),
      ],
      JUPITER_DCA_PROGRAM_ID
    );

    // Get or create user token accounts
    const userInputAta = await getAssociatedTokenAddress(inputMint, userPublicKey);
    const userOutputAta = await getAssociatedTokenAddress(outputMint, userPublicKey);

    // Build the transaction
    const transaction = new Transaction();

    // Check if output ATA needs to be created
    const outputAtaInfo = await this.connection.getAccountInfo(userOutputAta);
    if (!outputAtaInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPublicKey,
          userOutputAta,
          userPublicKey,
          outputMint
        )
      );
    }

    // Create DCA instruction data
    const instructionData = this.buildDCAInstructionData(params);

    // Add DCA create instruction
    transaction.add(
      new TransactionInstruction({
        programId: JUPITER_DCA_PROGRAM_ID,
        keys: [
          { pubkey: dcaAccount, isSigner: false, isWritable: true },
          { pubkey: userPublicKey, isSigner: true, isWritable: true },
          { pubkey: inputMint, isSigner: false, isWritable: false },
          { pubkey: outputMint, isSigner: false, isWritable: false },
          { pubkey: userInputAta, isSigner: false, isWritable: true },
          { pubkey: userOutputAta, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        data: instructionData,
      })
    );

    // Set recent blockhash
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPublicKey;

    // Sign the transaction
    if (signer instanceof Uint8Array) {
      const { Keypair } = await import('@solana/web3.js');
      const keypair = Keypair.fromSecretKey(signer);
      transaction.sign(keypair);
    } else {
      await signer(transaction);
    }

    // Send and confirm
    try {
      const signature = await this.connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

      const confirmation = await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');

      return {
        signature,
        confirmed: !confirmation.value.err,
        error: confirmation.value.err ? JSON.stringify(confirmation.value.err) : undefined,
      };
    } catch (error) {
      return {
        signature: '',
        confirmed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Build DCA instruction data
   */
  private buildDCAInstructionData(params: DCAParams): Buffer {
    // DCA instruction discriminator + params
    const buffer = Buffer.alloc(1 + 8 + 8 + 8 + 8 + 8 + 8);
    let offset = 0;

    // Instruction discriminator (0 = create)
    buffer.writeUInt8(0, offset);
    offset += 1;

    // inAmount (u64)
    buffer.writeBigUInt64LE(params.inAmount, offset);
    offset += 8;

    // inAmountPerCycle (u64)
    buffer.writeBigUInt64LE(params.inAmountPerCycle, offset);
    offset += 8;

    // cycleFrequency (i64)
    buffer.writeBigInt64LE(BigInt(params.cycleFrequency), offset);
    offset += 8;

    // minOutAmountPerCycle (u64, optional, 0 if not set)
    buffer.writeBigUInt64LE(params.minOutAmountPerCycle ?? 0n, offset);
    offset += 8;

    // maxOutAmountPerCycle (u64, optional, max if not set)
    buffer.writeBigUInt64LE(params.maxOutAmountPerCycle ?? BigInt('18446744073709551615'), offset);
    offset += 8;

    // startAt (i64, optional, 0 for immediate)
    buffer.writeBigInt64LE(BigInt(params.startAt ?? 0), offset);

    return buffer;
  }

  /**
   * Get DCA account state
   */
  async getDCAAccount(dcaAccountAddress: string): Promise<DCAAccountState | null> {
    const accountInfo = await this.connection.getAccountInfo(new PublicKey(dcaAccountAddress));
    
    if (!accountInfo) {
      return null;
    }

    return this.decodeDCAAccount(dcaAccountAddress, accountInfo.data);
  }

  /**
   * Decode DCA account data
   */
  private decodeDCAAccount(address: string, data: Buffer): DCAAccountState {
    let offset = 8; // Skip discriminator

    const user = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const inputMint = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const outputMint = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const inDeposited = data.readBigUInt64LE(offset);
    offset += 8;

    const inAmountPerCycle = data.readBigUInt64LE(offset);
    offset += 8;

    const cycleFrequency = Number(data.readBigInt64LE(offset));
    offset += 8;

    const nextCycleAt = Number(data.readBigInt64LE(offset));
    offset += 8;

    const inUsed = data.readBigUInt64LE(offset);
    offset += 8;

    const outReceived = data.readBigUInt64LE(offset);
    offset += 8;

    const fillsCount = data.readUInt32LE(offset);
    offset += 4;

    const createdAt = Number(data.readBigInt64LE(offset));

    return {
      address,
      user,
      inputMint,
      outputMint,
      inDeposited,
      inAmountPerCycle,
      cycleFrequency,
      nextCycleAt,
      inUsed,
      outReceived,
      fillsCount,
      createdAt,
    };
  }

  /**
   * Get all DCA accounts for a user
   */
  async getUserDCAAccounts(userPublicKey: string): Promise<DCAAccountState[]> {
    const accounts = await this.connection.getProgramAccounts(JUPITER_DCA_PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 8, // After discriminator
            bytes: userPublicKey,
          },
        },
      ],
    });

    return accounts.map(({ pubkey, account }) =>
      this.decodeDCAAccount(pubkey.toBase58(), account.data)
    );
  }

  /**
   * Close a DCA account and withdraw remaining funds
   */
  async closeDCAAccount(
    dcaAccountAddress: string,
    userPublicKey: string,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    const dcaAccount = new PublicKey(dcaAccountAddress);
    const user = new PublicKey(userPublicKey);

    // Get DCA account state to determine token mints
    const dcaState = await this.getDCAAccount(dcaAccountAddress);
    if (!dcaState) {
      throw new Error('DCA account not found');
    }

    const inputMint = new PublicKey(dcaState.inputMint);
    const outputMint = new PublicKey(dcaState.outputMint);
    const userInputAta = await getAssociatedTokenAddress(inputMint, user);
    const userOutputAta = await getAssociatedTokenAddress(outputMint, user);

    // Build close instruction
    const transaction = new Transaction();
    
    transaction.add(
      new TransactionInstruction({
        programId: JUPITER_DCA_PROGRAM_ID,
        keys: [
          { pubkey: dcaAccount, isSigner: false, isWritable: true },
          { pubkey: user, isSigner: true, isWritable: true },
          { pubkey: userInputAta, isSigner: false, isWritable: true },
          { pubkey: userOutputAta, isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        data: Buffer.from([1]), // Close instruction discriminator
      })
    );

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = user;

    // Sign
    if (signer instanceof Uint8Array) {
      const { Keypair } = await import('@solana/web3.js');
      const keypair = Keypair.fromSecretKey(signer);
      transaction.sign(keypair);
    } else {
      await signer(transaction);
    }

    // Send
    try {
      const signature = await this.connection.sendRawTransaction(transaction.serialize());
      const confirmation = await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');

      return {
        signature,
        confirmed: !confirmation.value.err,
        error: confirmation.value.err ? JSON.stringify(confirmation.value.err) : undefined,
      };
    } catch (error) {
      return {
        signature: '',
        confirmed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
