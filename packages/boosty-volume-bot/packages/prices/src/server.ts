/**
 * boosty MCP Prices Server
 * 
 * Production-ready MCP server for real-time DeFi price data.
 * Provides tools for token prices, gas prices, market movers, and sentiment.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import {
  getTokenPrice,
  getTokenPriceDefinition,
  getTokenPriceHistory,
  getTokenPriceHistoryDefinition,
  getGasPrices,
  getGasPricesDefinition,
  getTopMovers,
  getTopMoversDefinition,
  getFearGreedIndex,
  getFearGreedIndexDefinition,
  comparePrices,
  comparePricesDefinition,
} from './tools/index.js';

// ============================================================================
// Tool Registry
// ============================================================================

/**
 * All available tool definitions for the MCP protocol
 */
const TOOL_DEFINITIONS = [
  getTokenPriceDefinition,
  getTokenPriceHistoryDefinition,
  getGasPricesDefinition,
  getTopMoversDefinition,
  getFearGreedIndexDefinition,
  comparePricesDefinition,
];

/**
 * Tool handlers mapped by name
 */
const TOOL_HANDLERS: Record<string, (args: unknown) => Promise<unknown>> = {
  getTokenPrice,
  getTokenPriceHistory,
  getGasPrices,
  getTopMovers,
  getFearGreedIndex,
  comparePrices,
};

// ============================================================================
// Server Implementation
// ============================================================================

export interface PricesServerOptions {
  name?: string;
  version?: string;
}

export class PricesServer {
  private server: Server;
  private isRunning: boolean = false;

  constructor(options: PricesServerOptions = {}) {
    const { name = 'boosty-mcp-prices', version = '0.1.0' } = options;

    this.server = new Server(
      { name, version },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  /**
   * Set up MCP protocol handlers
   */
  private setupHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: TOOL_DEFINITIONS,
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const handler = TOOL_HANDLERS[name];
      if (!handler) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}. Available tools: ${Object.keys(TOOL_HANDLERS).join(', ')}`
        );
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
        // Handle known error types
        if (error instanceof McpError) {
          throw error;
        }

        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        const errorName = error instanceof Error ? error.name : 'Error';

        // Log error for debugging (to stderr)
        console.error(`[${name}] ${errorName}: ${errorMessage}`);

        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${errorMessage}`
        );
      }
    });
  }

  /**
   * Set up error handling
   */
  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };

    // Handle process signals
    process.on('SIGINT', () => this.handleShutdown('SIGINT'));
    process.on('SIGTERM', () => this.handleShutdown('SIGTERM'));
  }

  /**
   * Handle graceful shutdown
   */
  private async handleShutdown(signal: string): Promise<void> {
    console.error(`\n[${signal}] Shutting down gracefully...`);
    await this.stop();
    process.exit(0);
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.error('Server is already running');
      return;
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.isRunning = true;

    console.error('🚀 boosty MCP Prices Server started');
    console.error(`📊 Available tools: ${TOOL_DEFINITIONS.map((t) => t.name).join(', ')}`);
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    await this.server.close();
    this.isRunning = false;
    console.error('Server stopped');
  }

  /**
   * Get the underlying MCP server instance
   */
  getServer(): Server {
    return this.server;
  }

  /**
   * Check if server is running
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }
}

// ============================================================================
// Default Instance
// ============================================================================

/**
 * Create and export a default server instance
 */
export function createPricesServer(options?: PricesServerOptions): PricesServer {
  return new PricesServer(options);
}
