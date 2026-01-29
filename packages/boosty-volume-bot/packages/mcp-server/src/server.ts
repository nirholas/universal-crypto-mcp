/**
 * DeFi MCP Server
 * Main server implementation with full MCP protocol compliance
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { allToolDefinitions, toolHandlers } from './tools/index.js';
import { allResourceTemplates } from './resources/index.js';
import * as resourceHandlers from './resources/index.js';
import { promptDefinitions, getPromptMessages } from './prompts/index.js';
import { ApiKeyAuth, RateLimiter, AuditLogger, getToolCategory } from './auth/index.js';
import { loadConfig, type ValidatedServerConfig } from './config/index.js';
import { createChildLogger } from './utils/logger.js';
import { X402PaymentMiddleware, createX402MiddlewareFromEnv } from './payments/index.js';

const serverLogger = createChildLogger('server');

export interface DeFiMCPServerOptions {
  config?: ValidatedServerConfig;
  configPath?: string;
  enablePayments?: boolean;
}

export class DeFiMCPServer {
  private server: Server;
  private config: ValidatedServerConfig;
  private auth: ApiKeyAuth;
  private rateLimiter: RateLimiter;
  private auditLogger: AuditLogger;
  private paymentMiddleware: X402PaymentMiddleware | null = null;
  private isRunning: boolean = false;

  constructor(options: DeFiMCPServerOptions = {}) {
    // Load configuration
    this.config = options.config || loadConfig({ configPath: options.configPath });
    
    // Initialize auth components
    this.auth = new ApiKeyAuth({
      requireAuth: this.config.auth.requireAuth,
      apiKeyHeader: this.config.auth.apiKeyHeader,
    });
    
    this.rateLimiter = new RateLimiter(this.config.auth.rateLimits);
    this.auditLogger = new AuditLogger();

    // Initialize x402 payment middleware if enabled
    if (options.enablePayments !== false) {
      this.paymentMiddleware = createX402MiddlewareFromEnv();
      if (this.paymentMiddleware) {
        serverLogger.info('x402 payment middleware enabled');
      }
    }


    // Create MCP server
    this.server = new Server(
      {
        name: 'defi-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
    
    serverLogger.info({ network: this.config.solana.network }, 'DeFi MCP Server initialized');
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: allToolDefinitions,
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const startTime = Date.now();

      // Check rate limit
      const category = getToolCategory(name);
      if (!this.rateLimiter.check(category)) {
        const resetTime = this.rateLimiter.getResetTime(category);
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds.`
        );
      }

      // Check x402 payment if middleware is enabled
      // Note: In MCP, payment headers would come from the client metadata
      const paymentHeader = (request as any).meta?.headers?.['x-payment'];
      
      if (this.paymentMiddleware) {
        const paymentResult = await this.paymentMiddleware.checkToolCall({
          toolName: name,
          arguments: args as Record<string, unknown>,
          headers: { 'x-payment': paymentHeader },
        });

        if (!paymentResult.allowed) {
          // Return 402 Payment Required response
          if (paymentResult.paymentRequired) {
            const paymentResponse = {
              ...paymentResult.paymentRequired,
              code: 402,
              message: 'Payment Required',
            };
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(paymentResponse, null, 2),
                },
              ],
              isError: true,
            };
          }
          throw new McpError(ErrorCode.InvalidRequest, paymentResult.error || 'Payment required');
        }
      }

      // Find and execute handler
      const handler = toolHandlers[name];
      if (!handler) {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }

      let success = false;
      try {
        const result = await handler(args);
        success = true;
        const duration = Date.now() - startTime;

        // Audit log
        this.auditLogger.log({
          tool: name,
          params: args as Record<string, unknown>,
          result: 'success',
          duration,
        });

        // Settle payment after successful execution
        if (this.paymentMiddleware && paymentHeader) {
          await this.paymentMiddleware.settleAfterExecution(
            { toolName: name, arguments: args as Record<string, unknown>, headers: { 'x-payment': paymentHeader } },
            success
          );
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
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Audit log error
        this.auditLogger.log({
          tool: name,
          params: args as Record<string, unknown>,
          result: 'error',
          duration,
          error: errorMessage,
        });

        throw new McpError(ErrorCode.InternalError, errorMessage);
      }
    });

    // List resources handler
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: allResourceTemplates.map(t => ({
          uri: t.uriTemplate,
          name: t.name,
          description: t.description,
          mimeType: t.mimeType,
        })),
      };
    });

    // Read resource handler
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      try {
        const resource = await this.resolveResource(uri);
        return {
          contents: [resource],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Resource not found: ${uri}`
        );
      }
    });

    // List prompts handler
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: promptDefinitions,
      };
    });

    // Get prompt handler
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      const prompt = promptDefinitions.find(p => p.name === name);
      if (!prompt) {
        throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
      }

      const messages = getPromptMessages(name, args || {});
      return { messages };
    });
  }

  private async resolveResource(uri: string): Promise<{ uri: string; mimeType: string; text: string }> {
    // Parse URI
    if (uri === 'wallets://list') {
      const resource = await resourceHandlers.getWalletListResource();
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }
    
    if (uri === 'campaigns://list') {
      const resource = await resourceHandlers.getCampaignListResource();
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }
    
    if (uri === 'bots://list') {
      const resource = await resourceHandlers.getBotListResource();
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }

    // Parse parameterized URIs
    const walletMatch = uri.match(/^wallets:\/\/([^/]+)$/);
    if (walletMatch?.[1]) {
      const resource = await resourceHandlers.getWalletResource(walletMatch[1]);
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }

    const walletTxMatch = uri.match(/^wallets:\/\/([^/]+)\/transactions$/);
    if (walletTxMatch?.[1]) {
      const resource = await resourceHandlers.getWalletTransactionsResource(walletTxMatch[1]);
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }

    const campaignMatch = uri.match(/^campaigns:\/\/([^/]+)$/);
    if (campaignMatch?.[1]) {
      const resource = await resourceHandlers.getCampaignResource(campaignMatch[1]);
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }

    const campaignMetricsMatch = uri.match(/^campaigns:\/\/([^/]+)\/metrics$/);
    if (campaignMetricsMatch?.[1]) {
      const resource = await resourceHandlers.getCampaignMetricsResource(campaignMetricsMatch[1]);
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }

    const botStatusMatch = uri.match(/^bots:\/\/([^/]+)\/status$/);
    if (botStatusMatch?.[1]) {
      const resource = await resourceHandlers.getBotStatusResource(botStatusMatch[1]);
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }

    const tokenInfoMatch = uri.match(/^tokens:\/\/([^/]+)\/info$/);
    if (tokenInfoMatch?.[1]) {
      const resource = await resourceHandlers.getTokenInfoResource(tokenInfoMatch[1]);
      return { uri: resource.uri, mimeType: resource.mimeType, text: resource.content };
    }

    throw new Error(`Unknown resource: ${uri}`);
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      serverLogger.error({ error }, 'MCP Server error');
    };

    process.on('SIGINT', async () => {
      serverLogger.info('Received SIGINT, shutting down...');
      await this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      serverLogger.info('Received SIGTERM, shutting down...');
      await this.stop();
      process.exit(0);
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      serverLogger.warn('Server is already running');
      return;
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.isRunning = true;
    
    serverLogger.info('DeFi MCP Server started on stdio');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    await this.server.close();
    this.isRunning = false;
    serverLogger.info('DeFi MCP Server stopped');
  }

  getConfig(): ValidatedServerConfig {
    return this.config;
  }

  getAuditLog(limit?: number) {
    return this.auditLogger.getEntries(limit);
  }

  /**
   * Check if x402 payments are enabled
   */
  isPaymentsEnabled(): boolean {
    return this.paymentMiddleware !== null;
  }

  /**
   * Get the API key authentication instance
   */
  getAuth(): ApiKeyAuth {
    return this.auth;
  }

  /**
   * Get payment info for a specific tool
   */
  getToolPaymentInfo(toolName: string): { requiresPayment: boolean; price?: string; currency?: string } | null {
    if (!this.paymentMiddleware) {
      return { requiresPayment: false };
    }
    
    const service = (this.paymentMiddleware as any).service;
    if (!service) {
      return { requiresPayment: false };
    }

    const requiresPayment = service.requiresPayment(toolName);
    if (!requiresPayment) {
      return { requiresPayment: false };
    }

    const requirements = service.getPaymentRequirements(toolName);
    return {
      requiresPayment: true,
      price: requirements?.price || undefined,
      currency: 'USDC',
    };
  }

  /**
   * Get pricing info for all tools
   */
  getAllToolPricing(): Record<string, { price: string; currency: string } | 'free'> {
    if (!this.paymentMiddleware) {
      return {};
    }

    const pricing: Record<string, { price: string; currency: string } | 'free'> = {};
    
    for (const tool of allToolDefinitions) {
      const info = this.getToolPaymentInfo(tool.name);
      if (info?.requiresPayment && info.price) {
        pricing[tool.name] = { price: info.price, currency: info.currency || 'USDC' };
      } else {
        pricing[tool.name] = 'free';
      }
    }

    return pricing;
  }
}

export function createServer(options?: DeFiMCPServerOptions): DeFiMCPServer {
  return new DeFiMCPServer(options);
}
