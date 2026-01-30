# Curve Finance MCP Server

> Stableswap DEX integration for AI assistants via the Model Context Protocol

**Author:** nirholas (Nich)  
**Website:** [x.com/nichxbt](https://x.com/nichxbt)  
**GitHub:** [github.com/nirholas](https://github.com/nirholas)  
**License:** MIT

## Features

- 🔄 **Pool Analytics** - Virtual price, amplification, fees
- 💱 **Swap Quotes** - Get expected output for swaps
- 🎯 **Gauge Rewards** - CRV inflation rates and rewards
- 📊 **Top Pools** - Discover highest TVL pools

## Installation

```bash
npm install @nirholas/curve-mcp
# or
pnpm add @nirholas/curve-mcp
```

## Configuration

Add to your MCP settings:

```json
{
  "mcpServers": {
    "curve": {
      "command": "npx",
      "args": ["@nirholas/curve-mcp"]
    }
  }
}
```

## Available Tools

### curve_get_pool_info
Get detailed pool information including virtual price and amplification.

### curve_get_dy
Get expected output amount for a swap between pool tokens.

### curve_get_gauge_info
Get gauge rewards information including CRV inflation rate.

### curve_get_top_pools
Get list of top Curve pools by TVL.

## Example Usage

```
"Get the virtual price of the 3pool"
"What's the swap rate for 1000 USDC to DAI in the 3pool?"
"Show me the top 5 Curve pools by TVL"
```

## License

MIT © nirholas
