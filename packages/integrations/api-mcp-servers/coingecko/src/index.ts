#!/usr/bin/env node

/**
 * CoinGecko MCP Server
 * Provides market data, prices, and crypto information
 * @author nirholas (github.com/nirholas | x.com/nichxbt)
 * @license MIT
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface CoinGeckoConfig {
  apiKey?: string;
}

class CoinGeckoMCPServer {
  private server: Server;
  private apiKey?: string;

  constructor(config: CoinGeckoConfig = {}) {
    this.apiKey = config.apiKey || process.env.COINGECKO_API_KEY;
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
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers['x-cg-pro-api-key'] = this.apiKey;
    }

    const response = await axios.get(`${COINGECKO_API}${endpoint}`, {
      params,
      headers,
    });

    return response.data;
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
