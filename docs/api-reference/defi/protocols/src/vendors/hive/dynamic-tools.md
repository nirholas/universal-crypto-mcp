[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/hive/dynamic-tools

# defi/protocols/src/vendors/hive/dynamic-tools

## Functions

### asTextContentResult()

```ts
function asTextContentResult(result: Object): any;
```

Defined in: [defi/protocols/src/vendors/hive/dynamic-tools.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/dynamic-tools.ts#L12)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `result` | `Object` |

#### Returns

`any`

***

### dynamicTools()

```ts
function dynamicTools(endpoints: any): (
  | {
  handler: null;
  metadata: {
     operation: "write";
     resource: string;
     tags: never[];
  };
  tool: {
     description: string;
     inputSchema: any;
     name: string;
  };
}
  | {
  handler: (args: Record<string, unknown> | undefined) => Promise<any>;
  metadata: {
     operation: "read";
     resource: string;
     tags: string[];
  };
  tool: {
     description: string;
     inputSchema: any;
     name: string;
  };
})[];
```

Defined in: [defi/protocols/src/vendors/hive/dynamic-tools.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/dynamic-tools.ts#L97)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `endpoints` | `any` |

#### Returns

(
  \| \{
  `handler`: `null`;
  `metadata`: \{
     `operation`: `"write"`;
     `resource`: `string`;
     `tags`: `never`[];
  \};
  `tool`: \{
     `description`: `string`;
     `inputSchema`: `any`;
     `name`: `string`;
  \};
\}
  \| \{
  `handler`: (`args`: `Record`\<`string`, `unknown`\> \| `undefined`) => `Promise`\<`any`\>;
  `metadata`: \{
     `operation`: `"read"`;
     `resource`: `string`;
     `tags`: `string`[];
  \};
  `tool`: \{
     `description`: `string`;
     `inputSchema`: `any`;
     `name`: `string`;
  \};
\})[]
