#!/usr/bin/env node

/**
 * CoinGecko MCP Server
 * Provides market data, prices, and crypto information
 * 
 * Features:
 * - Rate limiting (30 req/min for free tier, 500 req/min for pro)
 * - Exponential backoff retry with jitter
 * - Circuit breaker for fault tolerance
 * - Configurable timeouts
 * - Structured error handling
 * 
 * @author nirholas (github.com/nirholas | x.com/nichxbt)
 * @license MIT
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  HttpClient,
  RateLimiter,
  retry,
  CircuitBreaker,
  withTimeout,
  ApiError,
  RateLimitError,
  TimeoutError,
  createLogger,
  DEFAULT_TIMEOUTS,
  type Logger,
  type RetryConfig,
} from '@universal-crypto-mcp/shared-utils';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface CoinGeckoConfig {
  apiKey?: string;
}

// Rate limiter: CoinGecko free tier allows 30 calls/min
const rateLimiter = new RateLimiter({
  maxTokens: 30,
  refillRate: 30,
  refillInterval: 60000, // 1 minute
  maxWaitTime: 10000,
});

// Rate limiter for pro tier
const proRateLimiter = new RateLimiter({
  maxTokens: 500,
  refillRate: 500,
  refillInterval: 60000,
  maxWaitTime: 5000,
});

// Circuit breaker
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000,
  halfOpenRequests: 2,
});

// Logger
const logger: Logger = createLogger({ name: 'coingecko-mcp' });

// Default retry config
const retryConfig: Partial<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 15000,
  jitter: true,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  onRetry: (error, attempt, delay) => {
    logger.warn(`Retry attempt ${attempt} after ${delay}ms`, { error: error.message });
  },
};

class CoinGeckoMCPServer {
  private server: Server;
  private apiKey?: string;
  private isPro: boolean;

  constructor(config: CoinGeckoConfig = {}) {
    this.apiKey = config.apiKey || process.env.COINGECKO_API_KEY;
    this.isPro = !!this.apiKey;
    
    this.server = new Server(
      {
        name: 'coingecko-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    logger.info('CoinGecko MCP Server initialized', { isPro: this.isPro });
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    // Check circuit breaker
    if (!circuitBreaker.canExecute()) {
      throw new ApiError('Circuit breaker is open - CoinGecko API temporarily unavailable', {
        code: 'CIRCUIT_BREAKER_OPEN',
        endpoint,
      });
    }

    // Rate limiting
    const limiter = this.isPro ? proRateLimiter : rateLimiter;
    const rateLimitResult = await limiter.acquire('coingecko');
    if (!rateLimitResult.allowed) {
      throw new RateLimitError('Rate limit exceeded for CoinGecko API', {
        retryAfter: rateLimitResult.retryAfter,
      });
    }

    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers['x-cg-pro-api-key'] = this.apiKey;
    }

    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    const url = `${COINGECKO_API}${endpoint}${queryString ? '?' + queryString : ''}`;

    const executeRequest = async () => {
      const startTime = Date.now();
      
      try {
        const response = await withTimeout(
          fetch(url, { headers }),
          { timeoutMs: DEFAULT_TIMEOUTS.HTTP_REQUEST, operation: `coingecko:${endpoint}` }
        );

        const duration = Date.now() - startTime;
        logger.debug('CoinGecko API request completed', { endpoint, status: response.status, duration });

        if (!response.ok) {
          circuitBreaker.recordFailure();
          
          if (response.status === 429) {
            throw new RateLimitError('CoinGecko rate limit exceeded', {
              retryAfter: parseInt(response.headers.get('Retry-After') || '60') * 1000,
            });
          }
          
          const errorText = await response.text();
          throw new ApiError(`CoinGecko API error: ${response.status}`, {
            code: 'COINGECKO_API_ERROR',
            statusCode: response.status,
            endpoint,
            context: { response: errorText },
          });
        }

        const data = await response.json();
        circuitBreaker.recordSuccess();
        return data;
      } catch (error) {
        circuitBreaker.recordFailure();
        throw error;
      }
    };

    // Execute with retry
    const result = await retry(executeRequest, retryConfig);
    
    if (!result.success) {
      throw result.error;
    }
    
    return result.data;
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_coin_price',
          description: 'Get current price of cryptocurrency in multiple currencies',
          inputSchema: {
            type: 'object',
            properties: {
              coin_id: {
                type: 'string',
                description: 'CoinGecko coin ID (e.g., bitcoin, ethereum)',
              },
              vs_currencies: {
                type: 'string',
                description: 'Comma-separated currencies (e.g., usd,eur,btc)',
                default: 'usd',
              },
            },
            required: ['coin_id'],
          },
        },
        {
          name: 'get_coin_market_data',
          description: 'Get detailed market data for a cryptocurrency',
          inputSchema: {
            type: 'object',
            properties: {
              coin_id: {
                type: 'string',
                description: 'CoinGecko coin ID',
              },
            },
            required: ['coin_id'],
          },
        },
        {
          name: 'get_trending_coins',
          description: 'Get trending cryptocurrencies on CoinGecko',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_top_coins',
          description: 'Get top cryptocurrencies by market cap',
          inputSchema: {
            type: 'object',
            properties: {
              per_page: {
                type: 'number',
                description: 'Number of results (max 250)',
                default: 100,
              },
              page: {
                type: 'number',
                description: 'Page number',
                default: 1,
              },
            },
          },
        },
        {
          name: 'search_coins',
          description: 'Search for cryptocurrencies',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'get_global_market_data',
          description: 'Get global cryptocurrency market statistics',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_coin_history',
          description: 'Get historical data for a specific date',
          inputSchema: {
            type: 'object',
            properties: {
              coin_id: {
                type: 'string',
                description: 'CoinGecko coin ID',
              },
              date: {
                type: 'string',
                description: 'Date in DD-MM-YYYY format',
              },
            },
            required: ['coin_id', 'date'],
          },
        },
        {
          name: 'get_coin_ohlc',
          description: 'Get OHLC (candlestick) data',
          inputSchema: {
            type: 'object',
            properties: {
              coin_id: {
                type: 'string',
                description: 'CoinGecko coin ID',
              },
              vs_currency: {
                type: 'string',
                description: 'Target currency',
                default: 'usd',
              },
              days: {
                type: 'number',
                description: 'Data up to number of days ago (1/7/14/30/90/180/365/max)',
                default: 7,
              },
            },
            required: ['coin_id'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'get_coin_price': {
            const data = await this.makeRequest('/simple/price', {
              ids: args.coin_id,
              vs_currencies: args.vs_currencies || 'usd',
              include_24hr_change: true,
              include_market_cap: true,
              include_24hr_vol: true,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'get_coin_market_data': {
            const data = await this.makeRequest(`/coins/${args.coin_id}`, {
              localization: false,
              tickers: false,
              community_data: false,
              developer_data: false,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'get_trending_coins': {
            const data = await this.makeRequest('/search/trending');
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'get_top_coins': {
            const data = await this.makeRequest('/coins/markets', {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: args.per_page || 100,
              page: args.page || 1,
              sparkline: false,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'search_coins': {
            const data = await this.makeRequest('/search', {
              query: args.query,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'get_global_market_data': {
            const data = await this.makeRequest('/global');
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'get_coin_history': {
            const data = await this.makeRequest(`/coins/${args.coin_id}/history`, {
              date: args.date,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          case 'get_coin_ohlc': {
            const data = await this.makeRequest(`/coins/${args.coin_id}/ohlc`, {
              vs_currency: args.vs_currency || 'usd',
              days: args.days || 7,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('CoinGecko MCP Server running on stdio');
  }
}

const server = new CoinGeckoMCPServer();
server.start().catch(console.error);
