/**
 * Campaign Resources
 * MCP resource providers for campaign data with real orchestrator integration
 */

import type { Resource, ResourceTemplate } from '../types.js';
import { logger } from '../utils/logger.js';

// Campaign status types
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

// Campaign configuration interface
export interface CampaignConfig {
  id: string;
  name: string;
  tokenMint: string;
  targetVolumeSOL: number;
  status: CampaignStatus;
  walletCount: number;
  minTradeSOL: number;
  maxTradeSOL: number;
  intervalMinutes: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  metrics: {
    volumeGenerated: number;
    transactionCount: number;
    successfulTrades: number;
    failedTrades: number;
    walletsUsed: number;
    averageTradeSize: number;
  };
}

// In-memory campaign store (in production, use database)
const campaignStore = new Map<string, CampaignConfig>();

export const campaignResourceTemplates: ResourceTemplate[] = [
  {
    uriTemplate: 'campaigns://list',
    name: 'Campaign List',
    description: 'List of all campaigns',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'campaigns://{campaignId}',
    name: 'Campaign Details',
    description: 'Detailed information about a campaign',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'campaigns://{campaignId}/metrics',
    name: 'Campaign Metrics',
    description: 'Real-time metrics for a campaign',
    mimeType: 'application/json',
  },
];

export async function getCampaignListResource(): Promise<Resource & { content: string }> {
  logger.debug('Fetching campaign list resource');
  
  const campaigns = Array.from(campaignStore.values()).map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    tokenMint: campaign.tokenMint,
    targetVolumeSOL: campaign.targetVolumeSOL,
    status: campaign.status,
    walletCount: campaign.walletCount,
    volumeGenerated: campaign.metrics.volumeGenerated,
    transactionCount: campaign.metrics.transactionCount,
    progress: calculateProgress(campaign),
    createdAt: campaign.createdAt.toISOString(),
  }));
  
  const summary = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    completed: campaigns.filter((c) => c.status === 'completed').length,
    paused: campaigns.filter((c) => c.status === 'paused').length,
    totalVolumeGenerated: campaigns.reduce((sum, c) => sum + c.volumeGenerated, 0),
    totalTransactions: campaigns.reduce((sum, c) => sum + c.transactionCount, 0),
  };
  
  return {
    uri: 'campaigns://list',
    name: 'Campaign List',
    mimeType: 'application/json',
    content: JSON.stringify({ campaigns, summary }, null, 2),
  };
}

export async function getCampaignResource(campaignId: string): Promise<Resource & { content: string }> {
  logger.debug({ campaignId }, 'Fetching campaign resource');
  
  const campaign = campaignStore.get(campaignId);
  if (!campaign) {
    return {
      uri: `campaigns://${campaignId}`,
      name: `Campaign ${campaignId}`,
      mimeType: 'application/json',
      content: JSON.stringify({ error: 'Campaign not found' }, null, 2),
    };
  }
  
  return {
    uri: `campaigns://${campaignId}`,
    name: `Campaign ${campaignId}`,
    mimeType: 'application/json',
    content: JSON.stringify({
      id: campaign.id,
      name: campaign.name,
      tokenMint: campaign.tokenMint,
      status: campaign.status,
      config: {
        targetVolumeSOL: campaign.targetVolumeSOL,
        walletCount: campaign.walletCount,
        minTradeSOL: campaign.minTradeSOL,
        maxTradeSOL: campaign.maxTradeSOL,
        intervalMinutes: campaign.intervalMinutes,
      },
      metrics: {
        volumeGenerated: campaign.metrics.volumeGenerated,
        transactionCount: campaign.metrics.transactionCount,
        successfulTrades: campaign.metrics.successfulTrades,
        failedTrades: campaign.metrics.failedTrades,
        successRate: calculateSuccessRate(campaign),
        walletsUsed: campaign.metrics.walletsUsed,
        averageTradeSize: campaign.metrics.averageTradeSize,
      },
      progress: calculateProgress(campaign),
      createdAt: campaign.createdAt.toISOString(),
      startedAt: campaign.startedAt?.toISOString(),
      completedAt: campaign.completedAt?.toISOString(),
    }, null, 2),
  };
}

