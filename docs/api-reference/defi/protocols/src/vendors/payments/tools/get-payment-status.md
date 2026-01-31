[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tools/get-payment-status

# defi/protocols/src/vendors/payments/tools/get-payment-status

## Classes

### GetPaymentStatusHandler

Defined in: [defi/protocols/src/vendors/payments/tools/get-payment-status.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-payment-status.ts#L33)

#### Constructors

##### Constructor

```ts
new GetPaymentStatusHandler(paymentService: PaymentService): GetPaymentStatusHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-payment-status.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-payment-status.ts#L34)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentService` | [`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice) |

###### Returns

[`GetPaymentStatusHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/get-payment-status.md#getpaymentstatushandler)

#### Methods

##### handle()

```ts
handle(args: unknown): Promise<{
  confirmed_amount?: number;
  crypto_amount?: number;
  exchange_rate?: number;
  expired_time?: string;
  identifier: string;
  is_completed?: boolean;
  is_expired?: boolean;
  is_failed?: boolean;
  network_fee?: number;
  remaining_amount?: number;
  requires_action?: boolean;
  status: string;
  status_description?: string;
  unconfirmed_amount?: number;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-payment-status.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-payment-status.ts#L36)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `unknown` |

###### Returns

`Promise`\<\{
  `confirmed_amount?`: `number`;
  `crypto_amount?`: `number`;
  `exchange_rate?`: `number`;
  `expired_time?`: `string`;
  `identifier`: `string`;
  `is_completed?`: `boolean`;
  `is_expired?`: `boolean`;
  `is_failed?`: `boolean`;
  `network_fee?`: `number`;
  `remaining_amount?`: `number`;
  `requires_action?`: `boolean`;
  `status`: `string`;
  `status_description?`: `string`;
  `unconfirmed_amount?`: `number`;
\}\>

## Variables

### getPaymentStatusTool

```ts
const getPaymentStatusTool: Tool;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-payment-status.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-payment-status.ts#L15)

## Functions

### getPaymentStatusHandler()

```ts
function getPaymentStatusHandler(paymentService: PaymentService): GetPaymentStatusHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-payment-status.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-payment-status.ts#L264)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentService` | [`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice) |

#### Returns

[`GetPaymentStatusHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/get-payment-status.md#getpaymentstatushandler)
