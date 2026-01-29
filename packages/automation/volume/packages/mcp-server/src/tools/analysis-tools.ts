/**
 * Market Analysis Tools
 * MCP tools for token and market analysis
 */

import type { ToolDefinition } from '../types.js';

// ===========================================
// TOOL DEFINITIONS
// ===========================================

export const getTokenInfoDefinition: ToolDefinition = {
  name: 'get_token_info',
  description: 'Get detailed information about a token',
  inputSchema: {
    type: 'object',
    properties: {
      mint: { type: 'string', description: 'Token mint address' },
    },
    required: ['mint'],
  },
};

export const getPoolInfoDefinition: ToolDefinition = {
  name: 'get_pool_info',
  description: 'Get liquidity pool information for a token',
  inputSchema: {
    type: 'object',
    properties: {
      tokenMint: { type: 'string', description: 'Token mint address' },
      dex: { type: 'string', description: 'Filter by DEX (raydium, orca, meteora)' },
    },
    required: ['tokenMint'],
  },
};

export const getPriceHistoryDefinition: ToolDefinition = {
  name: 'get_price_history',
  description: 'Get historical price data for a token',
  inputSchema: {
    type: 'object',
    properties: {
      tokenMint: { type: 'string', description: 'Token mint address' },
      period: { type: 'string', enum: ['1h', '24h', '7d', '30d'], description: 'Time period' },
      interval: { type: 'string', enum: ['1m', '5m', '15m', '1h', '4h', '1d'], description: 'Data interval' },
    },
    required: ['tokenMint'],
  },
};

export const analyzeLiquidityDefinition: ToolDefinition = {
  name: 'analyze_liquidity',
  description: 'Analyze liquidity depth and slippage for a token',
  inputSchema: {
    type: 'object',
    properties: {
      tokenMint: { type: 'string', description: 'Token mint address' },
      tradeSize: { type: 'string', description: 'Analyze slippage for this trade size in SOL' },
    },
    required: ['tokenMint'],
  },
};

export const getTopHoldersDefinition: ToolDefinition = {
  name: 'get_top_holders',
  description: 'Get top token holders',
  inputSchema: {
    type: 'object',
    properties: {
      tokenMint: { type: 'string', description: 'Token mint address' },
      limit: { type: 'number', description: 'Number of holders to return (default: 20)' },
    },
    required: ['tokenMint'],
  },
};

export const getMarketOverviewDefinition: ToolDefinition = {
  name: 'get_market_overview',
  description: 'Get overall market overview and trending tokens',
  inputSchema: {
    type: 'object',
    properties: {
      category: { type: 'string', enum: ['trending', 'new', 'gainers', 'losers'], description: 'Category filter' },
      limit: { type: 'number', description: 'Number of tokens to return' },
    },
    required: [],
  },
};

// All analysis tool definitions
export const analysisToolDefinitions = [
  getTokenInfoDefinition,
  getPoolInfoDefinition,
  getPriceHistoryDefinition,
  analyzeLiquidityDefinition,
  getTopHoldersDefinition,
  getMarketOverviewDefinition,
];
