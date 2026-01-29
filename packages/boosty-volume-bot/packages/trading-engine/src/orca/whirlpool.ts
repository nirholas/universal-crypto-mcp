/**
 * Orca Whirlpool Integration
 * 
 * Handles interactions with Orca Whirlpool (CLMM) pools.
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
  WhirlpoolInfo,
  WhirlpoolRewardInfo,
  OrcaSwapParams,
  OrcaPosition,
  TransactionResult,
  TradingEngineConfig,
} from '../types.js';
import { ORCA_PROGRAM_IDS } from '../types.js';

/**
 * Whirlpool account layout offsets
 */
const WHIRLPOOL_LAYOUT = {
  DISCRIMINATOR: 0,
  WHIRLPOOL_CONFIG: 8,
  WHIRLPOOL_BUMP: 40,
  TICK_SPACING: 42,
  TICK_SPACING_SEED: 44,
  FEE_RATE: 46,
  PROTOCOL_FEE_RATE: 48,
  LIQUIDITY: 50,
  SQRT_PRICE: 66,
  TICK_CURRENT_INDEX: 82,
  PROTOCOL_FEE_OWED_A: 86,
  PROTOCOL_FEE_OWED_B: 94,
  TOKEN_MINT_A: 102,
  TOKEN_VAULT_A: 134,
  FEE_GROWTH_GLOBAL_A: 166,
  TOKEN_MINT_B: 182,
  TOKEN_VAULT_B: 214,
  FEE_GROWTH_GLOBAL_B: 246,
  REWARD_LAST_UPDATED_TIMESTAMP: 262,
  REWARD_INFOS: 270,
};

const REWARD_INFO_SIZE = 128;
const NUM_REWARDS = 3;

/**
 * Position account layout
 */
const POSITION_LAYOUT = {
  DISCRIMINATOR: 0,
  WHIRLPOOL: 8,
  POSITION_MINT: 40,
  LIQUIDITY: 72,
  TICK_LOWER_INDEX: 88,
  TICK_UPPER_INDEX: 92,
  FEE_GROWTH_CHECKPOINT_A: 96,
  FEE_OWED_A: 112,
  FEE_GROWTH_CHECKPOINT_B: 120,
  FEE_OWED_B: 136,
  REWARD_INFOS: 144,
};

/**
 * Orca Whirlpool service
 */
