[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/evm-legacy/core/services/clients

# defi/protocols/src/vendors/evm-legacy/core/services/clients

## Functions

### getAddressFromPrivateKey()

```ts
function getAddressFromPrivateKey(privateKey: `0x${string}`): `0x${string}`;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/clients.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/clients.ts#L68)

Get an Ethereum address from a private key

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `` `0x${string}` `` | The private key in hex format (with or without 0x prefix) |

#### Returns

`` `0x${string}` ``

The Ethereum address derived from the private key

***

### getPublicClient()

```ts
function getPublicClient(network: string): {
};
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/clients.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/clients.ts#L25)

Get a public client for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `network` | `string` | `'ethereum'` |

#### Returns

```ts
{
}
```

***

### getWalletClient()

```ts
function getWalletClient(privateKey: `0x${string}`, network: string): {
};
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/clients.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/clients.ts#L51)

Create a wallet client for a specific network and private key

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `privateKey` | `` `0x${string}` `` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

```ts
{
}
```
