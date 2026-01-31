[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tools/generate-payment-qr

# defi/protocols/src/vendors/payments/tools/generate-payment-qr

## Classes

### GeneratePaymentQrHandler

Defined in: [defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts#L77)

#### Constructors

##### Constructor

```ts
new GeneratePaymentQrHandler(paymentService: PaymentService, currencyService: CurrencyService): GeneratePaymentQrHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts#L78)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentService` | [`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice) |
| `currencyService` | [`CurrencyService`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyservice) |

###### Returns

[`GeneratePaymentQrHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/generate-payment-qr.md#generatepaymentqrhandler)

#### Methods

##### handle()

```ts
handle(args: unknown): Promise<GeneratePaymentQrOutput>;
```

Defined in: [defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts#L83)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `unknown` |

###### Returns

`Promise`\<[`GeneratePaymentQrOutput`](/docs/api/defi/protocols/src/vendors/payments/types.md#generatepaymentqroutput)\>

## Variables

### generatePaymentQrTool

```ts
const generatePaymentQrTool: Tool;
```

Defined in: [defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts#L26)

## Functions

### generatePaymentQrHandler()

```ts
function generatePaymentQrHandler(paymentService: PaymentService, currencyService: CurrencyService): GeneratePaymentQrHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts:504](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/generate-payment-qr.ts#L504)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentService` | [`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice) |
| `currencyService` | [`CurrencyService`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyservice) |

#### Returns

[`GeneratePaymentQrHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/generate-payment-qr.md#generatepaymentqrhandler)
