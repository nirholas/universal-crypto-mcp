[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/ripple

# defi/protocols/src/vendors/ripple

## Functions

### registerRipple()

```ts
function registerRipple(server: McpServer): void;
```

Defined in: [defi/protocols/src/vendors/ripple/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/ripple/index.ts#L21)

Register XRP Ledger (Ripple) module with the MCP server
Provides XRP balance, transactions, trustlines, and ledger information

Environment variables:
- XRP_RPC_URL: XRP Ledger RPC endpoint (default: wss://s1.ripple.com)
- XRP_PRIVATE_KEY: Private key (seed) for write operations
- XRP_MNEMONIC: Alternative mnemonic for wallet creation
- XRP_ADDRESS: Expected wallet address (for verification)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
