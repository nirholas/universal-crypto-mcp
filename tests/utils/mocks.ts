/**
 * Mock Utilities for Testing
 * 
 * Provides mock implementations of common objects for testing.
 * 
 * @author nich
 * @github github.com/nirholas
 * @license Apache-2.0
 */

import { vi } from "vitest"

/**
 * Create a mock MCP server for testing
 */
export function createMockMcpServer() {
  return {
    registerTool: vi.fn(),
    tool: vi.fn(),
    registerResource: vi.fn(),
    resource: vi.fn(),
    registerPrompt: vi.fn(),
    prompt: vi.fn(),
    connect: vi.fn(),
    close: vi.fn(),
    callTool: vi.fn(),
    listTools: vi.fn().mockResolvedValue({ tools: [] }),
    listResources: vi.fn().mockResolvedValue({ resources: [] }),
    listPrompts: vi.fn().mockResolvedValue({ prompts: [] }),
  }
}

/**
 * Create a mock EVM wallet for testing
 */
export function createMockWallet() {
  return {
    address: "0x1234567890123456789012345678901234567890",
    
    getBalance: vi.fn().mockResolvedValue({
      raw: "1000000000000000000",
      formatted: "1.0",
      decimals: 18,
      symbol: "ETH",
    }),
    
    getTokenBalance: vi.fn().mockResolvedValue({
      raw: "1000000000",
      formatted: "1000.0",
      decimals: 6,
      symbol: "USDC",
    }),
    
    transfer: vi.fn().mockResolvedValue({
      hash: "0xabc123...",
      status: "pending",
      from: "0x1234567890123456789012345678901234567890",
      to: "0x0987654321098765432109876543210987654321",
      value: "100000000000000000",
    }),
    
    sendToken: vi.fn().mockResolvedValue({
      hash: "0xdef456...",
      status: "pending",
    }),
    
    signMessage: vi.fn().mockResolvedValue("0xsignature..."),
    
    signTypedData: vi.fn().mockResolvedValue("0xtyped_signature..."),
    
    getNonce: vi.fn().mockResolvedValue(5),
    
    estimateGas: vi.fn().mockResolvedValue({
      gasLimit: 21000,
      gasPrice: "25000000000",
      estimatedCost: "0.000525 ETH",
    }),
  }
}

/**
 * Create a mock x402 response for testing
 */
export function createMockX402Response() {
  return {
    status: 402,
    headers: {
      "content-type": "application/json",
      "x-payment-required": "true",
    },
    body: {
      x402Version: 2,
      accepts: [
        {
          scheme: "exact",
          network: "eip155:42161",
          maxAmountRequired: "1000000",
          resource: "/api/premium/data",
          description: "Premium API access",
          mimeType: "application/json",
          payTo: "0x0987654321098765432109876543210987654321",
          asset: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          extra: {
            name: "USDC",
            version: "2",
          },
        },
      ],
      error: null,
    },
  }
}

/**
 * Create a mock trading exchange client
 */
export function createMockExchange() {
  return {
    getTicker: vi.fn().mockResolvedValue({
      symbol: "BTCUSDT",
      price: "67890.12",
      change24h: "2.34",
      volume: "1234567890",
    }),
    
    getBalance: vi.fn().mockResolvedValue({
      asset: "BTC",
      free: "0.5",
      locked: "0.0",
      total: "0.5",
    }),
    
    placeOrder: vi.fn().mockResolvedValue({
      orderId: "123456",
      symbol: "BTCUSDT",
      side: "BUY",
      type: "LIMIT",
      price: "65000.00",
      quantity: "0.001",
      status: "NEW",
    }),
    
    cancelOrder: vi.fn().mockResolvedValue({
      orderId: "123456",
      status: "CANCELED",
    }),
    
    getOpenOrders: vi.fn().mockResolvedValue([]),
    
    getOrderHistory: vi.fn().mockResolvedValue([
      {
        orderId: "123456",
        symbol: "BTCUSDT",
        side: "BUY",
        price: "65000.00",
        quantity: "0.001",
        executedQty: "0.001",
        status: "FILLED",
        time: Date.now() - 3600000,
      },
    ]),
  }
}

