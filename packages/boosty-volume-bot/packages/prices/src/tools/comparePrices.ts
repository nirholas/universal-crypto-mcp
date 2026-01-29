/**
 * MCP Tool: comparePrices
 * 
 * Compare prices and market data for multiple cryptocurrency tokens.
 * Efficiently batches requests to minimize API calls.
 */

import { coingeckoClient, type TokenPrice } from '../apis/coingecko.js';
import { ValidationError } from '@boosty/mcp-shared';

// ============================================================================
// Input/Output Types
// ============================================================================

export interface ComparePricesInput {
  /** Array of token symbols to compare (max 25) */
  symbols: string[];
  /** Currency for prices (default: 'usd') */
  currency?: string;
}

export interface TokenComparison {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  rank: number;
}

export interface ComparePricesOutput {
  currency: string;
  tokens: TokenComparison[];
  summary: {
    count: number;
    totalMarketCap: number;
    averageChange24h: number;
    bestPerformer: TokenComparison | null;
    worstPerformer: TokenComparison | null;
    highestMarketCap: TokenComparison | null;
    lowestMarketCap: TokenComparison | null;
  };
  timestamp: string;
}

// ============================================================================
// Tool Definition (MCP Schema)
// ============================================================================

export const comparePricesDefinition = {
  name: 'comparePrices',
  description:
    'Compare prices and market data for multiple cryptocurrency tokens in a single request. Returns rankings by market cap and identifies best/worst performers.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      symbols: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of token symbols to compare (e.g., ["BTC", "ETH", "SOL"])',
        minItems: 1,
        maxItems: 25,
      },
      currency: {
        type: 'string',
        description: 'Fiat currency for prices (e.g., usd, eur). Default: usd',
        default: 'usd',
      },
    },
    required: ['symbols'],
  },
};

// ============================================================================
// Tool Implementation
// ============================================================================

/**
 * Validate input parameters
 */
function validateInput(input: unknown): ComparePricesInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object');
  }

  const { symbols, currency } = input as Record<string, unknown>;

  if (!symbols) {
    throw new ValidationError('Symbols array is required');
  }

  if (!Array.isArray(symbols)) {
    throw new ValidationError('Symbols must be an array');
  }

  if (symbols.length === 0) {
    throw new ValidationError('Symbols array cannot be empty');
  }

  if (symbols.length > 25) {
    throw new ValidationError('Cannot compare more than 25 tokens at once');
  }

  // Validate each symbol
  const validatedSymbols: string[] = [];
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    if (typeof symbol !== 'string') {
      throw new ValidationError(`Symbol at index ${i} must be a string`);
    }
    const trimmed = symbol.trim();
    if (trimmed.length === 0) {
      throw new ValidationError(`Symbol at index ${i} cannot be empty`);
    }
    if (trimmed.length > 20) {
      throw new ValidationError(`Symbol at index ${i} is too long`);
    }
    validatedSymbols.push(trimmed);
  }

  // Remove duplicates
  const uniqueSymbols = [...new Set(validatedSymbols.map((s) => s.toLowerCase()))];

  if (currency !== undefined && typeof currency !== 'string') {
    throw new ValidationError('Currency must be a string');
  }

  return {
    symbols: uniqueSymbols,
    currency: typeof currency === 'string' ? currency.trim() : 'usd',
  };
}

/**
 * Compare prices for multiple tokens
 */
export async function comparePrices(input: unknown): Promise<ComparePricesOutput> {
  const { symbols, currency = 'usd' } = validateInput(input);

  // Batch fetch all prices
  const pricesMap = await coingeckoClient.getPrices(symbols, currency);

  // Convert to array and add rankings
  const tokens: TokenComparison[] = [];
  for (const symbol of symbols) {
    const priceData = pricesMap.get(symbol.toUpperCase());
    if (priceData) {
      tokens.push({
        symbol: symbol.toUpperCase(),
        price: priceData.price,
        change24h: Math.round(priceData.change24h * 100) / 100,
        marketCap: priceData.marketCap,
        volume24h: priceData.volume24h,
        rank: 0, // Will be set after sorting
      });
    }
  }

  // Sort by market cap and assign ranks
  tokens.sort((a, b) => b.marketCap - a.marketCap);
  tokens.forEach((token, index) => {
    token.rank = index + 1;
  });

  // Calculate summary statistics
  const count = tokens.length;
  const totalMarketCap = tokens.reduce((sum, t) => sum + t.marketCap, 0);
  const averageChange24h =
    count > 0
      ? Math.round(
          (tokens.reduce((sum, t) => sum + t.change24h, 0) / count) * 100
        ) / 100
      : 0;

  // Find extremes
  let bestPerformer: TokenComparison | null = null;
  let worstPerformer: TokenComparison | null = null;
  let highestMarketCap: TokenComparison | null = null;
  let lowestMarketCap: TokenComparison | null = null;

  if (tokens.length > 0) {
    bestPerformer = tokens.reduce(
      (best, t) => (t.change24h > best.change24h ? t : best),
      tokens[0]
    );
    worstPerformer = tokens.reduce(
      (worst, t) => (t.change24h < worst.change24h ? t : worst),
      tokens[0]
    );
    highestMarketCap = tokens[0]; // Already sorted by market cap desc
    lowestMarketCap = tokens[tokens.length - 1];
  }

  return {
    currency: currency.toUpperCase(),
    tokens,
    summary: {
      count,
      totalMarketCap,
      averageChange24h,
      bestPerformer,
      worstPerformer,
      highestMarketCap,
      lowestMarketCap,
    },
    timestamp: new Date().toISOString(),
  };
}
