# Getting started with universal-crypto-mcp

The most extensive crypto MCP repository - 60+ networks, 100+ tools, DEX/CEX, DeFi, wallets, market data, automation, and x402 payments

## Install

```bash
npm install
```

## Verify the install

Clone the repository and run its checks to confirm everything works on your machine:

```bash
git clone https://github.com/nirholas/universal-crypto-mcp.git
cd universal-crypto-mcp
```

Available commands:

| Command | Runs |
|---|---|
| `npm run start` | `node dist/index.js` |
| `npm run dev` | `tsx watch src/index.ts` |
| `npm run build` | `tsup` |
| `npm run test` | `vitest run` |
| `npm run lint` | `tsc --noEmit && eslint src` |

## Next steps

- [Examples](./examples.md) shows runnable snippets.
- The [README](https://github.com/nirholas/universal-crypto-mcp#readme) is the complete reference.
- Found a problem? [Open an issue](https://github.com/nirholas/universal-crypto-mcp/issues).
