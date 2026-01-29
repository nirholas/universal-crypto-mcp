/**
 * MCP Tool: getTokenPrice
 * 
 * Get current price and market data for a cryptocurrency token.
 * Data sourced from CoinGecko API with 30-second caching.
 */

import { coingeckoClient } from '../apis/coingecko.js';
import { ValidationError } from '@boosty/mcp-shared';

// ============================================================================
// Input/Output Types
// ============================================================================

export interface GetTokenPriceInput {
  /** Token symbol (e.g., 'BTC', 'ETH', 'ARB') */
  symbol: string;
  /** Currency for price (default: 'usd') */
  currency?: string;
}

export interface GetTokenPriceOutput {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  currency: string;
  lastUpdated: string;
}

// ============================================================================
// Tool Definition (MCP Schema)
// ============================================================================

export const getTokenPriceDefinition = {
  name: 'getTokenPrice',
  description:
    'Get current price and market data for a cryptocurrency token including 24-hour price change, market capitalization, and trading volume. Supports 100+ popular tokens.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      symbol: {
        type: 'string',
        description: 'Token symbol (e.g., BTC, ETH, ARB, SOL, MATIC)',
      },
      currency: {
        type: 'string',
        description: 'Fiat currency for price (e.g., usd, eur, gbp). Default: usd',
        default: 'usd',
      },
    },
    required: ['symbol'],
  },
};

// ============================================================================
// Tool Implementation
// ============================================================================

/**
 * Validate input parameters
 */
function validateInput(input: unknown): GetTokenPriceInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object');
  }

  const { symbol, currency } = input as Record<string, unknown>;

  if (!symbol || typeof symbol !== 'string') {
    throw new ValidationError('Symbol is required and must be a string');
  }

  if (symbol.trim().length === 0) {
    throw new ValidationError('Symbol cannot be empty');
  }

  if (symbol.length > 20) {
    throw new ValidationError('Symbol is too long (max 20 characters)');
  }

  if (currency !== undefined && typeof currency !== 'string') {
    throw new ValidationError('Currency must be a string');
  }

  return {
    symbol: symbol.trim(),
    currency: typeof currency === 'string' ? currency.trim() : 'usd',
  };
}

/**
 * Get current price and market data for a token
 */
export async function getTokenPrice(input: unknown): Promise<GetTokenPriceOutput> {
  const { symbol, currency = 'usd' } = validateInput(input);

  const priceData = await coingeckoClient.getPrice(symbol, currency);

  return {
    symbol: symbol.toUpperCase(),
    price: priceData.price,
    change24h: Math.round(priceData.change24h * 100) / 100,
    marketCap: priceData.marketCap,
    volume24h: priceData.volume24h,
    currency: currency.toUpperCase(),
    lastUpdated: priceData.lastUpdated,
  };
}
