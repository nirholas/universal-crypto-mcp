/**
 * MCP Server setup for DeFi Yields
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { getTopYields } from './tools/getTopYields';
import { getPoolDetails } from './tools/getPoolDetails';
import { getYieldHistory } from './tools/getYieldHistory';
import { compareYields } from './tools/compareYields';
import { getStablecoinYields } from './tools/getStablecoinYields';
import { getLPYields } from './tools/getLPYields';
import { estimateReturns } from './tools/estimateReturns';
import { getRiskAssessment } from './tools/getRiskAssessment';

const TOOLS: Tool[] = [
  {
    name: 'getTopYields',
    description: 'Get top DeFi yields across protocols and chains. Filter by chain, TVL, APY, risk level, and stablecoin-only options.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Filter by blockchain (e.g., "ethereum", "arbitrum", "polygon")',
        },
        minTvl: {
          type: 'number',
          description: 'Minimum TVL in USD',
        },
        minApy: {
          type: 'number',
          description: 'Minimum APY percentage',
        },
        maxRisk: {
          type: 'number',
          description: 'Maximum risk score (1-10)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 20)',
        },
        stablecoinOnly: {
          type: 'boolean',
          description: 'Only return stablecoin pools',
        },
      },
    },
  },
  {
    name: 'getPoolDetails',
    description: 'Get detailed information about a specific yield pool including APY breakdown, TVL, tokens, and audit status.',
    inputSchema: {
      type: 'object',
      properties: {
        poolId: {
          type: 'string',
          description: 'The unique pool identifier from DeFiLlama',
        },
      },
      required: ['poolId'],
    },
  },
  {
    name: 'getYieldHistory',
    description: 'Get historical APY and TVL data for a yield pool.',
    inputSchema: {
      type: 'object',
      properties: {
        poolId: {
          type: 'string',
          description: 'The unique pool identifier',
        },
        days: {
          type: 'number',
          description: 'Number of days of history (default: 30)',
        },
      },
      required: ['poolId'],
    },
  },
  {
    name: 'compareYields',
    description: 'Compare multiple yield pools side by side with analysis and recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        poolIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of pool identifiers to compare',
        },
      },
      required: ['poolIds'],
    },
  },
  {
    name: 'getStablecoinYields',
    description: 'Get yield opportunities specifically for stablecoins (USDC, USDT, DAI, FRAX, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        stablecoin: {
          type: 'string',
          description: 'Specific stablecoin to filter (e.g., "USDC", "USDT", "DAI")',
        },
        chain: {
          type: 'string',
          description: 'Filter by blockchain',
        },
        minApy: {
          type: 'number',
          description: 'Minimum APY percentage',
        },
      },
    },
  },
  {
    name: 'getLPYields',
    description: 'Find liquidity pool yields for a specific token pair.',
    inputSchema: {
      type: 'object',
      properties: {
        token0: {
          type: 'string',
          description: 'First token symbol (e.g., "ETH", "WBTC")',
        },
        token1: {
          type: 'string',
          description: 'Second token symbol (e.g., "USDC", "DAI")',
        },
        chain: {
          type: 'string',
          description: 'Filter by blockchain',
        },
      },
      required: ['token0', 'token1'],
    },
  },
  {
    name: 'estimateReturns',
    description: 'Estimate potential returns for a given investment amount and time period.',
    inputSchema: {
      type: 'object',
      properties: {
        poolId: {
          type: 'string',
          description: 'The pool identifier',
        },
        amount: {
          type: 'number',
          description: 'Investment amount in USD',
        },
        days: {
          type: 'number',
          description: 'Investment period in days',
        },
      },
      required: ['poolId', 'amount', 'days'],
    },
  },
  {
    name: 'getRiskAssessment',
    description: 'Get a comprehensive risk assessment for a yield pool including IL risk, smart contract risk, and audit status.',
    inputSchema: {
      type: 'object',
      properties: {
        poolId: {
          type: 'string',
          description: 'The pool identifier',
        },
      },
      required: ['poolId'],
    },
  },
];

export class YieldsServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'boosty-mcp-yields',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: unknown;

        switch (name) {
          case 'getTopYields':
            result = await getTopYields(args as any);
            break;
          case 'getPoolDetails':
            result = await getPoolDetails(args as any);
            break;
          case 'getYieldHistory':
            result = await getYieldHistory(args as any);
            break;
          case 'compareYields':
            result = await compareYields(args as any);
            break;
          case 'getStablecoinYields':
            result = await getStablecoinYields(args as any);
            break;
          case 'getLPYields':
            result = await getLPYields(args as any);
            break;
          case 'estimateReturns':
            result = await estimateReturns(args as any);
            break;
          case 'getRiskAssessment':
            result = await getRiskAssessment(args as any);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: errorMessage }),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('boosty MCP Yields server running on stdio');
  }
}

export function createYieldsServer(): YieldsServer {
  return new YieldsServer();
}
