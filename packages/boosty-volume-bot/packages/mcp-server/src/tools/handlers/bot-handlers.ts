/**
 * Tool Handlers - Bot Operations
 * Real integration with @boosty/mcp-orchestrator
 */

import type { Bot, ToolResult } from '../../types.js';
import { logger } from '../../utils/logger.js';
import {
  Orchestrator,
  type BotConfig,
  type BotStatus,
} from '@boosty/mcp-orchestrator';

// Singleton orchestrator instance
let orchestrator: Orchestrator | null = null;
let initializationPromise: Promise<Orchestrator> | null = null;

/**
 * Get or create orchestrator instance (thread-safe singleton)
 */
async function getOrchestrator(): Promise<Orchestrator> {
  if (orchestrator) {
    return orchestrator;
  }
  
  if (initializationPromise) {
    return initializationPromise;
  }
  
  initializationPromise = (async () => {
    const orch = new Orchestrator({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        prefix: 'mcp-bots',
        enablePersistence: true,
      },
      bots: {
        maxConcurrent: parseInt(process.env.MAX_BOTS || '10000', 10),
      },
    });
    
    await orch.initialize();
    orchestrator = orch;
    
    // Handle graceful shutdown
    const cleanup = async () => {
      if (orchestrator) {
        await orchestrator.shutdown();
        orchestrator = null;
      }
    };
    
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
    
    logger.info('Orchestrator initialized for bot operations');
    return orch;
  })();
  
  return initializationPromise;
}

/**
 * Convert orchestrator bot status to API bot format
 */
function toApiBotFormat(
  botId: string,
  config: BotConfig,
  status: BotStatus
): Bot {
  return {
    id: botId,
    config: {
      walletId: config.walletId,
      targetToken: config.targetToken,
      mode: config.mode,
      minTradeSize: config.minTradeSize.toString(),
      maxTradeSize: config.maxTradeSize.toString(),
      minIntervalMs: config.minInterval,
      maxIntervalMs: config.maxInterval,
      buyProbability: config.buyProbability,
      maxDailyTrades: config.maxDailyTrades,
      maxDailyVolume: config.maxDailyVolume.toString(),
    },
    status: status.state,
    stats: {
      totalTrades: status.tradesCompleted,
      totalVolume: status.volumeGenerated.toString(),
      successfulTrades: status.tradesCompleted,
      failedTrades: status.errors.length,
      totalFees: '0',
      profitLoss: '0',
    },
    createdAt: status.lastActive?.toISOString() || new Date().toISOString(),
  };
}

export async function createBot(args: {
  walletId: string;
  targetToken: string;
  mode: 'volume' | 'market-make' | 'accumulate' | 'distribute';
  minTradeSize: string;
  maxTradeSize: string;
  minIntervalMs?: number;
  maxIntervalMs?: number;
  buyProbability?: number;
}): Promise<ToolResult<Bot>> {
  logger.info({ args }, 'Creating bot');

  try {
    const orch = await getOrchestrator();
    
    const config: BotConfig = {
      walletId: args.walletId,
      targetToken: args.targetToken,
      mode: args.mode,
      minTradeSize: BigInt(args.minTradeSize),
      maxTradeSize: BigInt(args.maxTradeSize),
      minInterval: args.minIntervalMs || 30000,
      maxInterval: args.maxIntervalMs || 300000,
      buyProbability: args.buyProbability || 0.5,
      maxDailyTrades: 100,
      maxDailyVolume: BigInt(args.maxTradeSize) * 100n,
      enabled: true,
    };
    
    const botId = await orch.createBot(config);
    const status = await orch.getBotStatus(botId);
    
    if (!status) {
      throw new Error('Bot created but status unavailable');
    }
    
    logger.info({ botId }, 'Bot created successfully');
    
    return {
      success: true,
      data: toApiBotFormat(botId, config, status),
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to create bot');
    return {
      success: false,
      error: {
        code: 'CREATE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error creating bot',
      },
    };
  }
}

export async function configureBot(args: {
  botId: string;
  config: Record<string, unknown>;
}): Promise<ToolResult<Bot>> {
  logger.info({ args }, 'Configuring bot');

  try {
    const orch = await getOrchestrator();
    
    const currentStatus = await orch.getBotStatus(args.botId);
    if (!currentStatus) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Bot ${args.botId} not found`,
        },
      };
    }
    
    const updates: Partial<BotConfig> = {};
    
    if (args.config.minTradeSize !== undefined) {
      updates.minTradeSize = BigInt(args.config.minTradeSize as string);
    }
    if (args.config.maxTradeSize !== undefined) {
      updates.maxTradeSize = BigInt(args.config.maxTradeSize as string);
    }
    if (args.config.minIntervalMs !== undefined) {
      updates.minInterval = args.config.minIntervalMs as number;
    }
    if (args.config.maxIntervalMs !== undefined) {
      updates.maxInterval = args.config.maxIntervalMs as number;
    }
    if (args.config.buyProbability !== undefined) {
      updates.buyProbability = args.config.buyProbability as number;
    }
    if (args.config.enabled !== undefined) {
      updates.enabled = args.config.enabled as boolean;
    }
    
    await orch.updateBot(args.botId, updates);
    
    const newStatus = await orch.getBotStatus(args.botId);
    if (!newStatus) {
      throw new Error('Bot updated but status unavailable');
    }
    
    const botConfig: BotConfig = {
      walletId: args.botId.split('-')[0] || 'unknown',
      targetToken: 'configured',
      mode: 'volume',
      minTradeSize: updates.minTradeSize || 10000000n,
      maxTradeSize: updates.maxTradeSize || 100000000n,
      minInterval: updates.minInterval || 30000,
      maxInterval: updates.maxInterval || 300000,
      buyProbability: updates.buyProbability || 0.5,
      maxDailyTrades: 100,
      maxDailyVolume: 10000000000n,
      enabled: updates.enabled ?? true,
    };
    
    logger.info({ botId: args.botId }, 'Bot configured successfully');
    
    return {
      success: true,
      data: toApiBotFormat(args.botId, botConfig, newStatus),
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to configure bot');
    return {
      success: false,
      error: {
        code: 'CONFIG_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error configuring bot',
      },
    };
  }
}

export async function startBot(args: {
  botId: string;
}): Promise<ToolResult<{ botId: string; status: string }>> {
  logger.info({ args }, 'Starting bot');

  try {
    const orch = await getOrchestrator();
    
    const status = await orch.getBotStatus(args.botId);
    if (!status) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Bot ${args.botId} not found`,
        },
      };
    }
    
    await orch.startBot(args.botId);
    
    logger.info({ botId: args.botId }, 'Bot started successfully');
    
    return {
      success: true,
      data: {
        botId: args.botId,
        status: 'running',
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to start bot');
    return {
      success: false,
      error: {
        code: 'START_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error starting bot',
      },
    };
  }
}

