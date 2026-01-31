[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset

# defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset

## Variables

### assetTools

```ts
const assetTools: {
  description: string;
  inputSchema: {
     properties: {
        assetId: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
}[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L11)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `description` | `string` | `'Get current asset information from algod'` | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L14) |
| `inputSchema` | \{ `properties`: \{ `assetId`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L15) |
| `inputSchema.properties` | \{ `assetId`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L17) |
| `inputSchema.properties.assetId` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L18) |
| `inputSchema.properties.assetId.description` | `string` | `'Asset ID'` | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L20) |
| `inputSchema.properties.assetId.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L19) |
| `inputSchema.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L23) |
| `inputSchema.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L16) |
| `name` | `string` | `'api_algod_get_asset_by_id'` | [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L13) |

## Functions

### getAssetByID()

```ts
function getAssetByID(assetId: number): Promise<Asset>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L28)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `assetId` | `number` |

#### Returns

`Promise`\<`Asset`\>

***

### handleAssetTools()

```ts
function handleAssetTools(name: string, args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/asset.ts#L46)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>
