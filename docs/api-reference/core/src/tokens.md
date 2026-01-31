[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / core/src/tokens

# core/src/tokens

## Interfaces

### TokenInfo

Defined in: [core/src/tokens.ts:9](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L9)

Token configurations for Universal Crypto MCP

#### Extended by

- [`TokenWithChain`](/docs/api/core/src/tokens.md#tokenwithchain)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address"></a> `address` | `` `0x${string}` `` | [core/src/tokens.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L10) |
| <a id="decimals"></a> `decimals` | `number` | [core/src/tokens.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L12) |
| <a id="name"></a> `name` | `string` | [core/src/tokens.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L13) |
| <a id="symbol"></a> `symbol` | `string` | [core/src/tokens.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L11) |

***

### TokenWithChain

Defined in: [core/src/tokens.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L16)

Token configurations for Universal Crypto MCP

#### Extends

- [`TokenInfo`](/docs/api/core/src/tokens.md#tokeninfo)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="address-1"></a> `address` | `` `0x${string}` `` | [`TokenInfo`](/docs/api/core/src/tokens.md#tokeninfo).[`address`](/docs/api/core/src/tokens.md#address) | [core/src/tokens.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L10) |
| <a id="chain"></a> `chain` | `string` | - | [core/src/tokens.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L17) |
| <a id="decimals-1"></a> `decimals` | `number` | [`TokenInfo`](/docs/api/core/src/tokens.md#tokeninfo).[`decimals`](/docs/api/core/src/tokens.md#decimals) | [core/src/tokens.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L12) |
| <a id="name-1"></a> `name` | `string` | [`TokenInfo`](/docs/api/core/src/tokens.md#tokeninfo).[`name`](/docs/api/core/src/tokens.md#name) | [core/src/tokens.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L13) |
| <a id="symbol-1"></a> `symbol` | `string` | [`TokenInfo`](/docs/api/core/src/tokens.md#tokeninfo).[`symbol`](/docs/api/core/src/tokens.md#symbol) | [core/src/tokens.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L11) |

## Variables

### USDC

```ts
const USDC: Record<string, TokenInfo>;
```

Defined in: [core/src/tokens.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L24)

***

### USDs

```ts
const USDs: TokenInfo;
```

Defined in: [core/src/tokens.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L147)

***

### USDT

```ts
const USDT: Record<string, TokenInfo>;
```

Defined in: [core/src/tokens.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L73)

***

### WETH

```ts
const WETH: Record<string, TokenInfo>;
```

Defined in: [core/src/tokens.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L110)

## Functions

### findTokenByAddress()

```ts
function findTokenByAddress(address: string): 
  | TokenWithChain
  | undefined;
```

Defined in: [core/src/tokens.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L197)

Finds a token by address across all chains

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

  \| [`TokenWithChain`](/docs/api/core/src/tokens.md#tokenwithchain)
  \| `undefined`

***

### getTokenForChain()

```ts
function getTokenForChain(chain: string, symbol: string): TokenInfo | undefined;
```

Defined in: [core/src/tokens.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L161)

Gets a token for a specific chain

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `chain` | `string` | `undefined` |
| `symbol` | `string` | `"USDC"` |

#### Returns

[`TokenInfo`](/docs/api/core/src/tokens.md#tokeninfo) \| `undefined`

***

### getTokensForChain()

```ts
function getTokensForChain(chain: string): TokenInfo[];
```

Defined in: [core/src/tokens.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L183)

Gets all supported tokens for a chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | `string` |

#### Returns

[`TokenInfo`](/docs/api/core/src/tokens.md#tokeninfo)[]

***

### isStablecoin()

```ts
function isStablecoin(symbol: string): boolean;
```

Defined in: [core/src/tokens.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/tokens.ts#L226)

Checks if a token is a stablecoin

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `symbol` | `string` |

#### Returns

`boolean`

