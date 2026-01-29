import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/bot.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  outDir: 'dist',
});
