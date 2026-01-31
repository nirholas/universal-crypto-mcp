[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / errors

# errors

Standardized Error Handling

Provides consistent error types and handling across all packages.

## Author

nich <nich@nichxbt.com>

## Classes

### AgentError

Defined in: [shared/utils/src/errors/index.ts:313](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L313)

Agent execution error

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new AgentError(message: string, options?: {
  action?: string;
  agentId?: string;
  cause?: Error;
  code?: string;
  context?: Record<string, unknown>;
}): AgentError;
```

Defined in: [shared/utils/src/errors/index.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L317)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | \{ `action?`: `string`; `agentId?`: `string`; `cause?`: `Error`; `code?`: `string`; `context?`: `Record`\<`string`, `unknown`\>; \} |
| `options.action?` | `string` |
| `options.agentId?` | `string` |
| `options.cause?` | `Error` |
| `options.code?` | `string` |
| `options.context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`AgentError`](/docs/api/errors.md#agenterror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="action"></a> `action?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:315](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L315) |
| <a id="agentid"></a> `agentId?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L314) |
| <a id="cause"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="timestamp"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### ApiError

Defined in: [shared/utils/src/errors/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L82)

API errors from external services

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new ApiError(message: string, options?: {
  cause?: Error;
  code?: string;
  context?: Record<string, unknown>;
  endpoint?: string;
  statusCode?: number;
}): ApiError;
```

Defined in: [shared/utils/src/errors/index.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L86)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | \{ `cause?`: `Error`; `code?`: `string`; `context?`: `Record`\<`string`, `unknown`\>; `endpoint?`: `string`; `statusCode?`: `number`; \} |
| `options.cause?` | `Error` |
| `options.code?` | `string` |
| `options.context?` | `Record`\<`string`, `unknown`\> |
| `options.endpoint?` | `string` |
| `options.statusCode?` | `number` |

###### Returns

[`ApiError`](/docs/api/errors.md#apierror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-1"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-1"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-1"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="endpoint"></a> `endpoint?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L84) |
| <a id="statuscode"></a> `statusCode?` | `readonly` | `number` | - | - | [shared/utils/src/errors/index.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L83) |
| <a id="timestamp-1"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### fromResponse()

```ts
static fromResponse(
   statusCode: number, 
   body: unknown, 
   endpoint?: string): ApiError;
```

Defined in: [shared/utils/src/errors/index.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L105)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `statusCode` | `number` |
| `body` | `unknown` |
| `endpoint?` | `string` |

###### Returns

[`ApiError`](/docs/api/errors.md#apierror)

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### AuthenticationError

Defined in: [shared/utils/src/errors/index.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L180)

Authentication error

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new AuthenticationError(message: string, options?: {
  cause?: Error;
  context?: Record<string, unknown>;
}): AuthenticationError;
```

Defined in: [shared/utils/src/errors/index.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L181)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Authentication failed'` |
| `options?` | \{ `cause?`: `Error`; `context?`: `Record`\<`string`, `unknown`\>; \} | `undefined` |
| `options.cause?` | `Error` | `undefined` |
| `options.context?` | `Record`\<`string`, `unknown`\> | `undefined` |

###### Returns

[`AuthenticationError`](/docs/api/errors.md#authenticationerror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-2"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-2"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-2"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="timestamp-2"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### AuthorizationError

Defined in: [shared/utils/src/errors/index.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L193)

Authorization error (authenticated but not allowed)

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new AuthorizationError(message: string, options?: {
  cause?: Error;
  context?: Record<string, unknown>;
  requiredPermission?: string;
}): AuthorizationError;
```

Defined in: [shared/utils/src/errors/index.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L196)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Not authorized'` |
| `options?` | \{ `cause?`: `Error`; `context?`: `Record`\<`string`, `unknown`\>; `requiredPermission?`: `string`; \} | `undefined` |
| `options.cause?` | `Error` | `undefined` |
| `options.context?` | `Record`\<`string`, `unknown`\> | `undefined` |
| `options.requiredPermission?` | `string` | `undefined` |

###### Returns

[`AuthorizationError`](/docs/api/errors.md#authorizationerror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-3"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-3"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-3"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="requiredpermission"></a> `requiredPermission?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L194) |
| <a id="timestamp-3"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### BlockchainError

Defined in: [shared/utils/src/errors/index.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L286)

Blockchain/transaction error

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new BlockchainError(message: string, options?: {
  cause?: Error;
  chainId?: number;
  code?: string;
  context?: Record<string, unknown>;
  txHash?: string;
}): BlockchainError;
```

Defined in: [shared/utils/src/errors/index.ts:290](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L290)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | \{ `cause?`: `Error`; `chainId?`: `number`; `code?`: `string`; `context?`: `Record`\<`string`, `unknown`\>; `txHash?`: `string`; \} |
| `options.cause?` | `Error` |
| `options.chainId?` | `number` |
| `options.code?` | `string` |
| `options.context?` | `Record`\<`string`, `unknown`\> |
| `options.txHash?` | `string` |

###### Returns

[`BlockchainError`](/docs/api/errors.md#blockchainerror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-4"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="chainid"></a> `chainId?` | `readonly` | `number` | - | - | [shared/utils/src/errors/index.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L287) |
| <a id="code-4"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-4"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="timestamp-4"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |
| <a id="txhash"></a> `txHash?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:288](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L288) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### ConfigurationError

Defined in: [shared/utils/src/errors/index.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L267)

Configuration error

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new ConfigurationError(message: string, options?: {
  cause?: Error;
  configKey?: string;
  context?: Record<string, unknown>;
}): ConfigurationError;
```

Defined in: [shared/utils/src/errors/index.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L270)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | \{ `cause?`: `Error`; `configKey?`: `string`; `context?`: `Record`\<`string`, `unknown`\>; \} |
| `options.cause?` | `Error` |
| `options.configKey?` | `string` |
| `options.context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`ConfigurationError`](/docs/api/errors.md#configurationerror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-5"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-5"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="configkey"></a> `configKey?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L268) |
| <a id="context-5"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="timestamp-5"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### GuardrailError

Defined in: [shared/utils/src/errors/index.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L340)

Guardrail violation error

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new GuardrailError(message: string, options: {
  actual?: unknown;
  context?: Record<string, unknown>;
  guardrail: string;
  threshold?: unknown;
}): GuardrailError;
```

Defined in: [shared/utils/src/errors/index.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L345)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options` | \{ `actual?`: `unknown`; `context?`: `Record`\<`string`, `unknown`\>; `guardrail`: `string`; `threshold?`: `unknown`; \} |
| `options.actual?` | `unknown` |
| `options.context?` | `Record`\<`string`, `unknown`\> |
| `options.guardrail` | `string` |
| `options.threshold?` | `unknown` |

###### Returns

[`GuardrailError`](/docs/api/errors.md#guardrailerror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="actual"></a> `actual?` | `readonly` | `unknown` | - | - | [shared/utils/src/errors/index.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L343) |
| <a id="cause-6"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-6"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-6"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="guardrail"></a> `guardrail` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L341) |
| <a id="threshold"></a> `threshold?` | `readonly` | `unknown` | - | - | [shared/utils/src/errors/index.ts:342](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L342) |
| <a id="timestamp-6"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### NetworkError

Defined in: [shared/utils/src/errors/index.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L246)

Network error (connection issues)

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new NetworkError(message: string, options?: {
  cause?: Error;
  context?: Record<string, unknown>;
  host?: string;
  port?: number;
}): NetworkError;
```

Defined in: [shared/utils/src/errors/index.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L250)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Network error'` |
| `options?` | \{ `cause?`: `Error`; `context?`: `Record`\<`string`, `unknown`\>; `host?`: `string`; `port?`: `number`; \} | `undefined` |
| `options.cause?` | `Error` | `undefined` |
| `options.context?` | `Record`\<`string`, `unknown`\> | `undefined` |
| `options.host?` | `string` | `undefined` |
| `options.port?` | `number` | `undefined` |

###### Returns

[`NetworkError`](/docs/api/errors.md#networkerror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-7"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-7"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-7"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="host"></a> `host?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L247) |
| <a id="port"></a> `port?` | `readonly` | `number` | - | - | [shared/utils/src/errors/index.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L248) |
| <a id="timestamp-7"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### RateLimitError

Defined in: [shared/utils/src/errors/index.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L128)

Rate limit exceeded error

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new RateLimitError(message: string, options?: {
  context?: Record<string, unknown>;
  limit?: number;
  remaining?: number;
  retryAfter?: number;
}): RateLimitError;
```

Defined in: [shared/utils/src/errors/index.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L133)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Rate limit exceeded'` |
| `options?` | \{ `context?`: `Record`\<`string`, `unknown`\>; `limit?`: `number`; `remaining?`: `number`; `retryAfter?`: `number`; \} | `undefined` |
| `options.context?` | `Record`\<`string`, `unknown`\> | `undefined` |
| `options.limit?` | `number` | `undefined` |
| `options.remaining?` | `number` | `undefined` |
| `options.retryAfter?` | `number` | `undefined` |

###### Returns

[`RateLimitError`](/docs/api/errors.md#ratelimiterror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-8"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-8"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-8"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="limit"></a> `limit?` | `readonly` | `number` | - | - | [shared/utils/src/errors/index.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L130) |
| <a id="remaining"></a> `remaining?` | `readonly` | `number` | - | - | [shared/utils/src/errors/index.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L131) |
| <a id="retryafter"></a> `retryAfter?` | `readonly` | `number` | - | - | [shared/utils/src/errors/index.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L129) |
| <a id="timestamp-8"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### TimeoutError

Defined in: [shared/utils/src/errors/index.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L160)

Timeout error

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new TimeoutError(message: string, options?: {
  context?: Record<string, unknown>;
  operation?: string;
  timeoutMs?: number;
}): TimeoutError;
```

Defined in: [shared/utils/src/errors/index.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L164)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Operation timed out'` |
| `options?` | \{ `context?`: `Record`\<`string`, `unknown`\>; `operation?`: `string`; `timeoutMs?`: `number`; \} | `undefined` |
| `options.context?` | `Record`\<`string`, `unknown`\> | `undefined` |
| `options.operation?` | `string` | `undefined` |
| `options.timeoutMs?` | `number` | `undefined` |

###### Returns

[`TimeoutError`](/docs/api/errors.md#timeouterror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-9"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-9"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-9"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="operation"></a> `operation?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L162) |
| <a id="timeoutms"></a> `timeoutMs` | `readonly` | `number` | - | - | [shared/utils/src/errors/index.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L161) |
| <a id="timestamp-9"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

***

### UCMCPError

Defined in: [shared/utils/src/errors/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L17)

Base error class for all Universal Crypto MCP errors

#### Extends

- `Error`

#### Extended by

- [`ApiError`](/docs/api/errors.md#apierror)
- [`RateLimitError`](/docs/api/errors.md#ratelimiterror)
- [`TimeoutError`](/docs/api/errors.md#timeouterror)
- [`AuthenticationError`](/docs/api/errors.md#authenticationerror)
- [`AuthorizationError`](/docs/api/errors.md#authorizationerror)
- [`ValidationError`](/docs/api/errors.md#validationerror)
- [`NetworkError`](/docs/api/errors.md#networkerror)
- [`ConfigurationError`](/docs/api/errors.md#configurationerror)
- [`BlockchainError`](/docs/api/errors.md#blockchainerror)
- [`AgentError`](/docs/api/errors.md#agenterror)
- [`GuardrailError`](/docs/api/errors.md#guardrailerror)

#### Constructors

##### Constructor

```ts
new UCMCPError(
   message: string, 
   code: string, 
   options?: {
  cause?: Error;
  context?: Record<string, unknown>;
}): UCMCPError;
```

Defined in: [shared/utils/src/errors/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L23)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `code` | `string` |
| `options?` | \{ `cause?`: `Error`; `context?`: `Record`\<`string`, `unknown`\>; \} |
| `options.cause?` | `Error` |
| `options.context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`UCMCPError`](/docs/api/errors.md#ucmcperror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Description | Overrides | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-10"></a> `cause?` | `readonly` | `Error` | The cause of the error. | `Error.cause` | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-10"></a> `code` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="context-10"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | - | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="timestamp-10"></a> `timestamp` | `readonly` | `Date` | - | - | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

***

### ValidationError

Defined in: [shared/utils/src/errors/index.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L212)

Validation error for invalid inputs

#### Extends

- [`UCMCPError`](/docs/api/errors.md#ucmcperror)

#### Constructors

##### Constructor

```ts
new ValidationError(message: string, options?: {
  cause?: Error;
  constraints?: string[];
  context?: Record<string, unknown>;
  field?: string;
  value?: unknown;
}): ValidationError;
```

Defined in: [shared/utils/src/errors/index.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L217)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `options?` | \{ `cause?`: `Error`; `constraints?`: `string`[]; `context?`: `Record`\<`string`, `unknown`\>; `field?`: `string`; `value?`: `unknown`; \} |
| `options.cause?` | `Error` |
| `options.constraints?` | `string`[] |
| `options.context?` | `Record`\<`string`, `unknown`\> |
| `options.field?` | `string` |
| `options.value?` | `unknown` |

###### Returns

[`ValidationError`](/docs/api/errors.md#validationerror)

###### Overrides

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`constructor`](/docs/api/errors.md#constructor-10)

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ | :------ |
| <a id="cause-11"></a> `cause?` | `readonly` | `Error` | The cause of the error. | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`cause`](/docs/api/errors.md#cause-10) | [shared/utils/src/errors/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L21) |
| <a id="code-11"></a> `code` | `readonly` | `string` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`code`](/docs/api/errors.md#code-10) | [shared/utils/src/errors/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L18) |
| <a id="constraints"></a> `constraints?` | `readonly` | `string`[] | - | - | [shared/utils/src/errors/index.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L215) |
| <a id="context-11"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`context`](/docs/api/errors.md#context-10) | [shared/utils/src/errors/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L20) |
| <a id="field"></a> `field?` | `readonly` | `string` | - | - | [shared/utils/src/errors/index.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L213) |
| <a id="timestamp-11"></a> `timestamp` | `readonly` | `Date` | - | [`UCMCPError`](/docs/api/errors.md#ucmcperror).[`timestamp`](/docs/api/errors.md#timestamp-10) | [shared/utils/src/errors/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L19) |
| <a id="value"></a> `value?` | `readonly` | `unknown` | - | - | [shared/utils/src/errors/index.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L214) |

#### Methods

##### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [shared/utils/src/errors/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L42)

Convert to JSON for logging/serialization

###### Returns

`Record`\<`string`, `unknown`\>

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toJSON`](/docs/api/errors.md#tojson-20)

##### toMCPResponse()

```ts
toMCPResponse(): {
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
};
```

Defined in: [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57)

Convert to MCP error response format

###### Returns

```ts
{
  content: {
     text: string;
     type: string;
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `string`; \}[] | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |
| `isError` | `true` | [shared/utils/src/errors/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L57) |

###### Inherited from

[`UCMCPError`](/docs/api/errors.md#ucmcperror).[`toMCPResponse`](/docs/api/errors.md#tomcpresponse-20)

## Functions

### createErrorFromResponse()

```ts
function createErrorFromResponse(
   statusCode: number, 
   body?: unknown, 
   endpoint?: string): UCMCPError;
```

Defined in: [shared/utils/src/errors/index.ts:429](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L429)

Create error from HTTP response

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `statusCode` | `number` |
| `body?` | `unknown` |
| `endpoint?` | `string` |

#### Returns

[`UCMCPError`](/docs/api/errors.md#ucmcperror)

***

### getErrorMessage()

```ts
function getErrorMessage(error: unknown): string;
```

Defined in: [shared/utils/src/errors/index.ts:459](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L459)

Safely extract error message from unknown error

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

#### Returns

`string`

***

### isErrorCode()

```ts
function isErrorCode(error: unknown, code: string): error is UCMCPError;
```

Defined in: [shared/utils/src/errors/index.ts:408](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L408)

Check if an error is of a specific type

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |
| `code` | `string` |

#### Returns

`error is UCMCPError`

***

### isRetryableError()

```ts
function isRetryableError(error: unknown): boolean;
```

Defined in: [shared/utils/src/errors/index.ts:415](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L415)

Check if an error is retryable

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

#### Returns

`boolean`

***

### toUCMCPError()

```ts
function toUCMCPError(error: unknown, defaultCode: string): UCMCPError;
```

Defined in: [shared/utils/src/errors/index.ts:475](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L475)

Convert any error to UCMCPError

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `error` | `unknown` | `undefined` |
| `defaultCode` | `string` | `'UNKNOWN_ERROR'` |

#### Returns

[`UCMCPError`](/docs/api/errors.md#ucmcperror)

***

### withErrorHandling()

```ts
function withErrorHandling<T>(fn: () => Promise<T>, options?: {
  context?: Record<string, unknown>;
  errorMapper?: (error: unknown) => UCMCPError;
}): Promise<T>;
```

Defined in: [shared/utils/src/errors/index.ts:376](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/errors/index.ts#L376)

Wrap an async function with standardized error handling

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | () => `Promise`\<`T`\> |
| `options?` | \{ `context?`: `Record`\<`string`, `unknown`\>; `errorMapper?`: (`error`: `unknown`) => [`UCMCPError`](/docs/api/errors.md#ucmcperror); \} |
| `options.context?` | `Record`\<`string`, `unknown`\> |
| `options.errorMapper?` | (`error`: `unknown`) => [`UCMCPError`](/docs/api/errors.md#ucmcperror) |

#### Returns

`Promise`\<`T`\>
