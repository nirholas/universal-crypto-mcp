/**
 * Connection Manager Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import { ConnectionManager, createConnectionManager } from '../connection/manager.js';

describe('ConnectionManager', () => {
  let manager: ConnectionManager;

  beforeAll(() => {
    // Use devnet for tests
    manager = createConnectionManager({
      cluster: 'devnet',
    });
  });

  afterAll(async () => {
    await manager.close();
  });

  it('should get connection', () => {
    const connection = manager.getConnection();
    expect(connection).toBeDefined();
  });

  it('should get current slot', async () => {
    const slot = await manager.getSlot();
    expect(slot).toBeGreaterThan(0);
  });

  it('should get balance for address', async () => {
    // Solana devnet faucet address (always has balance)
    const faucetAddress = new PublicKey('9B5XszUGdMaxCZ7uSQhPzdks5ZQSmWxrmzCSvtJ6Ns6g');
    const balance = await manager.getBalance(faucetAddress);
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  it('should get account info', async () => {
    // System program - always exists
    const systemProgram = new PublicKey('11111111111111111111111111111111');
    const accountInfo = await manager.getAccountInfo(systemProgram);
    expect(accountInfo).toBeDefined();
  });

  it('should get endpoint health', async () => {
    const health = await manager.getAllEndpointHealth();
    expect(health.length).toBeGreaterThan(0);
    
    const firstHealth = health[0];
    expect(firstHealth.endpoint).toBeDefined();
    expect(typeof firstHealth.healthy).toBe('boolean');
  });

  it('should get stats', () => {
    const stats = manager.getStats();
    expect(stats.pool).toBeDefined();
    expect(stats.subscriptions).toBeGreaterThanOrEqual(0);
  });
});
