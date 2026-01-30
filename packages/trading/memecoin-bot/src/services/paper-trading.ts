/**
 * Paper Trading Mode - Risk-Free Testing
 * Author: nich (@nirholas) - x.com/nichxbt
 * 
 * This service simulates trades without executing real transactions,
 * allowing you to test strategies safely.
 */

import { EventEmitter } from 'events'
import { PublicKey } from '@solana/web3.js'
import { Trade, Position } from '../types'

export interface PaperTrade extends Trade {
  simulated: true
  executionPrice: number
  slippageSimulated: number
}

export interface PaperBalance {
  sol: number
  tokens: Map<string, { amount: number; value: number }>
}

export class PaperTradingService extends EventEmitter {
  private balance: PaperBalance
  private trades: PaperTrade[] = []
  private positions: Map<string, Position> = new Map()
  private startingBalance: number
  
  constructor(startingBalance: number = 10) {
    super()
    this.startingBalance = startingBalance
    this.balance = {
      sol: startingBalance,
      tokens: new Map()
    }
  }
  
  /**
   * Simulate a buy order
   */
  async simulateBuy(params: {
    tokenMint: string
    amountSol: number
    price: number
    slippage: number
  }): Promise<PaperTrade> {
    const { tokenMint, amountSol, price, slippage } = params
    
    // Check balance
    if (this.balance.sol < amountSol) {
      throw new Error('Insufficient SOL balance in paper account')
    }
    
    // Simulate slippage
    const actualSlippage = (Math.random() * slippage) - (slippage / 2)
    const executionPrice = price * (1 + actualSlippage)
    const tokensReceived = amountSol / executionPrice
    
    // Update balance
    this.balance.sol -= amountSol
    const existing = this.balance.tokens.get(tokenMint) || { amount: 0, value: 0 }
    this.balance.tokens.set(tokenMint, {
      amount: existing.amount + tokensReceived,
      value: amountSol
    })
    
    // Create trade record
    const trade: PaperTrade = {
      id: Date.now().toString(),
      tokenMint,
      type: 'buy',
      amountIn: amountSol,
      amountOut: tokensReceived,
      price: executionPrice,
      timestamp: Date.now(),
      txHash: 'SIMULATED',
      simulated: true,
      executionPrice,
      slippageSimulated: actualSlippage
    }
    
    this.trades.push(trade)
    this.emit('trade', trade)
    
    // Create position
    const position: Position = {
      id: Date.now().toString(),
      tokenMint,
      amountIn: amountSol,
      amountOut: tokensReceived,
      entryPrice: executionPrice,
      currentPrice: executionPrice,
      openTime: Date.now(),
      highestPrice: executionPrice,
      trailingStopPrice: executionPrice * 0.95, // 5% trailing stop
      status: 'open'
    }
    
    this.positions.set(tokenMint, position)
    
    console.log(`📝 [PAPER] BUY ${tokensReceived.toFixed(2)} tokens @ ${executionPrice.toFixed(8)} SOL`)
    console.log(`   Slippage: ${(actualSlippage * 100).toFixed(2)}%`)
    console.log(`   Balance: ${this.balance.sol.toFixed(4)} SOL`)
    
    return trade
  }
  
  /**
   * Simulate a sell order
   */
  async simulateSell(params: {
    tokenMint: string
    price: number
    slippage: number
    reason: string
  }): Promise<PaperTrade | null> {
    const { tokenMint, price, slippage, reason } = params
    
    const position = this.positions.get(tokenMint)
    if (!position) {
      console.log(`⚠️  [PAPER] No position found for ${tokenMint}`)
      return null
    }
    
    const holding = this.balance.tokens.get(tokenMint)
    if (!holding || holding.amount === 0) {
      console.log(`⚠️  [PAPER] No tokens to sell for ${tokenMint}`)
      return null
    }
    
    // Simulate slippage
    const actualSlippage = (Math.random() * slippage) - (slippage / 2)
    const executionPrice = price * (1 - actualSlippage)
    const solReceived = holding.amount * executionPrice
    
    // Calculate PnL
    const pnl = solReceived - position.amountIn
    const pnlPercent = (pnl / position.amountIn) * 100
    
    // Update balance
    this.balance.sol += solReceived
    this.balance.tokens.delete(tokenMint)
    
    // Create trade record
    const trade: PaperTrade = {
      id: Date.now().toString(),
      tokenMint,
      type: 'sell',
      amountIn: holding.amount,
      amountOut: solReceived,
      price: executionPrice,
      timestamp: Date.now(),
      txHash: 'SIMULATED',
      pnl,
      pnlPercent,
      simulated: true,
      executionPrice,
      slippageSimulated: actualSlippage
    }
    
    this.trades.push(trade)
    this.emit('trade', trade)
    
    // Close position
    position.status = 'closed'
    position.closeTime = Date.now()
    position.closePrice = executionPrice
    position.pnl = pnl
    position.pnlPercent = pnlPercent
    this.positions.delete(tokenMint)
    
    console.log(`📝 [PAPER] SELL ${holding.amount.toFixed(2)} tokens @ ${executionPrice.toFixed(8)} SOL`)
    console.log(`   Reason: ${reason}`)
    console.log(`   PnL: ${pnl.toFixed(4)} SOL (${pnlPercent.toFixed(2)}%)`)
    console.log(`   Balance: ${this.balance.sol.toFixed(4)} SOL`)
    
    return trade
  }
  
