/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { PancakeSwapTrader } from "./pancakeswap.js"
import { TokenAnalyzer } from "./analyzer.js"
import { Logger } from "../utils/logger.js"

export class TradingStrategy {
  private trader: PancakeSwapTrader
  private analyzer: TokenAnalyzer
  private activeStrategies: Map<string, any> = new Map()

  constructor(privateKey: string) {
    this.trader = new PancakeSwapTrader(privateKey)
    this.analyzer = new TokenAnalyzer()
  }

  getStrategyConfig(strategy: string): any {
    const configs: Record<string, any> = {
      scalp: {
        profitTarget: 20,
        stopLoss: 10,
        checkInterval: 30, // seconds
        partialTakeProfit: [
          { at: 10, sell: 25 }, // Sell 25% at 10% profit
          { at: 15, sell: 25 }  // Sell 25% at 15% profit
        ]
      },
      swing: {
        profitTarget: 100,
        stopLoss: 50,
        checkInterval: 300, // 5 minutes
        partialTakeProfit: [
          { at: 50, sell: 30 },
          { at: 75, sell: 30 }
        ]
      },
      hodl: {
        profitTarget: 500,
        stopLoss: 30,
        checkInterval: 3600, // 1 hour
        partialTakeProfit: [
          { at: 200, sell: 25 },
          { at: 350, sell: 25 }
        ]
      }
    }

    return configs[strategy] || configs.swing
  }

  async startAutoTrading(params: {
    tokenAddress: string
    profitTarget: number
    stopLoss: number
    trailingStop: boolean
    checkInterval: number
    partialTakeProfit: any[]
  }): Promise<any> {
    Logger.info(`Starting auto-trading for ${params.tokenAddress}`)

    // Get initial position
    const currentPrice = await this.trader.getPrice(params.tokenAddress)
    
    const strategyData = {
      tokenAddress: params.tokenAddress,
      entryPrice: parseFloat(currentPrice),
      profitTarget: params.profitTarget,
      stopLoss: params.stopLoss,
      trailingStop: params.trailingStop,
      checkInterval: params.checkInterval,
      partialTakeProfit: params.partialTakeProfit,
      highestPrice: parseFloat(currentPrice),
      partialsSold: [] as number[],
      active: true
    }

    this.activeStrategies.set(params.tokenAddress, strategyData)

    // Start monitoring in background
    this.monitorPosition(params.tokenAddress)

    return {
      position: {
        tokenAddress: params.tokenAddress,
        entryPrice: currentPrice,
        currentPrice: currentPrice,
        profitLoss: "0%"
      }
    }
  }

  private async monitorPosition(tokenAddress: string) {
    const strategy = this.activeStrategies.get(tokenAddress)
    if (!strategy || !strategy.active) return

    try {
      // Get current price
      const currentPrice = parseFloat(await this.trader.getPrice(tokenAddress))
      const entryPrice = strategy.entryPrice
      
      // Calculate profit/loss
      const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100

      Logger.info(`${tokenAddress}: Current P/L: ${profitPercent.toFixed(2)}%`)

      // Update highest price for trailing stop
      if (currentPrice > strategy.highestPrice) {
        strategy.highestPrice = currentPrice
      }

      // Check stop loss
      if (profitPercent <= -strategy.stopLoss) {
        Logger.warn(`Stop loss triggered at ${profitPercent.toFixed(2)}%`)
        await this.executeSell(tokenAddress, 100, "Stop Loss")
        strategy.active = false
        return
      }

      // Check trailing stop
      if (strategy.trailingStop) {
        const drawdownFromHigh = ((strategy.highestPrice - currentPrice) / strategy.highestPrice) * 100
        if (drawdownFromHigh >= 20) { // 20% drawdown from high
          Logger.info(`Trailing stop triggered at ${profitPercent.toFixed(2)}%`)
          await this.executeSell(tokenAddress, 100, "Trailing Stop")
          strategy.active = false
          return
        }
      }

      // Check profit target
      if (profitPercent >= strategy.profitTarget) {
        Logger.info(`Profit target reached at ${profitPercent.toFixed(2)}%`)
        await this.executeSell(tokenAddress, 100, "Profit Target")
        strategy.active = false
        return
      }

      // Check partial take profits
      for (const partial of strategy.partialTakeProfit) {
        if (profitPercent >= partial.at && !strategy.partialsSold.includes(partial.at)) {
          Logger.info(`Partial take profit at ${profitPercent.toFixed(2)}%`)
          await this.executeSell(tokenAddress, partial.sell, `Partial ${partial.at}%`)
          strategy.partialsSold.push(partial.at)
        }
      }

      // Schedule next check
      setTimeout(() => this.monitorPosition(tokenAddress), strategy.checkInterval * 1000)

    } catch (error) {
      Logger.error(`Error monitoring ${tokenAddress}:`, error)
      // Retry after interval
      setTimeout(() => this.monitorPosition(tokenAddress), strategy.checkInterval * 1000)
    }
  }

  private async executeSell(tokenAddress: string, percentage: number, reason: string) {
    try {
      Logger.info(`Executing auto-sell: ${percentage}% - Reason: ${reason}`)
      
      await this.trader.sellToken({
        tokenAddress,
        percentage,
        slippage: 15
      })

      Logger.info(`✅ Auto-sell completed: ${percentage}%`)
    } catch (error) {
      Logger.error("Auto-sell failed:", error)
    }
  }

  stopAutoTrading(tokenAddress: string) {
    const strategy = this.activeStrategies.get(tokenAddress)
    if (strategy) {
      strategy.active = false
      this.activeStrategies.delete(tokenAddress)
      Logger.info(`Stopped auto-trading for ${tokenAddress}`)
    }
  }
}
