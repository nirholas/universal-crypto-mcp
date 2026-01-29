/**
 * Combined MCP Server
 * Registers all tools from prices, wallets, and yields packages
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import price tools
import {
  getTokenPrice,
  getTokenPriceDefinition,
  getGasPrices,
  getGasPricesDefinition,
  getTopMovers,
  getTopMoversDefinition,
  getFearGreedIndex,
  getFearGreedIndexDefinition,
  comparePrices,
  comparePricesDefinition,
  getTokenPriceHistory,
  getTokenPriceHistoryDefinition,
} from '@boosty/mcp-prices';

// Import wallet tools
import {
  getWalletPortfolio,
  getWalletPortfolioDefinition,
  getTokenBalances,
  getTokenBalancesDefinition,
  getNFTs,
  getNFTsDefinition,
  getDeFiPositions,
  getDeFiPositionsDefinition,
  getApprovals,
  getApprovalsDefinition,
} from '@boosty/mcp-wallets';

// Import yield tools
import {
  getTopYields,
  getTopYieldsDefinition,
  getPoolDetails,
  getPoolDetailsDefinition,
  compareYields,
  compareYieldsDefinition,
  getStablecoinYields,
  getStablecoinYieldsDefinition,
  getRiskAssessment,
  getRiskAssessmentDefinition,
  getYieldHistory,
  getYieldHistoryDefinition,
  getLPYields,
  getLPYieldsDefinition,
  estimateReturns,
  estimateReturnsDefinition,
} from '@boosty/mcp-yields';

export interface CombinedServerOptions {
  enablePrices?: boolean;
  enableWallets?: boolean;
  enableYields?: boolean;
}

// Tool registry with categories
const priceTools = [
  { definition: getTokenPriceDefinition, handler: getTokenPrice },
  { definition: getGasPricesDefinition, handler: getGasPrices },
  { definition: getTopMoversDefinition, handler: getTopMovers },
  { definition: getFearGreedIndexDefinition, handler: getFearGreedIndex },
  { definition: comparePricesDefinition, handler: comparePrices },
  { definition: getTokenPriceHistoryDefinition, handler: getTokenPriceHistory },
];

const walletTools = [
  { definition: getWalletPortfolioDefinition, handler: getWalletPortfolio },
  { definition: getTokenBalancesDefinition, handler: getTokenBalances },
  { definition: getNFTsDefinition, handler: getNFTs },
  { definition: getDeFiPositionsDefinition, handler: getDeFiPositions },
  { definition: getApprovalsDefinition, handler: getApprovals },
];

const yieldTools = [
  { definition: getTopYieldsDefinition, handler: getTopYields },
  { definition: getPoolDetailsDefinition, handler: getPoolDetails },
  { definition: compareYieldsDefinition, handler: compareYields },
  { definition: getStablecoinYieldsDefinition, handler: getStablecoinYields },
  { definition: getRiskAssessmentDefinition, handler: getRiskAssessment },
  { definition: getYieldHistoryDefinition, handler: getYieldHistory },
  { definition: getLPYieldsDefinition, handler: getLPYields },
  { definition: estimateReturnsDefinition, handler: estimateReturns },
];

export function createCombinedServer(options: CombinedServerOptions = {}): Server {
  const {
    enablePrices = true,
    enableWallets = true,
    enableYields = true,
  } = options;

  // Build tools list based on options
  const tools: Array<{ definition: any; handler: Function }> = [];
  
  if (enablePrices) {
    tools.push(...priceTools);
  }
  if (enableWallets) {
    tools.push(...walletTools);
  }
  if (enableYields) {
    tools.push(...yieldTools);
  }

  const server = new Server(
    {
      name: 'boosty-mcp-defi',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => t.definition),
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const tool = tools.find((t) => t.definition.name === name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      const result = await tool.handler(args as any);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: message }),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export async function runServer(options: CombinedServerOptions = {}): Promise<void> {
  const server = createCombinedServer(options);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('boosty MCP DeFi server running on stdio');
}
