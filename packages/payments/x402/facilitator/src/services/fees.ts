/**
 * Fee Collection Service
 * 
 * Implements the 0.1% platform fee on all payments processed through the facilitator.
 * This is the primary revenue mechanism for the x402 infrastructure.
 * 
 * @author nich
 * @license MIT
 */

import { type Address, parseUnits, formatUnits } from 'viem';
import { logger } from '../middleware/logger.js';

/**
 * Fee tier configuration
 * Higher volume = lower fees (incentivizes usage)
 */
export interface FeeTier {
  name: string;
  minMonthlyVolume: bigint;
  basisPoints: number;  // 10 = 0.10%, 8 = 0.08%
}

/**
 * Default fee tiers
 */
export const DEFAULT_FEE_TIERS: FeeTier[] = [
  { name: 'standard', minMonthlyVolume: 0n, basisPoints: 10 },           // 0.10%
  { name: 'silver', minMonthlyVolume: parseUnits('10000', 6), basisPoints: 8 },    // 0.08%
  { name: 'gold', minMonthlyVolume: parseUnits('100000', 6), basisPoints: 6 },     // 0.06%
  { name: 'platinum', minMonthlyVolume: parseUnits('1000000', 6), basisPoints: 4 }, // 0.04%
];

/**
 * Minimum fee to prevent dust
 */
export const MINIMUM_FEE = parseUnits('0.001', 6); // $0.001 USDC

/**
 * Fee calculation result
 */
export interface FeeCalculation {
  grossAmount: bigint;
  feeAmount: bigint;
  netAmount: bigint;
  feePercent: number;
  tierName: string;
}

/**
 * Fee record for tracking
 */
export interface FeeRecord {
  id: string;
  paymentId: string;
  payer: Address;
  payee: Address;
  grossAmount: string;
  feeAmount: string;
  netAmount: string;
  feePercent: number;
  network: string;
  token: string;
  timestamp: number;
  txHash?: string;
  settled: boolean;
}

/**
 * Monthly volume tracker
 */
interface VolumeTracker {
  volume: bigint;
  monthStart: number;
}

/**
 * Fee Collection Service
 * 
 * Calculates and tracks fees for all payments processed through the facilitator.
 */
export class FeeService {
  private feeTiers: FeeTier[];
  private feeRecipient: Address;
  private volumeByPayer: Map<string, VolumeTracker> = new Map();
  private feeRecords: FeeRecord[] = [];
  private totalFeesCollected: bigint = 0n;
  private totalVolumeProcessed: bigint = 0n;

  constructor(config: {
    feeRecipient: Address;
    feeTiers?: FeeTier[];
  }) {
    this.feeRecipient = config.feeRecipient;
    this.feeTiers = config.feeTiers || DEFAULT_FEE_TIERS;
    
    // Sort tiers by volume descending for tier lookup
    this.feeTiers.sort((a, b) => 
      Number(b.minMonthlyVolume - a.minMonthlyVolume)
    );

    logger.info('FeeService initialized', {
      feeRecipient: this.feeRecipient,
      tiers: this.feeTiers.map(t => t.name),
    });
  }

  /**
   * Get the fee recipient address
   */
  getFeeRecipient(): Address {
    return this.feeRecipient;
  }

  /**
   * Calculate fee for a payment amount
   */
  calculateFee(
    grossAmount: bigint,
    payer?: Address,
    decimals: number = 6
  ): FeeCalculation {
    const tier = this.getTierForPayer(payer);
    
    // Calculate fee: amount * basisPoints / 10000
    let feeAmount = (grossAmount * BigInt(tier.basisPoints)) / 10000n;
    
    // Apply minimum fee
    if (feeAmount < MINIMUM_FEE && grossAmount > MINIMUM_FEE) {
      feeAmount = MINIMUM_FEE;
    }
    
    // Ensure fee doesn't exceed a reasonable maximum (1%)
    const maxFee = grossAmount / 100n;
    if (feeAmount > maxFee) {
      feeAmount = maxFee;
    }

    const netAmount = grossAmount - feeAmount;

    return {
      grossAmount,
      feeAmount,
      netAmount,
      feePercent: tier.basisPoints / 100,
      tierName: tier.name,
    };
  }

  /**
   * Get the fee tier for a payer based on their monthly volume
   */
  private getTierForPayer(payer?: Address): FeeTier {
    if (!payer) {
      return this.feeTiers[this.feeTiers.length - 1]; // Standard tier
    }

    const volume = this.getMonthlyVolume(payer);
    
    for (const tier of this.feeTiers) {
      if (volume >= tier.minMonthlyVolume) {
        return tier;
      }
    }
    
    return this.feeTiers[this.feeTiers.length - 1];
  }

  /**
   * Get monthly volume for a payer
   */
  getMonthlyVolume(payer: Address): bigint {
    const key = payer.toLowerCase();
    const tracker = this.volumeByPayer.get(key);
    
    if (!tracker) return 0n;
    
    // Check if we're still in the same month
    const now = Date.now();
    const monthStart = this.getMonthStart(now);
    
    if (tracker.monthStart !== monthStart) {
      // Reset for new month
      this.volumeByPayer.set(key, { volume: 0n, monthStart });
      return 0n;
    }
    
    return tracker.volume;
  }

