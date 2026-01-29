import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/usds.ts",
    "src/yield.ts",
    "src/types.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    "@universal-crypto-mcp/core",
    "@universal-crypto-mcp/defi-shared",
    "@universal-crypto-mcp/wallet-evm",
    "@modelcontextprotocol/sdk",
    "viem",
    "zod",
  ],
});
