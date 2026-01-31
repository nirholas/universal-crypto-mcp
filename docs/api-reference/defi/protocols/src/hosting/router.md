[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/hosting/router

# defi/protocols/src/hosting/router

## Interfaces

### HostedServerRequest

Defined in: [defi/protocols/src/hosting/router.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L23)

#### Extends

- `Request`

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="hostedserver"></a> `hostedServer?` | [`HostedMCPServer`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpserver) | [defi/protocols/src/hosting/router.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L24) |
| <a id="subdomain"></a> `subdomain?` | `string` | [defi/protocols/src/hosting/router.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L25) |

***

### ServerSession

Defined in: [defi/protocols/src/hosting/router.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L41)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="lastaccess"></a> `lastAccess` | `Date` | [defi/protocols/src/hosting/router.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L45) |
| <a id="server"></a> `server` | `McpServer` | [defi/protocols/src/hosting/router.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L43) |
| <a id="serverid"></a> `serverId` | `string` | [defi/protocols/src/hosting/router.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L44) |
| <a id="transport"></a> `transport` | `StreamableHTTPServerTransport` | [defi/protocols/src/hosting/router.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L42) |

***

### UsageLog

Defined in: [defi/protocols/src/hosting/router.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L28)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/hosting/router.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L38) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/hosting/router.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L29) |
| <a id="paymentamount"></a> `paymentAmount?` | `number` | [defi/protocols/src/hosting/router.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L36) |
| <a id="paymenttxhash"></a> `paymentTxHash?` | `string` | [defi/protocols/src/hosting/router.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L37) |
| <a id="responsetime"></a> `responseTime` | `number` | [defi/protocols/src/hosting/router.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L34) |
| <a id="serverid-1"></a> `serverId` | `string` | [defi/protocols/src/hosting/router.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L30) |
| <a id="success"></a> `success` | `boolean` | [defi/protocols/src/hosting/router.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L35) |
| <a id="timestamp"></a> `timestamp` | `Date` | [defi/protocols/src/hosting/router.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L33) |
| <a id="toolname"></a> `toolName` | `string` | [defi/protocols/src/hosting/router.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L32) |
| <a id="userid"></a> `userId` | `string` | [defi/protocols/src/hosting/router.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L31) |

## Variables

### default

```ts
default: {
  createHostingRouter: () => Router;
  extractSubdomain: (hostname: string) => string | null;
  generate402Response: (tool: HostedMCPTool, server: HostedMCPServer) => object;
  getServerBySubdomain: (subdomain: string) => Promise<
     | HostedMCPServer
    | null>;
  incrementCallCount: (serverId: string) => Promise<void>;
  isReservedSubdomain: (subdomain: string) => boolean;
  loadServerConfig: (req: HostedServerRequest, res: Response, next: NextFunction) => Promise<void>;
  logUsage: (log: Omit<UsageLog, "id">) => Promise<void>;
  routeToHostedServer: (subdomain: string, req: Request, res: Response) => Promise<void>;
  trackUsage: (req: HostedServerRequest, res: Response, next: NextFunction) => void;
};
```