export async function stopBot(args: {
  botId: string;
}): Promise<ToolResult<{ botId: string; status: string }>> {
  logger.info({ args }, 'Stopping bot');

  try {
    const orch = await getOrchestrator();
    
    const status = await orch.getBotStatus(args.botId);
    if (!status) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Bot ${args.botId} not found`,
        },
      };
    }
    
    await orch.stopBot(args.botId);
    
    logger.info({ botId: args.botId }, 'Bot stopped successfully');
    
    return {
      success: true,
      data: {
        botId: args.botId,
        status: 'stopped',
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to stop bot');
    return {
      success: false,
      error: {
        code: 'STOP_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error stopping bot',
      },
    };
  }
}

export async function getBotStatus(args: {
  botId: string;
}): Promise<ToolResult<Bot>> {
  logger.info({ args }, 'Getting bot status');

  try {
    const orch = await getOrchestrator();
    
    const status = await orch.getBotStatus(args.botId);
    if (!status) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Bot ${args.botId} not found`,
        },
      };
    }
    
    const config: BotConfig = {
      walletId: status.walletId || args.botId.split('-')[0] || 'unknown',
      targetToken: status.campaignId || 'unknown',
      mode: 'volume',
      minTradeSize: 10000000n,
      maxTradeSize: 100000000n,
      minInterval: 30000,
      maxInterval: 300000,
      buyProbability: 0.5,
      maxDailyTrades: 100,
      maxDailyVolume: 10000000000n,
      enabled: status.state === 'running',
    };
    
    return {
      success: true,
      data: toApiBotFormat(args.botId, config, status),
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to get bot status');
    return {
      success: false,
      error: {
        code: 'STATUS_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error getting bot status',
      },
    };
  }
}

export async function listActiveBots(args: {
  campaignId?: string;
  status?: string;
}): Promise<ToolResult<Bot[]>> {
  logger.info({ args }, 'Listing active bots');

  try {
    const orch = await getOrchestrator();
    
    const activeBotIds = await orch.listBots({
      status: args.status as 'idle' | 'running' | 'paused' | 'stopped' | 'error' | undefined,
    });
    
    const bots: Bot[] = [];
    
    for (const botId of activeBotIds) {
      const status = await orch.getBotStatus(botId);
      if (status) {
        if (args.campaignId && status.campaignId !== args.campaignId) {
          continue;
        }
        
        const config: BotConfig = {
          walletId: status.walletId || botId.split('-')[0] || 'unknown',
          targetToken: status.campaignId || 'unknown',
          mode: 'volume',
          minTradeSize: 10000000n,
          maxTradeSize: 100000000n,
          minInterval: 30000,
          maxInterval: 300000,
          buyProbability: 0.5,
          maxDailyTrades: 100,
          maxDailyVolume: 10000000000n,
          enabled: status.state === 'running',
        };
        
        bots.push(toApiBotFormat(botId, config, status));
      }
    }
    
    logger.info({ count: bots.length }, 'Listed active bots');
    
    return {
      success: true,
      data: bots,
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to list bots');
    return {
      success: false,
      error: {
        code: 'LIST_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error listing bots',
      },
    };
  }
}

/**
 * Cleanup orchestrator on module unload
 */
export async function cleanupOrchestrator(): Promise<void> {
  if (orchestrator) {
    await orchestrator.shutdown();
    orchestrator = null;
    initializationPromise = null;
  }
}
