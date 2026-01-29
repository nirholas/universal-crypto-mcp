/**
 * PumpFun New Token Monitor
 * 
 * Monitors for new token launches on PumpFun via WebSocket.
 */

import { Connection, PublicKey } from '@solana/web3.js';
import type {
  NewPumpFunToken,
  TradingEngineConfig,
} from '../types.js';
import { PUMPFUN_PROGRAM_IDS } from '../types.js';

/**
 * PumpFun Monitor for new token launches
 */
export class PumpFunMonitor {
  private readonly connection: Connection;
  private readonly wsConnection: Connection;
  private readonly programId: PublicKey;
  private subscriptionId: number | null = null;
  private callbacks: Set<(token: NewPumpFunToken) => void> = new Set();
  private isRunning = false;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    // Use WebSocket endpoint for subscriptions
    const wsEndpoint = config.wsEndpoint ?? config.rpcEndpoint.replace('https', 'wss');
    this.wsConnection = new Connection(wsEndpoint, {
      commitment: 'confirmed',
      wsEndpoint,
    });
    this.programId = new PublicKey(PUMPFUN_PROGRAM_IDS.PROGRAM);
  }

  /**
   * Subscribe to new token events
   * Returns an unsubscribe function
   */
  subscribeToNewTokens(callback: (token: NewPumpFunToken) => void): () => void {
    this.callbacks.add(callback);

    // Start monitoring if not already running
    if (!this.isRunning) {
      this.startMonitoring();
    }

    // Return unsubscribe function
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
  private async startMonitoring(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      // Subscribe to program account changes
      this.subscriptionId = this.wsConnection.onLogs(
        this.programId,
        async (logs) => {
          // Look for token creation logs
          if (this.isCreateTokenLog(logs.logs)) {
            try {
              const tokenInfo = await this.parseCreateTokenEvent(logs.signature);
              if (tokenInfo) {
                this.notifyCallbacks(tokenInfo);
              }
            } catch (error) {
              console.error('Error parsing token create event:', error);
            }
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
   * Check if log contains token creation
   */
  private isCreateTokenLog(logMessages: string[]): boolean {
    return logMessages.some(log => 
      log.includes('Instruction: Create') ||
      log.includes('Program log: Instruction: Create')
    );
  }

  /**
   * Parse token creation event from transaction logs
   */
  private async parseCreateTokenEvent(
    signature: string
  ): Promise<NewPumpFunToken | null> {
    try {
      // Fetch the full transaction to get account data
      const tx = await this.connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx || !tx.meta) return null;

      // Find the token mint from the transaction
      const accounts = tx.transaction.message.accountKeys;
      
      // Look for the mint account (usually the 2nd account in create instruction)
      let mint: string | null = null;
      let creator: string | null = null;
      let bondingCurve: string | null = null;

      // Parse inner instructions to find the mint
      const innerInstructions = tx.meta.innerInstructions || [];
      for (const inner of innerInstructions) {
        for (const ix of inner.instructions) {
          if ('parsed' in ix && ix.parsed?.type === 'initializeMint') {
            mint = ix.parsed.info.mint;
          }
        }
      }

      // Get creator from first account (fee payer)
      if (accounts.length > 0 && accounts[0]) {
        creator = accounts[0].pubkey.toBase58();
      }

      // Calculate bonding curve PDA
      if (mint) {
        const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('bonding-curve'), new PublicKey(mint).toBuffer()],
          this.programId
        );
        bondingCurve = bondingCurvePDA.toBase58();
      }

      if (!mint || !creator || !bondingCurve) return null;

      // Try to fetch token metadata
      let name = 'Unknown';
      let symbol = 'UNKNOWN';

      try {
        // Fetch from PumpFun API
        const response = await fetch(`https://frontend-api.pump.fun/coins/${mint}`);
        if (response.ok) {
          const data = await response.json() as { name?: string; symbol?: string };
          name = data.name ?? name;
          symbol = data.symbol ?? symbol;
        }
      } catch {
        // Metadata fetch failed, use defaults
      }

      return {
        mint,
        name,
        symbol,
        creator,
        bondingCurve,
        signature,
        timestamp: tx.blockTime ?? Math.floor(Date.now() / 1000),
        initialMarketCapSol: 0, // Would need to calculate from initial reserves
      };
    } catch (error) {
      console.error('Error parsing create token event:', error);
      return null;
    }
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
   * Get recent token launches (from API)
   */
  async getRecentTokens(limit: number = 50): Promise<NewPumpFunToken[]> {
    try {
      const response = await fetch(
        `https://frontend-api.pump.fun/coins?offset=0&limit=${limit}&sort=created_timestamp&order=DESC`
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json() as Array<{
        mint: string;
        name: string;
        symbol: string;
        creator: string;
        bonding_curve: string;
        created_timestamp: number;
        market_cap: number;
      }>;

      return data.map(token => ({
        mint: token.mint,
        name: token.name,
        symbol: token.symbol,
        creator: token.creator,
        bondingCurve: token.bonding_curve,
        signature: '', // Not available from API
        timestamp: token.created_timestamp,
        initialMarketCapSol: token.market_cap / 1e9, // Convert lamports to SOL
      }));
    } catch (error) {
      console.error('Error fetching recent tokens:', error);
      return [];
    }
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
