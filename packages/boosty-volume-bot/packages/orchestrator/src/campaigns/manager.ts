/**
 * Campaign Manager
 * Manages volume generation campaigns
 */

import { EventEmitter } from 'eventemitter3';
import type {
  Campaign,
  CampaignConfig,
  CampaignStatus,
  CampaignMetrics,
  CampaignManagerInterface,
  BotConfig,
  Task,
} from '../types.js';
import { VolumeCampaign } from './campaign.js';
import { AutoAdjuster, type AutoAdjusterConfig } from './auto-adjuster.js';
import { BotCoordinator } from '../bots/coordinator.js';

/**
 * Events emitted by the campaign manager
 */
export interface CampaignManagerEvents {
  'campaign-created': (campaign: Campaign) => void;
  'campaign-started': (campaignId: string) => void;
  'campaign-paused': (campaignId: string) => void;
  'campaign-stopped': (campaignId: string) => void;
  'campaign-completed': (campaignId: string) => void;
  'campaign-target-reached': (campaignId: string, type: 'volume' | 'transactions' | 'time') => void;
  'error': (campaignId: string, error: Error) => void;
}

/**
 * Campaign manager configuration
 */
export interface CampaignManagerConfig {
  /** Bot coordinator instance */
  botCoordinator: BotCoordinator;
  /** Task enqueue function */
  enqueueTask: (task: Task) => Promise<string>;
  /** Auto-adjuster configuration */
  autoAdjusterConfig?: Partial<AutoAdjusterConfig>;
  /** Maximum concurrent campaigns */
  maxConcurrentCampaigns: number;
  /** Enable auto-adjustment by default */
  enableAutoAdjustment: boolean;
}

/**
 * CampaignManager - Manages multiple volume campaigns
 */
export class CampaignManager extends EventEmitter<CampaignManagerEvents> implements CampaignManagerInterface {
  private campaigns: Map<string, VolumeCampaign> = new Map();
  private adjusters: Map<string, AutoAdjuster> = new Map();
  private config: CampaignManagerConfig;

  constructor(config: CampaignManagerConfig) {
    super();
    this.config = config;
  }

  /**
   * Create a new campaign
   */
  async createCampaign(config: CampaignConfig): Promise<Campaign> {
    // Check concurrent campaign limit
    const activeCampaigns = Array.from(this.campaigns.values())
      .filter(c => c.state === 'active').length;
    
    if (activeCampaigns >= this.config.maxConcurrentCampaigns) {
      throw new Error(`Maximum concurrent campaigns (${this.config.maxConcurrentCampaigns}) reached`);
    }

    // Create campaign
    const campaign = new VolumeCampaign(config);

    // Set up event listeners
    this.setupCampaignListeners(campaign);

    // Create bots for the campaign
    const walletIds = await this.generateWalletIds(config.botCount, campaign.id);
    
    const baseBotConfig: BotConfig = {
      walletId: '', // Will be set per bot
      targetToken: config.targetToken,
      mode: 'volume',
      minTradeSize: config.walletFundingAmount / 100n,
      maxTradeSize: config.walletFundingAmount / 10n,
      minInterval: this.getIntervalForMode(config.mode).min,
      maxInterval: this.getIntervalForMode(config.mode).max,
      buyProbability: 0.5,
      maxDailyTrades: Math.ceil(config.targetTransactionCount24h / config.botCount),
      maxDailyVolume: config.targetVolume24h / BigInt(config.botCount),
      enabled: true,
    };

    const bots = await this.config.botCoordinator.createBotSwarm(
      config.botCount,
      { ...baseBotConfig, walletId: walletIds[0] ?? `${campaign.id}-wallet-0` }
    );

    // Register bots with campaign
    for (const bot of bots) {
      campaign.addBot(bot.id);
    }

    // Create auto-adjuster if enabled
    if (this.config.enableAutoAdjustment) {
      const adjuster = new AutoAdjuster(
        campaign,
        this.config.autoAdjusterConfig,
        {
          onAddBots: async (count) => this.addBotsToCampaign(campaign.id, count),
          onRemoveBots: async (count) => this.removeBotsFromCampaign(campaign.id, count),
          onUpdateBotConfigs: async (updates) => this.updateCampaignBotConfigs(campaign.id, updates),
        }
      );
      this.adjusters.set(campaign.id, adjuster);
    }

    // Store campaign
    this.campaigns.set(campaign.id, campaign);

    this.emit('campaign-created', campaign);

    return campaign;
  }

