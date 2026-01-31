---
sidebar_position: 1
---

# Installation

Install Universal Crypto MCP to start using 150+ crypto tools in your AI agents.

## Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **pnpm** package manager
- (Optional) **Claude Desktop** for MCP integration

## Installation Methods

### NPM Package

Install the package globally or locally:

```bash
# Global installation
npm install -g @nirholas/universal-crypto-mcp

# Or in your project
npm install @nirholas/universal-crypto-mcp
```

### Claude Desktop Integration

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"],
      "env": {
        "ETHEREUM_RPC_URL": "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
        "PRIVATE_KEY": "your_private_key_here"
      }
    }
  }
}
```

### From Source

Clone and build from source:

```bash
git clone https://github.com/nirholas/universal-crypto-mcp.git
cd universal-crypto-mcp
pnpm install
pnpm build
```

## Environment Variables

Create a `.env` file with your configuration:

```bash
# Required
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key_here

# Optional
BASE_RPC_URL=https://mainnet.base.org
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
OPTIMISM_RPC_URL=https://mainnet.optimism.io
POLYGON_RPC_URL=https://polygon-rpc.com

# Facilitator (if using x402 payments)
FACILITATOR_URL=https://facilitator.x402.org
FACILITATOR_API_KEY=your_api_key

# Marketplace (if registering services)
MARKETPLACE_CONTRACT=0x...
```

## Verify Installation

Test your installation:

```bash
# Check version
npx @nirholas/universal-crypto-mcp --version

# List available tools
npx @nirholas/universal-crypto-mcp --list-tools

# Run health check
npx @nirholas/universal-crypto-mcp --health-check
```

## Next Steps

- Continue to [Quick Start](./quick-start) for your first implementation
- Configure your [environment](./configuration)
- Explore [available tools](../intro#key-features)

## Troubleshooting

### "Module not found" Error

Make sure you've installed all dependencies:

```bash
pnpm install
```

### RPC Connection Issues

Verify your RPC URLs are accessible:

```bash
curl https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### Claude Desktop Not Detecting MCP

1. Restart Claude Desktop
2. Check the config file path is correct
3. Verify JSON syntax is valid
4. Check logs: `~/Library/Logs/Claude/mcp.log`

## Support

Need help? Reach out:

- [GitHub Issues](https://github.com/nirholas/universal-crypto-mcp/issues)
- [Discord Community](https://discord.gg/universal-crypto-mcp)
- [Documentation](https://docs.nirholas.com)
