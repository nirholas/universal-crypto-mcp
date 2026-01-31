[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/server/facilitator

# defi/protocols/src/x402/server/facilitator

## Classes

### X402Facilitator

Defined in: [defi/protocols/src/x402/server/facilitator.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L85)

X402 Payment Facilitator Client

Connects to a payment facilitator service to:
- Verify payments
- Settle payments to recipients
- Query payment history
- Check balances

#### Constructors

##### Constructor

```ts
new X402Facilitator(config: FacilitatorConfig): X402Facilitator;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L89)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`FacilitatorConfig`](/docs/api/defi/protocols/src/x402/server/types.md#facilitatorconfig) |

###### Returns

[`X402Facilitator`](/docs/api/defi/protocols/src/x402/server/facilitator.md#x402facilitator)

#### Methods

##### batchSettle()

```ts
batchSettle(requests: SettlementRequest[]): Promise<SettlementResult[]>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L188)

Batch settle multiple payments
More efficient than individual settlements

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `requests` | [`SettlementRequest`](/docs/api/defi/protocols/src/x402/server/types.md#settlementrequest)[] | Array of settlement requests |

###### Returns

`Promise`\<[`SettlementResult`](/docs/api/defi/protocols/src/x402/server/types.md#settlementresult)[]\>

Array of settlement results

##### deleteWebhook()

```ts
deleteWebhook(webhookId: string): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:520](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L520)

Delete a webhook

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookId` | `string` |

###### Returns

`Promise`\<`void`\>

##### getAllBalances()

```ts
getAllBalances(): Promise<FacilitatorBalance[]>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L297)

Get all balances across chains

###### Returns

`Promise`\<[`FacilitatorBalance`](/docs/api/defi/protocols/src/x402/server/types.md#facilitatorbalance)[]\>

Array of balance info per chain

##### getBalance()

```ts
getBalance(chain?: X402Chain): Promise<FacilitatorBalance>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L287)

Get balance information

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `chain?` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Optional chain filter |

###### Returns

`Promise`\<[`FacilitatorBalance`](/docs/api/defi/protocols/src/x402/server/types.md#facilitatorbalance)\>

Balance information

##### getConfig()

```ts
getConfig(): FacilitatorConfig;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:628](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L628)

Get facilitator configuration/info

###### Returns

[`FacilitatorConfig`](/docs/api/defi/protocols/src/x402/server/types.md#facilitatorconfig)

##### getPaymentStatus()

```ts
getPaymentStatus(txHash: `0x${string}`, chain: X402Chain): Promise<
  | SettlementResult
| null>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L230)

Get payment status by transaction hash

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `` `0x${string}` `` | Transaction hash |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Blockchain network |

###### Returns

`Promise`\<
  \| [`SettlementResult`](/docs/api/defi/protocols/src/x402/server/types.md#settlementresult)
  \| `null`\>

Settlement result or null if not found

##### getWithdrawals()

```ts
getWithdrawals(options: PaymentQueryOptions): Promise<{
  amount: string;
  chain: X402Chain;
  id: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: number;
  toAddress: `0x${string}`;
  token: X402Token;
  txHash: `0x${string}`;
}[]>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:349](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L349)

Get withdrawal history

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | [`PaymentQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#paymentqueryoptions) | Query options |

###### Returns

`Promise`\<\{
  `amount`: `string`;
  `chain`: [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain);
  `id`: `string`;
  `status`: `"pending"` \| `"confirmed"` \| `"failed"`;
  `timestamp`: `number`;
  `toAddress`: `` `0x${string}` ``;
  `token`: [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token);
  `txHash`: `` `0x${string}` ``;
\}[]\>

Array of withdrawal records

##### health()

```ts
health(): Promise<{
  latency: number;
  status: "healthy" | "degraded" | "down";
  version?: string;
}>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:604](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L604)

Check facilitator health

###### Returns

`Promise`\<\{
  `latency`: `number`;
  `status`: `"healthy"` \| `"degraded"` \| `"down"`;
  `version?`: `string`;
\}\>

##### listWebhooks()

```ts
listWebhooks(): Promise<{
  active: boolean;
  events: string[];
  id: string;
  url: string;
}[]>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:501](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L501)

List registered webhooks

###### Returns

`Promise`\<\{
  `active`: `boolean`;
  `events`: `string`[];
  `id`: `string`;
  `url`: `string`;
\}[]\>

##### queryPayments()

```ts
queryPayments(options: PaymentQueryOptions): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L263)

Query payments with filters

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | [`PaymentQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#paymentqueryoptions) | Query options |

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

Array of payment records

###### Example

```typescript
// Get all payments in the last 24 hours
const payments = await facilitator.queryPayments({
  startTime: Date.now() - 24 * 60 * 60 * 1000,
  limit: 100
});

// Get payments for a specific resource
const apiPayments = await facilitator.queryPayments({
  resource: '/api/v1/data',
  status: 'confirmed'
});
```

##### registerWebhook()

```ts
registerWebhook(url: string, events: (
  | "payment.received"
  | "payment.confirmed"
  | "payment.failed"
| "withdrawal.completed")[]): Promise<string>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:457](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L457)

Register a webhook URL for payment notifications

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | Webhook URL |
| `events` | ( \| `"payment.received"` \| `"payment.confirmed"` \| `"payment.failed"` \| `"withdrawal.completed"`)[] | Event types to subscribe to |

###### Returns

`Promise`\<`string`\>

Webhook ID

##### settle()

```ts
settle(request: SettlementRequest): Promise<SettlementResult>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L146)

