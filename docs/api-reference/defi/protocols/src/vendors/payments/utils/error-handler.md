[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/error-handler

# defi/protocols/src/vendors/payments/utils/error-handler

## Classes

### AuthenticationError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L56)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new AuthenticationError(message: string, details?: unknown): AuthenticationError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L57)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Authentication failed'` |
| `details?` | `unknown` | `undefined` |

###### Returns

[`AuthenticationError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#authenticationerror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### AuthorizationError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L62)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new AuthorizationError(message: string, details?: unknown): AuthorizationError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L63)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Access denied'` |
| `details?` | `unknown` | `undefined` |

###### Returns

[`AuthorizationError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#authorizationerror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-1"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-1"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-1"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-1"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### ConflictError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L74)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new ConflictError(message: string, details?: unknown): ConflictError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L75)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Resource conflict'` |
| `details?` | `unknown` | `undefined` |

###### Returns

[`ConflictError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#conflicterror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-2"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-2"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-2"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-2"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### ErrorHandler

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L107)

Error handler class for processing and formatting errors

#### Constructors

##### Constructor

```ts
new ErrorHandler(): ErrorHandler;
```

###### Returns

[`ErrorHandler`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#errorhandler)

#### Methods

##### createErrorResponse()

```ts
static createErrorResponse(
   error: unknown, 
   context: "api" | "mcp" | "log", 
   operation?: string): any;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:356](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L356)

Create error response for different contexts

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |
| `context` | `"api"` \| `"mcp"` \| `"log"` |
| `operation?` | `string` |

###### Returns

`any`

##### formatMCPError()

```ts
static formatMCPError(error: unknown, operation?: string): {
  content: {
     text: string;
     type: "text";
  }[];
  isError: true;
};
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L244)

Format error for MCP response

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |
| `operation?` | `string` |

###### Returns

```ts
{
  content: {
     text: string;
     type: "text";
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `"text"`; \}[] | [defi/protocols/src/vendors/payments/utils/error-handler.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L248) |
| `isError` | `true` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L249) |

##### getStatusCode()

```ts
static getStatusCode(error: unknown): number;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L305)

Get HTTP status code from error

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

###### Returns

`number`

##### isRetryableError()

```ts
static isRetryableError(error: unknown): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L279)

Check if error is retryable

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

###### Returns

`boolean`

##### processError()

```ts
static processError(error: unknown, operation?: string): ErrorDetails;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L111)

Process error and return structured error details

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |
| `operation?` | `string` |

###### Returns

[`ErrorDetails`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#errordetails)

##### sanitizeErrorForClient()

```ts
static sanitizeErrorForClient(errorDetails: ErrorDetails): ErrorDetails;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:394](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L394)

Sanitize error details for client response (remove sensitive information)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `errorDetails` | [`ErrorDetails`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#errordetails) |

###### Returns

[`ErrorDetails`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#errordetails)

***

### InternalServerError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L98)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new InternalServerError(message: string, details?: unknown): InternalServerError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L99)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Internal server error'` |
| `details?` | `unknown` | `undefined` |

###### Returns

[`InternalServerError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#internalservererror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-3"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-3"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-3"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-3"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### MCPError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L28)

#### Extends

- `Error`

#### Extended by

- [`ValidationError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#validationerror)
- [`AuthenticationError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#authenticationerror)
- [`AuthorizationError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#authorizationerror)
- [`NotFoundError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#notfounderror)
- [`ConflictError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#conflicterror)
- [`RateLimitError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#ratelimiterror)
- [`ServiceUnavailableError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#serviceunavailableerror)
- [`TimeoutError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#timeouterror)
- [`InternalServerError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#internalservererror)

#### Constructors

##### Constructor

```ts
new MCPError(
   message: string, 
   statusCode: number, 
   code: string, 
   details?: unknown, 
   operation?: string): MCPError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L34)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `statusCode` | `number` |
| `code` | `string` |
| `details?` | `unknown` |
| `operation?` | `string` |

###### Returns

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="code-4"></a> `code` | `readonly` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-4"></a> `details?` | `readonly` | `unknown` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-4"></a> `operation?` | `readonly` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-4"></a> `statusCode` | `readonly` | `number` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### NotFoundError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L68)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new NotFoundError(message: string, details?: unknown): NotFoundError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L69)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Resource not found'` |
| `details?` | `unknown` | `undefined` |

###### Returns

[`NotFoundError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#notfounderror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-5"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-5"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-5"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-5"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### RateLimitError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L80)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new RateLimitError(message: string, details?: unknown): RateLimitError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L81)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Rate limit exceeded'` |
| `details?` | `unknown` | `undefined` |

###### Returns

[`RateLimitError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#ratelimiterror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-6"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-6"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-6"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-6"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### ServiceUnavailableError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L86)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new ServiceUnavailableError(message: string, details?: unknown): ServiceUnavailableError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L87)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Service temporarily unavailable'` |
| `details?` | `unknown` | `undefined` |

###### Returns

[`ServiceUnavailableError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#serviceunavailableerror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-7"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-7"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-7"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-7"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### TimeoutError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L92)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new TimeoutError(message: string, details?: unknown): TimeoutError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L93)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `'Request timeout'` |
| `details?` | `unknown` | `undefined` |

###### Returns

[`TimeoutError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#timeouterror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-8"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-8"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-8"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-8"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

***

### ValidationError

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L50)

#### Extends

- [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror)

#### Constructors

##### Constructor

```ts
new ValidationError(
   message: string, 
   field?: string, 
   code?: string): ValidationError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L51)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `undefined` |
| `field?` | `string` | `undefined` |
| `code?` | `string` | `'VALIDATION_ERROR'` |

###### Returns

[`ValidationError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#validationerror)

###### Overrides

[`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#constructor-5)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-9"></a> `code` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`code`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#code-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L30) |
| <a id="details-9"></a> `details?` | `readonly` | `unknown` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`details`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#details-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L31) |
| <a id="operation-9"></a> `operation?` | `readonly` | `string` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`operation`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#operation-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L32) |
| <a id="statuscode-9"></a> `statusCode` | `readonly` | `number` | [`MCPError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#mcperror).[`statusCode`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#statuscode-4) | [defi/protocols/src/vendors/payments/utils/error-handler.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L29) |

## Interfaces

### ErrorDetails

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L13)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="code-10"></a> `code` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L14) |
| <a id="details-10"></a> `details?` | `unknown` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L17) |
| <a id="message"></a> `message` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L15) |
| <a id="operation-10"></a> `operation?` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L19) |
| <a id="statuscode-10"></a> `statusCode` | `number` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L16) |
| <a id="timestamp"></a> `timestamp` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L18) |

***

### ValidationErrorDetail

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L22)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="code-11"></a> `code` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L25) |
| <a id="field"></a> `field?` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L23) |
| <a id="message-1"></a> `message` | `string` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L24) |

