[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/core/tools

# defi/protocols/src/core/tools

## Functions

### registerEVMTools()

```ts
function registerEVMTools(server: McpServer): void;
```

Defined in: [defi/protocols/src/core/tools.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/tools.ts#L25)

Register all EVM-related tools with the MCP server

SECURITY: Either EVM_PRIVATE_KEY or EVM_MNEMONIC environment variable must be set for write operations.
Private keys and mnemonics are never passed as tool arguments for security reasons.
Tools will use the configured wallet for all transactions.

Configuration options:
- EVM_PRIVATE_KEY: Hex private key (with or without 0x prefix)
- EVM_MNEMONIC: BIP-39 mnemonic phrase (12 or 24 words)
- EVM_ACCOUNT_INDEX: Optional account index for HD wallet derivation (default: 0)

All tools that accept addresses also support ENS names (e.g., 'vitalik.eth').
ENS names are automatically resolved to addresses using the Ethereum Name Service.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `server` | `McpServer` | The MCP server instance |

#### Returns

`void`

