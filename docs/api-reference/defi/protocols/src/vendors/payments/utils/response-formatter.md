[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/response-formatter

# defi/protocols/src/vendors/payments/utils/response-formatter

## Type Aliases

### ContentBlock

```ts
type ContentBlock = TextContentBlock | ImageContentBlock;
```

Defined in: [defi/protocols/src/vendors/payments/utils/response-formatter.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/response-formatter.ts#L25)

## Functions

### createMcpContentBlocks()

```ts
function createMcpContentBlocks(response: any, toolName: string): ContentBlock[];
```

Defined in: [defi/protocols/src/vendors/payments/utils/response-formatter.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/response-formatter.ts#L182)

Create content blocks for MCP response with separate image blocks

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `any` |
| `toolName` | `string` |

#### Returns

[`ContentBlock`](/docs/api/defi/protocols/src/vendors/payments/utils/response-formatter.md#contentblock)[]

***

### createResponseSummary()

```ts
function createResponseSummary(response: any, toolName: string): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/response-formatter.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/response-formatter.ts#L218)

Create a user-friendly summary for Claude Desktop

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `any` |
| `toolName` | `string` |

#### Returns

`string`

***

### extractQrImages()

```ts
function extractQrImages(response: any): ImageContentBlock[];
```

Defined in: [defi/protocols/src/vendors/payments/utils/response-formatter.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/response-formatter.ts#L139)

Extract QR codes from response and convert to image content blocks

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `any` |

#### Returns

`ImageContentBlock`[]

***

### formatMcpResponse()

```ts
function formatMcpResponse(response: any): any;
```

Defined in: [defi/protocols/src/vendors/payments/utils/response-formatter.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/response-formatter.ts#L119)

Format any response with potential large data

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `any` |

#### Returns

`any`

***

### formatPaymentResponse()

```ts
function formatPaymentResponse(response: PaymentResponse): any;
```

Defined in: [defi/protocols/src/vendors/payments/utils/response-formatter.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/response-formatter.ts#L73)

Format payment response for Claude Desktop
Makes responses more readable by summarizing large data

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `PaymentResponse` |

#### Returns

`any`
