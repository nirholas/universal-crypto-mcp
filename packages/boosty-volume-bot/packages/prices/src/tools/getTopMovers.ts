/**
 * MCP Tool: getTopMovers
 * 
 * Get the top gaining and losing cryptocurrency tokens by price change.
 * Data sourced from CoinGecko API.
 */

import { coingeckoClient, type TopCoin } from '../apis/coingecko.js';
import { ValidationError } from '@boosty/mcp-shared';

// ============================================================================
// Input/Output Types
// ============================================================================

export type Timeframe = '1h' | '24h' | '7d';
export type Direction = 'gainers' | 'losers' | 'both';

export interface GetTopMoversInput {
  /** Timeframe for price change (default: '24h') */
  timeframe?: Timeframe;
  /** Number of tokens per category (default: 10, max: 50) */
  limit?: number;
  /** Filter direction (default: 'both') */
  direction?: Direction;
}

export interface TokenMover {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  marketCap: number;
  volume24h: number;
}

export interface GetTopMoversOutput {
  timeframe: string;
  gainers: TokenMover[];
  losers: TokenMover[];
  timestamp: string;
}

// ============================================================================
// Tool Definition (MCP Schema)
// ============================================================================

export const getTopMoversDefinition = {
  name: 'getTopMovers',
  description:
    'Get the top gaining and losing cryptocurrency tokens by price change percentage. Useful for identifying market trends and momentum.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      timeframe: {
        type: 'string',
        description: 'Timeframe for price change measurement',
        enum: ['1h', '24h', '7d'],
        default: '24h',
      },
      limit: {
        type: 'number',
        description: 'Number of tokens to return per category (gainers/losers)',
        minimum: 1,
        maximum: 50,
        default: 10,
      },
      direction: {
        type: 'string',
        description: 'Filter to show only gainers, only losers, or both',
        enum: ['gainers', 'losers', 'both'],
        default: 'both',
      },
    },
    required: [],
  },
};

// ============================================================================
// Tool Implementation
// ============================================================================

const VALID_TIMEFRAMES: Timeframe[] = ['1h', '24h', '7d'];
const VALID_DIRECTIONS: Direction[] = ['gainers', 'losers', 'both'];

/**
 * Validate input parameters
 */
function validateInput(input: unknown): GetTopMoversInput {
  if (input === null || input === undefined) {
    return {};
  }

  if (typeof input !== 'object') {
    throw new ValidationError('Input must be an object');
  }

  const { timeframe, limit, direction } = input as Record<string, unknown>;

  const result: GetTopMoversInput = {};

  if (timeframe !== undefined) {
    if (typeof timeframe !== 'string' || !VALID_TIMEFRAMES.includes(timeframe as Timeframe)) {
      throw new ValidationError(
        `Invalid timeframe: ${timeframe}. Must be one of: ${VALID_TIMEFRAMES.join(', ')}`
      );
    }
    result.timeframe = timeframe as Timeframe;
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (isNaN(limitNum) || !Number.isInteger(limitNum)) {
      throw new ValidationError('Limit must be an integer');
    }
    if (limitNum < 1 || limitNum > 50) {
      throw new ValidationError('Limit must be between 1 and 50');
    }
    result.limit = limitNum;
  }

  if (direction !== undefined) {
    if (typeof direction !== 'string' || !VALID_DIRECTIONS.includes(direction as Direction)) {
      throw new ValidationError(
        `Invalid direction: ${direction}. Must be one of: ${VALID_DIRECTIONS.join(', ')}`
      );
    }
    result.direction = direction as Direction;
  }

  return result;
}

/**
 * Get the price change for a coin based on timeframe
 */
function getPriceChange(coin: TopCoin, timeframe: Timeframe): number {
  switch (timeframe) {
    case '1h':
      return coin.change1h;
    case '24h':
      return coin.change24h;
    case '7d':
      return coin.change7d;
    default:
      return coin.change24h;
  }
}

/**
 * Convert TopCoin to TokenMover
 */
function toTokenMover(coin: TopCoin, timeframe: Timeframe): TokenMover {
  return {
    rank: coin.rank,
    symbol: coin.symbol,
    name: coin.name,
    price: coin.price,
    priceChange: Math.round(getPriceChange(coin, timeframe) * 100) / 100,
    marketCap: coin.marketCap,
    volume24h: coin.volume24h,
  };
}

/**
 * Get top gaining and losing tokens
 */
export async function getTopMovers(input: unknown): Promise<GetTopMoversOutput> {
  const {
    timeframe = '24h',
    limit = 10,
    direction = 'both',
  } = validateInput(input);

  // Fetch top 250 coins to analyze
  const topCoins = await coingeckoClient.getTopCoins(250);

  // Filter out coins with invalid data
  const validCoins = topCoins.filter((coin) => {
    const change = getPriceChange(coin, timeframe);
    return !isNaN(change) && isFinite(change);
  });

  // Sort by price change (descending for gainers, ascending for losers)
  const sortedByChange = [...validCoins].sort(
    (a, b) => getPriceChange(b, timeframe) - getPriceChange(a, timeframe)
  );

  let gainers: TokenMover[] = [];
  let losers: TokenMover[] = [];

  if (direction === 'gainers' || direction === 'both') {
    // Get top gainers (positive change, highest first)
    gainers = sortedByChange
      .filter((coin) => getPriceChange(coin, timeframe) > 0)
      .slice(0, limit)
      .map((coin) => toTokenMover(coin, timeframe));
  }

  if (direction === 'losers' || direction === 'both') {
    // Get top losers (negative change, lowest first)
    losers = sortedByChange
      .filter((coin) => getPriceChange(coin, timeframe) < 0)
      .reverse()
      .slice(0, limit)
      .map((coin) => toTokenMover(coin, timeframe));
  }

  return {
    timeframe,
    gainers,
    losers,
    timestamp: new Date().toISOString(),
  };
}
