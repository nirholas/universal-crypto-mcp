[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/knowledgeManager

# defi/protocols/src/vendors/algorand/tools/knowledgeManager

## Classes

### KnowledgeManager

Defined in: [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L27)

#### Constructors

##### Constructor

```ts
new KnowledgeManager(): KnowledgeManager;
```

###### Returns

[`KnowledgeManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/knowledgeManager.md#knowledgemanager)

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="knowledgetools"></a> `knowledgeTools` | `readonly` | \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `documents`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \}[] | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L28) |

#### Methods

##### handleTool()

```ts
static handleTool(name: string, args: Record<string, unknown>): Promise<{
  content: {
     text: string;
     type: string;
  }[];
}>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L37)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `Record`\<`string`, `unknown`\> |

###### Returns

`Promise`\<\{
  `content`: \{
     `text`: `string`;
     `type`: `string`;
  \}[];
\}\>

## Variables

### knowledgeToolSchemas

```ts
const knowledgeToolSchemas: {
  getKnowledgeDoc: {
     properties: {
        documents: {
           description: string;
           items: {
              type: string;
           };
           type: string;
        };
     };
     required: string[];
     type: string;
  };
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L13)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="getknowledgedoc"></a> `getKnowledgeDoc` | \{ `properties`: \{ `documents`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L14) |
| `getKnowledgeDoc.properties` | \{ `documents`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L16) |
| `getKnowledgeDoc.properties.documents` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L17) |
| `getKnowledgeDoc.properties.documents.description` | `string` | `'Array of document keys (e.g. ["ARCs:specs:arc-0020.md"])'` | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L20) |
| `getKnowledgeDoc.properties.documents.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L19) |
| `getKnowledgeDoc.properties.documents.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L19) |
| `getKnowledgeDoc.properties.documents.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L18) |
| `getKnowledgeDoc.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L23) |
| `getKnowledgeDoc.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/knowledgeManager.ts#L15) |
