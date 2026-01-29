/**
 * Pyth Oracle Integration
 * Real-time price feeds from Pyth Network
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { PythHttpClient, getPythProgramKeyForCluster, PriceStatus } from '@pythnetwork/client';
import { PriceData, PriceFeed, OracleSubscription } from '../types.js';
import { logger } from '../utils/logger.js';

// Well-known Pyth price feed IDs (mainnet) - comprehensive list
const PYTH_PRICE_FEEDS: Record<string, string> = {
  // Major Crypto
  'SOL/USD': 'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG',
  'BTC/USD': 'GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU',
  'ETH/USD': 'JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB',
  // Stablecoins
  'USDC/USD': 'Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD',
  'USDT/USD': '3vxLXJqLqF3JG5TCbYycbKWRBbCJQLxQmBGCkyqEEefL',
  'DAI/USD': 'CtJ8EkqLmeYyGB8s4jevpeNsvmD4dxVR2krfsDLcvV8Y',
  'PYUSD/USD': 'HpMoKp3TCd3QT4MWYUKk2zGBwRzaNLd7a2SYVVW1dRz',
  // Memecoins
  'BONK/USD': '8ihFLu5FimgTQ1Unh4dVyEHUGodJ5gJQCrQf4KUVB9bN',
  'WIF/USD': '4Hg5MRBgxJM1K5dpcMxpdjPKwJXLiSrqXbZPMPKFMPAF',
  // DeFi Tokens
  'JUP/USD': 'g6eRCbboSwK4tSWngn773RCMexr1APQr4uA9bGZBYfo',
  'PYTH/USD': 'nrYkQQQur7z8rYTST3G9GqATviK5SxTDkrqd21MW6Ue',
  'RAY/USD': 'AnLf8tVYCM816gmBjiy8n5bQ5DsRFwSeFLXJ2P4T7fAX',
  'ORCA/USD': '4ivThkX8uRxBpHsdWSqyXYihzKF3zpRGAUCqyuagnLoV',
  'MNDE/USD': '4dusJxxxiYrMTLGYS6cCAyu3gPn2xXLBjS7orCTfmjkg',
  // Liquid Staking
  'MSOL/USD': 'E4v1BBgoso9s64TQvmyownAVJbhbEPGyzA3qn4n46qj9',
  'JITOSOL/USD': '7yyaeuJ1GGtVBLT2z2xub5ZWYKaNhF28mj1RdV4VDFVk',
  'BSOL/USD': 'AFrYBhb5wKQtxRS9UA9YRS4V3dwFm7SqmS6DHKq6YVgo',
  // Infrastructure
  'RENDER/USD': 'AB3MMszDxBWdfuqAhGMnQRDPrq9mPuXPRWVqAZiXPVvx',
  'HNT/USD': '4DdmDswskDxXGpwHrXUfn2CNUm9rt21ac79GHNTN3J33',
  // Other L1s
  'AVAX/USD': 'Ax9ujW5B9oqcv59N8m6f1BpTBq2rGeGaBcpKjC5UYsXU',
  'MATIC/USD': '7KVswB9vkCgeM3SHP7aGDijvdRAHK8P5wi9JXViCrtYh',
  'NEAR/USD': 'ECSFWQ1bnnpqPVvoy9237t2wddZAaHisW88mYxuEHKWf',
  'ATOM/USD': 'CrCpTerNqtZvqLcKqz1k13oVeXV9WkMD2zA9hBKXrsbN',
  'DOT/USD': 'EcV1X1gY2yb4KXxjVQtTHTbioum2gvmPnFk4zYAt7zne',
  'LINK/USD': 'ALdkqtyNGj6MFVSkvYJHpU24WPfSqLDLMnzPPM3xgPz7',
  'UNI/USD': '4DZ8T7P1RJMvWvPDRNfWNwHRpvGQhL1pqNdLaLSKpoPs',
  'AAVE/USD': '3wDLxHLkFTqXDLNcq8qhKuC4qYfBq4yLi4AH5XPmgJyM',
  // Forex
  'EUR/USD': 'a995d00bb36a63cef7fd2c287dc105fc8f3d93779f062f09551b0af3e81ec30b',
  'GBP/USD': '84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1',
  'JPY/USD': 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  // Commodities
  'XAU/USD': '765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63c1d82d5a5b31c75e2',
  'XAG/USD': 'f2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e',
  'WTI/USD': 'c7c60099c12805e2f4c9ed1c972a74a3c7a71c2e4ccd30c0c6e9b7ff6f01c3c9',
};

export class PythOracle {
  private pythClient: PythHttpClient;
  private connection: Connection;
  private subscriptions: Map<string, NodeJS.Timeout> = new Map();
  private priceCache: Map<string, PriceData> = new Map();

  constructor(connection: Connection, cluster: 'mainnet-beta' | 'devnet' = 'mainnet-beta') {
    this.connection = connection;
    const pythProgramKey = getPythProgramKeyForCluster(cluster);
    this.pythClient = new PythHttpClient(connection, pythProgramKey);
    
    logger.info('Pyth oracle initialized', { cluster });
  }

  /**
   * Get all available price feeds
   */
  async getAvailableFeeds(): Promise<PriceFeed[]> {
    const feeds: PriceFeed[] = [];
    
    for (const [symbol, address] of Object.entries(PYTH_PRICE_FEEDS)) {
      const [base, quote] = symbol.split('/');
      feeds.push({
        feedAddress: new PublicKey(address),
        symbol,
        assetType: base.includes('USD') ? 'forex' : 'crypto',
        base,
        quote,
      });
    }
    
    return feeds;
  }

  /**
   * Get price feed address for a symbol
   */
  getPriceFeedAddress(symbol: string): PublicKey | null {
    const address = PYTH_PRICE_FEEDS[symbol.toUpperCase()];
    if (!address) return null;
    return new PublicKey(address);
  }

  /**
   * Get current price for a symbol
   */
  async getPrice(symbol: string): Promise<PriceData | null> {
    const feedAddress = this.getPriceFeedAddress(symbol);
    if (!feedAddress) {
      logger.warn('Unknown Pyth price feed', { symbol });
      return null;
    }

    return this.getPriceByAddress(feedAddress, symbol);
  }

  /**
   * Get price by feed address
   */
  async getPriceByAddress(feedAddress: PublicKey, symbol?: string): Promise<PriceData | null> {
    try {
      const priceData = await this.pythClient.getAssetPricesFromAccounts([feedAddress]);
      
      if (!priceData || priceData.length === 0) {
        return null;
      }

      const price = priceData[0];
      
      if (!price || price.price === undefined) {
        return null;
      }

      const status = price.status === PriceStatus.Trading ? 'trading' : 
                     price.status === PriceStatus.Halted ? 'halted' : 'unknown';

      const result: PriceData = {
        symbol: symbol || feedAddress.toBase58().slice(0, 8),
        price: price.price,
        confidence: price.confidence || 0,
        publishTime: (price as { publishTime?: number | bigint }).publishTime 
          ? new Date(Number((price as { publishTime?: number | bigint }).publishTime) * 1000) 
          : new Date(),
        source: 'pyth',
        feedAddress,
        status,
        ema: price.emaPrice?.value,
      };

      // Update cache
      this.priceCache.set(feedAddress.toBase58(), result);

      return result;
    } catch (error) {
      logger.error('Failed to get Pyth price', { 
        feedAddress: feedAddress.toBase58(),
        error: (error as Error).message 
      });
      return null;
    }
  }

  /**
   * Get prices for multiple symbols
   */
  async getPrices(symbols: string[]): Promise<Map<string, PriceData | null>> {
    const results = new Map<string, PriceData | null>();
    
    const feedAddresses: { symbol: string; address: PublicKey }[] = [];
    
    for (const symbol of symbols) {
      const address = this.getPriceFeedAddress(symbol);
      if (address) {
        feedAddresses.push({ symbol, address });
      } else {
        results.set(symbol, null);
      }
    }

    if (feedAddresses.length === 0) {
      return results;
    }

    try {
      const priceData = await this.pythClient.getAssetPricesFromAccounts(
        feedAddresses.map(f => f.address)
      );

      for (let i = 0; i < feedAddresses.length; i++) {
        const { symbol, address } = feedAddresses[i];
        const price = priceData[i];

        if (price && price.price !== undefined) {
          const status = price.status === PriceStatus.Trading ? 'trading' : 
                         price.status === PriceStatus.Halted ? 'halted' : 'unknown';

          results.set(symbol, {
            symbol,
            price: price.price,
            confidence: price.confidence || 0,
            publishTime: (price as { publishTime?: number | bigint }).publishTime 
              ? new Date(Number((price as { publishTime?: number | bigint }).publishTime) * 1000) 
              : new Date(),
            source: 'pyth',
            feedAddress: address,
            status,
            ema: price.emaPrice?.value,
          });
        } else {
          results.set(symbol, null);
        }
      }
    } catch (error) {
      logger.error('Failed to get multiple Pyth prices', { error: (error as Error).message });
      for (const { symbol } of feedAddresses) {
        if (!results.has(symbol)) {
          results.set(symbol, null);
        }
      }
    }

    return results;
  }

  /**
   * Subscribe to price updates
   */
  subscribeToPrice(
    symbol: string,
    callback: (price: PriceData) => void,
    intervalMs: number = 1000
  ): OracleSubscription {
    const feedAddress = this.getPriceFeedAddress(symbol);
    if (!feedAddress) {
      throw new Error(`Unknown price feed: ${symbol}`);
    }

    const subscriptionKey = `${feedAddress.toBase58()}-${Date.now()}`;
    
    // Poll for updates
    const interval = setInterval(async () => {
      const price = await this.getPriceByAddress(feedAddress, symbol);
      if (price) {
        callback(price);
      }
    }, intervalMs);

    this.subscriptions.set(subscriptionKey, interval);

    logger.info('Subscribed to Pyth price', { symbol, intervalMs });

    return {
      feedAddress,
      callback,
      unsubscribe: () => {
        const interval = this.subscriptions.get(subscriptionKey);
        if (interval) {
          clearInterval(interval);
          this.subscriptions.delete(subscriptionKey);
          logger.info('Unsubscribed from Pyth price', { symbol });
        }
      },
    };
  }

  /**
   * Get cached price (faster, may be stale)
   */
  getCachedPrice(symbol: string): PriceData | null {
    const feedAddress = this.getPriceFeedAddress(symbol);
    if (!feedAddress) return null;
    return this.priceCache.get(feedAddress.toBase58()) || null;
  }

  /**
   * Unsubscribe from all price feeds
   */
  unsubscribeAll(): void {
    for (const interval of this.subscriptions.values()) {
      clearInterval(interval);
    }
    this.subscriptions.clear();
    logger.info('Unsubscribed from all Pyth prices');
  }

  /**
   * Get subscription count
   */
  getSubscriptionCount(): number {
    return this.subscriptions.size;
  }
}

/**
 * Create Pyth oracle client
 */
export function createPythOracle(
  connection: Connection,
  cluster: 'mainnet-beta' | 'devnet' = 'mainnet-beta'
): PythOracle {
  return new PythOracle(connection, cluster);
}
