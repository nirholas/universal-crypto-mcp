[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/thorchain

# defi/protocols/src/vendors/thorchain

## Functions

### registerThorchain()

```ts
function registerThorchain(server: McpServer): void;
```

Defined in: [defi/protocols/src/vendors/thorchain/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/thorchain/index.ts#L18)

Register THORChain module with the MCP server
Provides THORChain balance, pools, swap quotes, and cross-chain functionality

Environment variables:
- THORCHAIN_MNEMONIC: Mnemonic for wallet creation (for write operations)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
