/**
 * Hooks - Main Export
 * 
 * Exports all React hooks for the Universal Crypto MCP website
 * Includes WebSocket hooks, data fetching hooks, and utility hooks
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// ============================================================================
// Core Data Hooks
// ============================================================================

// Token data (prices, metrics, portfolio)
export {
  useTokenData,
  useMultiTokenData,
  useTokenSearch,
  useTokenPortfolio,
  type TokenInfo,
  type TokenPrice,
  type TokenMetrics,
  type TokenHistoricalPrice,
  type UseTokenDataOptions,
  type UseTokenDataReturn,
  type UseMultiTokenDataReturn,
  type TokenSearchResult,
  type PortfolioToken,
  type UseTokenPortfolioReturn,
} from './useTokenData';

// Wallet balances (multi-chain)
export {
  useWalletBalance,
  useNativeBalance,
  useMultiChainTotal,
  CHAIN_NAMES,
  NATIVE_CURRENCIES,
  type SupportedChainId,
  type TokenBalance,
  type NativeBalance,
  type ChainBalance,
  type WalletBalanceTotal,
  type UseWalletBalanceOptions,
  type UseWalletBalanceReturn,
} from './useWalletBalance';

// DeFi protocols (TVL, yields, pools)
export {
  useDeFiProtocols,
  useDeFiPools,
  useChainTVL,
  useProtocolDetail,
  DEFI_CATEGORIES,
  SUPPORTED_CHAINS as DEFI_SUPPORTED_CHAINS,
  type DeFiProtocol,
  type DeFiPool,
  type DeFiYield,
  type ChainTVL,
  type UseDeFiProtocolsOptions,
  type UseDeFiProtocolsReturn,
  type UseDeFiPoolsReturn,
} from './useDeFiProtocols';

// AI Agents
export {
  useAgents,
  useAgent,
  useAgentMutations,
  useAgentLogs,
  useAgentRuns,
  useAgentMetrics,
  useAgentManagement,
  type Agent,
  type AgentConfig,
  type AgentMetrics,
  type AgentTrigger,
  type AgentRun,
  type AgentLog,
  type CreateAgentParams,
  type UpdateAgentParams,
} from './useAgents';

// Workflow Automation
export {
  useAutomation,
  useWorkflowRuns,
  useWorkflowStats,
  useWorkflowBuilder,
  type Workflow,
  type WorkflowTrigger,
  type WorkflowAction,
  type WorkflowRun,
  type WorkflowStep,
  type WorkflowStatus,
  type TriggerType,
  type ActionType,
  type UseAutomationOptions,
  type UseAutomationReturn,
  type CreateWorkflowInput,
} from './useAutomation';

// Chain utilities
export {
  useChains,
  useChainStatus,
  useChainGas,
  useCurrentChain,
  CHAINS,
  getChainName,
  getChainIcon,
  parseChainId,
  formatChainId,
  getTxExplorerUrl,
  getAddressExplorerUrl,
  type Chain,
  type ChainStatus,
  type ChainGasPrice,
  type UseChainsOptions,
  type UseChainsReturn,
  type UseChainStatusReturn,
  type UseChainGasReturn,
} from './useChains';

// ============================================================================
// WebSocket Hooks
// ============================================================================

// Price streaming
export {
  usePriceStream,
  usePrice,
  useTopMovers,
  type UsePriceStreamOptions,
  type UsePriceStreamReturn,
} from './usePriceStream';

// Wallet updates
export {
  useWalletUpdates,
  useTransactionStatus,
  useBlocks,
  type Activity,
  type UseWalletUpdatesOptions,
  type UseWalletUpdatesReturn,
} from './useWalletUpdates';

// Notifications
export {
  useNotifications,
  useAlerts,
  type UseNotificationsOptions,
  type UseNotificationsReturn,
  type UseAlertsOptions,
  type UseAlertsReturn,
} from './useNotifications';

// Re-export from providers
export {
  WebSocketProvider,
  useWebSocketContext,
  WhenConnected,
  WhenDisconnected,
  ConnectionStatus,
  type WebSocketContextValue,
  type WebSocketProviderProps,
} from '../providers/WebSocketProvider';

// Re-export core hooks from lib
export {
  useWebSocket,
  usePriceSubscription,
  useWalletSubscription,
  useNotifications as useNotificationsInternal,
  useConnectionQuality,
  useMessage,
  useSubscription,
  type UseWebSocketOptions,
  type UseWebSocketReturn,
} from '../lib/websocket/hooks';
