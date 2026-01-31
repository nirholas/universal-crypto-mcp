/**
 * Unified Tool Registry
 * 
 * Registers all MCP tools from all packages with the server
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { z } from "zod";

// Import tool registrations from packages (these would be actual imports in production)
// For now, we'll create a unified registration system

export interface ToolCategory {
  name: string;
  description: string;
  tools: ToolDefinition[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  price: string;
  category: string;
  handler: (params: any) => Promise<any>;
  schema: z.ZodSchema;
}

// Tool registry
const toolRegistry: Map<string, ToolDefinition> = new Map();

/**
 * Register all tools from all packages
 */
export function registerAllTools(server: Server): void {
  Logger.info('[Tools] Registering all MCP tools');

  // DeFi Tools
  registerDeFiTools(server);

  // Trading Tools
  registerTradingTools(server);

  // Market Data Tools
  registerMarketDataTools(server);

  // NFT Tools
  registerNFTTools(server);

  // Wallet Tools
  registerWalletTools(server);

  // Security Tools
  registerSecurityTools(server);

  Logger.info(`[Tools] Registered ${toolRegistry.size} tools`);
}

/**
 * DeFi Tools Registration
 */
function registerDeFiTools(server: Server): void {
  // Aave Tools
  server.setRequestHandler({
    method: "tools/call",
  } as any, async (request: any) => {
    // Dynamic tool routing
    const toolName = request.params?.name;
    const tool = toolRegistry.get(toolName);
    if (tool) {
      return tool.handler(request.params?.arguments);
    }
    throw new Error(`Tool not found: ${toolName}`);
  });

  // Register Aave tools
  const aaveTools = [
    {
      name: "aave_get_user_account",
      description: "Get user's Aave account data including collateral, debt, and health factor",
      price: "0.002",
      category: "defi",
      schema: z.object({
        userAddress: z.string().describe("The user's wallet address"),
        rpcUrl: z.string().optional().describe("Custom RPC URL"),
      }),
    },
    {
      name: "aave_get_reserve_data",
      description: "Get detailed data about an Aave reserve",
      price: "0.002",
      category: "defi",
      schema: z.object({
        assetAddress: z.string().describe("The asset token address"),
        rpcUrl: z.string().optional(),
      }),
    },
    {
      name: "aave_get_lending_rates",
      description: "Get current lending and borrowing rates for all Aave markets",
      price: "0.001",
      category: "defi",
      schema: z.object({
        network: z.string().optional().default("ethereum"),
      }),
    },
  ];

  aaveTools.forEach((tool) => {
    registerTool(server, {
      ...tool,
      handler: async (params) => mockDefiResponse(tool.name, params),
    });
  });

  // Uniswap Tools
  const uniswapTools = [
    {
      name: "uniswap_get_quote",
      description: "Get swap quote from Uniswap V3",
      price: "0.002",
      category: "defi",
      schema: z.object({
        tokenIn: z.string(),
        tokenOut: z.string(),
        amountIn: z.string(),
        slippage: z.number().optional().default(0.5),
      }),
    },
    {
      name: "uniswap_get_pool_info",
      description: "Get Uniswap V3 pool information",
      price: "0.001",
      category: "defi",
      schema: z.object({
        token0: z.string(),
        token1: z.string(),
        fee: z.number().optional().default(3000),
      }),
    },
  ];

  uniswapTools.forEach((tool) => {
    registerTool(server, {
      ...tool,
      handler: async (params) => mockDefiResponse(tool.name, params),
    });
  });

  // Compound Tools
  registerTool(server, {
    name: "compound_get_markets",
    description: "Get all Compound V3 markets data",
    price: "0.001",
    category: "defi",
    schema: z.object({ network: z.string().optional() }),
    handler: async (params) => mockDefiResponse("compound_get_markets", params),
  });
}

/**
 * Trading Tools Registration
 */
