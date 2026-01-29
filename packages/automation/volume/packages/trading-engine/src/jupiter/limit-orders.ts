/**
 * Jupiter Limit Orders Service
 * 
 * Handles creating and managing limit orders via Jupiter.
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
  LimitOrderParams,
  TransactionResult,
  TradingEngineConfig,
} from '../types.js';

// Jupiter Limit Order Program ID
const JUPITER_LIMIT_ORDER_PROGRAM_ID = new PublicKey('jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu');

/**
 * Limit order state
 */
export interface LimitOrderState {
  /** Order account address */
  address: string;
  /** Maker (owner) */
  maker: string;
  /** Input token mint */
  inputMint: string;
  /** Output token mint */
  outputMint: string;
  /** Original input amount */
  oriInAmount: bigint;
  /** Original output amount (limit price) */
  oriOutAmount: bigint;
  /** Remaining input amount */
  inAmount: bigint;
  /** Remaining output amount */
  outAmount: bigint;
  /** Expiry timestamp (0 = no expiry) */
  expiredAt: number;
  /** Order created timestamp */
  createdAt: number;
  /** Order bump seed */
  bump: number;
}

/**
 * Jupiter Limit Orders service
 */
export class JupiterLimitOrders {
  private readonly connection: Connection;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
  }

  /**
   * Create a new limit order
   */
  async createLimitOrder(
    params: LimitOrderParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    const userPublicKey = new PublicKey(params.userPublicKey);
    const inputMint = new PublicKey(params.inputMint);
    const outputMint = new PublicKey(params.outputMint);

    // Generate a unique order ID
    const orderId = Date.now();
    const orderIdBuffer = Buffer.alloc(8);
    orderIdBuffer.writeBigUInt64LE(BigInt(orderId));

    // Calculate order account PDA
    const [orderAccount, bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('order'),
        userPublicKey.toBuffer(),
        orderIdBuffer,
      ],
      JUPITER_LIMIT_ORDER_PROGRAM_ID
    );

    // Get token accounts
    const userInputAta = await getAssociatedTokenAddress(inputMint, userPublicKey);
    const userOutputAta = await getAssociatedTokenAddress(outputMint, userPublicKey);

    // Order escrow for input tokens
    const [orderInputVault] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), orderAccount.toBuffer()],
      JUPITER_LIMIT_ORDER_PROGRAM_ID
    );

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

    // Create limit order instruction
    const instructionData = this.buildLimitOrderInstructionData(params, orderId, bump);

    transaction.add(
      new TransactionInstruction({
        programId: JUPITER_LIMIT_ORDER_PROGRAM_ID,
        keys: [
          { pubkey: orderAccount, isSigner: false, isWritable: true },
          { pubkey: userPublicKey, isSigner: true, isWritable: true },
          { pubkey: inputMint, isSigner: false, isWritable: false },
          { pubkey: outputMint, isSigner: false, isWritable: false },
          { pubkey: userInputAta, isSigner: false, isWritable: true },
          { pubkey: orderInputVault, isSigner: false, isWritable: true },
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
   * Build limit order instruction data
   */
  private buildLimitOrderInstructionData(
    params: LimitOrderParams,
    orderId: number,
    bump: number
  ): Buffer {
    // Instruction: create_order
    const buffer = Buffer.alloc(1 + 8 + 8 + 8 + 8 + 1);
    let offset = 0;

    // Instruction discriminator (0 = create order)
    buffer.writeUInt8(0, offset);
    offset += 1;

    // Order ID (u64)
    buffer.writeBigUInt64LE(BigInt(orderId), offset);
    offset += 8;

    // Input amount (u64)
    buffer.writeBigUInt64LE(params.inAmount, offset);
    offset += 8;

    // Output amount (u64) - defines the limit price
    buffer.writeBigUInt64LE(params.outAmount, offset);
    offset += 8;

    // Expiry (i64, 0 = no expiry)
    buffer.writeBigInt64LE(BigInt(params.expiredAt ?? 0), offset);
    offset += 8;

    // Bump
    buffer.writeUInt8(bump, offset);

    return buffer;
  }

  /**
   * Get a limit order state
   */
  async getLimitOrder(orderAddress: string): Promise<LimitOrderState | null> {
    const accountInfo = await this.connection.getAccountInfo(new PublicKey(orderAddress));
    
    if (!accountInfo) {
      return null;
    }

    return this.decodeLimitOrder(orderAddress, accountInfo.data);
  }

  /**
   * Decode limit order account data
   */
  private decodeLimitOrder(address: string, data: Buffer): LimitOrderState {
    let offset = 8; // Skip discriminator

    const maker = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const inputMint = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const outputMint = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const oriInAmount = data.readBigUInt64LE(offset);
    offset += 8;

    const oriOutAmount = data.readBigUInt64LE(offset);
    offset += 8;

    const inAmount = data.readBigUInt64LE(offset);
    offset += 8;

    const outAmount = data.readBigUInt64LE(offset);
    offset += 8;

    const expiredAt = Number(data.readBigInt64LE(offset));
    offset += 8;

    const createdAt = Number(data.readBigInt64LE(offset));
    offset += 8;

    const bump = data.readUInt8(offset);

    return {
      address,
      maker,
      inputMint,
      outputMint,
      oriInAmount,
      oriOutAmount,
      inAmount,
      outAmount,
      expiredAt,
      createdAt,
      bump,
    };
  }

  /**
   * Get all limit orders for a user
   */
  async getUserLimitOrders(userPublicKey: string): Promise<LimitOrderState[]> {
    const accounts = await this.connection.getProgramAccounts(JUPITER_LIMIT_ORDER_PROGRAM_ID, {
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
      this.decodeLimitOrder(pubkey.toBase58(), account.data)
    );
  }

  /**
   * Cancel a limit order
   */
  async cancelLimitOrder(
    orderAddress: string,
    userPublicKey: string,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    const orderAccount = new PublicKey(orderAddress);
    const user = new PublicKey(userPublicKey);

    // Get order state to determine token mints
    const orderState = await this.getLimitOrder(orderAddress);
    if (!orderState) {
      throw new Error('Limit order not found');
    }

    const inputMint = new PublicKey(orderState.inputMint);
    const userInputAta = await getAssociatedTokenAddress(inputMint, user);

    // Order input vault
    const [orderInputVault] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), orderAccount.toBuffer()],
      JUPITER_LIMIT_ORDER_PROGRAM_ID
    );

    // Build cancel instruction
    const transaction = new Transaction();
    
    transaction.add(
      new TransactionInstruction({
        programId: JUPITER_LIMIT_ORDER_PROGRAM_ID,
        keys: [
          { pubkey: orderAccount, isSigner: false, isWritable: true },
          { pubkey: user, isSigner: true, isWritable: true },
          { pubkey: orderInputVault, isSigner: false, isWritable: true },
          { pubkey: userInputAta, isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        data: Buffer.from([1]), // Cancel instruction discriminator
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

  /**
   * Calculate the limit price from order amounts
   */
  calculateLimitPrice(
    inAmount: bigint,
    outAmount: bigint,
    inputDecimals: number,
    outputDecimals: number
  ): number {
    const inAmountNormalized = Number(inAmount) / Math.pow(10, inputDecimals);
    const outAmountNormalized = Number(outAmount) / Math.pow(10, outputDecimals);
    return outAmountNormalized / inAmountNormalized;
  }

  /**
   * Check if an order is expired
   */
  isExpired(order: LimitOrderState): boolean {
    if (order.expiredAt === 0) {
      return false; // No expiry
    }
    return Date.now() / 1000 > order.expiredAt;
  }

  /**
   * Check if an order is fully filled
   */
  isFilled(order: LimitOrderState): boolean {
    return order.inAmount === 0n;
  }

  /**
   * Get fill percentage
   */
  getFillPercentage(order: LimitOrderState): number {
    if (order.oriInAmount === 0n) return 100;
    const filled = order.oriInAmount - order.inAmount;
    return Number(filled * 10000n / order.oriInAmount) / 100;
  }
}
