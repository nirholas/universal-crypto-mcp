[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/evm-legacy/core/services/transactions

# defi/protocols/src/vendors/evm-legacy/core/services/transactions

## Functions

### estimateGas()

```ts
function estimateGas(params: EstimateGasParameters, network: string): Promise<bigint>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts#L43)

Estimate gas for a transaction for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `params` | `EstimateGasParameters` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<`bigint`\>

***

### getChainId()

```ts
function getChainId(network: string): Promise<number>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts#L51)

Get the chain ID for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<`number`\>

***

### getTransaction()

```ts
function getTransaction(hash: `0x${string}`, network: string): Promise<
  | {
}
  | {
}
  | {
}
  | {
}
  | {
}>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts#L18)

Get a transaction by hash for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `hash` | `` `0x${string}` `` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<
  \| \{
\}
  \| \{
\}
  \| \{
\}
  \| \{
\}
  \| \{
\}\>

***

### getTransactionCount()

```ts
function getTransactionCount(address: `0x${string}`, network: string): Promise<number>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts#L34)

Get the transaction count for an address for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `address` | `` `0x${string}` `` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<`number`\>

***

### getTransactionReceipt()

```ts
function getTransactionReceipt(hash: `0x${string}`, network: string): Promise<TransactionReceipt>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/transactions.ts#L26)

Get a transaction receipt by hash for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `hash` | `` `0x${string}` `` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<`TransactionReceipt`\>
