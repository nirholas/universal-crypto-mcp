[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/solana

# defi/protocols/src/vendors/solana

## Functions

### registerSolana()

```ts
function registerSolana(server: McpServer): void;
```

Defined in: [defi/protocols/src/vendors/solana/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/index.ts#L19)

Register Solana blockchain module with the MCP server
Provides Solana balance, tokens, transactions, and Jupiter DEX integration

Environment variables:
- SOLANA_RPC_URL: Solana RPC endpoint (default: mainnet-beta)
- SOLANA_PRIVATE_KEY: Private key for write operations (base58 encoded)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