function registerTradingTools(server: Server): void {
  const tradingTools = [
    {
      name: "binance_get_price",
      description: "Get current price for a trading pair on Binance",
      price: "0.001",
      category: "trading",
      schema: z.object({
        symbol: z.string().describe("Trading pair (e.g., BTCUSDT)"),
      }),
    },
    {
      name: "binance_get_ticker_24h",
      description: "Get 24h statistics for a trading pair",
      price: "0.001",
      category: "trading",
      schema: z.object({
        symbol: z.string(),
      }),
    },
    {
      name: "binance_get_order_book",
      description: "Get order book depth for a trading pair",
      price: "0.002",
      category: "trading",
      schema: z.object({
        symbol: z.string(),
        limit: z.number().optional().default(20),
      }),
    },
    {
      name: "binance_get_klines",
      description: "Get candlestick/kline data",
      price: "0.002",
      category: "trading",
      schema: z.object({
        symbol: z.string(),
        interval: z.enum(["1m", "5m", "15m", "1h", "4h", "1d"]),
        limit: z.number().optional().default(100),
      }),
    },
    {
      name: "trading_compare_prices",
      description: "Compare prices across multiple exchanges",
      price: "0.003",
      category: "trading",
      schema: z.object({
        symbol: z.string().describe("Trading pair (e.g., BTC/USDT)"),
      }),
    },
    {
      name: "trading_smart_route",
      description: "Find the best exchange to execute a trade",
      price: "0.005",
      category: "trading",
      schema: z.object({
        symbol: z.string(),
        side: z.enum(["buy", "sell"]),
        amount: z.number(),
      }),
    },
  ];

  tradingTools.forEach((tool) => {
    registerTool(server, {
      ...tool,
      handler: async (params) => mockTradingResponse(tool.name, params),
    });
  });
}

/**
 * Market Data Tools Registration
 */
function registerMarketDataTools(server: Server): void {
  const marketTools = [
    {
      name: "coingecko_get_price",
      description: "Get cryptocurrency price from CoinGecko",
      price: "0.001",
      category: "market-data",
      schema: z.object({
        coinId: z.string(),
        currency: z.string().optional().default("usd"),
      }),
    },
    {
      name: "coingecko_get_trending",
      description: "Get trending cryptocurrencies",
      price: "0.001",
      category: "market-data",
      schema: z.object({}),
    },
    {
      name: "coingecko_get_top_coins",
      description: "Get top coins by market cap",
      price: "0.001",
      category: "market-data",
      schema: z.object({
        limit: z.number().optional().default(100),
      }),
    },
    {
      name: "get_fear_greed_index",
      description: "Get crypto Fear & Greed Index",
      price: "0.001",
      category: "market-data",
      schema: z.object({
        days: z.number().optional().default(1),
      }),
    },
    {
      name: "get_market_overview",
      description: "Get comprehensive market overview with indicators and sentiment",
      price: "0.003",
      category: "market-data",
      schema: z.object({
        symbol: z.string(),
        includeIndicators: z.boolean().optional().default(true),
        includeSentiment: z.boolean().optional().default(true),
      }),
    },
    {
      name: "get_crypto_news",
      description: "Get latest cryptocurrency news",
      price: "0.001",
      category: "market-data",
      schema: z.object({
        filter: z.enum(["all", "important", "hot"]).optional().default("all"),
        limit: z.number().optional().default(10),
      }),
    },
  ];

  marketTools.forEach((tool) => {
    registerTool(server, {
      ...tool,
      handler: async (params) => mockMarketDataResponse(tool.name, params),
    });
  });
}

/**
 * NFT Tools Registration
 */
function registerNFTTools(server: Server): void {
  const nftTools = [
    {
      name: "nft_get_collection",
      description: "Get NFT collection data",
      price: "0.002",
      category: "nft",
      schema: z.object({
        address: z.string(),
        chain: z.string().optional().default("ethereum"),
      }),
    },
    {
      name: "nft_get_floor_price",
      description: "Get NFT collection floor price",
      price: "0.001",
      category: "nft",
      schema: z.object({
        collection: z.string(),
      }),
    },
  ];

  nftTools.forEach((tool) => {
    registerTool(server, {
      ...tool,
      handler: async (params) => mockNFTResponse(tool.name, params),
    });
  });
}

