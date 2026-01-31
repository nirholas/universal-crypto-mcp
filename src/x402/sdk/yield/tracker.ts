/**
 * @fileoverview USDs Yield Tracker
 * @copyright Copyright (c) 2024-2026 nirholas
 * @license MIT
 */

import type { Address, PublicClient } from 'viem';
import { formatUnits } from 'viem';
import type { YieldInfo, YieldEstimate, YieldHistoryEntry, X402Chain } from '../types';
import { X402Error, X402ErrorCode } from '../types';
import { SPERAX_USD_ADDRESS, USDS_ABI, DEFAULTS } from '../constants';

/**
 * USDs yield tracking utilities
 * Tracks auto-yield earnings from Sperax USD
 */
export class YieldTracker {
  private readonly usdsAddress: Address;
  #chain: X402Chain;

  constructor(
    private readonly publicClient: PublicClient,
    chain: X402Chain
  ) {
    // Only Arbitrum supports USDs
    if (chain !== 'arbitrum' && chain !== 'arbitrum-sepolia') {
      throw new X402Error(
        'USDs yield tracking is only available on Arbitrum',
        X402ErrorCode.UNSUPPORTED_CHAIN
      );
    }
    this.#chain = chain;
    this.usdsAddress = SPERAX_USD_ADDRESS;
  }

  /**
   * Get the chain this tracker is configured for
   */
  get chain(): X402Chain {
    return this.#chain;
  }

  /**
   * Get comprehensive yield information for an address
   */
  async getYieldInfo(address: Address): Promise<YieldInfo> {
    // Get current balance
    const balance = await this.publicClient.readContract({
      address: this.usdsAddress,
      abi: USDS_ABI,
      functionName: 'balanceOf',
      args: [address],
    }) as bigint;

    // Check if rebasing is enabled
    let rebasingEnabled = true;
    try {
      rebasingEnabled = await this.publicClient.readContract({
        address: this.usdsAddress,
        abi: USDS_ABI,
        functionName: 'isRebaseEnabled',
        args: [address],
      }) as boolean;
    } catch {
      // Method might not exist in all versions
      rebasingEnabled = true;
    }

    // Get current APY (estimated)
    const currentAPY = await this.getCurrentAPY();

    // Calculate total yield (would need historical data for accuracy)
    // For now, return 0 as placeholder
    const totalYield = '0';

    return {
      balance: balance.toString(),
      formattedBalance: formatUnits(balance, 18),
      totalYield,
      currentAPY: currentAPY.toString(),
      rebasingEnabled,
    };
  }

  /**
   * Get current APY from Sperax protocol
   * Queries the Sperax API and falls back to on-chain calculation
   */
  async getCurrentAPY(): Promise<number> {
    // Try fetching from Sperax API first
    try {
      const response = await fetch('https://api.sperax.io/v1/usds/apy', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json() as { apy?: number; apr?: number };
        if (typeof data.apy === 'number') {
          return data.apy;
        }
        if (typeof data.apr === 'number') {
          // Convert APR to APY with daily compounding
          return (Math.pow(1 + data.apr / 100 / 365, 365) - 1) * 100;
        }
      }
    } catch {
      // API unavailable, try on-chain calculation
    }

    // Fallback: Calculate from recent rebase events on-chain
    try {
      const apy = await this.calculateAPYFromRebaseEvents();
      if (apy > 0) return apy;
    } catch {
      // Rebase calculation failed
    }

    // Final fallback: Return default APY
    return DEFAULTS.USDS_APY;
  }

  /**
   * Calculate APY from recent on-chain rebase events
   * Uses Transfer events from the null address to detect rebases
   */
  private async calculateAPYFromRebaseEvents(): Promise<number> {
    const currentBlock = await this.publicClient.getBlockNumber();
    const blocksPerDay = 7_200n; // ~12 seconds per block on Arbitrum
    const lookbackBlocks = blocksPerDay * 7n; // 7 days of data
    
    const fromBlock = currentBlock > lookbackBlocks ? currentBlock - lookbackBlocks : 0n;

    // Query total supply changes by looking at rebase-related events
    const logs = await this.publicClient.getLogs({
      address: this.usdsAddress,
      event: {
        type: 'event',
        name: 'TotalSupplyUpdatedHighres',
        inputs: [
          { name: 'totalSupply', type: 'uint256', indexed: false },
          { name: 'rebasingCredits', type: 'uint256', indexed: false },
          { name: 'rebasingCreditsPerToken', type: 'uint256', indexed: false },
        ],
      },
      fromBlock,
      toBlock: currentBlock,
    });

    if (logs.length < 2) {
      // Not enough data, return default
      return DEFAULTS.USDS_APY;
    }

    // Calculate APY from supply growth
    const firstLog = logs[0];
    const lastLog = logs[logs.length - 1];
    
    const firstSupply = (firstLog.args as { totalSupply: bigint }).totalSupply;
    const lastSupply = (lastLog.args as { totalSupply: bigint }).totalSupply;
    
    if (!firstSupply || !lastSupply || firstSupply === 0n) {
      return DEFAULTS.USDS_APY;
    }

    // Get timestamps for these blocks
    const [firstBlock, lastBlock] = await Promise.all([
      this.publicClient.getBlock({ blockNumber: firstLog.blockNumber }),
      this.publicClient.getBlock({ blockNumber: lastLog.blockNumber }),
    ]);

    const timeElapsedSeconds = Number(lastBlock.timestamp - firstBlock.timestamp);
    if (timeElapsedSeconds <= 0) return DEFAULTS.USDS_APY;

    // Calculate growth rate
    const growthRate = Number(lastSupply - firstSupply) / Number(firstSupply);
    
    // Annualize: (1 + periodRate)^(periods per year) - 1
    const secondsPerYear = 365.25 * 24 * 60 * 60;
    const periodsPerYear = secondsPerYear / timeElapsedSeconds;
    const apy = (Math.pow(1 + growthRate, periodsPerYear) - 1) * 100;

    // Sanity check: APY should be reasonable (0-50%)
    if (apy >= 0 && apy <= 50) {
      return parseFloat(apy.toFixed(4));
    }

    return DEFAULTS.USDS_APY;
  }