## Variables

### formatMCPError()

```ts
formatMCPError: (error: unknown, operation?: string) => {
  content: {
     text: string;
     type: "text";
  }[];
  isError: true;
};
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:463](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L463)

Format error for MCP response

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |
| `operation?` | `string` |

#### Returns

```ts
{
  content: {
     text: string;
     type: "text";
  }[];
  isError: true;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `content` | \{ `text`: `string`; `type`: `"text"`; \}[] | [defi/protocols/src/vendors/payments/utils/error-handler.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L248) |
| `isError` | `true` | [defi/protocols/src/vendors/payments/utils/error-handler.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L249) |

***

### getStatusCode()

```ts
getStatusCode: (error: unknown) => number;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:463](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L463)

Get HTTP status code from error

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

#### Returns

`number`

***

### isRetryableError()

```ts
isRetryableError: (error: unknown) => boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:463](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L463)

Check if error is retryable

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

#### Returns

`boolean`

***

### processError()

```ts
processError: (error: unknown, operation?: string) => ErrorDetails;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:463](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L463)

Process error and return structured error details

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |
| `operation?` | `string` |

#### Returns

[`ErrorDetails`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#errordetails)

## Functions

### createNotFoundError()

```ts
function createNotFoundError(resource: string, identifier?: string): NotFoundError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:430](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L430)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `resource` | `string` |
| `identifier?` | `string` |

#### Returns

[`NotFoundError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#notfounderror)

***

### createServiceUnavailableError()

```ts
function createServiceUnavailableError(service: string, reason?: string): ServiceUnavailableError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:451](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L451)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `service` | `string` |
| `reason?` | `string` |

#### Returns

[`ServiceUnavailableError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#serviceunavailableerror)

***

### createTimeoutError()

```ts
function createTimeoutError(operation: string, timeout: number): TimeoutError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:441](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L441)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `operation` | `string` |
| `timeout` | `number` |

#### Returns

[`TimeoutError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#timeouterror)

***

### createValidationError()

```ts
function createValidationError(message: string, field?: string): ValidationError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/error-handler.ts:423](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/error-handler.ts#L423)

Utility functions for common error scenarios

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `field?` | `string` |

#### Returns

[`ValidationError`](/docs/api/defi/protocols/src/vendors/payments/utils/error-handler.md#validationerror)
