[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tools/create-payment-onchain

# defi/protocols/src/vendors/payments/tools/create-payment-onchain

## Classes

### CreatePaymentOnchainHandler

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts#L70)

#### Constructors

##### Constructor

```ts
new CreatePaymentOnchainHandler(paymentService: PaymentService, currencyService: CurrencyService): CreatePaymentOnchainHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts#L71)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentService` | [`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice) |
| `currencyService` | [`CurrencyService`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyservice) |

###### Returns

[`CreatePaymentOnchainHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/create-payment-onchain.md#createpaymentonchainhandler)

#### Methods

##### handle()

```ts
handle(args: unknown): Promise<{
  address?: string;
  expected_input_amount?: number;
  expiration_warning?: string;
  expires_at?: string;
  expires_in_minutes?: number;
  identifier: string;
  input_currency?: string;
  original_blockchain?: string;
  original_symbol?: string;
  payment_uri?: string;
  qr_address?: QrCodeData;
  qr_payment_uri?: QrCodeData;
  rate?: number;
  tag_memo?: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts#L76)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `unknown` |

###### Returns

`Promise`\<\{
  `address?`: `string`;
  `expected_input_amount?`: `number`;
  `expiration_warning?`: `string`;
  `expires_at?`: `string`;
  `expires_in_minutes?`: `number`;
  `identifier`: `string`;
  `input_currency?`: `string`;
  `original_blockchain?`: `string`;
  `original_symbol?`: `string`;
  `payment_uri?`: `string`;
  `qr_address?`: [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata);
  `qr_payment_uri?`: [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata);
  `rate?`: `number`;
  `tag_memo?`: `string`;
\}\>

## Variables

### createPaymentOnchainTool

```ts
const createPaymentOnchainTool: Tool;
```

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts#L22)

## Functions

### createPaymentOnchainHandler()

```ts
function createPaymentOnchainHandler(paymentService: PaymentService, currencyService: CurrencyService): CreatePaymentOnchainHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts:378](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/create-payment-onchain.ts#L378)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentService` | [`PaymentService`](/docs/api/defi/protocols/src/vendors/payments/services/payment-service.md#paymentservice) |
| `currencyService` | [`CurrencyService`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyservice) |

#### Returns

[`CreatePaymentOnchainHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/create-payment-onchain.md#createpaymentonchainhandler)
