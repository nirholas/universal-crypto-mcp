[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / logger

# logger

Structured Logging with Pino

Provides consistent, structured logging across all packages.
Supports log levels, context, and sensitive data masking.

## Author

nich <nich@nichxbt.com>

## Interfaces

### LogContext

Defined in: [shared/utils/src/logger/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L17)

#### Indexable

```ts
[key: string]: unknown
```

***

### Logger

Defined in: [shared/utils/src/logger/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L21)

#### Methods

##### child()

```ts
child(bindings: LogContext): Logger;
```

Defined in: [shared/utils/src/logger/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L28)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `bindings` | [`LogContext`](/docs/api/logger.md#logcontext) |

###### Returns

[`Logger`](/docs/api/logger.md#logger)

##### debug()

```ts
debug(msg: string, context?: LogContext): void;
```

Defined in: [shared/utils/src/logger/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L23)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `msg` | `string` |
| `context?` | [`LogContext`](/docs/api/logger.md#logcontext) |

###### Returns

`void`

##### error()

```ts
error(msg: string, context?: LogContext): void;
```

Defined in: [shared/utils/src/logger/index.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L26)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `msg` | `string` |
| `context?` | [`LogContext`](/docs/api/logger.md#logcontext) |

###### Returns

`void`

##### fatal()

```ts
fatal(msg: string, context?: LogContext): void;
```

Defined in: [shared/utils/src/logger/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L27)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `msg` | `string` |
| `context?` | [`LogContext`](/docs/api/logger.md#logcontext) |

###### Returns

`void`

##### info()

```ts
info(msg: string, context?: LogContext): void;
```

Defined in: [shared/utils/src/logger/index.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L24)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `msg` | `string` |
| `context?` | [`LogContext`](/docs/api/logger.md#logcontext) |

###### Returns

`void`

##### trace()

```ts
trace(msg: string, context?: LogContext): void;
```

Defined in: [shared/utils/src/logger/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L22)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `msg` | `string` |
| `context?` | [`LogContext`](/docs/api/logger.md#logcontext) |

###### Returns

`void`

##### warn()

```ts
warn(msg: string, context?: LogContext): void;
```

Defined in: [shared/utils/src/logger/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L25)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `msg` | `string` |
| `context?` | [`LogContext`](/docs/api/logger.md#logcontext) |

###### Returns

`void`

***

### LoggerConfig

Defined in: [shared/utils/src/logger/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L31)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="destination"></a> `destination?` | `string` | [shared/utils/src/logger/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L35) |
| <a id="level"></a> `level?` | [`LogLevel`](/docs/api/logger.md#loglevel) | [shared/utils/src/logger/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L33) |
| <a id="name"></a> `name` | `string` | [shared/utils/src/logger/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L32) |
| <a id="pretty"></a> `pretty?` | `boolean` | [shared/utils/src/logger/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L34) |
| <a id="redact"></a> `redact?` | `string`[] | [shared/utils/src/logger/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L36) |

## Type Aliases

### LogLevel

```ts
type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
```

Defined in: [shared/utils/src/logger/index.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L15)

## Variables

### LOG\_LEVELS

```ts
const LOG_LEVELS: Record<LogLevel, number>;
```

Defined in: [shared/utils/src/logger/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L69)

Log levels for reference

***

### logger

```ts
const logger: Logger;
```

Defined in: [shared/utils/src/logger/index.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L261)

## Functions

### createLogger()

```ts
function createLogger(config: string | LoggerConfig): Logger;
```

Defined in: [shared/utils/src/logger/index.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L222)

Create or get a logger instance

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `string` \| [`LoggerConfig`](/docs/api/logger.md#loggerconfig) |

#### Returns

[`Logger`](/docs/api/logger.md#logger)

***

### getLogger()

```ts
function getLogger(name: string): Logger | undefined;
```

Defined in: [shared/utils/src/logger/index.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L246)

Get an existing logger

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`Logger`](/docs/api/logger.md#logger) \| `undefined`

***

### moduleLogger()

```ts
function moduleLogger(moduleName: string): Logger;
```

Defined in: [shared/utils/src/logger/index.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L274)

Create a logger for a specific module/package

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

[`Logger`](/docs/api/logger.md#logger)

***

### redactSensitive()

```ts
function redactSensitive(obj: unknown, patterns: string[]): unknown;
```

Defined in: [shared/utils/src/logger/index.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L92)

Redact sensitive values from an object

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `obj` | `unknown` | `undefined` |
| `patterns` | `string`[] | `DEFAULT_REDACT_PATTERNS` |

#### Returns

`unknown`

***

### setGlobalLogLevel()

```ts
function setGlobalLogLevel(level: LogLevel): void;
```

Defined in: [shared/utils/src/logger/index.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L253)

Set global log level for all loggers

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `level` | [`LogLevel`](/docs/api/logger.md#loglevel) |

#### Returns

`void`

***

### withLogging()

```ts
function withLogging<T>(
   log: Logger, 
   operation: string, 
   fn: () => Promise<T>, 
context?: LogContext): Promise<T>;
```

Defined in: [shared/utils/src/logger/index.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/logger/index.ts#L284)

Log function execution with timing

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `log` | [`Logger`](/docs/api/logger.md#logger) |
| `operation` | `string` |
| `fn` | () => `Promise`\<`T`\> |
| `context?` | [`LogContext`](/docs/api/logger.md#logcontext) |

#### Returns

`Promise`\<`T`\>
