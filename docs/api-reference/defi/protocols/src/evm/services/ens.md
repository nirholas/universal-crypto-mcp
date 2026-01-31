[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/evm/services/ens

# defi/protocols/src/evm/services/ens

## Functions

### resolveAddress()

```ts
function resolveAddress(addressOrEns: string, network: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/evm/services/ens.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/services/ens.ts#L18)

Resolves an ENS name to an Ethereum address or returns the original address if it's already valid

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `addressOrEns` | `string` | `undefined` | An Ethereum address or ENS name |
| `network` | `string` | `"ethereum"` | The network to use for ENS resolution (defaults to Ethereum mainnet) |

#### Returns

`Promise`\<`` `0x${string}` ``\>

The resolved Ethereum address
