# UCM Cloud demo

UCM Cloud is a hosted demo of Universal Crypto MCP. It runs on a single Cloudflare Worker with a D1 database.

- Live: https://universal-crypto-mcp.ninabrekkerese.workers.dev
- Console: `/app/` (sign in with an EVM or Solana wallet)
- MCP endpoint: `POST /mcp` (Streamable HTTP, stateless JSON-RPC, `Authorization: Bearer sk_ucm_…`)

## What it does

The demo exposes 19 live tools across 7 EVM mainnets (Ethereum, Base, Arbitrum, OP, Polygon, BNB Chain and Avalanche) and 2 testnets.

| Area | Tools |
|---|---|
| Portfolio and explorer | portfolio, balances, gas, blocks, transactions, `eth_call`, ENS, signature checks |
| Security | token and address checks (GoPlus) |
| Markets | DeFi TVL (DefiLlama), prices |
| Trading | swap quotes (KyberSwap) and bridge quotes (LI.FI), returned as transactions ready to sign |

In the console, users can:

- scan their own portfolio;
- keep a watchlist of up to 50 addresses;
- run security scans;
- execute swaps and bridges from their own wallet (approval first, then the transaction);
- run any tool;
- create API keys and view their usage log.

The worker never holds keys or funds.

## Routes

| Route | Auth | Purpose |
|---|---|---|
| `GET /api/live` | public | Gas board for every network |
| `GET /api/chains` | public | Network registry with tokens and explorers |
| `GET /api/tools` | session or key | Tool list with JSON Schemas |
| `POST /api/run/:tool` | session or key | Run a single tool |
| `GET/POST/DELETE /api/watchlist` | session or key | Watchlist CRUD |
| `POST /mcp` | session or key | MCP `initialize`, `tools/list`, `tools/call` |

## Develop and deploy

```bash
./build.sh                                   # vendors ../../_kit into public/
bash ../../_kit/scripts/deploy.sh "$PWD"     # creates D1, deploys, sets SESSION_SECRET
```

`deploy.sh` reads Cloudflare credentials from `~/.config/cloudflare/credentials.env`.
