/**
 * Portfolio Manager Service
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { EventEmitter } from 'events'
import { Position, Trade, TokenMetrics } from '../types'
import { DatabaseService } from './database'
import { JupiterService } from './jupiter'
import { RiskManagementService } from './risk'
import { config, WSOL } from '../config/config'

export interface PortfolioStats {
  totalValue: number
  totalCost: number
  totalPnL: number
  totalPnLPercent: number
  openPositions: number
  closedPositions: number
  winRate: number
  avgWin: number
  avgLoss: number
  bestTrade: number
  worstTrade: number
}

export class PortfolioManager extends EventEmitter {
  private database: DatabaseService
  private jupiter: JupiterService
  private risk: RiskManagementService
  private positions: Map<string, Position> = new Map()
  private priceUpdateInterval: NodeJS.Timeout | null = null
  
  constructor(
    database: DatabaseService,
    jupiter: JupiterService,
    risk: RiskManagementService
  ) {
    super()
    this.database = database
    this.jupiter = jupiter
    this.risk = risk
  }
  
  /**
   * Initialize portfolio manager
   */
  async initialize(): Promise<void> {
    // Load open positions from database
    const openPositions = await this.database.getOpenPositions()
    
    for (const position of openPositions) {
      this.positions.set(position.tokenAddress, position)
    }
    
    console.log(`📊 Loaded ${openPositions.length} open positions`)
    
    // Start price monitoring
    this.startPriceMonitoring()
  }
  
  /**
   * Open a new position
   */
  async openPosition(
    tokenAddress: string,
    symbol: string,
    entryPrice: number,
    amount: string,
    costBasis: number
  ): Promise<Position> {
    const position: Position = {
      id: `${Date.now()}-${tokenAddress}`,
      tokenAddress,
      symbol,
      entryPrice,
      currentPrice: entryPrice,
      amount,
      costBasis,
      currentValue: costBasis,
      pnl: 0,
      pnlPercent: 0,
      stopLoss: config.stopLoss,
      takeProfit: config.takeProfit,
      trailingStop: config.trailingStop,
      highestPrice: entryPrice,
      openedAt: new Date(),
      updatedAt: new Date(),
      status: 'open'
    }
    
    // Save to database
    await this.database.savePosition(position)
    
    // Add to active positions
    this.positions.set(tokenAddress, position)
    
    this.emit('positionOpened', position)
    console.log(`✅ Opened position: ${symbol} at ${entryPrice}`)
    
    return position
  }
  
  /**
   * Close a position
   */
  async closePosition(
    tokenAddress: string,
    exitPrice: number,
    reason: string
  ): Promise<Position | null> {
    const position = this.positions.get(tokenAddress)
    if (!position) {
      return null
    }
    
    // Calculate final PnL
    const finalPnL = (exitPrice - position.entryPrice) * parseFloat(position.amount)
    const finalPnLPercent = ((exitPrice - position.entryPrice) / position.entryPrice) * 100
    
    // Update position
    const closedPosition: Position = {
      ...position,
      currentPrice: exitPrice,
      currentValue: exitPrice * parseFloat(position.amount),
      pnl: finalPnL,
      pnlPercent: finalPnLPercent,
      status: 'closed',
      updatedAt: new Date()
    }
    
    // Save to database
    await this.database.updatePosition(closedPosition)
    
    // Remove from active positions
    this.positions.delete(tokenAddress)
    
    // Record trade for risk management
    this.risk.recordTrade({
      id: closedPosition.id,
      tokenAddress,
      type: 'sell',
      amountIn: position.amount,
      amountOut: '0',
      price: exitPrice,
      timestamp: new Date(),
      txSignature: '',
      status: 'success'
    }, finalPnL)
    
    this.emit('positionClosed', { position: closedPosition, reason })
    console.log(`🔒 Closed position: ${position.symbol} at ${exitPrice} (${reason}) - PnL: ${finalPnL.toFixed(4)} SOL (${finalPnLPercent.toFixed(2)}%)`)
    
    return closedPosition
  }
  
  /**
   * Update position price
   */
  async updatePositionPrice(tokenAddress: string, currentPrice: number): Promise<void> {
    const position = this.positions.get(tokenAddress)
    if (!position) return
    
    // Update with trailing stop logic
    const updated = this.risk.updateTrailingStop(position, currentPrice)
    updated.currentValue = currentPrice * parseFloat(position.amount)
    
    // Check if should close
    const closeCheck = this.risk.shouldClosePosition(updated)
    if (closeCheck.should) {
      await this.closePosition(tokenAddress, currentPrice, closeCheck.reason!)
      return
    }
    
    // Update position
    this.positions.set(tokenAddress, updated)
    await this.database.updatePosition(updated)
    
    this.emit('positionUpdated', updated)
  }
  
  /**
   * Get all open positions
   */
  getOpenPositions(): Position[] {
    return Array.from(this.positions.values())
  }
  
  /**
   * Get position by token address
   */
  getPosition(tokenAddress: string): Position | undefined {
    return this.positions.get(tokenAddress)
  }
  
  /**
   * Get portfolio statistics
   */
  async getPortfolioStats(): Promise<PortfolioStats> {
    const openPositions = this.getOpenPositions()
    const closedPositions = await this.database.getClosedPositions()
    
    // Calculate totals for open positions
    const totalValue = openPositions.reduce((sum, pos) => sum + pos.currentValue, 0)
    const totalCost = openPositions.reduce((sum, pos) => sum + pos.costBasis, 0)
    const totalPnL = openPositions.reduce((sum, pos) => sum + pos.pnl, 0)
    
    // Calculate win rate from closed positions
    const wins = closedPositions.filter(pos => pos.pnl > 0)
    const losses = closedPositions.filter(pos => pos.pnl <= 0)
    const winRate = closedPositions.length > 0 ? wins.length / closedPositions.length : 0
    
    const avgWin = wins.length > 0 
      ? wins.reduce((sum, pos) => sum + pos.pnl, 0) / wins.length 
      : 0
    
    const avgLoss = losses.length > 0
      ? losses.reduce((sum, pos) => sum + pos.pnl, 0) / losses.length
      : 0
    
    const allPnLs = closedPositions.map(pos => pos.pnl)
    const bestTrade = allPnLs.length > 0 ? Math.max(...allPnLs) : 0
    const worstTrade = allPnLs.length > 0 ? Math.min(...allPnLs) : 0
    
    return {
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent: totalCost > 0 ? (totalPnL / totalCost) * 100 : 0,
      openPositions: openPositions.length,
      closedPositions: closedPositions.length,
      winRate,
      avgWin,
      avgLoss,
      bestTrade,
      worstTrade
    }
  }
  
  /**
   * Start monitoring prices for all positions
   */
  private startPriceMonitoring(): void {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval)
    }
    
    this.priceUpdateInterval = setInterval(
      async () => {
        const positions = this.getOpenPositions()
        if (positions.length === 0) return
        
        try {
          // Get all token addresses
          const tokenAddresses = positions.map(pos => pos.tokenAddress)
          
          // Fetch prices in batch
          const prices = await this.jupiter.getTokenPrices(tokenAddresses)
          
          // Update each position
          for (const position of positions) {
            const price = prices.get(position.tokenAddress)
            if (price) {
              await this.updatePositionPrice(position.tokenAddress, price)
            }
          }
        } catch (error) {
          console.error('Error updating position prices:', error)
        }
      },
      config.priceUpdateInterval
    )
    
    console.log('📈 Started price monitoring')
  }
  
  /**
   * Stop price monitoring
   */
  stopPriceMonitoring(): void {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval)
      this.priceUpdateInterval = null
      console.log('Price monitoring stopped')
    }
  }
  
  /**
   * Check if we can open new position
   */
  canOpenPosition(amountSOL: number): { allowed: boolean, reason?: string } {
    return this.risk.canExecuteTrade(amountSOL, this.getOpenPositions())
  }
}
