[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tools/get-webhook-events

# defi/protocols/src/vendors/payments/tools/get-webhook-events

## Classes

### GetWebhookEventsHandler

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L67)

Tool handler implementation

#### Constructors

##### Constructor

```ts
new GetWebhookEventsHandler(): GetWebhookEventsHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L68)

###### Returns

[`GetWebhookEventsHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/get-webhook-events.md#getwebhookeventshandler)

#### Methods

##### handle()

```ts
handle(args: unknown): Promise<GetWebhookEventsOutput>;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L77)

Handle get_webhook_events tool call

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `unknown` |

###### Returns

`Promise`\<[`GetWebhookEventsOutput`](/docs/api/defi/protocols/src/vendors/payments/types.md#getwebhookeventsoutput)\>

## Variables

### getWebhookEventsTool

```ts
const getWebhookEventsTool: {
  description: string;
  inputSchema: {
     properties: {
        identifier: {
           description: string;
           type: "string";
        };
        limit: {
           description: "Maximum number of events to return (default: 50, max: 500)";
           maximum: 500;
           minimum: 1;
           type: "number";
        };
        validated_only: {
           description: "Optional: If true, returns only events with valid HMAC signatures (default: false)";
           type: "boolean";
        };
     };
     type: "object";
  };
  name: "get_webhook_events";
};
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L23)

Tool definition for MCP

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description"></a> `description` | `string` | - | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L25) |
| <a id="inputschema"></a> `inputSchema` | \{ `properties`: \{ `identifier`: \{ `description`: `string`; `type`: `"string"`; \}; `limit`: \{ `description`: `"Maximum number of events to return (default: 50, max: 500)"`; `maximum`: `500`; `minimum`: `1`; `type`: `"number"`; \}; `validated_only`: \{ `description`: `"Optional: If true, returns only events with valid HMAC signatures (default: false)"`; `type`: `"boolean"`; \}; \}; `type`: `"object"`; \} | - | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L30) |
| `inputSchema.properties` | \{ `identifier`: \{ `description`: `string`; `type`: `"string"`; \}; `limit`: \{ `description`: `"Maximum number of events to return (default: 50, max: 500)"`; `maximum`: `500`; `minimum`: `1`; `type`: `"number"`; \}; `validated_only`: \{ `description`: `"Optional: If true, returns only events with valid HMAC signatures (default: false)"`; `type`: `"boolean"`; \}; \} | - | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L32) |
| `inputSchema.properties.identifier` | \{ `description`: `string`; `type`: `"string"`; \} | - | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L33) |
| `inputSchema.properties.identifier.description` | `string` | - | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L35) |
| `inputSchema.properties.identifier.type` | `"string"` | `'string'` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L34) |
| `inputSchema.properties.limit` | \{ `description`: `"Maximum number of events to return (default: 50, max: 500)"`; `maximum`: `500`; `minimum`: `1`; `type`: `"number"`; \} | - | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L39) |
| `inputSchema.properties.limit.description` | `"Maximum number of events to return (default: 50, max: 500)"` | `'Maximum number of events to return (default: 50, max: 500)'` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L41) |
| `inputSchema.properties.limit.maximum` | `500` | `500` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L44) |
| `inputSchema.properties.limit.minimum` | `1` | `1` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L43) |
| `inputSchema.properties.limit.type` | `"number"` | `'number'` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L40) |
| `inputSchema.properties.validated_only` | \{ `description`: `"Optional: If true, returns only events with valid HMAC signatures (default: false)"`; `type`: `"boolean"`; \} | - | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L46) |
| `inputSchema.properties.validated_only.description` | `"Optional: If true, returns only events with valid HMAC signatures (default: false)"` | `'Optional: If true, returns only events with valid HMAC signatures (default: false)'` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L48) |
| `inputSchema.properties.validated_only.type` | `"boolean"` | `'boolean'` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L47) |
| `inputSchema.type` | `"object"` | `'object'` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L31) |
| <a id="name"></a> `name` | `"get_webhook_events"` | `'get_webhook_events'` | [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L24) |

## Functions

### getWebhookEventsHandler()

```ts
function getWebhookEventsHandler(): GetWebhookEventsHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-webhook-events.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-webhook-events.ts#L179)

Create handler instance

#### Returns

[`GetWebhookEventsHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/get-webhook-events.md#getwebhookeventshandler)
