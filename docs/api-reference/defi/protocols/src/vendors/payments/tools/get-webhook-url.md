[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tools/get-webhook-url

# defi/protocols/src/vendors/payments/tools/get-webhook-url

## Classes

### GetWebhookUrlHandler

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-url.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-url.ts#L54)

Handler for get_webhook_url tool

#### Constructors

##### Constructor

```ts
new GetWebhookUrlHandler(webhookServer: 
  | WebhookServer
  | null): GetWebhookUrlHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-url.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-url.ts#L55)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookServer` | \| [`WebhookServer`](/docs/api/defi/protocols/src/vendors/payments/webhook-server.md#webhookserver) \| `null` |

###### Returns

[`GetWebhookUrlHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/get-webhook-url.md#getwebhookurlhandler)

#### Methods

##### handle()

```ts
handle(args: GetWebhookUrlInput): Promise<GetWebhookUrlOutput>;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-url.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-url.ts#L57)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | [`GetWebhookUrlInput`](/docs/api/defi/protocols/src/vendors/payments/types.md#getwebhookurlinput) |

###### Returns

`Promise`\<[`GetWebhookUrlOutput`](/docs/api/defi/protocols/src/vendors/payments/types.md#getwebhookurloutput)\>

## Variables

### getWebhookUrlTool

```ts
const getWebhookUrlTool: Tool;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-url.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-url.ts#L20)

MCP Tool Definition: get_webhook_url

## Functions

### getWebhookUrlHandler()

```ts
function getWebhookUrlHandler(webhookServer: 
  | WebhookServer
  | null): GetWebhookUrlHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-url.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-url.ts#L196)

Factory function to create handler with webhook server reference

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookServer` | \| [`WebhookServer`](/docs/api/defi/protocols/src/vendors/payments/webhook-server.md#webhookserver) \| `null` |

#### Returns

[`GetWebhookUrlHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/get-webhook-url.md#getwebhookurlhandler)
