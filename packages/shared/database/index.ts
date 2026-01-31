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
