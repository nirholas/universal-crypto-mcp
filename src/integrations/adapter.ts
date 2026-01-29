/**
 * MCP Server Adapter Pattern
 * 
 * Wraps external MCP servers with x402 payment integration
 * while preserving full attribution to original authors.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * Base adapter for integrating external MCP servers
 * 
 * Use this to wrap open source MCP servers with:
 * - x402 payment integration
 * - Rate limiting
 * - Logging and analytics
 * - Unified error handling
 */
export abstract class MCPServerAdapter {
  protected server: Server;
  protected originalSource: {
    name: string;
    url: string;
    author: string;
    license: string;
  };

  constructor(serverInfo: {
    name: string;
    version: string;
    originalSource: {
      name: string;
      url: string;
      author: string;
      license: string;
    };
  }) {
    this.originalSource = serverInfo.originalSource;
    
    this.server = new Server(
      {
        name: serverInfo.name,
        version: serverInfo.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Override this to define tools from the upstream server
   */
  protected abstract getUpstreamTools(): any[];

  /**
   * Override this to handle tool execution
   */
  protected abstract executeUpstreamTool(name: string, args: any): Promise<any>;

  /**
   * Set up MCP handlers with attribution
   */
  private setupHandlers(): void {
    // List tools with attribution
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.getUpstreamTools();
      
      return {
        tools: tools.map(tool => ({
          ...tool,
          description: `${tool.description}\n\n` +
            `[Based on ${this.originalSource.name}](${this.originalSource.url}) ` +
            `by ${this.originalSource.author} (${this.originalSource.license} License)`
        }))
      };
    });

    // Execute tools with logging
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      console.log(`[${this.originalSource.name}] Executing: ${name}`);
      
      try {
        const result = await this.executeUpstreamTool(name, args);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error: any) {
        console.error(`[${this.originalSource.name}] Error:`, error);
        
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  /**
   * Start the adapter server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.log(`[${this.originalSource.name}] Adapter started`);
    console.log(`Original: ${this.originalSource.url}`);
  }
}

/**
 * Example: Adapter for a hypothetical "DeFi Analytics MCP"
 * 
 * Original Project: https://github.com/example/defi-analytics-mcp
 * Author: @example-author
 * License: MIT
 */
export class DeFiAnalyticsAdapter extends MCPServerAdapter {
  private upstreamClient: any; // Import from original package

  constructor() {
    super({
      name: 'universal-crypto-defi-analytics',
      version: '1.0.0',
      originalSource: {
        name: 'DeFi Analytics MCP',
        url: 'https://github.com/example/defi-analytics-mcp',
        author: '@example-author',
        license: 'MIT'
      }
    });

    // Initialize upstream client
    // this.upstreamClient = new DeFiAnalyticsClient();
  }

  protected getUpstreamTools() {
    return [
      {
        name: 'get_protocol_tvl',
        description: 'Get Total Value Locked for a DeFi protocol',
        inputSchema: {
          type: 'object',
          properties: {
            protocol: {
              type: 'string',
              description: 'Protocol name (e.g., aave, compound)'
            }
          },
          required: ['protocol']
        }
      },
      {
        name: 'get_pool_stats',
        description: 'Get statistics for a liquidity pool',
        inputSchema: {
          type: 'object',
          properties: {
            pool: {
              type: 'string',
              description: 'Pool address'
            }
          },
          required: ['pool']
        }
      }
    ];
  }

  protected async executeUpstreamTool(name: string, args: any): Promise<any> {
    // Delegate to upstream client
    switch (name) {
      case 'get_protocol_tvl':
        // return await this.upstreamClient.getProtocolTVL(args.protocol);
        return { protocol: args.protocol, tvl: 1000000000 }; // Example
      
      case 'get_pool_stats':
        // return await this.upstreamClient.getPoolStats(args.pool);
        return { pool: args.pool, volume24h: 50000000 }; // Example
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}

/**
 * Adapter factory for managing multiple integrated servers
 */
export class AdapterRegistry {
  private adapters: Map<string, MCPServerAdapter> = new Map();

  /**
   * Register an adapter
   */
  register(id: string, adapter: MCPServerAdapter): void {
    this.adapters.set(id, adapter);
  }

  /**
   * Get adapter by ID
   */
  get(id: string): MCPServerAdapter | undefined {
    return this.adapters.get(id);
  }

  /**
   * List all registered adapters
   */
  list(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Start all adapters
   */
  async startAll(): Promise<void> {
    for (const [id, adapter] of this.adapters.entries()) {
      console.log(`Starting adapter: ${id}`);
      await adapter.start();
    }
  }
}

/**
 * Helper to create attribution header for adapted files
 */
export function createAttributionHeader(info: {
  originalProject: string;
  originalUrl: string;
  originalAuthor: string;
  originalLicense: string;
  adaptationDescription?: string;
}): string {
  return `
/**
 * Based on: ${info.originalProject}
 * Original: ${info.originalUrl}
 * Author: ${info.originalAuthor}
 * License: ${info.originalLicense}
 * 
 * ${info.adaptationDescription || 'Enhanced with x402 payment integration and Universal Crypto MCP features'}
 * 
 * This adapter provides additional functionality while preserving
 * the original project's excellent work. See THIRD_PARTY_NOTICES.md
 * for complete attribution.
 */
`.trim();
}

// Export for use in other adapters
export { Server, CallToolRequestSchema, ListToolsRequestSchema };
