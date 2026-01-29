/**
 * Test suite for MCP Server exports and basic functionality
 * 
 * Note: Integration tests with the actual MCP SDK would require
 * setting up proper transport mocking, which is beyond unit test scope.
 * These tests verify the module exports and basic instantiation patterns.
 */

import { describe, it, expect, vi } from 'vitest';

// Test that the module exports what we expect
describe('Server Module Exports', () => {
  it('should export PricesServer class', async () => {
    const module = await import('../server.js');
    expect(module.PricesServer).toBeDefined();
    expect(typeof module.PricesServer).toBe('function');
  });

  it('should export createPricesServer factory', async () => {
    const module = await import('../server.js');
    expect(module.createPricesServer).toBeDefined();
    expect(typeof module.createPricesServer).toBe('function');
  });
});

// Test tool definitions
describe('Tool Definitions', () => {
  it('should have valid getTokenPrice tool definition', async () => {
    const { getTokenPriceDefinition } = await import('../tools/getTokenPrice.js');
    
    expect(getTokenPriceDefinition).toBeDefined();
    expect(getTokenPriceDefinition.name).toBe('getTokenPrice');
    expect(getTokenPriceDefinition.description).toBeTruthy();
    expect(getTokenPriceDefinition.inputSchema).toBeDefined();
    expect(getTokenPriceDefinition.inputSchema.type).toBe('object');
    expect(getTokenPriceDefinition.inputSchema.properties.symbol).toBeDefined();
  });

  it('should have valid getGasPrices tool definition', async () => {
    const { getGasPricesDefinition } = await import('../tools/getGasPrices.js');
    
    expect(getGasPricesDefinition).toBeDefined();
    expect(getGasPricesDefinition.name).toBe('getGasPrices');
    expect(getGasPricesDefinition.description).toBeTruthy();
    expect(getGasPricesDefinition.inputSchema).toBeDefined();
    expect(getGasPricesDefinition.inputSchema.type).toBe('object');
  });

  it('should have valid comparePrices tool definition', async () => {
    const { comparePricesDefinition } = await import('../tools/comparePrices.js');
    
    expect(comparePricesDefinition).toBeDefined();
    expect(comparePricesDefinition.name).toBe('comparePrices');
    expect(comparePricesDefinition.description).toBeTruthy();
    expect(comparePricesDefinition.inputSchema).toBeDefined();
    expect(comparePricesDefinition.inputSchema.properties.symbols).toBeDefined();
  });

  it('should have valid getTokenPriceHistory tool definition', async () => {
    const { getTokenPriceHistoryDefinition } = await import('../tools/getTokenPriceHistory.js');
    
    expect(getTokenPriceHistoryDefinition).toBeDefined();
    expect(getTokenPriceHistoryDefinition.name).toBe('getTokenPriceHistory');
    expect(getTokenPriceHistoryDefinition.inputSchema.properties.symbol).toBeDefined();
    expect(getTokenPriceHistoryDefinition.inputSchema.properties.days).toBeDefined();
  });

  it('should have valid getTopMovers tool definition', async () => {
    const { getTopMoversDefinition } = await import('../tools/getTopMovers.js');
    
    expect(getTopMoversDefinition).toBeDefined();
    expect(getTopMoversDefinition.name).toBe('getTopMovers');
    expect(getTopMoversDefinition.inputSchema.properties.timeframe).toBeDefined();
    expect(getTopMoversDefinition.inputSchema.properties.limit).toBeDefined();
    expect(getTopMoversDefinition.inputSchema.properties.direction).toBeDefined();
  });

  it('should have valid getFearGreedIndex tool definition', async () => {
    const { getFearGreedIndexDefinition } = await import('../tools/getFearGreedIndex.js');
    
    expect(getFearGreedIndexDefinition).toBeDefined();
    expect(getFearGreedIndexDefinition.name).toBe('getFearGreedIndex');
    expect(getFearGreedIndexDefinition.inputSchema).toBeDefined();
  });
});

// Test API clients are exported correctly
describe('API Client Exports', () => {
  it('should export coingeckoClient', async () => {
    const { coingeckoClient } = await import('../apis/coingecko.js');
    expect(coingeckoClient).toBeDefined();
    expect(typeof coingeckoClient.getPrice).toBe('function');
    expect(typeof coingeckoClient.getPrices).toBe('function');
    expect(typeof coingeckoClient.getHistory).toBe('function');
  });

  it('should export gasFetcher', async () => {
    const { gasFetcher } = await import('../apis/gas.js');
    expect(gasFetcher).toBeDefined();
    expect(typeof gasFetcher.getGasPrice).toBe('function');
    expect(typeof gasFetcher.getAllGasPrices).toBe('function');
    expect(typeof gasFetcher.getSupportedChains).toBe('function');
  });

  it('should have proper gas chain support', async () => {
    const { gasFetcher } = await import('../apis/gas.js');
    const chains = gasFetcher.getSupportedChains();
    
    expect(Array.isArray(chains)).toBe(true);
    expect(chains.length).toBeGreaterThan(0);
    expect(chains).toContain('ethereum');
    expect(chains).toContain('arbitrum');
  });
});