Defined in: [defi/protocols/src/hosting/router.ts:589](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L589)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="createhostingrouter-3"></a> `createHostingRouter()` | () => `Router` | [defi/protocols/src/hosting/router.ts:590](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L590) |
| <a id="extractsubdomain-3"></a> `extractSubdomain()` | (`hostname`: `string`) => `string` \| `null` | [defi/protocols/src/hosting/router.ts:592](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L592) |
| <a id="generate402response-3"></a> `generate402Response()` | (`tool`: [`HostedMCPTool`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcptool), `server`: [`HostedMCPServer`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpserver)) => `object` | [defi/protocols/src/hosting/router.ts:596](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L596) |
| <a id="getserverbysubdomain-3"></a> `getServerBySubdomain()` | (`subdomain`: `string`) => `Promise`\< \| [`HostedMCPServer`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpserver) \| `null`\> | [defi/protocols/src/hosting/router.ts:597](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L597) |
| <a id="incrementcallcount-3"></a> `incrementCallCount()` | (`serverId`: `string`) => `Promise`\<`void`\> | [defi/protocols/src/hosting/router.ts:598](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L598) |
| <a id="isreservedsubdomain-3"></a> `isReservedSubdomain()` | (`subdomain`: `string`) => `boolean` | [defi/protocols/src/hosting/router.ts:593](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L593) |
| <a id="loadserverconfig-3"></a> `loadServerConfig()` | (`req`: [`HostedServerRequest`](/docs/api/defi/protocols/src/hosting/router.md#hostedserverrequest), `res`: `Response`, `next`: `NextFunction`) => `Promise`\<`void`\> | [defi/protocols/src/hosting/router.ts:594](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L594) |
| <a id="logusage-3"></a> `logUsage()` | (`log`: `Omit`\<[`UsageLog`](/docs/api/defi/protocols/src/hosting/router.md#usagelog), `"id"`\>) => `Promise`\<`void`\> | [defi/protocols/src/hosting/router.ts:599](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L599) |
| <a id="routetohostedserver-3"></a> `routeToHostedServer()` | (`subdomain`: `string`, `req`: `Request`, `res`: `Response`) => `Promise`\<`void`\> | [defi/protocols/src/hosting/router.ts:591](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L591) |
| <a id="trackusage-3"></a> `trackUsage()` | (`req`: [`HostedServerRequest`](/docs/api/defi/protocols/src/hosting/router.md#hostedserverrequest), `res`: `Response`, `next`: `NextFunction`) => `void` | [defi/protocols/src/hosting/router.ts:595](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L595) |

## Functions

### createHostingRouter()

```ts
function createHostingRouter(): Router;
```

Defined in: [defi/protocols/src/hosting/router.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L296)

#### Returns

`Router`

***

### extractSubdomain()

```ts
function extractSubdomain(hostname: string): string | null;
```

Defined in: [defi/protocols/src/hosting/router.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L108)

Extract subdomain from hostname
Examples:
- myserver.agenti.cash -> myserver
- myserver.localhost -> myserver
- api.agenti.cash -> api (reserved)
- agenti.cash -> null

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hostname` | `string` |

#### Returns

`string` \| `null`

***

### generate402Response()

```ts
function generate402Response(tool: HostedMCPTool, server: HostedMCPServer): object;
```

Defined in: [defi/protocols/src/hosting/router.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L255)

Generate 402 Payment Required response

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tool` | [`HostedMCPTool`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcptool) |
| `server` | [`HostedMCPServer`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpserver) |

#### Returns

`object`

***

### getServerBySubdomain()

```ts
function getServerBySubdomain(subdomain: string): Promise<
  | HostedMCPServer
| null>;
```

Defined in: [defi/protocols/src/hosting/router.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L60)

Get hosted server config by subdomain
In production, this queries the database

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subdomain` | `string` |

#### Returns

`Promise`\<
  \| [`HostedMCPServer`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpserver)
  \| `null`\>

***

### incrementCallCount()

```ts
function incrementCallCount(serverId: string): Promise<void>;
```

Defined in: [defi/protocols/src/hosting/router.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L69)

Increment call count for a server

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `serverId` | `string` |

#### Returns

`Promise`\<`void`\>

***

### isReservedSubdomain()

```ts
function isReservedSubdomain(subdomain: string): boolean;
```

Defined in: [defi/protocols/src/hosting/router.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L137)

Check if subdomain is reserved

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subdomain` | `string` |

#### Returns

`boolean`

***

### loadServerConfig()

```ts
function loadServerConfig(
   req: HostedServerRequest, 
   res: Response, 
next: NextFunction): Promise<void>;
```

Defined in: [defi/protocols/src/hosting/router.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L168)

Middleware to load server config from database by subdomain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `req` | [`HostedServerRequest`](/docs/api/defi/protocols/src/hosting/router.md#hostedserverrequest) |
| `res` | `Response` |
| `next` | `NextFunction` |

#### Returns

`Promise`\<`void`\>

***

### logUsage()

```ts
function logUsage(log: Omit<UsageLog, "id">): Promise<void>;
```

Defined in: [defi/protocols/src/hosting/router.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L82)

Log usage to database

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `log` | `Omit`\<[`UsageLog`](/docs/api/defi/protocols/src/hosting/router.md#usagelog), `"id"`\> |

#### Returns

`Promise`\<`void`\>

***

### routeToHostedServer()

```ts
function routeToHostedServer(
   subdomain: string, 
   req: Request, 
res: Response): Promise<void>;
```

Defined in: [defi/protocols/src/hosting/router.ts:566](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L566)

Route a request to a hosted server
Used by the wildcard server to handle subdomain requests

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subdomain` | `string` |
| `req` | `Request` |
| `res` | `Response` |

#### Returns

`Promise`\<`void`\>

***

### trackUsage()

```ts
function trackUsage(
   req: HostedServerRequest, 
   res: Response, 
   next: NextFunction): void;
```

Defined in: [defi/protocols/src/hosting/router.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/router.ts#L219)

Middleware to track usage

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `req` | [`HostedServerRequest`](/docs/api/defi/protocols/src/hosting/router.md#hostedserverrequest) |
| `res` | `Response` |
| `next` | `NextFunction` |

#### Returns

`void`
