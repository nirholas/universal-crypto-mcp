/**
 * Agent Wallet Types
 * 
 * Types for the AI agent wallet system with spending controls,
 * allowlists, and automatic top-up functionality.
 */

/**
 * Agent wallet configuration
 */
export interface AgentWallet {
  id: string;
  name: string;
  owner: string;              // User who controls the wallet
  address: string;            // On-chain address
  network: string;            // Default network (e.g., "base", "arbitrum")
  balance: string;            // Current USDC balance
  spendingPolicy: SpendingPolicy;
  allowlist: ServiceAllowlist;
  autoTopUp?: AutoTopUp;
  status: WalletStatus;
  apiKeyHash?: string;        // Hash of API key for agent auth
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Wallet status
 */
export type WalletStatus = "active" | "paused" | "depleted" | "suspended";

/**
 * Spending policy for controlling wallet usage
 */
export interface SpendingPolicy {
  dailyLimit: string;         // Max per day in USD
  perTransactionLimit: string; // Max per transaction in USD
  monthlyLimit: string;       // Max per month in USD
  cooldownSeconds?: number;   // Min time between transactions
  currentDaySpent: string;    // Amount spent today
  currentMonthSpent: string;  // Amount spent this month
  lastTransactionAt?: Date;   // Last transaction timestamp
  lastDayReset: Date;         // When daily counter was reset
  lastMonthReset: Date;       // When monthly counter was reset
}

/**
 * Default spending policy
 */
export const DEFAULT_SPENDING_POLICY: SpendingPolicy = {
  dailyLimit: "10.00",
  perTransactionLimit: "1.00",
  monthlyLimit: "100.00",
  cooldownSeconds: 0,
  currentDaySpent: "0.00",
  currentMonthSpent: "0.00",
  lastDayReset: new Date(),
  lastMonthReset: new Date(),
};

/**
 * Service allowlist configuration
 */
export interface ServiceAllowlist {
  mode: AllowlistMode;
  services: string[];         // Service IDs or patterns
  categories?: string[];      // Allowed categories
}

/**
 * Allowlist mode
 */
export type AllowlistMode = "allowlist" | "blocklist" | "all";

/**
 * Default allowlist (allow all)
 */
export const DEFAULT_ALLOWLIST: ServiceAllowlist = {
  mode: "all",
  services: [],
};

/**
 * Auto top-up configuration
 */
export interface AutoTopUp {
  enabled: boolean;
  threshold: string;          // Top up when below this balance
  amount: string;             // Amount to add
  source: AutoTopUpSource;
  maxPerMonth: string;        // Safety cap per month
  currentMonthTopUps: string; // Amount topped up this month
  lastTopUpAt?: Date;
}

/**
 * Auto top-up funding source
 */
export type AutoTopUpSource = "owner_wallet" | "credits" | "stripe";

/**
 * Wallet activity record
 */
export interface WalletActivity {
  id: string;
  walletId: string;
  type: ActivityType;
  amount: string;
  service?: string;
  serviceId?: string;
  paymentId?: string;
  description?: string;
  status: "success" | "failed" | "pending";
  timestamp: Date;
}

/**
 * Activity types
 */
export type ActivityType = 
  | "payment" 
  | "topup" 
  | "refund" 
  | "policy_change"
  | "allowlist_change"
  | "status_change";

/**
 * Policy check result
 */
export interface PolicyCheckResult {
  allowed: boolean;
  reason?: PolicyDenialReason;
  remainingDaily?: string;
  remainingMonthly?: string;
  nextAllowedAt?: Date;
}

/**
 * Reasons for denying a payment
 */
export type PolicyDenialReason =
  | "insufficient_balance"
  | "daily_limit_exceeded"
  | "monthly_limit_exceeded"
  | "transaction_too_large"
  | "service_not_allowed"
  | "wallet_paused"
  | "wallet_suspended"
  | "cooldown_active";

/**
 * Create wallet request
 */
export interface CreateWalletRequest {
  name: string;
  owner: string;
  network?: string;
  initialBalance?: string;
  spendingPolicy?: Partial<SpendingPolicy>;
  allowlist?: ServiceAllowlist;
  autoTopUp?: AutoTopUp;
}

/**
 * Update policy request
 */
export interface UpdatePolicyRequest {
  dailyLimit?: string;
  perTransactionLimit?: string;
  monthlyLimit?: string;
  cooldownSeconds?: number;
}

/**
 * Wallet budget summary
 */
export interface WalletBudget {
  dailyRemaining: string;
  monthlyRemaining: string;
  balance: string;
  perTransactionMax: string;
}

/**
 * Payment authorization request
 */
export interface AuthorizePaymentRequest {
  amount: string;
  serviceId?: string;
  description?: string;
}

/**
 * Payment authorization result
 */
export interface AuthorizePaymentResult {
  authorized: boolean;
  authorizationId?: string;
  paymentProof?: PaymentProof;
  reason?: PolicyDenialReason;
}

/**
 * Payment requirements from x402
 */
export interface PaymentRequirements {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description?: string;
  payTo: string;
  asset?: string;
}

/**
 * Payment proof for x402
 */
export interface PaymentProof {
  x402Version: number;
  scheme: string;
  network: string;
  payload: unknown;
}

/**
 * Agent wallet client configuration
 */
export interface AgentWalletClientConfig {
  walletId: string;
  apiKey: string;
  facilitatorUrl: string;
}

/**
 * Wallet manager configuration
 */
export interface WalletManagerConfig {
  storageBackend?: WalletStorage;
  facilitatorUrl?: string;
  facilitatorApiKey?: string;
}

/**
 * Wallet storage interface
 */
export interface WalletStorage {
  createWallet(wallet: AgentWallet): Promise<void>;
  getWallet(walletId: string): Promise<AgentWallet | null>;
  updateWallet(wallet: AgentWallet): Promise<void>;
  deleteWallet(walletId: string): Promise<void>;
  listWalletsByOwner(owner: string): Promise<AgentWallet[]>;
  addActivity(activity: WalletActivity): Promise<void>;
  getActivity(walletId: string, limit?: number, offset?: number): Promise<WalletActivity[]>;
  getWalletByApiKey(apiKeyHash: string): Promise<AgentWallet | null>;
}

/**
 * Auto top-up check result
 */
export interface TopUpResult {
  topped: boolean;
  amount?: string;
  newBalance?: string;
  error?: string;
}

/**
 * Parse USD amount string to number
 */
export function parseUsd(amount: string): number {
  const cleaned = amount.replace(/[$,]/g, "");
  return parseFloat(cleaned);
}

/**
 * Format number as USD string
 */
export function formatUsd(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Add two USD amounts
 */
export function addUsd(a: string, b: string): string {
  return formatUsd(parseUsd(a) + parseUsd(b));
}

/**
 * Subtract USD amounts
 */
export function subtractUsd(a: string, b: string): string {
  return formatUsd(parseUsd(a) - parseUsd(b));
}

/**
 * Compare USD amounts
 */
export function compareUsd(a: string, b: string): number {
  return parseUsd(a) - parseUsd(b);
}
