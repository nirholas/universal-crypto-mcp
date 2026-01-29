# 👛 Wallet MCP Servers

> EVM and Solana wallet management toolkits for AI agents

## Overview

This package provides wallet management tools for AI agents across multiple blockchain ecosystems. Manage keys, sign transactions, check balances, and interact with on-chain assets.

## Available Servers

### 🔷 EVM Wallet Toolkit
Ethereum and EVM-compatible wallet tools:
- HD wallet generation and management
- Transaction signing and broadcasting
- Token transfers (ETH, ERC-20, ERC-721, ERC-1155)
- Message signing
- Multi-chain support

### 🟣 Solana Wallet Toolkit
Solana ecosystem wallet tools:
- Keypair generation
- SOL and SPL token transfers
- Transaction building and signing
- Associated Token Accounts
- Program interaction

## Installation

```bash
# From workspace root
pnpm install

# Build wallet packages
pnpm --filter "@nirholas/crypto-wallets" build
```

## Configuration

```bash
# EVM
PRIVATE_KEY=0x...  # Or mnemonic
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Solana
SOLANA_PRIVATE_KEY=base58_encoded_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Usage

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "evm-wallet": {
      "command": "node",
      "args": ["packages/wallets/evm/dist/index.js"],
      "env": {
        "PRIVATE_KEY": "your_key",
        "ETHEREUM_RPC_URL": "your_rpc"
      }
    },
    "solana-wallet": {
      "command": "node",
      "args": ["packages/wallets/solana/dist/index.js"],
      "env": {
        "SOLANA_PRIVATE_KEY": "your_key"
      }
    }
  }
}
```

## Available Tools

### EVM Wallet Tools
| Tool | Description |
|------|-------------|
| `create_wallet` | Generate new HD wallet |
| `import_wallet` | Import from private key/mnemonic |
| `get_address` | Get wallet address |
| `get_balance` | Get native token balance |
| `get_token_balance` | Get ERC-20 balance |
| `send_transaction` | Send native tokens |
| `send_token` | Send ERC-20 tokens |
| `sign_message` | Sign arbitrary message |
| `sign_typed_data` | Sign EIP-712 typed data |
| `estimate_gas` | Estimate transaction gas |

### Solana Wallet Tools
| Tool | Description |
|------|-------------|
| `create_keypair` | Generate new keypair |
| `import_keypair` | Import from private key |
| `get_balance` | Get SOL balance |
| `get_token_balance` | Get SPL token balance |
| `send_sol` | Send SOL |
| `send_token` | Send SPL tokens |
| `create_ata` | Create Associated Token Account |
| `sign_transaction` | Sign transaction |

## Security Best Practices

⚠️ **Private keys control funds**

### DO:
- Use hardware wallets for large amounts
- Store keys in secure environment variables
- Test on testnet first
- Use key derivation for multiple addresses

### DON'T:
- Commit private keys to git
- Store keys in plain text files
- Share keys with anyone
- Use the same key for mainnet and testnet

## Supported Networks

### EVM Networks
- Ethereum, Arbitrum, Optimism, Base
- Polygon, BSC, opBNB, Avalanche
- Fantom, Gnosis, Celo, Aurora
- And 50+ more...

### Solana
- Mainnet Beta
- Devnet
- Testnet

## Architecture

```
packages/wallets/
├── evm/                    # EVM wallet toolkit
│   ├── src/
│   │   ├── wallet.ts       # Wallet management
│   │   ├── signer.ts       # Transaction signing
│   │   └── tools/          # MCP tools
│   └── package.json
└── solana/                 # Solana wallet toolkit
    ├── src/
    │   ├── keypair.ts      # Keypair management
    │   ├── signer.ts       # Transaction signing
    │   └── tools/          # MCP tools
    └── package.json
```

## License

Apache-2.0

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
