[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/web3-research/tools/researchTools

# defi/protocols/src/vendors/web3-research/tools/researchTools

## Functions

### getResourceContent()

```ts
function getResourceContent(url: string, storage: ResearchStorage): Promise<string>;
```

Defined in: [defi/protocols/src/vendors/web3-research/tools/researchTools.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/tools/researchTools.ts#L20)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `url` | `string` |
| `storage` | [`ResearchStorage`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchstorage) |

#### Returns

`Promise`\<`string`\>

***

### registerResearchTools()

```ts
function registerResearchTools(server: McpServer, storage: ResearchStorage): void;
```

Defined in: [defi/protocols/src/vendors/web3-research/tools/researchTools.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/tools/researchTools.ts#L38)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |
| `storage` | [`ResearchStorage`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchstorage) |

#### Returns

`void`
