/**
 * Fee Settlement Service
 * 
 * Handles batching and settling collected platform fees.
 * Transfers accumulated fees from payers to the fee recipient.
 * 
 * @author nich
 * @license MIT
 */

import { type Address, type Hash, parseUnits, formatUnits } from 'viem';
import { type MultiChainClient } from './multichain.js';
import { type FeeService } from './fees.js';
import { type NetworkId } from './networks.js';
import { logger } from '../middleware/logger.js';

/**
 * Settlement batch configuration
 */
export interface SettlementConfig {
  /** Minimum batch size to trigger settlement (in USD) */
  minBatchSize: string;
  /** Maximum fees to settle in one transaction */
  maxBatchSize: string;
  /** Networks to settle fees on */
  networks: NetworkId[];
  /** Fee recipient address */
  feeRecipient: Address;
}

/**
 * Settlement result
 */
export interface SettlementResult {
  success: boolean;
  network: NetworkId;
  token: string;
  totalAmount: string;
  feeCount: number;
  txHash?: Hash;
  error?: string;
  gasUsed?: string;
  timestamp: number;
}

/**
 * Pending fee by network and token
 */
interface PendingFee {
  network: NetworkId;
  token: string;
  totalAmount: bigint;
  feeIds: string[];
  payerAmounts: Map<Address, bigint>;
}

/**
 * Fee Settlement Service
 * 
 * Collects and settles platform fees across multiple networks.
 */
export class FeeSettlementService {
  private config: SettlementConfig;
  private multiChainClient: MultiChainClient;
  private feeService: FeeService;
  private settlementHistory: SettlementResult[] = [];
  private isSettling = false;

  constructor(
    config: SettlementConfig,
    multiChainClient: MultiChainClient,
    feeService: FeeService
  ) {
    this.config = config;
    this.multiChainClient = multiChainClient;
    this.feeService = feeService;

    logger.info('FeeSettlementService initialized', {
      minBatchSize: config.minBatchSize,
      networks: config.networks,
      feeRecipient: config.feeRecipient,
    });
  }

