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
