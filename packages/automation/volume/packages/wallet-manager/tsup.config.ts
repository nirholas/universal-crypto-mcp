import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // Skip DTS generation in tsup, will use tsc separately
  sourcemap: true,
  clean: true,
  target: 'node18',
  splitting: false,
  treeshake: true,
  skipNodeModulesBundle: true,
  external: [
    '@solana/web3.js',
    '@solana/spl-token',
    '@boosty/mcp-shared',
    'pg',
    'postgres',
    'drizzle-orm',
    'bip39',
    'ed25519-hd-key',
    'tweetnacl',
    'bs58',
    'uuid',
    'pino',
    'zod',
  ],
});
