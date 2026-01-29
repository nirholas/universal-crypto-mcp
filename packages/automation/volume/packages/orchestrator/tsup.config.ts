import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: [
    '@defi-mcp/shared',
    '@defi-mcp/solana-core',
    '@defi-mcp/trading-engine',
    '@defi-mcp/wallet-manager',
  ],
});
