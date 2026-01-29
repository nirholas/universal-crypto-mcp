import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
    'src/server.ts',
    'src/connection/index.ts',
    'src/transactions/index.ts',
    'src/tokens/index.ts',
    'src/oracles/index.ts',
  ],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    '@solana/web3.js',
    '@solana/spl-token',
    '@pythnetwork/client',
  ],
});
