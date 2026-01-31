/**
 * Spending Policy Enforcement
 * 
 * Handles spending policy checks and enforcement for agent wallets.
 */

import {
  type AgentWallet,
  type PolicyCheckResult,
  type SpendingPolicy,
  parseUsd,
  formatUsd,
  addUsd,
  subtractUsd,
  compareUsd,
} from "./types.js";

/**
 * Spending Policy Manager
 */
export class SpendingPolicyManager {
  /**
   * Check if a payment is allowed under the wallet's policy
   */
  checkPayment(
    wallet: AgentWallet,
    amount: string,
    serviceId?: string
  ): PolicyCheckResult {
    const policy = wallet.spendingPolicy;

    // Check wallet status
    if (wallet.status === "paused") {
      return { allowed: false, reason: "wallet_paused" };
    }

    if (wallet.status === "suspended") {
      return { allowed: false, reason: "wallet_suspended" };
    }

    if (wallet.status === "depleted") {
      return { allowed: false, reason: "insufficient_balance" };
    }

    // Check balance
    if (compareUsd(wallet.balance, amount) < 0) {
      return { allowed: false, reason: "insufficient_balance" };
    }

    // Check per-transaction limit
    if (compareUsd(amount, policy.perTransactionLimit) > 0) {
      return { allowed: false, reason: "transaction_too_large" };
    }

    // Reset counters if needed
    this.maybeResetCounters(policy);

    // Check daily limit
    const dailyRemaining = subtractUsd(policy.dailyLimit, policy.currentDaySpent);
    if (compareUsd(amount, dailyRemaining) > 0) {
      return {
        allowed: false,
        reason: "daily_limit_exceeded",
        remainingDaily: dailyRemaining,
      };
    }

    // Check monthly limit
    const monthlyRemaining = subtractUsd(policy.monthlyLimit, policy.currentMonthSpent);
    if (compareUsd(amount, monthlyRemaining) > 0) {
      return {
        allowed: false,
        reason: "monthly_limit_exceeded",
        remainingMonthly: monthlyRemaining,
      };
    }

    // Check cooldown
    if (policy.cooldownSeconds && policy.cooldownSeconds > 0 && policy.lastTransactionAt) {
      const cooldownEnd = new Date(
        policy.lastTransactionAt.getTime() + policy.cooldownSeconds * 1000
      );
      if (new Date() < cooldownEnd) {
        return {
          allowed: false,
          reason: "cooldown_active",
          nextAllowedAt: cooldownEnd,
        };
      }
    }

    // Check allowlist
    if (serviceId && !this.isServiceAllowed(wallet, serviceId)) {
      return { allowed: false, reason: "service_not_allowed" };
    }

    // Calculate remaining amounts
    const newDailyRemaining = subtractUsd(dailyRemaining, amount);
    const newMonthlyRemaining = subtractUsd(monthlyRemaining, amount);

    return {
      allowed: true,
      remainingDaily: newDailyRemaining,
      remainingMonthly: newMonthlyRemaining,
    };
  }

  /**
   * Record a payment in the policy counters
   */
  recordPayment(policy: SpendingPolicy, amount: string): void {
    this.maybeResetCounters(policy);
    
    policy.currentDaySpent = addUsd(policy.currentDaySpent, amount);
    policy.currentMonthSpent = addUsd(policy.currentMonthSpent, amount);
    policy.lastTransactionAt = new Date();
  }

  /**
   * Reset daily/monthly counters if needed
   */
  maybeResetCounters(policy: SpendingPolicy): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Reset daily counter
    const lastDayReset = new Date(policy.lastDayReset);
    const lastDayResetDate = new Date(
      lastDayReset.getFullYear(),
      lastDayReset.getMonth(),
      lastDayReset.getDate()
    );

    if (today > lastDayResetDate) {
      policy.currentDaySpent = "0.00";
      policy.lastDayReset = now;
    }

    // Reset monthly counter
    const lastMonthReset = new Date(policy.lastMonthReset);
    const lastMonthResetMonth = new Date(
      lastMonthReset.getFullYear(),
      lastMonthReset.getMonth(),
      1
    );

    if (thisMonth > lastMonthResetMonth) {
      policy.currentMonthSpent = "0.00";
      policy.lastMonthReset = now;
    }
  }

  /**
   * Check if a service is allowed by the wallet's allowlist
   */
  isServiceAllowed(wallet: AgentWallet, serviceId: string): boolean {
    const { mode, services, categories } = wallet.allowlist;

    switch (mode) {
      case "all":
        return true;

      case "allowlist":
        // Check direct service match
        if (services.includes(serviceId)) {
          return true;
        }
        // Check pattern match (supports wildcards)
        for (const pattern of services) {
          if (this.matchPattern(pattern, serviceId)) {
            return true;
          }
        }
        // Check category match (would need service metadata)
        return false;

      case "blocklist":
        // Check if explicitly blocked
        if (services.includes(serviceId)) {
          return false;
        }
        for (const pattern of services) {
          if (this.matchPattern(pattern, serviceId)) {
            return false;
          }
        }
        return true;

      default:
        return false;
    }
  }

  /**
   * Match a pattern against a service ID
   * Supports simple wildcards: * matches any characters
   */
  private matchPattern(pattern: string, serviceId: string): boolean {
    if (!pattern.includes("*")) {
      return pattern === serviceId;
    }

    // Convert wildcard pattern to regex
    const regexPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(serviceId);
  }

  /**
   * Get current budget status
   */
  getBudget(wallet: AgentWallet): {
    dailyRemaining: string;
    monthlyRemaining: string;
    balance: string;
    perTransactionMax: string;
  } {
    const policy = wallet.spendingPolicy;
    this.maybeResetCounters(policy);

    return {
      dailyRemaining: subtractUsd(policy.dailyLimit, policy.currentDaySpent),
      monthlyRemaining: subtractUsd(policy.monthlyLimit, policy.currentMonthSpent),
      balance: wallet.balance,
      perTransactionMax: policy.perTransactionLimit,
    };
  }

  /**
   * Calculate maximum allowed payment right now
   */
  getMaxAllowedPayment(wallet: AgentWallet): string {
    if (wallet.status !== "active") {
      return "0.00";
    }

    const policy = wallet.spendingPolicy;
    this.maybeResetCounters(policy);

    // Get all limits
    const dailyRemaining = parseUsd(subtractUsd(policy.dailyLimit, policy.currentDaySpent));
    const monthlyRemaining = parseUsd(subtractUsd(policy.monthlyLimit, policy.currentMonthSpent));
    const balance = parseUsd(wallet.balance);
    const perTransaction = parseUsd(policy.perTransactionLimit);

    // Return the minimum of all limits
    const maxAllowed = Math.min(dailyRemaining, monthlyRemaining, balance, perTransaction);
    return formatUsd(Math.max(0, maxAllowed));
  }
}

// Export singleton instance
export const spendingPolicy = new SpendingPolicyManager();
