/**
 * Usage Tracker
 * 
 * Tracks API usage and payments for analytics
 */

interface UsageRecord {
  tool: string
  payer: string
  amount: string
  network: string
  timestamp: number
  transactionHash?: string
}

interface UsageStats {
  totalPayments: number
  totalRevenue: string
  revenueByTool: Record<string, string>
  paymentsByTool: Record<string, number>
  uniquePayers: number
  recentPayments: UsageRecord[]
  today: {
    payments: number
    revenue: string
  }
  week: {
    payments: number
    revenue: string
  }
  month: {
    payments: number
    revenue: string
  }
}

export class UsageTracker {
  private records: UsageRecord[] = []
  private maxRecords = 10000 // Keep last 10k records in memory
  private persistPath?: string

  constructor(persistPath?: string) {
    this.persistPath = persistPath
    if (persistPath) {
      this.loadFromDisk()
    }
  }

  /**
   * Record a payment
   */
  async record(usage: UsageRecord): Promise<void> {
    this.records.unshift(usage)
    
    // Trim old records
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(0, this.maxRecords)
    }

    // Persist if configured
    if (this.persistPath) {
      await this.saveToDisk()
    }

    // Log the payment
    console.log(`💰 Payment received: ${usage.tool} - $${this.formatAmount(usage.amount)} from ${usage.payer.slice(0, 8)}...`)
  }

  /**
   * Get usage statistics
   */
  async getStats(): Promise<UsageStats> {
    const now = Date.now()
    const dayAgo = now - 24 * 60 * 60 * 1000
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000

    let totalRevenue = 0n
    const revenueByTool: Record<string, bigint> = {}
    const paymentsByTool: Record<string, number> = {}
    const payers = new Set<string>()

    let todayPayments = 0
    let todayRevenue = 0n
    let weekPayments = 0
    let weekRevenue = 0n
    let monthPayments = 0
    let monthRevenue = 0n

    for (const record of this.records) {
      const amount = BigInt(record.amount)
      totalRevenue += amount
      payers.add(record.payer.toLowerCase())

      // By tool
      revenueByTool[record.tool] = (revenueByTool[record.tool] || 0n) + amount
      paymentsByTool[record.tool] = (paymentsByTool[record.tool] || 0) + 1

      // Time-based
      if (record.timestamp >= dayAgo) {
        todayPayments++
        todayRevenue += amount
      }
      if (record.timestamp >= weekAgo) {
        weekPayments++
        weekRevenue += amount
      }
      if (record.timestamp >= monthAgo) {
        monthPayments++
        monthRevenue += amount
      }
    }

    return {
      totalPayments: this.records.length,
      totalRevenue: totalRevenue.toString(),
      revenueByTool: Object.fromEntries(
        Object.entries(revenueByTool).map(([k, v]) => [k, v.toString()])
      ),
      paymentsByTool,
      uniquePayers: payers.size,
      recentPayments: this.records.slice(0, 20),
      today: {
        payments: todayPayments,
        revenue: todayRevenue.toString(),
      },
      week: {
        payments: weekPayments,
        revenue: weekRevenue.toString(),
      },
      month: {
        payments: monthPayments,
        revenue: monthRevenue.toString(),
      },
    }
  }

  /**
   * Get payments by payer
   */
  getPayerHistory(payer: string): UsageRecord[] {
    return this.records.filter(
      (r) => r.payer.toLowerCase() === payer.toLowerCase()
    )
  }

  /**
   * Get payments by tool
   */
  getToolHistory(tool: string): UsageRecord[] {
    return this.records.filter((r) => r.tool === tool)
  }

  /**
   * Export all records
   */
  export(): UsageRecord[] {
    return [...this.records]
  }

  /**
   * Format amount for display
   */
  private formatAmount(amount: string): string {
    const value = parseInt(amount, 10)
    return (value / 1_000_000).toFixed(4)
  }

  /**
   * Load records from disk
   */
  private async loadFromDisk(): Promise<void> {
    if (!this.persistPath) return

    try {
      const fs = await import("fs/promises")
      const data = await fs.readFile(this.persistPath, "utf-8")
      this.records = JSON.parse(data)
      console.log(`📊 Loaded ${this.records.length} usage records from disk`)
    } catch {
      // File doesn't exist yet, that's fine
      this.records = []
    }
  }

  /**
   * Save records to disk
   */
  private async saveToDisk(): Promise<void> {
    if (!this.persistPath) return

    try {
      const fs = await import("fs/promises")
      await fs.writeFile(this.persistPath, JSON.stringify(this.records, null, 2))
    } catch (error) {
      console.error("Failed to persist usage records:", error)
    }
  }
}

/**
 * Global usage tracker instance
 */
let globalTracker: UsageTracker | null = null

export function getGlobalUsageTracker(persistPath?: string): UsageTracker {
  if (!globalTracker) {
    globalTracker = new UsageTracker(persistPath)
  }
  return globalTracker
}
