/**
 * Raydium AMM V4 Integration
 * 
 * Handles interactions with Raydium AMM V4 pools.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import type {
  RaydiumPoolInfo,
  RaydiumSwapParams,
  TransactionResult,
  TradingEngineConfig,
} from '../types.js';
import { RAYDIUM_PROGRAM_IDS } from '../types.js';

/**
 * AMM V4 pool account layout offsets
 */
const AMM_V4_LAYOUT = {
  STATUS: 0,
  NONCE: 1,
  ORDER_NUM: 2,
  DEPTH: 4,
  BASE_DECIMALS: 6,
  QUOTE_DECIMALS: 7,
  STATE: 8,
  RESET_FLAG: 9,
  MIN_SIZE: 10,
  VOL_MAX_CUT_RATIO: 18,
  AMOUNT_WAVE_RATIO: 26,
  BASE_LOT_SIZE: 34,
  QUOTE_LOT_SIZE: 42,
  MIN_PRICE_MULTIPLIER: 50,
  MAX_PRICE_MULTIPLIER: 58,
  SYSTEM_DECIMALS_VALUE: 66,
  MIN_SEPARATE_NUMERATOR: 74,
  MIN_SEPARATE_DENOMINATOR: 82,
  TRADE_FEE_NUMERATOR: 90,
  TRADE_FEE_DENOMINATOR: 98,
  PNL_NUMERATOR: 106,
  PNL_DENOMINATOR: 114,
  SWAP_FEE_NUMERATOR: 122,
  SWAP_FEE_DENOMINATOR: 130,
  BASE_NEED_TAKE_PNL: 138,
  QUOTE_NEED_TAKE_PNL: 146,
  QUOTE_TOTAL_PNL: 154,
  BASE_TOTAL_PNL: 162,
  POOL_OPEN_TIME: 170,
  PUNISH_PC_AMOUNT: 178,
  PUNISH_COIN_AMOUNT: 186,
  ORDERBOOK_TO_INIT_TIME: 194,
  SWAP_BASE_IN_AMOUNT: 202,
  SWAP_QUOTE_OUT_AMOUNT: 218,
  SWAP_BASE_2_QUOTE_FEE: 226,
  SWAP_QUOTE_IN_AMOUNT: 234,
  SWAP_BASE_OUT_AMOUNT: 250,
  SWAP_QUOTE_2_BASE_FEE: 258,
  BASE_VAULT: 266,
  QUOTE_VAULT: 298,
  BASE_MINT: 330,
  QUOTE_MINT: 362,
  LP_MINT: 394,
  OPEN_ORDERS: 426,
  MARKET: 458,
  MARKET_PROGRAM: 490,
  TARGET_ORDERS: 522,
  WITHDRAW_QUEUE: 554,
  LP_VAULT: 586,
  AMM_OWNER: 618,
  LP_RESERVE: 650,
};

/**
 * Raydium AMM V4 service
 */
