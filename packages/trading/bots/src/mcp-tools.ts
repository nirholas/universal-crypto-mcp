/**
 * MCP Tools for Trading Bot Integration
 * 
 * @maintainer Nicholas (nirholas)
 * @github https://github.com/nirholas
 * @twitter https://x.com/nichxbt
 * 
 * These tools allow AI agents like Claude to interact with
 * popular open-source crypto trading bots through MCP protocol.
 * 
 * All integrated bots are MIT licensed and properly attributed
 * to their original authors.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { createTradingBotManager, AVAILABLE_BOTS } from './index.js'

const manager = createTradingBotManager()

export const tradingBotTools: Tool[] = [
  {
    name: 'list_trading_bots',
    description: `List all integrated open-source trading bots with proper attribution.
    
Each bot maintains its original copyright and license (MIT).
Integration maintained by Nicholas (@nirholas).

Returns information about 10+ top trading bots including:
- Crypto-Signal (5.4k stars) - Technical analysis
- TradingView Webhook Bot (1.6k stars) - Alert integration
- Binance Sentiment Bot (1.6k stars) - News-based trading
- Intelligent Trading Bot (1.5k stars) - ML-based signals
- And 6 more popular bots

All properly credited to original authors.`,
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_bot_info',
    description: `Get detailed information about a specific trading bot including:
- Original author and project URL
- GitHub stars and license
- Description and capabilities
- Attribution information

Maintains proper credit to original open-source authors.
Integration by Nicholas (@nirholas).`,
    inputSchema: {
      type: 'object',
      properties: {
        bot_id: {
          type: 'string',
          description: 'Bot identifier (e.g., "crypto-signal", "binance-sentiment")',
          enum: Object.keys(AVAILABLE_BOTS),
        },
      },
      required: ['bot_id'],
    },
  },
  {
    name: 'execute_trading_bot',
    description: `Execute a trade using a specific trading bot.

This wraps the original bot implementation and delegates
the actual trading logic to the original open-source project.

Proper attribution is maintained for all bot executions.

Integration maintained by Nicholas (@nirholas)
Original bots by their respective authors (see bot info).`,
    inputSchema: {
      type: 'object',
      properties: {
        bot: {
          type: 'string',
          description: 'Bot to use for trading',
          enum: Object.keys(AVAILABLE_BOTS),
        },
        strategy: {
          type: 'string',
          description: 'Trading strategy to execute',
        },
        pair: {
          type: 'string',
          description: 'Trading pair (e.g., BTC/USDT)',
        },
        amount: {
          type: 'number',
          description: 'Amount to trade (optional)',
        },
        side: {
          type: 'string',
          enum: ['buy', 'sell'],
          description: 'Trade side',
        },
      },
      required: ['bot', 'strategy', 'pair'],
    },
  },
  {
    name: 'get_bot_attribution',
    description: `Get attribution text for a trading bot.

Returns properly formatted attribution including:
- Original project name and author
- GitHub repository link
- Star count and license
- Integration maintainer info

Use this to display proper credits in UIs.`,
    inputSchema: {
      type: 'object',
      properties: {
        bot_id: {
          type: 'string',
          description: 'Bot identifier',
          enum: Object.keys(AVAILABLE_BOTS),
        },
      },
      required: ['bot_id'],
    },
  },
]

export async function handleTradingBotTool(
  name: string,
  args: Record<string, any>
): Promise<any> {
  switch (name) {
    case 'list_trading_bots': {
      const bots = manager.listBots()
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                total: bots.length,
                maintainer: {
                  name: 'Nicholas',
                  github: 'nirholas',
                  twitter: 'nichxbt',
                },
                bots: bots.map((bot) => ({
                  id: Object.keys(AVAILABLE_BOTS).find(
                    (key) => AVAILABLE_BOTS[key] === bot
                  ),
                  name: bot.name,
                  author: bot.originalAuthor,
                  stars: bot.stars,
                  github: bot.github,
                  license: bot.license,
                  description: bot.description,
                })),
                notice:
                  'All bots are MIT licensed and credited to original authors. Integration by Nicholas (@nirholas).',
              },
              null,
              2
            ),
          },
        ],
      }
    }

    case 'get_bot_info': {
      const bot = manager.getBotInfo(args.bot_id)
      if (!bot) {
        return {
          content: [
            {
              type: 'text',
              text: `Bot '${args.bot_id}' not found`,
            },
          ],
          isError: true,
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                ...bot,
                attribution: manager.getAttributionText(args.bot_id),
              },
              null,
              2
            ),
          },
        ],
      }
    }

    case 'execute_trading_bot': {
      try {
        const result = await manager.executeTrade(args)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: error.message,
            },
          ],
          isError: true,
        }
      }
    }

    case 'get_bot_attribution': {
      const attribution = manager.getAttributionText(args.bot_id)
      return {
        content: [
          {
            type: 'text',
            text: attribution,
          },
        ],
      }
    }

    default:
      return {
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      }
  }
}

export default tradingBotTools
