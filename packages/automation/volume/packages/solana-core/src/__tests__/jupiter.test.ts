/**
 * Jupiter Client Tests
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { JupiterClient, createJupiterClient, TOKEN_MINTS } from '../dex/jupiter.js';

describe('JupiterClient', () => {
  let client: JupiterClient;

  beforeAll(() => {
    client = createJupiterClient();
  });

  it('should create client', () => {
    expect(client).toBeDefined();
  });

  it('should have TOKEN_MINTS defined', () => {
    expect(TOKEN_MINTS.SOL).toBe('So11111111111111111111111111111111111111112');
    expect(TOKEN_MINTS.USDC).toBe('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    expect(TOKEN_MINTS.BONK).toBeDefined();
    expect(TOKEN_MINTS.JUP).toBeDefined();
  });

  it('should get quote for SOL to USDC swap', async () => {
    const quote = await client.getQuote({
      inputMint: TOKEN_MINTS.SOL,
      outputMint: TOKEN_MINTS.USDC,
      amount: '1000000000', // 1 SOL in lamports
      slippageBps: 50,
    });

    expect(quote).toBeDefined();
    expect(quote.inputMint).toBe(TOKEN_MINTS.SOL);
    expect(quote.outputMint).toBe(TOKEN_MINTS.USDC);
    expect(BigInt(quote.outputAmount)).toBeGreaterThan(0n);
    expect(quote.routePlan).toBeDefined();
    expect(quote.routePlan.length).toBeGreaterThan(0);
  });

  it('should get simple quote', async () => {
    const quote = await client.getSimpleQuote({
      inputToken: 'SOL',
      outputToken: 'USDC',
      amount: 1,
      slippageBps: 50,
    });

    expect(quote).toBeDefined();
    expect(quote.inputAmount).toBe(1);
    expect(quote.outputAmount).toBeGreaterThan(0);
    expect(quote.route).toBeDefined();
  });

  it('should get token price', async () => {
    const price = await client.getPrice(TOKEN_MINTS.SOL, TOKEN_MINTS.USDC);

    expect(price).toBeDefined();
    if (price) {
      expect(price.price).toBeGreaterThan(0);
    }
  });

  it('should get multiple token prices', async () => {
    const prices = await client.getPrices([
      TOKEN_MINTS.SOL,
      TOKEN_MINTS.BONK,
    ]);

    expect(prices).toBeDefined();
    expect(prices.size).toBeGreaterThan(0);
  });

  it('should clear cache', () => {
    client.clearCache();
    // No error means success
    expect(true).toBe(true);
  });
});
