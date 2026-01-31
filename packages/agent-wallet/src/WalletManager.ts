/**
 * Wallet Manager
 * 
 * Manages agent wallets - creation, updates, and lifecycle management.
 */

import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";
import {
  type AgentWallet,
  type WalletStorage,
  type WalletActivity,
  type CreateWalletRequest,
  type UpdatePolicyRequest,
  type ServiceAllowlist,
  type TopUpResult,
  type WalletManagerConfig,
  DEFAULT_SPENDING_POLICY,
  DEFAULT_ALLOWLIST,
  parseUsd,
  formatUsd,
  addUsd,
  subtractUsd,
  compareUsd,
} from "./types.js";
import { SpendingPolicyManager } from "./SpendingPolicy.js";

/**
 * In-memory wallet storage (for development/testing)
 */
export class InMemoryWalletStorage implements WalletStorage {
  private wallets = new Map<string, AgentWallet>();
  private activities: WalletActivity[] = [];
  private apiKeyIndex = new Map<string, string>(); // apiKeyHash -> walletId

  async createWallet(wallet: AgentWallet): Promise<void> {
    this.wallets.set(wallet.id, wallet);
    if (wallet.apiKeyHash) {
      this.apiKeyIndex.set(wallet.apiKeyHash, wallet.id);
    }
  }

  async getWallet(walletId: string): Promise<AgentWallet | null> {
    return this.wallets.get(walletId) || null;
  }

  async updateWallet(wallet: AgentWallet): Promise<void> {
    this.wallets.set(wallet.id, wallet);
  }

  async deleteWallet(walletId: string): Promise<void> {
    const wallet = this.wallets.get(walletId);
    if (wallet?.apiKeyHash) {
      this.apiKeyIndex.delete(wallet.apiKeyHash);
    }
    this.wallets.delete(walletId);
  }

  async listWalletsByOwner(owner: string): Promise<AgentWallet[]> {
    return Array.from(this.wallets.values()).filter((w) => w.owner === owner);
  }

  async addActivity(activity: WalletActivity): Promise<void> {
    this.activities.push(activity);
  }

