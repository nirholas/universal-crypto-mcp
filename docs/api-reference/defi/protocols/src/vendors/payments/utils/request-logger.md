[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/request-logger

# defi/protocols/src/vendors/payments/utils/request-logger

## Classes

### RequestLogger

Defined in: [defi/protocols/src/vendors/payments/utils/request-logger.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L21)

#### Constructors

##### Constructor

```ts
new RequestLogger(): RequestLogger;
```

###### Returns

[`RequestLogger`](/docs/api/defi/protocols/src/vendors/payments/utils/request-logger.md#requestlogger)

#### Methods

##### generateRequestId()

```ts
static generateRequestId(): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/request-logger.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L27)

Generate unique request ID

###### Returns

`string`

##### logApiRequestComplete()

```ts
static logApiRequestComplete(
   context: RequestLogContext, 
   statusCode: number, 
   responseSize?: number, 
   error?: unknown): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/request-logger.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L118)

Log API request completion

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`RequestLogContext`](/docs/api/defi/protocols/src/vendors/payments/utils/request-logger.md#requestlogcontext) |
| `statusCode` | `number` |
| `responseSize?` | `number` |
| `error?` | `unknown` |

###### Returns

`void`

##### logApiRequestStart()

```ts
static logApiRequestStart(
   method: string, 
   url: string, 
   operation?: string): RequestLogContext;
```

Defined in: [defi/protocols/src/vendors/payments/utils/request-logger.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L92)

Log API request start

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `method` | `string` |
| `url` | `string` |
| `operation?` | `string` |

###### Returns

[`RequestLogContext`](/docs/api/defi/protocols/src/vendors/payments/utils/request-logger.md#requestlogcontext)

##### logToolRequestComplete()

```ts
static logToolRequestComplete(
   context: RequestLogContext, 
   success: boolean, 
   error?: unknown): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/request-logger.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L63)

Log MCP tool request completion

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`RequestLogContext`](/docs/api/defi/protocols/src/vendors/payments/utils/request-logger.md#requestlogcontext) |
| `success` | `boolean` |
| `error?` | `unknown` |

###### Returns

`void`

##### logToolRequestStart()

```ts
static logToolRequestStart(toolName: string, args?: unknown): RequestLogContext;
```

Defined in: [defi/protocols/src/vendors/payments/utils/request-logger.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L37)

Log MCP tool request start

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolName` | `string` |
| `args?` | `unknown` |

###### Returns

[`RequestLogContext`](/docs/api/defi/protocols/src/vendors/payments/utils/request-logger.md#requestlogcontext)

## Interfaces

### RequestLogContext

Defined in: [defi/protocols/src/vendors/payments/utils/request-logger.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L13)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="operation"></a> `operation` | `string` | [defi/protocols/src/vendors/payments/utils/request-logger.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L15) |
| <a id="requestid"></a> `requestId` | `string` | [defi/protocols/src/vendors/payments/utils/request-logger.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L14) |
| <a id="starttime"></a> `startTime` | `number` | [defi/protocols/src/vendors/payments/utils/request-logger.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L16) |
| <a id="toolname"></a> `toolName?` | `string` | [defi/protocols/src/vendors/payments/utils/request-logger.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L17) |
| <a id="userid"></a> `userId?` | `string` | [defi/protocols/src/vendors/payments/utils/request-logger.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/request-logger.ts#L18) |

## References

### default

Renames and re-exports [RequestLogger](/docs/api/defi/protocols/src/vendors/payments/utils/request-logger.md#requestlogger)
