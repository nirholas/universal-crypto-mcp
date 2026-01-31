import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'wallet/index': 'src/wallet/index.ts',
    'ui/index': 'src/ui/index.ts',
    'charts/index': 'src/charts/index.ts',
    'state/index': 'src/state/index.ts',
    'ai/index': 'src/ai/index.ts',
    'auth/index': 'src/auth/index.ts',
    'realtime/index': 'src/realtime/index.ts',
    'forms/index': 'src/forms/index.ts',
    'api/index': 'src/api/index.ts',
    'database/index': 'src/database/index.ts',
    'contracts/index': 'src/contracts/index.ts',
    'payments/index': 'src/payments/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  external: ['react', 'react-dom'],
});
