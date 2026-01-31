[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/services/payment-service

# defi/protocols/src/vendors/payments/services/payment-service

## Classes

### PaymentService

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L48)

#### Constructors

##### Constructor

```ts
new PaymentService(apiClient: BitnovoApiClient, config: Configuration): PaymentService;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L51)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiClient` | [`BitnovoApiClient`](/docs/api/defi/protocols/src/vendors/payments/api/bitnovo-client.md#bitnovoapiclient) |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) |

###### Returns

[`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice)

#### Methods

##### createOnchainPayment()

```ts
createOnchainPayment(input: unknown): Promise<Payment>;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L59)

Create an on-chain cryptocurrency payment

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `unknown` |

###### Returns

`Promise`\<[`Payment`](/docs/api/defi/protocols/src/vendors/payments/types.md#payment)\>

##### createRedirectPayment()

```ts
createRedirectPayment(input: unknown): Promise<Payment>;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L175)

Create a web redirect payment

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `unknown` |

###### Returns

`Promise`\<[`Payment`](/docs/api/defi/protocols/src/vendors/payments/types.md#payment)\>

##### formatAmount()

```ts
formatAmount(amount: number, currency?: string): string;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:507](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L507)

Format amount for display with proper decimal places

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `number` |
| `currency?` | `string` |

###### Returns

`string`

##### getPaymentDetails()

```ts
getPaymentDetails(identifier: string): Promise<Payment>;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L250)

Get full payment details by identifier

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `identifier` | `string` |

###### Returns

`Promise`\<[`Payment`](/docs/api/defi/protocols/src/vendors/payments/types.md#payment)\>

##### getPaymentStatus()

```ts
getPaymentStatus(input: unknown): Promise<PaymentStatus>;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L329)

Get payment status by identifier

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `unknown` |

###### Returns

`Promise`\<[`PaymentStatus`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatus)\>

##### getPaymentTimeout()

```ts
getPaymentTimeout(): number;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:498](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L498)

Calculate payment timeout based on configuration

###### Returns

`number`

##### isPaymentExpired()

```ts
isPaymentExpired(expirationTime: string): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:486](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L486)

Check if a payment has expired based on current time

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `expirationTime` | `string` |

###### Returns

`boolean`

***

### PaymentServiceError

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L26)

#### Extends

- `Error`

#### Implements

- [`ApiError`](/docs/api/defi/protocols/src/vendors/payments/types.md#apierror)

#### Constructors

##### Constructor

```ts
new PaymentServiceError(
   message: string, 
   statusCode: number, 
   code: string, 
   details?: unknown): PaymentServiceError;
```

Defined in: [defi/protocols/src/vendors/payments/services/payment-service.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L31)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `statusCode` | `number` |
| `code` | `string` |
| `details?` | `unknown` |

###### Returns

[`PaymentServiceError`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentserviceerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="code"></a> `code` | `readonly` | `string` | [defi/protocols/src/vendors/payments/services/payment-service.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L28) |
| <a id="details"></a> `details?` | `readonly` | `unknown` | [defi/protocols/src/vendors/payments/services/payment-service.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L29) |
| <a id="statuscode"></a> `statusCode` | `readonly` | `number` | [defi/protocols/src/vendors/payments/services/payment-service.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/payment-service.ts#L27) |
