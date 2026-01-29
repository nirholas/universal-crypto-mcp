/**
 * MCP Tool: getTokenPriceHistory
 * 
 * Get historical price data for a cryptocurrency token.
 * Data sourced from CoinGecko API with 5-minute caching.
 */

import { coingeckoClient } from '../apis/coingecko.js';
import { ValidationError } from '@boosty/mcp-shared';

// ============================================================================
// Input/Output Types
// ============================================================================

export interface GetTokenPriceHistoryInput {
  /** Token symbol (e.g., 'BTC', 'ETH') */
  symbol: string;
  /** Number of days of history (1-365) */
  days: number;
  /** Currency for price (default: 'usd') */
  currency?: string;
}

export interface PricePoint {
  timestamp: number;
  date: string;
  price: number;
}

export interface GetTokenPriceHistoryOutput {
  symbol: string;
  currency: string;
  days: number;
  prices: PricePoint[];
  statistics: {
    highestPrice: number;
    lowestPrice: number;
    averagePrice: number;
    priceChange: number;
    priceChangePercent: number;
    startPrice: number;
    endPrice: number;
  };
}

// ============================================================================
// Tool Definition (MCP Schema)
// ============================================================================

export const getTokenPriceHistoryDefinition = {
  name: 'getTokenPriceHistory',
  description:
    'Get historical price data for a cryptocurrency token over a specified number of days. Includes price statistics like high, low, average, and percent change.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      symbol: {
        type: 'string',
        description: 'Token symbol (e.g., BTC, ETH, ARB)',
      },
      days: {
        type: 'number',
        description: 'Number of days of history (1-365)',
        minimum: 1,
        maximum: 365,
      },
      currency: {
        type: 'string',
        description: 'Fiat currency for price (e.g., usd, eur). Default: usd',
        default: 'usd',
      },
    },
    required: ['symbol', 'days'],
  },
};

// ============================================================================
// Tool Implementation
// ============================================================================

/**
 * Validate input parameters
 */
function validateInput(input: unknown): GetTokenPriceHistoryInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object');
  }

  const { symbol, days, currency } = input as Record<string, unknown>;

  if (!symbol || typeof symbol !== 'string') {
    throw new ValidationError('Symbol is required and must be a string');
  }

  if (symbol.trim().length === 0) {
    throw new ValidationError('Symbol cannot be empty');
  }

  if (days === undefined || days === null) {
    throw new ValidationError('Days is required');
  }

  const daysNum = Number(days);
  if (isNaN(daysNum) || !Number.isInteger(daysNum)) {
    throw new ValidationError('Days must be an integer');
  }

  if (daysNum < 1 || daysNum > 365) {
    throw new ValidationError('Days must be between 1 and 365');
  }

  if (currency !== undefined && typeof currency !== 'string') {
    throw new ValidationError('Currency must be a string');
  }

  return {
    symbol: symbol.trim(),
    days: daysNum,
    currency: typeof currency === 'string' ? currency.trim() : 'usd',
  };
}

/**
 * Get historical price data for a token
 */
export async function getTokenPriceHistory(
  input: unknown
): Promise<GetTokenPriceHistoryOutput> {
  const { symbol, days, currency = 'usd' } = validateInput(input);

  const historyData = await coingeckoClient.getHistory(symbol, days, currency);

  // Convert to output format with ISO dates
  const prices: PricePoint[] = historyData.map((point) => ({
    timestamp: point.timestamp,
    date: new Date(point.timestamp).toISOString(),
    price: point.price,
  }));

  // Calculate statistics
  if (prices.length === 0) {
    return {
      symbol: symbol.toUpperCase(),
      currency: currency.toUpperCase(),
      days,
      prices: [],
      statistics: {
        highestPrice: 0,
        lowestPrice: 0,
        averagePrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        startPrice: 0,
        endPrice: 0,
      },
    };
  }

  const priceValues = prices.map((p) => p.price);
  const highestPrice = Math.max(...priceValues);
  const lowestPrice = Math.min(...priceValues);
  const averagePrice = priceValues.reduce((sum, p) => sum + p, 0) / priceValues.length;

  const startPrice = prices[0].price;
  const endPrice = prices[prices.length - 1].price;
  const priceChange = endPrice - startPrice;
  const priceChangePercent = startPrice > 0 ? (priceChange / startPrice) * 100 : 0;

  return {
    symbol: symbol.toUpperCase(),
    currency: currency.toUpperCase(),
    days,
    prices,
    statistics: {
      highestPrice: Math.round(highestPrice * 1e8) / 1e8,
      lowestPrice: Math.round(lowestPrice * 1e8) / 1e8,
      averagePrice: Math.round(averagePrice * 1e8) / 1e8,
      priceChange: Math.round(priceChange * 1e8) / 1e8,
      priceChangePercent: Math.round(priceChangePercent * 100) / 100,
      startPrice: Math.round(startPrice * 1e8) / 1e8,
      endPrice: Math.round(endPrice * 1e8) / 1e8,
    },
  };
}
