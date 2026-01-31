[**Universal Crypto MCP API Reference v1.0.0**](../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / trading/bots/src/mcp-tools

# trading/bots/src/mcp-tools

## Maintainer

Nicholas (nirholas)

## See

 - https://github.com/nirholas
 - https://x.com/nichxbt

## Example

```typescript
import { tradingBotTools, handleTradingBotTool } from '@universal-crypto-mcp/trading-bots';

// Register tools with MCP server
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tradingBotTools
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name.startsWith('trading_')) {
    return handleTradingBotTool(request.params.name, request.params.arguments);
  }
});
```

## Variables

### Trading

#### tradingBotTools

```ts
const tradingBotTools: Tool[];
```

Defined in: [trading/bots/src/mcp-tools.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/mcp-tools.ts#L51)

Array of MCP Tool definitions for trading bot operations.

Includes tools for:
- `list_trading_bots` - List all available trading bots
- `get_bot_info` - Get detailed info about a specific bot
- `execute_trading_bot` - Execute a trade using a bot

##### Constant

## Functions

### handleTradingBotTool()

```ts
function handleTradingBotTool(name: string, args: Record<string, any>): Promise<any>;
```

Defined in: [trading/bots/src/mcp-tools.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/mcp-tools.ts#L160)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<`any`\>

## References

### default

Renames and re-exports [tradingBotTools](/docs/api/trading/bots/src/mcp-tools.md#tradingbottools)
