/**
 * Tools Data - Sample MCP tools data for the playground
 * @module lib/playground/tools-data
 */

import { McpTool, ToolCategoryId, ToolComplexity } from './types';

// Helper to generate tool IDs
const toolId = (category: string, name: string) => `${category}_${name}`.toLowerCase().replace(/\s+/g, '_');

/**
 * Sample tools representing the 380+ tools available
 * In production, these would be loaded from the MCP server or API
 */
export const SAMPLE_TOOLS: McpTool[] = [
  // ============================================================================
  // Blockchain (EVM) Tools
  // ============================================================================
  {
    id: 'evm_get_balance',
    name: 'Get Balance',
    description: 'Get the native token balance for an address on any EVM chain',
    longDescription: 'Retrieves the native token balance (ETH, MATIC, BNB, etc.) for a specified address. Supports all major EVM-compatible chains including Ethereum, Base, Arbitrum, Polygon, Optimism, and more.',
    category: 'blockchain-evm',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'The wallet address to check (0x...)',
          pattern: '^0x[a-fA-F0-9]{40}$',
        },
        chain: {
          type: 'string',
          description: 'The blockchain to query',
          enum: ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism', 'bsc', 'avalanche'],
          default: 'ethereum',
        },
        blockTag: {
          type: 'string',
          description: 'Block number or tag',
          enum: ['latest', 'pending', 'earliest'],
          default: 'latest',
        },
      },
      required: ['address'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        balance: { type: 'string', description: 'Balance in wei' },
        formatted: { type: 'string', description: 'Balance formatted with decimals' },
        symbol: { type: 'string', description: 'Native token symbol' },
      },
    },
    permissions: [{ type: 'read', description: 'Read blockchain state', required: true }],
    examples: [
      {
        name: 'Check Vitalik\'s balance',
        description: 'Get ETH balance for a known address',
        parameters: { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', chain: 'ethereum' },
      },
    ],
    tags: ['balance', 'wallet', 'evm', 'ethereum'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism', 'bsc', 'avalanche'],
    relatedTools: ['evm_get_token_balance', 'evm_get_transaction_count'],
    pricing: { type: 'free' },
  },
  {
    id: 'evm_get_token_balance',
    name: 'Get Token Balance',
    description: 'Get ERC20 token balance for an address',
    category: 'blockchain-evm',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Wallet address',
          pattern: '^0x[a-fA-F0-9]{40}$',
        },
        token: {
          type: 'string',
          description: 'Token contract address',
          pattern: '^0x[a-fA-F0-9]{40}$',
        },
        chain: {
          type: 'string',
          enum: ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism'],
          default: 'ethereum',
        },
      },
      required: ['address', 'token'],
    },
    permissions: [{ type: 'read', description: 'Read token balance', required: true }],
    examples: [
      {
        name: 'Check USDC balance',
        description: 'Get USDC balance on Ethereum',
        parameters: {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          chain: 'ethereum',
        },
      },
    ],
    tags: ['balance', 'erc20', 'token'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism'],
    pricing: { type: 'free' },
  },
  {
    id: 'evm_send_transaction',
    name: 'Send Transaction',
    description: 'Send a transaction on an EVM chain',
    category: 'blockchain-evm',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient address' },
        value: { type: 'string', description: 'Amount in wei' },
        data: { type: 'string', description: 'Transaction data (hex)' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
        gasLimit: { type: 'string', description: 'Gas limit' },
        maxFeePerGas: { type: 'string', description: 'Max fee per gas (wei)' },
        maxPriorityFeePerGas: { type: 'string', description: 'Max priority fee (wei)' },
      },
      required: ['to', 'chain'],
    },
    permissions: [
      { type: 'write', description: 'Submit transactions', required: true },
      { type: 'sign', description: 'Sign with connected wallet', required: true },
    ],
    examples: [],
    tags: ['transaction', 'send', 'evm'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'free' },
  },
  {
    id: 'evm_call_contract',
    name: 'Call Contract',
    description: 'Call a smart contract function (read-only)',
    category: 'blockchain-evm',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Contract address' },
        abi: { type: 'array', description: 'Contract ABI (or single function ABI)' },
        functionName: { type: 'string', description: 'Function to call' },
        args: { type: 'array', description: 'Function arguments' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
      },
      required: ['address', 'abi', 'functionName', 'chain'],
    },
    permissions: [{ type: 'read', description: 'Read contract state', required: true }],
    examples: [],
    tags: ['contract', 'call', 'abi'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // DeFi DEX Tools
  // ============================================================================
  {
    id: 'defi_get_swap_quote',
    name: 'Get Swap Quote',
    description: 'Get a quote for swapping tokens using the best available DEX',
    longDescription: 'Aggregates quotes from multiple DEXes (Uniswap, Curve, 1inch, etc.) to find the best rate for your swap. Includes gas estimation and price impact analysis.',
    category: 'defi-dex',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        tokenIn: { type: 'string', description: 'Input token address' },
        tokenOut: { type: 'string', description: 'Output token address' },
        amountIn: { type: 'string', description: 'Amount to swap (in wei)' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
        slippage: { type: 'number', description: 'Max slippage (%)', default: 0.5 },
      },
      required: ['tokenIn', 'tokenOut', 'amountIn', 'chain'],
    },
    permissions: [{ type: 'read', description: 'Read DEX prices', required: true }],
    examples: [
      {
        name: 'ETH to USDC swap quote',
        description: 'Get quote for swapping 1 ETH to USDC',
        parameters: {
          tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          amountIn: '1000000000000000000',
          chain: 'ethereum',
        },
      },
    ],
    tags: ['swap', 'dex', 'quote', 'trading'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'free' },
  },
  {
    id: 'defi_execute_swap',
    name: 'Execute Swap',
    description: 'Execute a token swap on a DEX',
    category: 'defi-dex',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        tokenIn: { type: 'string', description: 'Input token address' },
        tokenOut: { type: 'string', description: 'Output token address' },
        amountIn: { type: 'string', description: 'Amount to swap' },
        minAmountOut: { type: 'string', description: 'Minimum output amount' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
        recipient: { type: 'string', description: 'Recipient address (optional)' },
        deadline: { type: 'number', description: 'Transaction deadline (unix timestamp)' },
      },
      required: ['tokenIn', 'tokenOut', 'amountIn', 'minAmountOut', 'chain'],
    },
    permissions: [
      { type: 'write', description: 'Execute swap transaction', required: true },
      { type: 'sign', description: 'Sign transaction', required: true },
    ],
    examples: [],
    tags: ['swap', 'dex', 'execute', 'trading'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'free' },
  },
  {
    id: 'defi_get_liquidity_pools',
    name: 'Get Liquidity Pools',
    description: 'Get information about liquidity pools for a token pair',
    category: 'defi-dex',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        token0: { type: 'string', description: 'First token address' },
        token1: { type: 'string', description: 'Second token address' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
        protocol: { type: 'string', enum: ['uniswap-v2', 'uniswap-v3', 'curve', 'balancer'] },
      },
      required: ['token0', 'token1', 'chain'],
    },
    permissions: [{ type: 'read', description: 'Read pool data', required: true }],
    examples: [],
    tags: ['liquidity', 'pools', 'dex', 'amm'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // DeFi Lending Tools
  // ============================================================================
  {
    id: 'defi_get_lending_rates',
    name: 'Get Lending Rates',
    description: 'Get current lending and borrowing rates across protocols',
    category: 'defi-lending',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        asset: { type: 'string', description: 'Asset address or symbol' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
        protocols: { type: 'array', items: { type: 'string' }, description: 'Filter by protocols' },
      },
      required: ['asset', 'chain'],
    },
    permissions: [{ type: 'read', description: 'Read lending data', required: true }],
    examples: [
      {
        name: 'USDC lending rates',
        description: 'Get USDC lending rates on Ethereum',
        parameters: { asset: 'USDC', chain: 'ethereum' },
      },
    ],
    tags: ['lending', 'rates', 'apy', 'borrow'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'free' },
  },
  {
    id: 'defi_supply_asset',
    name: 'Supply Asset',
    description: 'Supply an asset to a lending protocol',
    category: 'defi-lending',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        protocol: { type: 'string', enum: ['aave-v3', 'compound-v3', 'morpho'] },
        asset: { type: 'string', description: 'Asset to supply' },
        amount: { type: 'string', description: 'Amount to supply' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
      },
      required: ['protocol', 'asset', 'amount', 'chain'],
    },
    permissions: [
      { type: 'write', description: 'Supply transaction', required: true },
      { type: 'sign', description: 'Sign transaction', required: true },
    ],
    examples: [],
    tags: ['lending', 'supply', 'deposit'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // Market Data Tools
  // ============================================================================
  {
    id: 'market_get_price',
    name: 'Get Token Price',
    description: 'Get the current price of a token in any currency',
    category: 'market-data-prices',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token symbol or address' },
        currency: { type: 'string', description: 'Quote currency', default: 'USD' },
        chain: { type: 'string', description: 'Chain for address lookup' },
      },
      required: ['token'],
    },
    permissions: [{ type: 'read', description: 'Read price data', required: true }],
    examples: [
      { name: 'ETH Price', description: 'Get ETH/USD price', parameters: { token: 'ETH', currency: 'USD' } },
      { name: 'BTC Price', description: 'Get BTC/USD price', parameters: { token: 'BTC', currency: 'USD' } },
    ],
    tags: ['price', 'market', 'token'],
    pricing: { type: 'free' },
  },
  {
    id: 'market_get_ohlcv',
    name: 'Get OHLCV Data',
    description: 'Get historical OHLCV (candlestick) data for a token',
    category: 'market-data-prices',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token symbol' },
        interval: { type: 'string', enum: ['1m', '5m', '15m', '1h', '4h', '1d', '1w'] },
        limit: { type: 'integer', description: 'Number of candles', default: 100 },
        startTime: { type: 'integer', description: 'Start timestamp (ms)' },
        endTime: { type: 'integer', description: 'End timestamp (ms)' },
      },
      required: ['token', 'interval'],
    },
    permissions: [{ type: 'read', description: 'Read market data', required: true }],
    examples: [],
    tags: ['ohlcv', 'candles', 'historical', 'chart'],
    pricing: { type: 'free' },
  },
  {
    id: 'market_get_gas_price',
    name: 'Get Gas Price',
    description: 'Get current gas prices for an EVM chain',
    category: 'market-data-prices',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism'] },
      },
      required: ['chain'],
    },
    permissions: [{ type: 'read', description: 'Read gas data', required: true }],
    examples: [
      { name: 'Ethereum gas', description: 'Get Ethereum gas prices', parameters: { chain: 'ethereum' } },
    ],
    tags: ['gas', 'fees', 'network'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon', 'optimism'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // Wallet Tools
  // ============================================================================
  {
    id: 'wallet_create',
    name: 'Create Wallet',
    description: 'Create a new wallet with a random seed phrase',
    category: 'wallets-management',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['evm', 'solana', 'multisig'] },
        entropy: { type: 'integer', enum: [128, 256], default: 256 },
      },
      required: ['type'],
    },
    permissions: [{ type: 'admin', description: 'Wallet creation', required: true }],
    examples: [],
    tags: ['wallet', 'create', 'seed'],
    pricing: { type: 'free' },
  },
  {
    id: 'wallet_sign_message',
    name: 'Sign Message',
    description: 'Sign a message with a wallet private key',
    category: 'wallets-signing',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message to sign' },
        type: { type: 'string', enum: ['personal', 'typed', 'raw'], default: 'personal' },
      },
      required: ['message'],
    },
    permissions: [{ type: 'sign', description: 'Sign messages', required: true }],
    examples: [],
    tags: ['sign', 'message', 'wallet'],
    pricing: { type: 'free' },
  },
  {
    id: 'wallet_resolve_ens',
    name: 'Resolve ENS',
    description: 'Resolve an ENS name to an address (or reverse)',
    category: 'wallets-ens',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'ENS name (e.g., vitalik.eth)' },
        address: { type: 'string', description: 'Address for reverse lookup' },
      },
    },
    permissions: [{ type: 'read', description: 'Read ENS data', required: true }],
    examples: [
      { name: 'Resolve vitalik.eth', description: 'Get address for vitalik.eth', parameters: { name: 'vitalik.eth' } },
    ],
    tags: ['ens', 'domain', 'resolve'],
    chains: ['ethereum'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // NFT Tools
  // ============================================================================
  {
    id: 'nft_get_owned',
    name: 'Get Owned NFTs',
    description: 'Get all NFTs owned by an address',
    category: 'nft-analytics',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'polygon', 'arbitrum'] },
        collection: { type: 'string', description: 'Filter by collection address' },
        limit: { type: 'integer', default: 100 },
      },
      required: ['address', 'chain'],
    },
    permissions: [{ type: 'read', description: 'Read NFT data', required: true }],
    examples: [],
    tags: ['nft', 'owned', 'collection'],
    chains: ['ethereum', 'base', 'polygon', 'arbitrum'],
    pricing: { type: 'free' },
  },
  {
    id: 'nft_get_collection_stats',
    name: 'Get Collection Stats',
    description: 'Get statistics for an NFT collection',
    category: 'nft-analytics',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        collection: { type: 'string', description: 'Collection address or slug' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'polygon'] },
      },
      required: ['collection', 'chain'],
    },
    permissions: [{ type: 'read', description: 'Read collection data', required: true }],
    examples: [],
    tags: ['nft', 'collection', 'stats', 'floor'],
    chains: ['ethereum', 'base', 'polygon'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // Security Tools
  // ============================================================================
  {
    id: 'security_scan_contract',
    name: 'Scan Contract',
    description: 'Scan a smart contract for security vulnerabilities',
    category: 'security-audit',
    version: '1.0.0',
    complexity: 'advanced',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Contract address' },
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
        depth: { type: 'string', enum: ['quick', 'standard', 'deep'], default: 'standard' },
      },
      required: ['address', 'chain'],
    },
    permissions: [{ type: 'read', description: 'Read contract code', required: true }],
    examples: [],
    tags: ['security', 'audit', 'scan', 'vulnerability'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'credits', cost: 10, unit: 'scan' },
  },
  {
    id: 'security_check_address',
    name: 'Check Address Risk',
    description: 'Check if an address is associated with known risks',
    category: 'security-monitoring',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Address to check' },
        chain: { type: 'string', description: 'Chain context' },
      },
      required: ['address'],
    },
    permissions: [{ type: 'read', description: 'Read security data', required: true }],
    examples: [],
    tags: ['security', 'risk', 'sanctions', 'scam'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // AI Agent Tools
  // ============================================================================
  {
    id: 'agent_create_task',
    name: 'Create Agent Task',
    description: 'Create an automated task for an AI agent',
    category: 'ai-agents-orchestration',
    version: '1.0.0',
    complexity: 'advanced',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Task name' },
        description: { type: 'string', description: 'Task description' },
        tools: { type: 'array', items: { type: 'string' }, description: 'Tools to use' },
        schedule: { type: 'string', description: 'Cron schedule (optional)' },
        trigger: { type: 'object', description: 'Event trigger (optional)' },
      },
      required: ['name', 'description', 'tools'],
    },
    permissions: [
      { type: 'admin', description: 'Create automated tasks', required: true },
    ],
    examples: [],
    tags: ['agent', 'automation', 'task', 'ai'],
    pricing: { type: 'credits', cost: 1, unit: 'task' },
  },

  // ============================================================================
  // Trading Tools
  // ============================================================================
  {
    id: 'trading_get_order_book',
    name: 'Get Order Book',
    description: 'Get the current order book for a trading pair',
    category: 'trading-cex',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        exchange: { type: 'string', enum: ['binance', 'coinbase', 'kraken'] },
        symbol: { type: 'string', description: 'Trading pair (e.g., BTC/USDT)' },
        depth: { type: 'integer', description: 'Order book depth', default: 20 },
      },
      required: ['exchange', 'symbol'],
    },
    permissions: [{ type: 'read', description: 'Read order book', required: true }],
    examples: [],
    tags: ['trading', 'orderbook', 'cex'],
    pricing: { type: 'free' },
  },
  {
    id: 'trading_place_order',
    name: 'Place Order',
    description: 'Place a trading order on a CEX',
    category: 'trading-cex',
    version: '1.0.0',
    complexity: 'advanced',
    inputSchema: {
      type: 'object',
      properties: {
        exchange: { type: 'string', enum: ['binance', 'coinbase', 'kraken'] },
        symbol: { type: 'string', description: 'Trading pair' },
        side: { type: 'string', enum: ['buy', 'sell'] },
        type: { type: 'string', enum: ['market', 'limit', 'stop'] },
        amount: { type: 'string', description: 'Order amount' },
        price: { type: 'string', description: 'Limit price (for limit orders)' },
      },
      required: ['exchange', 'symbol', 'side', 'type', 'amount'],
    },
    permissions: [
      { type: 'write', description: 'Place orders', required: true },
      { type: 'sign', description: 'API authentication', required: true },
    ],
    examples: [],
    tags: ['trading', 'order', 'cex'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // Infrastructure Tools
  // ============================================================================
  {
    id: 'infra_get_block',
    name: 'Get Block',
    description: 'Get block information by number or hash',
    category: 'infrastructure',
    version: '1.0.0',
    complexity: 'beginner',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string', enum: ['ethereum', 'base', 'arbitrum', 'polygon'] },
        blockNumber: { type: 'integer', description: 'Block number' },
        blockHash: { type: 'string', description: 'Block hash' },
        includeTransactions: { type: 'boolean', default: false },
      },
      required: ['chain'],
    },
    permissions: [{ type: 'read', description: 'Read block data', required: true }],
    examples: [],
    tags: ['block', 'chain', 'infrastructure'],
    chains: ['ethereum', 'base', 'arbitrum', 'polygon'],
    pricing: { type: 'free' },
  },

  // ============================================================================
  // Payments Tools
  // ============================================================================
  {
    id: 'payments_create_invoice',
    name: 'Create Payment Invoice',
    description: 'Create a crypto payment invoice with x402 protocol',
    category: 'payments',
    version: '1.0.0',
    complexity: 'intermediate',
    inputSchema: {
      type: 'object',
      properties: {
        amount: { type: 'string', description: 'Amount in token units' },
        token: { type: 'string', description: 'Payment token' },
        chain: { type: 'string', enum: ['base', 'ethereum', 'polygon'] },
        description: { type: 'string', description: 'Payment description' },
        expiresIn: { type: 'integer', description: 'Expiry time in seconds', default: 3600 },
      },
      required: ['amount', 'token', 'chain'],
    },
    permissions: [{ type: 'write', description: 'Create invoices', required: true }],
    examples: [],
    tags: ['payments', 'invoice', 'x402'],
    chains: ['base', 'ethereum', 'polygon'],
    pricing: { type: 'free' },
  },
];

/**
 * Get all tools grouped by category
 */
export function getToolsByCategory(): Record<string, McpTool[]> {
  return SAMPLE_TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, McpTool[]>);
}

/**
 * Get tools by complexity level
 */
export function getToolsByComplexity(complexity: ToolComplexity): McpTool[] {
  return SAMPLE_TOOLS.filter(tool => tool.complexity === complexity);
}

/**
 * Get tools that support a specific chain
 */
export function getToolsByChain(chain: string): McpTool[] {
  return SAMPLE_TOOLS.filter(tool => tool.chains?.includes(chain));
}

/**
 * Get a tool by ID
 */
export function getToolById(id: string): McpTool | undefined {
  return SAMPLE_TOOLS.find(tool => tool.id === id);
}

/**
 * Get related tools for a given tool
 */
export function getRelatedTools(toolId: string): McpTool[] {
  const tool = getToolById(toolId);
  if (!tool?.relatedTools) return [];
  return tool.relatedTools
    .map(id => getToolById(id))
    .filter((t): t is McpTool => t !== undefined);
}
