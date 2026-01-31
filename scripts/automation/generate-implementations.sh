#!/usr/bin/env bash
#
# generate-implementations.sh
# Generates actual implementation files for all major TODO categories
#
# Usage:
#   ./scripts/automation/generate-implementations.sh
#
# Author: nirholas
# Version: 1.0.0

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[GEN]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }

mkdir_safe() { mkdir -p "$(dirname "$1")"; }

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Generate Implementation Files"
echo "═══════════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════════
# 1. Jupiter Trading Integration
# ═══════════════════════════════════════════════════════════════
log "Generating Jupiter trading integration..."

mkdir_safe "$ROOT_DIR/packages/trading/solana/jupiter.ts"
cat > "$ROOT_DIR/packages/trading/solana/jupiter.ts" << 'EOF'
/**
 * @file jupiter.ts
 * @description Jupiter DEX aggregator integration for Solana swaps
 * @author nirholas
 */

import { Connection, PublicKey, VersionedTransaction, Keypair } from '@solana/web3.js';

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  priceImpactPct: number;
  slippageBps: number;
  route: RouteStep[];
  quoteResponse: unknown;
}

export interface RouteStep {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
}

export interface SwapResult {
  signature: string;
  status: 'success' | 'failed' | 'pending';
  inputAmount: string;
  outputAmount: string;
}

/**
 * Get a swap quote from Jupiter
 */
export async function getQuote(args: {
  inputToken: string;
  outputToken: string;
  amount: string;
  slippageBps?: number;
}): Promise<SwapQuote> {
  const inputMint = args.inputToken === 'SOL' ? SOL_MINT : args.inputToken;
  const outputMint = args.outputToken === 'SOL' ? SOL_MINT : args.outputToken;
  const slippageBps = args.slippageBps || 50;

  const url = new URL(`${JUPITER_API}/quote`);
  url.searchParams.set('inputMint', inputMint);
  url.searchParams.set('outputMint', outputMint);
  url.searchParams.set('amount', args.amount);
  url.searchParams.set('slippageBps', slippageBps.toString());

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Jupiter quote failed: ${await response.text()}`);
  }

  const quoteResponse = await response.json() as Record<string, unknown>;

  const routePlan = quoteResponse.routePlan as Array<{ swapInfo: Record<string, string> }> | undefined;
  const route: RouteStep[] = routePlan?.map((step) => ({
    ammKey: step.swapInfo?.ammKey || '',
    label: step.swapInfo?.label || 'Unknown',
    inputMint: step.swapInfo?.inputMint || inputMint,
    outputMint: step.swapInfo?.outputMint || outputMint,
    inAmount: step.swapInfo?.inAmount || '0',
    outAmount: step.swapInfo?.outAmount || '0',
  })) || [];

  return {
    inputMint,
    outputMint,
    inputAmount: args.amount,
    outputAmount: String(quoteResponse.outAmount || '0'),
    priceImpactPct: parseFloat(String(quoteResponse.priceImpactPct || '0')),
    slippageBps,
    route,
    quoteResponse,
  };
}

/**
 * Execute a swap using Jupiter
 */
export async function executeSwap(args: {
  quote: SwapQuote;
  userPublicKey: string;
  privateKey: Uint8Array;
}): Promise<SwapResult> {
  const connection = new Connection(
    process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    'confirmed'
  );

  // Get swap transaction
  const swapResponse = await fetch(`${JUPITER_API}/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: args.quote.quoteResponse,
      userPublicKey: args.userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!swapResponse.ok) {
    throw new Error(`Jupiter swap failed: ${await swapResponse.text()}`);
  }

  const { swapTransaction } = await swapResponse.json() as { swapTransaction: string };

  // Sign and send
  const txBuf = Buffer.from(swapTransaction, 'base64');
  const tx = VersionedTransaction.deserialize(txBuf);
  tx.sign([Keypair.fromSecretKey(args.privateKey)]);

  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
    maxRetries: 3,
  });

  // Confirm
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  const confirmation = await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  });

  return {
    signature,
    status: confirmation.value.err ? 'failed' : 'success',
    inputAmount: args.quote.inputAmount,
    outputAmount: args.quote.outputAmount,
  };
}

