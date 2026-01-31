[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/market-data/tools/toolFactory

# defi/protocols/src/vendors/market-data/tools/toolFactory

## Interfaces

### ToolConfig

Defined in: [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L14)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="basepath"></a> `basePath?` | `string` | [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L19) |
| <a id="description"></a> `description` | `string` | [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L16) |
| <a id="endpoint"></a> `endpoint` | `string` | [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L17) |
| <a id="islocal"></a> `isLocal?` | `boolean` | [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L21) |
| <a id="method"></a> `method?` | `string` | [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L18) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L15) |
| <a id="parameters"></a> `parameters` | `Record`\<`string`, `ZodType`\> | [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L20) |

## Functions

### createToolConfig()

```ts
function createToolConfig<T>(
   name: string, 
   description: string, 
   endpoint: string, 
   parameters: Record<string, ZodType>, 
   method: string, 
   basePath?: string, 
isLocal?: boolean): ToolConfig<T>;
```

Defined in: [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L88)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `description` | `string` | `undefined` |
| `endpoint` | `string` | `undefined` |
| `parameters` | `Record`\<`string`, `ZodType`\> | `undefined` |
| `method` | `string` | `'GET'` |
| `basePath?` | `string` | `undefined` |
| `isLocal?` | `boolean` | `false` |

#### Returns

[`ToolConfig`](/docs/api/defi/protocols/src/vendors/market-data/tools/toolFactory.md#toolconfig)\<`T`\>

***

### registerTools()

```ts
function registerTools(server: McpServer, toolConfigs: ToolConfig<any>[]): void;
```

Defined in: [defi/protocols/src/vendors/market-data/tools/toolFactory.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/tools/toolFactory.ts#L25)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |
| `toolConfigs` | [`ToolConfig`](/docs/api/defi/protocols/src/vendors/market-data/tools/toolFactory.md#toolconfig)\<`any`\>[] |

#### Returns

`void`