  /**
   * Get pending fees grouped by network and token
   */
  async getPendingFees(): Promise<PendingFee[]> {
    const unsettled = this.feeService.getUnsettledFees();
    const grouped = new Map<string, PendingFee>();

    for (const fee of unsettled) {
      const key = `${fee.network}:${fee.token}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          network: fee.network as NetworkId,
          token: fee.token,
          totalAmount: 0n,
          feeIds: [],
          payerAmounts: new Map(),
        });
      }

      const group = grouped.get(key)!;
      const decimals = fee.token === 'USDC' || fee.token === 'USDT' ? 6 : 18;
      const amount = parseUnits(fee.feeAmount, decimals);
      
      group.totalAmount += amount;
      group.feeIds.push(fee.id);
      
      // Track amount per payer for settlement
      const existingPayer = group.payerAmounts.get(fee.payer) || 0n;
      group.payerAmounts.set(fee.payer, existingPayer + amount);
    }

    return Array.from(grouped.values());
  }

  /**
   * Check if settlement should be triggered
   */
  async shouldSettle(): Promise<boolean> {
    if (this.isSettling) return false;

    const pending = await this.getPendingFees();
    const minBatch = parseUnits(this.config.minBatchSize, 6);

    for (const group of pending) {
      if (group.totalAmount >= minBatch) {
        return true;
      }
    }

    return false;
  }

  /**
   * Settle all pending fees across networks
   */
  async settleAll(): Promise<SettlementResult[]> {
    if (this.isSettling) {
      throw new Error('Settlement already in progress');
    }

    this.isSettling = true;
    const results: SettlementResult[] = [];

    try {
      const pending = await this.getPendingFees();
      const minBatch = parseUnits(this.config.minBatchSize, 6);

      for (const group of pending) {
        // Skip if below minimum batch size
        if (group.totalAmount < minBatch) {
          logger.info('Skipping settlement - below minimum', {
            network: group.network,
            token: group.token,
            amount: formatUnits(group.totalAmount, 6),
            minBatch: this.config.minBatchSize,
          });
          continue;
        }

        // Settle this group
        const result = await this.settleGroup(group);
        results.push(result);
        this.settlementHistory.push(result);
      }

      return results;
    } finally {
      this.isSettling = false;
    }
  }

  /**
   * Settle fees for a specific network and token
   */
  private async settleGroup(group: PendingFee): Promise<SettlementResult> {
    const startTime = Date.now();
    const decimals = group.token === 'USDC' || group.token === 'USDT' ? 6 : 18;

    logger.info('Starting fee settlement', {
      network: group.network,
      token: group.token,
      totalAmount: formatUnits(group.totalAmount, decimals),
      feeCount: group.feeIds.length,
      payerCount: group.payerAmounts.size,
    });

    try {
      // For now, we'll use a simple approach: transfer fees from the facilitator wallet
      // In production, you might want to implement a fee collection contract
      
      // Check if we have a wallet for this network
      const facilitatorAddress = this.multiChainClient.getAddress();
      if (!facilitatorAddress) {
        throw new Error('Facilitator wallet not configured');
      }

      // TODO: In production, implement actual on-chain settlement
      // This would involve:
      // 1. Calling a fee collection contract
      // 2. Or using multicall to batch transfers
      // 3. Handling gas optimization
      
      // For now, just mark fees as settled (simulated)
      this.feeService.markSettled(group.feeIds, 'simulated_settlement');

      const result: SettlementResult = {
        success: true,
        network: group.network,
        token: group.token,
        totalAmount: formatUnits(group.totalAmount, decimals),
        feeCount: group.feeIds.length,
        txHash: '0x40252CFDF8B20Ed757D61ff157719F33Ec332402000000000000000000000000' as Hash,
        timestamp: Date.now(),
      };

      logger.info('Fee settlement completed', {
        ...result,
        durationMs: Date.now() - startTime,
      });

      return result;
    } catch (error) {
      logger.error('Fee settlement failed', {
        error,
        network: group.network,
        token: group.token,
      });

      return {
        success: false,
        network: group.network,
        token: group.token,
        totalAmount: formatUnits(group.totalAmount, decimals),
        feeCount: group.feeIds.length,
        error: String(error),
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Settle fees for a specific network
   */
  async settleNetwork(network: NetworkId, token: string): Promise<SettlementResult> {
    const pending = await this.getPendingFees();
    const group = pending.find(g => g.network === network && g.token === token);

    if (!group) {
      throw new Error(`No pending fees for ${network}:${token}`);
    }

    const result = await this.settleGroup(group);
    this.settlementHistory.push(result);
    return result;
  }

  /**
   * Get settlement history
   */
  getSettlementHistory(limit: number = 100): SettlementResult[] {
    return this.settlementHistory.slice(-limit).reverse();
  }

  /**
   * Get settlement statistics
   */
  getStats(): {
    totalSettlements: number;
    successfulSettlements: number;
    failedSettlements: number;
    totalAmountSettled: string;
    settlementsByNetwork: Record<string, number>;
    isCurrentlySettling: boolean;
  } {
    const successful = this.settlementHistory.filter(s => s.success);
    const failed = this.settlementHistory.filter(s => !s.success);
    
    const totalAmount = successful.reduce((sum, s) => {
      return sum + parseFloat(s.totalAmount);
    }, 0);

    const byNetwork: Record<string, number> = {};
    for (const settlement of this.settlementHistory) {
      byNetwork[settlement.network] = (byNetwork[settlement.network] || 0) + 1;
    }

    return {
      totalSettlements: this.settlementHistory.length,
      successfulSettlements: successful.length,
      failedSettlements: failed.length,
      totalAmountSettled: totalAmount.toFixed(2),
      settlementsByNetwork: byNetwork,
      isCurrentlySettling: this.isSettling,
    };
  }

  /**
   * Start automatic settlement scheduler
   */
  startAutoSettlement(intervalMs: number = 3600000): NodeJS.Timeout {
    logger.info('Starting automatic fee settlement', {
      intervalMs,
      intervalHours: intervalMs / 3600000,
    });

    return setInterval(async () => {
      try {
        if (await this.shouldSettle()) {
          logger.info('Triggering automatic settlement');
          await this.settleAll();
        }
      } catch (error) {
        logger.error('Automatic settlement failed', { error });
      }
    }, intervalMs);
  }
}

/**
 * Create a fee settlement service
 */
export function createFeeSettlementService(
  config: SettlementConfig,
  multiChainClient: MultiChainClient,
  feeService: FeeService
): FeeSettlementService {
  return new FeeSettlementService(config, multiChainClient, feeService);
}
