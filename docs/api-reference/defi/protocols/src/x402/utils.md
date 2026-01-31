[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/utils

# defi/protocols/src/x402/utils

## Functions

### calculatePaymentWithFee()

```ts
function calculatePaymentWithFee(amount: string | number, feePercent: number): {
  amount: string;
  fee: string;
  total: string;
};
```

Defined in: [defi/protocols/src/x402/utils/index.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L105)

Calculate payment with optional fee

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` | `undefined` |
| `feePercent` | `number` | `0` |

#### Returns

```ts
{
  amount: string;
  fee: string;
  total: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `amount` | `string` | [defi/protocols/src/x402/utils/index.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L108) |
| `fee` | `string` | [defi/protocols/src/x402/utils/index.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L108) |
| `total` | `string` | [defi/protocols/src/x402/utils/index.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L108) |

***

### createPriceTag()

```ts
function createPriceTag(
   amount: string, 
   token: X402Token, 
   period?: string): string;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L97)

Create a standardized x402 price tag for documentation/display

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `string` | `undefined` |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | `'USDs'` |
| `period?` | `string` | `undefined` |

#### Returns

`string`

***

### estimateGasUSD()

```ts
function estimateGasUSD(
   gasLimit: number, 
   gasPriceGwei: number, 
   ethPriceUSD: number): number;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L204)

Estimate gas cost in USD

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `gasLimit` | `number` |
| `gasPriceGwei` | `number` |
| `ethPriceUSD` | `number` |

#### Returns

`number`

***

### ethToWei()

```ts
function ethToWei(eth: string | number): bigint;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L224)

Format ETH to Wei

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `eth` | `string` \| `number` |

#### Returns

`bigint`

***

### formatAmount()

```ts
function formatAmount(amount: string | number, token: X402Token): string;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L69)

Format payment amount for display with token

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` | `undefined` |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | `'USDs'` |

#### Returns

`string`

***

### fromTokenDecimals()

```ts
function fromTokenDecimals(amount: bigint, decimals: number): string;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L25)

Convert from token decimals to human-readable amounts

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `bigint` | `undefined` |
| `decimals` | `number` | `18` |

#### Returns

`string`

***

### generatePaymentReference()

```ts
function generatePaymentReference(): string;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L123)

Generate a unique payment reference/nonce

#### Returns

`string`

***

### getExplorerUrl()

```ts
function getExplorerUrl(
   hash: string, 
   chain: X402Chain, 
   type: "address" | "token" | "tx"): string;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L145)

Get chain explorer URL for address or transaction

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `hash` | `string` | `undefined` |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | `undefined` |
| `type` | `"address"` \| `"token"` \| `"tx"` | `'tx'` |

#### Returns

`string`

***

### getUSDsAddress()

```ts
function getUSDsAddress(chain: X402Chain): `0x${string}` | null;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L192)

Get USDs token address for a chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |

#### Returns

`` `0x${string}` `` \| `null`

***

### isPaidEndpoint()

```ts
function isPaidEndpoint(url: string): boolean;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L81)

Check if a URL is likely to require payment (heuristic)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`boolean`

***

### normalizeChain()

```ts
function normalizeChain(chain: string): 
  | X402Chain
  | null;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L166)

Validate and normalize chain name

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | `string` |

#### Returns

  \| [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain)
  \| `null`

***

### parseAmount()

```ts
function parseAmount(input: string): {
  amount: number;
  token?: X402Token;
};
```

Defined in: [defi/protocols/src/x402/utils/index.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L44)

Parse amount string with support for various formats
Supports: "10", "10.5", "10 USDs", "$10.50", "10.5 USDC"

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

```ts
{
  amount: number;
  token?: X402Token;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `amount` | `number` | [defi/protocols/src/x402/utils/index.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L44) |
| `token?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | [defi/protocols/src/x402/utils/index.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L44) |

***

### parsePaymentReference()

```ts
function parsePaymentReference(ref: string): 
  | {
  random: string;
  timestamp: number;
}
  | null;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L132)

Parse payment reference to extract timestamp

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `ref` | `string` |

