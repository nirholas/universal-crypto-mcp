/**
 * Tools Index - Export all tool definitions and handlers
 */

// Tool definitions
export { walletToolDefinitions } from './wallet-tools.js';
export { tradingToolDefinitions } from './trading-tools.js';
export { campaignToolDefinitions } from './campaign-tools.js';
export { analysisToolDefinitions } from './analysis-tools.js';
export { botToolDefinitions } from './bot-tools.js';
export { paymentToolDefinitions } from './payment-tools.js';

// Individual definitions
export * from './wallet-tools.js';
export * from './trading-tools.js';
export * from './campaign-tools.js';
export * from './analysis-tools.js';
export * from './bot-tools.js';
export * from './payment-tools.js';

// Handlers
export * from './handlers/index.js';

// Combined tool registry
import { walletToolDefinitions } from './wallet-tools.js';
import { tradingToolDefinitions } from './trading-tools.js';
import { campaignToolDefinitions } from './campaign-tools.js';
import { analysisToolDefinitions } from './analysis-tools.js';
import { botToolDefinitions } from './bot-tools.js';
import { paymentToolDefinitions } from './payment-tools.js';

import * as walletHandlers from './handlers/wallet-handlers.js';
import * as tradingHandlers from './handlers/trading-handlers.js';
import * as campaignHandlers from './handlers/campaign-handlers.js';
import * as analysisHandlers from './handlers/analysis-handlers.js';
import * as botHandlers from './handlers/bot-handlers.js';
import * as paymentHandlers from './handlers/payment-handlers.js';

export const allToolDefinitions = [
  ...walletToolDefinitions,
  ...tradingToolDefinitions,
  ...campaignToolDefinitions,
  ...analysisToolDefinitions,
  ...botToolDefinitions,
  ...paymentToolDefinitions,
];

export const toolHandlers: Record<string, (args: any) => Promise<any>> = {
  // Wallet tools
  create_wallet_swarm: walletHandlers.createWalletSwarm,
  get_wallet_balances: walletHandlers.getWalletBalances,
  distribute_funds: walletHandlers.distributeFunds,
  consolidate_funds: walletHandlers.consolidateFunds,
  list_wallets: walletHandlers.listWallets,
  delete_wallet: walletHandlers.deleteWallet,
  
  // Trading tools
  execute_swap: tradingHandlers.executeSwap,
  get_swap_quote: tradingHandlers.getSwapQuote,
  execute_batch_swaps: tradingHandlers.executeBatchSwaps,
  buy_token: tradingHandlers.buyToken,
  sell_token: tradingHandlers.sellToken,
  
  // Campaign tools
  create_volume_campaign: campaignHandlers.createVolumeCampaign,
  start_campaign: campaignHandlers.startCampaign,
  pause_campaign: campaignHandlers.pauseCampaign,
  stop_campaign: campaignHandlers.stopCampaign,
  get_campaign_status: campaignHandlers.getCampaignStatus,
  get_campaign_metrics: campaignHandlers.getCampaignMetrics,
  list_campaigns: campaignHandlers.listCampaigns,
  
  // Analysis tools
  get_token_info: analysisHandlers.getTokenInfo,
  get_pool_info: analysisHandlers.getPoolInfo,
  get_price_history: analysisHandlers.getPriceHistory,
  analyze_liquidity: analysisHandlers.analyzeLiquidity,
  get_top_holders: analysisHandlers.getTopHolders,
  get_market_overview: analysisHandlers.getMarketOverview,
  
  // Bot tools
  create_bot: botHandlers.createBot,
  configure_bot: botHandlers.configureBot,
  start_bot: botHandlers.startBot,
  stop_bot: botHandlers.stopBot,
  get_bot_status: botHandlers.getBotStatus,
  list_active_bots: botHandlers.listActiveBots,

  // Payment tools
  get_payment_pricing: paymentHandlers.getPaymentPricing,
  get_tool_price: paymentHandlers.getToolPriceHandler,
  get_payment_networks: paymentHandlers.getPaymentNetworks,
  get_payment_analytics: paymentHandlers.getPaymentAnalytics,
  validate_payment_network: paymentHandlers.validatePaymentNetwork,
};
