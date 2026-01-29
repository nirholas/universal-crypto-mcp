/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { ethers } from "ethers"
import { Logger } from "../utils/logger.js"
import { PositionManager } from "./positions.js"

interface RiskLimits {
  maxPositionSizeBNB: number
  maxTotalExposureBNB: number
  maxPositions: number
  minLiquidityBNB: number
  maxSlippagePercent: number
  emergencyStopLossPercent: number
}

export class RiskManager {
  private provider: ethers.Provider
  private wallet: ethers.Wallet
  private positionManager: PositionManager
  private limits: RiskLimits

  constructor(privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(
      process.env.BSC_RPC_URL || "https://bsc-dataseed1.binance.org"
    )
    this.wallet = new ethers.Wallet(privateKey, this.provider)
    this.positionManager = new PositionManager(privateKey)

    // Default risk limits
    this.limits = {
      maxPositionSizeBNB: 1.0, // Max 1 BNB per position
      maxTotalExposureBNB: 5.0, // Max 5 BNB total exposure
      maxPositions: 10, // Max 10 concurrent positions
      minLiquidityBNB: 10.0, // Min 10 BNB liquidity to trade
      maxSlippagePercent: 10, // Max 10% slippage
      emergencyStopLossPercent: -50 // Emergency stop at -50%
    }
  }

  setLimits(limits: Partial<RiskLimits>) {
    this.limits = { ...this.limits, ...limits }
    Logger.info("Risk limits updated:", this.limits)
  }

  getLimits(): RiskLimits {
    return { ...this.limits }
  }

  async validateTrade(params: {
    tokenAddress: string
    amountBNB: number
    liquidityBNB: number
  }): Promise<{ valid: boolean; reason?: string }> {
    // Check position size limit
    if (params.amountBNB > this.limits.maxPositionSizeBNB) {
      return {
        valid: false,
        reason: `Position size ${params.amountBNB} BNB exceeds limit of ${this.limits.maxPositionSizeBNB} BNB`
      }
    }

    // Check liquidity requirement
    if (params.liquidityBNB < this.limits.minLiquidityBNB) {
      return {
        valid: false,
        reason: `Liquidity ${params.liquidityBNB} BNB below minimum ${this.limits.minLiquidityBNB} BNB`
      }
    }

    // Check current exposure
    const positions = await this.positionManager.getAllPositions()
    const currentExposure = positions.reduce((sum, p) => sum + p.currentValueBNB, 0)

    if (currentExposure + params.amountBNB > this.limits.maxTotalExposureBNB) {
      return {
        valid: false,
        reason: `Adding ${params.amountBNB} BNB would exceed max exposure of ${this.limits.maxTotalExposureBNB} BNB (current: ${currentExposure.toFixed(2)} BNB)`
      }
    }

    // Check position count limit
    if (positions.length >= this.limits.maxPositions) {
      return {
        valid: false,
        reason: `Already at max positions limit (${this.limits.maxPositions})`
      }
    }

    return { valid: true }
  }

  async checkEmergencyStops(): Promise<string[]> {
    const actions: string[] = []
    const positions = await this.positionManager.getAllPositions()

    for (const position of positions) {
      // Emergency stop loss check
      if (position.profitPercent <= this.limits.emergencyStopLossPercent) {
        actions.push(
          `EMERGENCY STOP: ${position.symbol} at ${position.profitPercent.toFixed(2)}% loss (limit: ${this.limits.emergencyStopLossPercent}%)`
        )
      }

      // Warning for significant losses
      if (position.profitPercent <= -20 && position.profitPercent > this.limits.emergencyStopLossPercent) {
        actions.push(
          `WARNING: ${position.symbol} at ${position.profitPercent.toFixed(2)}% loss`
        )
      }
    }

    return actions
  }

  async getPortfolioSummary() {
    const positions = await this.positionManager.getAllPositions()
    const balance = await this.provider.getBalance(this.wallet.address)
    const balanceBNB = parseFloat(ethers.formatEther(balance))

    const totalValueBNB = positions.reduce((sum, p) => sum + p.currentValueBNB, 0)
    const totalProfitLoss = positions.reduce((sum, p) => sum + p.profitLossBNB, 0)
    const totalPortfolio = balanceBNB + totalValueBNB

    return {
      walletBalance: balanceBNB,
      positionsValue: totalValueBNB,
      totalPortfolio,
      totalProfitLoss,
      positionCount: positions.length,
      limits: this.limits,
      utilizationPercent: (totalValueBNB / this.limits.maxTotalExposureBNB) * 100,
      positions: positions.map(p => ({
        symbol: p.symbol,
        valueBNB: p.currentValueBNB,
        profitPercent: p.profitPercent,
        profitLossBNB: p.profitLossBNB
      }))
    }
  }

  calculatePositionSize(params: {
    availableBalance: number
    riskPercent: number // % of balance to risk
  }): number {
    const riskAmount = params.availableBalance * (params.riskPercent / 100)
    return Math.min(riskAmount, this.limits.maxPositionSizeBNB)
  }
}
