[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/payments

# defi/protocols/src/x402/payments

## Variables

### default

```ts
default: {
  FEE_RECIPIENT: string;
  getPaymentRequirement: (toolName: string) => 
     | {
     amount: number;
     currency: string;
     network: string;
     recipient: string;
     required: boolean;
   }
    | null;
  getPricingSummary: () => {
     price: number;
     tier: string;
     tool: string;
  }[];
  getToolPrice: (toolName: string) => number;
  isFreeTool: (toolName: string) => boolean;
  TOOL_PRICING: Record<string, number>;
  verifyPayment: (toolName: string, paymentProof: string) => Promise<{
     error?: string;
     valid: boolean;
  }>;
  wrapServerWithPayments: (server: McpServer) => McpServer;
};
```

Defined in: [defi/protocols/src/x402/payments.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L319)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="fee_recipient"></a> `FEE_RECIPIENT` | `string` | [defi/protocols/src/x402/payments.ts:320](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L320) |
| <a id="getpaymentrequirement-3"></a> `getPaymentRequirement()` | (`toolName`: `string`) => \| \{ `amount`: `number`; `currency`: `string`; `network`: `string`; `recipient`: `string`; `required`: `boolean`; \} \| `null` | [defi/protocols/src/x402/payments.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L324) |
| <a id="getpricingsummary-3"></a> `getPricingSummary()` | () => \{ `price`: `number`; `tier`: `string`; `tool`: `string`; \}[] | [defi/protocols/src/x402/payments.ts:327](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L327) |
| <a id="gettoolprice-3"></a> `getToolPrice()` | (`toolName`: `string`) => `number` | [defi/protocols/src/x402/payments.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L322) |
| <a id="isfreetool-3"></a> `isFreeTool()` | (`toolName`: `string`) => `boolean` | [defi/protocols/src/x402/payments.ts:323](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L323) |
| <a id="tool_pricing"></a> `TOOL_PRICING` | `Record`\<`string`, `number`\> | [defi/protocols/src/x402/payments.ts:321](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L321) |
| <a id="verifypayment-3"></a> `verifyPayment()` | (`toolName`: `string`, `paymentProof`: `string`) => `Promise`\<\{ `error?`: `string`; `valid`: `boolean`; \}\> | [defi/protocols/src/x402/payments.ts:325](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L325) |
| <a id="wrapserverwithpayments-3"></a> `wrapServerWithPayments()` | (`server`: `McpServer`) => `McpServer` | [defi/protocols/src/x402/payments.ts:326](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L326) |

***

### DEFAULT\_TOOL\_PRICE

```ts
const DEFAULT_TOOL_PRICE: 0.001 = 0.001;
```

Defined in: [defi/protocols/src/x402/payments.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L74)

***

### FEE\_RECIPIENT

```ts
const FEE_RECIPIENT: string;
```

Defined in: [defi/protocols/src/x402/payments.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L19)

***

### TOOL\_PRICING

```ts
const TOOL_PRICING: Record<string, number>;
```

Defined in: [defi/protocols/src/x402/payments.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L31)

## Functions

### calculateRevenue()

```ts
function calculateRevenue(toolCalls: {
  count: number;
  tool: string;
}[]): number;
```

Defined in: [defi/protocols/src/x402/payments.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L93)

Calculate total revenue from tool calls

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolCalls` | \{ `count`: `number`; `tool`: `string`; \}[] |

#### Returns

`number`

***

### generatePaymentHeader()

```ts
function generatePaymentHeader(toolName: string): Record<string, string>;
```

Defined in: [defi/protocols/src/x402/payments.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L128)

Generate x402 payment header for tool call

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolName` | `string` |

#### Returns

`Record`\<`string`, `string`\>

***

### getPaymentRequirement()

```ts
function getPaymentRequirement(toolName: string): 
  | {
  amount: number;
  currency: string;
  network: string;
  recipient: string;
  required: boolean;
}
  | null;
```

Defined in: [defi/protocols/src/x402/payments.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L103)

x402 payment requirement for tool execution
Returns payment details if payment is required, null if free

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolName` | `string` |

#### Returns

  \| \{
  `amount`: `number`;
  `currency`: `string`;
  `network`: `string`;
  `recipient`: `string`;
  `required`: `boolean`;
\}
  \| `null`

***

### getPricingSummary()

```ts
function getPricingSummary(): {
  price: number;
  tier: string;
  tool: string;
}[];
```

Defined in: [defi/protocols/src/x402/payments.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L298)

Get pricing summary for all tools

#### Returns

\{
  `price`: `number`;
  `tier`: `string`;
  `tool`: `string`;
\}[]

***

### getToolPrice()

```ts
function getToolPrice(toolName: string): number;
```

Defined in: [defi/protocols/src/x402/payments.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L79)

Get the price for a tool call

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolName` | `string` |

#### Returns

`number`

***

### isFreeTool()

```ts
function isFreeTool(toolName: string): boolean;
```

Defined in: [defi/protocols/src/x402/payments.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L86)

Check if a tool is free

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolName` | `string` |

#### Returns

`boolean`

***

### verifyPayment()

```ts
function verifyPayment(toolName: string, paymentProof: string): Promise<{
  error?: string;
  valid: boolean;
}>;
```

Defined in: [defi/protocols/src/x402/payments.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L148)

Verify x402 payment was made
Verifies the transaction on-chain by checking the transaction receipt

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolName` | `string` |
| `paymentProof` | `string` |

#### Returns

`Promise`\<\{
  `error?`: `string`;
  `valid`: `boolean`;
\}\>

***

### wrapServerWithPayments()

```ts
function wrapServerWithPayments(server: McpServer): McpServer;
```

Defined in: [defi/protocols/src/x402/payments.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/payments.ts#L244)

Wrap an MCP server to require x402 payments for tool calls
Note: This uses internal MCP server APIs and may need updates with new SDK versions

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`McpServer`
