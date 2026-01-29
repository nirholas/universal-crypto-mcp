/**
 * Solana MCP Server
 * Model Context Protocol server for Solana DeFi operations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  ConnectionManager,
  createConnectionManager,
  createPythOracle,
  createSwitchboardOracle,
  createJupiterClient,
  createPoolMonitor,
  getTokenAccount,
  getTokenMint,
  getTokenAccountsByOwner,
  getTokenMetadataWithFallback,
  getAllATAs,
  lamportsToSol,
  isValidPublicKey,
  PythOracle,
  SwitchboardOracle,
  JupiterClient,
  PoolMonitor,
  TOKEN_MINTS,
  DEX_PROGRAMS,
} from './index.js';
import { logger } from './utils/logger.js';

// ============================================================================
// Tool Definitions
// ============================================================================

const TOOLS: Tool[] = [
  {
    name: 'getSolanaBalance',
    description: 'Get SOL balance for a Solana wallet address',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Solana wallet address (base58)',
        },
      },
      required: ['address'],
    },
  },
  {
    name: 'getSolanaTokens',
    description: 'Get all token holdings for a Solana wallet including metadata',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Solana wallet address (base58)',
        },
        includeToken2022: {
          type: 'boolean',
          description: 'Include Token-2022 program tokens',
          default: true,
        },
      },
      required: ['address'],
    },
  },
  {
    name: 'getTokenPrice',
    description: 'Get real-time token price from Pyth oracle',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Price pair symbol (e.g., SOL/USD, BTC/USD, ETH/USD)',
        },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'getMultipleTokenPrices',
    description: 'Get prices for multiple tokens at once',
    inputSchema: {
      type: 'object',
      properties: {
        symbols: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of price pair symbols',
        },
      },
      required: ['symbols'],
    },
  },
  {
    name: 'getTokenMetadata',
    description: 'Get metadata for a Solana token (name, symbol, image, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        mint: {
          type: 'string',
          description: 'Token mint address',
        },
      },
      required: ['mint'],
    },
  },
  {
    name: 'getTokenMintInfo',
    description: 'Get token mint information (supply, decimals, authorities)',
    inputSchema: {
      type: 'object',
      properties: {
        mint: {
          type: 'string',
          description: 'Token mint address',
        },
      },
      required: ['mint'],
    },
  },
  {
    name: 'getCurrentSlot',
    description: 'Get the current Solana slot number',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'getTransaction',
    description: 'Get details of a Solana transaction by signature',
    inputSchema: {
      type: 'object',
      properties: {
        signature: {
          type: 'string',
          description: 'Transaction signature',
        },
      },
      required: ['signature'],
    },
  },
  {
    name: 'getRecentTransactions',
    description: 'Get recent transactions for a Solana address',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Solana wallet address',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of transactions to return',
          default: 10,
        },
      },
      required: ['address'],
    },
  },
  {
    name: 'estimatePriorityFee',
    description: 'Estimate priority fee for a transaction involving specific accounts',
    inputSchema: {
      type: 'object',
      properties: {
        accounts: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of account addresses involved in the transaction',
        },
      },
      required: ['accounts'],
    },
  },
  {
    name: 'getRpcHealth',
    description: 'Get health status of all RPC endpoints',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'getAvailablePriceFeeds',
    description: 'Get list of available price feeds from oracles',
    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          enum: ['pyth', 'switchboard', 'all'],
          default: 'all',
        },
      },
    },
  },
  {
    name: 'getSwapQuote',
    description: 'Get a swap quote from Jupiter aggregator for trading tokens',
    inputSchema: {
      type: 'object',
      properties: {
        inputToken: {
          type: 'string',
          description: 'Input token symbol (SOL, USDC, BONK, etc.) or mint address',
        },
        outputToken: {
          type: 'string',
          description: 'Output token symbol (SOL, USDC, BONK, etc.) or mint address',
        },
        amount: {
          type: 'number',
          description: 'Amount of input token to swap (in token units, not raw)',
        },
        slippageBps: {
          type: 'number',
          description: 'Slippage tolerance in basis points (100 = 1%)',
          default: 50,
        },
      },
      required: ['inputToken', 'outputToken', 'amount'],
    },
  },
  {
    name: 'getJupiterPrice',
    description: 'Get token price from Jupiter price API',
    inputSchema: {
      type: 'object',
      properties: {
        tokenMint: {
          type: 'string',
          description: 'Token mint address or symbol (SOL, USDC, etc.)',
        },
        vsToken: {
          type: 'string',
          description: 'Quote token (default: USDC)',
          default: 'USDC',
        },
      },
      required: ['tokenMint'],
    },
  },
  {
    name: 'getSupportedTokens',
    description: 'Get list of well-known token mints supported by the system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'getAccountRent',
    description: 'Calculate rent exemption amount for an account of given size',
    inputSchema: {
      type: 'object',
      properties: {
        dataSize: {
          type: 'number',
          description: 'Size of the account data in bytes',
        },
      },
      required: ['dataSize'],
    },
  },
  {
    name: 'getTokenAccountRent',
    description: 'Get rent exemption amount for a token account',
    inputSchema: {
      type: 'object',
      properties: {
        isToken2022: {
          type: 'boolean',
          description: 'Whether this is a Token-2022 account (larger size)',
          default: false,
        },
      },
    },
  },
  {
    name: 'getPoolState',
    description: 'Get real-time pool state from DEX (Raydium, Orca, or Meteora)',
    inputSchema: {
      type: 'object',
      properties: {
        poolAddress: {
          type: 'string',
          description: 'Pool/AMM address',
        },
        dex: {
          type: 'string',
          enum: ['raydium', 'orca', 'meteora', 'auto'],
          description: 'DEX type (auto will attempt detection)',
          default: 'auto',
        },
      },
      required: ['poolAddress'],
    },
  },
  {
    name: 'getPoolPrice',
    description: 'Calculate token price from pool reserves',
    inputSchema: {
      type: 'object',
      properties: {
        poolAddress: {
          type: 'string',
          description: 'Pool/AMM address',
        },
        decimalsA: {
          type: 'number',
          description: 'Decimals for token A (default: 9)',
          default: 9,
        },
        decimalsB: {
          type: 'number',
          description: 'Decimals for token B (default: 6 for USDC)',
          default: 6,
        },
      },
      required: ['poolAddress'],
    },
  },
  {
    name: 'getSupportedDexes',
    description: 'Get list of supported DEX program IDs',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'searchTokens',
    description: 'Search for tokens by name or symbol on Jupiter',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (token name, symbol, or mint address)',
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'getTokenStats',
    description: 'Get trading statistics for a token (volume, price change, liquidity)',
    inputSchema: {
      type: 'object',
      properties: {
        mint: {
          type: 'string',
          description: 'Token mint address',
        },
      },
      required: ['mint'],
    },
  },
  {
    name: 'getTrendingTokens',
    description: 'Get currently trending tokens by trading volume',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of tokens to return',
          default: 10,
        },
      },
    },
  },
  {
    name: 'getLimitOrders',
    description: 'Get open limit orders for a wallet on Jupiter',
    inputSchema: {
      type: 'object',
      properties: {
        walletAddress: {
          type: 'string',
          description: 'Wallet address to check',
        },
      },
      required: ['walletAddress'],
    },
  },
  {
    name: 'getNetworkStatus',
    description: 'Get Solana network status and health metrics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// ============================================================================
// Server Implementation
// ============================================================================

export class SolanaMCPServer {
  private server: Server;
  private connectionManager: ConnectionManager;
  private pythOracle: PythOracle;
  private switchboardOracle: SwitchboardOracle;
  private jupiterClient: JupiterClient;
  private poolMonitor: PoolMonitor;

  constructor() {
    this.server = new Server(
      {
        name: '@defi-mcp/solana-core',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize connection manager
    this.connectionManager = createConnectionManager();
    
    // Initialize oracles
    const connection = this.connectionManager.getConnection();
    this.pythOracle = createPythOracle(connection);
    this.switchboardOracle = createSwitchboardOracle(connection);
    
    // Initialize Jupiter client
    this.jupiterClient = createJupiterClient();
    
    // Initialize pool monitor
    this.poolMonitor = createPoolMonitor(connection);

    this.setupHandlers();
    this.setupErrorHandling();

    logger.info('Solana MCP Server initialized');
  }

  private setupHandlers(): void {
    // List tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools: TOOLS };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        const result = await this.handleToolCall(name, args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const err = error as Error;
        logger.error('Tool call failed', { name, error: err.message });
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool ${name} failed: ${err.message}`
        );
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      logger.error('MCP Server error', { error: String(error) });
    };

    process.on('SIGINT', async () => {
      await this.close();
      process.exit(0);
    });
  }

  private async handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
    const connection = this.connectionManager.getConnection();

    switch (name) {
      case 'getSolanaBalance': {
        const address = args.address as string;
        if (!isValidPublicKey(address)) {
          throw new Error('Invalid Solana address');
        }
        const pubkey = new PublicKey(address);
        const balance = await connection.getBalance(pubkey);
        return {
          address,
          balanceLamports: balance,
          balanceSol: lamportsToSol(balance),
        };
      }

      case 'getSolanaTokens': {
        const address = args.address as string;
        const includeToken2022 = args.includeToken2022 !== false;
        
        if (!isValidPublicKey(address)) {
          throw new Error('Invalid Solana address');
        }
        
        const pubkey = new PublicKey(address);
        const allATAs = await getAllATAs(connection, pubkey, includeToken2022);
        
        const tokens = await Promise.all(
          allATAs.map(async ({ address: ataAddress, mint, program }) => {
            const account = await getTokenAccount(connection, ataAddress);
            const metadata = await getTokenMetadataWithFallback(connection, mint);
            
            return {
              mint: mint.toBase58(),
              tokenAccount: ataAddress.toBase58(),
              program: program.toBase58(),
              balance: account?.amount.toString() || '0',
              decimals: account?.decimals || 0,
              name: metadata?.name || 'Unknown',
              symbol: metadata?.symbol || 'UNKNOWN',
              image: metadata?.image,
            };
          })
        );

        return {
          address,
          tokenCount: tokens.length,
          tokens: tokens.filter(t => BigInt(t.balance) > 0),
        };
      }

      case 'getTokenPrice': {
        const symbol = (args.symbol as string).toUpperCase();
        
        // Try Pyth first
        let price = await this.pythOracle.getPrice(symbol);
        
        // Fallback to Switchboard
        if (!price) {
          price = await this.switchboardOracle.getPrice(symbol);
        }
        
        if (!price) {
          throw new Error(`Price not found for ${symbol}`);
        }

        return {
          symbol,
          price: price.price,
          confidence: price.confidence,
          source: price.source,
          publishTime: price.publishTime.toISOString(),
          status: price.status,
        };
      }

      case 'getMultipleTokenPrices': {
        const symbols = (args.symbols as string[]).map(s => s.toUpperCase());
        const prices = await this.pythOracle.getPrices(symbols);
        
        const results: Record<string, unknown> = {};
        for (const [symbol, price] of prices) {
          results[symbol] = price ? {
            price: price.price,
            confidence: price.confidence,
            source: price.source,
            status: price.status,
          } : null;
        }

        return { prices: results };
      }

      case 'getTokenMetadata': {
        const mint = args.mint as string;
        if (!isValidPublicKey(mint)) {
          throw new Error('Invalid mint address');
        }
        
        const metadata = await getTokenMetadataWithFallback(connection, new PublicKey(mint));
        
        if (!metadata) {
          throw new Error(`Metadata not found for ${mint}`);
        }

        return {
          mint,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          image: metadata.image,
          description: metadata.description,
        };
      }

      case 'getTokenMintInfo': {
        const mint = args.mint as string;
        if (!isValidPublicKey(mint)) {
          throw new Error('Invalid mint address');
        }
        
        const mintInfo = await getTokenMint(connection, new PublicKey(mint));
        
        if (!mintInfo) {
          throw new Error(`Mint not found: ${mint}`);
        }

        return {
          address: mintInfo.address.toBase58(),
          supply: mintInfo.supply.toString(),
          decimals: mintInfo.decimals,
          mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
          freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
          isInitialized: mintInfo.isInitialized,
        };
      }

      case 'getCurrentSlot': {
        const slot = await this.connectionManager.getSlot();
        return { slot };
      }

      case 'getTransaction': {
        const signature = args.signature as string;
        const tx = await connection.getTransaction(signature, {
          maxSupportedTransactionVersion: 0,
        });
        
        if (!tx) {
          throw new Error(`Transaction not found: ${signature}`);
        }

        return {
          signature,
          slot: tx.slot,
          blockTime: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : null,
          fee: tx.meta?.fee,
          status: tx.meta?.err ? 'failed' : 'success',
          error: tx.meta?.err ? JSON.stringify(tx.meta.err) : null,
          computeUnitsConsumed: tx.meta?.computeUnitsConsumed,
        };
      }

      case 'getRecentTransactions': {
        const address = args.address as string;
        const limit = Math.min((args.limit as number) || 10, 100);
        
        if (!isValidPublicKey(address)) {
          throw new Error('Invalid address');
        }

        const signatures = await connection.getSignaturesForAddress(
          new PublicKey(address),
          { limit }
        );

        return {
          address,
          count: signatures.length,
          transactions: signatures.map(sig => ({
            signature: sig.signature,
            slot: sig.slot,
            blockTime: sig.blockTime ? new Date(sig.blockTime * 1000).toISOString() : null,
            status: sig.err ? 'failed' : 'success',
            memo: sig.memo,
          })),
        };
      }

      case 'estimatePriorityFee': {
        const accounts = (args.accounts as string[]).map(a => new PublicKey(a));
        const fee = await this.connectionManager.estimatePriorityFee(accounts);
        
        return {
          estimatedPriorityFee: fee,
          unit: 'microLamports per compute unit',
          accounts: accounts.map(a => a.toBase58()),
        };
      }

      case 'getRpcHealth': {
        const health = await this.connectionManager.getAllEndpointHealth();
        const stats = this.connectionManager.getStats();
        
        return {
          endpoints: health.map(h => ({
            endpoint: h.endpoint,
            healthy: h.healthy,
            latencyMs: h.latencyMs,
            currentSlot: h.currentSlot,
            errors: h.errors,
            lastChecked: h.lastChecked.toISOString(),
          })),
          poolStats: stats.pool,
          activeSubscriptions: stats.subscriptions,
        };
      }

      case 'getAvailablePriceFeeds': {
        const source = (args.source as string) || 'all';
        const feeds: Array<{ symbol: string; source: string; address: string }> = [];
        
        if (source === 'all' || source === 'pyth') {
          const pythFeeds = await this.pythOracle.getAvailableFeeds();
          for (const feed of pythFeeds) {
            feeds.push({
              symbol: feed.symbol,
              source: 'pyth',
              address: feed.feedAddress.toBase58(),
            });
          }
        }
        
        if (source === 'all' || source === 'switchboard') {
          const sbFeeds = this.switchboardOracle.getAvailableFeeds();
          for (const feed of sbFeeds) {
            feeds.push({
              symbol: feed.symbol,
              source: 'switchboard',
              address: feed.feedAddress.toBase58(),
            });
          }
        }

        return { feeds };
      }

      case 'getSwapQuote': {
        const inputToken = args.inputToken as string;
        const outputToken = args.outputToken as string;
        const amount = args.amount as number;
        const slippageBps = (args.slippageBps as number) || 50;

        const quote = await this.jupiterClient.getSimpleQuote({
          inputToken,
          outputToken,
          amount,
          slippageBps,
        });

        return {
          inputToken,
          outputToken,
          inputAmount: quote.inputAmount,
          outputAmount: quote.outputAmount,
          priceImpactPct: quote.priceImpactPct,
          route: quote.route,
          minimumReceived: quote.minimumReceived,
          slippageBps,
        };
      }

      case 'getJupiterPrice': {
        const tokenMint = args.tokenMint as string;
        const vsToken = (args.vsToken as string) || 'USDC';
        
        // Resolve symbol to mint if needed
        const resolvedMint = TOKEN_MINTS[tokenMint as keyof typeof TOKEN_MINTS] || tokenMint;
        const resolvedVs = TOKEN_MINTS[vsToken as keyof typeof TOKEN_MINTS] || vsToken;
        
        const price = await this.jupiterClient.getPrice(resolvedMint, resolvedVs);
        
        if (!price) {
          throw new Error(`Price not available for ${tokenMint}`);
        }

        return {
          token: tokenMint,
          mint: resolvedMint,
          vsToken,
          price: price.price,
          confidence: price.confidence,
        };
      }

      case 'getSupportedTokens': {
        return {
          tokens: Object.entries(TOKEN_MINTS).map(([symbol, mint]) => ({
            symbol,
            mint,
          })),
        };
      }

      case 'getAccountRent': {
        const dataSize = args.dataSize as number;
        const connection = this.connectionManager.getConnection();
        const rentExempt = await connection.getMinimumBalanceForRentExemption(dataSize);
        
        return {
          dataSize,
          rentExemptionLamports: rentExempt,
          rentExemptionSol: lamportsToSol(rentExempt),
        };
      }

      case 'getTokenAccountRent': {
        const isToken2022 = args.isToken2022 as boolean;
        const connection = this.connectionManager.getConnection();
        
        // SPL Token account: 165 bytes, Token-2022 base: 165 + extensions
        const accountSize = isToken2022 ? 182 : 165;
        const rentExempt = await connection.getMinimumBalanceForRentExemption(accountSize);
        
        return {
          accountType: isToken2022 ? 'Token-2022' : 'SPL Token',
          accountSize,
          rentExemptionLamports: rentExempt,
          rentExemptionSol: lamportsToSol(rentExempt),
        };
      }

      case 'getPoolState': {
        const poolAddress = args.poolAddress as string;
        const dex = (args.dex as string) || 'auto';
        
        if (!isValidPublicKey(poolAddress)) {
          throw new Error('Invalid pool address');
        }
        
        const pubkey = new PublicKey(poolAddress);
        let pool;
        
        switch (dex) {
          case 'raydium':
            pool = await this.poolMonitor.getRaydiumPool(pubkey);
            break;
          case 'orca':
            pool = await this.poolMonitor.getOrcaWhirlpool(pubkey);
            break;
          case 'meteora':
            pool = await this.poolMonitor.getMeteoraPool(pubkey);
            break;
          default:
            pool = await this.poolMonitor.getPool(pubkey);
        }
        
        if (!pool) {
          throw new Error(`Failed to fetch pool state for ${poolAddress}`);
        }

        return {
          address: pool.address.toBase58(),
          dex: pool.dex,
          tokenMintA: pool.tokenMintA.toBase58(),
          tokenMintB: pool.tokenMintB.toBase58(),
          tokenVaultA: pool.tokenVaultA.toBase58(),
          tokenVaultB: pool.tokenVaultB.toBase58(),
          reserveA: pool.reserveA.toString(),
          reserveB: pool.reserveB.toString(),
          fee: pool.fee,
          lastUpdated: pool.lastUpdated.toISOString(),
        };
      }

      case 'getPoolPrice': {
        const poolAddress = args.poolAddress as string;
        const decimalsA = (args.decimalsA as number) || 9;
        const decimalsB = (args.decimalsB as number) || 6;
        
        if (!isValidPublicKey(poolAddress)) {
          throw new Error('Invalid pool address');
        }
        
        const pubkey = new PublicKey(poolAddress);
        const pool = await this.poolMonitor.getPool(pubkey);
        
        if (!pool) {
          throw new Error(`Failed to fetch pool for ${poolAddress}`);
        }
        
        const price = this.poolMonitor.calculatePrice(pool, decimalsA, decimalsB);
        
        return {
          poolAddress,
          dex: pool.dex,
          tokenMintA: pool.tokenMintA.toBase58(),
          tokenMintB: pool.tokenMintB.toBase58(),
          price,
          priceInverted: price > 0 ? 1 / price : 0,
          reserveA: pool.reserveA.toString(),
          reserveB: pool.reserveB.toString(),
          decimalsA,
          decimalsB,
        };
      }

      case 'getSupportedDexes': {
        return {
          dexes: Object.entries(DEX_PROGRAMS).map(([name, programId]) => ({
            name,
            programId: programId.toBase58(),
          })),
        };
      }

      case 'searchTokens': {
        const query = args.query as string;
        const limit = (args.limit as number) || 10;
        
        const tokens = await this.jupiterClient.searchTokens(query, limit);
        
        return {
          query,
          count: tokens.length,
          tokens: tokens.map(t => ({
            mint: t.address,
            name: t.name,
            symbol: t.symbol,
            decimals: t.decimals,
            logoURI: t.logoURI,
          })),
        };
      }

      case 'getTokenStats': {
        const mint = args.mint as string;
        
        if (!isValidPublicKey(mint)) {
          throw new Error('Invalid mint address');
        }
        
        const stats = await this.jupiterClient.getTokenStats(mint);
        
        if (!stats) {
          throw new Error(`Stats not available for ${mint}`);
        }
        
        return {
          mint,
          volume24h: stats.volume24h,
          priceChange24h: stats.priceChange24h,
          liquidity: stats.liquidity,
        };
      }

      case 'getTrendingTokens': {
        const limit = (args.limit as number) || 10;
        
        const trending = await this.jupiterClient.getTrendingTokens(limit);
        
        return {
          count: trending.length,
          tokens: trending,
        };
      }

      case 'getLimitOrders': {
        const walletAddress = args.walletAddress as string;
        
        if (!isValidPublicKey(walletAddress)) {
          throw new Error('Invalid wallet address');
        }
        
        const orders = await this.jupiterClient.getOpenOrders(walletAddress);
        
        return {
          walletAddress,
          count: orders.length,
          orders: orders.map(o => ({
            publicKey: o.publicKey,
            maker: o.account.maker,
            inputMint: o.account.inputMint,
            outputMint: o.account.outputMint,
            makingAmount: o.account.makingAmount,
            takingAmount: o.account.takingAmount,
            expiredAt: o.account.expiredAt,
          })),
        };
      }

      case 'getNetworkStatus': {
        const connection = this.connectionManager.getConnection();
        
        const [slot, blockHeight, health, epochInfo] = await Promise.all([
          this.connectionManager.getSlot(),
          connection.getBlockHeight(),
          this.connectionManager.getAllEndpointHealth(),
          connection.getEpochInfo(),
        ]);
        
        // Get recent performance samples
        const perfSamples = await connection.getRecentPerformanceSamples(5);
        const avgTps = perfSamples.length > 0 
          ? perfSamples.reduce((sum, s) => sum + s.numTransactions / s.samplePeriodSecs, 0) / perfSamples.length
          : 0;
        
        return {
          slot,
          blockHeight,
          epoch: epochInfo.epoch,
          epochProgress: ((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100).toFixed(2) + '%',
          avgTps: Math.round(avgTps),
          healthyEndpoints: health.filter(h => h.healthy).length,
          totalEndpoints: health.length,
          endpoints: health.map(h => ({
            name: h.endpoint,
            healthy: h.healthy,
            latencyMs: h.latencyMs,
          })),
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Solana MCP Server running on stdio');
  }

  async close(): Promise<void> {
    this.pythOracle.unsubscribeAll();
    this.switchboardOracle.unsubscribeAll();
    await this.poolMonitor.unsubscribeAll();
    await this.connectionManager.close();
    await this.server.close();
    logger.info('Solana MCP Server closed');
  }
}

// CLI entry point
const server = new SolanaMCPServer();
server.run().catch((error) => {
  logger.error('Failed to start server', { error: String(error) });
  process.exit(1);
});