  /**
   * Update position with current price
   */
  updatePosition(tokenMint: string, currentPrice: number): void {
    const position = this.positions.get(tokenMint)
    if (!position) return
    
    position.currentPrice = currentPrice
    
    // Update highest price for trailing stop
    if (currentPrice > position.highestPrice) {
      position.highestPrice = currentPrice
      position.trailingStopPrice = currentPrice * 0.95 // 5% below highest
    }
    
    // Check if trailing stop hit
    if (currentPrice <= position.trailingStopPrice) {
      this.simulateSell({
        tokenMint,
        price: currentPrice,
        slippage: 0.01,
        reason: 'Trailing stop triggered'
      })
    }
  }
  
  /**
   * Get current statistics
   */
  getStats(): {
    startingBalance: number
    currentBalance: number
    totalPnL: number
    totalPnLPercent: number
    totalTrades: number
    winningTrades: number
    losingTrades: number
    winRate: number
    averageWin: number
    averageLoss: number
    largestWin: number
    largestLoss: number
  } {
    const currentBalance = this.balance.sol
    const totalPnL = currentBalance - this.startingBalance
    const totalPnLPercent = (totalPnL / this.startingBalance) * 100
    
    const completedTrades = this.trades.filter(t => t.type === 'sell')
    const winningTrades = completedTrades.filter(t => (t.pnl || 0) > 0)
    const losingTrades = completedTrades.filter(t => (t.pnl || 0) < 0)
    
    const averageWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length
      : 0
      
    const averageLoss = losingTrades.length > 0
      ? losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length
      : 0
      
    const largestWin = winningTrades.length > 0
      ? Math.max(...winningTrades.map(t => t.pnl || 0))
      : 0
      
    const largestLoss = losingTrades.length > 0
      ? Math.min(...losingTrades.map(t => t.pnl || 0))
      : 0
    
    return {
      startingBalance: this.startingBalance,
      currentBalance,
      totalPnL,
      totalPnLPercent,
      totalTrades: this.trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss
    }
  }
  
  /**
   * Get all trades
   */
  getTrades(): PaperTrade[] {
    return this.trades
  }
  
  /**
   * Get current positions
   */
  getPositions(): Position[] {
    return Array.from(this.positions.values())
  }
  
  /**
   * Reset paper trading account
   */
  reset(): void {
    this.balance = {
      sol: this.startingBalance,
      tokens: new Map()
    }
    this.trades = []
    this.positions.clear()
    console.log(`🔄 [PAPER] Account reset to ${this.startingBalance} SOL`)
  }
  
  /**
   * Print detailed report
   */
  printReport(): void {
    const stats = this.getStats()
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 PAPER TRADING REPORT')
    console.log('='.repeat(60))
    console.log(`Starting Balance:  ${stats.startingBalance.toFixed(4)} SOL`)
    console.log(`Current Balance:   ${stats.currentBalance.toFixed(4)} SOL`)
    console.log(`Total PnL:         ${stats.totalPnL.toFixed(4)} SOL (${stats.totalPnLPercent.toFixed(2)}%)`)
    console.log('-'.repeat(60))
    console.log(`Total Trades:      ${stats.totalTrades}`)
    console.log(`Winning Trades:    ${stats.winningTrades}`)
    console.log(`Losing Trades:     ${stats.losingTrades}`)
    console.log(`Win Rate:          ${stats.winRate.toFixed(2)}%`)
    console.log('-'.repeat(60))
    console.log(`Average Win:       ${stats.averageWin.toFixed(4)} SOL`)
    console.log(`Average Loss:      ${stats.averageLoss.toFixed(4)} SOL`)
    console.log(`Largest Win:       ${stats.largestWin.toFixed(4)} SOL`)
    console.log(`Largest Loss:      ${stats.largestLoss.toFixed(4)} SOL`)
    console.log('='.repeat(60) + '\n')
  }
}
