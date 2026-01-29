import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    types: 'src/types.ts',
    'jupiter/index': 'src/jupiter/index.ts',
    'raydium/index': 'src/raydium/index.ts',
    'orca/index': 'src/orca/index.ts',
    'pumpfun/index': 'src/pumpfun/index.ts',
    'executor/index': 'src/executor/index.ts',
    'analytics/index': 'src/analytics/index.ts',
  },
  format: ['esm'],
  dts: {
    compilerOptions: {
      composite: false,
      incremental: false,
    }
  },
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: [
    '@boosty/mcp-shared',
    '@boosty/mcp-solana-core',
    '@solana/web3.js',
    '@solana/spl-token',
    '@coral-xyz/anchor',
  ],
});
