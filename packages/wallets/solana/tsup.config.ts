import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/wallet.ts",
    "src/types.ts",
    "src/tools/index.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    "@nirholas/crypto-mcp-core",
    "@universal-crypto-mcp/wallets-shared",
    "@modelcontextprotocol/sdk",
    "@solana/web3.js",
    "@solana/spl-token",
  ],
});
