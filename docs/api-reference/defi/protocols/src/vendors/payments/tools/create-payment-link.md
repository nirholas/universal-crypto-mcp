[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tools/create-payment-link

# defi/protocols/src/vendors/payments/tools/create-payment-link

## Classes

### CreatePaymentLinkHandler

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-link.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-link.ts#L72)

#### Constructors

##### Constructor

```ts
new CreatePaymentLinkHandler(paymentService: PaymentService): CreatePaymentLinkHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-link.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-link.ts#L73)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentService` | [`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice) |

###### Returns

[`CreatePaymentLinkHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/create-payment-link.md#createpaymentlinkhandler)

#### Methods

##### handle()

```ts
handle(args: unknown): Promise<{
  expires_at?: string;
  identifier: string;
  qr_web_url?: QrCodeData;
  web_url: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-link.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-link.ts#L75)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `unknown` |

###### Returns

`Promise`\<\{
  `expires_at?`: `string`;
  `identifier`: `string`;
  `qr_web_url?`: [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata);
  `web_url`: `string`;
\}\>

## Variables

### createPaymentLinkTool

```ts
const createPaymentLinkTool: Tool;
```

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-link.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-link.ts#L24)

## Functions

### createPaymentLinkHandler()

```ts
function createPaymentLinkHandler(paymentService: PaymentService): CreatePaymentLinkHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-link.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-link.ts#L233)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentService` | [`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice) |

#### Returns

[`CreatePaymentLinkHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/create-payment-link.md#createpaymentlinkhandler)
