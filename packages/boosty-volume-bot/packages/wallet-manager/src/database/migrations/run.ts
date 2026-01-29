/**
 * Database Migration Runner
 * Applies SQL migrations to the database
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

// Use __dirname directly - available in Node.js CommonJS context
// For ESM, this would use: const __dirname = dirname(fileURLToPath(import.meta.url));
// @ts-ignore - __dirname is available at runtime
const migrationsDir = typeof __dirname !== 'undefined' 
  ? __dirname 
  : process.cwd();

/**
 * Get database URL from environment
 */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  return url;
}

/**
 * Get list of migration files
 */
function getMigrationFiles(): string[] {
  const dir = migrationsDir;
  const files = readdirSync(dir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  return files;
}

/**
 * Create migrations tracking table if it doesn't exist
 */
async function ensureMigrationsTable(sql: postgres.Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `;
}

/**
 * Get list of applied migrations
 */
async function getAppliedMigrations(sql: postgres.Sql): Promise<string[]> {
  const result = await sql<{ name: string }[]>`
    SELECT name FROM _migrations ORDER BY id
  `;
  return result.map(row => row.name);
}

/**
 * Apply a migration
 */
async function applyMigration(
  sql: postgres.Sql,
  filename: string,
  content: string
): Promise<void> {
  console.log(`Applying migration: ${filename}`);
  
  await sql.begin(async (tx) => {
    // Run the migration SQL
    await tx.unsafe(content);
    
    // Record the migration - use unsafe for parameterized query
    await tx.unsafe(`INSERT INTO _migrations (name) VALUES ($1)`, [filename]);
  });
  
  console.log(`  ✓ Applied ${filename}`);
}

/**
 * Run all pending migrations
 */
export async function runMigrations(databaseUrl?: string): Promise<void> {
  const url = databaseUrl || getDatabaseUrl();
  const sql = postgres(url);

  try {
    console.log('Starting database migrations...\n');

    // Ensure migrations table exists
    await ensureMigrationsTable(sql);

    // Get applied migrations
    const applied = await getAppliedMigrations(sql);
    console.log(`Found ${applied.length} applied migration(s)`);

    // Get migration files
    const files = getMigrationFiles();
    console.log(`Found ${files.length} migration file(s)\n`);

    // Apply pending migrations
    let appliedCount = 0;
    for (const file of files) {
      if (!applied.includes(file)) {
        const content = readFileSync(join(__dirname, file), 'utf-8');
        await applyMigration(sql, file, content);
        appliedCount++;
      }
    }

    if (appliedCount === 0) {
      console.log('No pending migrations to apply.');
    } else {
      console.log(`\nApplied ${appliedCount} migration(s) successfully.`);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

/**
 * Rollback the last migration (for development only)
 */
export async function rollbackLastMigration(databaseUrl?: string): Promise<void> {
  const url = databaseUrl || getDatabaseUrl();
  const sql = postgres(url);

  try {
    const applied = await getAppliedMigrations(sql);
    
    if (applied.length === 0) {
      console.log('No migrations to rollback.');
      return;
    }

    const lastMigration = applied[applied.length - 1];
    
    if (!lastMigration) {
      console.log('No migrations to rollback.');
      return;
    }
    
    console.log(`Rolling back: ${lastMigration}`);

    // Note: This doesn't actually undo the migration SQL
    // In production, you would need down migrations
    await sql.unsafe(`DELETE FROM _migrations WHERE name = $1`, [lastMigration]);

    console.log(`Removed ${lastMigration} from migrations table.`);
    console.log('WARNING: Database schema was not reverted. Manual cleanup may be needed.');
  } finally {
    await sql.end();
  }
}

/**
 * Check migration status
 */
export async function checkMigrationStatus(databaseUrl?: string): Promise<void> {
  const url = databaseUrl || getDatabaseUrl();
  const sql = postgres(url);

  try {
    await ensureMigrationsTable(sql);
    
    const applied = await getAppliedMigrations(sql);
    const files = getMigrationFiles();

    console.log('Migration Status:');
    console.log('=================\n');

    for (const file of files) {
      const status = applied.includes(file) ? '✓ Applied' : '○ Pending';
      console.log(`${status}: ${file}`);
    }

    const pending = files.filter(f => !applied.includes(f));
    console.log(`\nTotal: ${files.length} | Applied: ${applied.length} | Pending: ${pending.length}`);
  } finally {
    await sql.end();
  }
}

// Run if executed directly
if (process.argv[1] === __filename) {
  const command = process.argv[2] || 'up';

  switch (command) {
    case 'up':
      runMigrations().catch(console.error);
      break;
    case 'rollback':
      rollbackLastMigration().catch(console.error);
      break;
    case 'status':
      checkMigrationStatus().catch(console.error);
      break;
    default:
      console.log('Usage: ts-node run.ts [up|rollback|status]');
  }
}
