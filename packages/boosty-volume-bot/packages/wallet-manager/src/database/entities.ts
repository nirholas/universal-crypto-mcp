/**
 * Database Entities
 * Drizzle ORM schema definitions for wallet storage
 */

import {
  pgTable,
  uuid,
  varchar,
  integer,
  bigint,
  text,
  timestamp,
  boolean,
  index,
} from 'drizzle-orm/pg-core';

/**
 * Master wallets table
 * Stores encrypted mnemonics for HD wallet roots
 */
export const masterWallets = pgTable(
  'master_wallets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    encryptedMnemonic: text('encrypted_mnemonic').notNull(),
    derivedCount: integer('derived_count').default(0).notNull(),
    label: varchar('label', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    createdAtIdx: index('master_wallets_created_at_idx').on(table.createdAt),
  })
);

/**
 * Wallets table
 * Stores individual wallets (derived or standalone)
 */
export const wallets = pgTable(
  'wallets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    address: varchar('address', { length: 44 }).unique().notNull(),
    derivationIndex: integer('derivation_index'),
    masterWalletId: uuid('master_wallet_id').references(() => masterWallets.id, {
      onDelete: 'cascade',
    }),
    encryptedKey: text('encrypted_key').notNull(),
    label: varchar('label', { length: 255 }),
    tags: text('tags').array().default([]).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    lastUsedAt: timestamp('last_used_at'),
    totalTrades: integer('total_trades').default(0).notNull(),
    totalVolumeSol: bigint('total_volume_sol', { mode: 'bigint' }).default(BigInt(0)).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (table) => ({
    addressIdx: index('wallets_address_idx').on(table.address),
    masterWalletIdIdx: index('wallets_master_wallet_id_idx').on(table.masterWalletId),
    tagsIdx: index('wallets_tags_idx').on(table.tags),
    isActiveIdx: index('wallets_is_active_idx').on(table.isActive),
    createdAtIdx: index('wallets_created_at_idx').on(table.createdAt),
  })
);

/**
 * Audit logs table
 * Tracks all wallet access and operations
 */
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    action: varchar('action', { length: 50 }).notNull(),
    walletId: uuid('wallet_id').references(() => wallets.id, {
      onDelete: 'set null',
    }),
    success: boolean('success').notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    metadata: text('metadata'), // JSON string
    error: text('error'),
  },
  (table) => ({
    timestampIdx: index('audit_logs_timestamp_idx').on(table.timestamp),
    walletIdIdx: index('audit_logs_wallet_id_idx').on(table.walletId),
    actionIdx: index('audit_logs_action_idx').on(table.action),
  })
);

/**
 * Wallet groups table
 * For organizing wallets into logical groups
 */
export const walletGroups = pgTable(
  'wallet_groups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index('wallet_groups_name_idx').on(table.name),
  })
);

/**
 * Wallet group memberships (many-to-many)
 */
export const walletGroupMembers = pgTable(
  'wallet_group_members',
  {
    walletId: uuid('wallet_id')
      .references(() => wallets.id, { onDelete: 'cascade' })
      .notNull(),
    groupId: uuid('group_id')
      .references(() => walletGroups.id, { onDelete: 'cascade' })
      .notNull(),
    addedAt: timestamp('added_at').defaultNow().notNull(),
  },
  (table) => ({
    walletGroupPk: index('wallet_group_pk').on(table.walletId, table.groupId),
  })
);

/**
 * Type exports for TypeScript
 */
export type MasterWalletEntity = typeof masterWallets.$inferSelect;
export type NewMasterWallet = typeof masterWallets.$inferInsert;

export type WalletEntity = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;

export type AuditLogEntity = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type WalletGroupEntity = typeof walletGroups.$inferSelect;
export type NewWalletGroup = typeof walletGroups.$inferInsert;

export type WalletGroupMemberEntity = typeof walletGroupMembers.$inferSelect;
export type NewWalletGroupMember = typeof walletGroupMembers.$inferInsert;
