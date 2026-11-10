import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/entities.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/wallets',
  },
  verbose: true,
  strict: true,
});
