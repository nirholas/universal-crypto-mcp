/**
 * Usage Credits System
 * Prepaid credit system for API access
 */

import { parseUnits, formatUnits } from "viem";
import type { Request, Response, NextFunction } from "express";

export interface CreditBalance {
  address: `0x${string}`;
  credits: number;
  purchaseHistory: CreditPurchase[];
  usageHistory: CreditUsage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditPurchase {
  id: string;
  amount: number;
  pricePerCredit: bigint;
  totalPrice: bigint;
  timestamp: Date;
  txHash: `0x${string}`;
  network?: string;
  bonus?: number;
}

export interface CreditUsage {
  timestamp: Date;
  route: string;
  cost: number;
  balanceAfter: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: bigint;
  bonus: number; // Percentage bonus (e.g., 10 = 10% extra credits)
}

export interface CreditSystemConfig {
  pricePerCredit: bigint;
  minimumPurchase: number;
  maximumPurchase: number;
  packages: CreditPackage[];
  defaultCostPerRequest: number;
}

/**
 * Default credit packages
 */
const DEFAULT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 100,
    price: parseUnits("0.10", 6), // $0.10 for 100 credits = $0.001 each
    bonus: 0,
  },
  {
    id: "basic",
    name: "Basic Pack",
    credits: 1000,
    price: parseUnits("0.90", 6), // $0.90 for 1000 = 10% savings
    bonus: 10,
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 5000,
    price: parseUnits("4.00", 6), // $4.00 for 5000 = 20% savings
    bonus: 20,
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    credits: 25000,
    price: parseUnits("17.50", 6), // $17.50 for 25000 = 30% savings
    bonus: 30,
  },
];

/**
 * Default configuration
 */
const DEFAULT_CONFIG: CreditSystemConfig = {
  pricePerCredit: parseUnits("0.001", 6), // $0.001 per credit
  minimumPurchase: 10,
  maximumPurchase: 1000000,
  packages: DEFAULT_PACKAGES,
  defaultCostPerRequest: 1,
};

/**
 * Credit system manager
 */
export class CreditSystem {
  private balances: Map<string, CreditBalance> = new Map();
  private config: CreditSystemConfig;
  private onCreditsUsed?: (address: `0x${string}`, cost: number, remaining: number) => void;
  private onCreditsPurchased?: (address: `0x${string}`, amount: number, txHash: string) => void;
  private onCreditsLow?: (address: `0x${string}`, remaining: number) => void;

  constructor(options?: {
    config?: Partial<CreditSystemConfig>;
    onCreditsUsed?: (address: `0x${string}`, cost: number, remaining: number) => void;
    onCreditsPurchased?: (address: `0x${string}`, amount: number, txHash: string) => void;
    onCreditsLow?: (address: `0x${string}`, remaining: number) => void;
  }) {
    this.config = { ...DEFAULT_CONFIG, ...options?.config };
    this.onCreditsUsed = options?.onCreditsUsed;
    this.onCreditsPurchased = options?.onCreditsPurchased;
    this.onCreditsLow = options?.onCreditsLow;
  }

  /**
   * Get available credit packages
   */
  getPackages(): CreditPackage[] {
    return this.config.packages;
  }

  /**
   * Get package by ID
   */
  getPackage(id: string): CreditPackage | undefined {
    return this.config.packages.find((p) => p.id === id);
  }

  /**
   * Calculate price for a custom credit amount
   */
  calculatePrice(amount: number): bigint {
    if (amount < this.config.minimumPurchase) {
      throw new Error(`Minimum purchase is ${this.config.minimumPurchase} credits`);
    }
    if (amount > this.config.maximumPurchase) {
      throw new Error(`Maximum purchase is ${this.config.maximumPurchase} credits`);
    }

    return BigInt(amount) * this.config.pricePerCredit;
  }

