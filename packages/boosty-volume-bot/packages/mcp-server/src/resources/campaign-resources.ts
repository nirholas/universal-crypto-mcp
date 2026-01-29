/**
 * Campaign Resources
 * MCP resource providers for campaign data
 */

import type { Resource, ResourceTemplate } from '../types.js';
import { logger } from '../utils/logger.js';

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
  
  // TODO: Integrate with orchestrator
  const campaigns: any[] = [];
  
  return {
    uri: 'campaigns://list',
    name: 'Campaign List',
    mimeType: 'application/json',
    content: JSON.stringify({ campaigns, total: campaigns.length }, null, 2),
  };
}

export async function getCampaignResource(campaignId: string): Promise<Resource & { content: string }> {
  logger.debug({ campaignId }, 'Fetching campaign resource');
  
  // TODO: Integrate with orchestrator
  return {
    uri: `campaigns://${campaignId}`,
    name: `Campaign ${campaignId}`,
    mimeType: 'application/json',
    content: JSON.stringify({ error: 'Campaign not found' }, null, 2),
  };
}

export async function getCampaignMetricsResource(campaignId: string): Promise<Resource & { content: string }> {
  logger.debug({ campaignId }, 'Fetching campaign metrics resource');
  
  // TODO: Integrate with orchestrator
  return {
    uri: `campaigns://${campaignId}/metrics`,
    name: `Metrics for ${campaignId}`,
    mimeType: 'application/json',
    content: JSON.stringify({
      volumeGenerated: '0',
      transactionCount: 0,
      successRate: 0,
      progressPercent: 0,
    }, null, 2),
  };
}