/**
 * Wallet Tools Registration
 */
function registerWalletTools(server: Server): void {
  const walletTools = [
    {
      name: "wallet_get_balance",
      description: "Get wallet balance across chains",
      price: "0.001",
      category: "wallet",
      schema: z.object({
        address: z.string(),
        chains: z.array(z.string()).optional(),
      }),
    },
    {
      name: "wallet_get_transactions",
      description: "Get wallet transaction history",
      price: "0.002",
      category: "wallet",
      schema: z.object({
        address: z.string(),
        limit: z.number().optional().default(50),
      }),
    },
    {
      name: "wallet_get_tokens",
      description: "Get all tokens in a wallet",
      price: "0.001",
      category: "wallet",
      schema: z.object({
        address: z.string(),
        chain: z.string().optional().default("ethereum"),
      }),
    },
  ];

  walletTools.forEach((tool) => {
    registerTool(server, {
      ...tool,
      handler: async (params) => mockWalletResponse(tool.name, params),
    });
  });
}

/**
 * Security Tools Registration
 */
function registerSecurityTools(server: Server): void {
  const securityTools = [
    {
      name: "security_audit_contract",
      description: "Run security audit on a smart contract",
      price: "0.01",
      category: "security",
      schema: z.object({
        address: z.string(),
        chain: z.string().optional().default("ethereum"),
      }),
    },
    {
      name: "security_check_token",
      description: "Check token for rug pull indicators",
      price: "0.005",
      category: "security",
      schema: z.object({
        address: z.string(),
        chain: z.string(),
      }),
    },
  ];

  securityTools.forEach((tool) => {
    registerTool(server, {
      ...tool,
      handler: async (params) => mockSecurityResponse(tool.name, params),
    });
  });
}

/**
 * Register a tool with the server and registry
 */
function registerTool(server: Server, tool: Omit<ToolDefinition, "handler"> & { handler: (params: any) => Promise<any> }): void {
  toolRegistry.set(tool.name, tool as ToolDefinition);

  // Register with MCP server using the tools/list capability
  // The actual tool is registered in the request handler
}

// Mock response generators (replace with actual implementations)
async function mockDefiResponse(toolName: string, params: any) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        tool: toolName,
        params,
        result: { status: "success", data: "Mock DeFi data" },
        timestamp: new Date().toISOString(),
      }, null, 2),
    }],
  };
}

async function mockTradingResponse(toolName: string, params: any) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        tool: toolName,
        params,
        result: { 
          status: "success",
          price: 95000 + Math.random() * 1000,
          timestamp: new Date().toISOString(),
        },
      }, null, 2),
    }],
  };
}

async function mockMarketDataResponse(toolName: string, params: any) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        tool: toolName,
        params,
        result: { status: "success", data: "Mock market data" },
        timestamp: new Date().toISOString(),
      }, null, 2),
    }],
  };
}

async function mockNFTResponse(toolName: string, params: any) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        tool: toolName,
        params,
        result: { status: "success", data: "Mock NFT data" },
        timestamp: new Date().toISOString(),
      }, null, 2),
    }],
  };
}

async function mockWalletResponse(toolName: string, params: any) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        tool: toolName,
        params,
        result: { status: "success", data: "Mock wallet data" },
        timestamp: new Date().toISOString(),
      }, null, 2),
    }],
  };
}

async function mockSecurityResponse(toolName: string, params: any) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        tool: toolName,
        params,
        result: { status: "success", data: "Mock security audit" },
        timestamp: new Date().toISOString(),
      }, null, 2),
    }],
  };
}

/**
 * Get all registered tools
 */
export function getRegisteredTools(): ToolDefinition[] {
  return Array.from(toolRegistry.values());
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): ToolDefinition[] {
  return Array.from(toolRegistry.values()).filter(t => t.category === category);
}

/**
 * Get tool pricing
 */
export function getToolPricing(): Record<string, string> {
  const pricing: Record<string, string> = {};
  for (const [name, tool] of toolRegistry) {
    pricing[name] = tool.price;
  }
  return pricing;
}