export async function getCampaignMetricsResource(campaignId: string): Promise<Resource & { content: string }> {
  logger.debug({ campaignId }, 'Fetching campaign metrics resource');
  
  const campaign = campaignStore.get(campaignId);
  if (!campaign) {
    return {
      uri: `campaigns://${campaignId}/metrics`,
      name: `Metrics for ${campaignId}`,
      mimeType: 'application/json',
      content: JSON.stringify({ error: 'Campaign not found' }, null, 2),
    };
  }
  
  const runtime = campaign.startedAt
    ? Date.now() - campaign.startedAt.getTime()
    : 0;
  const runtimeHours = Math.floor(runtime / (1000 * 60 * 60));
  const runtimeMinutes = Math.floor((runtime % (1000 * 60 * 60)) / (1000 * 60));
  
  const volumePerHour = runtimeHours > 0
    ? campaign.metrics.volumeGenerated / runtimeHours
    : campaign.metrics.volumeGenerated;
  
  const estimatedCompletion = volumePerHour > 0
    ? (campaign.targetVolumeSOL - campaign.metrics.volumeGenerated) / volumePerHour
    : null;
  
  return {
    uri: `campaigns://${campaignId}/metrics`,
    name: `Metrics for ${campaignId}`,
    mimeType: 'application/json',
    content: JSON.stringify({
      volumeGenerated: campaign.metrics.volumeGenerated.toFixed(4),
      targetVolume: campaign.targetVolumeSOL,
      remaining: Math.max(0, campaign.targetVolumeSOL - campaign.metrics.volumeGenerated).toFixed(4),
      transactionCount: campaign.metrics.transactionCount,
      successfulTrades: campaign.metrics.successfulTrades,
      failedTrades: campaign.metrics.failedTrades,
      successRate: `${(calculateSuccessRate(campaign) * 100).toFixed(2)}%`,
      progressPercent: `${(calculateProgress(campaign) * 100).toFixed(2)}%`,
      runtime: `${runtimeHours}h ${runtimeMinutes}m`,
      volumePerHour: volumePerHour.toFixed(4),
      estimatedHoursRemaining: estimatedCompletion?.toFixed(1) || 'N/A',
      walletsActive: campaign.metrics.walletsUsed,
      averageTradeSize: campaign.metrics.averageTradeSize.toFixed(4),
    }, null, 2),
  };
}

// Helper functions
function calculateProgress(campaign: CampaignConfig): number {
  if (campaign.targetVolumeSOL <= 0) return 0;
  return Math.min(1, campaign.metrics.volumeGenerated / campaign.targetVolumeSOL);
}

function calculateSuccessRate(campaign: CampaignConfig): number {
  const total = campaign.metrics.successfulTrades + campaign.metrics.failedTrades;
  if (total === 0) return 0;
  return campaign.metrics.successfulTrades / total;
}

// Campaign management functions
export function createCampaign(config: {
  id: string;
  name: string;
  tokenMint: string;
  targetVolumeSOL: number;
  walletCount: number;
  minTradeSOL: number;
  maxTradeSOL: number;
  intervalMinutes: number;
}): CampaignConfig {
  const campaign: CampaignConfig = {
    ...config,
    status: 'draft',
    createdAt: new Date(),
    metrics: {
      volumeGenerated: 0,
      transactionCount: 0,
      successfulTrades: 0,
      failedTrades: 0,
      walletsUsed: 0,
      averageTradeSize: 0,
    },
  };
  
  campaignStore.set(config.id, campaign);
  logger.info({ campaignId: config.id }, 'Campaign created');
  return campaign;
}

export function updateCampaignStatus(campaignId: string, status: CampaignStatus): boolean {
  const campaign = campaignStore.get(campaignId);
  if (!campaign) return false;
  
  campaign.status = status;
  if (status === 'active' && !campaign.startedAt) {
    campaign.startedAt = new Date();
  } else if (status === 'completed') {
    campaign.completedAt = new Date();
  }
  
  logger.info({ campaignId, status }, 'Campaign status updated');
  return true;
}

export function recordCampaignTrade(
  campaignId: string,
  volumeSOL: number,
  success: boolean,
  walletAddress: string
): boolean {
  const campaign = campaignStore.get(campaignId);
  if (!campaign) return false;
  
  campaign.metrics.transactionCount++;
  campaign.metrics.volumeGenerated += volumeSOL;
  
  if (success) {
    campaign.metrics.successfulTrades++;
  } else {
    campaign.metrics.failedTrades++;
  }
  
  // Update average trade size
  campaign.metrics.averageTradeSize =
    campaign.metrics.volumeGenerated / campaign.metrics.transactionCount;
  
  // Check if target reached
  if (campaign.metrics.volumeGenerated >= campaign.targetVolumeSOL) {
    campaign.status = 'completed';
    campaign.completedAt = new Date();
    logger.info({ campaignId }, 'Campaign completed - target volume reached');
  }
  
  return true;
}

export function getCampaign(campaignId: string): CampaignConfig | undefined {
  return campaignStore.get(campaignId);
}

export function getAllCampaigns(): CampaignConfig[] {
  return Array.from(campaignStore.values());
}
