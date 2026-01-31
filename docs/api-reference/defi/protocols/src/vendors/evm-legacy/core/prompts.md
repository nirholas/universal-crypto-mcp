[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/evm-legacy/core/prompts

# defi/protocols/src/vendors/evm-legacy/core/prompts

## Functions

### registerEVMPrompts()

```ts
function registerEVMPrompts(server: McpServer): void;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/prompts.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/prompts.ts#L24)

Register task-oriented prompts with the MCP server

All prompts follow a consistent structure:
- Clear objective statement
- Step-by-step instructions
- Expected outputs
- Safety/security considerations

Prompts guide the model through complex workflows that would otherwise
require multiple tool calls in the correct sequence.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `server` | `McpServer` | The MCP server instance |

#### Returns

`void`
