# Aave Protocol MCP Server

<div align="center">

**Aave V3 lending and borrowing integration for AI agents**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-green)](https://modelcontextprotocol.io)

Created by [nirholas](https://x.com/nichxbt) • [GitHub](https://github.com/nirholas)

</div>

## 🚀 Features

- **Account Monitoring** - Track collateral, debt, and health factors
- **Reserve Analytics** - Get APY, liquidity, and utilization data
- **User Positions** - Monitor individual asset positions
- **Liquidation Alerts** - Get warnings when health factor is low
- **Multi-Chain** - Support for Ethereum, Arbitrum, Optimism, Polygon

## 📦 Installation

### Using npx (Recommended)

```bash
npx @nirholas/aave-mcp
```

### Global Install

```bash
npm install -g @nirholas/aave-mcp
aave-mcp
```

### Local Development

```bash
git clone https://github.com/nirholas/universal-crypto-mcp
cd packages/defi/protocols/aave-mcp
pnpm install
pnpm build
pnpm start
```

## 🔧 Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "aave": {
      "command": "npx",
      "args": ["@nirholas/aave-mcp"],
      "env": {
        "RPC_URL": "https://eth.llamarpc.com"
      }
    }
  }
}
```

### Environment Variables

- `RPC_URL` - Custom Ethereum RPC endpoint (optional)
- `DEBUG` - Enable debug logging (optional)

## 🛠️ Available Tools

### 1. Get User Account

Get comprehensive account data including health factor.

```typescript
{
  "tool": "aave_get_user_account",
  "params": {
    "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }
}
```

**Returns:**
- Total collateral (USD)
- Total debt (USD)
- Available borrows
- LTV and liquidation threshold
- Health factor with warnings

### 2. Get Reserve Data

Get detailed information about a lending pool.

```typescript
{
  "tool": "aave_get_reserve_data",
  "params": {
    "assetAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  }
}
```

**Returns:**
- Available liquidity
- Total debt (stable + variable)
- Supply APY
- Borrow APR
- Utilization rate

### 3. Get User Reserve

Check user's position in a specific asset.

```typescript
{
  "tool": "aave_get_user_reserve",
  "params": {
    "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "assetAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  }
}
```

**Returns:**
- Supplied amount
- Borrowed amount (stable + variable)
- Collateral status
- Interest rates

### 4. Get All Reserves

List all available assets in Aave.

```typescript
{
  "tool": "aave_get_all_reserves",
  "params": {}
}
```

**Returns:**
- Asset symbols and addresses
- aToken addresses
- Reserve configuration

## 💡 Example Conversations

### AI Agent Usage

**User:** "Check my Aave account health"

**Agent:** Uses `aave_get_user_account` to show collateral, debt, and health factor with liquidation warnings if needed.

**User:** "What's the current USDC supply APY on Aave?"

**Agent:** Uses `aave_get_reserve_data` with USDC address to show current rates and liquidity.

**User:** "Am I supplying WETH to Aave?"

**Agent:** Uses `aave_get_user_reserve` to check your WETH position and collateral status.

## ⚠️ Health Factor Guide

- **> 2.0** - Very safe position
- **1.5 - 2.0** - Healthy position
- **1.1 - 1.5** - Monitor closely
- **< 1.1** - ⚠️ At risk of liquidation
- **< 1.0** - Position can be liquidated

## 🏗️ Architecture

```
src/
├── index.ts           # Server entry point
├── tools/
│   └── index.ts       # Aave tool implementations
└── utils/
    └── logger.ts      # Logging utilities
```

## 🔗 Related Projects

Part of the **Universal Crypto MCP** ecosystem:

- [@nirholas/universal-crypto-mcp](https://github.com/nirholas/universal-crypto-mcp) - Main repository
- [@nirholas/uniswap-v3-mcp](../uniswap-v3-mcp) - Uniswap V3 DEX
- [@nirholas/curve-mcp](../curve-mcp) - Curve stableswap pools

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](https://github.com/nirholas/universal-crypto-mcp/blob/main/CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 👤 Author

**nirholas (Nich)**
- Twitter: [@nichxbt](https://x.com/nichxbt)
- GitHub: [nirholas](https://github.com/nirholas)

## 🙏 Acknowledgments

- [Aave](https://aave.com/) - For building the protocol
- [Model Context Protocol](https://modelcontextprotocol.io/) - For the MCP specification
- [Anthropic](https://www.anthropic.com/) - For Claude and MCP SDK

---

<div align="center">
Made with ❤️ by <a href="https://x.com/nichxbt">nirholas</a>
</div>
