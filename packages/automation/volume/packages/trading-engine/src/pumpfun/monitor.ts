/**
 * PumpFun New Token Monitor
 *
 * Watches the pump program's logs over WebSocket and decodes every
 * `CreateEvent` it emits (from `create` and the Token-2022 `create_v2`) with
 * the official SDK decoder. The event carries the mint, curve, creator,
 * quote mint and opening reserves, so no transaction fetch is needed.
 */

import { Connection, PublicKey } from '@solana/web3.js';
import {
  PUMP_PROGRAM_ID,
  PUMP_SDK,
  bondingCurveMarketCap,
  normalizeQuoteMint,
  pumpIdl,
  type CreateEventBc,
} from '@pump-fun/pump-sdk';
import type { MintInfoCache } from './mints.js';
import type {
  NewPumpFunToken,
  TradingEngineConfig,
} from '../types.js';

/** pump.fun coin listing endpoint */
const PUMP_FUN_COINS_API = 'https://frontend-api-v3.pump.fun/coins';

const PROGRAM_DATA_PREFIX = 'Program data: ';

const CREATE_EVENT_DISCRIMINATOR = Buffer.from(
  pumpIdl.events.find(event => event.name === 'CreateEvent')?.discriminator ?? []
);

interface PumpFunAPIListedCoin {
  mint: string;
  name: string;
  symbol: string;
  creator: string;
  bonding_curve: string;
  created_timestamp: number;
  quote_mint?: string;
  market_cap?: number;
  market_cap_quote?: number;
}

/**
 * PumpFun Monitor for new token launches
 */
export class PumpFunMonitor {
  private readonly wsConnection: Connection;
  private subscriptionId: number | null = null;
  private callbacks: Set<(token: NewPumpFunToken) => void> = new Set();
  private isRunning = false;

  constructor(
    config: TradingEngineConfig,
    private readonly mints: MintInfoCache
  ) {
    const wsEndpoint = config.wsEndpoint ?? config.rpcEndpoint.replace(/^http/, 'ws');
    this.wsConnection = new Connection(config.rpcEndpoint, {
      commitment: 'confirmed',
      wsEndpoint,
    });
  }

  /**
   * Subscribe to new token events
   * Returns an unsubscribe function
   */
  subscribeToNewTokens(callback: (token: NewPumpFunToken) => void): () => void {
    this.callbacks.add(callback);

    if (!this.isRunning) {
      this.startMonitoring();
    }

    return () => {
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) {
        this.stopMonitoring();
      }
    };
  }

  /**
   * Start monitoring for new tokens
   */
  private startMonitoring(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      this.subscriptionId = this.wsConnection.onLogs(
        PUMP_PROGRAM_ID,
        async (logs) => {
          if (logs.err) return;
          try {
            for (const event of decodeCreateEvents(logs.logs)) {
              this.notifyCallbacks(await this.toNewToken(event, logs.signature));
            }
          } catch (error) {
            console.error('Error reading new pump token:', error);
          }
        },
        'confirmed'
      );
    } catch (error) {
      console.error('Failed to start PumpFun monitor:', error);
      this.isRunning = false;
    }
  }

  /**
   * Stop monitoring
   */
  private async stopMonitoring(): Promise<void> {
    if (!this.isRunning || this.subscriptionId === null) return;

    try {
      await this.wsConnection.removeOnLogsListener(this.subscriptionId);
    } catch (error) {
      console.error('Error removing logs listener:', error);
    }

    this.subscriptionId = null;
    this.isRunning = false;
  }

  /**
   * New-token record from a decoded `CreateEvent`, with the opening market
   * cap in quote mint units.
   */
  private async toNewToken(event: CreateEventBc, signature: string): Promise<NewPumpFunToken> {
    const quoteMint = normalizeQuoteMint(event.quoteMint);
    const quote = await this.mints.get(quoteMint);
    const marketCap = event.virtualTokenReserves.isZero()
      ? 0
      : Number(
          bondingCurveMarketCap({
            mintSupply: event.tokenTotalSupply,
            virtualQuoteReserves: event.virtualQuoteReserves,
            virtualTokenReserves: event.virtualTokenReserves,
          }).toString()
        ) / Math.pow(10, quote.decimals);

    return {
      mint: event.mint.toBase58(),
      name: event.name,
      symbol: event.symbol,
      creator: event.creator.toBase58(),
      bondingCurve: event.bondingCurve.toBase58(),
      signature,
      timestamp: event.timestamp.toNumber(),
      quoteMint: quoteMint.toBase58(),
      initialMarketCapQuote: marketCap,
    };
  }

  /**
   * Notify all callbacks of new token
   */
  private notifyCallbacks(token: NewPumpFunToken): void {
    for (const callback of this.callbacks) {
      try {
        callback(token);
      } catch (error) {
        console.error('Error in new token callback:', error);
      }
    }
  }

  /**
   * Most recent launches from the pump.fun coin listing
   */
  async getRecentTokens(limit: number = 50): Promise<NewPumpFunToken[]> {
    const url =
      `${PUMP_FUN_COINS_API}?offset=0&limit=${limit}` +
      '&sort=created_timestamp&order=DESC&includeNsfw=false';
    const response = await fetch(url, { headers: { accept: 'application/json' } });
    if (!response.ok) {
      throw new Error(`pump.fun coin listing failed: HTTP ${response.status}`);
    }

    const data = (await response.json()) as PumpFunAPIListedCoin[];
    return data.map(token => ({
      mint: token.mint,
      name: token.name,
      symbol: token.symbol,
      creator: token.creator,
      bondingCurve: token.bonding_curve,
      timestamp: Math.floor(token.created_timestamp / 1000),
      quoteMint: normalizeQuoteMint(
        token.quote_mint ? new PublicKey(token.quote_mint) : null
      ).toBase58(),
      initialMarketCapQuote: token.market_cap_quote ?? token.market_cap ?? 0,
    }));
  }

  /**
   * Check if monitor is running
   */
  isMonitoring(): boolean {
    return this.isRunning;
  }

  /**
   * Get number of active subscriptions
   */
  getSubscriptionCount(): number {
    return this.callbacks.size;
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    await this.stopMonitoring();
    this.callbacks.clear();
  }
}

/**
 * Decode every pump `CreateEvent` in a transaction's logs. Anchor writes
 * events as `Program data: base64(discriminator || borsh body)`.
 */
function decodeCreateEvents(logMessages: string[]): CreateEventBc[] {
  const events: CreateEventBc[] = [];
  for (const line of logMessages) {
    if (!line.startsWith(PROGRAM_DATA_PREFIX)) continue;
    const data = Buffer.from(line.slice(PROGRAM_DATA_PREFIX.length), 'base64');
    if (data.length <= 8 || !data.subarray(0, 8).equals(CREATE_EVENT_DISCRIMINATOR)) continue;
    events.push(PUMP_SDK.decodeCreateEventBc(data.subarray(8)));
  }
  return events;
}
