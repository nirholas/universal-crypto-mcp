[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/limits

# defi/protocols/src/x402/limits

## Interfaces

### PaymentLimits

Defined in: [defi/protocols/src/x402/limits.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L40)

Current payment limits

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="largepaymentwarning"></a> `largePaymentWarning` | `number` | [defi/protocols/src/x402/limits.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L43) |
| <a id="maxdailypayment"></a> `maxDailyPayment` | `number` | [defi/protocols/src/x402/limits.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L42) |
| <a id="maxsinglepayment"></a> `maxSinglePayment` | `number` | [defi/protocols/src/x402/limits.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L41) |

***

### PaymentValidationResult

Defined in: [defi/protocols/src/x402/limits.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L209)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="allowed"></a> `allowed` | `boolean` | [defi/protocols/src/x402/limits.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L210) |
| <a id="errors"></a> `errors` | `string`[] | [defi/protocols/src/x402/limits.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L213) |
| <a id="requiresapproval"></a> `requiresApproval` | `boolean` | [defi/protocols/src/x402/limits.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L211) |
| <a id="warnings"></a> `warnings` | `string`[] | [defi/protocols/src/x402/limits.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L212) |

## Variables

### DEFAULT\_LIMITS

```ts
const DEFAULT_LIMITS: {
  ABSOLUTE_MAX_DAILY: 1000;
  ABSOLUTE_MAX_SINGLE: 100;
  LARGE_PAYMENT_WARNING: 0.5;
  MAX_DAILY_PAYMENT: 10;
  MAX_SINGLE_PAYMENT: 1;
};
```

Defined in: [defi/protocols/src/x402/limits.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L24)

Default payment limits (in USD)
These are intentionally conservative

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="absolute_max_daily"></a> `ABSOLUTE_MAX_DAILY` | `1000` | `1000.0` | Absolute maximum daily spending (hard cap) | [defi/protocols/src/x402/limits.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L34) |
| <a id="absolute_max_single"></a> `ABSOLUTE_MAX_SINGLE` | `100` | `100.0` | Absolute maximum single payment (hard cap) | [defi/protocols/src/x402/limits.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L32) |
| <a id="large_payment_warning"></a> `LARGE_PAYMENT_WARNING` | `0.5` | `0.5` | Warning threshold for large payments | [defi/protocols/src/x402/limits.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L30) |
| <a id="max_daily_payment"></a> `MAX_DAILY_PAYMENT` | `10` | `10.0` | Maximum daily spending (default $10.00) | [defi/protocols/src/x402/limits.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L28) |
| <a id="max_single_payment"></a> `MAX_SINGLE_PAYMENT` | `1` | `1.0` | Maximum single payment (default $1.00) | [defi/protocols/src/x402/limits.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L26) |

## Functions

### addToPaymentHistory()

```ts
function addToPaymentHistory(entry: Omit<PaymentHistoryEntry, "id">): string;
```

Defined in: [defi/protocols/src/x402/limits.ts:482](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L482)

Add a payment to history

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `entry` | `Omit`\<`PaymentHistoryEntry`, `"id"`\> |

#### Returns

`string`

***

### approveService()

```ts
function approveService(
   domain: string, 
   name?: string, 
   maxPayment?: number): ApprovedService;
```

Defined in: [defi/protocols/src/x402/limits.ts:389](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L389)

Approve a service

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `domain` | `string` |
| `name?` | `string` |
| `maxPayment?` | `number` |

#### Returns

`ApprovedService`

***

### getApprovedServices()

```ts
function getApprovedServices(): ApprovedService[];
```

Defined in: [defi/protocols/src/x402/limits.ts:432](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L432)

Get all approved services

#### Returns

`ApprovedService`[]

***

### getDailySpending()

```ts
function getDailySpending(): {
  count: number;
  date: string;
  remaining: number;
  total: number;
};
```

Defined in: [defi/protocols/src/x402/limits.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L169)

Get current daily spending

#### Returns

```ts
{
  count: number;
  date: string;
  remaining: number;
  total: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `count` | `number` | [defi/protocols/src/x402/limits.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L169) |
| `date` | `string` | [defi/protocols/src/x402/limits.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L169) |
| `remaining` | `number` | [defi/protocols/src/x402/limits.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L169) |
| `total` | `number` | [defi/protocols/src/x402/limits.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L169) |

***

### getPaymentHistory()

```ts
function getPaymentHistory(options?: {
  limit?: number;
  service?: string;
  since?: Date;
  status?: "pending" | "failed" | "completed";
}): PaymentHistoryEntry[];
```

Defined in: [defi/protocols/src/x402/limits.ts:522](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L522)

Get payment history

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options?` | \{ `limit?`: `number`; `service?`: `string`; `since?`: `Date`; `status?`: `"pending"` \| `"failed"` \| `"completed"`; \} |
| `options.limit?` | `number` |
| `options.service?` | `string` |
| `options.since?` | `Date` |
| `options.status?` | `"pending"` \| `"failed"` \| `"completed"` |

#### Returns

`PaymentHistoryEntry`[]

***

### getPaymentLimits()

```ts
function getPaymentLimits(): PaymentLimits;
```

Defined in: [defi/protocols/src/x402/limits.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L78)

Get current payment limits

#### Returns

[`PaymentLimits`](/docs/api/defi/protocols/src/x402/limits.md#paymentlimits)

***

### getPaymentStats()

```ts
function getPaymentStats(since?: Date): {
  avgAmount: number;
  byService: Record<string, {
     count: number;
     total: number;
  }>;
  byStatus: Record<string, number>;
  count: number;
  total: number;
};
```

Defined in: [defi/protocols/src/x402/limits.ts:546](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L546)

Get payment statistics

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `since?` | `Date` |

#### Returns

```ts
{
  avgAmount: number;
  byService: Record<string, {
     count: number;
     total: number;
  }>;
  byStatus: Record<string, number>;
  count: number;
  total: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `avgAmount` | `number` | [defi/protocols/src/x402/limits.ts:549](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L549) |
| `byService` | `Record`\<`string`, \{ `count`: `number`; `total`: `number`; \}\> | [defi/protocols/src/x402/limits.ts:550](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L550) |
| `byStatus` | `Record`\<`string`, `number`\> | [defi/protocols/src/x402/limits.ts:551](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L551) |
| `count` | `number` | [defi/protocols/src/x402/limits.ts:548](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L548) |
| `total` | `number` | [defi/protocols/src/x402/limits.ts:547](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L547) |

***

### getTodayPayments()

```ts
function getTodayPayments(): {
  amount: number;
  recipient: string;
  service: string;
  timestamp: Date;
}[];
```

Defined in: [defi/protocols/src/x402/limits.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L200)

Get payment history for today

#### Returns

\{
  `amount`: `number`;
  `recipient`: `string`;
  `service`: `string`;
  `timestamp`: `Date`;
\}[]

***

### initializeAllowlist()

```ts
function initializeAllowlist(): void;
```

Defined in: [defi/protocols/src/x402/limits.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L324)

Initialize service allowlist from environment

#### Returns

`void`

***

### isServiceApproved()

```ts
function isServiceApproved(serviceUrl: string): {
  allowUnknown: boolean;
  approved: boolean;
  service?: ApprovedService;
};
```

Defined in: [defi/protocols/src/x402/limits.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L357)

Check if a service is approved

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `serviceUrl` | `string` |

#### Returns

```ts
{
  allowUnknown: boolean;
  approved: boolean;
  service?: ApprovedService;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `allowUnknown` | `boolean` | [defi/protocols/src/x402/limits.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L359) |
| `approved` | `boolean` | [defi/protocols/src/x402/limits.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L359) |
| `service?` | `ApprovedService` | [defi/protocols/src/x402/limits.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L359) |

***

### isStrictAllowlistMode()

```ts
function isStrictAllowlistMode(): boolean;
```

Defined in: [defi/protocols/src/x402/limits.ts:455](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L455)

Check if in strict allowlist mode

#### Returns

`boolean`

***

### loadLimitsFromEnv()

```ts
function loadLimitsFromEnv(): PaymentLimits;
```

Defined in: [defi/protocols/src/x402/limits.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L55)

Load limits from environment variables

#### Returns

[`PaymentLimits`](/docs/api/defi/protocols/src/x402/limits.md#paymentlimits)

***

### recordPayment()

```ts
function recordPayment(
   amount: number, 
   recipient: string, 
   service: string): void;
```

Defined in: [defi/protocols/src/x402/limits.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L182)

Record a payment for daily tracking

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `number` |
| `recipient` | `string` |
| `service` | `string` |

#### Returns

`void`

***

### removeService()

```ts
function removeService(domain: string): boolean;
```

Defined in: [defi/protocols/src/x402/limits.ts:418](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L418)

Remove a service from allowlist

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `domain` | `string` |

#### Returns

`boolean`

***

### setPaymentLimits()

```ts
function setPaymentLimits(limits: Partial<PaymentLimits>): PaymentLimits;
```

Defined in: [defi/protocols/src/x402/limits.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L87)

Set payment limits programmatically

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `limits` | `Partial`\<[`PaymentLimits`](/docs/api/defi/protocols/src/x402/limits.md#paymentlimits)\> | New limits to set |

#### Returns

[`PaymentLimits`](/docs/api/defi/protocols/src/x402/limits.md#paymentlimits)

Updated limits

***

### setStrictAllowlistMode()

```ts
function setStrictAllowlistMode(strict: boolean): void;
```

Defined in: [defi/protocols/src/x402/limits.ts:439](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L439)

Set strict allowlist mode

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `strict` | `boolean` |

#### Returns

`void`

***

### updatePaymentStatus()

```ts
function updatePaymentStatus(
   id: string, 
   status: "pending" | "failed" | "completed", 
   txHash?: string): boolean;
```

Defined in: [defi/protocols/src/x402/limits.ts:503](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L503)

Update payment status

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |
| `status` | `"pending"` \| `"failed"` \| `"completed"` |
| `txHash?` | `string` |

#### Returns

`boolean`

***

### validatePaymentLimits()

```ts
function validatePaymentLimits(
   amount: number, 
   recipient: string, 
   service: string): PaymentValidationResult;
```

Defined in: [defi/protocols/src/x402/limits.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/limits.ts#L219)

Validate a payment against limits

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `number` |
| `recipient` | `string` |
| `service` | `string` |

#### Returns

[`PaymentValidationResult`](/docs/api/defi/protocols/src/x402/limits.md#paymentvalidationresult)