  /**
   * Record a fee for tracking and later settlement
   */
  recordFee(params: {
    paymentId: string;
    payer: Address;
    payee: Address;
    grossAmount: bigint;
    feeAmount: bigint;
    network: string;
    token: string;
    txHash?: string;
    decimals?: number;
  }): FeeRecord {
    const decimals = params.decimals || 6;
    const netAmount = params.grossAmount - params.feeAmount;
    const feePercent = Number(params.feeAmount * 10000n / params.grossAmount) / 100;

    const record: FeeRecord = {
      id: `fee_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      paymentId: params.paymentId,
      payer: params.payer,
      payee: params.payee,
      grossAmount: formatUnits(params.grossAmount, decimals),
      feeAmount: formatUnits(params.feeAmount, decimals),
      netAmount: formatUnits(netAmount, decimals),
      feePercent,
      network: params.network,
      token: params.token,
      timestamp: Date.now(),
      txHash: params.txHash,
      settled: false,
    };

    this.feeRecords.push(record);
    this.totalFeesCollected += params.feeAmount;
    this.totalVolumeProcessed += params.grossAmount;

    // Update payer volume for tier calculation
    this.updatePayerVolume(params.payer, params.grossAmount);

    logger.info('Fee recorded', {
      paymentId: params.paymentId,
      feeAmount: record.feeAmount,
      feePercent: record.feePercent,
      tierName: this.getTierForPayer(params.payer).name,
    });

    return record;
  }

  /**
   * Update payer's monthly volume
   */
  private updatePayerVolume(payer: Address, amount: bigint): void {
    const key = payer.toLowerCase();
    const monthStart = this.getMonthStart(Date.now());
    
    const existing = this.volumeByPayer.get(key);
    
    if (existing && existing.monthStart === monthStart) {
      existing.volume += amount;
    } else {
      this.volumeByPayer.set(key, { volume: amount, monthStart });
    }
  }

  /**
   * Get month start timestamp
   */
  private getMonthStart(timestamp: number): number {
    const date = new Date(timestamp);
    return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  }

  /**
   * Get unsettled fees
   */
  getUnsettledFees(): FeeRecord[] {
    return this.feeRecords.filter(r => !r.settled);
  }

  /**
   * Mark fees as settled
   */
  markSettled(feeIds: string[], txHash: string): void {
    for (const record of this.feeRecords) {
      if (feeIds.includes(record.id)) {
        record.settled = true;
        record.txHash = txHash;
      }
    }
  }

  /**
   * Get fee statistics
   */
  getStats(): {
    totalFeesCollected: string;
    totalVolumeProcessed: string;
    feeRecordCount: number;
    unsettledCount: number;
    averageFeePercent: number;
    volumeByNetwork: Record<string, string>;
    volumeByToken: Record<string, string>;
  } {
    const volumeByNetwork: Record<string, bigint> = {};
    const volumeByToken: Record<string, bigint> = {};
    let totalFeePercent = 0;

    for (const record of this.feeRecords) {
      const gross = parseUnits(record.grossAmount, 6);
      volumeByNetwork[record.network] = (volumeByNetwork[record.network] || 0n) + gross;
      volumeByToken[record.token] = (volumeByToken[record.token] || 0n) + gross;
      totalFeePercent += record.feePercent;
    }

    return {
      totalFeesCollected: formatUnits(this.totalFeesCollected, 6),
      totalVolumeProcessed: formatUnits(this.totalVolumeProcessed, 6),
      feeRecordCount: this.feeRecords.length,
      unsettledCount: this.getUnsettledFees().length,
      averageFeePercent: this.feeRecords.length > 0 
        ? totalFeePercent / this.feeRecords.length 
        : 0.1,
      volumeByNetwork: Object.fromEntries(
        Object.entries(volumeByNetwork).map(([k, v]) => [k, formatUnits(v, 6)])
      ),
      volumeByToken: Object.fromEntries(
        Object.entries(volumeByToken).map(([k, v]) => [k, formatUnits(v, 6)])
      ),
    };
  }

  /**
   * Get recent fee records
   */
  getRecentFees(limit: number = 100): FeeRecord[] {
    return this.feeRecords.slice(-limit).reverse();
  }

  /**
   * Get tier info for a payer
   */
  getTierInfo(payer: Address): {
    currentTier: FeeTier;
    volume: string;
    nextTier?: FeeTier;
    volumeToNextTier?: string;
  } {
    const volume = this.getMonthlyVolume(payer);
    const currentTier = this.getTierForPayer(payer);
    
    // Find next tier
    const currentIndex = this.feeTiers.findIndex(t => t.name === currentTier.name);
    const nextTier = currentIndex > 0 ? this.feeTiers[currentIndex - 1] : undefined;
    
    return {
      currentTier,
      volume: formatUnits(volume, 6),
      nextTier,
      volumeToNextTier: nextTier 
        ? formatUnits(nextTier.minMonthlyVolume - volume, 6)
        : undefined,
    };
  }
}

/**
 * Create a fee service instance
 */
export function createFeeService(config: {
  feeRecipient: Address;
  feeTiers?: FeeTier[];
}): FeeService {
  return new FeeService(config);
}
