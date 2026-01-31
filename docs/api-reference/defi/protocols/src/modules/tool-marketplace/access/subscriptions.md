[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/access/subscriptions

# defi/protocols/src/modules/tool-marketplace/access/subscriptions

## Classes

### SubscriptionManager

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L42)

Subscription Manager Service

#### Constructors

##### Constructor

```ts
new SubscriptionManager(storage: AccessStorageAdapter, paymentProcessor?: PaymentProcessor): SubscriptionManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L46)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `storage` | [`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter) | `defaultStorage` |
| `paymentProcessor?` | [`PaymentProcessor`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/subscriptions.md#paymentprocessor) | `undefined` |

###### Returns

[`SubscriptionManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/subscriptions.md#subscriptionmanager)

#### Methods

##### cancelSubscription()

```ts
cancelSubscription(
   subscriptionId: string, 
   canceledBy: `0x${string}`, 
   reason?: string, 
immediate?: boolean): Promise<Subscription>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L253)

Cancel subscription

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `subscriptionId` | `string` | `undefined` |
| `canceledBy` | `` `0x${string}` `` | `undefined` |
| `reason?` | `string` | `undefined` |
| `immediate?` | `boolean` | `false` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)\>

##### changeTier()

```ts
changeTier(input: ChangeSubscriptionInput): Promise<Subscription>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L172)

Upgrade or downgrade subscription tier

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`ChangeSubscriptionInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#changesubscriptioninput) |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)\>

##### createSubscription()

```ts
createSubscription(input: CreateSubscriptionInput): Promise<Subscription>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L64)

Create a new subscription

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`CreateSubscriptionInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#createsubscriptioninput) |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)\>

##### getSubscription()

```ts
getSubscription(subscriptionId: string): Promise<
  | Subscription
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L141)

Get subscription by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

###### Returns

`Promise`\<
  \| [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)
  \| `null`\>

##### getSubscriptionByUserAndTool()

```ts
getSubscriptionByUserAndTool(userId: `0x${string}`, toolId: string): Promise<
  | Subscription
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L148)

Get subscription by user and tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |
| `toolId` | `string` |

###### Returns

`Promise`\<
  \| [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)
  \| `null`\>

##### getSubscriptionStatus()

```ts
getSubscriptionStatus(subscriptionId: string): Promise<
  | {
  callsRemaining: number;
  daysRemaining: number;
  estimatedRenewalCost?: string;
  renewalDate?: number;
  subscription: Subscription;
}
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:553](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L553)

Get subscription status summary

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

###### Returns

`Promise`\<
  \| \{
  `callsRemaining`: `number`;
  `daysRemaining`: `number`;
  `estimatedRenewalCost?`: `string`;
  `renewalDate?`: `number`;
  `subscription`: [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription);
\}
  \| `null`\>

##### getToolSubscriptions()

```ts
getToolSubscriptions(toolId: string): Promise<Subscription[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L165)

Get all subscriptions for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)[]\>

##### getUserSubscriptions()

```ts
getUserSubscriptions(userId: `0x${string}`): Promise<Subscription[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L158)

Get all subscriptions for a user

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)[]\>

##### pauseSubscription()

```ts
pauseSubscription(subscriptionId: string, pausedBy: `0x${string}`): Promise<Subscription>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L309)

Pause subscription

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |
| `pausedBy` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)\>

##### processRenewal()

```ts
processRenewal(subscriptionId: string): Promise<{
  error?: string;
  newPeriodEnd?: number;
  success: boolean;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:400](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L400)

Process subscription renewal

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

###### Returns

`Promise`\<\{
  `error?`: `string`;
  `newPeriodEnd?`: `number`;
  `success`: `boolean`;
\}\>

##### processSubscriptionRenewals()

```ts
processSubscriptionRenewals(): Promise<{
  failed: number;
  processed: number;
  successful: number;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:587](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L587)

Process subscriptions that need renewal (cron job)

###### Returns

`Promise`\<\{
  `failed`: `number`;
  `processed`: `number`;
  `successful`: `number`;
\}\>

##### recordUsage()

```ts
recordUsage(subscriptionId: string, calls: number): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:538](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L538)

Record usage for a subscription

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `subscriptionId` | `string` | `undefined` |
| `calls` | `number` | `1` |

###### Returns

`Promise`\<`void`\>

##### resumeSubscription()

```ts
resumeSubscription(subscriptionId: string, resumedBy: `0x${string}`): Promise<Subscription>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L337)

Resume paused subscription

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |
| `resumedBy` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)\>

##### retryPayment()

```ts
retryPayment(subscriptionId: string): Promise<{
  error?: string;
  success: boolean;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:519](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L519)

Retry payment for past_due subscription

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

###### Returns

`Promise`\<\{
  `error?`: `string`;
  `success`: `boolean`;
\}\>

***

### SubscriptionRenewalScheduler

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:681](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L681)

Subscription renewal scheduler

#### Constructors

##### Constructor

```ts
new SubscriptionRenewalScheduler(manager: SubscriptionManager): SubscriptionRenewalScheduler;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:685](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L685)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `manager` | [`SubscriptionManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/subscriptions.md#subscriptionmanager) | `subscriptionManager` |

###### Returns

[`SubscriptionRenewalScheduler`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/subscriptions.md#subscriptionrenewalscheduler)

#### Methods

##### start()

```ts
start(intervalMs: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:692](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L692)

Start the renewal scheduler

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `intervalMs` | `number` |

###### Returns

`void`

##### stop()

```ts
stop(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:711](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L711)

Stop the renewal scheduler

###### Returns

`void`

## Interfaces

### PaymentProcessor

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:663](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L663)

Payment processor interface for x402 integration

#### Methods

##### processPayment()

```ts
processPayment(params: {
  amount: string;
  chain: string;
  from: `0x${string}`;
  metadata?: Record<string, unknown>;
  token: "USDC" | "USDs";
}): Promise<{
  error?: string;
  success: boolean;
  txHash?: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:664](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L664)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `amount`: `string`; `chain`: `string`; `from`: `` `0x${string}` ``; `metadata?`: `Record`\<`string`, `unknown`\>; `token`: `"USDC"` \| `"USDs"`; \} |
| `params.amount` | `string` |
| `params.chain` | `string` |
| `params.from` | `` `0x${string}` `` |
| `params.metadata?` | `Record`\<`string`, `unknown`\> |
| `params.token` | `"USDC"` \| `"USDs"` |

###### Returns

`Promise`\<\{
  `error?`: `string`;
  `success`: `boolean`;
  `txHash?`: `string`;
\}\>

## Variables

### subscriptionManager

```ts
const subscriptionManager: SubscriptionManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts:676](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/subscriptions.ts#L676)

Default subscription manager instance