export default { getQuote, executeSwap };
EOF
success "Created: packages/trading/solana/jupiter.ts"

# ═══════════════════════════════════════════════════════════════
# 2. Database Schema and Init
# ═══════════════════════════════════════════════════════════════
log "Generating database schema..."

mkdir_safe "$ROOT_DIR/packages/shared/database/schema.ts"
cat > "$ROOT_DIR/packages/shared/database/schema.ts" << 'EOF'
/**
 * @file schema.ts
 * @description Drizzle ORM schema for DeFi operations
 * @author nirholas
 */

import { pgTable, uuid, varchar, decimal, timestamp, jsonb, bigint, boolean, index } from 'drizzle-orm/pg-core';

export const tokenHoldings = pgTable('token_holdings', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: varchar('wallet_address', { length: 66 }).notNull(),
  chain: varchar('chain', { length: 20 }).notNull(),
  tokenAddress: varchar('token_address', { length: 66 }).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 20 }),
  balance: decimal('balance', { precision: 78, scale: 0 }).notNull(),
  balanceUsd: decimal('balance_usd', { precision: 18, scale: 2 }),
  lastUpdated: timestamp('last_updated').defaultNow(),
}, (table) => ({
  walletIdx: index('idx_holdings_wallet').on(table.walletAddress),
  uniqueHolding: index('idx_holdings_unique').on(table.walletAddress, table.chain, table.tokenAddress),
}));