  /**
   * Estimate yield over time based on current balance and APY
   */
  async estimateYield(
    address: Address,
    apy?: number
  ): Promise<YieldEstimate> {
    const balance = await this.publicClient.readContract({
      address: this.usdsAddress,
      abi: USDS_ABI,
      functionName: 'balanceOf',
      args: [address],
    }) as bigint;

    const currentAPY = apy ?? await this.getCurrentAPY();
    const balanceNum = parseFloat(formatUnits(balance, 18));

    return this.calculateYieldEstimate(balanceNum, currentAPY);
  }

  /**
   * Calculate yield estimates for a given balance and APY
   */
  calculateYieldEstimate(balance: number, apy: number): YieldEstimate {
    const apyDecimal = apy / 100;

    // Daily yield (APY / 365)
    const dailyRate = apyDecimal / 365;
    const daily = balance * dailyRate;

    // Weekly yield
    const weekly = daily * 7;

    // Monthly yield (approximate)
    const monthly = daily * 30;

    // Annual yield
    const annual = balance * apyDecimal;

    return {
      daily: daily.toFixed(6),
      weekly: weekly.toFixed(6),
      monthly: monthly.toFixed(6),
      annual: annual.toFixed(6),
      apy: apy.toString(),
    };
  }

  /**
   * Get USDs balance for an address
   */
  async getBalance(address: Address): Promise<{ raw: bigint; formatted: string }> {
    const balance = await this.publicClient.readContract({
      address: this.usdsAddress,
      abi: USDS_ABI,
      functionName: 'balanceOf',
      args: [address],
    }) as bigint;

    return {
      raw: balance,
      formatted: formatUnits(balance, 18),
    };
  }

  /**
   * Check if rebasing is enabled for an address
   */
  async isRebasingEnabled(address: Address): Promise<boolean> {
    try {
      return await this.publicClient.readContract({
        address: this.usdsAddress,
        abi: USDS_ABI,
        functionName: 'isRebaseEnabled',
        args: [address],
      }) as boolean;
    } catch {
      // If method doesn't exist, assume enabled
      return true;
    }
  }

  /**
   * Get rebase credits per token (for yield calculation)
   */
  async getRebasingCreditsPerToken(): Promise<bigint> {
    try {
      return await this.publicClient.readContract({
        address: this.usdsAddress,
        abi: USDS_ABI,
        functionName: 'rebasingCreditsPerToken',
        args: [],
      }) as bigint;
    } catch {
      return BigInt(1e18); // Default
    }
  }

