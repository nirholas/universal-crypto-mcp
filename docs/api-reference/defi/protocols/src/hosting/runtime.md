[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/hosting/runtime

# defi/protocols/src/hosting/runtime

## Variables

### default

```ts
default: {
  createHostedServer: (config: HostedMCPServer) => Promise<McpServer>;
  getServerForSubdomain: (subdomain: string) => Promise<McpServer | null>;
  routeToHostedServer: (subdomain: string, request: unknown) => Promise<unknown>;
};
```

Defined in: [defi/protocols/src/hosting/runtime.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/runtime.ts#L266)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="createhostedserver-3"></a> `createHostedServer()` | (`config`: [`HostedMCPServer`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpserver)) => `Promise`\<`McpServer`\> | [defi/protocols/src/hosting/runtime.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/runtime.ts#L267) |
| <a id="getserverforsubdomain-3"></a> `getServerForSubdomain()` | (`subdomain`: `string`) => `Promise`\<`McpServer` \| `null`\> | [defi/protocols/src/hosting/runtime.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/runtime.ts#L268) |
| <a id="routetohostedserver-3"></a> `routeToHostedServer()` | (`subdomain`: `string`, `request`: `unknown`) => `Promise`\<`unknown`\> | [defi/protocols/src/hosting/runtime.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/runtime.ts#L269) |

## Functions

### createHostedServer()

```ts
function createHostedServer(config: HostedMCPServer): Promise<McpServer>;
```

Defined in: [defi/protocols/src/hosting/runtime.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/runtime.ts#L22)

Create an MCP server from hosted configuration

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`HostedMCPServer`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpserver) |

#### Returns

`Promise`\<`McpServer`\>

***

### getServerForSubdomain()

```ts
function getServerForSubdomain(subdomain: string): Promise<McpServer | null>;
```

Defined in: [defi/protocols/src/hosting/runtime.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/runtime.ts#L232)

Get or create server for subdomain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subdomain` | `string` |

#### Returns

`Promise`\<`McpServer` \| `null`\>

***

### routeToHostedServer()

```ts
function routeToHostedServer(subdomain: string, request: unknown): Promise<unknown>;
```

Defined in: [defi/protocols/src/hosting/runtime.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/runtime.ts#L248)

Route request to appropriate hosted server

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subdomain` | `string` |
| `request` | `unknown` |

#### Returns

`Promise`\<`unknown`\>
