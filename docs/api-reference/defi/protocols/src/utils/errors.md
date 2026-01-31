[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/utils/errors

# defi/protocols/src/utils/errors

## Classes

### AuthError

Defined in: [defi/protocols/src/utils/errors.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L60)

Authentication/authorization errors

#### Extends

- [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

#### Constructors

##### Constructor

```ts
new AuthError(message: string, context?: Record<string, unknown>): AuthError;
```

Defined in: [defi/protocols/src/utils/errors.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L61)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`AuthError`](/docs/api/defi/protocols/src/utils/errors.md#autherror)

###### Overrides

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/utils/errors.md#constructor-4)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code"></a> `code` | `readonly` | `string` | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`code`](/docs/api/defi/protocols/src/utils/errors.md#code-4) | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`context`](/docs/api/defi/protocols/src/utils/errors.md#context-4) | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

###### Inherited from

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`toJSON`](/docs/api/defi/protocols/src/utils/errors.md#tojson-8)

***

### ChainNotSupportedError

Defined in: [defi/protocols/src/utils/errors.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L137)

Chain not supported errors

#### Extends

- [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

#### Constructors

##### Constructor

```ts
new ChainNotSupportedError(chainId: number, context?: Record<string, unknown>): ChainNotSupportedError;
```

Defined in: [defi/protocols/src/utils/errors.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L140)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | `number` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`ChainNotSupportedError`](/docs/api/defi/protocols/src/utils/errors.md#chainnotsupportederror)

###### Overrides

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/utils/errors.md#constructor-4)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="chainid"></a> `chainId` | `readonly` | `number` | - | [defi/protocols/src/utils/errors.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L138) |
| <a id="code-1"></a> `code` | `readonly` | `string` | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`code`](/docs/api/defi/protocols/src/utils/errors.md#code-4) | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context-1"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`context`](/docs/api/defi/protocols/src/utils/errors.md#context-4) | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

###### Inherited from

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`toJSON`](/docs/api/defi/protocols/src/utils/errors.md#tojson-8)

***

### ContractError

Defined in: [defi/protocols/src/utils/errors.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L87)

Contract interaction errors

#### Extends

- [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

#### Constructors

##### Constructor

```ts
new ContractError(message: string, context?: Record<string, unknown>): ContractError;
```

Defined in: [defi/protocols/src/utils/errors.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L88)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`ContractError`](/docs/api/defi/protocols/src/utils/errors.md#contracterror)

###### Overrides

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/utils/errors.md#constructor-4)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-2"></a> `code` | `readonly` | `string` | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`code`](/docs/api/defi/protocols/src/utils/errors.md#code-4) | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context-2"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`context`](/docs/api/defi/protocols/src/utils/errors.md#context-4) | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

###### Inherited from

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`toJSON`](/docs/api/defi/protocols/src/utils/errors.md#tojson-8)

***

### InsufficientFundsError

Defined in: [defi/protocols/src/utils/errors.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L114)

Insufficient funds errors

#### Extends

- [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

#### Constructors

##### Constructor

```ts
new InsufficientFundsError(
   required: string, 
   available: string, 
   context?: Record<string, unknown>): InsufficientFundsError;
```

Defined in: [defi/protocols/src/utils/errors.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L118)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `required` | `string` |
| `available` | `string` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`InsufficientFundsError`](/docs/api/defi/protocols/src/utils/errors.md#insufficientfundserror)

###### Overrides

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/utils/errors.md#constructor-4)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="available"></a> `available` | `readonly` | `string` | - | [defi/protocols/src/utils/errors.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L116) |
| <a id="code-3"></a> `code` | `readonly` | `string` | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`code`](/docs/api/defi/protocols/src/utils/errors.md#code-4) | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context-3"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`context`](/docs/api/defi/protocols/src/utils/errors.md#context-4) | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |
| <a id="required"></a> `required` | `readonly` | `string` | - | [defi/protocols/src/utils/errors.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L115) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

###### Inherited from

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`toJSON`](/docs/api/defi/protocols/src/utils/errors.md#tojson-8)

***

### McpError

Defined in: [defi/protocols/src/utils/errors.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L11)

Base error class for MCP errors

#### Extends

- `Error`

#### Extended by

- [`NetworkError`](/docs/api/defi/protocols/src/utils/errors.md#networkerror)
- [`ValidationError`](/docs/api/defi/protocols/src/utils/errors.md#validationerror)
- [`AuthError`](/docs/api/defi/protocols/src/utils/errors.md#autherror)
- [`RateLimitError`](/docs/api/defi/protocols/src/utils/errors.md#ratelimiterror)
- [`ContractError`](/docs/api/defi/protocols/src/utils/errors.md#contracterror)
- [`TransactionError`](/docs/api/defi/protocols/src/utils/errors.md#transactionerror)
- [`InsufficientFundsError`](/docs/api/defi/protocols/src/utils/errors.md#insufficientfundserror)
- [`ChainNotSupportedError`](/docs/api/defi/protocols/src/utils/errors.md#chainnotsupportederror)

#### Constructors

##### Constructor

```ts
new McpError(
   message: string, 
   code: string, 
   context?: Record<string, unknown>): McpError;
```

Defined in: [defi/protocols/src/utils/errors.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L15)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `code` | `string` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="code-4"></a> `code` | `readonly` | `string` | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context-4"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

***

### NetworkError

Defined in: [defi/protocols/src/utils/errors.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L40)

Network-related errors

#### Extends

- [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

#### Constructors

##### Constructor

```ts
new NetworkError(message: string, context?: Record<string, unknown>): NetworkError;
```

Defined in: [defi/protocols/src/utils/errors.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L41)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`NetworkError`](/docs/api/defi/protocols/src/utils/errors.md#networkerror)

###### Overrides

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/utils/errors.md#constructor-4)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-5"></a> `code` | `readonly` | `string` | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`code`](/docs/api/defi/protocols/src/utils/errors.md#code-4) | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context-5"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`context`](/docs/api/defi/protocols/src/utils/errors.md#context-4) | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

###### Inherited from

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`toJSON`](/docs/api/defi/protocols/src/utils/errors.md#tojson-8)

***

### RateLimitError

Defined in: [defi/protocols/src/utils/errors.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L70)

Rate limiting errors

#### Extends

- [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

#### Constructors

##### Constructor

```ts
new RateLimitError(
   message: string, 
   retryAfter?: number, 
   context?: Record<string, unknown>): RateLimitError;
```

Defined in: [defi/protocols/src/utils/errors.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L73)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `retryAfter?` | `number` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`RateLimitError`](/docs/api/defi/protocols/src/utils/errors.md#ratelimiterror)

###### Overrides

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/utils/errors.md#constructor-4)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-6"></a> `code` | `readonly` | `string` | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`code`](/docs/api/defi/protocols/src/utils/errors.md#code-4) | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context-6"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`context`](/docs/api/defi/protocols/src/utils/errors.md#context-4) | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |
| <a id="retryafter"></a> `retryAfter?` | `readonly` | `number` | - | [defi/protocols/src/utils/errors.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L71) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

###### Inherited from

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`toJSON`](/docs/api/defi/protocols/src/utils/errors.md#tojson-8)

***

### TransactionError

Defined in: [defi/protocols/src/utils/errors.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L97)

Transaction errors

#### Extends

- [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

#### Constructors

##### Constructor

```ts
new TransactionError(
   message: string, 
   txHash?: string, 
   context?: Record<string, unknown>): TransactionError;
```

Defined in: [defi/protocols/src/utils/errors.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L100)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `txHash?` | `string` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`TransactionError`](/docs/api/defi/protocols/src/utils/errors.md#transactionerror)

###### Overrides

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/utils/errors.md#constructor-4)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-7"></a> `code` | `readonly` | `string` | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`code`](/docs/api/defi/protocols/src/utils/errors.md#code-4) | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context-7"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`context`](/docs/api/defi/protocols/src/utils/errors.md#context-4) | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |
| <a id="txhash"></a> `txHash?` | `readonly` | `string` | - | [defi/protocols/src/utils/errors.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L98) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

###### Inherited from

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`toJSON`](/docs/api/defi/protocols/src/utils/errors.md#tojson-8)

***

### ValidationError

Defined in: [defi/protocols/src/utils/errors.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L50)

Validation errors

#### Extends

- [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)

#### Constructors

##### Constructor

```ts
new ValidationError(message: string, context?: Record<string, unknown>): ValidationError;
```

Defined in: [defi/protocols/src/utils/errors.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L51)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `context?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`ValidationError`](/docs/api/defi/protocols/src/utils/errors.md#validationerror)

###### Overrides

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`constructor`](/docs/api/defi/protocols/src/utils/errors.md#constructor-4)

#### Properties

| Property | Modifier | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="code-8"></a> `code` | `readonly` | `string` | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`code`](/docs/api/defi/protocols/src/utils/errors.md#code-4) | [defi/protocols/src/utils/errors.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L12) |
| <a id="context-8"></a> `context?` | `readonly` | `Record`\<`string`, `unknown`\> | [`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`context`](/docs/api/defi/protocols/src/utils/errors.md#context-4) | [defi/protocols/src/utils/errors.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L13) |

#### Methods

##### toJSON()

```ts
toJSON(): {
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
};
```

Defined in: [defi/protocols/src/utils/errors.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L27)

###### Returns

```ts
{
  code: string;
  context: Record<string, unknown> | undefined;
  message: string;
  name: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [defi/protocols/src/utils/errors.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L31) |
| `context` | `Record`\<`string`, `unknown`\> \| `undefined` | [defi/protocols/src/utils/errors.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L32) |
| `message` | `string` | [defi/protocols/src/utils/errors.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L30) |
| `name` | `string` | [defi/protocols/src/utils/errors.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L29) |

###### Inherited from

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror).[`toJSON`](/docs/api/defi/protocols/src/utils/errors.md#tojson-8)

## Interfaces

### RetryConfig

Defined in: [defi/protocols/src/utils/errors.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L185)

Retry configuration

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="basedelayms"></a> `baseDelayMs` | `number` | [defi/protocols/src/utils/errors.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L187) |
| <a id="maxdelayms"></a> `maxDelayMs` | `number` | [defi/protocols/src/utils/errors.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L188) |
| <a id="maxretries"></a> `maxRetries` | `number` | [defi/protocols/src/utils/errors.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L186) |
| <a id="shouldretry"></a> `shouldRetry?` | (`error`: `unknown`, `attempt`: `number`) => `boolean` | [defi/protocols/src/utils/errors.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L189) |

## Functions

### getErrorMessage()

```ts
function getErrorMessage(error: unknown): string;
```

Defined in: [defi/protocols/src/utils/errors.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L150)

Helper to extract error message from unknown error

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

#### Returns

`string`

***

### withRetry()

```ts
function withRetry<T>(fn: () => Promise<T>, config: Partial<RetryConfig>): Promise<T>;
```

Defined in: [defi/protocols/src/utils/errors.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L207)

Retry a function with exponential backoff

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | () => `Promise`\<`T`\> |
| `config` | `Partial`\<[`RetryConfig`](/docs/api/defi/protocols/src/utils/errors.md#retryconfig)\> |

#### Returns

`Promise`\<`T`\>

***

### wrapError()

```ts
function wrapError(error: unknown, defaultMessage: string): McpError;
```

Defined in: [defi/protocols/src/utils/errors.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/errors.ts#L166)

Helper to wrap unknown errors in McpError

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |
| `defaultMessage` | `string` |

#### Returns

[`McpError`](/docs/api/defi/protocols/src/utils/errors.md#mcperror)
