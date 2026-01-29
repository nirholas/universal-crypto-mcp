/**
 * Wallet Management Tools
 * MCP tools for creating, managing, and operating wallets
 */

import type { ToolDefinition } from '../types.js';

// ===========================================
// TOOL DEFINITIONS
// ===========================================

export const createWalletSwarmDefinition: ToolDefinition = {
  name: 'create_wallet_swarm',
  description: 'Create multiple wallets for trading operations. Wallets are encrypted and stored securely.',
  inputSchema: {
    type: 'object',
    properties: {
      count: { type: 'number', description: 'Number of wallets to create (1-1000)' },
      tag: { type: 'string', description: 'Tag to identify this wallet group' },
      fundEach: { type: 'number', description: 'SOL amount to fund each wallet from master wallet' },
    },
    required: ['count'],
  },
};

export const getWalletBalancesDefinition: ToolDefinition = {
  name: 'get_wallet_balances',
  description: 'Get balances for one or more wallets including SOL and token holdings',
  inputSchema: {
    type: 'object',
    properties: {
      walletIds: { type: 'array', description: 'Specific wallet IDs to query', items: { type: 'string', description: 'Wallet ID' } },
      tag: { type: 'string', description: 'Filter wallets by tag' },
      includeTokens: { type: 'boolean', description: 'Include token balances (default: true)' },
    },
    required: [],
  },
};

export const distributeFundsDefinition: ToolDefinition = {
  name: 'distribute_funds',
  description: 'Distribute SOL from a source wallet to multiple target wallets',
  inputSchema: {
    type: 'object',
    properties: {
      sourceWalletId: { type: 'string', description: 'Source wallet ID' },
      targetWalletIds: { type: 'array', description: 'Target wallet IDs', items: { type: 'string', description: 'Target wallet ID' } },
      targetTag: { type: 'string', description: 'Distribute to all wallets with this tag' },
      amountEach: { type: 'string', description: 'SOL amount to send to each wallet' },
    },
    required: ['sourceWalletId', 'amountEach'],
  },
};

export const consolidateFundsDefinition: ToolDefinition = {
  name: 'consolidate_funds',
  description: 'Consolidate SOL from multiple wallets into a single target wallet',
  inputSchema: {
    type: 'object',
    properties: {
      sourceWalletIds: { type: 'array', description: 'Source wallet IDs', items: { type: 'string', description: 'Source wallet ID' } },
      sourceTag: { type: 'string', description: 'Consolidate from all wallets with this tag' },
      targetWalletId: { type: 'string', description: 'Target wallet to receive funds' },
      leaveMinimum: { type: 'string', description: 'Minimum SOL to leave in each source wallet (default: 0.005)' },
    },
    required: ['targetWalletId'],
  },
};

export const listWalletsDefinition: ToolDefinition = {
  name: 'list_wallets',
  description: 'List all wallets or filter by tag',
  inputSchema: {
    type: 'object',
    properties: {
      tag: { type: 'string', description: 'Filter by tag' },
      limit: { type: 'number', description: 'Maximum number of wallets to return' },
      offset: { type: 'number', description: 'Offset for pagination' },
    },
    required: [],
  },
};

export const deleteWalletDefinition: ToolDefinition = {
  name: 'delete_wallet',
  description: 'Delete a wallet (must have zero balance)',
  inputSchema: {
    type: 'object',
    properties: {
      walletId: { type: 'string', description: 'Wallet ID to delete' },
      force: { type: 'boolean', description: 'Force delete even with remaining balance' },
    },
    required: ['walletId'],
  },
};

// All wallet tool definitions
export const walletToolDefinitions = [
  createWalletSwarmDefinition,
  getWalletBalancesDefinition,
  distributeFundsDefinition,
  consolidateFundsDefinition,
  listWalletsDefinition,
  deleteWalletDefinition,
];
