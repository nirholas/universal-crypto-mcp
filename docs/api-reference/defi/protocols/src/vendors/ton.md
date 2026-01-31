[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/ton

# defi/protocols/src/vendors/ton

## Functions

### registerTon()

```ts
function registerTon(server: McpServer): void;
```

Defined in: [defi/protocols/src/vendors/ton/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/ton/index.ts#L21)

Register TON blockchain module with the MCP server
Provides TON balance, transactions, transfers, and network information

Environment variables:
- TON_RPC_URL: TON RPC endpoint (default: toncenter.com mainnet)
- TON_API_KEY: API key for TON Center (optional, but recommended)
- TON_MNEMONIC: Mnemonic for wallet creation (for write operations)
- TON_ADDRESS: Expected wallet address

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
