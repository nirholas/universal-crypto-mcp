/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"
import { PancakeSwapTrader } from "../services/pancakeswap.js"
import { TokenAnalyzer } from "../services/analyzer.js"
import { TradingStrategy } from "../services/strategy.js"
import { PositionManager } from "../services/positions.js"
import { RiskManager } from "../services/risk.js"

/**
 * Register all meme trading bot tools
 */
export function registerTradingTools(server: McpServer) {

  // Tool 1: Buy meme coin
  server.tool(
    "meme_buy_token",
    "Buy a meme coin on PancakeSwap with automatic slippage and gas optimization",
    {
      tokenAddress: z.string().describe("Token contract address"),
      amountBNB: z.string().describe("Amount of BNB to spend"),
      slippage: z.number().default(15).describe("Slippage tolerance % (default: 15)"),
      privateKey: z.string().describe("Wallet private key"),
      maxGasPrice: z.string().optional().describe("Max gas price in gwei"),
      autoSell: z.boolean().default(false).describe("Enable auto-sell at profit target")
    },
    async (params) => {
      try {
        const trader = new PancakeSwapTrader(params.privateKey)
        
        // Analyze token before buying
        const analyzer = new TokenAnalyzer()
        const analysis = await analyzer.analyzeToken(params.tokenAddress)
        
        if (analysis.isScam) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: "Token failed safety checks",
                reasons: analysis.scamReasons,
                recommendation: "DO NOT BUY"
              }, null, 2)
            }]
          }
        }

        // Execute buy
        const result = await trader.buyToken({
          tokenAddress: params.tokenAddress,
          amountBNB: params.amountBNB,
          slippage: params.slippage,
          maxGasPrice: params.maxGasPrice
        })

        // Set up auto-sell if requested
        if (params.autoSell && result.success) {
          const posManager = new PositionManager(params.privateKey)
          await posManager.trackPosition({
            tokenAddress: params.tokenAddress,
            entryPrice: result.price,
            amount: result.tokensReceived,
            profitTarget: 100, // 100% profit
            stopLoss: 50 // 50% loss
          })
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: result.success,
              txHash: result.txHash,
              tokenAddress: params.tokenAddress,
              bnbSpent: params.amountBNB,
              tokensReceived: result.tokensReceived,
              price: result.price,
              gasCost: result.gasCost,
              slippage: result.actualSlippage,
              autoSellEnabled: params.autoSell,
              explorerUrl: `https://bscscan.com/tx/${result.txHash}`,
              tokenAnalysis: {
                safetyScore: analysis.safetyScore,
                liquidityUSD: analysis.liquidityUSD,
                holders: analysis.holders,
                warnings: analysis.warnings
              }
            }, null, 2)
          }]
        }

      } catch (error: any) {
        Logger.error("Error buying token:", error)
        throw new Error(`Failed to buy token: ${error.message}`)
      }
    }
  )

  // Tool 2: Sell meme coin
  server.tool(
    "meme_sell_token",
    "Sell a meme coin on PancakeSwap at current market price",
    {
      tokenAddress: z.string().describe("Token contract address"),
      percentage: z.number().default(100).describe("Percentage of holdings to sell (default: 100)"),
      slippage: z.number().default(15).describe("Slippage tolerance %"),
      privateKey: z.string().describe("Wallet private key"),
      minBNBOut: z.string().optional().describe("Minimum BNB to receive")
    },
    async (params) => {
      try {
        const trader = new PancakeSwapTrader(params.privateKey)

        const result = await trader.sellToken({
          tokenAddress: params.tokenAddress,
          percentage: params.percentage,
          slippage: params.slippage,
          minBNBOut: params.minBNBOut
        })

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: result.success,
              txHash: result.txHash,
              tokenAddress: params.tokenAddress,
              tokensSold: result.tokensSold,
              bnbReceived: result.bnbReceived,
              price: result.price,
              profitLoss: result.profitLoss,
              profitPercent: result.profitPercent,
              gasCost: result.gasCost,
              explorerUrl: `https://bscscan.com/tx/${result.txHash}`
            }, null, 2)
          }]
        }

      } catch (error: any) {
        Logger.error("Error selling token:", error)
        throw new Error(`Failed to sell token: ${error.message}`)
      }
    }
  )

  // Tool 3: Analyze meme coin
  server.tool(
    "meme_analyze_token",
    "Deep analysis of a meme coin - check for scams, liquidity, holders, and trading potential",
    {
      tokenAddress: z.string().describe("Token contract address")
    },
    async (params) => {
      try {
        const analyzer = new TokenAnalyzer()
        const analysis = await analyzer.analyzeToken(params.tokenAddress)

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              tokenAddress: params.tokenAddress,
              name: analysis.name,
              symbol: analysis.symbol,
              
              // Safety Analysis
              safety: {
                score: analysis.safetyScore,
                isScam: analysis.isScam,
                warnings: analysis.warnings,
                honeypot: analysis.isHoneypot,
                canSell: analysis.canSell
              },
              
              // Liquidity Analysis
              liquidity: {
                totalUSD: analysis.liquidityUSD,
                locked: analysis.liquidityLocked,
                lockDuration: analysis.lockDuration
              },
              
              // Holder Analysis
              holders: {
                total: analysis.holders,
                topHolderPercent: analysis.topHolderPercent,
                distribution: analysis.holderDistribution
              },
              
              // Contract Analysis
              contract: {
                verified: analysis.isVerified,
                hasProxy: analysis.hasProxy,
                hasMintFunction: analysis.hasMint,
                canPause: analysis.canPause,
                ownerAddress: analysis.owner
              },
              
              // Trading Metrics
              trading: {
                price: analysis.price,
                priceChange24h: analysis.priceChange24h,
                volume24h: analysis.volume24h,
                marketCap: analysis.marketCap,
                buyTax: analysis.buyTax,
                sellTax: analysis.sellTax
              },
              
              // Recommendation
              recommendation: analysis.recommendation,
              riskLevel: analysis.riskLevel
              
            }, null, 2)
          }]
        }

      } catch (error: any) {
        Logger.error("Error analyzing token:", error)
        throw new Error(`Failed to analyze token: ${error.message}`)
      }
    }
  )

  // Tool 4: Auto-trade strategy
  server.tool(
    "meme_start_autotrading",
    "Start automated trading with profit targets and stop losses",
    {
      tokenAddress: z.string().describe("Token contract address"),
      strategy: z.enum(["scalp", "swing", "hodl"]).default("swing"),
      profitTarget: z.number().default(100).describe("Profit target % (default: 100)"),
      stopLoss: z.number().default(50).describe("Stop loss % (default: 50)"),
      trailingStop: z.boolean().default(true).describe("Enable trailing stop"),
      privateKey: z.string().describe("Wallet private key")
    },
    async (params) => {
      try {
        const strategy = new TradingStrategy(params.privateKey)
        
        const config = strategy.getStrategyConfig(params.strategy)
        
        // Start automated trading
        const result = await strategy.startAutoTrading({
          tokenAddress: params.tokenAddress,
          profitTarget: params.profitTarget,
          stopLoss: params.stopLoss,
          trailingStop: params.trailingStop,
          checkInterval: config.checkInterval,
          partialTakeProfit: config.partialTakeProfit
        })

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: "active",
              tokenAddress: params.tokenAddress,
              strategy: params.strategy,
              settings: {
                profitTarget: `${params.profitTarget}%`,
                stopLoss: `${params.stopLoss}%`,
                trailingStop: params.trailingStop,
                checkInterval: `${config.checkInterval}s`,
                partialTakeProfit: config.partialTakeProfit
              },
              currentPosition: result.position,
              monitoring: "Running in background",
              stopCommand: "Use meme_stop_autotrading to stop"
            }, null, 2)
          }]
        }

      } catch (error: any) {
        Logger.error("Error starting auto-trading:", error)
        throw new Error(`Failed to start auto-trading: ${error.message}`)
      }
    }
  )

  // Tool 5: Check positions
  server.tool(
    "meme_check_positions",
    "Check all open meme coin positions with profit/loss calculations",
    {
      privateKey: z.string().describe("Wallet private key")
    },
    async (params) => {
      try {
        const posManager = new PositionManager(params.privateKey)
        const positions = await posManager.getAllPositions()

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              totalPositions: positions.length,
              totalValue: positions.reduce((sum, p) => sum + p.currentValueBNB, 0),
              totalProfitLoss: positions.reduce((sum, p) => sum + p.profitLossBNB, 0),
              positions: positions.map(p => ({
                token: p.tokenAddress,
                symbol: p.symbol,
                entryPrice: p.entryPrice,
                currentPrice: p.currentPrice,
                amount: p.amount,
                valueBNB: p.currentValueBNB,
                profitLoss: p.profitLossBNB,
                profitPercent: p.profitPercent,
                status: p.profitPercent > 0 ? "🟢 Profit" : "🔴 Loss",
                autoSellEnabled: p.autoSellEnabled,
                profitTarget: p.profitTarget,
                stopLoss: p.stopLoss
              }))
            }, null, 2)
          }]
        }

      } catch (error: any) {
        Logger.error("Error checking positions:", error)
        throw new Error(`Failed to check positions: ${error.message}`)
      }
    }
  )

  // Tool 6: Find new meme coins
  server.tool(
    "meme_find_new_tokens",
    "Scan for newly launched meme coins on BSC with safety filters",
    {
      minLiquidityUSD: z.number().default(10000).describe("Minimum liquidity in USD"),
      maxAge: z.number().default(24).describe("Maximum token age in hours"),
      minHolders: z.number().default(50).describe("Minimum number of holders")
    },
    async (params) => {
      try {
        const analyzer = new TokenAnalyzer()
        const newTokens = await analyzer.findNewTokens({
          minLiquidityUSD: params.minLiquidityUSD,
          maxAge: params.maxAge,
          minHolders: params.minHolders
        })

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              totalFound: newTokens.length,
              filters: {
                minLiquidity: `$${params.minLiquidityUSD}`,
                maxAge: `${params.maxAge}h`,
                minHolders: params.minHolders
              },
              tokens: newTokens.map(t => ({
                address: t.address,
                name: t.name,
                symbol: t.symbol,
                age: `${t.ageHours}h`,
                liquidity: `$${t.liquidityUSD}`,
                holders: t.holders,
                priceChange: `${t.priceChange}%`,
                safetyScore: t.safetyScore,
                buyLink: `https://pancakeswap.finance/swap?outputCurrency=${t.address}`
              })).slice(0, 20)
            }, null, 2)
          }]
        }

      } catch (error: any) {
        Logger.error("Error finding new tokens:", error)
        throw new Error(`Failed to find new tokens: ${error.message}`)
      }
    }
  )

  // Tool 7: Set risk limits
  server.tool(
    "meme_set_risk_limits",
    "Configure risk management settings for trading bot",
    {
      maxPositionSize: z.string().describe("Max BNB per trade"),
      maxTotalExposure: z.string().describe("Max total BNB at risk"),
      maxDailyLoss: z.string().describe("Max daily loss in BNB"),
      maxSlippage: z.number().describe("Maximum slippage %"),
      privateKey: z.string().describe("Wallet private key")
    },
    async (params) => {
      try {
        const riskManager = new RiskManager(params.privateKey)
        
        await riskManager.setLimits({
          maxPositionSize: params.maxPositionSize,
          maxTotalExposure: params.maxTotalExposure,
          maxDailyLoss: params.maxDailyLoss,
          maxSlippage: params.maxSlippage
        })

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: "Risk limits updated",
              limits: {
                maxPositionSize: `${params.maxPositionSize} BNB`,
                maxTotalExposure: `${params.maxTotalExposure} BNB`,
                maxDailyLoss: `${params.maxDailyLoss} BNB`,
                maxSlippage: `${params.maxSlippage}%`
              },
              message: "All new trades will respect these limits"
            }, null, 2)
          }]
        }

      } catch (error: any) {
        Logger.error("Error setting risk limits:", error)
        throw new Error(`Failed to set risk limits: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered meme trading bot tools")
}
