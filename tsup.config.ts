/**
 * @author nich
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license Apache-2.0
 */
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    lib: 'src/lib.ts',
    index: 'src/index.ts',
    // package.json declares an `x402` bin at dist/x402/cli/index.js. Without an
    // entry for it the build never emits that file, so the bin has always
    // exited with MODULE_NOT_FOUND. The key is the path under dist/.
    'x402/cli/index': 'src/x402/cli/index.ts'
  },
  format: ['esm'],
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: [
    '@modelcontextprotocol/sdk',
    'viem',
    'zod',
    'express',
    'cors',
    'dotenv'
  ],
  esbuildOptions(options) {
    options.alias = {
      '@': './src'
    }
  }
})
