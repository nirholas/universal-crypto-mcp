/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { ethers } from "ethers"
import { Logger } from "../utils/logger.js"
import { PancakeSwapTrader } from "./pancakeswap.js"

const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
]

interface Position {
  tokenAddress: string
  symbol: string
  entryPrice: number
  currentPrice: number
  amount: string
  currentValueBNB: number
  profitLossBNB: number
  profitPercent: number
  autoSellEnabled: boolean
  profitTarget?: number
  stopLoss?: number
  entryTime: number
}

export class PositionManager {
  private provider: ethers.Provider
  private wallet: ethers.Wallet
  private positions: Map<string, any> = new Map()

  constructor(privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(
      process.env.BSC_RPC_URL || "https://bsc-dataseed1.binance.org"
    )
    this.wallet = new ethers.Wallet(privateKey, this.provider)
  }

  async trackPosition(params: {
    tokenAddress: string
    entryPrice: number
    amount: string
    profitTarget: number
    stopLoss: number
  }) {
    this.positions.set(params.tokenAddress, {
      entryPrice: params.entryPrice,
      amount: params.amount,
      profitTarget: params.profitTarget,
      stopLoss: params.stopLoss,
      entryTime: Date.now()
    })

    Logger.info(`Tracking position for ${params.tokenAddress}`)
  }

  async getAllPositions(): Promise<Position[]> {
    const positions: Position[] = []

    try {
      // Get all ERC20 tokens the wallet holds
      // In production, would track from database or events
      const trackedTokens = Array.from(this.positions.keys())

      for (const tokenAddress of trackedTokens) {
        try {
          const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)
          
          const [balance, decimals, symbol] = await Promise.all([
            token.balanceOf(this.wallet.address),
            token.decimals(),
            token.symbol()
          ])

          if (balance === 0n) {
            // Position closed
            this.positions.delete(tokenAddress)
            continue
          }

          const amount = ethers.formatUnits(balance, decimals)
          
          // Get current price
          const trader = new PancakeSwapTrader(this.wallet.privateKey)
          const currentPrice = parseFloat(await trader.getPrice(tokenAddress))
          
          const positionData = this.positions.get(tokenAddress)
          const entryPrice = positionData?.entryPrice || currentPrice

          // Calculate current value in BNB (approximate)
          const currentValueBNB = parseFloat(amount) * currentPrice

          // Calculate P/L
          const entryValueBNB = parseFloat(amount) * entryPrice
          const profitLossBNB = currentValueBNB - entryValueBNB
          const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100

          positions.push({
            tokenAddress,
            symbol,
            entryPrice,
            currentPrice,
            amount,
            currentValueBNB,
            profitLossBNB,
            profitPercent,
            autoSellEnabled: !!positionData,
            profitTarget: positionData?.profitTarget,
            stopLoss: positionData?.stopLoss,
            entryTime: positionData?.entryTime || Date.now()
          })

        } catch (error) {
          Logger.error(`Error getting position for ${tokenAddress}:`, error)
        }
      }

      return positions

    } catch (error) {
      Logger.error("Error getting all positions:", error)
      return []
    }
  }

  async getPosition(tokenAddress: string): Promise<Position | null> {
    const positions = await this.getAllPositions()
    return positions.find(p => p.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()) || null
  }

  removePosition(tokenAddress: string) {
    this.positions.delete(tokenAddress)
    Logger.info(`Removed position tracking for ${tokenAddress}`)
  }
}