export class RaydiumAMM {
  private readonly connection: Connection;
  private readonly programId: PublicKey;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.programId = new PublicKey(RAYDIUM_PROGRAM_IDS.AMM_V4);
  }

  /**
   * Get AMM pool info by pool ID
   */
  async getPoolInfo(poolId: string): Promise<RaydiumPoolInfo> {
    const poolPubkey = new PublicKey(poolId);
    const accountInfo = await this.connection.getAccountInfo(poolPubkey);

    if (!accountInfo) {
      throw new Error(`Pool not found: ${poolId}`);
    }

    return this.decodePoolInfo(poolId, accountInfo.data);
  }

  /**
   * Decode AMM V4 pool account data
   */
  private decodePoolInfo(poolId: string, data: Buffer): RaydiumPoolInfo {
    const baseVault = new PublicKey(data.subarray(AMM_V4_LAYOUT.BASE_VAULT, AMM_V4_LAYOUT.BASE_VAULT + 32)).toBase58();
    const quoteVault = new PublicKey(data.subarray(AMM_V4_LAYOUT.QUOTE_VAULT, AMM_V4_LAYOUT.QUOTE_VAULT + 32)).toBase58();
    const baseMint = new PublicKey(data.subarray(AMM_V4_LAYOUT.BASE_MINT, AMM_V4_LAYOUT.BASE_MINT + 32)).toBase58();
    const quoteMint = new PublicKey(data.subarray(AMM_V4_LAYOUT.QUOTE_MINT, AMM_V4_LAYOUT.QUOTE_MINT + 32)).toBase58();
    const lpMint = new PublicKey(data.subarray(AMM_V4_LAYOUT.LP_MINT, AMM_V4_LAYOUT.LP_MINT + 32)).toBase58();

    const baseDecimals = data.readUInt8(AMM_V4_LAYOUT.BASE_DECIMALS);
    const quoteDecimals = data.readUInt8(AMM_V4_LAYOUT.QUOTE_DECIMALS);
    
    const tradeFeeNumerator = data.readBigUInt64LE(AMM_V4_LAYOUT.TRADE_FEE_NUMERATOR);
    const tradeFeeDenominator = data.readBigUInt64LE(AMM_V4_LAYOUT.TRADE_FEE_DENOMINATOR);
    const feeRate = Number(tradeFeeNumerator * 10000n / tradeFeeDenominator);

    const poolOpenTime = Number(data.readBigUInt64LE(AMM_V4_LAYOUT.POOL_OPEN_TIME));

    return {
      id: poolId,
      type: 'AMM_V4',
      baseMint,
      quoteMint,
      baseVault,
      quoteVault,
      lpMint,
      baseReserve: 0n, // Will be fetched from vault
      quoteReserve: 0n, // Will be fetched from vault
      baseDecimals,
      quoteDecimals,
      lpSupply: 0n, // Will be fetched from mint
      openTime: poolOpenTime,
      feeRate,
      swapFeeNumerator: Number(tradeFeeNumerator),
      swapFeeDenominator: Number(tradeFeeDenominator),
      price: 0, // Will be calculated
    };
  }

  /**
   * Get pool reserves from vault accounts
   */
  async getPoolReserves(poolInfo: RaydiumPoolInfo): Promise<{
    baseReserve: bigint;
    quoteReserve: bigint;
    lpSupply: bigint;
    price: number;
  }> {
    const [baseVaultInfo, quoteVaultInfo, lpMintInfo] = await Promise.all([
      this.connection.getTokenAccountBalance(new PublicKey(poolInfo.baseVault)),
      this.connection.getTokenAccountBalance(new PublicKey(poolInfo.quoteVault)),
      this.connection.getTokenSupply(new PublicKey(poolInfo.lpMint)),
    ]);

    const baseReserve = BigInt(baseVaultInfo.value.amount);
    const quoteReserve = BigInt(quoteVaultInfo.value.amount);
    const lpSupply = BigInt(lpMintInfo.value.amount);

    // Calculate price (quote per base)
    const baseDecimals = baseVaultInfo.value.decimals;
    const quoteDecimals = quoteVaultInfo.value.decimals;
    const price = (Number(quoteReserve) / Math.pow(10, quoteDecimals)) /
                  (Number(baseReserve) / Math.pow(10, baseDecimals));

    return { baseReserve, quoteReserve, lpSupply, price };
  }

  /**
   * Get full pool info including reserves
   */
  async getFullPoolInfo(poolId: string): Promise<RaydiumPoolInfo> {
    const poolInfo = await this.getPoolInfo(poolId);
    const reserves = await this.getPoolReserves(poolInfo);

    return {
      ...poolInfo,
      baseReserve: reserves.baseReserve,
      quoteReserve: reserves.quoteReserve,
      lpSupply: reserves.lpSupply,
      price: reserves.price,
    };
  }

  /**
   * Calculate swap output amount using constant product formula
   */
  calculateSwapOutput(
    amountIn: bigint,
    reserveIn: bigint,
    reserveOut: bigint,
    feeRateBps: number
  ): { amountOut: bigint; fee: bigint; priceImpact: number } {
    // Apply fee
    const feeMultiplier = 10000n - BigInt(feeRateBps);
    const amountInWithFee = amountIn * feeMultiplier / 10000n;
    const fee = amountIn - amountInWithFee;

    // Constant product: (x + dx) * (y - dy) = x * y
    // dy = y * dx / (x + dx)
    const numerator = reserveOut * amountInWithFee;
    const denominator = reserveIn + amountInWithFee;
    const amountOut = numerator / denominator;

    // Calculate price impact
    const idealOutput = (reserveOut * amountIn) / reserveIn;
    const priceImpact = Number(idealOutput - amountOut) / Number(idealOutput) * 100;

    return { amountOut, fee, priceImpact };
  }

  /**
   * Calculate required input for desired output
   */
  calculateSwapInput(
    amountOut: bigint,
    reserveIn: bigint,
    reserveOut: bigint,
    feeRateBps: number
  ): { amountIn: bigint; fee: bigint } {
    // dy = y * dx / (x + dx)
    // dx = x * dy / (y - dy)
    const numerator = reserveIn * amountOut;
    const denominator = reserveOut - amountOut;
    const amountInWithoutFee = numerator / denominator + 1n; // Round up

    // Add fee
    const feeMultiplier = 10000n / (10000n - BigInt(feeRateBps));
    const amountIn = amountInWithoutFee * feeMultiplier;
    const fee = amountIn - amountInWithoutFee;

    return { amountIn, fee };
  }

  /**
   * Build swap instruction for AMM V4
   */
  buildSwapInstruction(
    poolInfo: RaydiumPoolInfo,
    params: RaydiumSwapParams,
    userTokenAccounts: {
      userSourceToken: PublicKey;
      userDestToken: PublicKey;
    }
  ): TransactionInstruction {
    const poolPubkey = new PublicKey(poolInfo.id);
    const userPubkey = new PublicKey(params.userPublicKey);
    
    // Determine swap direction
    const isBaseToQuote = params.inputMint === poolInfo.baseMint;
    
    const keys = [
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: poolPubkey, isSigner: false, isWritable: true },
      { pubkey: new PublicKey(RAYDIUM_PROGRAM_IDS.AMM_V4), isSigner: false, isWritable: false },
      { pubkey: new PublicKey(poolInfo.baseVault), isSigner: false, isWritable: true },
      { pubkey: new PublicKey(poolInfo.quoteVault), isSigner: false, isWritable: true },
      { pubkey: userTokenAccounts.userSourceToken, isSigner: false, isWritable: true },
      { pubkey: userTokenAccounts.userDestToken, isSigner: false, isWritable: true },
      { pubkey: userPubkey, isSigner: true, isWritable: false },
    ];

    // Swap instruction data: [instruction_type, amount_in, min_amount_out]
    const data = Buffer.alloc(1 + 8 + 8);
    data.writeUInt8(isBaseToQuote ? 9 : 10, 0); // Instruction discriminator
    data.writeBigUInt64LE(params.amountIn, 1);
    data.writeBigUInt64LE(params.minAmountOut, 9);

    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data,
    });
  }

  /**
   * Execute a swap on AMM V4
   */
  async swap(
    params: RaydiumSwapParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    // Get pool info
    const poolInfo = await this.getFullPoolInfo(params.poolId);

    const userPubkey = new PublicKey(params.userPublicKey);
    const inputMint = new PublicKey(params.inputMint);
    const outputMint = new PublicKey(
      params.inputMint === poolInfo.baseMint ? poolInfo.quoteMint : poolInfo.baseMint
    );

    // Get or create user token accounts
    const userSourceToken = await getAssociatedTokenAddress(inputMint, userPubkey);
    const userDestToken = await getAssociatedTokenAddress(outputMint, userPubkey);

    const transaction = new Transaction();

    // Check if destination ATA needs to be created
    const destAtaInfo = await this.connection.getAccountInfo(userDestToken);
    if (!destAtaInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPubkey,
          userDestToken,
          userPubkey,
          outputMint
        )
      );
    }

    // Add swap instruction
    transaction.add(
      this.buildSwapInstruction(poolInfo, params, {
        userSourceToken,
        userDestToken,
      })
    );

    // Set compute budget if specified
    if (params.computeBudgetConfig) {
      const { ComputeBudgetProgram } = await import('@solana/web3.js');
      if (params.computeBudgetConfig.units) {
        transaction.add(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: params.computeBudgetConfig.units,
          })
        );
      }
      if (params.computeBudgetConfig.microLamports) {
        transaction.add(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: params.computeBudgetConfig.microLamports,
          })
        );
      }
    }

    // Set recent blockhash
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPubkey;

    // Sign
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
   * Get all AMM V4 pools for a token
   */
  async getPoolsByToken(mint: string): Promise<RaydiumPoolInfo[]> {
    // Query pools by base mint
    const basePoolAccounts = await this.connection.getProgramAccounts(this.programId, {
      filters: [
        { dataSize: 752 }, // AMM V4 account size
        {
          memcmp: {
            offset: AMM_V4_LAYOUT.BASE_MINT,
            bytes: mint,
          },
        },
      ],
    });

    // Query pools by quote mint
    const quotePoolAccounts = await this.connection.getProgramAccounts(this.programId, {
      filters: [
        { dataSize: 752 },
        {
          memcmp: {
            offset: AMM_V4_LAYOUT.QUOTE_MINT,
            bytes: mint,
          },
        },
      ],
    });

    const allPools = [...basePoolAccounts, ...quotePoolAccounts];
    const uniquePools = new Map<string, RaydiumPoolInfo>();

    for (const { pubkey, account } of allPools) {
      const poolId = pubkey.toBase58();
      if (!uniquePools.has(poolId)) {
        uniquePools.set(poolId, this.decodePoolInfo(poolId, account.data));
      }
    }

    return Array.from(uniquePools.values());
  }
}
