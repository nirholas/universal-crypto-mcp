/**
 * Database Layer
 * 
 * Database client adapters.
 * 
 * Reference: /vendor/database/
 */

// ============================================================
// Types
// ============================================================

export interface DatabaseConfig {
  url: string;
  pool?: {
    min: number;
    max: number;
  };
}

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

// ============================================================
// Database Client Interface
// ============================================================

export interface DatabaseClient {
  query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  transaction<T>(fn: (client: DatabaseClient) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

// ============================================================
// Note
// ============================================================

// In production, use:
// - Prisma: import { PrismaClient } from '@prisma/client'
// - Drizzle: import { drizzle } from 'drizzle-orm/...'
// - Kysely: import { Kysely } from 'kysely'

export const DatabaseProviders = ['prisma', 'drizzle', 'kysely'] as const;
export type DatabaseProvider = typeof DatabaseProviders[number];
