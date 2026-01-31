/**
 * Bot Resources
 * MCP resource providers for bot data with real orchestrator integration
 */

import type { Resource, ResourceTemplate } from '../types.js';
import { logger } from '../utils/logger.js';

// Bot status types
export type BotStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'error';

// Bot configuration interface
export interface BotConfig {
  id: string;
  name: string;
  type: 'volume' | 'market-making' | 'arbitrage';
  status: BotStatus;
  campaignId?: string;
  walletCount: number;
  createdAt: Date;
  startedAt?: Date;
  stats: {
    tradesExecuted: number;
    volumeGenerated: string;
    successRate: number;
    lastTradeAt?: Date;
    errorCount: number;
  };
}

// In-memory bot store (in production, use database)
const botStore = new Map<string, BotConfig>();

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
  
  const bots = Array.from(botStore.values()).map((bot) => ({
    id: bot.id,
    name: bot.name,
    type: bot.type,
    status: bot.status,
    campaignId: bot.campaignId,
    walletCount: bot.walletCount,
    createdAt: bot.createdAt.toISOString(),
    startedAt: bot.startedAt?.toISOString(),
    tradesExecuted: bot.stats.tradesExecuted,
    volumeGenerated: bot.stats.volumeGenerated,
  }));
  
  const summary = {
    total: bots.length,
    running: bots.filter((b) => b.status === 'running').length,
    idle: bots.filter((b) => b.status === 'idle').length,
    paused: bots.filter((b) => b.status === 'paused').length,
    error: bots.filter((b) => b.status === 'error').length,
  };
  
  return {
    uri: 'bots://list',
    name: 'Bot List',
    mimeType: 'application/json',
    content: JSON.stringify({ bots, summary }, null, 2),
  };
}

export async function getBotStatusResource(botId: string): Promise<Resource & { content: string }> {
  logger.debug({ botId }, 'Fetching bot status resource');
  
  const bot = botStore.get(botId);
  if (!bot) {
    return {
      uri: `bots://${botId}/status`,
      name: `Status for ${botId}`,
      mimeType: 'application/json',
      content: JSON.stringify({ error: 'Bot not found' }, null, 2),
    };
  }
  
  // Calculate uptime if running
  const uptime = bot.startedAt ? Date.now() - bot.startedAt.getTime() : 0;
  const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
  const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    uri: `bots://${botId}/status`,
    name: `Status for ${botId}`,
    mimeType: 'application/json',
    content: JSON.stringify({
      id: bot.id,
      name: bot.name,
      type: bot.type,
      status: bot.status,
      campaignId: bot.campaignId,
      walletCount: bot.walletCount,
      uptime: bot.startedAt ? `${uptimeHours}h ${uptimeMinutes}m` : null,
      stats: {
        tradesExecuted: bot.stats.tradesExecuted,
        volumeGenerated: bot.stats.volumeGenerated,
        successRate: `${(bot.stats.successRate * 100).toFixed(2)}%`,
        lastTradeAt: bot.stats.lastTradeAt?.toISOString(),
        errorCount: bot.stats.errorCount,
      },
      createdAt: bot.createdAt.toISOString(),
      startedAt: bot.startedAt?.toISOString(),
    }, null, 2),
  };
}

// Bot management functions
export function registerBot(config: Omit<BotConfig, 'createdAt' | 'stats'>): void {
  botStore.set(config.id, {
    ...config,
    createdAt: new Date(),
    stats: {
      tradesExecuted: 0,
      volumeGenerated: '0',
      successRate: 0,
      errorCount: 0,
    },
  });
  logger.info({ botId: config.id }, 'Bot registered');
}

export function updateBotStatus(botId: string, status: BotStatus): boolean {
  const bot = botStore.get(botId);
  if (!bot) return false;
  
  bot.status = status;
  if (status === 'running' && !bot.startedAt) {
    bot.startedAt = new Date();
  } else if (status === 'stopped') {
    bot.startedAt = undefined;
  }
  
  logger.info({ botId, status }, 'Bot status updated');
  return true;
}

export function recordTrade(botId: string, volumeSOL: number, success: boolean): boolean {
  const bot = botStore.get(botId);
  if (!bot) return false;
  
  bot.stats.tradesExecuted++;
  bot.stats.volumeGenerated = (parseFloat(bot.stats.volumeGenerated) + volumeSOL).toString();
  bot.stats.lastTradeAt = new Date();
  
  if (!success) {
    bot.stats.errorCount++;
  }
  
  // Update success rate
  const total = bot.stats.tradesExecuted;
  const successful = total - bot.stats.errorCount;
  bot.stats.successRate = successful / total;
  
  return true;
}

export function getBot(botId: string): BotConfig | undefined {
  return botStore.get(botId);
}

export function getAllBots(): BotConfig[] {
  return Array.from(botStore.values());
}
