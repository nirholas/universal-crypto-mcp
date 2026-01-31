/**
 * Tool Handlers - Campaign Operations
 */

import type {
  Campaign,
  CampaignMetrics,
  ToolResult,
} from '../../types.js';
import { logger } from '../../utils/logger.js';
import { CampaignManager } from '@volume-bot/orchestrator';

// Singleton campaign manager instance
// In production, initialize this with proper configuration from environment
let campaignManager: CampaignManager | null = null;

function getCampaignManager(): CampaignManager {
  if (!campaignManager) {
    throw new Error('Campaign manager not initialized. Call initializeCampaignManager first.');
  }
  return campaignManager;
}

export function initializeCampaignManager(manager: CampaignManager) {
  campaignManager = manager;
}

export async function createVolumeCampaign(args: {
  name: string;
  targetToken: string;
  targetVolume24h: string;
  botCount: number;
  duration?: number;
  mode?: 'aggressive' | 'moderate' | 'stealth';
  walletTag?: string;
}): Promise<ToolResult<Campaign>> {
  logger.info({ args }, 'Creating volume campaign');

  if (args.botCount < 1 || args.botCount > 500) {
    return {
      success: false,
      error: {
        code: 'INVALID_BOT_COUNT',
        message: 'Bot count must be between 1 and 500',
      },
    };
  }

  try {
    const manager = getCampaignManager();
    const campaign = await manager.createCampaign({
      name: args.name,
      targetToken: args.targetToken,
      targetVolume24h: args.targetVolume24h,
      botCount: args.botCount,
      duration: args.duration || 24,
      mode: args.mode || 'moderate',
      walletTag: args.walletTag,
    });

    return {
      success: true,
      data: campaign,
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to create campaign');
    return {
      success: false,
      error: {
        code: 'CREATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

export async function startCampaign(args: {
  campaignId: string;
}): Promise<ToolResult<{ campaignId: string; status: string }>> {
  logger.info({ args }, 'Starting campaign');

  try {
    const manager = getCampaignManager();
    await manager.startCampaign(args.campaignId);
    return {
      success: true,
      data: {
        campaignId: args.campaignId,
        status: 'active',
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to start campaign');
    return {
      success: false,
      error: {
        code: 'START_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

export async function pauseCampaign(args: {
  campaignId: string;
}): Promise<ToolResult<{ campaignId: string; status: string }>> {
  logger.info({ args }, 'Pausing campaign');

  try {
    const manager = getCampaignManager();
    await manager.pauseCampaign(args.campaignId);
    return {
      success: true,
      data: {
        campaignId: args.campaignId,
        status: 'paused',
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to pause campaign');
    return {
      success: false,
      error: {
        code: 'PAUSE_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

export async function stopCampaign(args: {
  campaignId: string;
}): Promise<ToolResult<{ campaignId: string; status: string }>> {
  logger.info({ args }, 'Stopping campaign');

  try {
    const manager = getCampaignManager();
    await manager.stopCampaign(args.campaignId);
    return {
      success: true,
      data: {
        campaignId: args.campaignId,
        status: 'completed',
      },
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to stop campaign');
    return {
      success: false,
      error: {
        code: 'STOP_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

export async function getCampaignStatus(args: {
  campaignId: string;
}): Promise<ToolResult<Campaign>> {
  logger.info({ args }, 'Getting campaign status');

  try {
    const manager = getCampaignManager();
    const campaign = await manager.getCampaign(args.campaignId);
    if (!campaign) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Campaign ${args.campaignId} not found`,
        },
      };
    }
    return {
      success: true,
      data: campaign,
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to get campaign status');
    return {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

export async function getCampaignMetrics(args: {
  campaignId: string;
  detailed?: boolean;
}): Promise<ToolResult<CampaignMetrics>> {
  logger.info({ args }, 'Getting campaign metrics');

  try {
    const manager = getCampaignManager();
    const metrics = await manager.getCampaignMetrics(args.campaignId);
    if (!metrics) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Campaign ${args.campaignId} not found`,
        },
      };
    }
    return {
      success: true,
      data: metrics,
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to get campaign metrics');
    return {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

export async function listCampaigns(args: {
  status?: string;
  limit?: number;
}): Promise<ToolResult<Campaign[]>> {
  logger.info({ args }, 'Listing campaigns');

  try {
    const manager = getCampaignManager();
    const allCampaigns = await manager.listCampaigns();
    let campaigns = allCampaigns;
    
    // Filter by status if provided
    if (args.status) {
      campaigns = campaigns.filter(c => c.status === args.status);
    }
    
    // Apply limit if provided
    if (args.limit && args.limit > 0) {
      campaigns = campaigns.slice(0, args.limit);
    }
    
    return {
      success: true,
      data: campaigns,
    };
  } catch (error) {
    logger.error({ error, args }, 'Failed to list campaigns');
    return {
      success: false,
      error: {
        code: 'LIST_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
