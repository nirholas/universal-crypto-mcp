/**
 * MCP Server for Memecoin Trading Bot
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'
import { MemecoinTradingBot } from './bot'

// Global bot instance
let bot: MemecoinTradingBot | null = null

// Create MCP server
const server = new Server(
  {
    name: 'memecoin-trading-bot',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'start_bot',
        description: 'Start the memecoin trading bot',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'stop_bot',
        description: 'Stop the trading bot',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'get_status',
        description: 'Get current bot status and portfolio performance',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'get_positions',
        description: 'Get all open trading positions',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'close_position',
        description: 'Manually close a trading position',
        inputSchema: {
          type: 'object',
          properties: {
            tokenAddress: {
              type: 'string',
              description: 'Token address of the position to close'
            },
            reason: {
              type: 'string',
              description: 'Reason for closing the position',
              default: 'Manual close'
            }
          },
          required: ['tokenAddress']
        }
      },
      {
        name: 'get_portfolio_stats',
        description: 'Get detailed portfolio statistics including PnL, win rate, and trade history',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    ]
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  
  try {
    switch (name) {
      case 'start_bot': {
        if (bot && bot.getStatus().running) {
          return {
            content: [{
              type: 'text',
              text: '⚠️  Bot is already running'
            }]
          }
        }
        
        bot = new MemecoinTradingBot()
        await bot.start()
        
        return {
          content: [{
            type: 'text',
            text: '✅ Trading bot started successfully'
          }]
        }
      }
      
      case 'stop_bot': {
        if (!bot) {
          return {
            content: [{
              type: 'text',
              text: '⚠️  Bot is not running'
            }]
          }
        }
        
        await bot.stop()
        bot = null
        
        return {
          content: [{
            type: 'text',
            text: '✅ Trading bot stopped'
          }]
        }
      }
      
      case 'get_status': {
        if (!bot) {
          return {
            content: [{
              type: 'text',
              text: '⚠️  Bot is not running. Start it first with start_bot'
            }]
          }
        }
        
        const status = bot.getStatus()
        const balance = await status.balance
        const stats = await status.stats
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              running: status.running,
              balance: `${balance.toFixed(4)} SOL`,
              openPositions: status.positions,
              totalPnL: `${stats.totalPnL.toFixed(4)} SOL`,
              totalPnLPercent: `${stats.totalPnLPercent.toFixed(2)}%`,
              winRate: `${(stats.winRate * 100).toFixed(2)}%`,
              closedTrades: stats.closedPositions,
              riskLimits: status.risk
            }, null, 2)
          }]
        }
      }
      
      case 'get_positions': {
        if (!bot) {
          return {
            content: [{
              type: 'text',
              text: '⚠️  Bot is not running'
            }]
          }
        }
        
        const status = bot.getStatus()
        const positions = bot['portfolio'].getOpenPositions()
        
        if (positions.length === 0) {
          return {
            content: [{
              type: 'text',
              text: 'No open positions'
            }]
          }
        }
        
        const positionsData = positions.map(pos => ({
          symbol: pos.symbol,
          tokenAddress: pos.tokenAddress,
          entryPrice: pos.entryPrice,
          currentPrice: pos.currentPrice,
          amount: pos.amount,
          costBasis: `${pos.costBasis.toFixed(4)} SOL`,
          currentValue: `${pos.currentValue.toFixed(4)} SOL`,
          pnl: `${pos.pnl.toFixed(4)} SOL`,
          pnlPercent: `${pos.pnlPercent.toFixed(2)}%`,
          stopLoss: `${pos.stopLoss}%`,
          takeProfit: `${pos.takeProfit}%`,
          openedAt: pos.openedAt.toISOString()
        }))
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(positionsData, null, 2)
          }]
        }
      }
      
      case 'close_position': {
        if (!bot) {
          return {
            content: [{
              type: 'text',
              text: '⚠️  Bot is not running'
            }]
          }
        }
        
        const { tokenAddress, reason = 'Manual close' } = args as { 
          tokenAddress: string
          reason?: string 
        }
        
        await bot.executeSell(tokenAddress, reason)
        
        return {
          content: [{
            type: 'text',
            text: `✅ Position closed for token ${tokenAddress}`
          }]
        }
      }
      
      case 'get_portfolio_stats': {
        if (!bot) {
          return {
            content: [{
              type: 'text',
              text: '⚠️  Bot is not running'
            }]
          }
        }
        
        const stats = await bot['portfolio'].getPortfolioStats()
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              totalValue: `${stats.totalValue.toFixed(4)} SOL`,
              totalCost: `${stats.totalCost.toFixed(4)} SOL`,
              totalPnL: `${stats.totalPnL.toFixed(4)} SOL`,
              totalPnLPercent: `${stats.totalPnLPercent.toFixed(2)}%`,
              openPositions: stats.openPositions,
              closedPositions: stats.closedPositions,
              winRate: `${(stats.winRate * 100).toFixed(2)}%`,
              avgWin: `${stats.avgWin.toFixed(4)} SOL`,
              avgLoss: `${stats.avgLoss.toFixed(4)} SOL`,
              bestTrade: `${stats.bestTrade.toFixed(4)} SOL`,
              worstTrade: `${stats.worstTrade.toFixed(4)} SOL`
            }, null, 2)
          }]
        }
      }
      
      default:
        return {
          content: [{
            type: 'text',
            text: `Unknown tool: ${name}`
          }],
          isError: true
        }
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }],
      isError: true
    }
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Memecoin Trading Bot MCP server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
