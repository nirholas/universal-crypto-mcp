/**
 * @nirholas/agent-wallet
 * 
 * Wallet system specifically designed for AI agents, with spending limits,
 * service allowlists, and automatic top-up functionality.
 * 
 * Features:
 * - 🤖 Pre-funded wallets for AI agents
 * - 💰 Spending limits (per day, per transaction, per month)
 * - ✅ Service allowlists/blocklists
 * - 🔄 Automatic top-up when balance is low
 * - 👤 Owner oversight and control
 * - 🔌 MCP integration support
 * 
 * @example
 * ```typescript
 * // === Owner Side: Create and manage wallets ===
 * import { WalletManager } from '@nirholas/agent-wallet';
 * 
 * const manager = new WalletManager();
 * 
 * // Create a wallet for an AI agent
 * const { wallet, apiKey } = await manager.createWallet({
 *   name: 'Research Agent',
 *   owner: 'user_123',
 *   network: 'base',
 *   initialBalance: '50.00',
 *   spendingPolicy: {
 *     dailyLimit: '10.00',
 *     perTransactionLimit: '1.00',
 *     monthlyLimit: '100.00',
 *   },
 *   allowlist: {
 *     mode: 'allowlist',
 *     services: ['openai-*', 'anthropic-*'],
 *   },
 *   autoTopUp: {
 *     enabled: true,
 *     threshold: '10.00',
 *     amount: '50.00',
 *     source: 'credits',
 *     maxPerMonth: '200.00',
 *     currentMonthTopUps: '0.00',
 *   },
 * });
 * 
 * console.log(`Wallet ID: ${wallet.id}`);
 * console.log(`API Key: ${apiKey}`); // Save this securely!
 * 
 * // === Agent Side: Use the wallet ===
 * import { AgentWalletClient } from '@nirholas/agent-wallet';
 * 
 * const client = new AgentWalletClient({
 *   walletId: process.env.AGENT_WALLET_ID,
 *   apiKey: process.env.AGENT_WALLET_API_KEY,
 *   facilitatorUrl: 'https://facilitator.example.com',
 * });
 * 
 * // Check budget
 * const budget = await client.getBudget();
 * console.log(`Daily remaining: $${budget.dailyRemaining}`);
 * 
 * // Wrap HTTP client for automatic payments
 * const api = client.wrapAxios(axios.create({
 *   baseURL: 'https://api.example.com'
 * }));
 * 
 * // Make requests - 402 responses are handled automatically
 * const data = await api.get('/paid-endpoint');
 * ```
 * 
 * ## MCP Integration
 * 
 * ```typescript
 * // In your MCP server
 * import { AgentWalletClient } from '@nirholas/agent-wallet';
 * 
 * const wallet = new AgentWalletClient({
 *   walletId: process.env.AGENT_WALLET_ID,
 *   apiKey: process.env.AGENT_WALLET_API_KEY,
 *   facilitatorUrl: 'https://facilitator.example.com',
 * });
 * 
 * // Use in tool implementations
 * const paidApi = wallet.wrapAxios(axios.create({
 *   baseURL: 'https://paid-api.example.com'
 * }));
 * ```
 * 
 * ## Claude Desktop Config
 * 
 * ```json
 * {
 *   "mcpServers": {
 *     "my-agent": {
 *       "command": "npx",
 *       "args": ["@nirholas/my-mcp-server"],
 *       "env": {
 *         "AGENT_WALLET_ID": "wallet_abc123",
 *         "AGENT_WALLET_API_KEY": "ak_xyz789"
 *       }
 *     }
 *   }
 * }
 * ```
 * 
 * @packageDocumentation
 */

// Wallet management
export {
  WalletManager,
  InMemoryWalletStorage,
} from "./WalletManager.js";

// Agent client
export {
  AgentWalletClient,
  type X402Client,
} from "./AgentWalletClient.js";

// Spending policy
export {
  SpendingPolicyManager,
  spendingPolicy,
} from "./SpendingPolicy.js";

// Types
export {
  type AgentWallet,
  type WalletStatus,
  type SpendingPolicy,
  type ServiceAllowlist,
  type AllowlistMode,
  type AutoTopUp,
  type AutoTopUpSource,
  type WalletActivity,
  type ActivityType,
  type PolicyCheckResult,
  type PolicyDenialReason,
  type CreateWalletRequest,
  type UpdatePolicyRequest,
  type WalletBudget,
  type AuthorizePaymentRequest,
  type AuthorizePaymentResult,
  type PaymentRequirements,
  type PaymentProof,
  type AgentWalletClientConfig,
  type WalletManagerConfig,
  type WalletStorage,
  type TopUpResult,
  DEFAULT_SPENDING_POLICY,
  DEFAULT_ALLOWLIST,
  parseUsd,
  formatUsd,
  addUsd,
  subtractUsd,
  compareUsd,
} from "./types.js";
