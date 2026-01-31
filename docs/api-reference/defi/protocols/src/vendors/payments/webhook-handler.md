[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/webhook-handler

# defi/protocols/src/vendors/payments/webhook-handler

## Classes

### WebhookHandler

Defined in: [defi/protocols/src/vendors/payments/webhook-handler.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L68)

#### Constructors

##### Constructor

```ts
new WebhookHandler(config: Configuration): WebhookHandler;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-handler.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L72)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) |

###### Returns

[`WebhookHandler`](/docs/api/defi/protocols/src/vendors/payments/webhook-handler.md#webhookhandler)

#### Methods

##### getStats()

```ts
getStats(): {
  hasDeviceSecret: boolean;
  noncesCached: number;
};
```

Defined in: [defi/protocols/src/vendors/payments/webhook-handler.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L257)

Get webhook handler statistics

###### Returns

```ts
{
  hasDeviceSecret: boolean;
  noncesCached: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `hasDeviceSecret` | `boolean` | [defi/protocols/src/vendors/payments/webhook-handler.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L259) |
| `noncesCached` | `number` | [defi/protocols/src/vendors/payments/webhook-handler.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L258) |

##### handle()

```ts
handle(request: WebhookRequest): Promise<WebhookHandlerResult>;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-handler.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L86)

Process an incoming webhook request

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | [`WebhookRequest`](/docs/api/defi/protocols/src/vendors/payments/webhook-handler.md#webhookrequest) | The webhook HTTP request |

###### Returns

`Promise`\<[`WebhookHandlerResult`](/docs/api/defi/protocols/src/vendors/payments/webhook-handler.md#webhookhandlerresult)\>

Processing result with status code

## Interfaces

### WebhookHandlerResult

Defined in: [defi/protocols/src/vendors/payments/webhook-handler.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L60)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/vendors/payments/webhook-handler.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L63) |
| <a id="errorcode"></a> `errorCode?` | `string` | [defi/protocols/src/vendors/payments/webhook-handler.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L64) |
| <a id="eventid"></a> `eventId?` | `string` | [defi/protocols/src/vendors/payments/webhook-handler.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L62) |
| <a id="statuscode"></a> `statusCode` | `number` | [defi/protocols/src/vendors/payments/webhook-handler.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L65) |
| <a id="success"></a> `success` | `boolean` | [defi/protocols/src/vendors/payments/webhook-handler.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L61) |

***

### WebhookRequest

Defined in: [defi/protocols/src/vendors/payments/webhook-handler.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L50)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="body"></a> `body` | `unknown` | [defi/protocols/src/vendors/payments/webhook-handler.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L56) |
| <a id="headers"></a> `headers` | \{ \[`key`: `string`\]: `string` \| `undefined`; `x-nonce?`: `string`; `x-signature?`: `string`; \} | [defi/protocols/src/vendors/payments/webhook-handler.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L51) |
| `headers.x-nonce?` | `string` | [defi/protocols/src/vendors/payments/webhook-handler.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L52) |
| `headers.x-signature?` | `string` | [defi/protocols/src/vendors/payments/webhook-handler.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L53) |
| <a id="rawbody"></a> `rawBody` | `string` | [defi/protocols/src/vendors/payments/webhook-handler.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L57) |

## Type Aliases

### WebhookPayload

```ts
type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-handler.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L48)

## Functions

### createWebhookHandler()

```ts
function createWebhookHandler(config: Configuration): WebhookHandler;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-handler.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-handler.ts#L273)

Create a webhook handler instance

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) | Server configuration |

#### Returns

[`WebhookHandler`](/docs/api/defi/protocols/src/vendors/payments/webhook-handler.md#webhookhandler)

WebhookHandler instance
