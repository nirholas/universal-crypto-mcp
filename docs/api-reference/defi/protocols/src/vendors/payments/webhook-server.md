[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/webhook-server

# defi/protocols/src/vendors/payments/webhook-server

## Classes

### WebhookServer

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L42)

HTTP webhook server
Receives POST requests from Bitnovo Pay API with payment status updates

#### Constructors

##### Constructor

```ts
new WebhookServer(config: Configuration, webhookConfig: WebhookConfiguration): WebhookServer;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L51)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) |
| `webhookConfig` | [`WebhookConfiguration`](/docs/api/defi/protocols/src/vendors/payments/types.md#webhookconfiguration) |

###### Returns

[`WebhookServer`](/docs/api/defi/protocols/src/vendors/payments/webhook-server.md#webhookserver)

#### Properties

| Property | Modifier | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="publicurl"></a> `publicUrl` | `public` | `string` \| `null` | `null` | [defi/protocols/src/vendors/payments/webhook-server.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L49) |

#### Methods

##### getApp()

```ts
getApp(): Express;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:485](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L485)

Get Express app instance (for testing)

###### Returns

`Express`

##### getConfig()

```ts
getConfig(): WebhookConfiguration;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:478](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L478)

Get server configuration

###### Returns

[`WebhookConfiguration`](/docs/api/defi/protocols/src/vendors/payments/types.md#webhookconfiguration)

##### getPublicUrl()

```ts
getPublicUrl(): string | null;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:499](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L499)

Get public webhook URL (from tunnel or manual config)

###### Returns

`string` \| `null`

##### getTunnelManager()

```ts
getTunnelManager(): 
  | TunnelManager
  | null;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:492](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L492)

Get tunnel manager instance

###### Returns

  \| [`TunnelManager`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelmanager)
  \| `null`

##### getWebhookUrl()

```ts
getWebhookUrl(): string | null;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:506](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L506)

Get full webhook URL (public URL + path)

###### Returns

`string` \| `null`

##### isRunning()

```ts
isRunning(): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:471](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L471)

Check if server is running

###### Returns

`boolean`

##### start()

```ts
start(): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:350](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L350)

Start the webhook server (and tunnel if configured)

###### Returns

`Promise`\<`void`\>

##### stop()

```ts
stop(): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:426](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L426)

Stop the webhook server (and tunnel if running)

###### Returns

`Promise`\<`void`\>

## Functions

### createWebhookServer()

```ts
function createWebhookServer(config: Configuration, webhookConfig: WebhookConfiguration): WebhookServer;
```

Defined in: [defi/protocols/src/vendors/payments/webhook-server.ts:520](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/webhook-server.ts#L520)

Create a webhook server instance

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) | MCP server configuration |
| `webhookConfig` | [`WebhookConfiguration`](/docs/api/defi/protocols/src/vendors/payments/types.md#webhookconfiguration) | Webhook server configuration |

#### Returns

[`WebhookServer`](/docs/api/defi/protocols/src/vendors/payments/webhook-server.md#webhookserver)

WebhookServer instance
