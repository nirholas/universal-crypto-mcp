/**
 * Bot Resources
 * MCP resource providers for bot data
 */

import type { Resource, ResourceTemplate } from '../types.js';
import { logger } from '../utils/logger.js';

export const botResourceTemplates: ResourceTemplate[] = [
  {
    uriTemplate: 'bots://list',
    name: 'Bot List',
    description: 'List of all bots',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'bots://{botId}/status',
    name: 'Bot Status',
    description: 'Current status and stats for a bot',
    mimeType: 'application/json',
  },
];

export async function getBotListResource(): Promise<Resource & { content: string }> {
  logger.debug('Fetching bot list resource');
  
  // TODO: Integrate with orchestrator
  const bots: any[] = [];
  
  return {
    uri: 'bots://list',
    name: 'Bot List',
    mimeType: 'application/json',
    content: JSON.stringify({ bots, total: bots.length }, null, 2),
  };
}

export async function getBotStatusResource(botId: string): Promise<Resource & { content: string }> {
  logger.debug({ botId }, 'Fetching bot status resource');
  
  // TODO: Integrate with orchestrator
  return {
    uri: `bots://${botId}/status`,
    name: `Status for ${botId}`,
    mimeType: 'application/json',
    content: JSON.stringify({ error: 'Bot not found' }, null, 2),
  };
}