  /**
   * Purchase credits for a user
   */
  async purchaseCredits(
    buyer: `0x${string}`,
    amount: number,
    txHash: `0x${string}`,
    options?: {
      network?: string;
      packageId?: string;
    }
  ): Promise<CreditBalance> {
    const existing = this.balances.get(buyer.toLowerCase()) || {
      address: buyer,
      credits: 0,
      purchaseHistory: [],
      usageHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Calculate bonus if purchasing a package
    let bonus = 0;
    if (options?.packageId) {
      const pkg = this.getPackage(options.packageId);
      if (pkg) {
        bonus = Math.floor((amount * pkg.bonus) / 100);
      }
    }

    const totalCredits = amount + bonus;
    const totalPrice = this.calculatePrice(amount);

    const purchase: CreditPurchase = {
      id: `purchase_${Date.now()}_${buyer.slice(2, 8)}`,
      amount: totalCredits,
      pricePerCredit: this.config.pricePerCredit,
      totalPrice,
      timestamp: new Date(),
      txHash,
      network: options?.network,
      bonus,
    };

    existing.credits += totalCredits;
    existing.purchaseHistory.push(purchase);
    existing.updatedAt = new Date();

    this.balances.set(buyer.toLowerCase(), existing);
    this.onCreditsPurchased?.(buyer, totalCredits, txHash);

    return existing;
  }

  /**
   * Use credits for an API call
   */
  useCredits(user: `0x${string}`, cost: number = this.config.defaultCostPerRequest, route?: string): boolean {
    const balance = this.balances.get(user.toLowerCase());

    if (!balance || balance.credits < cost) {
      return false;
    }

    balance.credits -= cost;
    balance.updatedAt = new Date();

    // Track usage
    balance.usageHistory.push({
      timestamp: new Date(),
      route: route || "unknown",
      cost,
      balanceAfter: balance.credits,
    });

    // Keep usage history manageable (last 1000 entries)
    if (balance.usageHistory.length > 1000) {
      balance.usageHistory = balance.usageHistory.slice(-1000);
    }

    this.onCreditsUsed?.(user, cost, balance.credits);

    // Alert if credits are low (< 10% of last purchase or < 10)
    const lastPurchase = balance.purchaseHistory[balance.purchaseHistory.length - 1];
    const lowThreshold = lastPurchase ? Math.floor(lastPurchase.amount * 0.1) : 10;
    
    if (balance.credits <= Math.max(lowThreshold, 10)) {
      this.onCreditsLow?.(user, balance.credits);
    }

    return true;
  }

  /**
   * Get credit balance for a user
   */
  getBalance(user: `0x${string}`): number {
    return this.balances.get(user.toLowerCase())?.credits || 0;
  }

  /**
   * Get full balance info for a user
   */
  getBalanceInfo(user: `0x${string}`): CreditBalance | undefined {
    return this.balances.get(user.toLowerCase());
  }

  /**
   * Check if user has enough credits
   */
  hasCredits(user: `0x${string}`, amount: number = 1): boolean {
    return this.getBalance(user) >= amount;
  }

  /**
   * Add free credits (for promotions, referrals, etc.)
   */
  addFreeCredits(user: `0x${string}`, amount: number, reason: string): void {
    const existing = this.balances.get(user.toLowerCase()) || {
      address: user,
      credits: 0,
      purchaseHistory: [],
      usageHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const purchase: CreditPurchase = {
      id: `free_${Date.now()}_${user.slice(2, 8)}`,
      amount,
      pricePerCredit: 0n,
      totalPrice: 0n,
      timestamp: new Date(),
      txHash: "0x0" as `0x${string}`,
      bonus: 0,
    };

    existing.credits += amount;
    existing.purchaseHistory.push(purchase);
    existing.updatedAt = new Date();

    this.balances.set(user.toLowerCase(), existing);
  }

  /**
   * Get usage statistics for a user
   */
  getUsageStats(
    user: `0x${string}`,
    since?: Date
  ): {
    totalUsed: number;
    totalPurchased: number;
    averagePerDay: number;
    topRoutes: { route: string; count: number }[];
  } {
    const balance = this.balances.get(user.toLowerCase());

    if (!balance) {
      return {
        totalUsed: 0,
        totalPurchased: 0,
        averagePerDay: 0,
        topRoutes: [],
      };
    }

    const sinceTime = since?.getTime() || 0;
    const usage = balance.usageHistory.filter(
      (u) => u.timestamp.getTime() >= sinceTime
    );

    const totalUsed = usage.reduce((sum, u) => sum + u.cost, 0);
    const totalPurchased = balance.purchaseHistory
      .filter((p) => p.timestamp.getTime() >= sinceTime)
      .reduce((sum, p) => sum + p.amount, 0);

    // Calculate average per day
    const oldestUsage = usage[0]?.timestamp || new Date();
    const daysSince = Math.max(
      1,
      Math.ceil((Date.now() - oldestUsage.getTime()) / (1000 * 60 * 60 * 24))
    );
    const averagePerDay = totalUsed / daysSince;

    // Calculate top routes
    const routeCounts = new Map<string, number>();
    for (const u of usage) {
      routeCounts.set(u.route, (routeCounts.get(u.route) || 0) + 1);
    }

    const topRoutes = Array.from(routeCounts.entries())
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalUsed,
      totalPurchased,
      averagePerDay,
      topRoutes,
    };
  }

  /**
   * Get all users with credits
   */
  getAllUsers(): `0x${string}`[] {
    const users: `0x${string}`[] = [];
    
    for (const balance of this.balances.values()) {
      users.push(balance.address);
    }

    return users;
  }

  /**
   * Get total credits in system
   */
  getTotalCreditsInSystem(): number {
    let total = 0;

    for (const balance of this.balances.values()) {
      total += balance.credits;
    }

    return total;
  }

  /**
   * Export balances for persistence
   */
  exportBalances(): CreditBalance[] {
    return Array.from(this.balances.values());
  }

  /**
   * Import balances from persistence
   */
  importBalances(balances: CreditBalance[]): void {
    for (const balance of balances) {
      // Convert date strings back to Date objects if needed
      balance.createdAt = new Date(balance.createdAt);
      balance.updatedAt = new Date(balance.updatedAt);
      
      for (const purchase of balance.purchaseHistory) {
        purchase.timestamp = new Date(purchase.timestamp);
      }
      
      for (const usage of balance.usageHistory) {
        usage.timestamp = new Date(usage.timestamp);
      }

      this.balances.set(balance.address.toLowerCase(), balance);
    }
  }
}

/**
 * Express middleware for credit-based access
 */
export function creditMiddleware(
  credits: CreditSystem,
  options?: {
    costPerRequest?: number;
    routeCosts?: Record<string, number>;
  }
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.headers["x-payer-address"] as `0x${string}` | undefined;

    if (!user) {
      return res.status(400).json({
        error: "missing_payer",
        message: "x-payer-address header is required",
      });
    }

    // Determine cost for this route
    const route = `${req.method} ${req.path}`;
    const cost = options?.routeCosts?.[route] || 
                 options?.routeCosts?.[req.path] || 
                 options?.costPerRequest || 
                 1;

    const balance = credits.getBalance(user);

    if (balance >= cost) {
      const used = credits.useCredits(user, cost, route);
      
      if (used) {
        res.setHeader("X-Credits-Used", cost.toString());
        res.setHeader("X-Credits-Remaining", credits.getBalance(user).toString());
        (req as any).creditsUsed = cost;
        (req as any).creditsRemaining = credits.getBalance(user);
        return next();
      }
    }

    // No credits, require payment
    return res.status(402).json({
      error: "insufficient_credits",
      balance,
      required: cost,
      message: "Purchase credits or provide payment",
      packages: credits.getPackages().map((p) => ({
        id: p.id,
        name: p.name,
        credits: p.credits,
        price: formatUnits(p.price, 6),
        bonus: p.bonus > 0 ? `+${p.bonus}%` : undefined,
      })),
    });
  };
}

