[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / shared/mcp-utils/src

# shared/mcp-utils/src

## Interfaces

### PromptDefinition

Defined in: [shared/mcp-utils/src/index.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L103)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="arguments"></a> `arguments?` | \{ `description?`: `string`; `name`: `string`; `required?`: `boolean`; \}[] | [shared/mcp-utils/src/index.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L106) |
| <a id="description"></a> `description?` | `string` | [shared/mcp-utils/src/index.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L105) |
| <a id="name"></a> `name` | `string` | [shared/mcp-utils/src/index.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L104) |

***

### ResourceDefinition

Defined in: [shared/mcp-utils/src/index.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L79)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-1"></a> `description?` | `string` | [shared/mcp-utils/src/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L82) |
| <a id="mimetype"></a> `mimeType?` | `string` | [shared/mcp-utils/src/index.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L83) |
| <a id="name-1"></a> `name` | `string` | [shared/mcp-utils/src/index.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L81) |
| <a id="uri"></a> `uri` | `string` | [shared/mcp-utils/src/index.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L80) |

***

### ToolDefinition

Defined in: [shared/mcp-utils/src/index.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L13)

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` *extends* `z.ZodType` | `z.ZodType` |

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-2"></a> `description` | `string` | [shared/mcp-utils/src/index.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L15) |
| <a id="handler"></a> `handler` | (`input`: `TypeOf`\<`T`\>) => `Promise`\<[`ToolResult`](/docs/api/shared/mcp-utils/src.md#toolresult)\> | [shared/mcp-utils/src/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L17) |
| <a id="inputschema"></a> `inputSchema` | `T` | [shared/mcp-utils/src/index.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L16) |
| <a id="name-2"></a> `name` | `string` | [shared/mcp-utils/src/index.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L14) |

***

### ToolResult

Defined in: [shared/mcp-utils/src/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L20)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="content"></a> `content` | \{ `data?`: `string`; `mimeType?`: `string`; `text?`: `string`; `type`: `"text"` \| `"image"` \| `"resource"`; \}[] | [shared/mcp-utils/src/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L21) |
| <a id="iserror"></a> `isError?` | `boolean` | [shared/mcp-utils/src/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L27) |

## Variables

### PACKAGE\_NAME

```ts
const PACKAGE_NAME: "@universal-crypto-mcp/mcp-utils" = '@universal-crypto-mcp/mcp-utils';
```

Defined in: [shared/mcp-utils/src/index.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L129)

***

### VERSION

```ts
const VERSION: "1.0.0" = '1.0.0';
```

Defined in: [shared/mcp-utils/src/index.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L128)

## Functions

### definePrompt()

```ts
function definePrompt(name: string, options?: {
  arguments?: {
     description?: string;
     name: string;
     required?: boolean;
  }[];
  description?: string;
}): PromptDefinition;
```

Defined in: [shared/mcp-utils/src/index.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L113)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `options?` | \{ `arguments?`: \{ `description?`: `string`; `name`: `string`; `required?`: `boolean`; \}[]; `description?`: `string`; \} |
| `options.arguments?` | \{ `description?`: `string`; `name`: `string`; `required?`: `boolean`; \}[] |
| `options.description?` | `string` |

#### Returns

[`PromptDefinition`](/docs/api/shared/mcp-utils/src.md#promptdefinition)

***

### defineResource()

```ts
function defineResource(
   uri: string, 
   name: string, 
   options?: {
  description?: string;
  mimeType?: string;
}): ResourceDefinition;
```

Defined in: [shared/mcp-utils/src/index.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L86)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `uri` | `string` |
| `name` | `string` |
| `options?` | \{ `description?`: `string`; `mimeType?`: `string`; \} |
| `options.description?` | `string` |
| `options.mimeType?` | `string` |

#### Returns

[`ResourceDefinition`](/docs/api/shared/mcp-utils/src.md#resourcedefinition)

***

### defineTool()

```ts
function defineTool<T>(
   name: string, 
   description: string, 
   inputSchema: T, 
handler: (input: TypeOf<T>) => Promise<ToolResult>): ToolDefinition<T>;
```

Defined in: [shared/mcp-utils/src/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L33)

Creates a tool definition with type-safe input schema

#### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* `ZodType`\<`any`, `ZodTypeDef`, `any`\> |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `description` | `string` |
| `inputSchema` | `T` |
| `handler` | (`input`: `TypeOf`\<`T`\>) => `Promise`\<[`ToolResult`](/docs/api/shared/mcp-utils/src.md#toolresult)\> |

#### Returns

[`ToolDefinition`](/docs/api/shared/mcp-utils/src.md#tooldefinition)\<`T`\>

***

### errorResult()

```ts
function errorResult(message: string): ToolResult;
```

Defined in: [shared/mcp-utils/src/index.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L68)

Creates an error response

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

[`ToolResult`](/docs/api/shared/mcp-utils/src.md#toolresult)

***

### jsonResult()

```ts
function jsonResult(data: unknown): ToolResult;
```

Defined in: [shared/mcp-utils/src/index.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L59)

Creates a JSON response

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `data` | `unknown` |

#### Returns

[`ToolResult`](/docs/api/shared/mcp-utils/src.md#toolresult)

***

### textResult()

```ts
function textResult(text: string): ToolResult;
```

Defined in: [shared/mcp-utils/src/index.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/mcp-utils/src/index.ts#L50)

Creates a successful text response

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

[`ToolResult`](/docs/api/shared/mcp-utils/src.md#toolresult)
