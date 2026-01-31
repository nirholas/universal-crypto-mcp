[**Universal Crypto MCP API Reference v1.0.0**](../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/cli

# defi/protocols/src/cli

## Variables

### BANNER

```ts
const BANNER: string;
```

Defined in: [defi/protocols/src/cli.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/cli.ts#L31)

***

### BANNER\_COMPACT

```ts
const BANNER_COMPACT: string;
```

Defined in: [defi/protocols/src/cli.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/cli.ts#L49)

***

### SPINNER\_FRAMES

```ts
const SPINNER_FRAMES: string[];
```

Defined in: [defi/protocols/src/cli.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/cli.ts#L58)

## Functions

### getGasPrice()

```ts
function getGasPrice(chain: string): Promise<string>;
```

Defined in: [defi/protocols/src/cli.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/cli.ts#L106)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | `string` |

#### Returns

`Promise`\<`string`\>

***

### getMarketOverview()

```ts
function getMarketOverview(): Promise<string>;
```

Defined in: [defi/protocols/src/cli.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/cli.ts#L84)

#### Returns

`Promise`\<`string`\>

***

### getPrice()

```ts
function getPrice(symbol: string): Promise<string>;
```

Defined in: [defi/protocols/src/cli.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/cli.ts#L74)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `symbol` | `string` |

#### Returns

`Promise`\<`string`\>

***

### processCommand()

```ts
function processCommand(input: string): Promise<string>;
```

Defined in: [defi/protocols/src/cli.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/cli.ts#L214)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

`Promise`\<`string`\>

