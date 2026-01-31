/**
 * Credit Wallet - In-memory and Redis-backed credit balance management
 */

import { v4 as uuidv4 } from "uuid";
import type {
  CreditBalance,
  CreditReservation,
  CreditPurchase,
  CreditUsage,
  CreditHistoryOptions,
  CreditHistoryResponse,
} from "./types.js";

/**
 * Credit wallet storage interface
 */
export interface CreditWalletStorage {
  getBalance(userId: string): Promise<CreditBalance | null>;
  setBalance(balance: CreditBalance): Promise<void>;
  getReservation(reservationId: string): Promise<CreditReservation | null>;
  setReservation(reservation: CreditReservation): Promise<void>;
  deleteReservation(reservationId: string): Promise<void>;
  addPurchase(purchase: CreditPurchase): Promise<void>;
  addUsage(usage: CreditUsage): Promise<void>;
  getHistory(userId: string, options?: CreditHistoryOptions): Promise<CreditHistoryResponse>;
}

/**
 * In-memory credit wallet storage (for development/testing)
 */
export class InMemoryCreditWalletStorage implements CreditWalletStorage {
  private balances = new Map<string, CreditBalance>();
  private reservations = new Map<string, CreditReservation>();
  private purchases: CreditPurchase[] = [];
  private usages: CreditUsage[] = [];

  async getBalance(userId: string): Promise<CreditBalance | null> {
    return this.balances.get(userId) || null;
  }

  async setBalance(balance: CreditBalance): Promise<void> {
    this.balances.set(balance.userId, balance);
  }

  async getReservation(reservationId: string): Promise<CreditReservation | null> {
    return this.reservations.get(reservationId) || null;
  }

  async setReservation(reservation: CreditReservation): Promise<void> {
    this.reservations.set(reservation.id, reservation);
  }

  async deleteReservation(reservationId: string): Promise<void> {
    this.reservations.delete(reservationId);
  }

  async addPurchase(purchase: CreditPurchase): Promise<void> {
    this.purchases.push(purchase);
  }

  async addUsage(usage: CreditUsage): Promise<void> {
    this.usages.push(usage);
  }

  async getHistory(
    userId: string,
    options?: CreditHistoryOptions
  ): Promise<CreditHistoryResponse> {
    const userPurchases = this.purchases
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const userUsages = this.usages
      .filter((u) => u.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    return {
      purchases: userPurchases.slice(offset, offset + limit),
      usage: userUsages.slice(offset, offset + limit),
      totalPurchased: userPurchases.reduce((sum, p) => sum + p.credits, 0),
      totalUsed: userUsages.reduce((sum, u) => sum + u.creditsUsed, 0),
    };
  }
}

/**
 * Credit Wallet Manager
 * 
 * Manages credit balances, reservations, and transactions.
 */
export class CreditWallet {
  private storage: CreditWalletStorage;

  constructor(storage?: CreditWalletStorage) {
    this.storage = storage || new InMemoryCreditWalletStorage();
  }

  /**
   * Get user's credit balance
   */
  async getBalance(userId: string): Promise<CreditBalance> {
    const balance = await this.storage.getBalance(userId);
    
    if (!balance) {
      // Create new balance record
      const newBalance: CreditBalance = {
        userId,
        balance: 0,
        reserved: 0,
        totalPurchased: 0,
        totalUsed: 0,
        lastTopUp: null,
        updatedAt: new Date(),
      };
      await this.storage.setBalance(newBalance);
      return newBalance;
    }

    return balance;
  }

  /**
   * Add credits to user's balance (after successful purchase)
   */
  async addCredits(
    userId: string,
    amount: number,
    purchase: CreditPurchase
  ): Promise<CreditBalance> {
    const balance = await this.getBalance(userId);

    balance.balance += amount;
    balance.totalPurchased += amount;
    balance.lastTopUp = new Date();
    balance.updatedAt = new Date();

    await this.storage.setBalance(balance);
    await this.storage.addPurchase(purchase);

    return balance;
  }

