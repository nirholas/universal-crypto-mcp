/**
 * Trading Tools
 * MCP tools for executing swaps and trading operations
 */

import type { ToolDefinition } from '../types.js';

// ===========================================
// TOOL DEFINITIONS
// ===========================================

export const executeSwapDefinition: ToolDefinition = {
  name: 'execute_swap',
  description: 'Execute a token swap via Jupiter aggregator',
  inputSchema: {
    type: 'object',
    properties: {
      walletId: { type: 'string', description: 'Wallet ID to use for the swap' },
      inputToken: { type: 'string', description: 'Input token mint address or "SOL"' },
      outputToken: { type: 'string', description: 'Output token mint address or "SOL"' },
      amount: { type: 'string', description: 'Amount to swap in input token units' },
      slippageBps: { type: 'number', description: 'Slippage tolerance in basis points (default: 50)' },
      useMevProtection: { type: 'boolean', description: 'Use MEV protection (default: true)' },
    },
    required: ['walletId', 'inputToken', 'outputToken', 'amount'],
  },
};

export const getSwapQuoteDefinition: ToolDefinition = {
  name: 'get_swap_quote',
  description: 'Get a swap quote without executing',
  inputSchema: {
    type: 'object',
    properties: {
      inputToken: { type: 'string', description: 'Input token mint address or "SOL"' },
      outputToken: { type: 'string', description: 'Output token mint address or "SOL"' },
      amount: { type: 'string', description: 'Amount to swap in input token units' },
      slippageBps: { type: 'number', description: 'Slippage tolerance in basis points' },
    },
    required: ['inputToken', 'outputToken', 'amount'],
  },
};

export const executeBatchSwapsDefinition: ToolDefinition = {
  name: 'execute_batch_swaps',
  description: 'Execute multiple swaps in sequence or parallel',
  inputSchema: {
    type: 'object',
    properties: {
      swaps: {
        type: 'array',
        description: 'Array of swap operations',
        items: {
          type: 'object',
          description: 'Swap operation configuration',
          properties: {
            walletId: { type: 'string', description: 'Wallet ID' },
            inputToken: { type: 'string', description: 'Input token' },
            outputToken: { type: 'string', description: 'Output token' },
            amount: { type: 'string', description: 'Amount' },
            slippageBps: { type: 'number', description: 'Slippage' },
          },
          required: ['walletId', 'inputToken', 'outputToken', 'amount'],
        },
      },
      parallel: { type: 'boolean', description: 'Execute in parallel (default: false)' },
    },
    required: ['swaps'],
  },
};

export const buyTokenDefinition: ToolDefinition = {
  name: 'buy_token',
  description: 'Buy a token using SOL',
  inputSchema: {
    type: 'object',
    properties: {
      walletId: { type: 'string', description: 'Wallet ID' },
      tokenMint: { type: 'string', description: 'Token mint address to buy' },
      solAmount: { type: 'string', description: 'Amount of SOL to spend' },
      slippageBps: { type: 'number', description: 'Slippage tolerance in basis points' },
    },
    required: ['walletId', 'tokenMint', 'solAmount'],
  },
};

export const sellTokenDefinition: ToolDefinition = {
  name: 'sell_token',
  description: 'Sell a token for SOL',
  inputSchema: {
    type: 'object',
    properties: {
      walletId: { type: 'string', description: 'Wallet ID' },
      tokenMint: { type: 'string', description: 'Token mint address to sell' },
      tokenAmount: { type: 'string', description: 'Amount of tokens to sell (or "all")' },
      slippageBps: { type: 'number', description: 'Slippage tolerance in basis points' },
    },
    required: ['walletId', 'tokenMint', 'tokenAmount'],
  },
};

// All trading tool definitions
export const tradingToolDefinitions = [
  executeSwapDefinition,
  getSwapQuoteDefinition,
  executeBatchSwapsDefinition,
  buyTokenDefinition,
  sellTokenDefinition,
];
