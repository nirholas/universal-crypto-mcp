[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/cli/utils/payment

# defi/protocols/src/x402/cli/utils/payment

## Functions

### createPaymentHeader()

```ts
function createPaymentHeader(payment: PaymentRequest): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/payment.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L108)

Create x402 payment header

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |

#### Returns

`string`

***

### estimateTotalCost()

```ts
function estimateTotalCost(payment: PaymentRequest, gasPrice?: bigint): {
  estimatedGas: string;
  paymentAmount: string;
  total: string;
};
```

Defined in: [defi/protocols/src/x402/cli/utils/payment.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L165)

Calculate total payment including estimated gas

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |
| `gasPrice?` | `bigint` |

#### Returns

```ts
{
  estimatedGas: string;
  paymentAmount: string;
  total: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `estimatedGas` | `string` | [defi/protocols/src/x402/cli/utils/payment.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L167) |
| `paymentAmount` | `string` | [defi/protocols/src/x402/cli/utils/payment.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L166) |
| `total` | `string` | [defi/protocols/src/x402/cli/utils/payment.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L168) |

***

### formatPayment()

```ts
function formatPayment(payment: PaymentRequest): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/payment.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L86)

Format payment for human readability

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |

#### Returns

`string`

***

### parsePayment()

```ts
function parsePayment(headers: Headers): 
  | PaymentRequest
  | null;
```

Defined in: [defi/protocols/src/x402/cli/utils/payment.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L17)

Parse x402 payment requirements from HTTP headers
Supports multiple header formats:
- X-Payment-Required
- WWW-Authenticate: x402
- JSON body payment info

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `headers` | `Headers` |

#### Returns

  \| [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1)
  \| `null`

***

### validatePaymentRequest()

```ts
function validatePaymentRequest(payment: PaymentRequest): {
  errors: string[];
  valid: boolean;
};
```

Defined in: [defi/protocols/src/x402/cli/utils/payment.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L122)

Validate payment request

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |

#### Returns

```ts
{
  errors: string[];
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `errors` | `string`[] | [defi/protocols/src/x402/cli/utils/payment.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L122) |
| `valid` | `boolean` | [defi/protocols/src/x402/cli/utils/payment.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/payment.ts#L122) |
