[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/ucai/payment

# defi/protocols/src/x402/ucai/payment

## Classes

### UCAIPaymentService

Defined in: [defi/protocols/src/x402/ucai/payment.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L225)

UCAI Payment Service

Handles all x402 payments for UCAI premium features.

#### Constructors

##### Constructor

```ts
new UCAIPaymentService(options?: {
  network?: "arbitrum" | "arbitrum-sepolia";
  privateKey?: `0x${string}`;
}): UCAIPaymentService;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L232)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options?` | \{ `network?`: `"arbitrum"` \| `"arbitrum-sepolia"`; `privateKey?`: `` `0x${string}` ``; \} |
| `options.network?` | `"arbitrum"` \| `"arbitrum-sepolia"` |
| `options.privateKey?` | `` `0x${string}` `` |

###### Returns

[`UCAIPaymentService`](/docs/api/defi/protocols/src/x402/ucai/payment.md#ucaipaymentservice)

#### Methods

##### closePaymentChannel()

```ts
closePaymentChannel(): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:667](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L667)

Close payment channel and withdraw remaining balance

###### Returns

`Promise`\<`boolean`\>

##### getBalance()

```ts
getBalance(): Promise<BalanceInfo>;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:464](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L464)

Get current balance

###### Returns

`Promise`\<`BalanceInfo`\>

##### getSubscription()

```ts
getSubscription(): Promise<
  | UCAPSubscription
| null>;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:521](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L521)

Get subscription status

###### Returns

`Promise`\<
  \| [`UCAPSubscription`](/docs/api/defi/protocols/src/x402/ucai/types.md#ucapsubscription)
  \| `null`\>

##### openPaymentChannel()

```ts
openPaymentChannel(amount: string, durationDays: number): Promise<{
  channelId?: `0x${string}`;
  error?: string;
  success: boolean;
}>;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:617](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L617)

Open a payment channel for efficient micropayments

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `string` | `undefined` |
| `durationDays` | `number` | `30` |

###### Returns

`Promise`\<\{
  `channelId?`: `` `0x${string}` ``;
  `error?`: `string`;
  `success`: `boolean`;
\}\>

##### processPayment()

```ts
processPayment(toolId: string, amountUsd: string): Promise<PaymentResult>;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L276)

Process payment for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `amountUsd` | `string` |

###### Returns

`Promise`\<`PaymentResult`\>

##### refundPayment()

```ts
refundPayment(paymentId: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:396](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L396)

Refund a payment (in case of service failure)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentId` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### subscribe()

```ts
subscribe(tier: SubscriptionTier, months: number): Promise<{
  error?: string;
  subscriptionId?: string;
  success: boolean;
}>;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:562](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L562)

Subscribe to a tier

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tier` | [`SubscriptionTier`](/docs/api/defi/protocols/src/x402/ucai/types.md#subscriptiontier) | `undefined` |
| `months` | `number` | `1` |

###### Returns

`Promise`\<\{
  `error?`: `string`;
  `subscriptionId?`: `string`;
  `success`: `boolean`;
\}\>

## Functions

### getUCAIPaymentService()

```ts
function getUCAIPaymentService(): UCAIPaymentService;
```

Defined in: [defi/protocols/src/x402/ucai/payment.ts:843](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/payment.ts#L843)

Get or create UCAI payment service

#### Returns

[`UCAIPaymentService`](/docs/api/defi/protocols/src/x402/ucai/payment.md#ucaipaymentservice)

## References

### default

Renames and re-exports [UCAIPaymentService](/docs/api/defi/protocols/src/x402/ucai/payment.md#ucaipaymentservice)
