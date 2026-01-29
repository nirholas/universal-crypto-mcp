/**
 * MCP Tool: getFearGreedIndex
 * 
 * Get the Crypto Fear & Greed Index, a sentiment indicator for
 * the cryptocurrency market.
 * 
 * Data sourced from Alternative.me API.
 * @see https://alternative.me/crypto/fear-and-greed-index/
 */

import { SimpleCache, HttpClient, APIError } from '@boosty/mcp-shared';

// ============================================================================
// Constants
// ============================================================================

const FEAR_GREED_API_URL = 'https://api.alternative.me/fng/';

// Classification ranges
const CLASSIFICATIONS = {
  EXTREME_FEAR: { min: 0, max: 24, label: 'Extreme Fear' },
  FEAR: { min: 25, max: 44, label: 'Fear' },
  NEUTRAL: { min: 45, max: 55, label: 'Neutral' },
  GREED: { min: 56, max: 74, label: 'Greed' },
  EXTREME_GREED: { min: 75, max: 100, label: 'Extreme Greed' },
} as const;

// ============================================================================
// Types
// ============================================================================

export interface GetFearGreedIndexInput {
  // No input required
}

export interface GetFearGreedIndexOutput {
  value: number;
  classification: string;
  timestamp: string;
  nextUpdate: string;
  trend: {
    yesterday: number | null;
    lastWeek: number | null;
    lastMonth: number | null;
  };
  interpretation: string;
}

interface FearGreedApiResponse {
  name: string;
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update: string;
  }>;
  metadata: {
    error: string | null;
  };
}

// ============================================================================
// Tool Definition
// ============================================================================

export const getFearGreedIndexDefinition = {
  name: 'getFearGreedIndex',
  description:
    'Get the Crypto Fear & Greed Index, a market sentiment indicator ranging from 0 (Extreme Fear) to 100 (Extreme Greed). Includes historical comparison and market interpretation.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [],
  },
};

// ============================================================================
// Implementation
// ============================================================================

// Module-level cache (1 hour TTL)
const cache = new SimpleCache<GetFearGreedIndexOutput>(60 * 60 * 1000, 10);

/**
 * Get classification label for a Fear & Greed value
 */
function getClassification(value: number): string {
  if (value <= CLASSIFICATIONS.EXTREME_FEAR.max) return CLASSIFICATIONS.EXTREME_FEAR.label;
  if (value <= CLASSIFICATIONS.FEAR.max) return CLASSIFICATIONS.FEAR.label;
  if (value <= CLASSIFICATIONS.NEUTRAL.max) return CLASSIFICATIONS.NEUTRAL.label;
  if (value <= CLASSIFICATIONS.GREED.max) return CLASSIFICATIONS.GREED.label;
  return CLASSIFICATIONS.EXTREME_GREED.label;
}

/**
 * Generate market interpretation based on the index value
 */
function getInterpretation(value: number, trend: { yesterday: number | null }): string {
  const classification = getClassification(value);
  const trendDirection =
    trend.yesterday !== null
      ? value > trend.yesterday
        ? 'increasing'
        : value < trend.yesterday
          ? 'decreasing'
          : 'stable'
      : 'unknown';

  if (value <= 24) {
    return `The market is in ${classification}. This often indicates potential buying opportunities as investors may be overly pessimistic. Sentiment is ${trendDirection} from yesterday.`;
  }
  if (value <= 44) {
    return `The market shows ${classification}. Investors are cautious but not panicking. Sentiment is ${trendDirection} from yesterday.`;
  }
  if (value <= 55) {
    return `The market is ${classification}. Neither fear nor greed dominates, suggesting balanced sentiment. Sentiment is ${trendDirection} from yesterday.`;
  }
  if (value <= 74) {
    return `The market shows ${classification}. Investors are optimistic but caution is warranted. Sentiment is ${trendDirection} from yesterday.`;
  }
  return `The market is in ${classification}. This often indicates potential overbuying and may precede corrections. Sentiment is ${trendDirection} from yesterday.`;
}

/**
 * Get the Fear & Greed Index
 */
export async function getFearGreedIndex(
  _input?: unknown
): Promise<GetFearGreedIndexOutput> {
  // Check cache
  const cacheKey = 'feargreed:current';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const httpClient = new HttpClient({
    baseUrl: FEAR_GREED_API_URL,
    timeout: 15_000,
  });

  // Fetch current + 30 days history for trend analysis
  const response = await httpClient.get<FearGreedApiResponse>('?limit=31&format=json');

  if (!response.data || response.data.length === 0) {
    throw new APIError('No Fear & Greed Index data available', {
      endpoint: FEAR_GREED_API_URL,
      details: { response },
    });
  }

  const current = response.data[0];
  const value = parseInt(current.value, 10);

  if (isNaN(value)) {
    throw new APIError('Invalid Fear & Greed Index value', {
      endpoint: FEAR_GREED_API_URL,
      details: { value: current.value },
    });
  }

  // Extract historical values for trend
  const yesterdayData = response.data[1];
  const lastWeekData = response.data[7];
  const lastMonthData = response.data[30];

  const trend = {
    yesterday: yesterdayData ? parseInt(yesterdayData.value, 10) : null,
    lastWeek: lastWeekData ? parseInt(lastWeekData.value, 10) : null,
    lastMonth: lastMonthData ? parseInt(lastMonthData.value, 10) : null,
  };

  // Validate trend values
  if (trend.yesterday !== null && isNaN(trend.yesterday)) trend.yesterday = null;
  if (trend.lastWeek !== null && isNaN(trend.lastWeek)) trend.lastWeek = null;
  if (trend.lastMonth !== null && isNaN(trend.lastMonth)) trend.lastMonth = null;

  const result: GetFearGreedIndexOutput = {
    value,
    classification: current.value_classification || getClassification(value),
    timestamp: new Date(parseInt(current.timestamp, 10) * 1000).toISOString(),
    nextUpdate: `${current.time_until_update} seconds`,
    trend,
    interpretation: getInterpretation(value, trend),
  };

  // Cache for 1 hour
  cache.set(cacheKey, result, 60 * 60 * 1000);

  return result;
}
