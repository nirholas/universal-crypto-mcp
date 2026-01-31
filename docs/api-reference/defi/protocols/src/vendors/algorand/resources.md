[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/resources

# defi/protocols/src/vendors/algorand/resources

## Classes

### ResourceManager

Defined in: [defi/protocols/src/vendors/algorand/resources/index.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/resources/index.ts#L38)

#### Constructors

##### Constructor

```ts
new ResourceManager(): ResourceManager;
```

###### Returns

[`ResourceManager`](/docs/api/defi/protocols/src/vendors/algorand/resources.md#resourcemanager)

#### Accessors

##### resources

###### Get Signature

```ts
get static resources(): {
  description: string;
  name: string;
  schema?: any;
  uri: string;
}[];
```

Defined in: [defi/protocols/src/vendors/algorand/resources/index.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/resources/index.ts#L40)

###### Returns

\{
  `description`: `string`;
  `name`: `string`;
  `schema?`: `any`;
  `uri`: `string`;
\}[]

##### schemas

###### Get Signature

```ts
get static schemas(): Record<string, any>;
```

Defined in: [defi/protocols/src/vendors/algorand/resources/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/resources/index.ts#L45)

###### Returns

`Record`\<`string`, `any`\>

#### Methods

##### handleResource()

```ts
static handleResource(uri: string): Promise<{
  contents: {
     mimeType: string;
     text: string;
     uri: string;
  }[];
}>;
```

Defined in: [defi/protocols/src/vendors/algorand/resources/index.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/resources/index.ts#L53)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `uri` | `string` |

###### Returns

`Promise`\<\{
  `contents`: \{
     `mimeType`: `string`;
     `text`: `string`;
     `uri`: `string`;
  \}[];
\}\>
