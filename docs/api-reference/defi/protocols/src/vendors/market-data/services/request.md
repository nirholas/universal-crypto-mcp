[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/market-data/services/request

# defi/protocols/src/vendors/market-data/services/request

## Functions

### makeRequestCsApi()

```ts
function makeRequestCsApi<T>(
   url: string, 
   method: string, 
   params: Record<string, any>, 
body?: any): Promise<T | null>;
```

Defined in: [defi/protocols/src/vendors/market-data/services/request.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/services/request.ts#L10)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `method` | `string` | `'GET'` |
| `params` | `Record`\<`string`, `any`\> | `{}` |
| `body?` | `any` | `undefined` |

#### Returns

`Promise`\<`T` \| `null`\>

***

### universalApiHandler()

```ts
function universalApiHandler<T>(
   basePath: string, 
   endpoint: string, 
   method: string, 
   params: Record<string, any>, 
   body?: any): Promise<{
  content: {
     isError?: boolean;
     text: string;
     type: "text";
  }[];
}>;
```

Defined in: [defi/protocols/src/vendors/market-data/services/request.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/services/request.ts#L41)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `basePath` | `string` | `undefined` |
| `endpoint` | `string` | `undefined` |
| `method` | `string` | `'GET'` |
| `params` | `Record`\<`string`, `any`\> | `{}` |
| `body?` | `any` | `undefined` |

#### Returns

`Promise`\<\{
  `content`: \{
     `isError?`: `boolean`;
     `text`: `string`;
     `type`: `"text"`;
  \}[];
\}\>