  /**
   * Start a campaign
   */
  async startCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    // Start all campaign bots
    for (const botId of campaign.botIds) {
      try {
        await this.config.botCoordinator.startBot(botId);
      } catch (error) {
        console.error(`Failed to start bot ${botId}:`, error);
      }
    }

    // Start campaign
    campaign.start();

    // Start auto-adjuster
    const adjuster = this.adjusters.get(campaignId);
    if (adjuster) {
      adjuster.start();
    }

    this.emit('campaign-started', campaignId);
  }

  /**
   * Pause a campaign
   */
  async pauseCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    // Pause all campaign bots
    for (const botId of campaign.botIds) {
      try {
        await this.config.botCoordinator.pauseBot(botId);
      } catch (error) {
        console.error(`Failed to pause bot ${botId}:`, error);
      }
    }

    // Pause campaign
    campaign.pause();

    // Pause auto-adjuster
    const adjuster = this.adjusters.get(campaignId);
    if (adjuster) {
      adjuster.stop();
    }

    this.emit('campaign-paused', campaignId);
  }

  /**
   * Stop a campaign
   */
  async stopCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    // Stop all campaign bots
    for (const botId of campaign.botIds) {
      try {
        await this.config.botCoordinator.stopBot(botId);
      } catch (error) {
        console.error(`Failed to stop bot ${botId}:`, error);
      }
    }

    // Stop campaign
    campaign.stop();

    // Stop auto-adjuster
    const adjuster = this.adjusters.get(campaignId);
    if (adjuster) {
      adjuster.stop();
    }

    this.emit('campaign-stopped', campaignId);
  }

  /**
   * Get campaign status
   */
  async getCampaignStatus(campaignId: string): Promise<CampaignStatus> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    return campaign.getStatus();
  }

  /**
   * Get campaign metrics
   */
  async getCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    return campaign.getMetrics();
  }

  /**
   * Adjust campaign parameters
   */
  async adjustCampaignParams(
    campaignId: string,
    params: Partial<CampaignConfig>
  ): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    campaign.updateConfig(params);

    // Update bot configurations if relevant params changed
    if (params.targetVolume24h || params.targetTransactionCount24h) {
      await this.recalculateBotParams(campaignId);
    }
  }

  /**
   * Get all campaigns
   */
  getAllCampaigns(): Campaign[] {
    return Array.from(this.campaigns.values());
  }

  /**
   * Get active campaigns
   */
  getActiveCampaigns(): Campaign[] {
    return Array.from(this.campaigns.values())
      .filter(c => c.state === 'active');
  }

  /**
   * Get campaign by ID
   */
  getCampaign(campaignId: string): Campaign | undefined {
    return this.campaigns.get(campaignId);
  }

  /**
   * Remove a campaign
   */
  async removeCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      return;
    }

    // Stop if active
    if (campaign.state === 'active') {
      await this.stopCampaign(campaignId);
    }

    // Remove bots
    for (const botId of campaign.botIds) {
      await this.config.botCoordinator.removeBot(botId);
    }

    // Clean up
    campaign.destroy();
    this.campaigns.delete(campaignId);

    const adjuster = this.adjusters.get(campaignId);
    if (adjuster) {
      adjuster.stop();
      this.adjusters.delete(campaignId);
    }
  }

  /**
   * Record a trade for a campaign
   */
  recordTrade(
    campaignId: string,
    type: 'buy' | 'sell',
    amount: bigint,
    fees: bigint,
    walletId: string,
    success: boolean
  ): void {
    const campaign = this.campaigns.get(campaignId);
    if (campaign) {
      campaign.recordTrade(type, amount, fees, walletId, success);
    }
  }

  /**
   * Shutdown all campaigns
   */
  async shutdown(): Promise<void> {
    const campaignIds = Array.from(this.campaigns.keys());
    
    for (const campaignId of campaignIds) {
      await this.stopCampaign(campaignId);
    }
  }

  /**
   * Set up event listeners for a campaign
   */
  private setupCampaignListeners(campaign: VolumeCampaign): void {
    campaign.on('state-change', (newState) => {
      if (newState === 'completed') {
        this.emit('campaign-completed', campaign.id);
      }
    });

    campaign.on('target-reached', (type) => {
      this.emit('campaign-target-reached', campaign.id, type);
    });

    campaign.on('error', (error) => {
      this.emit('error', campaign.id, error);
    });
  }

  /**
   * Generate wallet IDs for a campaign
   */
  private async generateWalletIds(count: number, campaignId: string): Promise<string[]> {
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      ids.push(`${campaignId}-wallet-${i.toString().padStart(4, '0')}`);
    }
    return ids;
  }

  /**
   * Add bots to a campaign
   */
  private async addBotsToCampaign(campaignId: string, count: number): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    const newWalletIds = await this.generateWalletIds(
      count,
      `${campaignId}-add-${Date.now()}`
    );

    const baseBotConfig: BotConfig = {
      walletId: newWalletIds[0] ?? `${campaignId}-wallet-0`,
      targetToken: campaign.config.targetToken,
      mode: 'volume',
      minTradeSize: campaign.config.walletFundingAmount / 100n,
      maxTradeSize: campaign.config.walletFundingAmount / 10n,
      minInterval: this.getIntervalForMode(campaign.config.mode).min,
      maxInterval: this.getIntervalForMode(campaign.config.mode).max,
      buyProbability: 0.5,
      maxDailyTrades: Math.ceil(campaign.config.targetTransactionCount24h / campaign.config.botCount),
      maxDailyVolume: campaign.config.targetVolume24h / BigInt(campaign.config.botCount),
      enabled: true,
    };

    const newBots = await this.config.botCoordinator.createBotSwarm(count, baseBotConfig);

    for (const bot of newBots) {
      campaign.addBot(bot.id);
      if (campaign.state === 'active') {
        await this.config.botCoordinator.startBot(bot.id);
      }
    }
  }

  /**
   * Remove bots from a campaign
   */
  private async removeBotsFromCampaign(campaignId: string, count: number): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    const botsToRemove = campaign.botIds.slice(-count);
    
    for (const botId of botsToRemove) {
      await this.config.botCoordinator.removeBot(botId);
      campaign.removeBot(botId);
    }
  }

  /**
   * Update bot configurations for a campaign
   */
  private async updateCampaignBotConfigs(
    campaignId: string,
    updates: Partial<BotConfig>
  ): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    for (const botId of campaign.botIds) {
      this.config.botCoordinator.updateBotConfig(botId, updates);
    }
  }

  /**
   * Recalculate bot parameters after campaign config change
   */
  private async recalculateBotParams(campaignId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    const botCount = campaign.botIds.length;
    const updates: Partial<BotConfig> = {
      maxDailyTrades: Math.ceil(campaign.config.targetTransactionCount24h / botCount),
      maxDailyVolume: campaign.config.targetVolume24h / BigInt(botCount),
    };

    await this.updateCampaignBotConfigs(campaignId, updates);
  }

  /**
   * Get interval range based on mode
   */
  private getIntervalForMode(mode: 'aggressive' | 'moderate' | 'stealth'): {
    min: number;
    max: number;
  } {
    switch (mode) {
      case 'aggressive':
        return { min: 5000, max: 60000 };
      case 'stealth':
        return { min: 60000, max: 900000 };
      case 'moderate':
      default:
        return { min: 15000, max: 300000 };
    }
  }

  /**
   * Get aggregate stats across all campaigns
   */
  getAggregateStats(): {
    totalCampaigns: number;
    activeCampaigns: number;
    totalVolume: bigint;
    totalTransactions: number;
    totalBots: number;
  } {
    let totalVolume = 0n;
    let totalTransactions = 0;
    let totalBots = 0;
    let activeCampaigns = 0;

    for (const campaign of this.campaigns.values()) {
      const metrics = campaign.getMetrics();
      totalVolume += metrics.totalVolume;
      totalTransactions += metrics.totalTransactions;
      totalBots += campaign.botIds.length;
      if (campaign.state === 'active') {
        activeCampaigns++;
      }
    }

    return {
      totalCampaigns: this.campaigns.size,
      activeCampaigns,
      totalVolume,
      totalTransactions,
      totalBots,
    };
  }
}