export class OrcaWhirlpool {
  private readonly connection: Connection;
  private readonly programId: PublicKey;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.programId = new PublicKey(ORCA_PROGRAM_IDS.WHIRLPOOL);
  }

  /**
   * Get whirlpool info by address
   */
  async getWhirlpoolInfo(address: string): Promise<WhirlpoolInfo> {
    const whirlpoolPubkey = new PublicKey(address);
    const accountInfo = await this.connection.getAccountInfo(whirlpoolPubkey);

    if (!accountInfo) {
      throw new Error(`Whirlpool not found: ${address}`);
    }

    return this.decodeWhirlpoolInfo(address, accountInfo.data);
  }

  /**
   * Decode whirlpool account data
   */
  private decodeWhirlpoolInfo(address: string, data: Buffer): WhirlpoolInfo {
    const tokenMintA = new PublicKey(data.subarray(WHIRLPOOL_LAYOUT.TOKEN_MINT_A, WHIRLPOOL_LAYOUT.TOKEN_MINT_A + 32)).toBase58();
    const tokenVaultA = new PublicKey(data.subarray(WHIRLPOOL_LAYOUT.TOKEN_VAULT_A, WHIRLPOOL_LAYOUT.TOKEN_VAULT_A + 32)).toBase58();
    const tokenMintB = new PublicKey(data.subarray(WHIRLPOOL_LAYOUT.TOKEN_MINT_B, WHIRLPOOL_LAYOUT.TOKEN_MINT_B + 32)).toBase58();
    const tokenVaultB = new PublicKey(data.subarray(WHIRLPOOL_LAYOUT.TOKEN_VAULT_B, WHIRLPOOL_LAYOUT.TOKEN_VAULT_B + 32)).toBase58();

    const tickSpacing = data.readUInt16LE(WHIRLPOOL_LAYOUT.TICK_SPACING);
    const feeRate = data.readUInt16LE(WHIRLPOOL_LAYOUT.FEE_RATE);
    const protocolFeeRate = data.readUInt16LE(WHIRLPOOL_LAYOUT.PROTOCOL_FEE_RATE);
    
    // Read u128 values as two u64s
    const liquidityLow = data.readBigUInt64LE(WHIRLPOOL_LAYOUT.LIQUIDITY);
    const liquidityHigh = data.readBigUInt64LE(WHIRLPOOL_LAYOUT.LIQUIDITY + 8);
    const liquidity = liquidityLow + (liquidityHigh << 64n);

    const sqrtPriceLow = data.readBigUInt64LE(WHIRLPOOL_LAYOUT.SQRT_PRICE);
    const sqrtPriceHigh = data.readBigUInt64LE(WHIRLPOOL_LAYOUT.SQRT_PRICE + 8);
    const sqrtPrice = sqrtPriceLow + (sqrtPriceHigh << 64n);

    const tickCurrentIndex = data.readInt32LE(WHIRLPOOL_LAYOUT.TICK_CURRENT_INDEX);

    const feeGrowthGlobalALow = data.readBigUInt64LE(WHIRLPOOL_LAYOUT.FEE_GROWTH_GLOBAL_A);
    const feeGrowthGlobalAHigh = data.readBigUInt64LE(WHIRLPOOL_LAYOUT.FEE_GROWTH_GLOBAL_A + 8);
    const feeGrowthGlobalA = feeGrowthGlobalALow + (feeGrowthGlobalAHigh << 64n);

    const feeGrowthGlobalBLow = data.readBigUInt64LE(WHIRLPOOL_LAYOUT.FEE_GROWTH_GLOBAL_B);
    const feeGrowthGlobalBHigh = data.readBigUInt64LE(WHIRLPOOL_LAYOUT.FEE_GROWTH_GLOBAL_B + 8);
    const feeGrowthGlobalB = feeGrowthGlobalBLow + (feeGrowthGlobalBHigh << 64n);

    // Parse reward infos
    const rewardInfos: WhirlpoolRewardInfo[] = [];
    for (let i = 0; i < NUM_REWARDS; i++) {
      const rewardOffset = WHIRLPOOL_LAYOUT.REWARD_INFOS + (i * REWARD_INFO_SIZE);
      const mint = new PublicKey(data.subarray(rewardOffset, rewardOffset + 32)).toBase58();
      const vault = new PublicKey(data.subarray(rewardOffset + 32, rewardOffset + 64)).toBase58();
      const emissionsPerSecond = data.readBigUInt64LE(rewardOffset + 64);
      const growthGlobalLow = data.readBigUInt64LE(rewardOffset + 72);
      const growthGlobalHigh = data.readBigUInt64LE(rewardOffset + 80);
      const growthGlobal = growthGlobalLow + (growthGlobalHigh << 64n);

      // Only add if mint is not zero
      if (mint !== '11111111111111111111111111111111') {
        rewardInfos.push({
          mint,
          vault,
          emissionsPerSecond,
          growthGlobal,
        });
      }
    }

    return {
      address,
      tokenMintA,
      tokenMintB,
      tokenVaultA,
      tokenVaultB,
      feeRate,
      protocolFeeRate,
      tickCurrentIndex,
      sqrtPrice,
      liquidity,
      tickSpacing,
      feeGrowthGlobalA,
      feeGrowthGlobalB,
      rewardInfos,
    };
  }

  /**
   * Get whirlpools by token mint
   */
  async getWhirlpoolsByToken(mint: string): Promise<WhirlpoolInfo[]> {
    // Search for pools with token in position A
    const poolsWithTokenA = await this.connection.getProgramAccounts(this.programId, {
      filters: [
        { dataSize: 653 }, // Whirlpool account size
        {
          memcmp: {
            offset: WHIRLPOOL_LAYOUT.TOKEN_MINT_A,
            bytes: mint,
          },
        },
      ],
    });

    // Search for pools with token in position B
    const poolsWithTokenB = await this.connection.getProgramAccounts(this.programId, {
      filters: [
        { dataSize: 653 },
        {
          memcmp: {
            offset: WHIRLPOOL_LAYOUT.TOKEN_MINT_B,
            bytes: mint,
          },
        },
      ],
    });

    const allPools = [...poolsWithTokenA, ...poolsWithTokenB];
    const uniquePools = new Map<string, WhirlpoolInfo>();

    for (const { pubkey, account } of allPools) {
      const address = pubkey.toBase58();
      if (!uniquePools.has(address)) {
        try {
          uniquePools.set(address, this.decodeWhirlpoolInfo(address, account.data));
        } catch {
          // Skip invalid pools
        }
      }
    }

    return Array.from(uniquePools.values());
  }

  /**
   * Calculate price from sqrt price
   */
  sqrtPriceToPrice(sqrtPrice: bigint, decimalsA: number, decimalsB: number): number {
    const sqrtPriceX64 = Number(sqrtPrice) / Math.pow(2, 64);
    const price = sqrtPriceX64 * sqrtPriceX64;
    const decimalAdjustment = Math.pow(10, decimalsA - decimalsB);
    return price * decimalAdjustment;
  }

  /**
   * Calculate price from tick
   */
  tickToPrice(tick: number): number {
    return Math.pow(1.0001, tick);
  }

  /**
   * Calculate tick from price
   */
  priceToTick(price: number): number {
    return Math.floor(Math.log(price) / Math.log(1.0001));
  }

  /**
   * Calculate swap output
   */
  async calculateSwapOutput(
    whirlpoolAddress: string,
    amount: bigint,
    inputMint: string,
    isExactIn: boolean,
    slippageBps: number = 100
  ): Promise<{
    amountOut: bigint;
    minAmountOut: bigint;
    priceImpact: number;
    fee: bigint;
  }> {
    const whirlpool = await this.getWhirlpoolInfo(whirlpoolAddress);
    
    // Get reserves
    const [vaultABalance, vaultBBalance] = await Promise.all([
      this.connection.getTokenAccountBalance(new PublicKey(whirlpool.tokenVaultA)),
      this.connection.getTokenAccountBalance(new PublicKey(whirlpool.tokenVaultB)),
    ]);

    const reserveA = BigInt(vaultABalance.value.amount);
    const reserveB = BigInt(vaultBBalance.value.amount);

    const isAToB = inputMint === whirlpool.tokenMintA;
    const reserveIn = isAToB ? reserveA : reserveB;
    const reserveOut = isAToB ? reserveB : reserveA;

    // Apply fee (fee rate is in hundredths of a basis point)
    const feeMultiplier = 1_000_000n - BigInt(whirlpool.feeRate);
    const amountInWithFee = amount * feeMultiplier / 1_000_000n;
    const fee = amount - amountInWithFee;

    // Simplified constant product calculation
    // Real CLMM requires tick-by-tick simulation
    const amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
    
    // Apply slippage
    const slippageMultiplier = 10000n - BigInt(slippageBps);
    const minAmountOut = amountOut * slippageMultiplier / 10000n;

    // Calculate price impact
    const spotPrice = Number(reserveOut) / Number(reserveIn);
    const executionPrice = Number(amountOut) / Number(amount);
    const priceImpact = Math.abs((spotPrice - executionPrice) / spotPrice) * 100;

    return {
      amountOut,
      minAmountOut,
      priceImpact,
      fee,
    };
  }

  /**
   * Build swap instruction
   */
  buildSwapInstruction(
    whirlpool: WhirlpoolInfo,
    params: OrcaSwapParams,
    userAccounts: {
      userSourceToken: PublicKey;
      userDestToken: PublicKey;
    },
    tickArrays: PublicKey[]
  ): TransactionInstruction {
    const whirlpoolPubkey = new PublicKey(whirlpool.address);
    const userPubkey = new PublicKey(params.userPublicKey);
    
    const isAToB = params.inputMint === whirlpool.tokenMintA;

    const keys = [
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: userPubkey, isSigner: true, isWritable: false },
      { pubkey: whirlpoolPubkey, isSigner: false, isWritable: true },
      { pubkey: userAccounts.userSourceToken, isSigner: false, isWritable: true },
      { pubkey: new PublicKey(isAToB ? whirlpool.tokenVaultA : whirlpool.tokenVaultB), isSigner: false, isWritable: true },
      { pubkey: userAccounts.userDestToken, isSigner: false, isWritable: true },
      { pubkey: new PublicKey(isAToB ? whirlpool.tokenVaultB : whirlpool.tokenVaultA), isSigner: false, isWritable: true },
      ...tickArrays.map(pubkey => ({ pubkey, isSigner: false, isWritable: true })),
    ];

    // Swap instruction data
    // [discriminator (8)] [amount (8)] [other_amount_threshold (8)] [sqrt_price_limit (16)] [amount_specified_is_input (1)] [a_to_b (1)]
    const data = Buffer.alloc(8 + 8 + 8 + 16 + 1 + 1);
    let offset = 0;

    // Discriminator for swap instruction
    const discriminator = Buffer.from([248, 198, 158, 145, 225, 117, 135, 200]);
    discriminator.copy(data, offset);
    offset += 8;

    // Amount
    data.writeBigUInt64LE(params.amount, offset);
    offset += 8;

    // Other amount threshold (0 for no limit, would calculate from slippage)
    data.writeBigUInt64LE(0n, offset);
    offset += 8;

    // Sqrt price limit (set to min/max based on direction)
    if (isAToB) {
      // Min sqrt price for A to B
      data.writeBigUInt64LE(4295048016n, offset); // MIN_SQRT_PRICE
    } else {
      // Max sqrt price for B to A
      data.writeBigUInt64LE(79226673515401279992447579055n, offset); // MAX_SQRT_PRICE
    }
    offset += 16;

    // Amount specified is input
    data.writeUInt8(params.isExactIn ? 1 : 0, offset);
    offset += 1;

    // A to B
    data.writeUInt8(isAToB ? 1 : 0, offset);

    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data,
    });
  }

  /**
   * Execute a swap
   */
  async swap(
    params: OrcaSwapParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    const whirlpool = await this.getWhirlpoolInfo(params.whirlpoolAddress);

    const userPubkey = new PublicKey(params.userPublicKey);
    const inputMint = new PublicKey(params.inputMint);
    const isAToB = params.inputMint === whirlpool.tokenMintA;
    const outputMint = new PublicKey(isAToB ? whirlpool.tokenMintB : whirlpool.tokenMintA);

    // Get user token accounts
    const userSourceToken = await getAssociatedTokenAddress(inputMint, userPubkey);
    const userDestToken = await getAssociatedTokenAddress(outputMint, userPubkey);

    const transaction = new Transaction();

    // Create destination ATA if needed
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

    // Get tick arrays (simplified - would need proper tick array calculation)
    const tickArrays = await this.getTickArraysForSwap(whirlpool, isAToB);

    // Add swap instruction
    transaction.add(
      this.buildSwapInstruction(
        whirlpool,
        params,
        { userSourceToken, userDestToken },
        tickArrays
      )
    );

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
   * Get tick arrays needed for swap
   */
  private async getTickArraysForSwap(whirlpool: WhirlpoolInfo, isAToB: boolean): Promise<PublicKey[]> {
    // Calculate tick array start indices based on current tick
    const ticksInArray = whirlpool.tickSpacing * 88; // 88 ticks per array
    const currentArrayStart = Math.floor(whirlpool.tickCurrentIndex / ticksInArray) * ticksInArray;

    const tickArrayAddresses: PublicKey[] = [];
    
    // Get 3 tick arrays in the swap direction
    for (let i = 0; i < 3; i++) {
      const arrayIndex = isAToB 
        ? currentArrayStart - (i * ticksInArray)
        : currentArrayStart + (i * ticksInArray);

      const [tickArrayPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('tick_array'),
          new PublicKey(whirlpool.address).toBuffer(),
          Buffer.from(arrayIndex.toString()),
        ],
        this.programId
      );

      tickArrayAddresses.push(tickArrayPda);
    }

    return tickArrayAddresses;
  }

  /**
   * Get position info
   */
  async getPosition(positionAddress: string): Promise<OrcaPosition> {
    const positionPubkey = new PublicKey(positionAddress);
    const accountInfo = await this.connection.getAccountInfo(positionPubkey);

    if (!accountInfo) {
      throw new Error(`Position not found: ${positionAddress}`);
    }

    return this.decodePosition(positionAddress, accountInfo.data);
  }

  /**
   * Decode position account data
   */
  private decodePosition(address: string, data: Buffer): OrcaPosition {
    const whirlpool = new PublicKey(data.subarray(POSITION_LAYOUT.WHIRLPOOL, POSITION_LAYOUT.WHIRLPOOL + 32)).toBase58();
    const positionMint = new PublicKey(data.subarray(POSITION_LAYOUT.POSITION_MINT, POSITION_LAYOUT.POSITION_MINT + 32)).toBase58();
    
    const liquidityLow = data.readBigUInt64LE(POSITION_LAYOUT.LIQUIDITY);
    const liquidityHigh = data.readBigUInt64LE(POSITION_LAYOUT.LIQUIDITY + 8);
    const liquidity = liquidityLow + (liquidityHigh << 64n);

    const tickLowerIndex = data.readInt32LE(POSITION_LAYOUT.TICK_LOWER_INDEX);
    const tickUpperIndex = data.readInt32LE(POSITION_LAYOUT.TICK_UPPER_INDEX);

    const feeOwedA = data.readBigUInt64LE(POSITION_LAYOUT.FEE_OWED_A);
    const feeOwedB = data.readBigUInt64LE(POSITION_LAYOUT.FEE_OWED_B);

    // Parse reward infos
    const rewardInfos: { growthInsideLast: bigint; amountOwed: bigint }[] = [];
    for (let i = 0; i < NUM_REWARDS; i++) {
      const offset = POSITION_LAYOUT.REWARD_INFOS + (i * 24);
      const growthInsideLastLow = data.readBigUInt64LE(offset);
      const growthInsideLastHigh = data.readBigUInt64LE(offset + 8);
      const growthInsideLast = growthInsideLastLow + (growthInsideLastHigh << 64n);
      const amountOwed = data.readBigUInt64LE(offset + 16);
      
      rewardInfos.push({ growthInsideLast, amountOwed });
    }

    return {
      address,
      whirlpool,
      positionMint,
      tickLowerIndex,
      tickUpperIndex,
      liquidity,
      feeOwedA,
      feeOwedB,
      rewardInfos,
    };
  }

  /**
   * Get all positions for a whirlpool owned by a user
   */
  async getPositionsByOwner(owner: string): Promise<OrcaPosition[]> {
    // This requires looking up position mint NFTs owned by the user
    // and then finding their corresponding position accounts
    const ownerPubkey = new PublicKey(owner);
    
    // Find all position bundle accounts (simplified)
    const accounts = await this.connection.getProgramAccounts(this.programId, {
      filters: [
        { dataSize: 216 }, // Position account size
      ],
    });

    const positions: OrcaPosition[] = [];
    for (const { pubkey, account } of accounts) {
      try {
        const position = this.decodePosition(pubkey.toBase58(), account.data);
        
        // Check if owner has the position NFT
        const positionMintPubkey = new PublicKey(position.positionMint);
        const ata = await getAssociatedTokenAddress(positionMintPubkey, ownerPubkey);
        
        try {
          const balance = await this.connection.getTokenAccountBalance(ata);
          if (BigInt(balance.value.amount) > 0n) {
            positions.push(position);
          }
        } catch {
          // User doesn't own this position
        }
      } catch {
        // Invalid position data
      }
    }

    return positions;
  }

  /**
   * Get current price from whirlpool
   */
  async getPrice(whirlpoolAddress: string, decimalsA: number, decimalsB: number): Promise<number> {
    const whirlpool = await this.getWhirlpoolInfo(whirlpoolAddress);
    return this.sqrtPriceToPrice(whirlpool.sqrtPrice, decimalsA, decimalsB);
  }
}
