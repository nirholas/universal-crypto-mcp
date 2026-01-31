/**
 * Playground Tool Execution API Route
 * POST /api/playground/execute - Execute tools in the playground
 * 
 * Production implementation connecting to real blockchain RPC endpoints
 * and external APIs for live data.
 * 
 * @author nirholas
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

// ============================================================================
// Configuration
// ============================================================================

const RPC_ENDPOINTS: Record<string, string> = {
  ethereum: process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
  base: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  arbitrum: process.env.ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  polygon: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
  optimism: process.env.OP_RPC_URL || 'https://mainnet.optimism.io',
  bsc: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
  avalanche: process.env.AVAX_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
}

const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  polygon: 137,
  optimism: 10,
  bsc: 56,
  avalanche: 43114,
}

const NATIVE_SYMBOLS: Record<string, string> = {
  ethereum: 'ETH',
  base: 'ETH',
  arbitrum: 'ETH',
  polygon: 'MATIC',
  optimism: 'ETH',
  bsc: 'BNB',
  avalanche: 'AVAX',
}

// ============================================================================
// Rate Limiting
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60000
const RATE_LIMIT_MAX = 30

function checkRateLimit(clientId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const existing = rateLimitMap.get(clientId)

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW
    rateLimitMap.set(clientId, { count: 1, resetAt })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt }
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - existing.count, resetAt: existing.resetAt }
}

// ============================================================================
// RPC Helper
// ============================================================================

async function jsonRpcCall(
  chain: string,
  method: string,
  params: unknown[]
): Promise<unknown> {
  const rpcUrl = RPC_ENDPOINTS[chain] || RPC_ENDPOINTS.ethereum

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  })

  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.status}`)
  }

  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error.message || 'RPC error')
  }

  return data.result
}

// ============================================================================
// Production Tool Implementations
// ============================================================================

const toolImplementations: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  // Get native balance
  getBalance: async (params) => {
    const address = params.address as string
    const chain = (params.chain as string) || 'ethereum'
    
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error('Invalid address format')
    }

    const result = await jsonRpcCall(chain, 'eth_getBalance', [address, 'latest'])
    const balanceWei = BigInt(result as string)
    const balanceFormatted = Number(balanceWei) / 1e18

    return {
      address,
      chain,
      balance: balanceWei.toString(),
      formatted: balanceFormatted.toFixed(6),
      symbol: NATIVE_SYMBOLS[chain] || 'ETH',
    }
  },

  // Get ERC20 token balance
  getTokenBalance: async (params) => {
    const address = params.address as string
    const token = params.token as string
    const chain = (params.chain as string) || 'ethereum'
    const decimals = (params.decimals as number) || 18

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error('Invalid address format')
    }
    if (!token || !/^0x[a-fA-F0-9]{40}$/.test(token)) {
      throw new Error('Invalid token address format')
    }

    // ERC20 balanceOf selector
    const data = `0x70a08231${address.slice(2).padStart(64, '0')}`
    
    const result = await jsonRpcCall(chain, 'eth_call', [{ to: token, data }, 'latest'])
    const balance = BigInt(result as string)
    const formatted = Number(balance) / Math.pow(10, decimals)

    return {
      address,
      token,
      chain,
      balance: balance.toString(),
      formatted: formatted.toFixed(6),
      decimals,
    }
  },

  // Get token price from CoinGecko
  getTokenPrice: async (params) => {
    const symbol = (params.symbol as string || 'eth').toLowerCase()
    const currency = (params.currency as string || 'usd').toLowerCase()

    const coinIds: Record<string, string> = {
      btc: 'bitcoin', bitcoin: 'bitcoin',
      eth: 'ethereum', ethereum: 'ethereum',
      sol: 'solana', solana: 'solana',
      usdc: 'usd-coin', usdt: 'tether',
      matic: 'matic-network', polygon: 'matic-network',
      arb: 'arbitrum', op: 'optimism',
      avax: 'avalanche-2', bnb: 'binancecoin',
      link: 'chainlink', uni: 'uniswap',
      aave: 'aave', mkr: 'maker',
    }

    const coinId = coinIds[symbol] || symbol

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!response.ok) {
      throw new Error(`Price API error: ${response.status}`)
    }

    const data = await response.json()
    const coinData = data[coinId]

    if (!coinData) {
      throw new Error(`No price data for ${symbol}`)
    }

    return {
      symbol: symbol.toUpperCase(),
      currency: currency.toUpperCase(),
      price: coinData[currency],
      change24h: coinData[`${currency}_24h_change`],
      marketCap: coinData[`${currency}_market_cap`],
      volume24h: coinData[`${currency}_24h_vol`],
      timestamp: Date.now(),
    }
  },

  // Get gas prices
  getGasPrice: async (params) => {
    const chain = (params.chain as string) || 'ethereum'
    
    const gasPrice = await jsonRpcCall(chain, 'eth_gasPrice', [])
    const gasPriceWei = BigInt(gasPrice as string)
    const gasPriceGwei = Number(gasPriceWei) / 1e9

    // Try to get fee history for EIP-1559 chains
    let baseFee = gasPriceGwei
    try {
      const feeHistory = await jsonRpcCall(chain, 'eth_feeHistory', [4, 'latest', [25, 50, 75]])
      const history = feeHistory as { baseFeePerGas: string[] }
      if (history.baseFeePerGas?.length > 0) {
        const latestBaseFee = BigInt(history.baseFeePerGas[history.baseFeePerGas.length - 1])
        baseFee = Number(latestBaseFee) / 1e9
      }
    } catch {
      // Chain may not support EIP-1559
    }

    return {
      chain,
      gasPrice: gasPriceGwei.toFixed(2),
      baseFee: baseFee.toFixed(2),
      standard: { gwei: (baseFee + 1).toFixed(2), estimatedTime: '~3 min' },
      fast: { gwei: (baseFee + 2).toFixed(2), estimatedTime: '~1 min' },
      instant: { gwei: (baseFee + 5).toFixed(2), estimatedTime: '~15 sec' },
      timestamp: Date.now(),
    }
  },

  // Get transaction status
  getTransactionStatus: async (params) => {
    const txHash = params.txHash as string
    const chain = (params.chain as string) || 'ethereum'

    if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      throw new Error('Invalid transaction hash format')
    }

    const receipt = await jsonRpcCall(chain, 'eth_getTransactionReceipt', [txHash])
    
    if (!receipt) {
      return { txHash, chain, status: 'pending', confirmations: 0 }
    }

    const tx = receipt as {
      status: string
      blockNumber: string
      gasUsed: string
      effectiveGasPrice?: string
    }

    const currentBlock = await jsonRpcCall(chain, 'eth_blockNumber', [])
    const txBlockNumber = parseInt(tx.blockNumber, 16)
    const latestBlockNumber = parseInt(currentBlock as string, 16)
    const confirmations = latestBlockNumber - txBlockNumber

    return {
      txHash,
      chain,
      status: tx.status === '0x1' ? 'success' : 'failed',
      blockNumber: txBlockNumber,
      confirmations,
      gasUsed: parseInt(tx.gasUsed, 16).toString(),
      effectiveGasPrice: tx.effectiveGasPrice ? parseInt(tx.effectiveGasPrice, 16).toString() : null,
    }
  },

  // Get ERC20 token info
  getTokenInfo: async (params) => {
    const tokenAddress = params.address as string
    const chain = (params.chain as string) || 'ethereum'

    if (!tokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
      throw new Error('Invalid token address format')
    }

    // Call name(), symbol(), decimals(), totalSupply()
    const nameData = '0x06fdde03'
    const symbolData = '0x95d89b41'
    const decimalsData = '0x313ce567'
    const totalSupplyData = '0x18160ddd'

    const [nameResult, symbolResult, decimalsResult, totalSupplyResult] = await Promise.all([
      jsonRpcCall(chain, 'eth_call', [{ to: tokenAddress, data: nameData }, 'latest']).catch(() => '0x'),
      jsonRpcCall(chain, 'eth_call', [{ to: tokenAddress, data: symbolData }, 'latest']).catch(() => '0x'),
      jsonRpcCall(chain, 'eth_call', [{ to: tokenAddress, data: decimalsData }, 'latest']).catch(() => '0x12'),
      jsonRpcCall(chain, 'eth_call', [{ to: tokenAddress, data: totalSupplyData }, 'latest']).catch(() => '0x0'),
    ])

    // Decode string results (simplified - handles most common cases)
    const decodeString = (hex: string): string => {
      if (!hex || hex === '0x' || hex.length < 130) return 'Unknown'
      try {
        const offset = parseInt(hex.slice(2, 66), 16)
        const length = parseInt(hex.slice(66, 130), 16)
        const strHex = hex.slice(130, 130 + length * 2)
        return Buffer.from(strHex, 'hex').toString('utf8').replace(/\0/g, '')
      } catch {
        return 'Unknown'
      }
    }

    const decimals = parseInt(decimalsResult as string, 16)
    const totalSupply = BigInt(totalSupplyResult as string)

    return {
      address: tokenAddress,
      chain,
      name: decodeString(nameResult as string),
      symbol: decodeString(symbolResult as string),
      decimals,
      totalSupply: totalSupply.toString(),
      formattedTotalSupply: (Number(totalSupply) / Math.pow(10, decimals)).toLocaleString(),
    }
  },

  // Get block info
  getBlock: async (params) => {
    const blockNumber = params.blockNumber as string | number || 'latest'
    const chain = (params.chain as string) || 'ethereum'

    const blockParam = blockNumber === 'latest' ? 'latest' :
      typeof blockNumber === 'number' ? `0x${blockNumber.toString(16)}` :
      blockNumber.startsWith('0x') ? blockNumber : `0x${parseInt(blockNumber, 10).toString(16)}`

    const block = await jsonRpcCall(chain, 'eth_getBlockByNumber', [blockParam, false])
    
    if (!block) {
      throw new Error('Block not found')
    }

    const b = block as {
      number: string
      hash: string
      parentHash: string
      timestamp: string
      gasUsed: string
      gasLimit: string
      baseFeePerGas?: string
      transactions: string[]
      miner: string
    }

    return {
      chain,
      number: parseInt(b.number, 16),
      hash: b.hash,
      parentHash: b.parentHash,
      timestamp: parseInt(b.timestamp, 16),
      datetime: new Date(parseInt(b.timestamp, 16) * 1000).toISOString(),
      gasUsed: parseInt(b.gasUsed, 16),
      gasLimit: parseInt(b.gasLimit, 16),
      utilization: ((parseInt(b.gasUsed, 16) / parseInt(b.gasLimit, 16)) * 100).toFixed(2) + '%',
      baseFeePerGas: b.baseFeePerGas ? (parseInt(b.baseFeePerGas, 16) / 1e9).toFixed(2) + ' gwei' : null,
      transactionCount: b.transactions.length,
      miner: b.miner,
    }
  },

  // Estimate gas
  estimateGas: async (params) => {
    const chain = (params.chain as string) || 'ethereum'
    const to = params.to as string
    const from = params.from as string || '0x0000000000000000000000000000000000000000'
    const value = params.value as string || '0x0'
    const data = params.data as string || '0x'

    const gasEstimate = await jsonRpcCall(chain, 'eth_estimateGas', [{
      from,
      to,
      value: value.startsWith('0x') ? value : `0x${parseInt(value, 10).toString(16)}`,
      data,
    }])

    const gasLimit = parseInt(gasEstimate as string, 16)
    const gasPrice = await jsonRpcCall(chain, 'eth_gasPrice', [])
    const gasPriceWei = BigInt(gasPrice as string)
    const estimatedCost = BigInt(gasLimit) * gasPriceWei

    return {
      chain,
      gasLimit,
      gasPriceGwei: (Number(gasPriceWei) / 1e9).toFixed(2),
      estimatedCostWei: estimatedCost.toString(),
      estimatedCostEth: (Number(estimatedCost) / 1e18).toFixed(6),
    }
  },

  // Get trending coins
  getTrending: async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending', {
      headers: { 'Accept': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`Trending API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      coins: data.coins?.slice(0, 10).map((item: any) => ({
        id: item.item.id,
        name: item.item.name,
        symbol: item.item.symbol,
        marketCapRank: item.item.market_cap_rank,
        priceChange24h: item.item.data?.price_change_percentage_24h?.usd,
      })) || [],
      timestamp: Date.now(),
    }
  },

  // Get chain info
  getChainInfo: async (params) => {
    const chain = (params.chain as string) || 'ethereum'
    
    const [blockNumber, gasPrice, chainId] = await Promise.all([
      jsonRpcCall(chain, 'eth_blockNumber', []),
      jsonRpcCall(chain, 'eth_gasPrice', []),
      jsonRpcCall(chain, 'eth_chainId', []),
    ])

    return {
      chain,
      chainId: parseInt(chainId as string, 16),
      latestBlock: parseInt(blockNumber as string, 16),
      gasPrice: (Number(BigInt(gasPrice as string)) / 1e9).toFixed(2) + ' gwei',
      rpcEndpoint: RPC_ENDPOINTS[chain] || 'unknown',
      nativeSymbol: NATIVE_SYMBOLS[chain] || 'ETH',
      timestamp: Date.now(),
    }
  },
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Rate limiting
    const clientId = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'anonymous'

    const rateLimit = checkRateLimit(clientId)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait before trying again.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
            'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const body = await request.json()
    const { toolId, toolName, parameters, chain, code } = body

    // Support both direct tool execution and code execution modes
    if (code) {
      // Code execution mode - execute user-provided code with real tools
      if (typeof code !== 'string' || code.length > 10000) {
        return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
      }

      const logs: string[] = []
      const safeConsole = {
        log: (...args: unknown[]) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
        },
        error: (...args: unknown[]) => {
          logs.push('[ERROR] ' + args.map(a => String(a)).join(' '))
        },
        info: (...args: unknown[]) => {
          logs.push('[INFO] ' + args.map(a => String(a)).join(' '))
        },
      }

      // Build execution context with real tool implementations
      const executionContext = {
        console: safeConsole,
        chain: chain || 'ethereum',
        // Expose tools as async functions
        getBalance: (address: string, chainParam?: string) =>
          toolImplementations.getBalance({ address, chain: chainParam || chain || 'ethereum' }),
        getTokenBalance: (address: string, token: string, decimals?: number, chainParam?: string) =>
          toolImplementations.getTokenBalance({ address, token, decimals: decimals || 18, chain: chainParam || chain || 'ethereum' }),
        getTokenPrice: (symbol: string, currency?: string) =>
          toolImplementations.getTokenPrice({ symbol, currency: currency || 'usd' }),
        getGasPrice: (chainParam?: string) =>
          toolImplementations.getGasPrice({ chain: chainParam || chain || 'ethereum' }),
        getTransactionStatus: (txHash: string, chainParam?: string) =>
          toolImplementations.getTransactionStatus({ txHash, chain: chainParam || chain || 'ethereum' }),
        getTokenInfo: (address: string, chainParam?: string) =>
          toolImplementations.getTokenInfo({ address, chain: chainParam || chain || 'ethereum' }),
        getBlock: (blockNumber?: string | number, chainParam?: string) =>
          toolImplementations.getBlock({ blockNumber: blockNumber || 'latest', chain: chainParam || chain || 'ethereum' }),
        estimateGas: (params: Record<string, unknown>, chainParam?: string) =>
          toolImplementations.estimateGas({ ...params, chain: chainParam || chain || 'ethereum' }),
        getTrending: () => toolImplementations.getTrending({}),
        getChainInfo: (chainParam?: string) =>
          toolImplementations.getChainInfo({ chain: chainParam || chain || 'ethereum' }),
      }

      let result: unknown
      try {
        const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
        const fn = new AsyncFunction(
          ...Object.keys(executionContext),
          code
        )
        result = await fn(...Object.values(executionContext))
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Execution failed'
        return NextResponse.json(
          { error: errorMessage, logs },
          { status: 400 }
        )
      }

      const executionTime = Date.now() - startTime

      return NextResponse.json({
        success: true,
        result,
        logs,
        executionTime,
        chain: chain || 'ethereum',
      })
    }

    // Direct tool execution mode
    if (!toolId && !toolName) {
      return NextResponse.json(
        { error: 'Either code or toolId/toolName is required' },
        { status: 400 }
      )
    }

    const toolKey = toolId || toolName
    const implementation = toolImplementations[toolKey]

    if (!implementation) {
      return NextResponse.json(
        { error: `Unknown tool: ${toolKey}. Available tools: ${Object.keys(toolImplementations).join(', ')}` },
        { status: 400 }
      )
    }

    const result = await implementation({ ...parameters, chain })
    const executionTime = Date.now() - startTime

    return NextResponse.json(
      {
        success: true,
        result,
        metadata: {
          toolId: toolKey,
          executionTime,
          chain: chain || 'ethereum',
          timestamp: new Date().toISOString(),
        },
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-Execution-Time': executionTime.toString(),
        },
      }
    )
  } catch (error: unknown) {
    console.error('[Playground Execute Error]', error)
    const errorMessage = error instanceof Error ? error.message : 'Execution failed'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