  /**
   * Reserve credits for a pending payment
   */
  async reserveCredits(
    userId: string,
    amount: number,
    purpose: string = "payment"
  ): Promise<CreditReservation> {
    const balance = await this.getBalance(userId);
    const availableBalance = balance.balance - balance.reserved;

    if (availableBalance < amount) {
      throw new Error(
        `Insufficient credits. Available: ${availableBalance}, Required: ${amount}`
      );
    }

    const reservation: CreditReservation = {
      id: uuidv4(),
      userId,
      amount,
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      status: "active",
      createdAt: new Date(),
    };

    balance.reserved += amount;
    balance.updatedAt = new Date();

    await this.storage.setBalance(balance);
    await this.storage.setReservation(reservation);

    return reservation;
  }

  /**
   * Confirm a credit reservation (complete the payment)
   */
  async confirmReservation(
    reservationId: string,
    paymentId: string,
    serviceId: string
  ): Promise<CreditUsage> {
    const reservation = await this.storage.getReservation(reservationId);

    if (!reservation) {
      throw new Error(`Reservation not found: ${reservationId}`);
    }

    if (reservation.status !== "active") {
      throw new Error(`Reservation is not active: ${reservation.status}`);
    }

    if (reservation.expiresAt < new Date()) {
      throw new Error("Reservation has expired");
    }

    // Update balance
    const balance = await this.getBalance(reservation.userId);
    balance.balance -= reservation.amount;
    balance.reserved -= reservation.amount;
    balance.totalUsed += reservation.amount;
    balance.updatedAt = new Date();

    // Create usage record
    const usage: CreditUsage = {
      id: uuidv4(),
      userId: reservation.userId,
      creditsUsed: reservation.amount,
      paymentId,
      serviceId,
      reservationId,
      createdAt: new Date(),
    };

    // Update reservation status
    reservation.status = "confirmed";

    await this.storage.setBalance(balance);
    await this.storage.setReservation(reservation);
    await this.storage.addUsage(usage);

    return usage;
  }

  /**
   * Release a credit reservation (cancel the pending payment)
   */
  async releaseReservation(reservationId: string): Promise<void> {
    const reservation = await this.storage.getReservation(reservationId);

    if (!reservation) {
      throw new Error(`Reservation not found: ${reservationId}`);
    }

    if (reservation.status !== "active") {
      return; // Already released or confirmed
    }

    // Update balance
    const balance = await this.getBalance(reservation.userId);
    balance.reserved -= reservation.amount;
    balance.updatedAt = new Date();

    // Update reservation status
    reservation.status = "released";

    await this.storage.setBalance(balance);
    await this.storage.setReservation(reservation);
  }

  /**
   * Use credits directly without reservation
   */
  async useCredits(
    userId: string,
    amount: number,
    paymentId: string,
    serviceId: string
  ): Promise<CreditUsage> {
    const reservation = await this.reserveCredits(userId, amount, "direct_payment");
    return this.confirmReservation(reservation.id, paymentId, serviceId);
  }

  /**
   * Get credit history for a user
   */
  async getHistory(
    userId: string,
    options?: CreditHistoryOptions
  ): Promise<CreditHistoryResponse> {
    return this.storage.getHistory(userId, options);
  }

  /**
   * Check if user has sufficient credits
   */
  async hasCredits(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance.balance - balance.reserved >= amount;
  }

  /**
   * Get available balance (excluding reserved)
   */
  async getAvailableBalance(userId: string): Promise<number> {
    const balance = await this.getBalance(userId);
    return balance.balance - balance.reserved;
  }

  /**
   * Clean up expired reservations
   */
  async cleanupExpiredReservations(): Promise<number> {
    // This would need to iterate over reservations in the storage
    // For now, return 0 - implementation depends on storage backend
    return 0;
  }
}
