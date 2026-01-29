/**
 * Campaign Tools
 * MCP tools for managing volume generation campaigns
 */

import type { ToolDefinition } from '../types.js';

// ===========================================
// TOOL DEFINITIONS
// ===========================================

export const createVolumeCampaignDefinition: ToolDefinition = {
  name: 'create_volume_campaign',
  description: 'Create and configure a volume generation campaign',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Campaign name' },
      targetToken: { type: 'string', description: 'Token mint to generate volume for' },
      targetVolume24h: { type: 'string', description: 'Target 24h volume in SOL' },
      botCount: { type: 'number', description: 'Number of bots to use (1-500)' },
      duration: { type: 'number', description: 'Campaign duration in hours (default: 24)' },
      mode: { type: 'string', enum: ['aggressive', 'moderate', 'stealth'], description: 'Campaign intensity' },
      walletTag: { type: 'string', description: 'Use wallets with this tag' },
    },
    required: ['name', 'targetToken', 'targetVolume24h', 'botCount'],
  },
};

export const startCampaignDefinition: ToolDefinition = {
  name: 'start_campaign',
  description: 'Start a volume campaign',
  inputSchema: {
    type: 'object',
    properties: {
      campaignId: { type: 'string', description: 'Campaign ID to start' },
    },
    required: ['campaignId'],
  },
};

export const pauseCampaignDefinition: ToolDefinition = {
  name: 'pause_campaign',
  description: 'Pause a running campaign',
  inputSchema: {
    type: 'object',
    properties: {
      campaignId: { type: 'string', description: 'Campaign ID to pause' },
    },
    required: ['campaignId'],
  },
};

export const stopCampaignDefinition: ToolDefinition = {
  name: 'stop_campaign',
  description: 'Stop and finalize a campaign',
  inputSchema: {
    type: 'object',
    properties: {
      campaignId: { type: 'string', description: 'Campaign ID to stop' },
    },
    required: ['campaignId'],
  },
};

export const getCampaignStatusDefinition: ToolDefinition = {
  name: 'get_campaign_status',
  description: 'Get current status of a campaign',
  inputSchema: {
    type: 'object',
    properties: {
      campaignId: { type: 'string', description: 'Campaign ID' },
    },
    required: ['campaignId'],
  },
};

export const getCampaignMetricsDefinition: ToolDefinition = {
  name: 'get_campaign_metrics',
  description: 'Get detailed metrics for a campaign',
  inputSchema: {
    type: 'object',
    properties: {
      campaignId: { type: 'string', description: 'Campaign ID' },
      detailed: { type: 'boolean', description: 'Include per-bot metrics' },
    },
    required: ['campaignId'],
  },
};

export const listCampaignsDefinition: ToolDefinition = {
  name: 'list_campaigns',
  description: 'List all campaigns',
  inputSchema: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['draft', 'active', 'paused', 'completed', 'failed'], description: 'Filter by status' },
      limit: { type: 'number', description: 'Maximum number to return' },
    },
    required: [],
  },
};

// All campaign tool definitions
export const campaignToolDefinitions = [
  createVolumeCampaignDefinition,
  startCampaignDefinition,
  pauseCampaignDefinition,
  stopCampaignDefinition,
  getCampaignStatusDefinition,
  getCampaignMetricsDefinition,
  listCampaignsDefinition,
];