#### Returns

  \| \{
  `random`: `string`;
  `timestamp`: `number`;
\}
  \| `null`

***

### retry()

```ts
function retry<T>(fn: () => Promise<T>, options: {
  baseDelay?: number;
  maxDelay?: number;
  maxRetries?: number;
}): Promise<T>;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L238)

Retry an async operation with exponential backoff

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | () => `Promise`\<`T`\> |
| `options` | \{ `baseDelay?`: `number`; `maxDelay?`: `number`; `maxRetries?`: `number`; \} |
| `options.baseDelay?` | `number` |
| `options.maxDelay?` | `number` |
| `options.maxRetries?` | `number` |

#### Returns

`Promise`\<`T`\>

***

### sleep()

```ts
function sleep(ms: number): Promise<void>;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L231)

Sleep utility for async operations

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`Promise`\<`void`\>

***

### toTokenDecimals()

```ts
function toTokenDecimals(amount: string | number, decimals: number): bigint;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L17)

Convert between token decimals and human-readable amounts

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` | `undefined` |
| `decimals` | `number` | `18` |

#### Returns

`bigint`

***

### weiToEth()

```ts
function weiToEth(wei: string | number | bigint): string;
```

Defined in: [defi/protocols/src/x402/utils/index.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/utils/index.ts#L216)

Format Wei to ETH string

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `wei` | `string` \| `number` \| `bigint` |

#### Returns

`string`

## References

### createPaymentHeader

Re-exports [createPaymentHeader](/docs/api/defi/protocols/src/x402/cli/utils/payment.md#createpaymentheader)

***

### deriveAddress

Re-exports [deriveAddress](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#deriveaddress)

***

### estimateTotalCost

Re-exports [estimateTotalCost](/docs/api/defi/protocols/src/x402/cli/utils/payment.md#estimatetotalcost)

***

### exportWallet

Re-exports [exportWallet](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#exportwallet)

***

### formatBytes

Re-exports [formatBytes](/docs/api/defi/protocols/src/x402/cli/utils/format.md#formatbytes)

***

### formatCrypto

Re-exports [formatCrypto](/docs/api/defi/protocols/src/x402/cli/utils/format.md#formatcrypto)

***

### formatDate

Re-exports [formatDate](/docs/api/defi/protocols/src/x402/cli/utils/format.md#formatdate)

***

### formatDuration

Re-exports [formatDuration](/docs/api/defi/protocols/src/x402/cli/utils/format.md#formatduration)

***

### formatJSON

Re-exports [formatJSON](/docs/api/defi/protocols/src/x402/cli/utils/format.md#formatjson)

***

### formatPayment

Re-exports [formatPayment](/docs/api/defi/protocols/src/x402/cli/utils/payment.md#formatpayment)

***

### formatTxLink

Re-exports [formatTxLink](/docs/api/defi/protocols/src/x402/cli/utils/format.md#formattxlink)

***

### formatUSD

Re-exports [formatUSD](/docs/api/defi/protocols/src/x402/cli/utils/format.md#formatusd)

***

### generateWallet

Re-exports [generateWallet](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#generatewallet)

***

### generateWalletWithMnemonic

Re-exports [generateWalletWithMnemonic](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#generatewalletwithmnemonic)

***

### importWallet

Re-exports [importWallet](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#importwallet)

***

### isValidAddress

Re-exports [isValidAddress](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#isvalidaddress)

***

### isValidPrivateKey

Re-exports [isValidPrivateKey](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#isvalidprivatekey)

***

### maskPrivateKey

Re-exports [maskPrivateKey](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#maskprivatekey)

***

### parsePayment

Re-exports [parsePayment](/docs/api/defi/protocols/src/x402/cli/utils/payment.md#parsepayment)

***

### progressBar

Re-exports [progressBar](/docs/api/defi/protocols/src/x402/cli/utils/format.md#progressbar)

***

### shortenAddress

Re-exports [shortenAddress](/docs/api/defi/protocols/src/x402/cli/utils/format.md#shortenaddress)

***

### validatePaymentRequest

Re-exports [validatePaymentRequest](/docs/api/defi/protocols/src/x402/cli/utils/payment.md#validatepaymentrequest)
