import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/entities.ts',
  out: './src/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/wallets',
  },
  verbose: true,
  strict: true,
} satisfies Config;
