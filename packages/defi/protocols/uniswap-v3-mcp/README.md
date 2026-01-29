# Uniswap V3 MCP Server

<div align="center">

**Advanced Uniswap V3 integration for AI agents**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-green)](https://modelcontextprotocol.io)

Created by [nirholas](https://x.com/nichxbt) • [GitHub](https://github.com/nirholas)

</div>

## 🚀 Features

- **Pool Analytics** - Get detailed information about any Uniswap V3 pool
- **Swap Quotes** - Calculate optimal swap routes and pricing
- **Position Management** - Monitor and manage liquidity positions
- **Top Pools** - Discover high-TVL liquidity pools
- **Multi-Chain** - Support for Ethereum, Arbitrum, Optimism, Polygon

## 📦 Installation

### Using npx (Recommended)

```bash
npx @nirholas/uniswap-v3-mcp
```

### Global Install

```bash
npm install -g @nirholas/uniswap-v3-mcp
uniswap-v3-mcp
```

### Local Development

```bash
git clone https://github.com/nirholas/universal-crypto-mcp
cd packages/defi/protocols/uniswap-v3-mcp
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
    "uniswap-v3": {
      "command": "npx",
      "args": ["@nirholas/uniswap-v3-mcp"],
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

### 1. Get Pool Information

Get detailed data about a Uniswap V3 liquidity pool.

```typescript
{
  "tool": "uniswap_v3_get_pool_info",
  "params": {
    "poolAddress": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
  }
}
```

**Returns:**
- Token addresses
- Fee tier
- Current liquidity
- Price information
- Tick data

### 2. Get Swap Quote

Calculate swap quotes with price impact analysis.

```typescript
{
  "tool": "uniswap_v3_get_swap_quote",
  "params": {
    "tokenIn": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "tokenOut": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "amountIn": "1000000000000000000",
    "feeTier": 3000
  }
}
```

**Returns:**
- Estimated output amount
- Price impact
- Optimal route
- Gas estimates

### 3. Get Position

Monitor liquidity position details.

```typescript
{
  "tool": "uniswap_v3_get_position",
  "params": {
    "tokenId": "123456"
  }
}
```

**Returns:**
- Token pair
- Price range (ticks)
- Current liquidity
- Uncollected fees
- Position value

### 4. Get Top Pools

Discover the most liquid Uniswap V3 pools.

```typescript
{
  "tool": "uniswap_v3_get_top_pools",
  "params": {
    "limit": 10
  }
}
```

**Returns:**
- Pool addresses
- Token pairs
- TVL data
- Fee tiers

## 💡 Example Conversations

### AI Agent Usage

**User:** "What's the current price of ETH/USDC on Uniswap?"

**Agent:** Uses `uniswap_v3_get_pool_info` with ETH/USDC 0.05% pool address to get current price from sqrtPriceX96.

**User:** "Show me my Uniswap position #584920"

**Agent:** Uses `uniswap_v3_get_position` to display position details, uncollected fees, and current value.

**User:** "What are the top 5 Uniswap pools?"

**Agent:** Uses `uniswap_v3_get_top_pools` with limit=5 to show highest TVL pools.

## 🏗️ Architecture

```
src/
├── index.ts           # Server entry point
├── tools/
│   └── index.ts       # Uniswap V3 tool implementations
└── utils/
    └── logger.ts      # Logging utilities
```

## 🔗 Related Projects

Part of the **Universal Crypto MCP** ecosystem:

- [@nirholas/universal-crypto-mcp](https://github.com/nirholas/universal-crypto-mcp) - Main repository
- [@nirholas/aave-mcp](../aave-mcp) - Aave lending protocol
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

- [Uniswap Labs](https://uniswap.org/) - For building the protocol
- [Model Context Protocol](https://modelcontextprotocol.io/) - For the MCP specification
- [Anthropic](https://www.anthropic.com/) - For Claude and MCP SDK

---

<div align="center">
Made with ❤️ by <a href="https://x.com/nichxbt">nirholas</a>
</div>
