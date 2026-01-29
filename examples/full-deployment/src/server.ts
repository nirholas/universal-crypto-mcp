/**
 * Universal Crypto MCP - Full Production Deployment
 * 
 * A comprehensive, production-ready MCP server providing cryptocurrency
 * market data, DeFi analytics, wallet operations, technical analysis,
 * and x402 payment integrations.
 * 
 * Features:
 * - Real-time market data via CoinGecko API
 * - DeFi protocol analytics via DefiLlama
 * - Multi-chain wallet balance checking
 * - Professional technical analysis with RSI, MACD, Bollinger Bands
 * - x402 HTTP payment protocol support
 * 
 * @author Universal Crypto MCP
 * @license Apache-2.0
 * @version 1.0.0
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

import {
  // Market Data
  getPrice,
  getPrices,
  getMarketOverview,
  getTrending,
  getCoinDetails,
  getFearGreedIndex,
  getOHLCV,
  
  // DeFi
  getTopProtocols,
  getProtocol,
  getBestYields,
  getChainTVLs,
  getStablecoins,
  getDexVolume,
  getBridgeVolume,
  
  // Wallet
  getNativeBalance,
  getTokenBalance,
  getGasPrice,
  getBlockNumber,
  getTransaction,
  getSupportedChains,
  isValidAddress,
  
  // Technical Analysis
  generateTradingSignal,
  calculateSupportResistance,
  
  // x402 Payments
  getX402Balance,
  estimatePaymentGas,
  getSupportedNetworks,
  getPaymentEnabledEndpoints,
  verifyPayment,
} from "./services/index.js";

// =============================================================================
// Tool Definitions
// =============================================================================

const marketDataTools: Tool[] = [
  {
    name: "get_price",
    description: "Get current price, 24h change, market cap, and volume for a cryptocurrency. Uses real-time data from CoinGecko.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Cryptocurrency symbol (e.g., BTC, ETH, SOL) or CoinGecko ID (e.g., bitcoin, ethereum)",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_prices",
    description: "Get prices for multiple cryptocurrencies in a single request. Efficient for portfolio tracking.",
    inputSchema: {
      type: "object",
      properties: {
        symbols: {
          type: "array",
          items: { type: "string" },
          description: "Array of cryptocurrency symbols (e.g., [\"BTC\", \"ETH\", \"SOL\"])",
        },
      },
      required: ["symbols"],
    },
  },
  {
    name: "get_market_overview",
    description: "Get global cryptocurrency market overview including total market cap, 24h volume, BTC/ETH dominance, and market sentiment.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_trending",
    description: "Get top 10 trending cryptocurrencies based on search volume and social activity.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_coin_details",
    description: "Get comprehensive details about a cryptocurrency including description, links, scores, and categories.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Cryptocurrency symbol or CoinGecko ID",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_fear_greed_index",
    description: "Get the Crypto Fear & Greed Index, which measures market sentiment from 0 (Extreme Fear) to 100 (Extreme Greed).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_ohlcv",
    description: "Get OHLCV (Open, High, Low, Close, Volume) candlestick data for technical analysis.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Cryptocurrency symbol or CoinGecko ID",
        },
        days: {
          type: "number",
          description: "Number of days of data (1, 7, 14, 30, 90, 180, 365)",
          default: 30,
        },
      },
      required: ["symbol"],
    },
  },
];

const defiTools: Tool[] = [
  {
    name: "get_defi_protocols",
    description: "Get top DeFi protocols ranked by Total Value Locked (TVL). Data from DefiLlama.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of protocols to return (max 100)",
          default: 20,
        },
      },
    },
  },
  {
    name: "get_protocol_details",
    description: "Get detailed information about a specific DeFi protocol including TVL breakdown by chain.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Protocol slug/ID (e.g., 'aave', 'uniswap', 'lido')",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_best_yields",
    description: "Find the best yield farming opportunities across DeFi protocols.",
    inputSchema: {
      type: "object",
      properties: {
        chain: {
          type: "string",
          description: "Filter by chain (e.g., 'ethereum', 'arbitrum', 'base')",
        },
        stablecoinOnly: {
          type: "boolean",
          description: "Show only stablecoin pools (lower risk)",
          default: false,
        },
        minTvl: {
          type: "number",
          description: "Minimum TVL in USD",
          default: 100000,
        },
        limit: {
          type: "number",
          description: "Number of results",
          default: 20,
        },
      },
    },
  },
  {
    name: "get_chain_tvl",
    description: "Get Total Value Locked across all chains to compare DeFi ecosystem sizes.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_stablecoins",
    description: "Get stablecoin market data including circulating supply and peg deviation.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_dex_volume",
    description: "Get decentralized exchange trading volume data.",
    inputSchema: {
      type: "object",
      properties: {
        chain: {
          type: "string",
          description: "Filter by chain (optional)",
        },
      },
    },
  },
  {
    name: "get_bridge_volume",
    description: "Get cross-chain bridge volume data.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

const walletTools: Tool[] = [
  {
    name: "get_wallet_balance",
    description: "Get native token balance (ETH, MATIC, etc.) for a wallet address on a specific chain.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Ethereum-compatible wallet address (0x...)",
        },
        chain: {
          type: "string",
          description: "Chain name: ethereum, arbitrum, base, optimism, polygon, bsc, avalanche",
          default: "ethereum",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "get_token_balance",
    description: "Get ERC20 token balance for a wallet address.",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Wallet address",
        },
        chain: {
          type: "string",
          description: "Chain name",
        },
        token: {
          type: "string",
          description: "Token symbol (e.g., USDC, USDT, DAI)",
        },
      },
      required: ["address", "chain", "token"],
    },
  },
  {
    name: "get_gas_price",
    description: "Get current gas price for a blockchain network.",
    inputSchema: {
      type: "object",
      properties: {
        chain: {
          type: "string",
          description: "Chain name",
          default: "ethereum",
        },
      },
    },
  },
  {
    name: "get_block_number",
    description: "Get the current block number for a blockchain network.",
    inputSchema: {
      type: "object",
      properties: {
        chain: {
          type: "string",
          description: "Chain name",
          default: "ethereum",
        },
      },
    },
  },
  {
    name: "get_transaction",
    description: "Get details about a blockchain transaction by hash.",
    inputSchema: {
      type: "object",
      properties: {
        chain: {
          type: "string",
          description: "Chain name",
        },
        txHash: {
          type: "string",
          description: "Transaction hash",
        },
      },
      required: ["chain", "txHash"],
    },
  },
  {
    name: "get_supported_chains",
    description: "List all supported blockchain networks with their details.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

const analysisTools: Tool[] = [
  {
    name: "get_trading_signal",
    description: "Generate comprehensive trading signals using RSI, MACD, Bollinger Bands, and Moving Averages.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Cryptocurrency symbol (e.g., BTC, ETH)",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_support_resistance",
    description: "Calculate support and resistance levels including pivot points.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Cryptocurrency symbol",
        },
      },
      required: ["symbol"],
    },
  },
];

const x402Tools: Tool[] = [
  {
    name: "x402_get_balance",
    description: "Get USDC balance for x402 payments on supported networks (Base, Arbitrum).",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Wallet address",
        },
        network: {
          type: "string",
          description: "Network: base-sepolia, base-mainnet, arbitrum-sepolia, arbitrum-mainnet",
          default: "base-sepolia",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "x402_estimate_payment",
    description: "Estimate gas cost for an x402 payment transaction.",
    inputSchema: {
      type: "object",
      properties: {
        network: {
          type: "string",
          description: "Network name",
        },
        from: {
          type: "string",
          description: "Sender address",
        },
        to: {
          type: "string",
          description: "Recipient address",
        },
        amountUsd: {
          type: "number",
          description: "Amount in USD",
        },
      },
      required: ["network", "from", "to", "amountUsd"],
    },
  },
  {
    name: "x402_verify_payment",
    description: "Verify a payment transaction on the blockchain.",
    inputSchema: {
      type: "object",
      properties: {
        transactionHash: {
          type: "string",
          description: "Transaction hash",
        },
        network: {
          type: "string",
          description: "Network name",
        },
        expectedTo: {
          type: "string",
          description: "Expected recipient address",
        },
        expectedAmount: {
          type: "string",
          description: "Expected amount",
        },
      },
      required: ["transactionHash", "network", "expectedTo", "expectedAmount"],
    },
  },
  {
    name: "x402_get_networks",
    description: "Get list of supported x402 payment networks with configuration details.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "x402_get_endpoints",
    description: "Get list of payment-enabled API endpoints with pricing.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

const allTools: Tool[] = [
  ...marketDataTools,
  ...defiTools,
  ...walletTools,
  ...analysisTools,
  ...x402Tools,
];

// =============================================================================
// Tool Handlers
// =============================================================================

async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  try {
    let result: unknown;
    
    switch (name) {
      // Market Data Tools
      case "get_price":
        result = await getPrice(args.symbol as string);
        break;
        
      case "get_prices":
        result = await getPrices(args.symbols as string[]);
        break;
        
      case "get_market_overview":
        result = await getMarketOverview();
        break;
        
      case "get_trending":
        result = await getTrending();
        break;
        
      case "get_coin_details":
        result = await getCoinDetails(args.symbol as string);
        break;
        
      case "get_fear_greed_index":
        result = await getFearGreedIndex();
        break;
        
      case "get_ohlcv":
        result = await getOHLCV(
          args.symbol as string,
          (args.days as number) || 30
        );
        break;
        
      // DeFi Tools
      case "get_defi_protocols":
        result = await getTopProtocols((args.limit as number) || 20);
        break;
        
      case "get_protocol_details":
        result = await getProtocol(args.slug as string);
        break;
        
      case "get_best_yields":
        result = await getBestYields({
          chain: args.chain as string | undefined,
          stablecoinOnly: (args.stablecoinOnly as boolean) || false,
          minTvl: (args.minTvl as number) || 100000,
          limit: (args.limit as number) || 20,
        });
        break;
        
      case "get_chain_tvl":
        result = await getChainTVLs();
        break;
        
      case "get_stablecoins":
        result = await getStablecoins();
        break;
        
      case "get_dex_volume":
        result = await getDexVolume(args.chain as string | undefined);
        break;
        
      case "get_bridge_volume":
        result = await getBridgeVolume();
        break;
        
      // Wallet Tools
      case "get_wallet_balance":
        result = await getNativeBalance(
          args.address as string,
          (args.chain as string) || "ethereum"
        );
        break;
        
      case "get_token_balance":
        result = await getTokenBalance(
          args.address as string,
          args.chain as string,
          args.token as string
        );
        break;
        
      case "get_gas_price":
        result = await getGasPrice((args.chain as string) || "ethereum");
        break;
        
      case "get_block_number":
        result = await getBlockNumber((args.chain as string) || "ethereum");
        break;
        
      case "get_transaction":
        result = await getTransaction(
          args.chain as string,
          args.txHash as string
        );
        break;
        
      case "get_supported_chains":
        result = getSupportedChains();
        break;
        
      // Analysis Tools
      case "get_trading_signal":
        result = await generateTradingSignal(args.symbol as string);
        break;
        
      case "get_support_resistance": {
        const ohlcv = await getOHLCV(args.symbol as string, 30);
        result = calculateSupportResistance(ohlcv.data);
        break;
      }
        
      // x402 Tools
      case "x402_get_balance":
        result = await getX402Balance(
          args.address as string,
          (args.network as string) || "base-sepolia"
        );
        break;
        
      case "x402_estimate_payment":
        result = await estimatePaymentGas(
          args.network as string,
          args.from as string,
          args.to as string,
          args.amountUsd as number
        );
        break;
        
      case "x402_verify_payment":
        result = await verifyPayment(
          args.transactionHash as string,
          args.network as string,
          args.expectedTo as string,
          args.expectedAmount as string
        );
        break;
        
      case "x402_get_networks":
        result = getSupportedNetworks();
        break;
        
      case "x402_get_endpoints":
        result = getPaymentEnabledEndpoints();
        break;
        
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
    };
  }
}

// =============================================================================
// Server Setup
// =============================================================================

async function main() {
  const server = new Server(
    {
      name: "universal-crypto-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );
  
  // Register tool listing handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools,
  }));
  
  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handleToolCall(name, (args as Record<string, unknown>) || {});
  });
  
  // Start the server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("Universal Crypto MCP server started");
  console.error(`Registered ${allTools.length} tools across 5 categories:`);
  console.error(`  - Market Data: ${marketDataTools.length} tools`);
  console.error(`  - DeFi: ${defiTools.length} tools`);
  console.error(`  - Wallet: ${walletTools.length} tools`);
  console.error(`  - Analysis: ${analysisTools.length} tools`);
  console.error(`  - x402 Payments: ${x402Tools.length} tools`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