Settle a payment with the facilitator
This confirms the payment and initiates fund transfer

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | [`SettlementRequest`](/docs/api/defi/protocols/src/x402/server/types.md#settlementrequest) | Settlement request details |

###### Returns

`Promise`\<[`SettlementResult`](/docs/api/defi/protocols/src/x402/server/types.md#settlementresult)\>

Settlement result

###### Example

```typescript
const result = await facilitator.settle({
  txHash: '0xabc123...',
  chain: 'arbitrum',
  amount: '10.00',
  token: 'USDs',
  payer: '0x1234...',
  recipient: '0x5678...',
  resource: '/api/premium/data'
});

if (result.success) {
  console.log(`Settled ${result.netAmount} (fee: ${result.fee})`);
}
```

##### verifyPayment()

```ts
verifyPayment(
   txHash: `0x${string}`, 
   chain: X402Chain, 
   expectedAmount: string, 
   expectedRecipient: `0x${string}`): Promise<{
  actualAmount?: string;
  actualRecipient?: `0x${string}`;
  confirmations?: number;
  error?: string;
  payer?: `0x${string}`;
  valid: boolean;
}>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:401](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L401)

Verify a payment through the facilitator
Alternative to on-chain verification

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `` `0x${string}` `` | Transaction hash |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Blockchain network |
| `expectedAmount` | `string` | Expected payment amount |
| `expectedRecipient` | `` `0x${string}` `` | Expected recipient address |

###### Returns

`Promise`\<\{
  `actualAmount?`: `string`;
  `actualRecipient?`: `` `0x${string}` ``;
  `confirmations?`: `number`;
  `error?`: `string`;
  `payer?`: `` `0x${string}` ``;
  `valid`: `boolean`;
\}\>

Verification result

##### verifyWebhookSignature()

```ts
verifyWebhookSignature(payload: string, signature: string): boolean;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:476](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L476)

Verify webhook signature

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `payload` | `string` | Webhook payload |
| `signature` | `string` | Signature from X-Webhook-Signature header |

###### Returns

`boolean`

True if signature is valid

##### withdraw()

```ts
withdraw(
   amount: string, 
   token: X402Token, 
   chain: X402Chain, 
toAddress: `0x${string}`): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L324)

Request withdrawal of available funds

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `amount` | `string` | Amount to withdraw (or 'all') |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token to withdraw |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Chain to withdraw from |
| `toAddress` | `` `0x${string}` `` | Destination address |

###### Returns

`Promise`\<`` `0x${string}` ``\>

Withdrawal transaction hash

###### Example

```typescript
// Withdraw all available USDs
const txHash = await facilitator.withdraw('all', 'USDs', 'arbitrum', '0x...');

// Withdraw specific amount
const txHash = await facilitator.withdraw('100.00', 'USDs', 'arbitrum', '0x...');
```

## Functions

### createCoinbaseFacilitator()

```ts
function createCoinbaseFacilitator(options: {
  apiKey: string;
  apiSecret?: string;
  webhookSecret?: string;
}): X402Facilitator;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:648](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L648)

Create Coinbase facilitator client

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `apiKey`: `string`; `apiSecret?`: `string`; `webhookSecret?`: `string`; \} |
| `options.apiKey` | `string` |
| `options.apiSecret?` | `string` |
| `options.webhookSecret?` | `string` |

#### Returns

[`X402Facilitator`](/docs/api/defi/protocols/src/x402/server/facilitator.md#x402facilitator)

#### Example

```typescript
const facilitator = createCoinbaseFacilitator({
  apiKey: process.env.COINBASE_API_KEY!,
  apiSecret: process.env.COINBASE_API_SECRET,
});
```

***

### createFacilitatorFromEnv()

```ts
function createFacilitatorFromEnv(): X402Facilitator;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:694](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L694)

Create facilitator from environment variables

Environment variables:
- X402_FACILITATOR_TYPE: 'coinbase' | 'self-hosted'
- X402_FACILITATOR_URL: Facilitator API URL
- X402_FACILITATOR_API_KEY: API key
- X402_FACILITATOR_API_SECRET: API secret (Coinbase)
- X402_FACILITATOR_WEBHOOK_SECRET: Webhook verification secret

#### Returns

[`X402Facilitator`](/docs/api/defi/protocols/src/x402/server/facilitator.md#x402facilitator)

***

### createSelfHostedFacilitator()

```ts
function createSelfHostedFacilitator(options: {
  apiKey?: string;
  url: string;
}): X402Facilitator;
```

Defined in: [defi/protocols/src/x402/server/facilitator.ts:673](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/facilitator.ts#L673)

Create self-hosted facilitator client

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `apiKey?`: `string`; `url`: `string`; \} |
| `options.apiKey?` | `string` |
| `options.url` | `string` |

#### Returns

[`X402Facilitator`](/docs/api/defi/protocols/src/x402/server/facilitator.md#x402facilitator)

#### Example

```typescript
const facilitator = createSelfHostedFacilitator({
  url: 'http://localhost:3001',
  apiKey: process.env.FACILITATOR_API_KEY,
});
```
