[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/tatum-api/services/gateway

# defi/protocols/src/vendors/tatum-api/services/gateway

## Classes

### GatewayService

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L65)

#### Constructors

##### Constructor

```ts
new GatewayService(apiKey?: string): GatewayService;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L73)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiKey?` | `string` |

###### Returns

[`GatewayService`](/docs/api/defi/protocols/src/vendors/tatum-api/services/gateway.md#gatewayservice)

#### Methods

##### executeChainRequest()

```ts
executeChainRequest(__namedParameters: {
  chainName: string;
  method: string;
  params?: any[];
}): Promise<TatumApiResponse>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L205)

Execute request with intelligent protocol detection based on chain

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `__namedParameters` | \{ `chainName`: `string`; `method`: `string`; `params?`: `any`[]; \} |
| `__namedParameters.chainName` | `string` |
| `__namedParameters.method` | `string` |
| `__namedParameters.params?` | `any`[] |

###### Returns

`Promise`\<[`TatumApiResponse`](/docs/api/defi/protocols/src/vendors/tatum-api/types.md#tatumapiresponse)\>

##### executeRequest()

```ts
executeRequest(__namedParameters: {
  body?: any;
  gatewayUrl: string;
  method: string;
}): Promise<TatumApiResponse>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L176)

Execute RPC or REST request to gateway

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `__namedParameters` | \{ `body?`: `any`; `gatewayUrl`: `string`; `method`: `string`; \} |
| `__namedParameters.body?` | `any` |
| `__namedParameters.gatewayUrl` | `string` |
| `__namedParameters.method` | `string` |

###### Returns

`Promise`\<[`TatumApiResponse`](/docs/api/defi/protocols/src/vendors/tatum-api/types.md#tatumapiresponse)\>

##### getAvailableChains()

```ts
getAvailableChains(): Promise<Gateway[]>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L116)

Get all available blockchain networks

###### Returns

`Promise`\<[`Gateway`](/docs/api/defi/protocols/src/vendors/tatum-api/types.md#gateway)[]\>

##### getAvailableMethods()

```ts
getAvailableMethods(gatewayUrl: string): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L147)

Get available methods for a specific gateway

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `gatewayUrl` | `string` |

###### Returns

`Promise`\<`any`\>

##### getGatewayUrl()

```ts
getGatewayUrl(chainName: string): Promise<string | undefined>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L132)

Get gateway URL for a specific chain

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainName` | `string` |

###### Returns

`Promise`\<`string` \| `undefined`\>

##### getSupportedChains()

```ts
getSupportedChains(): Promise<string[]>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L124)

Get supported chains as string array

###### Returns

`Promise`\<`string`[]\>

##### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L80)

Initialize the service by fetching blockchain data from external API

###### Returns

`Promise`\<`void`\>

## Variables

### GATEWAY\_TOOLS

```ts
const GATEWAY_TOOLS: Tool[];
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/gateway.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/gateway.ts#L12)
