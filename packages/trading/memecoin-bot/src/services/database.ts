/**
 * Database Service for Trade and Position Management
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import { Trade, Position, TokenMetrics, BotStats } from '../types'
import { config } from '../config/config'
import * as fs from 'fs'
import * as path from 'path'

export class Database {
  private db: sqlite3.Database
  
  constructor() {
    // Ensure data directory exists
    const dataDir = path.dirname(config.dbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    this.db = new sqlite3.Database(config.dbPath)
    this.initialize()
  }
  
  private async initialize(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS trades (
        id TEXT PRIMARY KEY,
        token_address TEXT NOT NULL,
        type TEXT NOT NULL,
        amount_in TEXT NOT NULL,
        amount_out TEXT NOT NULL,
        price REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        tx_signature TEXT NOT NULL,
        status TEXT NOT NULL,
        error TEXT
      )
    `)
    
    await this.run(`
      CREATE TABLE IF NOT EXISTS positions (
        id TEXT PRIMARY KEY,
        token_address TEXT NOT NULL,
        symbol TEXT NOT NULL,
        entry_price REAL NOT NULL,
        current_price REAL NOT NULL,
        amount TEXT NOT NULL,
        cost_basis REAL NOT NULL,
        current_value REAL NOT NULL,
        pnl REAL NOT NULL,
        pnl_percent REAL NOT NULL,
        stop_loss REAL NOT NULL,
        take_profit REAL NOT NULL,
        trailing_stop REAL NOT NULL,
        highest_price REAL NOT NULL,
        opened_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        status TEXT NOT NULL
      )
    `)
    
    await this.run(`
      CREATE TABLE IF NOT EXISTS token_metrics (
        address TEXT PRIMARY KEY,
        holders INTEGER,
        market_cap REAL,
        liquidity REAL,
        volume_24h REAL,
        price_change_24h REAL,
        price_change_1h REAL,
        buys_24h INTEGER,
        sells_24h INTEGER,
        unique_buyers_24h INTEGER,
        unique_sellers_24h INTEGER,
        rug_pull_score INTEGER,
        honeypot_risk INTEGER,
        timestamp INTEGER NOT NULL
      )
    `)
    
    // Create indexes
    await this.run('CREATE INDEX IF NOT EXISTS idx_trades_token ON trades(token_address)')
    await this.run('CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp)')
    await this.run('CREATE INDEX IF NOT EXISTS idx_positions_status ON positions(status)')
  }
  
  private run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
  
  private get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }
  
  private all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })
  }
  
  async saveTrade(trade: Trade): Promise<void> {
    await this.run(`
      INSERT OR REPLACE INTO trades VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      trade.id,
      trade.tokenAddress,
      trade.type,
      trade.amountIn,
      trade.amountOut,
      trade.price,
      trade.timestamp.getTime(),
      trade.txSignature,
      trade.status,
      trade.error || null
    ])
  }
  
  async savePosition(position: Position): Promise<void> {
    await this.run(`
      INSERT OR REPLACE INTO positions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      position.id,
      position.tokenAddress,
      position.symbol,
      position.entryPrice,
      position.currentPrice,
      position.amount,
      position.costBasis,
      position.currentValue,
      position.pnl,
      position.pnlPercent,
      position.stopLoss,
      position.takeProfit,
      position.trailingStop,
      position.highestPrice,
      position.openedAt.getTime(),
      position.updatedAt.getTime(),
      position.status
    ])
  }
  
  async getPosition(tokenAddress: string): Promise<Position | null> {
    const row = await this.get(`
      SELECT * FROM positions WHERE token_address = ? AND status = 'open'
    `, [tokenAddress])
    
    if (!row) return null
    
    return {
      id: row.id,
      tokenAddress: row.token_address,
      symbol: row.symbol,
      entryPrice: row.entry_price,
      currentPrice: row.current_price,
      amount: row.amount,
      costBasis: row.cost_basis,
      currentValue: row.current_value,
      pnl: row.pnl,
      pnlPercent: row.pnl_percent,
      stopLoss: row.stop_loss,
      takeProfit: row.take_profit,
      trailingStop: row.trailing_stop,
      highestPrice: row.highest_price,
      openedAt: new Date(row.opened_at),
      updatedAt: new Date(row.updated_at),
      status: row.status
    }
  }
  
  async getOpenPositions(): Promise<Position[]> {
    const rows = await this.all(`
      SELECT * FROM positions WHERE status = 'open' ORDER BY opened_at DESC
    `)
    
    return rows.map(row => ({
      id: row.id,
      tokenAddress: row.token_address,
      symbol: row.symbol,
      entryPrice: row.entry_price,
      currentPrice: row.current_price,
      amount: row.amount,
      costBasis: row.cost_basis,
      currentValue: row.current_value,
      pnl: row.pnl,
      pnlPercent: row.pnl_percent,
      stopLoss: row.stop_loss,
      takeProfit: row.take_profit,
      trailingStop: row.trailing_stop,
      highestPrice: row.highest_price,
      openedAt: new Date(row.opened_at),
      updatedAt: new Date(row.updated_at),
      status: row.status
    }))
  }
  
  async closePosition(tokenAddress: string): Promise<void> {
    await this.run(`
      UPDATE positions SET status = 'closed', updated_at = ? WHERE token_address = ? AND status = 'open'
    `, [Date.now(), tokenAddress])
  }
  
  async saveTokenMetrics(metrics: TokenMetrics): Promise<void> {
    await this.run(`
      INSERT OR REPLACE INTO token_metrics VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      metrics.address,
      metrics.holders,
      metrics.marketCap,
      metrics.liquidity,
      metrics.volume24h,
      metrics.priceChange24h,
      metrics.priceChange1h,
      metrics.buys24h,
      metrics.sells24h,
      metrics.uniqueBuyers24h,
      metrics.uniqueSellers24h,
      metrics.rugPullScore,
      metrics.honeypotRisk,
      metrics.timestamp.getTime()
    ])
  }
  
  async getStats(): Promise<BotStats> {
    const trades = await this.all('SELECT * FROM trades WHERE status = "success"')
    const positions = await this.all('SELECT * FROM positions')
    
    const successfulTrades = trades.filter(t => t.status === 'success').length
    const failedTrades = trades.filter(t => t.status === 'failed').length
    
    const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0)
    const wins = positions.filter(p => p.pnl > 0)
    const losses = positions.filter(p => p.pnl < 0)
    
    const now = Date.now()
    const dayAgo = now - 24 * 60 * 60 * 1000
    const todayPositions = positions.filter(p => p.updated_at > dayAgo)
    const dailyPnl = todayPositions.reduce((sum, p) => sum + p.pnl, 0)
    
    return {
      totalTrades: trades.length,
      successfulTrades,
      failedTrades,
      totalVolume: trades.reduce((sum, t) => sum + parseFloat(t.amount_in), 0),
      totalPnl,
      winRate: trades.length > 0 ? (successfulTrades / trades.length) * 100 : 0,
      averageProfit: wins.length > 0 ? wins.reduce((sum, p) => sum + p.pnl, 0) / wins.length : 0,
      averageLoss: losses.length > 0 ? losses.reduce((sum, p) => sum + p.pnl, 0) / losses.length : 0,
      largestWin: wins.length > 0 ? Math.max(...wins.map(p => p.pnl)) : 0,
      largestLoss: losses.length > 0 ? Math.min(...losses.map(p => p.pnl)) : 0,
      activePositions: positions.filter(p => p.status === 'open').length,
      dailyPnl,
      startTime: new Date(Math.min(...positions.map(p => p.opened_at))),
      runtime: (now - Math.min(...positions.map(p => p.opened_at))) / 1000
    }
  }
  
  close(): void {
    this.db.close()
  }
}
