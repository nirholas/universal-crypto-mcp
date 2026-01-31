[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tools/get-tunnel-status

# defi/protocols/src/vendors/payments/tools/get-tunnel-status

## Classes

### GetTunnelStatusHandler

Defined in: [defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts#L51)

Handler for get_tunnel_status tool

#### Constructors

##### Constructor

```ts
new GetTunnelStatusHandler(webhookServer: 
  | WebhookServer
  | null): GetTunnelStatusHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts#L52)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookServer` | \| [`WebhookServer`](/docs/api/defi/protocols/src/vendors/payments/webhook-server.md#webhookserver) \| `null` |

###### Returns

[`GetTunnelStatusHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/get-tunnel-status.md#gettunnelstatushandler)

#### Methods

##### handle()

```ts
handle(_args: Record<string, never>): Promise<GetTunnelStatusOutput>;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts#L54)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `_args` | `Record`\<`string`, `never`\> |

###### Returns

`Promise`\<[`GetTunnelStatusOutput`](/docs/api/defi/protocols/src/vendors/payments/types.md#gettunnelstatusoutput)\>

## Variables

### getTunnelStatusTool

```ts
const getTunnelStatusTool: Tool;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts#L21)

MCP Tool Definition: get_tunnel_status

## Functions

### getTunnelStatusHandler()

```ts
function getTunnelStatusHandler(webhookServer: 
  | WebhookServer
  | null): GetTunnelStatusHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/get-tunnel-status.ts#L159)

Factory function to create handler with webhook server reference

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookServer` | \| [`WebhookServer`](/docs/api/defi/protocols/src/vendors/payments/webhook-server.md#webhookserver) \| `null` |

#### Returns

[`GetTunnelStatusHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/get-tunnel-status.md#gettunnelstatushandler)
