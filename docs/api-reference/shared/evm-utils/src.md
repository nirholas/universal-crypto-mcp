[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / shared/evm-utils/src

# shared/evm-utils/src

## Interfaces

### ClientOptions

Defined in: [shared/evm-utils/src/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L27)

#### Extended by

- [`WalletClientOptions`](/docs/api/shared/evm-utils/src.md#walletclientoptions)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="chain"></a> `chain` | `Chain` | [shared/evm-utils/src/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L28) |
| <a id="rpcurl"></a> `rpcUrl?` | `string` | [shared/evm-utils/src/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L29) |

***

### TransactionConfig

Defined in: [shared/evm-utils/src/index.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L91)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="data"></a> `data?` | `` `0x${string}` `` | [shared/evm-utils/src/index.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L94) |
| <a id="gaslimit"></a> `gasLimit?` | `bigint` | [shared/evm-utils/src/index.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L95) |
| <a id="to"></a> `to` | `` `0x${string}` `` | [shared/evm-utils/src/index.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L92) |
| <a id="value"></a> `value?` | `bigint` | [shared/evm-utils/src/index.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L93) |

***

### WalletClientOptions

Defined in: [shared/evm-utils/src/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L32)

#### Extends

- [`ClientOptions`](/docs/api/shared/evm-utils/src.md#clientoptions)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="chain-1"></a> `chain` | `Chain` | [`ClientOptions`](/docs/api/shared/evm-utils/src.md#clientoptions).[`chain`](/docs/api/shared/evm-utils/src.md#chain) | [shared/evm-utils/src/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L28) |
| <a id="privatekey"></a> `privateKey` | `` `0x${string}` `` | - | [shared/evm-utils/src/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L33) |
| <a id="rpcurl-1"></a> `rpcUrl?` | `string` | [`ClientOptions`](/docs/api/shared/evm-utils/src.md#clientoptions).[`rpcUrl`](/docs/api/shared/evm-utils/src.md#rpcurl) | [shared/evm-utils/src/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L29) |

## Variables

### PACKAGE\_NAME

```ts
const PACKAGE_NAME: "@universal-crypto-mcp/evm-utils" = '@universal-crypto-mcp/evm-utils';
```

Defined in: [shared/evm-utils/src/index.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L157)

***

### VERSION

```ts
const VERSION: "1.0.0" = '1.0.0';
```

Defined in: [shared/evm-utils/src/index.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L156)

## Functions

### createReadClient()

```ts
function createReadClient(options: ClientOptions): {
};
```

Defined in: [shared/evm-utils/src/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L39)

Creates a public client for reading blockchain state

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`ClientOptions`](/docs/api/shared/evm-utils/src.md#clientoptions) |

#### Returns

```ts
{
}
```

***

### createSignerClient()

```ts
function createSignerClient(options: WalletClientOptions): {
};
```

Defined in: [shared/evm-utils/src/index.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L50)

Creates a wallet client for signing transactions

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`WalletClientOptions`](/docs/api/shared/evm-utils/src.md#walletclientoptions) |

#### Returns

```ts
{
}
```

***

### estimateGas()

```ts
function estimateGas(client: {
}, config: TransactionConfig & {
  from: `0x${string}`;
}): Promise<bigint>;
```

Defined in: [shared/evm-utils/src/index.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L101)

Estimates gas for a transaction

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | \{ \} |
| `config` | [`TransactionConfig`](/docs/api/shared/evm-utils/src.md#transactionconfig) & \{ `from`: `` `0x${string}` ``; \} |

#### Returns

`Promise`\<`bigint`\>

***

### formatNativeBalance()

```ts
function formatNativeBalance(balance: bigint, decimals: number): string;
```

Defined in: [shared/evm-utils/src/index.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L80)

Formats native balance to human-readable string

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `balance` | `bigint` | `undefined` |
| `decimals` | `number` | `18` |

#### Returns

`string`

***

### getGasPrice()

```ts
function getGasPrice(client: {
}): Promise<bigint>;
```

Defined in: [shared/evm-utils/src/index.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L116)

Gets current gas price

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | \{ \} |

#### Returns

`Promise`\<`bigint`\>

***

### getNativeBalance()

```ts
function getNativeBalance(client: {
}, address: `0x${string}`): Promise<bigint>;
```

Defined in: [shared/evm-utils/src/index.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L70)

Gets the native balance of an address

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | \{ \} |
| `address` | `` `0x${string}` `` |

#### Returns

`Promise`\<`bigint`\>

***

### readContract()

```ts
function readContract<T>(client: {
}, config: {
  abi: readonly unknown[];
  address: `0x${string}`;
  args?: readonly unknown[];
  functionName: string;
}): Promise<T>;
```

Defined in: [shared/evm-utils/src/index.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/evm-utils/src/index.ts#L127)

Reads a contract function

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | \{ \} |
| `config` | \{ `abi`: readonly `unknown`[]; `address`: `` `0x${string}` ``; `args?`: readonly `unknown`[]; `functionName`: `string`; \} |
| `config.abi` | readonly `unknown`[] |
| `config.address` | `` `0x${string}` `` |
| `config.args?` | readonly `unknown`[] |
| `config.functionName` | `string` |

#### Returns

`Promise`\<`T`\>