/**
 * Combined middleware that checks subscription first, then credits
 */
export function subscriptionOrCreditMiddleware(
  subscriptionManager: { isSubscriptionActive: (payer: `0x${string}`) => boolean },
  creditSystem: CreditSystem,
  options?: {
    costPerRequest?: number;
    routeCosts?: Record<string, number>;
  }
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.headers["x-payer-address"] as `0x${string}` | undefined;

    if (!user) {
      return res.status(400).json({
        error: "missing_payer",
        message: "x-payer-address header is required",
      });
    }

    // Check subscription first
    if (subscriptionManager.isSubscriptionActive(user)) {
      res.setHeader("X-Payment-Method", "subscription");
      (req as any).paymentMethod = "subscription";
      return next();
    }

    // Check credits
    const route = `${req.method} ${req.path}`;
    const cost = options?.routeCosts?.[route] || 
                 options?.routeCosts?.[req.path] || 
                 options?.costPerRequest || 
                 1;

    const balance = creditSystem.getBalance(user);

    if (balance >= cost) {
      const used = creditSystem.useCredits(user, cost, route);
      
      if (used) {
        res.setHeader("X-Payment-Method", "credits");
        res.setHeader("X-Credits-Used", cost.toString());
        res.setHeader("X-Credits-Remaining", creditSystem.getBalance(user).toString());
        (req as any).paymentMethod = "credits";
        (req as any).creditsUsed = cost;
        (req as any).creditsRemaining = creditSystem.getBalance(user);
        return next();
      }
    }

    // Neither subscription nor credits - require payment
    return res.status(402).json({
      error: "payment_required",
      message: "Active subscription or credits required",
      creditBalance: balance,
      creditRequired: cost,
    });
  };
}
