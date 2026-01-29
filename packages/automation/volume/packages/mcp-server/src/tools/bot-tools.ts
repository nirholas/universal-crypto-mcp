/**
 * Bot Management Tools
 * MCP tools for creating and managing trading bots
 */

import type { ToolDefinition } from '../types.js';

// ===========================================
// TOOL DEFINITIONS
// ===========================================

export const createBotDefinition: ToolDefinition = {
  name: 'create_bot',
  description: 'Create a new trading bot',
  inputSchema: {
    type: 'object',
    properties: {
      walletId: { type: 'string', description: 'Wallet ID for the bot' },
      targetToken: { type: 'string', description: 'Token mint to trade' },
      mode: { type: 'string', enum: ['volume', 'market-make', 'accumulate', 'distribute'], description: 'Bot mode' },
      minTradeSize: { type: 'string', description: 'Minimum trade size in SOL' },
      maxTradeSize: { type: 'string', description: 'Maximum trade size in SOL' },
      minIntervalMs: { type: 'number', description: 'Minimum interval between trades (ms)' },
      maxIntervalMs: { type: 'number', description: 'Maximum interval between trades (ms)' },
      buyProbability: { type: 'number', description: 'Probability of buying (0-1)' },
    },
    required: ['walletId', 'targetToken', 'mode', 'minTradeSize', 'maxTradeSize'],
  },
};

export const configureBotDefinition: ToolDefinition = {
  name: 'configure_bot',
  description: 'Update bot configuration',
  inputSchema: {
    type: 'object',
    properties: {
      botId: { type: 'string', description: 'Bot ID to configure' },
      config: {
        type: 'object',
        description: 'Configuration updates',
        properties: {
          minTradeSize: { type: 'string', description: 'Minimum trade size' },
          maxTradeSize: { type: 'string', description: 'Maximum trade size' },
          minIntervalMs: { type: 'number', description: 'Min interval' },
          maxIntervalMs: { type: 'number', description: 'Max interval' },
          buyProbability: { type: 'number', description: 'Buy probability' },
        },
      },
    },
    required: ['botId', 'config'],
  },
};

export const startBotDefinition: ToolDefinition = {
  name: 'start_bot',
  description: 'Start a bot',
  inputSchema: {
    type: 'object',
    properties: {
      botId: { type: 'string', description: 'Bot ID to start' },
    },
    required: ['botId'],
  },
};

export const stopBotDefinition: ToolDefinition = {
  name: 'stop_bot',
  description: 'Stop a bot',
  inputSchema: {
    type: 'object',
    properties: {
      botId: { type: 'string', description: 'Bot ID to stop' },
    },
    required: ['botId'],
  },
};

export const getBotStatusDefinition: ToolDefinition = {
  name: 'get_bot_status',
  description: 'Get bot status and stats',
  inputSchema: {
    type: 'object',
    properties: {
      botId: { type: 'string', description: 'Bot ID' },
    },
    required: ['botId'],
  },
};

export const listActiveBotsDefinition: ToolDefinition = {
  name: 'list_active_bots',
  description: 'List all active bots',
  inputSchema: {
    type: 'object',
    properties: {
      campaignId: { type: 'string', description: 'Filter by campaign' },
      status: { type: 'string', enum: ['idle', 'running', 'paused', 'stopped', 'error'], description: 'Filter by status' },
    },
    required: [],
  },
};

// All bot tool definitions
export const botToolDefinitions = [
  createBotDefinition,
  configureBotDefinition,
  startBotDefinition,
  stopBotDefinition,
  getBotStatusDefinition,
  listActiveBotsDefinition,
];
