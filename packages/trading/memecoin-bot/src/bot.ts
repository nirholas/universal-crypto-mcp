/**
 * Main Trading Bot Engine
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { EventEmitter } from 'events'
import { SolanaService } from './services/solana'
import { JupiterService } from './services/jupiter'
import { ScannerService, NewToken } from './services/scanner'
import { TechnicalAnalysisService } from './services/analysis'
import { RiskManagementService } from './services/risk'
import { PortfolioManager } from './services/portfolio'
import { DatabaseService } from './services/database'
import { config, validateConfig, WSOL } from './config/config'

export class MemecoinTradingBot extends EventEmitter {
  private solana: SolanaService
  private jupiter: JupiterService
  private scanner: ScannerService
  private analysis: TechnicalAnalysisService
  private risk: RiskManagementService
  private portfolio: PortfolioManager
  private database: DatabaseService
  
  private running: boolean = false
  private priceHistory: Map<string, number[]> = new Map()
  
  constructor() {
    super()
    
    // Initialize services
    this.solana = new SolanaService()
    this.jupiter = new JupiterService(this.solana.getConnection())
    this.scanner = new ScannerService()
    this.analysis = new TechnicalAnalysisService()
    this.risk = new RiskManagementService()
    this.database = new DatabaseService()
    this.portfolio = new PortfolioManager(
      this.database,
      this.jupiter,
      this.risk
    )
    
    // Set up event listeners
    this.setupEventListeners()
  }
  
  /**
   * Start the trading bot
   */
  async start(): Promise<void> {
    try {
      console.log('🚀 Starting Memecoin Trading Bot...')
      
      // Validate configuration
      validateConfig()
      
      // Initialize database
      await this.database.initialize()
      
      // Initialize portfolio
      await this.portfolio.initialize()
      
      // Check wallet balance
      const balance = await this.solana.getBalance()
      console.log(`💰 Wallet balance: ${balance.toFixed(4)} SOL`)
      
      if (balance < config.minPositionSize) {
        throw new Error(`Insufficient balance. Need at least ${config.minPositionSize} SOL`)
      }
      
      // Start scanner
      await this.scanner.startScanning()
      
      this.running = true
      this.emit('started')
      
      console.log('✅ Bot started successfully')
      console.log(`📊 Max position: ${config.maxPositionSize} SOL`)
      console.log(`🛡️  Stop loss: ${config.stopLoss}%`)
      console.log(`🎯 Take profit: ${config.takeProfit}%`)
      console.log(`📈 Trailing stop: ${config.trailingStop}%`)
      
    } catch (error) {
      console.error('Failed to start bot:', error)
      throw error
    }
  }
  
  /**
   * Stop the trading bot
   */
  async stop(): Promise<void> {
    console.log('🛑 Stopping bot...')
    
    this.running = false
    this.scanner.stopScanning()
    this.portfolio.stopPriceMonitoring()
    
    // Print final stats
    const stats = await this.portfolio.getPortfolioStats()
    console.log('\n📊 Final Statistics:')
    console.log(`Total PnL: ${stats.totalPnL.toFixed(4)} SOL (${stats.totalPnLPercent.toFixed(2)}%)`)
    console.log(`Open Positions: ${stats.openPositions}`)
    console.log(`Closed Positions: ${stats.closedPositions}`)
    console.log(`Win Rate: ${(stats.winRate * 100).toFixed(2)}%`)
    
    this.emit('stopped')
    console.log('✅ Bot stopped')
  }
  
  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for new tokens from scanner
    this.scanner.on('newToken', async (token: NewToken) => {
      await this.evaluateToken(token)
    })
    
    // Listen for position updates
    this.portfolio.on('positionClosed', (data) => {
      const { position, reason } = data
      console.log(`📉 Position closed: ${position.symbol} - ${reason}`)
      this.emit('positionClosed', data)
    })
    
    this.portfolio.on('positionOpened', (position) => {
      console.log(`📈 Position opened: ${position.symbol}`)
      this.emit('positionOpened', position)
    })
  }
  
  /**
   * Evaluate a token for trading
   */
  private async evaluateToken(token: NewToken): Promise<void> {
    try {
      console.log(`🔎 Evaluating ${token.symbol} (${token.address})`)
      
      // Get detailed metrics
      const metrics = await this.scanner.getTokenMetrics(token.address)
      if (!metrics) {
        console.log(`❌ Could not fetch metrics for ${token.symbol}`)
        return
      }
      
      // Check safety
      const isSafe = await this.solana.isTokenSafe(token.address)
      if (!isSafe) {
        console.log(`❌ ${token.symbol} failed safety check`)
        return
      }
      
      // Check if already have position
      if (this.portfolio.getPosition(token.address)) {
        console.log(`⏭️  Already have position in ${token.symbol}`)
        return
      }
      
      // Get price history (simulate with current price if new)
      let priceHistory = this.priceHistory.get(token.address) || []
      priceHistory.push(token.priceUsd)
      
      // Keep only last 100 prices
      if (priceHistory.length > 100) {
        priceHistory = priceHistory.slice(-100)
      }
      this.priceHistory.set(token.address, priceHistory)
      
      // Need at least some history for technical analysis
      if (priceHistory.length < 7) {
        console.log(`⏳ Not enough price history for ${token.symbol}`)
        return
      }
      
      // Calculate indicators
      const volumeHistory = new Array(priceHistory.length).fill(token.volume24h)
      const indicators = await this.analysis.calculateIndicators(
        token.address,
        priceHistory,
        volumeHistory
      )
      
      // Generate trading signal
      const signal = this.analysis.generateSignal(
        indicators,
        metrics,
        token.priceUsd
      )
      
      console.log(`📊 Signal for ${token.symbol}: ${signal.action.toUpperCase()} (${signal.confidence}% confidence)`)
      console.log(`   Reasons: ${signal.reasons.join(', ')}`)
      
      // Execute buy if signal is strong
      if (signal.action === 'buy' && signal.confidence >= 60) {
        await this.executeBuy(token, metrics, signal.confidence)
      }
    } catch (error) {
      console.error(`Error evaluating ${token.symbol}:`, error)
    }
  }
  
  /**
   * Execute buy order
   */
  private async executeBuy(
    token: NewToken,
    metrics: any,
    confidence: number
  ): Promise<void> {
    try {
      // Calculate position size
      const balance = await this.solana.getBalance()
      const riskScore = (metrics.rugPullScore + metrics.honeypotRisk) / 2
      const positionSize = this.risk.calculatePositionSize(
        token.priceUsd,
        riskScore,
        balance
      )
      
      // Check if can trade
      const canTrade = this.portfolio.canOpenPosition(positionSize)
      if (!canTrade.allowed) {
        console.log(`❌ Cannot trade: ${canTrade.reason}`)
        return
      }
      
      console.log(`💰 Buying ${token.symbol} with ${positionSize.toFixed(4)} SOL`)
      
      // Convert SOL amount to lamports
      const amountIn = (positionSize * 1e9).toString()
      
      // Get quote
      const quote = await this.jupiter.getQuote({
        tokenIn: WSOL.toBase58(),
        tokenOut: token.address,
        amountIn,
        slippage: config.maxSlippage
      })
      
      if (!quote) {
        console.log(`❌ Could not get quote for ${token.symbol}`)
        return
      }
      
      // Calculate expected tokens
      const expectedTokens = parseFloat(quote.outAmount)
      const priceImpact = parseFloat(quote.priceImpactPct)
      
      console.log(`   Expected: ${expectedTokens} ${token.symbol}`)
      console.log(`   Price Impact: ${priceImpact.toFixed(2)}%`)
      
      // Check price impact
      if (priceImpact > 5) {
        console.log(`❌ Price impact too high: ${priceImpact.toFixed(2)}%`)
        return
      }
      
      // Execute swap
      const result = await this.jupiter.executeSwap(
        quote,
        this.solana.getWallet(),
        config.priorityFee
      )
      
      if (!result.success) {
        console.log(`❌ Swap failed: ${result.error}`)
        return
      }
      
      console.log(`✅ Buy executed: ${result.signature}`)
      
      // Save trade to database
      await this.database.saveTrade({
        id: result.signature,
        tokenAddress: token.address,
        type: 'buy',
        amountIn: result.amountIn,
        amountOut: result.amountOut,
        price: token.priceUsd,
        timestamp: new Date(),
        txSignature: result.signature,
        status: 'success'
      })
      
      // Open position
      await this.portfolio.openPosition(
        token.address,
        token.symbol,
        token.priceUsd,
        result.amountOut,
        positionSize
      )
      
      this.emit('buyExecuted', { token, result })
      
    } catch (error) {
      console.error(`Error executing buy for ${token.symbol}:`, error)
      this.emit('buyFailed', { token, error })
    }
  }
  
  /**
   * Execute sell order
   */
  async executeSell(tokenAddress: string, reason: string): Promise<void> {
    try {
      const position = this.portfolio.getPosition(tokenAddress)
      if (!position) {
        console.log(`No position found for ${tokenAddress}`)
        return
      }
      
      console.log(`💸 Selling ${position.symbol} - ${reason}`)
      
      // Get current token balance
      const tokenBalance = await this.solana.getTokenBalance(tokenAddress)
      
      // Get quote
      const quote = await this.jupiter.getQuote({
        tokenIn: tokenAddress,
        tokenOut: WSOL.toBase58(),
        amountIn: tokenBalance,
        slippage: config.maxSlippage
      })
      
      if (!quote) {
        console.log(`❌ Could not get sell quote for ${position.symbol}`)
        return
      }
      
      // Execute swap
      const result = await this.jupiter.executeSwap(
        quote,
        this.solana.getWallet(),
        config.priorityFee
      )
      
      if (!result.success) {
        console.log(`❌ Sell failed: ${result.error}`)
        return
      }
      
      console.log(`✅ Sell executed: ${result.signature}`)
      
      // Calculate exit price
      const exitPrice = parseFloat(result.amountOut) / parseFloat(quote.inAmount)
      
      // Save trade
      await this.database.saveTrade({
        id: result.signature,
        tokenAddress,
        type: 'sell',
        amountIn: result.amountIn,
        amountOut: result.amountOut,
        price: exitPrice,
        timestamp: new Date(),
        txSignature: result.signature,
        status: 'success'
      })
      
      // Close position
      await this.portfolio.closePosition(tokenAddress, exitPrice, reason)
      
      this.emit('sellExecuted', { position, result, reason })
      
    } catch (error) {
      console.error(`Error executing sell:`, error)
      this.emit('sellFailed', { tokenAddress, error })
    }
  }
  
  /**
   * Get bot status
   */
  getStatus(): {
    running: boolean
    balance: Promise<number>
    positions: number
    stats: Promise<any>
    risk: any
  } {
    return {
      running: this.running,
      balance: this.solana.getBalance(),
      positions: this.portfolio.getOpenPositions().length,
      stats: this.portfolio.getPortfolioStats(),
      risk: this.risk.getRiskLimits()
    }
  }
}
    
    // Main loop
    while (this.isRunning) {
      try {
        // Check daily loss limit
        if (this.dailyLoss >= config.maxDailyLoss) {
          console.log(chalk.red(`⚠️  Daily loss limit reached: ${this.dailyLoss.toFixed(4)} SOL`))
          await this.sleep(60000) // Wait 1 minute
          continue
        }
        
        // Find new opportunities
        await this.scanNewPairs()
        
        // Update existing positions
        await this.updatePositions()
        
        // Wait before next scan
        await this.sleep(config.newPairCheckInterval)
      } catch (error: any) {
        console.error(chalk.red('Error in main loop:'), error.message)
        await this.sleep(5000)
      }
    }
  }
  
  stop(): void {
    this.isRunning = false
    console.log(chalk.yellow('⏸️  Bot stopped'))
  }
  
  private async scanNewPairs(): Promise<void> {
    console.log(chalk.blue('🔍 Scanning for new pairs...'))
    
    const newPairs = await this.dexScreener.getNewPairs(50)
    
    for (const pair of newPairs) {
      // Skip if already monitored
      if (this.monitoredTokens.has(pair.tokenA)) continue
      
      // Skip if it's WSOL
      if (pair.tokenA === WSOL.toString()) continue
      
      // Evaluate token
      const signal = await this.strategy.evaluateToken(pair.tokenA)
      
      console.log(chalk.gray(`Evaluated ${pair.tokenA.slice(0, 8)}... | Confidence: ${signal.confidence}% | Action: ${signal.action}`))
      
      // Check if we should buy
      const shouldBuy = await this.strategy.shouldBuy(signal)
      
      if (shouldBuy) {
        await this.executeBuy(signal)
      }
      
      // Add to monitored tokens
      this.monitoredTokens.add(pair.tokenA)
      
      // Rate limiting
      await this.sleep(1000)
    }
  }
  
  private async executeBuy(signal: TradingSignal): Promise<void> {
    console.log(chalk.green(`\n💰 BUY SIGNAL: ${signal.tokenAddress}`))
    console.log(chalk.gray(`Confidence: ${signal.confidence}%`))
    console.log(chalk.gray(`Reasons: ${signal.reasons.join(', ')}`))
    
    try {
      // Check balance
      const balance = await this.solana.getBalance()
      if (balance < config.buyAmount) {
        console.log(chalk.red(`Insufficient balance: ${balance} SOL`))
        return
      }
      
      // Execute buy
      const result = await this.jupiter.buy(signal.tokenAddress, config.buyAmount)
      
      if (!result.success) {
        console.log(chalk.red(`Buy failed: ${result.error}`))
        return
      }
      
      console.log(chalk.green(`✅ Buy successful!`))
      console.log(chalk.gray(`TX: ${result.signature}`))
      console.log(chalk.gray(`Amount: ${result.amountOut} tokens`))
      
      // Save trade
      const trade: Trade = {
        id: uuidv4(),
        tokenAddress: signal.tokenAddress,
        type: 'buy',
        amountIn: result.amountIn,
        amountOut: result.amountOut,
        price: result.price,
        timestamp: new Date(),
        txSignature: result.signature,
        status: 'success'
      }
      await this.db.saveTrade(trade)
      
      // Create position
      const position: Position = {
        id: uuidv4(),
        tokenAddress: signal.tokenAddress,
        symbol: signal.metrics.address.slice(0, 8),
        entryPrice: result.price,
        currentPrice: result.price,
        amount: result.amountOut,
        costBasis: config.buyAmount,
        currentValue: config.buyAmount,
        pnl: 0,
        pnlPercent: 0,
        stopLoss: config.stopLoss,
        takeProfit: config.takeProfit,
        trailingStop: config.trailingStop,
        highestPrice: result.price,
        openedAt: new Date(),
        updatedAt: new Date(),
        status: 'open'
      }
      await this.db.savePosition(position)
      
      console.log(chalk.cyan(`📊 Position opened`))
    } catch (error: any) {
      console.error(chalk.red(`Buy execution error: ${error.message}`))
    }
  }
  
  private async updatePositions(): Promise<void> {
    const positions = await this.db.getOpenPositions()
    
    for (const position of positions) {
      try {
        // Get current price
        const currentPrice = await this.jupiter.getPrice(
          position.tokenAddress,
          'So11111111111111111111111111111111111111112'
        )
        
        if (currentPrice === 0) continue
        
        // Update highest price
        const highestPrice = Math.max(position.highestPrice, currentPrice)
        
        // Calculate PnL
        const currentValue = new Decimal(position.amount)
          .mul(currentPrice)
          .toNumber()
        
        const pnl = currentValue - position.costBasis
        const pnlPercent = (pnl / position.costBasis) * 100
        
        // Update position
        const updatedPosition: Position = {
          ...position,
          currentPrice,
          currentValue,
          pnl,
          pnlPercent,
          highestPrice,
          updatedAt: new Date()
        }
        
        await this.db.savePosition(updatedPosition)
        
        // Check if we should sell
        const sellDecision = this.strategy.shouldSell(
          currentPrice,
          position.entryPrice,
          highestPrice
        )
        
        if (sellDecision.shouldSell) {
          await this.executeSell(updatedPosition, sellDecision.reason)
        }
        
        // Log position status
        const pnlColor = pnl >= 0 ? chalk.green : chalk.red
        console.log(
          chalk.gray(`Position: ${position.symbol} | `) +
          pnlColor(`PnL: ${pnlPercent.toFixed(2)}% (${pnl.toFixed(4)} SOL)`)
        )
      } catch (error: any) {
        console.error(chalk.red(`Error updating position: ${error.message}`))
      }
      
      await this.sleep(config.priceUpdateInterval)
    }
  }
  
  private async executeSell(position: Position, reason: string): Promise<void> {
    console.log(chalk.yellow(`\n💸 SELL SIGNAL: ${position.symbol}`))
    console.log(chalk.gray(`Reason: ${reason}`))
    console.log(chalk.gray(`PnL: ${position.pnlPercent.toFixed(2)}%`))
    
    try {
      // Execute sell
      const result = await this.jupiter.sell(position.tokenAddress, position.amount)
      
      if (!result.success) {
        console.log(chalk.red(`Sell failed: ${result.error}`))
        return
      }
      
      console.log(chalk.green(`✅ Sell successful!`))
      console.log(chalk.gray(`TX: ${result.signature}`))
      console.log(chalk.gray(`Received: ${result.amountOut} SOL`))
      
      // Calculate final PnL
      const finalPnl = parseFloat(result.amountOut) / 1e9 - position.costBasis
      
      // Update daily loss if applicable
      if (finalPnl < 0) {
        this.dailyLoss += Math.abs(finalPnl)
      }
      
      // Save trade
      const trade: Trade = {
        id: uuidv4(),
        tokenAddress: position.tokenAddress,
        type: 'sell',
        amountIn: position.amount,
        amountOut: result.amountOut,
        price: result.price,
        timestamp: new Date(),
        txSignature: result.signature,
        status: 'success'
      }
      await this.db.saveTrade(trade)
      
      // Close position
      await this.db.closePosition(position.tokenAddress)
      
      const pnlColor = finalPnl >= 0 ? chalk.green : chalk.red
      console.log(pnlColor(`📊 Final PnL: ${finalPnl.toFixed(4)} SOL`))
    } catch (error: any) {
      console.error(chalk.red(`Sell execution error: ${error.message}`))
    }
  }
  
  async getStats(): Promise<void> {
    const stats = await this.db.getStats()
    
    console.log(chalk.cyan('\n📊 Bot Statistics'))
    console.log(chalk.gray('─'.repeat(50)))
    console.log(`Total Trades: ${stats.totalTrades}`)
    console.log(`Successful: ${stats.successfulTrades} | Failed: ${stats.failedTrades}`)
    console.log(`Win Rate: ${stats.winRate.toFixed(2)}%`)
    console.log(chalk.green(`Total PnL: ${stats.totalPnl.toFixed(4)} SOL`))
    console.log(`Daily PnL: ${stats.dailyPnl.toFixed(4)} SOL`)
    console.log(`Active Positions: ${stats.activePositions}`)
    console.log(`Average Profit: ${stats.averageProfit.toFixed(4)} SOL`)
    console.log(`Average Loss: ${stats.averageLoss.toFixed(4)} SOL`)
    console.log(`Largest Win: ${stats.largestWin.toFixed(4)} SOL`)
    console.log(`Largest Loss: ${stats.largestLoss.toFixed(4)} SOL`)
    console.log(chalk.gray('─'.repeat(50)))
  }
  
  private checkDailyReset(): void {
    const now = new Date()
    const hoursSinceReset = (now.getTime() - this.lastDailyReset.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceReset >= 24) {
      this.dailyLoss = 0
      this.lastDailyReset = now
      console.log(chalk.blue('📅 Daily counters reset'))
    }
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  async cleanup(): Promise<void> {
    this.stop()
    this.db.close()
    console.log(chalk.gray('Cleanup complete'))
  }
}