  async getActivity(
    walletId: string,
    limit = 50,
    offset = 0
  ): Promise<WalletActivity[]> {
    return this.activities
      .filter((a) => a.walletId === walletId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  async getWalletByApiKey(apiKeyHash: string): Promise<AgentWallet | null> {
    const walletId = this.apiKeyIndex.get(apiKeyHash);
    if (!walletId) return null;
    return this.wallets.get(walletId) || null;
  }
}

/**
 * Wallet Manager - Creates and manages agent wallets
 */
export class WalletManager {
  private storage: WalletStorage;
  private policyManager: SpendingPolicyManager;
  private facilitatorUrl?: string;
  private facilitatorApiKey?: string;

  constructor(config: WalletManagerConfig = {}) {
    this.storage = config.storageBackend || new InMemoryWalletStorage();
    this.policyManager = new SpendingPolicyManager();
    this.facilitatorUrl = config.facilitatorUrl;
    this.facilitatorApiKey = config.facilitatorApiKey;
  }

  /**
   * Create a new agent wallet
   */
  async createWallet(request: CreateWalletRequest): Promise<{
    wallet: AgentWallet;
    apiKey: string;
  }> {
    const walletId = `wallet_${uuidv4().replace(/-/g, "").substring(0, 16)}`;
    const apiKey = `ak_${uuidv4().replace(/-/g, "")}`;
    const apiKeyHash = this.hashApiKey(apiKey);

    const now = new Date();
    const spendingPolicy = {
      ...DEFAULT_SPENDING_POLICY,
      ...request.spendingPolicy,
      lastDayReset: now,
      lastMonthReset: now,
    };

    const wallet: AgentWallet = {
      id: walletId,
      name: request.name,
      owner: request.owner,
      address: this.generateAddress(), // Generate or derive address
      network: request.network || "base",
      balance: request.initialBalance || "0.00",
      spendingPolicy,
      allowlist: request.allowlist || DEFAULT_ALLOWLIST,
      autoTopUp: request.autoTopUp,
      status: "active",
      apiKeyHash,
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.createWallet(wallet);

    // Log activity
    await this.logActivity(wallet.id, "policy_change", "0.00", {
      description: "Wallet created",
    });

    return { wallet, apiKey };
  }

  /**
   * Get wallet by ID
   */
  async getWallet(walletId: string): Promise<AgentWallet | null> {
    return this.storage.getWallet(walletId);
  }

  /**
   * Get wallet by API key
   */
  async getWalletByApiKey(apiKey: string): Promise<AgentWallet | null> {
    const apiKeyHash = this.hashApiKey(apiKey);
    return this.storage.getWalletByApiKey(apiKeyHash);
  }

  /**
   * List wallets for an owner
   */
  async listWallets(owner: string): Promise<AgentWallet[]> {
    return this.storage.listWalletsByOwner(owner);
  }

  /**
   * Update spending policy
   */
  async updatePolicy(
    walletId: string,
    updates: UpdatePolicyRequest
  ): Promise<void> {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    if (updates.dailyLimit !== undefined) {
      wallet.spendingPolicy.dailyLimit = updates.dailyLimit;
    }
    if (updates.perTransactionLimit !== undefined) {
      wallet.spendingPolicy.perTransactionLimit = updates.perTransactionLimit;
    }
    if (updates.monthlyLimit !== undefined) {
      wallet.spendingPolicy.monthlyLimit = updates.monthlyLimit;
    }
    if (updates.cooldownSeconds !== undefined) {
      wallet.spendingPolicy.cooldownSeconds = updates.cooldownSeconds;
    }

    wallet.updatedAt = new Date();
    await this.storage.updateWallet(wallet);

    await this.logActivity(walletId, "policy_change", "0.00", {
      description: "Spending policy updated",
    });
  }

  /**
   * Update allowlist
   */
  async updateAllowlist(
    walletId: string,
    allowlist: ServiceAllowlist
  ): Promise<void> {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    wallet.allowlist = allowlist;
    wallet.updatedAt = new Date();
    await this.storage.updateWallet(wallet);

    await this.logActivity(walletId, "allowlist_change", "0.00", {
      description: `Allowlist updated: ${allowlist.mode} mode`,
    });
  }

  /**
   * Set wallet status
   */
  async setWalletStatus(
    walletId: string,
    status: "active" | "paused"
  ): Promise<void> {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    wallet.status = status;
    wallet.updatedAt = new Date();
    await this.storage.updateWallet(wallet);

    await this.logActivity(walletId, "status_change", "0.00", {
      description: `Wallet status changed to ${status}`,
    });
  }

  /**
   * Add funds to wallet
   */
  async topUp(
    walletId: string,
    amount: string,
    source: string
  ): Promise<void> {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    wallet.balance = addUsd(wallet.balance, amount);
    
    // Update status if was depleted
    if (wallet.status === "depleted" && parseUsd(wallet.balance) > 0) {
      wallet.status = "active";
    }

    wallet.updatedAt = new Date();
    await this.storage.updateWallet(wallet);

    await this.logActivity(walletId, "topup", amount, {
      description: `Top-up from ${source}`,
    });
  }

  /**
   * Record a payment
   */
  async recordPayment(
    walletId: string,
    amount: string,
    serviceId: string,
    paymentId: string
  ): Promise<void> {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    // Deduct from balance
    wallet.balance = subtractUsd(wallet.balance, amount);

    // Update policy counters
    this.policyManager.recordPayment(wallet.spendingPolicy, amount);

    // Check if depleted
    if (parseUsd(wallet.balance) <= 0) {
      wallet.status = "depleted";
    }

    wallet.updatedAt = new Date();
    await this.storage.updateWallet(wallet);

    await this.logActivity(walletId, "payment", amount, {
      serviceId,
      paymentId,
      description: `Payment to ${serviceId}`,
    });
  }

  /**
   * Get wallet activity
   */
  async getActivity(
    walletId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WalletActivity[]> {
    return this.storage.getActivity(
      walletId,
      options?.limit || 50,
      options?.offset || 0
    );
  }

  /**
   * Delete wallet
   */
  async deleteWallet(walletId: string): Promise<void> {
    await this.storage.deleteWallet(walletId);
  }

  /**
   * Check and execute auto top-up if needed
   */
  async checkAndTopUp(walletId: string): Promise<TopUpResult> {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      return { topped: false, error: "Wallet not found" };
    }

    if (!wallet.autoTopUp?.enabled) {
      return { topped: false };
    }

    const { threshold, amount, maxPerMonth, currentMonthTopUps } = wallet.autoTopUp;

    // Check if balance is below threshold
    if (compareUsd(wallet.balance, threshold) >= 0) {
      return { topped: false };
    }

    // Check if we've hit the monthly cap
    if (compareUsd(currentMonthTopUps, maxPerMonth) >= 0) {
      return { topped: false, error: "Monthly top-up limit reached" };
    }

    // Execute top-up based on source
    try {
      // In a real implementation, this would call the appropriate funding source
      // For now, we just add the balance
      await this.topUp(walletId, amount, wallet.autoTopUp.source);

      // Update auto top-up tracking
      wallet.autoTopUp.currentMonthTopUps = addUsd(currentMonthTopUps, amount);
      wallet.autoTopUp.lastTopUpAt = new Date();
      await this.storage.updateWallet(wallet);

      return {
        topped: true,
        amount,
        newBalance: addUsd(wallet.balance, amount),
      };
    } catch (error) {
      const err = error as Error;
      return { topped: false, error: err.message };
    }
  }

  /**
   * Regenerate API key for a wallet
   */
  async regenerateApiKey(walletId: string): Promise<string> {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletId}`);
    }

    const newApiKey = `ak_${uuidv4().replace(/-/g, "")}`;
    wallet.apiKeyHash = this.hashApiKey(newApiKey);
    wallet.updatedAt = new Date();

    await this.storage.updateWallet(wallet);

    return newApiKey;
  }

  // ============ Private Helpers ============

  private hashApiKey(apiKey: string): string {
    return createHash("sha256").update(apiKey).digest("hex");
  }

  private generateAddress(): string {
    // Generate a random address for the wallet
    // In production, this would derive from a master key or create via smart contract
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    return `0x${Buffer.from(bytes).toString("hex")}`;
  }

  private async logActivity(
    walletId: string,
    type: WalletActivity["type"],
    amount: string,
    extra: Partial<WalletActivity> = {}
  ): Promise<void> {
    const activity: WalletActivity = {
      id: uuidv4(),
      walletId,
      type,
      amount,
      status: "success",
      timestamp: new Date(),
      ...extra,
    };

    await this.storage.addActivity(activity);
  }
}
