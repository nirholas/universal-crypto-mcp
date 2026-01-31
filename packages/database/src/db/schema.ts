import {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'CONFIRMED', 'FAILED']);
export const orderSideEnum = pgEnum('order_side', ['BUY', 'SELL']);
export const orderTypeEnum = pgEnum('order_type', ['MARKET', 'LIMIT']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'FILLED', 'PARTIAL', 'CANCELLED']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  password: text('password').notNull(),
  role: roleEnum('role').default('USER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  orders: many(orders),
}));

// Wallets table
export const wallets = pgTable('wallets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  address: varchar('address', { length: 255 }).unique().notNull(),
  network: varchar('network', { length: 50 }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('wallets_user_id_idx').on(table.userId),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

// Transactions table
export const transactions = pgTable('transactions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  hash: varchar('hash', { length: 255 }).unique().notNull(),
  from: varchar('from_address', { length: 255 }).notNull(),
  to: varchar('to_address', { length: 255 }).notNull(),
  value: decimal('value', { precision: 78, scale: 18 }).notNull(),
  network: varchar('network', { length: 50 }).notNull(),
  status: transactionStatusEnum('status').default('PENDING').notNull(),
  walletId: text('wallet_id').references(() => wallets.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  walletIdIdx: index('transactions_wallet_id_idx').on(table.walletId),
  hashIdx: uniqueIndex('transactions_hash_idx').on(table.hash),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
}));

// Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  side: orderSideEnum('side').notNull(),
  type: orderTypeEnum('type').default('MARKET').notNull(),
  amount: decimal('amount', { precision: 78, scale: 18 }).notNull(),
  price: decimal('price', { precision: 78, scale: 18 }),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  symbolIdx: index('orders_symbol_idx').on(table.symbol),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

// Crypto prices table
export const cryptoPrices = pgTable('crypto_prices', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  symbol: varchar('symbol', { length: 20 }).unique().notNull(),
  price: decimal('price', { precision: 78, scale: 18 }).notNull(),
  change24h: decimal('change_24h', { precision: 10, scale: 4 }).notNull(),
  volume24h: decimal('volume_24h', { precision: 78, scale: 18 }).notNull(),
  marketCap: decimal('market_cap', { precision: 78, scale: 0 }).notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});
