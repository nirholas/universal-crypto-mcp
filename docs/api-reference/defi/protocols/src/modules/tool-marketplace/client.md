[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/client

# defi/protocols/src/modules/tool-marketplace/client

## Classes

### MarketplaceClient

Defined in: [defi/protocols/src/modules/tool-marketplace/client.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L58)

Marketplace client for calling paid tools

#### Constructors

##### Constructor

```ts
new MarketplaceClient(options: {
  defaultMaxPayment?: string;
  onPayment: (amount: string, recipient: `0x${string}`, token: string) => Promise<string>;
  userAddress: `0x${string}`;
}): MarketplaceClient;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/client.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L63)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `defaultMaxPayment?`: `string`; `onPayment`: (`amount`: `string`, `recipient`: `` `0x${string}` ``, `token`: `string`) => `Promise`\<`string`\>; `userAddress`: `` `0x${string}` ``; \} |
| `options.defaultMaxPayment?` | `string` |
| `options.onPayment` | (`amount`: `string`, `recipient`: `` `0x${string}` ``, `token`: `string`) => `Promise`\<`string`\> |
| `options.userAddress` | `` `0x${string}` `` |

###### Returns

[`MarketplaceClient`](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#marketplaceclient)

#### Methods

##### batchCall()

```ts
batchCall(calls: Omit<CallToolOptions, "userAddress" | "onPayment">[]): Promise<CallToolResult[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/client.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L184)

Batch call multiple tools

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `calls` | `Omit`\<[`CallToolOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#calltooloptions), `"userAddress"` \| `"onPayment"`\>[] |

###### Returns

`Promise`\<[`CallToolResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#calltoolresult)[]\>

##### callTool()

```ts
callTool(options: Omit<CallToolOptions, "userAddress" | "onPayment">): Promise<CallToolResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/client.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L76)

Call a paid tool with automatic payment handling

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | `Omit`\<[`CallToolOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#calltooloptions), `"userAddress"` \| `"onPayment"`\> |

###### Returns

`Promise`\<[`CallToolResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#calltoolresult)\>

##### estimateCost()

```ts
estimateCost(toolIdOrName: string): Promise<
  | {
  chain: string;
  price: string;
  token: string;
  tool: string;
}
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/client.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L164)

Estimate the cost of calling a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolIdOrName` | `string` |

###### Returns

`Promise`\<
  \| \{
  `chain`: `string`;
  `price`: `string`;
  `token`: `string`;
  `tool`: `string`;
\}
  \| `null`\>

## Interfaces

### CallToolOptions

Defined in: [defi/protocols/src/modules/tool-marketplace/client.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L16)

Options for calling a paid tool

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="body"></a> `body?` | `unknown` | Request body | [defi/protocols/src/modules/tool-marketplace/client.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L24) |
| <a id="headers"></a> `headers?` | `Record`\<`string`, `string`\> | Additional headers | [defi/protocols/src/modules/tool-marketplace/client.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L26) |
| <a id="maxpayment"></a> `maxPayment?` | `string` | Maximum payment allowed (in USD) | [defi/protocols/src/modules/tool-marketplace/client.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L28) |
| <a id="method"></a> `method?` | `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` | Request method | [defi/protocols/src/modules/tool-marketplace/client.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L20) |
| <a id="onpayment"></a> `onPayment` | (`amount`: `string`, `recipient`: `` `0x${string}` ``, `token`: `string`) => `Promise`\<`string`\> | Payment callback - called when payment is needed | [defi/protocols/src/modules/tool-marketplace/client.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L32) |
| <a id="path"></a> `path?` | `string` | Request path (appended to tool endpoint) | [defi/protocols/src/modules/tool-marketplace/client.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L22) |
| <a id="tool"></a> `tool` | `string` | Tool ID or name | [defi/protocols/src/modules/tool-marketplace/client.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L18) |
| <a id="useraddress"></a> `userAddress` | `` `0x${string}` `` | User address making the call | [defi/protocols/src/modules/tool-marketplace/client.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L30) |

***

### CallToolResult

Defined in: [defi/protocols/src/modules/tool-marketplace/client.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L38)

Result of a paid tool call

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amountpaid"></a> `amountPaid?` | `string` | Amount paid (if any) | [defi/protocols/src/modules/tool-marketplace/client.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L46) |
| <a id="data"></a> `data?` | `unknown` | Response data | [defi/protocols/src/modules/tool-marketplace/client.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L42) |
| <a id="error"></a> `error?` | `string` | Error message (if failed) | [defi/protocols/src/modules/tool-marketplace/client.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L52) |
| <a id="responsetime"></a> `responseTime` | `number` | Response time in ms | [defi/protocols/src/modules/tool-marketplace/client.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L50) |
| <a id="status"></a> `status?` | `number` | Response status code | [defi/protocols/src/modules/tool-marketplace/client.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L44) |
| <a id="success"></a> `success` | `boolean` | Whether the call succeeded | [defi/protocols/src/modules/tool-marketplace/client.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L40) |
| <a id="txhash"></a> `txHash?` | `string` | Payment transaction hash (if any) | [defi/protocols/src/modules/tool-marketplace/client.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L48) |

## Functions

### createMarketplaceClient()

```ts
function createMarketplaceClient(options: {
  defaultMaxPayment?: string;
  userAddress: `0x${string}`;
  x402Client: {
     pay: (recipient: `0x${string}`, amount: string, token?: string) => Promise<{
        transaction: {
           hash: string;
        };
     }>;
  };
}): MarketplaceClient;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/client.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/client.ts#L207)

Create a marketplace client with x402 payment integration

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `defaultMaxPayment?`: `string`; `userAddress`: `` `0x${string}` ``; `x402Client`: \{ `pay`: (`recipient`: `` `0x${string}` ``, `amount`: `string`, `token?`: `string`) => `Promise`\<\{ `transaction`: \{ `hash`: `string`; \}; \}\>; \}; \} |
| `options.defaultMaxPayment?` | `string` |
| `options.userAddress` | `` `0x${string}` `` |
| `options.x402Client` | \{ `pay`: (`recipient`: `` `0x${string}` ``, `amount`: `string`, `token?`: `string`) => `Promise`\<\{ `transaction`: \{ `hash`: `string`; \}; \}\>; \} |
| `options.x402Client.pay` | (`recipient`: `` `0x${string}` ``, `amount`: `string`, `token?`: `string`) => `Promise`\<\{ `transaction`: \{ `hash`: `string`; \}; \}\> |

#### Returns

[`MarketplaceClient`](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#marketplaceclient)
