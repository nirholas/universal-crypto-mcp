/**
 * DEX Pool State Monitoring
 * Real-time pool state fetching for Raydium, Orca, and Meteora
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { logger } from '../utils/logger.js';

// Program IDs
export const DEX_PROGRAMS = {
  RAYDIUM_AMM_V4: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
  RAYDIUM_CLMM: new PublicKey('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK'),
  ORCA_WHIRLPOOL: new PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'),
  METEORA_DLMM: new PublicKey('LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo'),
  METEORA_POOLS: new PublicKey('Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB'),
} as const;

// Pool State Types
export interface BasePoolState {
  address: PublicKey;
  dex: 'raydium' | 'orca' | 'meteora';
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  tokenVaultA: PublicKey;
  tokenVaultB: PublicKey;
  reserveA: bigint;
  reserveB: bigint;
  fee: number;
  lastUpdated: Date;
}

export interface RaydiumAmmPool extends BasePoolState {
  dex: 'raydium';
  ammId: PublicKey;
  lpMint: PublicKey;
  openOrders: PublicKey;
  targetOrders: PublicKey;
  baseDecimal: number;
  quoteDecimal: number;
  status: number;
  lpAmount: bigint;
}

export interface OrcaWhirlpool extends BasePoolState {
  dex: 'orca';
  tickSpacing: number;
  tickCurrentIndex: number;
  sqrtPrice: bigint;
  liquidity: bigint;
  feeRate: number;
  protocolFeeRate: number;
}

export interface MeteoraPool extends BasePoolState {
  dex: 'meteora';
  binStep: number;
  activeId: number;
  protocolFee: number;
  baseFee: number;
}

export type PoolState = RaydiumAmmPool | OrcaWhirlpool | MeteoraPool;

// Layout offsets for Raydium AMM V4
const RAYDIUM_OFFSETS = {
  status: 0,
  baseDecimal: 11,
  quoteDecimal: 12,
  tradeFeeNumerator: 95,
  tradeFeeDenominator: 103,
  baseVault: 287,
  quoteVault: 319,
  baseMint: 351,
  quoteMint: 383,
  lpMint: 415,
  openOrders: 447,
  targetOrders: 543,
  lpReserve: 671,
};

// Layout offsets for Orca Whirlpool
const WHIRLPOOL_OFFSETS = {
  tickSpacing: 42,
  feeRate: 46,
  protocolFeeRate: 48,
  liquidity: 50,
  sqrtPrice: 66,
  tickCurrentIndex: 82,
  tokenMintA: 102,
  tokenVaultA: 134,
  tokenMintB: 182,
  tokenVaultB: 214,
};

// Layout offsets for Meteora DLMM
const METEORA_OFFSETS = {
  vaultX: 72,
  vaultY: 104,
  mintX: 136,
  mintY: 168,
  binStep: 200,
  activeId: 202,
  protocolFee: 206,
  baseFee: 214,
};

export function decodeRaydiumAmmPool(address: PublicKey, data: Buffer): RaydiumAmmPool | null {
  try {
    if (data.length < 700) return null;

    const status = data.readUInt8(RAYDIUM_OFFSETS.status);
    const baseDecimal = data.readUInt8(RAYDIUM_OFFSETS.baseDecimal);
    const quoteDecimal = data.readUInt8(RAYDIUM_OFFSETS.quoteDecimal);
    const tradeFeeNum = data.readBigUInt64LE(RAYDIUM_OFFSETS.tradeFeeNumerator);
    const tradeFeeDen = data.readBigUInt64LE(RAYDIUM_OFFSETS.tradeFeeDenominator);

    const baseVault = new PublicKey(data.slice(RAYDIUM_OFFSETS.baseVault, RAYDIUM_OFFSETS.baseVault + 32));
    const quoteVault = new PublicKey(data.slice(RAYDIUM_OFFSETS.quoteVault, RAYDIUM_OFFSETS.quoteVault + 32));
    const baseMint = new PublicKey(data.slice(RAYDIUM_OFFSETS.baseMint, RAYDIUM_OFFSETS.baseMint + 32));
    const quoteMint = new PublicKey(data.slice(RAYDIUM_OFFSETS.quoteMint, RAYDIUM_OFFSETS.quoteMint + 32));
    const lpMint = new PublicKey(data.slice(RAYDIUM_OFFSETS.lpMint, RAYDIUM_OFFSETS.lpMint + 32));
    const openOrders = new PublicKey(data.slice(RAYDIUM_OFFSETS.openOrders, RAYDIUM_OFFSETS.openOrders + 32));
    const targetOrders = new PublicKey(data.slice(RAYDIUM_OFFSETS.targetOrders, RAYDIUM_OFFSETS.targetOrders + 32));
    const lpReserve = data.readBigUInt64LE(RAYDIUM_OFFSETS.lpReserve);

    const fee = tradeFeeDen > 0n ? Number((tradeFeeNum * 10000n) / tradeFeeDen) : 25;

    return {
      address,
      dex: 'raydium',
      ammId: address,
      tokenMintA: baseMint,
      tokenMintB: quoteMint,
      tokenVaultA: baseVault,
      tokenVaultB: quoteVault,
      reserveA: 0n,
      reserveB: 0n,
      lpMint,
      openOrders,
      targetOrders,
      baseDecimal,
      quoteDecimal,
      status,
      lpAmount: lpReserve,
      fee,
      lastUpdated: new Date(),
    };
  } catch (error) {
    logger.error('Failed to decode Raydium pool', { error: String(error) });
    return null;
  }
}

export function decodeOrcaWhirlpool(address: PublicKey, data: Buffer): OrcaWhirlpool | null {
  try {
    if (data.length < 300) return null;

    const tickSpacing = data.readUInt16LE(WHIRLPOOL_OFFSETS.tickSpacing);
    const feeRate = data.readUInt16LE(WHIRLPOOL_OFFSETS.feeRate);
    const protocolFeeRate = data.readUInt16LE(WHIRLPOOL_OFFSETS.protocolFeeRate);
    const liquidity = data.readBigUInt64LE(WHIRLPOOL_OFFSETS.liquidity);
    const sqrtPrice = data.readBigUInt64LE(WHIRLPOOL_OFFSETS.sqrtPrice);
    const tickCurrentIndex = data.readInt32LE(WHIRLPOOL_OFFSETS.tickCurrentIndex);

    const tokenMintA = new PublicKey(data.slice(WHIRLPOOL_OFFSETS.tokenMintA, WHIRLPOOL_OFFSETS.tokenMintA + 32));
    const tokenVaultA = new PublicKey(data.slice(WHIRLPOOL_OFFSETS.tokenVaultA, WHIRLPOOL_OFFSETS.tokenVaultA + 32));
    const tokenMintB = new PublicKey(data.slice(WHIRLPOOL_OFFSETS.tokenMintB, WHIRLPOOL_OFFSETS.tokenMintB + 32));
    const tokenVaultB = new PublicKey(data.slice(WHIRLPOOL_OFFSETS.tokenVaultB, WHIRLPOOL_OFFSETS.tokenVaultB + 32));

    return {
      address,
      dex: 'orca',
      tokenMintA,
      tokenMintB,
      tokenVaultA,
      tokenVaultB,
      reserveA: 0n,
      reserveB: 0n,
      tickSpacing,
      tickCurrentIndex,
      sqrtPrice,
      liquidity,
      feeRate,
      protocolFeeRate,
      fee: feeRate,
      lastUpdated: new Date(),
    };
  } catch (error) {
    logger.error('Failed to decode Orca Whirlpool', { error: String(error) });
    return null;
  }
}

export function decodeMeteoraPool(address: PublicKey, data: Buffer): MeteoraPool | null {
  try {
    if (data.length < 250) return null;

    const binStep = data.readUInt16LE(METEORA_OFFSETS.binStep);
    const activeId = data.readInt32LE(METEORA_OFFSETS.activeId);
    const protocolFee = data.readBigUInt64LE(METEORA_OFFSETS.protocolFee);
    const baseFee = data.readBigUInt64LE(METEORA_OFFSETS.baseFee);

    const vaultX = new PublicKey(data.slice(METEORA_OFFSETS.vaultX, METEORA_OFFSETS.vaultX + 32));
    const vaultY = new PublicKey(data.slice(METEORA_OFFSETS.vaultY, METEORA_OFFSETS.vaultY + 32));
    const mintX = new PublicKey(data.slice(METEORA_OFFSETS.mintX, METEORA_OFFSETS.mintX + 32));
    const mintY = new PublicKey(data.slice(METEORA_OFFSETS.mintY, METEORA_OFFSETS.mintY + 32));

    return {
      address,
      dex: 'meteora',
      tokenMintA: mintX,
      tokenMintB: mintY,
      tokenVaultA: vaultX,
      tokenVaultB: vaultY,
      reserveA: 0n,
      reserveB: 0n,
      binStep,
      activeId,
      protocolFee: Number(protocolFee),
      baseFee: Number(baseFee),
      fee: Number(baseFee) / 100,
      lastUpdated: new Date(),
    };
  } catch (error) {
    logger.error('Failed to decode Meteora pool', { error: String(error) });
    return null;
  }
}

export class PoolMonitor {
  private readonly connection: Connection;
  private readonly subscriptions: Map<string, number> = new Map();
  private readonly poolCache: Map<string, PoolState> = new Map();

  constructor(connection: Connection) {
    this.connection = connection;
    logger.info('Pool monitor initialized');
  }

  async getRaydiumPool(poolAddress: PublicKey): Promise<RaydiumAmmPool | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(poolAddress);
      if (!accountInfo?.data) return null;

      const pool = decodeRaydiumAmmPool(poolAddress, accountInfo.data);
      if (!pool) return null;

      const [vaultA, vaultB] = await Promise.all([
        this.connection.getTokenAccountBalance(pool.tokenVaultA),
        this.connection.getTokenAccountBalance(pool.tokenVaultB),
      ]);

      pool.reserveA = BigInt(vaultA.value.amount);
      pool.reserveB = BigInt(vaultB.value.amount);
      this.poolCache.set(poolAddress.toBase58(), pool);
      return pool;
    } catch (error) {
      logger.error('Failed to fetch Raydium pool', { pool: poolAddress.toBase58(), error: String(error) });
      return null;
    }
  }

  async getOrcaWhirlpool(poolAddress: PublicKey): Promise<OrcaWhirlpool | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(poolAddress);
      if (!accountInfo?.data) return null;

      const pool = decodeOrcaWhirlpool(poolAddress, accountInfo.data);
      if (!pool) return null;

      const [vaultA, vaultB] = await Promise.all([
        this.connection.getTokenAccountBalance(pool.tokenVaultA),
        this.connection.getTokenAccountBalance(pool.tokenVaultB),
      ]);

      pool.reserveA = BigInt(vaultA.value.amount);
      pool.reserveB = BigInt(vaultB.value.amount);
      this.poolCache.set(poolAddress.toBase58(), pool);
      return pool;
    } catch (error) {
      logger.error('Failed to fetch Orca Whirlpool', { pool: poolAddress.toBase58(), error: String(error) });
      return null;
    }
  }

  async getMeteoraPool(poolAddress: PublicKey): Promise<MeteoraPool | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(poolAddress);
      if (!accountInfo?.data) return null;

      const pool = decodeMeteoraPool(poolAddress, accountInfo.data);
      if (!pool) return null;

      const [vaultA, vaultB] = await Promise.all([
        this.connection.getTokenAccountBalance(pool.tokenVaultA),
        this.connection.getTokenAccountBalance(pool.tokenVaultB),
      ]);

      pool.reserveA = BigInt(vaultA.value.amount);
      pool.reserveB = BigInt(vaultB.value.amount);
      this.poolCache.set(poolAddress.toBase58(), pool);
      return pool;
    } catch (error) {
      logger.error('Failed to fetch Meteora pool', { pool: poolAddress.toBase58(), error: String(error) });
      return null;
    }
  }

  async getPool(poolAddress: PublicKey): Promise<PoolState | null> {
    const accountInfo = await this.connection.getAccountInfo(poolAddress);
    if (!accountInfo?.data) return null;

    const owner = accountInfo.owner;

    if (owner.equals(DEX_PROGRAMS.RAYDIUM_AMM_V4)) {
      return this.getRaydiumPool(poolAddress);
    } else if (owner.equals(DEX_PROGRAMS.ORCA_WHIRLPOOL)) {
      return this.getOrcaWhirlpool(poolAddress);
    } else if (owner.equals(DEX_PROGRAMS.METEORA_DLMM)) {
      return this.getMeteoraPool(poolAddress);
    }

    // Try each decoder
    let pool: PoolState | null = decodeRaydiumAmmPool(poolAddress, accountInfo.data);
    if (pool) return this.getRaydiumPool(poolAddress);

    pool = decodeOrcaWhirlpool(poolAddress, accountInfo.data);
    if (pool) return this.getOrcaWhirlpool(poolAddress);

    pool = decodeMeteoraPool(poolAddress, accountInfo.data);
    if (pool) return this.getMeteoraPool(poolAddress);

    return null;
  }

  subscribeToPool(poolAddress: PublicKey, callback: (pool: PoolState) => void): number {
    const subId = this.connection.onAccountChange(
      poolAddress,
      async () => {
        const pool = await this.getPool(poolAddress);
        if (pool) callback(pool);
      },
      'confirmed'
    );
    this.subscriptions.set(poolAddress.toBase58(), subId);
    return subId;
  }

  async unsubscribe(poolAddress: PublicKey): Promise<void> {
    const subId = this.subscriptions.get(poolAddress.toBase58());
    if (subId !== undefined) {
      await this.connection.removeAccountChangeListener(subId);
      this.subscriptions.delete(poolAddress.toBase58());
    }
  }

  async unsubscribeAll(): Promise<void> {
    for (const [, subId] of this.subscriptions) {
      await this.connection.removeAccountChangeListener(subId);
    }
    this.subscriptions.clear();
  }

  getCachedPool(poolAddress: PublicKey): PoolState | undefined {
    return this.poolCache.get(poolAddress.toBase58());
  }

  calculatePrice(pool: PoolState, decimalsA: number, decimalsB: number): number {
    if (pool.reserveA === 0n || pool.reserveB === 0n) return 0;
    const reserveA = Number(pool.reserveA) / Math.pow(10, decimalsA);
    const reserveB = Number(pool.reserveB) / Math.pow(10, decimalsB);
    return reserveB / reserveA;
  }

  calculateTvl(pool: PoolState, decimalsA: number, decimalsB: number, priceA: number, priceB: number): number {
    const valueA = (Number(pool.reserveA) / Math.pow(10, decimalsA)) * priceA;
    const valueB = (Number(pool.reserveB) / Math.pow(10, decimalsB)) * priceB;
    return valueA + valueB;
  }
}

export function createPoolMonitor(connection: Connection): PoolMonitor {
  return new PoolMonitor(connection);
}
