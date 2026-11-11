# crypto-mcp-hub

One MCP server that puts **170 open-source crypto MCP servers (5,716 tools)** behind a single connector: market data, DEX and CEX trading, wallets, DeFi, on-chain analytics, prediction markets, payments, security scanners and developer tooling across Solana, Ethereum, Base, BNB Chain, Bitcoin, TON, Sui, Hyperliquid and more.

```bash
npx -y @nirholas/crypto-mcp-hub
```

Every [GitHub release](https://github.com/nirholas/universal-crypto-mcp/releases/tag/crypto-mcp-hub-v0.1.0) also carries the package as a tarball, which `npx` runs directly: `npx -y https://github.com/nirholas/universal-crypto-mcp/releases/download/crypto-mcp-hub-v0.1.0/nirholas-crypto-mcp-hub-0.1.0.tgz`. Use that URL in place of `@nirholas/crypto-mcp-hub` in any command below to pin an exact release.

Plug that one command into Claude, ChatGPT, Cursor, VS Code, Windsurf, Gemini CLI, Codex or any other MCP client. You get every server whose keys you have set, with no per-server setup.

- **Every server is verified.** Each catalog entry launched in a network-only sandbox (no credentials, no host files), completed the MCP handshake and listed its tools. Entries that failed were left out. See [SERVERS.md](SERVERS.md).
- **Upstream code is never vendored.** Each server runs from its own registry at a pinned version: npm via `npx`, PyPI and GitHub via `uvx`. You get the authors' code, under their licenses ([THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)).
- **Lazy and shared.** An upstream process starts the first time one of its tools is called. All client sessions share it, a crash triggers a restart, and it stops after 15 idle minutes.
- **Keys stay scoped.** Each upstream sees only the environment variables its catalog entry declares, so an exchange key never reaches an unrelated server.
- **Fits any client's tool budget.** Router mode exposes 4 tools that search a pre-built index of all 5,716 upstream tools. Pick 3 or fewer servers and every tool is exposed directly.

## Requirements

- Node.js 20.12 or newer (`npx`).
- [uv](https://docs.astral.sh/uv/getting-started/installation/) for the 10 Python servers (`uvx`). Without it the Node servers still work, and each Python server reports that `uvx` is missing when called.

## Connect a client

`npx -y @nirholas/crypto-mcp-hub config <client>` prints the exact snippet for your client, and `install` writes it for you.

| Client | One command |
| --- | --- |
| Claude Code | `claude mcp add crypto -- npx -y @nirholas/crypto-mcp-hub` |
| Claude Desktop | `npx -y @nirholas/crypto-mcp-hub install claude-desktop` |
| Cursor | `npx -y @nirholas/crypto-mcp-hub install cursor` |
| Windsurf | `npx -y @nirholas/crypto-mcp-hub install windsurf` |
| Gemini CLI | `npx -y @nirholas/crypto-mcp-hub install gemini` |
| VS Code | `npx -y @nirholas/crypto-mcp-hub config vscode` and paste into `.vscode/mcp.json` |
| Codex CLI | `npx -y @nirholas/crypto-mcp-hub config codex` and paste into `~/.codex/config.toml` |
| ChatGPT, Claude.ai, any remote client | Run over HTTP (below) and add the URL as a connector |

`install` merges into your existing config and saves the previous file as `.bak`.

Any JSON-config client takes the same entry:

```json
{
  "mcpServers": {
    "crypto": {
      "command": "npx",
      "args": ["-y", "@nirholas/crypto-mcp-hub"],
      "env": { "COINGECKO_API_KEY": "optional", "ETHERSCAN_API_KEY": "optional" }
    }
  }
}
```

### ChatGPT and other remote clients (Streamable HTTP)

```bash
HUB_AUTH_TOKEN=$(openssl rand -hex 24) npx -y @nirholas/crypto-mcp-hub --http --host 0.0.0.0
```

Or with Docker (the sparse clone fetches only this package, about 30 MB):

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/nirholas/universal-crypto-mcp
git -C universal-crypto-mcp sparse-checkout set packages/crypto-mcp-hub
docker build -t crypto-mcp-hub universal-crypto-mcp/packages/crypto-mcp-hub
docker run -p 8787:8787 -e HUB_AUTH_TOKEN=<token> --env-file .env crypto-mcp-hub
```

Put the server behind HTTPS: deploy the container to any host (Cloud Run, Fly, Render), or open a tunnel with `cloudflared tunnel --url http://localhost:8787`. Then:

- **ChatGPT:** Settings, Apps & Connectors, Advanced settings: enable Developer mode, then create a connector with URL `https://<host>/t/<token>/mcp` and no authentication. The secret path is the credential.
- **Clients that send headers:** use `https://<host>/mcp` with `Authorization: Bearer <token>`.
- **Legacy SSE clients:** use `https://<host>/sse`.

`GET /healthz` returns liveness. `GET /` (with the token) shows mode, server count and running upstreams.

## How the model uses it

In router mode (the default once more than 3 servers are selected), the model sees four tools:

| Tool | Purpose |
| --- | --- |
| `find_crypto_tools` | Search all upstream tools by plain-language query (`"solana token price"`, `"uniswap quote"`). Uses the catalog index, so no process starts. |
| `list_crypto_servers` | Browse servers by category, see tool counts and which keys are missing. |
| `describe_crypto_tool` | Start the server if needed and return the exact input schema. |
| `call_crypto_tool` | Call the tool and return the upstream result unchanged. |

Proxy mode exposes upstream tools directly as `<server>__<tool>`. It is the default when you pick 3 or fewer servers with `--servers`. Force either mode with `--mode router|proxy`.

## Choose servers

```bash
npx -y @nirholas/crypto-mcp-hub list                         # every server, category, keys
npx -y @nirholas/crypto-mcp-hub --category solana,dex         # only these categories
npx -y @nirholas/crypto-mcp-hub --servers ccxt,coingecko      # exactly these (proxy mode)
npx -y @nirholas/crypto-mcp-hub --exclude fireblocks          # everything except
npx -y @nirholas/crypto-mcp-hub --env-file ~/.crypto.env      # load keys from a file
```

Without `--servers`, the hub exposes every server that runs keyless plus every key-gated server whose keys are present (139 servers need no key at all). A server you name explicitly is always included; if its key is missing, calling it returns an error naming the variable to set. Selection flags given to `config` or `install` are written into the client entry.

Categories: `market-data`, `payments`, `trading`, `wallet`, `solana`, `dev-tools`, `defi`, `dex`, `ethereum`, `base`, `analytics`, `cex`, `prediction-markets`, `security`, `hyperliquid`, `news`, `stellar`, `sui`, `bitcoin`, `bnb-chain`, `algorand`, `ton`, `hedera`, `cardano`, `xrpl`, `tron`, `starknet`, `nft`, `aptos`.

## Safety

Some upstream servers can trade, transfer or sign. They only act when you have set their keys. The hub instructs the model to confirm recipient, amount, token and chain with you before calling any tool that moves funds. On top of that:

- Give trading servers keys that are scoped (read-only or trade-only, no withdrawal) and funded only with what you are willing to risk.
- In HTTP mode on a non-loopback address, always set `HUB_AUTH_TOKEN`; the hub warns when it is missing. Loopback binds reject foreign `Host` headers (DNS-rebinding protection).
- Every upstream is pinned to an exact version or commit, so a new release can't change what runs until the catalog is updated and re-verified.

## Environment

| Variable | Default | Meaning |
| --- | --- | --- |
| `HUB_AUTH_TOKEN` | unset | Required token for HTTP mode (`Authorization: Bearer` or `/t/<token>/...`) |
| `HOST`, `PORT` | `127.0.0.1`, `8787` | HTTP bind address (the Docker image binds `0.0.0.0`) |
| `HUB_IDLE_SECONDS` | `900` | Stop an idle upstream after this long |
| `HUB_CALL_TIMEOUT_SECONDS` | `120` | Upstream tool-call timeout (reset by progress notifications) |
| `HUB_LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error`, `silent` (logs go to stderr) |

Plus each server's own keys: run `list` or see [SERVERS.md](SERVERS.md).

## Verify and extend the catalog

```bash
npx -y @nirholas/crypto-mcp-hub doctor --ignore-env --report report.json
```

`doctor` launches each selected server, completes the MCP handshake, lists its tools and records failures with the server's stderr. Run it in a container when you check servers you haven't vetted.

To add a server, append an entry to [catalog/servers.json](catalog/servers.json) with a pinned version:

```json
{
  "id": "my-server",
  "name": "My Server",
  "description": "What it does",
  "repo": "owner/repo",
  "license": "MIT",
  "source": { "type": "npm", "package": "my-mcp-server", "version": "1.2.3" },
  "categories": ["market-data", "solana"],
  "command": "npx",
  "args": ["-y", "my-mcp-server@1.2.3"],
  "env": [{ "name": "MY_API_KEY", "required": true }],
  "tools": []
}
```

Then run `doctor --servers my-server --report r.json`, copy the listed tools into `tools` (that is what `find_crypto_tools` searches), and run `npm run docs` to regenerate SERVERS.md and THIRD_PARTY_NOTICES.md.

## Develop

```bash
cd packages/crypto-mcp-hub
npm install
npm test                                   # unit, stdio and HTTP integration tests
node bin/crypto-mcp-hub.js --help
```

The tests run the real hub binary against a real fixture MCP server over stdio, Streamable HTTP and SSE, covering auth, session handling, env isolation and crash restarts.

## License

Apache-2.0 for the hub. Each upstream server keeps its own license; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