  /**
   * Get yield history from on-chain Transfer events
   * Tracks balance changes and calculates yield between snapshots
   */
  async getYieldHistory(
    address: Address,
    fromBlock?: number,
    toBlock?: number
  ): Promise<YieldHistoryEntry[]> {
    const currentBlockNumber = await this.publicClient.getBlockNumber();
    const blocksPerDay = 7_200n; // ~12 seconds per block on Arbitrum
    
    const endBlock = toBlock ? BigInt(toBlock) : currentBlockNumber;
    const startBlock = fromBlock 
      ? BigInt(fromBlock) 
      : (endBlock > blocksPerDay * 30n ? endBlock - blocksPerDay * 30n : 0n); // 30 days default

    // Get all Transfer events for this address
    const [incomingLogs, outgoingLogs] = await Promise.all([
      // Incoming transfers (received)
      this.publicClient.getLogs({
        address: this.usdsAddress,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
        args: { to: address },
        fromBlock: startBlock,
        toBlock: endBlock,
      }),
      // Outgoing transfers (sent)
      this.publicClient.getLogs({
        address: this.usdsAddress,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false },
          ],
        },
        args: { from: address },
        fromBlock: startBlock,
        toBlock: endBlock,
      }),
    ]);

    // Combine and sort by block number
    const allEvents = [
      ...incomingLogs.map(log => ({
        blockNumber: log.blockNumber,
        type: 'in' as const,
        value: (log.args as { value: bigint }).value,
        from: (log.args as { from: Address }).from,
      })),
      ...outgoingLogs.map(log => ({
        blockNumber: log.blockNumber,
        type: 'out' as const,
        value: (log.args as { value: bigint }).value,
        to: (log.args as { to: Address }).to,
      })),
    ].sort((a, b) => Number(a.blockNumber - b.blockNumber));

    if (allEvents.length === 0) {
      // No events, get current balance
      const currentBalance = await this.getBalance(address);
      return [{
        timestamp: Math.floor(Date.now() / 1000),
        balance: currentBalance.formatted,
        yieldEarned: '0',
        blockNumber: Number(currentBlockNumber),
      }];
    }

    // Get unique block numbers and fetch timestamps
    const uniqueBlocks = [...new Set(allEvents.map(e => e.blockNumber))];
    uniqueBlocks.push(currentBlockNumber); // Add current block
    
    const blockTimestamps = new Map<bigint, number>();
    
    // Fetch timestamps in batches of 10
    for (let i = 0; i < uniqueBlocks.length; i += 10) {
      const batch = uniqueBlocks.slice(i, i + 10);
      const blocks = await Promise.all(
        batch.map(bn => this.publicClient.getBlock({ blockNumber: bn }))
      );
      blocks.forEach((block, idx) => {
        blockTimestamps.set(batch[idx], Number(block.timestamp));
      });
    }

    // Calculate running balance and yield
    const entries: YieldHistoryEntry[] = [];
    let runningBalance = 0;
    let totalDeposits = 0;
    let previousBalance = 0;

    for (const event of allEvents) {
      const valueNum = parseFloat(formatUnits(event.value, 18));
      const timestamp = blockTimestamps.get(event.blockNumber) || Math.floor(Date.now() / 1000);
      
      if (event.type === 'in') {
        // Check if this is from null address (rebase/mint)
        const isRebase = event.from === '0x40252CFDF8B20Ed757D61ff157719F33Ec332402';
        
        if (isRebase) {
          // This is yield earned from rebase
          runningBalance += valueNum;
        } else {
          // This is a deposit
          runningBalance += valueNum;
          totalDeposits += valueNum;
        }
      } else {
        // Outgoing transfer
        runningBalance -= valueNum;
        totalDeposits -= valueNum; // Withdrawal reduces deposits
      }

      // Calculate yield earned at this point
      const yieldEarned = runningBalance - totalDeposits;

      entries.push({
        timestamp,
        balance: runningBalance.toFixed(6),
        yieldEarned: yieldEarned > 0 ? yieldEarned.toFixed(6) : '0',
        blockNumber: Number(event.blockNumber),
      });

      previousBalance = runningBalance;
    }

    // Add current state
    const currentBalance = await this.getBalance(address);
    const currentTimestamp = blockTimestamps.get(currentBlockNumber) || Math.floor(Date.now() / 1000);
    const currentBalanceNum = parseFloat(currentBalance.formatted);
    const finalYield = currentBalanceNum - totalDeposits;

    entries.push({
      timestamp: currentTimestamp,
      balance: currentBalance.formatted,
      yieldEarned: finalYield > 0 ? finalYield.toFixed(6) : '0',
      blockNumber: Number(currentBlockNumber),
    });

    return entries;
  }

  /**
   * Calculate yield earned between two balances
   * Accounts for deposits/withdrawals
   */
  calculateYieldEarned(
    startBalance: string,
    endBalance: string,
    netDeposits: string
  ): string {
    const start = parseFloat(startBalance);
    const end = parseFloat(endBalance);
    const deposits = parseFloat(netDeposits);

    // Yield = End Balance - Start Balance - Net Deposits
    const yieldEarned = end - start - deposits;
    return yieldEarned > 0 ? yieldEarned.toFixed(6) : '0';
  }

  /**
   * Estimate time to reach target balance through yield
   */
  estimateTimeToTarget(
    currentBalance: number,
    targetBalance: number,
    apy: number
  ): { days: number; months: number; years: number } | null {
    if (currentBalance >= targetBalance || currentBalance <= 0 || apy <= 0) {
      return null;
    }

    const apyDecimal = apy / 100;
    const growthFactor = targetBalance / currentBalance;
    
    // Time = ln(target/current) / ln(1 + apy) for compound interest
    // Using simple interest approximation for daily compounding
    const yearsNeeded = Math.log(growthFactor) / Math.log(1 + apyDecimal);
    const daysNeeded = yearsNeeded * 365;
    const monthsNeeded = yearsNeeded * 12;

    return {
      days: Math.ceil(daysNeeded),
      months: Math.ceil(monthsNeeded),
      years: parseFloat(yearsNeeded.toFixed(2)),
    };
  }
}
