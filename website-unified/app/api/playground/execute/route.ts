import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 30

// Simple in-memory rate limiter for edge runtime
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 10
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now])
    return true
  }
  
  const requests = rateLimitMap.get(ip)!
  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  return true
}

// Mock MCP tools for demonstration
// In production, these would connect to actual blockchain APIs
const mockTools = {
  getBalance: async (address: string, chain: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return (Math.random() * 10).toFixed(4)
  },
  
  getTokenBalance: async (address: string, token: string, chain: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return (Math.random() * 1000).toFixed(2)
  },
  
  getTokenPrice: async (symbol: string, currency: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const prices: Record<string, number> = {
      ETH: 2500 + Math.random() * 100,
      BTC: 45000 + Math.random() * 1000,
      USDC: 1.0,
    }
    return prices[symbol] || 0
  },
  
  getGasPrice: async (chain: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const base = Math.random() * 20 + 10
    return {
      standard: base.toFixed(2),
      fast: (base * 1.2).toFixed(2),
      instant: (base * 1.5).toFixed(2),
    }
  },
  
  getNFTs: async (address: string, chain: string) => {
    await new Promise(resolve => setTimeout(resolve, 700))
    const count = Math.floor(Math.random() * 10)
    return Array.from({ length: count }, (_, i) => ({
      tokenId: String(i + 1),
      contract: `0x${Math.random().toString(16).slice(2, 42)}`,
      metadata: { name: `NFT #${i + 1}` },
    }))
  },
  
  getTransactionStatus: async (txHash: string, chain: string) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return {
      status: 'confirmed',
      confirmations: Math.floor(Math.random() * 100),
    }
  },
  
  getTokenInfo: async (address: string, chain: string) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      totalSupply: '1000000000',
    }
  },
  
  getBlock: async (blockNumber: number | string, chain: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      number: 12345678,
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      timestamp: Math.floor(Date.now() / 1000),
      transactions: Array.from({ length: 150 }, () => 
        `0x${Math.random().toString(16).slice(2, 66)}`
      ),
    }
  },
  
  swapTokens: async (params: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      amountOut: (parseFloat(params.amount) * 2500).toFixed(2),
    }
  },
  
  estimateGas: async (transaction: any, chain: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return '21000'
  },
}

export async function POST(request: NextRequest) {
  try {
    const { code, chain } = await request.json()
    
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitOk = checkRateLimit(ip)
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before trying again.' },
        { status: 429 }
      )
    }
    
    // Validate code
    if (!code || typeof code !== 'string' || code.length > 10000) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 400 }
      )
    }
    
    // Execute code in a safe manner
    // Note: In production, use a proper sandboxed environment
    const startTime = Date.now()
    const logs: string[] = []
    
    // Create a safe console object
    const safeConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => String(a)).join(' '))
      },
    }
    
    // Create a safe execution context
    const context = {
      console: safeConsole,
      ...mockTools,
    }
    
    // Execute the code
    // This is a simplified demo - in production use vm2 or isolated-vm
    let result: any
    try {
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const fn = new AsyncFunction(
        ...Object.keys(context),
        code
      )
      result = await fn(...Object.values(context))
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    const executionTime = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      result,
      logs,
      executionTime,
      chain,
    })
    
  } catch (error: any) {
    console.error('Playground execution error:', error)
    return NextResponse.json(
      { error: error.message || 'Execution failed' },
      { status: 500 }
    )
  }
}
