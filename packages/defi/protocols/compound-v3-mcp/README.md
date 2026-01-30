# Compound V3 MCP Server

> Lending market integration for AI assistants via the Model Context Protocol

**Author:** nirholas (Nich)  
**Website:** [x.com/nichxbt](https://x.com/nichxbt)  
**GitHub:** [github.com/nirholas](https://github.com/nirholas)  
**License:** MIT

## Features

- 📊 **Market Data** - TVL, utilization, interest rates
- 👤 **User Positions** - Balance, borrow, liquidation status
- 💵 **Collateral** - Asset info and supply caps
- 🌐 **Multi-Chain** - Ethereum, Arbitrum, Polygon, Base

## Installation

```bash
npm install @nirholas/compound-v3-mcp
```

## Configuration

```json
{
  "mcpServers": {
    "compound-v3": {
      "command": "npx",
      "args": ["@nirholas/compound-v3-mcp"]
    }
  }
}
```

## Available Tools

### compound_v3_get_market_info
Get market TVL, utilization, and interest rates.

### compound_v3_get_user_account
Get user's supply/borrow position and liquidation status.

### compound_v3_get_collateral_info
Get collateral asset configuration.

### compound_v3_get_markets
List all available Compound V3 markets.

## License

MIT © nirholas
