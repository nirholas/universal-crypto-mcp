/**
 * Wallets MCP Server
 * Provides wallet analytics, portfolio tracking, and balance data
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';

import {
  getWalletPortfolio,
  getWalletPortfolioDefinition,
  getTokenBalances,
  getTokenBalancesDefinition,
  getNFTs,
  getNFTsDefinition,
  getDeFiPositions,
  getDeFiPositionsDefinition,
  getWalletHistory,
  getWalletHistoryDefinition,
  getApprovals,
  getApprovalsDefinition,
  resolveENS,
  resolveENSDefinition,
} from './tools';

// Tool definitions for MCP
const tools: Tool[] = [
  {
    name: 'getWalletPortfolio',
    description: getWalletPortfolioDefinition.description,
    inputSchema: getWalletPortfolioDefinition.inputSchema,
  },
  {
    name: 'getTokenBalances',
    description: getTokenBalancesDefinition.description,
    inputSchema: getTokenBalancesDefinition.inputSchema,
  },
  {
    name: 'getNFTs',
    description: getNFTsDefinition.description,
    inputSchema: getNFTsDefinition.inputSchema,
  },
  {
    name: 'getDeFiPositions',
    description: getDeFiPositionsDefinition.description,
    inputSchema: getDeFiPositionsDefinition.inputSchema,
  },
  {
    name: 'getWalletHistory',
    description: getWalletHistoryDefinition.description,
    inputSchema: getWalletHistoryDefinition.inputSchema,
  },
  {
    name: 'getApprovals',
    description: getApprovalsDefinition.description,
    inputSchema: getApprovalsDefinition.inputSchema,
  },
  {
    name: 'resolveENS',
    description: resolveENSDefinition.description,
    inputSchema: resolveENSDefinition.inputSchema,
  },
];

// Wrapper to handle Zod schema parsing - cast to any to avoid strict type issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapHandler(handler: (input: any) => Promise<any>): (args: unknown) => Promise<unknown> {
  return async (args: unknown) => {
    return handler(args);
  };
}

// Tool handlers map
const toolHandlers: Record<string, (args: unknown) => Promise<unknown>> = {
  getWalletPortfolio: wrapHandler(getWalletPortfolio),
  getTokenBalances: wrapHandler(getTokenBalances),
  getNFTs: wrapHandler(getNFTs),
  getDeFiPositions: wrapHandler(getDeFiPositions),
  getWalletHistory: wrapHandler(getWalletHistory),
  getApprovals: wrapHandler(getApprovals),
  resolveENS: wrapHandler(resolveENS),
};

export class WalletsServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: '@boosty/mcp-wallets',
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
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const handler = toolHandlers[name];
      if (!handler) {
        throw new Error(`Unknown tool: ${name}`);
      }

      try {
        const result = await handler(args);
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

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Wallets MCP Server started');
  }

  async stop(): Promise<void> {
    await this.server.close();
    console.error('Wallets MCP Server stopped');
  }
}

export function createWalletsServer(): WalletsServer {
  return new WalletsServer();
}
