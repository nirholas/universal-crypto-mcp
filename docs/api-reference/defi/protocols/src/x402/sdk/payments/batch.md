[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/payments/batch

# defi/protocols/src/x402/sdk/payments/batch

## Classes

### BatchPayment

Defined in: [defi/protocols/src/x402/sdk/payments/batch.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/batch.ts#L40)

Batch payment handler for multiple transfers

#### Constructors

##### Constructor

```ts
new BatchPayment(
   publicClient: {
}, 
   walletClient: 
  | {
}
  | undefined, 
   chain: X402Chain): BatchPayment;
```

Defined in: [defi/protocols/src/x402/sdk/payments/batch.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/batch.ts#L41)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `publicClient` | \{ \} |
| `walletClient` | \| \{ \} \| `undefined` |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |

###### Returns

[`BatchPayment`](/docs/api/defi/protocols/src/x402/sdk/payments/batch.md#batchpayment)

#### Methods

##### createMulticallData()

```ts
createMulticallData(items: BatchPaymentItem[], token: X402Token): {
  data: `0x${string}`;
  to: `0x${string}`;
}[];
```

Defined in: [defi/protocols/src/x402/sdk/payments/batch.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/batch.ts#L237)

Create batch payment data for multicall

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `items` | [`BatchPaymentItem`](/docs/api/defi/protocols/src/x402/sdk/types.md#batchpaymentitem)[] |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

\{
  `data`: `` `0x${string}` ``;
  `to`: `` `0x${string}` ``;
\}[]

##### estimateGas()

```ts
estimateGas(items: BatchPaymentItem[], token: X402Token): Promise<{
  formattedGas: string;
  gasEstimate: bigint;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/batch.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/batch.ts#L200)

Estimate gas for batch payment

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `items` | [`BatchPaymentItem`](/docs/api/defi/protocols/src/x402/sdk/types.md#batchpaymentitem)[] |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<\{
  `formattedGas`: `string`;
  `gasEstimate`: `bigint`;
\}\>

##### executeMultiple()

```ts
executeMultiple(
   items: BatchPaymentItem[], 
   token: X402Token, 
   options: {
  continueOnError?: boolean;
}): Promise<BatchPaymentResult>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/batch.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/batch.ts#L51)

Execute multiple payments in separate transactions
Each payment is independent - failures don't affect others

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `items` | [`BatchPaymentItem`](/docs/api/defi/protocols/src/x402/sdk/types.md#batchpaymentitem)[] |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |
| `options` | \{ `continueOnError?`: `boolean`; \} |
| `options.continueOnError?` | `boolean` |

###### Returns

`Promise`\<[`BatchPaymentResult`](/docs/api/defi/protocols/src/x402/sdk/types.md#batchpaymentresult)\>

##### executeViaSplitter()

```ts
executeViaSplitter(
   splitterAddress: `0x${string}`, 
   toolNames: string[], 
   amounts: string[], 
token: X402Token): Promise<PaymentTransaction>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/batch.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/batch.ts#L124)

Execute batch payments through a revenue splitter contract
More gas efficient for multiple payments

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `splitterAddress` | `` `0x${string}` `` |
| `toolNames` | `string`[] |
| `amounts` | `string`[] |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<[`PaymentTransaction`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymenttransaction)\>
