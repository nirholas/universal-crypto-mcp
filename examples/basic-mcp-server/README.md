# Basic MCP Server Example

A minimal example showing how to create an MCP server with cryptocurrency tools.

## Features

- `get_price` - Get the current price of a cryptocurrency
- `get_trending` - Get trending cryptocurrencies
- `get_market_overview` - Get an overview of the crypto market

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### Add to Claude Desktop

Edit your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "basic-crypto": {
      "command": "node",
      "args": ["/path/to/basic-mcp-server/dist/index.js"]
    }
  }
}
```

## Usage

Once configured, ask Claude:

- "What's the current price of Bitcoin?"
- "Show me trending cryptocurrencies"
- "Give me a market overview"

## Extending

To add more tools, add them to the `tools` object in `src/index.ts`:

```typescript
const tools = {
  // ... existing tools
  
  my_new_tool: {
    description: "Does something useful",
    inputSchema: {
      type: "object",
      properties: {
        param1: { type: "string", description: "Parameter description" },
      },
      required: ["param1"],
    },
    handler: async (params: { param1: string }) => {
      return {
        content: [{ type: "text", text: "Result" }],
      };
    },
  },
};
```

## Project Structure

```
basic-mcp-server/
├── src/
│   └── index.ts      # Main server code
├── package.json      # Dependencies
└── README.md         # This file
```

## Next Steps

- Add real API integrations (CoinGecko, etc.)
- Add wallet tools
- Add DeFi tools
- See the [full documentation](../../docs/content/packages/overview.md)
