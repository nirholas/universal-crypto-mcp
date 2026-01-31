[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/utxo

# defi/protocols/src/vendors/utxo

## Functions

### registerUTXOChains()

```ts
function registerUTXOChains(server: McpServer): void;
```

Defined in: [defi/protocols/src/vendors/utxo/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/utxo/index.ts#L19)

Register UTXO-based blockchain modules with the MCP server
Provides Bitcoin, Litecoin, and Dogecoin support

Uses xchainjs libraries for chain interactions

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`

## References

### registerBitcoinTools

Re-exports [registerBitcoinTools](/docs/api/defi/protocols/src/vendors/utxo/bitcoin.md#registerbitcointools)

***

### registerDogecoinTools

Re-exports [registerDogecoinTools](/docs/api/defi/protocols/src/vendors/utxo/dogecoin.md#registerdogecointools)

***

### registerLitecoinTools

Re-exports [registerLitecoinTools](/docs/api/defi/protocols/src/vendors/utxo/litecoin.md#registerlitecointools)
