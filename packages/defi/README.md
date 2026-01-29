# 🌐 DeFi MCP Servers

> On-chain DeFi protocols and tools for 60+ EVM networks

## Overview

This package provides comprehensive DeFi (Decentralized Finance) tools for AI agents. Interact with DEXs, lending protocols, bridges, and more across 60+ blockchain networks.

## Package Structure

```
packages/defi/
├── shared/           # Shared DeFi utilities and types
├── sperax/           # Sperax USDs stablecoin integration
├── bnb-chain/        # BNB Chain DeFi (PancakeSwap, Venus)
├── protocols/        # DeFi protocol integrations
├── chain-tools/      # Blockchain interaction tools
└── agents/           # Autonomous DeFi agents
```

## Available Packages

### 📦 Core Packages

| Package | Description |
|---------|-------------|
| `@universal-crypto-mcp/defi-shared` | Shared types, ABIs, and protocol registry |
| `@universal-crypto-mcp/defi-sperax` | Sperax USDs yield-bearing stablecoin |
| `@universal-crypto-mcp/defi-bnb-chain` | PancakeSwap, Venus, and BNB Chain protocols |

### 🔷 Protocols
DeFi protocol integrations:
- **EVM MCP Server** - 60+ networks, 22 tools (from mcpdotdirect, 360⭐)
- **Sperax** - USD stablecoin and yield farming
- **Universal Router** - Uniswap V3 integration

### ⛓️ Chain Tools
Blockchain interaction tools:
- **BNB Chain** - BSC and opBNB tools
- **Onchain MCP** - Bankless on-chain analytics
- **Blockchain Server** - Multi-chain utilities

### 🤖 Agents
Autonomous DeFi agents:
- **DeFi Agents** - Automated trading strategies
- **Yield Optimization** - Auto-compound yields

## Supported Networks

| Network | Chain ID | RPC |
|---------|----------|-----|
| Ethereum | 1 | Infura/Alchemy |
| Arbitrum | 42161 | Alchemy |
| Optimism | 10 | Alchemy |
| Base | 8453 | Alchemy |
| Polygon | 137 | Alchemy |
| BSC | 56 | Public RPC |
| opBNB | 204 | Public RPC |
| Avalanche | 43114 | Public RPC |
| Fantom | 250 | Public RPC |
| ... and 50+ more | | |

## Installation

```bash
# From workspace root
pnpm install

# Build DeFi packages
pnpm --filter "@nirholas/crypto-defi" build
```

## Configuration

```bash
# RPC Endpoints (required)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY

# Private key for transactions (optional)
PRIVATE_KEY=0x...
```

## Usage

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "evm-defi": {
      "command": "node",
      "args": ["packages/defi/protocols/evm-mcp-server/dist/index.js"],
      "env": {
        "ETHEREUM_RPC_URL": "your_rpc_url"
      }
    },
    "bnbchain": {
      "command": "node",
      "args": ["packages/defi/chain-tools/bnbchain/dist/index.js"]
    }
  }
}
```

## Available Tools (22+ in EVM MCP Server)

### Wallet & Balance
| Tool | Description |
|------|-------------|
| `get_balance` | Get native token balance |
| `get_token_balance` | Get ERC-20 token balance |
| `get_token_info` | Get token metadata |

### Transactions
| Tool | Description |
|------|-------------|
| `send_transaction` | Send native tokens |
| `send_token` | Send ERC-20 tokens |
| `get_transaction` | Get transaction details |
| `estimate_gas` | Estimate gas costs |

### DeFi
| Tool | Description |
|------|-------------|
| `swap_tokens` | DEX token swap |
| `get_swap_quote` | Get swap quote |
| `approve_token` | Approve token spending |
| `check_allowance` | Check token allowance |

### Smart Contracts
| Tool | Description |
|------|-------------|
| `read_contract` | Call view function |
| `write_contract` | Execute contract function |
| `get_contract_abi` | Fetch verified ABI |

### ENS
| Tool | Description |
|------|-------------|
| `resolve_ens` | ENS to address |
| `reverse_ens` | Address to ENS |

## Architecture

```
packages/defi/
├── protocols/          # DeFi protocol integrations
│   ├── evm-mcp-server/ # Main EVM server (60+ networks)
│   ├── sperax/         # Sperax USD integration
│   └── universal-router/
├── chain-tools/        # Chain-specific tools
│   ├── bnbchain/       # BNB Chain tools
│   └── onchain-mcp/    # Bankless analytics
└── agents/             # Autonomous agents
    └── defi-agents/    # Trading strategies
```

## Security

⚠️ **DeFi transactions involve real funds**

- Always test on testnets first
- Review transactions before signing
- Use hardware wallets for large amounts
- Check contract addresses carefully

## License

Apache-2.0 / MIT (varies by integration)

---

## 👤 Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

Apache-2.0 - see [LICENSE](../../LICENSE)
