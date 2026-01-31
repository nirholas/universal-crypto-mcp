[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/solana/jupiter

# defi/protocols/src/vendors/solana/jupiter

## Interfaces

### JupiterQuoteResponse

Defined in: [defi/protocols/src/vendors/solana/jupiter.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L29)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="contextslot"></a> `contextSlot?` | `number` | [defi/protocols/src/vendors/solana/jupiter.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L55) |
| <a id="inamount"></a> `inAmount` | `string` | [defi/protocols/src/vendors/solana/jupiter.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L31) |
| <a id="inputmint"></a> `inputMint` | `string` | [defi/protocols/src/vendors/solana/jupiter.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L30) |
| <a id="otheramountthreshold"></a> `otherAmountThreshold` | `string` | [defi/protocols/src/vendors/solana/jupiter.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L34) |
| <a id="outamount"></a> `outAmount` | `string` | [defi/protocols/src/vendors/solana/jupiter.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L33) |
| <a id="outputmint"></a> `outputMint` | `string` | [defi/protocols/src/vendors/solana/jupiter.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L32) |
| <a id="platformfee"></a> `platformFee` | \| \{ `amount?`: `string`; `feeBps?`: `number`; \} \| `null` | [defi/protocols/src/vendors/solana/jupiter.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L37) |
| <a id="priceimpactpct"></a> `priceImpactPct` | `string` | [defi/protocols/src/vendors/solana/jupiter.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L41) |
| <a id="routeplan"></a> `routePlan` | \{ `percent`: `number`; `swapInfo`: \{ `ammKey`: `string`; `feeAmount`: `string`; `feeMint`: `string`; `inAmount`: `string`; `inputMint`: `string`; `label?`: `string`; `outAmount`: `string`; `outputMint`: `string`; \}; \}[] | [defi/protocols/src/vendors/solana/jupiter.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L42) |
| <a id="slippagebps"></a> `slippageBps` | `number` | [defi/protocols/src/vendors/solana/jupiter.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L36) |
| <a id="swapmode"></a> `swapMode` | `string` | [defi/protocols/src/vendors/solana/jupiter.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L35) |
| <a id="timetaken"></a> `timeTaken?` | `number` | [defi/protocols/src/vendors/solana/jupiter.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L56) |

## Functions

### buildJupiterSwapTransaction()

```ts
function buildJupiterSwapTransaction(quoteResponse: JupiterQuoteResponse, userPublicKey: string): Promise<string>;
```

Defined in: [defi/protocols/src/vendors/solana/jupiter.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L171)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `quoteResponse` | [`JupiterQuoteResponse`](/docs/api/defi/protocols/src/vendors/solana/jupiter.md#jupiterquoteresponse) |
| `userPublicKey` | `string` |

#### Returns

`Promise`\<`string`\>

***

### executeJupiterSwap()

```ts
function executeJupiterSwap(
   connection: Connection, 
   swapTransaction: string, 
privateKey: Uint8Array): Promise<string>;
```

Defined in: [defi/protocols/src/vendors/solana/jupiter.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L208)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `connection` | `Connection` |
| `swapTransaction` | `string` |
| `privateKey` | `Uint8Array` |

#### Returns

`Promise`\<`string`\>

***

### formatQuoteDetails()

```ts
function formatQuoteDetails(quote: JupiterQuoteResponse): Promise<string>;
```

Defined in: [defi/protocols/src/vendors/solana/jupiter.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L241)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `quote` | [`JupiterQuoteResponse`](/docs/api/defi/protocols/src/vendors/solana/jupiter.md#jupiterquoteresponse) |

#### Returns

`Promise`\<`string`\>

***

### getJupiterQuote()

```ts
function getJupiterQuote(
   inputMint: string, 
   outputMint: string, 
   amount: string, 
slippageBps: number): Promise<JupiterQuoteResponse>;
```

Defined in: [defi/protocols/src/vendors/solana/jupiter.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/solana/jupiter.ts#L131)

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `inputMint` | `string` | `undefined` |
| `outputMint` | `string` | `undefined` |
| `amount` | `string` | `undefined` |
| `slippageBps` | `number` | `50` |

#### Returns

`Promise`\<[`JupiterQuoteResponse`](/docs/api/defi/protocols/src/vendors/solana/jupiter.md#jupiterquoteresponse)\>