/**
 * Create a mock DeFi protocol client
 */
export function createMockDeFiProtocol() {
  return {
    getSwapQuote: vi.fn().mockResolvedValue({
      fromToken: { symbol: "ETH", amount: "1.0" },
      toToken: { symbol: "USDC", amount: "3456.78" },
      rate: 3456.78,
      priceImpact: "0.05%",
      sources: [{ name: "Uniswap V3", percentage: 100 }],
      estimatedGas: "150000",
      gasCostUsd: "$0.15",
    }),
    
    executeSwap: vi.fn().mockResolvedValue({
      hash: "0xswap123...",
      status: "pending",
      fromToken: { symbol: "ETH", amount: "1.0" },
      toToken: { symbol: "USDC", amount: "3445.12" },
    }),
    
    getLendingPosition: vi.fn().mockResolvedValue({
      protocol: "Aave V3",
      chain: "ethereum",
      healthFactor: 1.85,
      netWorthUsd: 5000.0,
      supplies: [
        {
          asset: "ETH",
          balance: "1.5",
          valueUsd: 5185.17,
          apy: "2.1%",
        },
      ],
      borrows: [
        {
          asset: "USDC",
          balance: "1000",
          valueUsd: 1000.0,
          apy: "-3.5%",
        },
      ],
    }),
    
    deposit: vi.fn().mockResolvedValue({
      hash: "0xdeposit123...",
      status: "confirmed",
      protocol: "Aave V3",
      action: "supply",
      asset: "ETH",
      amount: "0.5",
    }),
  }
}

/**
 * Create a mock market data provider
 */
export function createMockMarketDataProvider() {
  return {
    getPrice: vi.fn().mockResolvedValue({
      symbol: "BTC",
      name: "Bitcoin",
      price: 67890.12,
      change24h: 2.34,
      marketCap: 1320000000000,
      volume24h: 28500000000,
      lastUpdated: new Date().toISOString(),
    }),
    
    getPrices: vi.fn().mockResolvedValue([
      { symbol: "BTC", price: 67890.12, change24h: 2.34 },
      { symbol: "ETH", price: 3456.78, change24h: 1.85 },
    ]),
    
    getOHLCV: vi.fn().mockResolvedValue({
      symbol: "BTC",
      interval: "1d",
      candles: [
        {
          timestamp: new Date().toISOString(),
          open: 67000,
          high: 68500,
          low: 66500,
          close: 67890,
          volume: 25000000000,
        },
      ],
    }),
    
    getTrending: vi.fn().mockResolvedValue({
      trending: [
        {
          rank: 1,
          symbol: "PEPE",
          name: "Pepe",
          price: 0.00001234,
          change24h: 45.6,
          marketCap: 5000000000,
        },
      ],
    }),
  }
}

/**
 * Create a mock blockchain provider (RPC)
 */
export function createMockProvider() {
  return {
    getBlockNumber: vi.fn().mockResolvedValue(12345678),
    
    getBlock: vi.fn().mockResolvedValue({
      number: 12345678,
      hash: "0xblock123...",
      timestamp: Math.floor(Date.now() / 1000),
      transactions: [],
    }),
    
    getTransaction: vi.fn().mockResolvedValue({
      hash: "0xtx123...",
      from: "0x1234567890123456789012345678901234567890",
      to: "0x0987654321098765432109876543210987654321",
      value: "1000000000000000000",
      gasPrice: "25000000000",
      gasUsed: "21000",
      status: 1,
    }),
    
    getTransactionReceipt: vi.fn().mockResolvedValue({
      transactionHash: "0xtx123...",
      status: 1,
      gasUsed: "21000",
      effectiveGasPrice: "25000000000",
      logs: [],
    }),
    
    call: vi.fn().mockResolvedValue("0x40252CFDF8B20Ed757D61ff157719F33Ec332402000000000de0b6b3a7640000"),
    
    estimateGas: vi.fn().mockResolvedValue(21000),
  }
}
