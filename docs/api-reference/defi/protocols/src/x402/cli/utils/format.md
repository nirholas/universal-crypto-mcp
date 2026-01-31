[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/cli/utils/format

# defi/protocols/src/x402/cli/utils/format

## Functions

### formatBytes()

```ts
function formatBytes(bytes: number): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L149)

Format file size

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `bytes` | `number` |

#### Returns

`string`

***

### formatCrypto()

```ts
function formatCrypto(amount: string | number, symbol: string): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L40)

Format cryptocurrency amount with symbol

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `string` \| `number` |
| `symbol` | `string` |

#### Returns

`string`

***

### formatDate()

```ts
function formatDate(date: string | number | Date): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L72)

Format date for display

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `date` | `string` \| `number` \| `Date` |

#### Returns

`string`

***

### formatDuration()

```ts
function formatDuration(ms: number): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L165)

Format duration in human-readable format

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`string`

***

### formatJSON()

```ts
function formatJSON(obj: unknown): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L120)

Format JSON with syntax highlighting

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `obj` | `unknown` |

#### Returns

`string`

***

### formatTxLink()

```ts
function formatTxLink(hash: string, chain: X402Chain): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L103)

Format transaction link

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hash` | `string` |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |

#### Returns

`string`

***

### formatUSD()

```ts
function formatUSD(amount: string | number): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L14)

Format USD amount with proper styling

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `string` \| `number` |

#### Returns

`string`

***

### progressBar()

```ts
function progressBar(
   current: number, 
   total: number, 
   width: number): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L135)

Create a progress bar

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `current` | `number` | `undefined` |
| `total` | `number` | `undefined` |
| `width` | `number` | `20` |

#### Returns

`string`

***

### shortenAddress()

```ts
function shortenAddress(address: string): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/format.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/format.ts#L62)

Shorten address for display

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`string`