export const sweeps = pgTable('sweeps', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 100 }).notNull(),
  walletAddress: varchar('wallet_address', { length: 66 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  targetToken: varchar('target_token', { length: 66 }),
  targetChain: varchar('target_chain', { length: 20 }),
  txHashes: jsonb('tx_hashes'),
  userOpHashes: jsonb('user_op_hashes'),
  totalValueUsd: decimal('total_value_usd', { precision: 18, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('idx_sweeps_user').on(table.userId),
  statusIdx: index('idx_sweeps_status').on(table.status),
}));

export const apiPayments = pgTable('api_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptId: varchar('receipt_id', { length: 100 }).unique().notNull(),
  payerAddress: varchar('payer_address', { length: 66 }).notNull(),
  amountUsdc: decimal('amount_usdc', { precision: 18, scale: 6 }).notNull(),
  toolName: varchar('tool_name', { length: 100 }),
  status: varchar('status', { length: 20 }).default('completed'),
  txHash: varchar('tx_hash', { length: 66 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  payerIdx: index('idx_payments_payer').on(table.payerAddress),
}));

export const hostedServers = pgTable('hosted_servers', {
  id: uuid('id').primaryKey().defaultRandom(),
  subdomain: varchar('subdomain', { length: 100 }).unique().notNull(),
  ownerAddress: varchar('owner_address', { length: 66 }).notNull(),
  config: jsonb('config').notNull(),
  tier: varchar('tier', { length: 20 }).default('free'),
  callCount: bigint('call_count', { mode: 'number' }).default(0),
  revenueUsdc: decimal('revenue_usdc', { precision: 18, scale: 6 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  lastActive: timestamp('last_active').defaultNow(),
}, (table) => ({
  subdomainIdx: index('idx_hosted_subdomain').on(table.subdomain),
}));

export const dustTokens = pgTable('dust_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: varchar('wallet_address', { length: 66 }).notNull(),
  chain: varchar('chain', { length: 20 }).notNull(),
  tokenAddress: varchar('token_address', { length: 66 }).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 20 }),
  balance: varchar('balance', { length: 78 }).notNull(),
  decimals: bigint('decimals', { mode: 'number' }).default(18),
  valueUsd: decimal('value_usd', { precision: 18, scale: 2 }),
  swept: boolean('swept').default(false),
  sweepId: uuid('sweep_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type TokenHolding = typeof tokenHoldings.$inferSelect;
export type Sweep = typeof sweeps.$inferSelect;
export type ApiPayment = typeof apiPayments.$inferSelect;
export type HostedServer = typeof hostedServers.$inferSelect;
export type DustToken = typeof dustTokens.$inferSelect;
EOF
success "Created: packages/shared/database/schema.ts"

mkdir_safe "$ROOT_DIR/packages/shared/database/index.ts"
cat > "$ROOT_DIR/packages/shared/database/index.ts" << 'EOF'
/**
 * @file index.ts
 * @description Database connection and initialization
 * @author nirholas
 */

import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

export * from './schema';

let db: PostgresJsDatabase<typeof schema> | null = null;
let sql: ReturnType<typeof postgres> | null = null;

export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

/**
 * Initialize database connection
 */
export async function initDatabase(config: DbConfig): Promise<void> {
  const connectionString = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
  
  sql = postgres(connectionString, {
    ssl: config.ssl ? 'require' : false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  db = drizzle(sql, { schema });
  
  console.log('[Database] Connected to PostgreSQL');
}

/**
 * Run migrations
 */
export async function runMigrations(): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  
  console.log('[Database] Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
  console.log('[Database] Migrations complete');
}

/**
 * Get database instance
 */
export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!db) throw new Error('Database not initialized');
  return db;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (sql) {
    await sql.end();
    sql = null;
    db = null;
  }
}

export default { initDatabase, runMigrations, getDb, closeDatabase };
EOF
success "Created: packages/shared/database/index.ts"

# ═══════════════════════════════════════════════════════════════
# 3. Bridge Service - Synapse Implementation
# ═══════════════════════════════════════════════════════════════
log "Generating Synapse bridge implementation..."

# Already exists, but let's ensure the full implementation
if [[ -f "$ROOT_DIR/packages/automation/sweep/src/services/bridge/synapse.ts" ]]; then
  success "Synapse bridge already exists"
else
  mkdir_safe "$ROOT_DIR/packages/automation/sweep/src/services/bridge/synapse.ts"
  cat > "$ROOT_DIR/packages/automation/sweep/src/services/bridge/synapse.ts" << 'EOF'
/**
 * @file synapse.ts
 * @description Synapse Protocol cross-chain bridge integration
 * @author nirholas
 */

import type { SupportedChain } from '../../config/chains';

export interface BridgeQuote {
  provider: string;
  sourceChain: SupportedChain;
  destinationChain: SupportedChain;
  token: string;
  amount: bigint;
  outputAmount: bigint;
  estimatedTime: number;
  fee: bigint;
  feeUSD: number;
  estimatedGas: bigint;
}

export interface BridgeTransaction {
  bridgeId: string;
  to: string;
  data: string;
  value: bigint;
  chainId: number;
}

const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  optimism: 10,
  polygon: 137,
  base: 8453,
  avalanche: 43114,
  bsc: 56,
};

export async function getQuote(
  sourceChain: SupportedChain,
  destChain: SupportedChain,
  token: string,
  amount: bigint,
  userAddress: string
): Promise<BridgeQuote | null> {
  try {
    const url = new URL('https://syn-api-x.herokuapp.com/v1/generate_unsigned_bridge_txn');
    url.searchParams.set('fromChain', String(CHAIN_IDS[sourceChain] || 1));
    url.searchParams.set('toChain', String(CHAIN_IDS[destChain] || 1));
    url.searchParams.set('fromToken', token);
    url.searchParams.set('toToken', token);
    url.searchParams.set('amount', amount.toString());
    url.searchParams.set('fromAddress', userAddress);
    url.searchParams.set('toAddress', userAddress);

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const data = await response.json() as { amountToReceive?: string; estimatedGas?: string };
    if (!data.amountToReceive) return null;

    const outputAmount = BigInt(data.amountToReceive);
    const fee = amount - outputAmount;

    return {
      provider: 'Synapse',
      sourceChain,
      destinationChain: destChain,
      token,
      amount,
      outputAmount,
      estimatedTime: 5,
      fee,
      feeUSD: Number(fee) / 1e18,
      estimatedGas: BigInt(data.estimatedGas || 200000),
    };
  } catch {
    return null;
  }
}

export async function executeBridge(quote: BridgeQuote): Promise<BridgeTransaction> {
  const url = new URL('https://syn-api-x.herokuapp.com/v1/generate_unsigned_bridge_txn');
  url.searchParams.set('fromChain', String(CHAIN_IDS[quote.sourceChain] || 1));
  url.searchParams.set('toChain', String(CHAIN_IDS[quote.destinationChain] || 1));
  url.searchParams.set('fromToken', quote.token);
  url.searchParams.set('toToken', quote.token);
  url.searchParams.set('amount', quote.amount.toString());

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Synapse API error: ${response.status}`);
  }

  const data = await response.json() as { to: string; data: string; value?: string };

  return {
    bridgeId: `synapse-${Date.now()}`,
    to: data.to,
    data: data.data,
    value: BigInt(data.value || 0),
    chainId: CHAIN_IDS[quote.sourceChain] || 1,
  };
}

export function getSupportedTokens(): string[] {
  return [
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0x853d955aCEf822Db058eb8505911ED77F175b99e', // FRAX
  ];
}

export default { getQuote, executeBridge, getSupportedTokens };
EOF
  success "Created: synapse.ts"
fi

# ═══════════════════════════════════════════════════════════════
# 4. Contract Deployment Helpers
# ═══════════════════════════════════════════════════════════════
log "Generating contract deployment helpers..."

mkdir_safe "$ROOT_DIR/scripts/deploy/helpers/deploy-erc20.ts"
cat > "$ROOT_DIR/scripts/deploy/helpers/deploy-erc20.ts" << 'EOF'
/**
 * @file deploy-erc20.ts
 * @description ERC20 token deployment helper using viem
 * @author nirholas
 */

import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits,
  type Address,
  type WalletClient,
  type PublicClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Minimal ERC20 ABI for deployment verification
const ERC20_ABI = [
  { name: 'name', type: 'function', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { name: 'symbol', type: 'function', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { name: 'decimals', type: 'function', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' },
  { name: 'totalSupply', type: 'function', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
] as const;

// OpenZeppelin ERC20 bytecode (compiled)
// This is a placeholder - in production, compile from source
const ERC20_BYTECODE = '0x60806040523480156200001157600080fd5b50' as const;

export interface DeployERC20Params {
  name: string;
  symbol: string;
  decimals?: number;
  initialSupply?: string;
  privateKey: string;
  rpcUrl: string;
  chain: any;
}

export interface DeploymentResult {
  address: Address;
  txHash: string;
  blockNumber: bigint;
}

/**
 * Deploy an ERC20 token
 */
export async function deployERC20(params: DeployERC20Params): Promise<DeploymentResult> {
  const account = privateKeyToAccount(params.privateKey as `0x${string}`);
  
  const publicClient = createPublicClient({
    chain: params.chain,
    transport: http(params.rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: params.chain,
    transport: http(params.rpcUrl),
  });

  const decimals = params.decimals || 18;
  const initialSupply = parseUnits(params.initialSupply || '1000000', decimals);

  // For actual deployment, use forge or hardhat compiled bytecode
  // This is a simplified example
  console.log(`Deploying ${params.name} (${params.symbol}) with ${initialSupply} supply...`);
  
  // In production: use actual bytecode and constructor args
  // const hash = await walletClient.deployContract({ ... });
  
  throw new Error('Use forge or hardhat for actual ERC20 deployment. This helper provides the interface.');
}

/**
 * Verify deployed ERC20 token
 */
export async function verifyERC20(
  address: Address,
  publicClient: PublicClient,
  expectedName: string,
  expectedSymbol: string
): Promise<boolean> {
  try {
    const [name, symbol] = await Promise.all([
      publicClient.readContract({ address, abi: ERC20_ABI, functionName: 'name' }),
      publicClient.readContract({ address, abi: ERC20_ABI, functionName: 'symbol' }),
    ]);

    return name === expectedName && symbol === expectedSymbol;
  } catch {
    return false;
  }
}

export default { deployERC20, verifyERC20 };
EOF
success "Created: scripts/deploy/helpers/deploy-erc20.ts"

# ═══════════════════════════════════════════════════════════════
# 5. Notification Service
# ═══════════════════════════════════════════════════════════════
log "Generating notification service..."

mkdir_safe "$ROOT_DIR/packages/shared/notifications/index.ts"
cat > "$ROOT_DIR/packages/shared/notifications/index.ts" << 'EOF'
/**
 * @file index.ts
 * @description Unified notification service (email, push, webhook)
 * @author nirholas
 */

export interface NotificationPayload {
  type: 'email' | 'push' | 'webhook';
  recipient: string;
  subject?: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Send email notification via SendGrid/Resend
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Notifications] No email API key configured');
    return false;
  }

  try {
    // SendGrid API
    if (process.env.SENDGRID_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.FROM_EMAIL || 'noreply@ucm.cash' },
          subject,
          content: [{ type: 'text/plain', value: body }],
        }),
      });
      return response.ok;
    }

    // Resend API
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'noreply@ucm.cash',
          to,
          subject,
          text: body,
        }),
      });
      return response.ok;
    }

    return false;
  } catch (error) {
    console.error('[Notifications] Email failed:', error);
    return false;
  }
}

/**
 * Send webhook notification
 */
export async function sendWebhook(
  url: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    });
    return response.ok;
  } catch (error) {
    console.error('[Notifications] Webhook failed:', error);
    return false;
  }
}

/**
 * Send push notification via web-push
 */
export async function sendPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  message: string
): Promise<boolean> {
  try {
    // Requires web-push package
    const webpush = await import('web-push');
    
    const vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY || '',
      privateKey: process.env.VAPID_PRIVATE_KEY || '',
    };

    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      console.warn('[Notifications] VAPID keys not configured');
      return false;
    }

    webpush.setVapidDetails(
      'mailto:admin@ucm.cash',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    await webpush.sendNotification(subscription, message);
    return true;
  } catch (error) {
    console.error('[Notifications] Push failed:', error);
    return false;
  }
}

/**
 * Unified notification sender
 */
export async function notify(payload: NotificationPayload): Promise<boolean> {
  switch (payload.type) {
    case 'email':
      return sendEmail(payload.recipient, payload.subject || 'Notification', payload.message);
    case 'webhook':
      return sendWebhook(payload.recipient, { message: payload.message, ...payload.data });
    case 'push':
      console.warn('[Notifications] Push requires subscription object');
      return false;
    default:
      return false;
  }
}

export default { sendEmail, sendWebhook, sendPush, notify };
EOF
success "Created: packages/shared/notifications/index.ts"

# ═══════════════════════════════════════════════════════════════
# Summary
# ═══════════════════════════════════════════════════════════════
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Implementation files generated!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Generated files:"
echo "  • packages/trading/solana/jupiter.ts"
echo "  • packages/shared/database/schema.ts"
echo "  • packages/shared/database/index.ts"
echo "  • packages/shared/notifications/index.ts"
echo "  • scripts/deploy/helpers/deploy-erc20.ts"
echo ""
echo "Next steps:"
echo "  1. Run: pnpm install"
echo "  2. Run: ./scripts/automation/patch-todo-files.sh"
echo "  3. Run: pnpm build"
echo ""
