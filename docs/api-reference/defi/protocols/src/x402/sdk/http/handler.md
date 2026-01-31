[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/http/handler

# defi/protocols/src/x402/sdk/http/handler

## Classes

### HTTP402Handler

Defined in: [defi/protocols/src/x402/sdk/http/handler.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L20)

HTTP 402 Payment Required response handler

#### Constructors

##### Constructor

```ts
new HTTP402Handler(): HTTP402Handler;
```

###### Returns

[`HTTP402Handler`](/docs/api/defi/protocols/src/x402/sdk/http/handler.md#http402handler)

#### Methods

##### createResponse()

```ts
static createResponse(request: PaymentRequest, message?: string): {
  body: object;
  headers: Record<string, string>;
  status: 402;
};
```

Defined in: [defi/protocols/src/x402/sdk/http/handler.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L93)

Create a 402 response for servers

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |
| `message?` | `string` |

###### Returns

```ts
{
  body: object;
  headers: Record<string, string>;
  status: 402;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `body` | `object` | [defi/protocols/src/x402/sdk/http/handler.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L99) |
| `headers` | `Record`\<`string`, `string`\> | [defi/protocols/src/x402/sdk/http/handler.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L98) |
| `status` | `402` | [defi/protocols/src/x402/sdk/http/handler.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L97) |

##### fromFetchResponse()

```ts
static fromFetchResponse(response: Response): Promise<HTTP402ParseResult>;
```

Defined in: [defi/protocols/src/x402/sdk/http/handler.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L64)

Check if a fetch Response is a 402 payment required

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `Response` |

###### Returns

`Promise`\<[`HTTP402ParseResult`](/docs/api/defi/protocols/src/x402/sdk/types.md#http402parseresult)\>

##### parse()

```ts
static parse(response: HTTP402Response): HTTP402ParseResult;
```

Defined in: [defi/protocols/src/x402/sdk/http/handler.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L24)

Parse a 402 response to extract payment details

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | [`HTTP402Response`](/docs/api/defi/protocols/src/x402/sdk/types.md#http402response) |

###### Returns

[`HTTP402ParseResult`](/docs/api/defi/protocols/src/x402/sdk/types.md#http402parseresult)

## Functions

### fetchWith402Handling()

```ts
function fetchWith402Handling(url: string | URL, options: RequestInit & {
  onPaymentRequired?: (request: PaymentRequest) => Promise<string | null>;
}): Promise<Response>;
```

Defined in: [defi/protocols/src/x402/sdk/http/handler.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L208)

Utility function to wrap fetch with 402 handling

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `url` | `string` \| `URL` |
| `options` | `RequestInit` & \{ `onPaymentRequired?`: (`request`: [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1)) => `Promise`\<`string` \| `null`\>; \} |

#### Returns

`Promise`\<`Response`\>
