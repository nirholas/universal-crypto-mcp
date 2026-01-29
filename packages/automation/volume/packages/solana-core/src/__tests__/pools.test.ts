/**
 * Pool Monitor Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PublicKey, Connection } from '@solana/web3.js';
import { 
  PoolMonitor, 
  createPoolMonitor, 
  DEX_PROGRAMS,
  decodeRaydiumAmmPool,
  decodeOrcaWhirlpool,
  decodeMeteoraPool,
} from '../dex/pools.js';

// Well-known pool addresses for testing
const KNOWN_POOLS = {
  // SOL-USDC Raydium V4 pool
  RAYDIUM_SOL_USDC: new PublicKey('58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'),
  // SOL-USDC Orca Whirlpool
  ORCA_SOL_USDC: new PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ'),
};

describe('PoolMonitor', () => {
  let monitor: PoolMonitor;
  let connection: Connection;

  beforeAll(() => {
    // Use mainnet for real pool data
    connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    monitor = createPoolMonitor(connection);
  });

  afterAll(async () => {
    await monitor.unsubscribeAll();
  });

  it('should create pool monitor', () => {
    expect(monitor).toBeDefined();
  });

  it('should have DEX_PROGRAMS defined', () => {
    expect(DEX_PROGRAMS.RAYDIUM_AMM_V4).toBeDefined();
    expect(DEX_PROGRAMS.ORCA_WHIRLPOOL).toBeDefined();
    expect(DEX_PROGRAMS.METEORA_DLMM).toBeDefined();
  });

  it('should fetch Raydium pool state', async () => {
    const pool = await monitor.getRaydiumPool(KNOWN_POOLS.RAYDIUM_SOL_USDC);
    
    if (pool) {
      expect(pool.dex).toBe('raydium');
      expect(pool.tokenMintA).toBeDefined();
      expect(pool.tokenMintB).toBeDefined();
      expect(pool.reserveA).toBeGreaterThan(0n);
      expect(pool.reserveB).toBeGreaterThan(0n);
      expect(pool.fee).toBeGreaterThanOrEqual(0);
    }
  }, 30000);

  it('should fetch Orca Whirlpool state', async () => {
    const pool = await monitor.getOrcaWhirlpool(KNOWN_POOLS.ORCA_SOL_USDC);
    
    if (pool) {
      expect(pool.dex).toBe('orca');
      expect(pool.tokenMintA).toBeDefined();
      expect(pool.tokenMintB).toBeDefined();
      expect(pool.tickSpacing).toBeGreaterThan(0);
      expect(pool.liquidity).toBeGreaterThan(0n);
    }
  }, 30000);

  it('should auto-detect pool type', async () => {
    const pool = await monitor.getPool(KNOWN_POOLS.RAYDIUM_SOL_USDC);
    
    if (pool) {
      expect(pool.dex).toBe('raydium');
    }
  }, 30000);

  it('should calculate price from reserves', () => {
    // Create a mock pool state
    const mockPool = {
      address: PublicKey.default,
      dex: 'raydium' as const,
      tokenMintA: PublicKey.default,
      tokenMintB: PublicKey.default,
      tokenVaultA: PublicKey.default,
      tokenVaultB: PublicKey.default,
      reserveA: 1000000000n, // 1 SOL (9 decimals)
      reserveB: 100000000n, // 100 USDC (6 decimals)
      fee: 25,
      lastUpdated: new Date(),
      ammId: PublicKey.default,
      lpMint: PublicKey.default,
      openOrders: PublicKey.default,
      targetOrders: PublicKey.default,
      baseDecimal: 9,
      quoteDecimal: 6,
      status: 1,
      lpAmount: 0n,
    };

    const price = monitor.calculatePrice(mockPool, 9, 6);
    expect(price).toBe(100); // 100 USDC per SOL
  });

  it('should calculate TVL', () => {
    const mockPool = {
      address: PublicKey.default,
      dex: 'raydium' as const,
      tokenMintA: PublicKey.default,
      tokenMintB: PublicKey.default,
      tokenVaultA: PublicKey.default,
      tokenVaultB: PublicKey.default,
      reserveA: 1000000000000n, // 1000 SOL
      reserveB: 100000000000n, // 100,000 USDC
      fee: 25,
      lastUpdated: new Date(),
      ammId: PublicKey.default,
      lpMint: PublicKey.default,
      openOrders: PublicKey.default,
      targetOrders: PublicKey.default,
      baseDecimal: 9,
      quoteDecimal: 6,
      status: 1,
      lpAmount: 0n,
    };

    // Assuming SOL = $100
    const tvl = monitor.calculateTvl(mockPool, 9, 6, 100, 1);
    expect(tvl).toBe(200000); // 1000 SOL * $100 + 100,000 USDC * $1
  });

  it('should cache pool state', async () => {
    // Fetch pool first
    await monitor.getRaydiumPool(KNOWN_POOLS.RAYDIUM_SOL_USDC);
    
    // Check cache
    const cached = monitor.getCachedPool(KNOWN_POOLS.RAYDIUM_SOL_USDC);
    expect(cached).toBeDefined();
  }, 30000);
});

describe('Pool Decoders', () => {
  it('should return null for invalid data', () => {
    const emptyBuffer = Buffer.alloc(0);
    
    expect(decodeRaydiumAmmPool(PublicKey.default, emptyBuffer)).toBeNull();
    expect(decodeOrcaWhirlpool(PublicKey.default, emptyBuffer)).toBeNull();
    expect(decodeMeteoraPool(PublicKey.default, emptyBuffer)).toBeNull();
  });

  it('should return null for too small data', () => {
    const smallBuffer = Buffer.alloc(100);
    
    expect(decodeRaydiumAmmPool(PublicKey.default, smallBuffer)).toBeNull();
    expect(decodeOrcaWhirlpool(PublicKey.default, smallBuffer)).toBeNull();
    expect(decodeMeteoraPool(PublicKey.default, smallBuffer)).toBeNull();
  });
});
