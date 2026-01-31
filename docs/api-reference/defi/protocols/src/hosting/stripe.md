[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/hosting/stripe

# defi/protocols/src/hosting/stripe

## Interfaces

### CheckoutSessionResult

Defined in: [defi/protocols/src/hosting/stripe.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L25)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="sessionid"></a> `sessionId` | `string` | [defi/protocols/src/hosting/stripe.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L26) |
| <a id="url"></a> `url` | `string` | [defi/protocols/src/hosting/stripe.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L27) |

***

### SubscriptionStatus

Defined in: [defi/protocols/src/hosting/stripe.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L30)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="active"></a> `active` | `boolean` | [defi/protocols/src/hosting/stripe.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L31) |
| <a id="cancelatperiodend"></a> `cancelAtPeriodEnd` | `boolean` | [defi/protocols/src/hosting/stripe.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L34) |
| <a id="currentperiodend"></a> `currentPeriodEnd` | `Date` \| `null` | [defi/protocols/src/hosting/stripe.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L33) |
| <a id="customerid"></a> `customerId` | `string` \| `null` | [defi/protocols/src/hosting/stripe.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L35) |
| <a id="tier"></a> `tier` | \| `"free"` \| [`SubscriptionTier`](/docs/api/defi/protocols/src/hosting/stripe.md#subscriptiontier) | [defi/protocols/src/hosting/stripe.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L32) |

## Type Aliases

### SubscriptionTier

```ts
type SubscriptionTier = "pro" | "business" | "enterprise";
```

Defined in: [defi/protocols/src/hosting/stripe.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L23)

## Variables

### default

```ts
default: {
  cancelSubscription: (subscriptionId: string) => Promise<Subscription>;
  cancelSubscriptionImmediately: (subscriptionId: string) => Promise<Subscription>;
  createCheckoutSession: (userId: string, tier: SubscriptionTier, email: string, successUrl: string, cancelUrl: string) => Promise<CheckoutSessionResult>;
  createPortalSession: (customerId: string, returnUrl: string) => Promise<string>;
  getStripeInstance: () => Stripe;
  getSubscriptionStatus: (customerId: string) => Promise<SubscriptionStatus>;
  handleWebhook: (event: Event, onSubscriptionUpdate: (userId: string, status: SubscriptionStatus) => Promise<void>) => Promise<void>;
  STRIPE_PRICES: {
     business: string;
     enterprise: string;
     pro: string;
  };
  verifyWebhookSignature: (payload: string | Buffer<ArrayBufferLike>, signature: string) => Event;
};
```

Defined in: [defi/protocols/src/hosting/stripe.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L296)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="cancelsubscription-3"></a> `cancelSubscription()` | (`subscriptionId`: `string`) => `Promise`\<`Subscription`\> | [defi/protocols/src/hosting/stripe.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L300) |
| <a id="cancelsubscriptionimmediately-3"></a> `cancelSubscriptionImmediately()` | (`subscriptionId`: `string`) => `Promise`\<`Subscription`\> | [defi/protocols/src/hosting/stripe.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L301) |
| <a id="createcheckoutsession-3"></a> `createCheckoutSession()` | (`userId`: `string`, `tier`: [`SubscriptionTier`](/docs/api/defi/protocols/src/hosting/stripe.md#subscriptiontier), `email`: `string`, `successUrl`: `string`, `cancelUrl`: `string`) => `Promise`\<[`CheckoutSessionResult`](/docs/api/defi/protocols/src/hosting/stripe.md#checkoutsessionresult)\> | [defi/protocols/src/hosting/stripe.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L297) |
| <a id="createportalsession-3"></a> `createPortalSession()` | (`customerId`: `string`, `returnUrl`: `string`) => `Promise`\<`string`\> | [defi/protocols/src/hosting/stripe.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L302) |
| <a id="getstripeinstance-3"></a> `getStripeInstance()` | () => `Stripe` | [defi/protocols/src/hosting/stripe.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L304) |
| <a id="getsubscriptionstatus-3"></a> `getSubscriptionStatus()` | (`customerId`: `string`) => `Promise`\<[`SubscriptionStatus`](/docs/api/defi/protocols/src/hosting/stripe.md#subscriptionstatus)\> | [defi/protocols/src/hosting/stripe.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L299) |
| <a id="handlewebhook-3"></a> `handleWebhook()` | (`event`: `Event`, `onSubscriptionUpdate`: (`userId`: `string`, `status`: [`SubscriptionStatus`](/docs/api/defi/protocols/src/hosting/stripe.md#subscriptionstatus)) => `Promise`\<`void`\>) => `Promise`\<`void`\> | [defi/protocols/src/hosting/stripe.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L298) |
| <a id="stripe_prices"></a> `STRIPE_PRICES` | \{ `business`: `string`; `enterprise`: `string`; `pro`: `string`; \} | [defi/protocols/src/hosting/stripe.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L305) |
| `STRIPE_PRICES.business` | `string` | [defi/protocols/src/hosting/stripe.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L19) |
| `STRIPE_PRICES.enterprise` | `string` | [defi/protocols/src/hosting/stripe.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L20) |
| `STRIPE_PRICES.pro` | `string` | [defi/protocols/src/hosting/stripe.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L18) |
| <a id="verifywebhooksignature-3"></a> `verifyWebhookSignature()` | (`payload`: `string` \| `Buffer`\<`ArrayBufferLike`\>, `signature`: `string`) => `Event` | [defi/protocols/src/hosting/stripe.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L303) |

***

### STRIPE\_PRICES

```ts
const STRIPE_PRICES: {
  business: string;
  enterprise: string;
  pro: string;
};
```

Defined in: [defi/protocols/src/hosting/stripe.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L17)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="business"></a> `business` | `string` | [defi/protocols/src/hosting/stripe.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L19) |
| <a id="enterprise"></a> `enterprise` | `string` | [defi/protocols/src/hosting/stripe.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L20) |
| <a id="pro"></a> `pro` | `string` | [defi/protocols/src/hosting/stripe.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L18) |

## Functions

### cancelSubscription()

```ts
function cancelSubscription(subscriptionId: string): Promise<Subscription>;
```

Defined in: [defi/protocols/src/hosting/stripe.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L221)

Cancel a subscription at period end

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

#### Returns

`Promise`\<`Subscription`\>

***

### cancelSubscriptionImmediately()

```ts
function cancelSubscriptionImmediately(subscriptionId: string): Promise<Subscription>;
```

Defined in: [defi/protocols/src/hosting/stripe.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L240)

Immediately cancel a subscription

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

#### Returns

`Promise`\<`Subscription`\>

***

### createCheckoutSession()

```ts
function createCheckoutSession(
   userId: string, 
   tier: SubscriptionTier, 
   email: string, 
   successUrl: string, 
cancelUrl: string): Promise<CheckoutSessionResult>;
```

Defined in: [defi/protocols/src/hosting/stripe.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L41)

Create a Stripe checkout session for subscription

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `tier` | [`SubscriptionTier`](/docs/api/defi/protocols/src/hosting/stripe.md#subscriptiontier) |
| `email` | `string` |
| `successUrl` | `string` |
| `cancelUrl` | `string` |

#### Returns

`Promise`\<[`CheckoutSessionResult`](/docs/api/defi/protocols/src/hosting/stripe.md#checkoutsessionresult)\>

***

### createPortalSession()

```ts
function createPortalSession(customerId: string, returnUrl: string): Promise<string>;
```

Defined in: [defi/protocols/src/hosting/stripe.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L256)

Create a customer portal session for managing subscription

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `customerId` | `string` |
| `returnUrl` | `string` |

#### Returns

`Promise`\<`string`\>

***

### getStripeInstance()

```ts
function getStripeInstance(): Stripe;
```

Defined in: [defi/protocols/src/hosting/stripe.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L292)

Get Stripe instance for advanced usage

#### Returns

`Stripe`

***

### getSubscriptionStatus()

```ts
function getSubscriptionStatus(customerId: string): Promise<SubscriptionStatus>;
```

Defined in: [defi/protocols/src/hosting/stripe.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L173)

Get subscription status for a customer

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `customerId` | `string` |

#### Returns

`Promise`\<[`SubscriptionStatus`](/docs/api/defi/protocols/src/hosting/stripe.md#subscriptionstatus)\>

***

### handleWebhook()

```ts
function handleWebhook(event: Event, onSubscriptionUpdate: (userId: string, status: SubscriptionStatus) => Promise<void>): Promise<void>;
```

Defined in: [defi/protocols/src/hosting/stripe.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L94)

Handle Stripe webhook events

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | `Event` |
| `onSubscriptionUpdate` | (`userId`: `string`, `status`: [`SubscriptionStatus`](/docs/api/defi/protocols/src/hosting/stripe.md#subscriptionstatus)) => `Promise`\<`void`\> |

#### Returns

`Promise`\<`void`\>

***

### verifyWebhookSignature()

```ts
function verifyWebhookSignature(payload: string | Buffer<ArrayBufferLike>, signature: string): Event;
```

Defined in: [defi/protocols/src/hosting/stripe.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/stripe.ts#L276)

Verify Stripe webhook signature

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `payload` | `string` \| `Buffer`\<`ArrayBufferLike`\> |
| `signature` | `string` |

#### Returns

`Event`
