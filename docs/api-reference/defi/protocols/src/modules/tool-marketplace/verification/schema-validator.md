[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/verification/schema-validator

# defi/protocols/src/modules/tool-marketplace/verification/schema-validator

## Classes

### SchemaValidator

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L56)

Schema Validator Service
Validates tool API responses against their declared schemas

#### Constructors

##### Constructor

```ts
new SchemaValidator(): SchemaValidator;
```

###### Returns

[`SchemaValidator`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.md#schemavalidator)

#### Methods

##### generateSampleResponse()

```ts
generateSampleResponse(schema: Record<string, unknown>): unknown;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:617](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L617)

Generate a sample response from a schema

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `schema` | `Record`\<`string`, `unknown`\> |

###### Returns

`unknown`

##### getSchema()

```ts
getSchema(toolId: string): 
  | ToolSchema
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L84)

Get registered schema for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

  \| [`ToolSchema`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#toolschema)
  \| `null`

##### getToolsWithViolations()

```ts
getToolsWithViolations(): {
  toolId: string;
  violations: number;
}[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:602](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L602)

Get all tools with violations

###### Returns

\{
  `toolId`: `string`;
  `violations`: `number`;
\}[]

##### getValidationHistory()

```ts
getValidationHistory(toolId: string, limit: number): SchemaValidationResult[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:573](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L573)

Get validation history for a tool

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `limit` | `number` | `50` |

###### Returns

[`SchemaValidationResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemavalidationresult)[]

##### getViolationCount()

```ts
getViolationCount(toolId: string): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:581](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L581)

Get violation count for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`number`

##### hasExcessiveViolations()

```ts
hasExcessiveViolations(toolId: string, threshold: number): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:588](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L588)

Check if a tool has excessive violations

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `threshold` | `number` | `10` |

###### Returns

`boolean`

##### registerSchema()

```ts
registerSchema(
   toolId: string, 
   schema: Record<string, unknown>, 
   type: "custom" | "openapi" | "jsonschema", 
   version?: string): ToolSchema;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L60)

Register a schema for a tool

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `schema` | `Record`\<`string`, `unknown`\> | `undefined` |
| `type` | `"custom"` \| `"openapi"` \| `"jsonschema"` | `"jsonschema"` |
| `version?` | `string` | `undefined` |

###### Returns

[`ToolSchema`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#toolschema)

##### resetViolationCount()

```ts
resetViolationCount(toolId: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:595](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L595)

Reset violation count for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`void`

##### updateSchema()

```ts
updateSchema(
   toolId: string, 
   schema: Record<string, unknown>, 
   version?: string): 
  | ToolSchema
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L91)

Update a tool's schema

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `schema` | `Record`\<`string`, `unknown`\> |
| `version?` | `string` |

###### Returns

  \| [`ToolSchema`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#toolschema)
  \| `null`

##### validateResponse()

```ts
validateResponse(
   toolId: string, 
   response: unknown, 
schemaPath?: string): Promise<SchemaValidationResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L113)

Validate response data against a tool's schema

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `response` | `unknown` |
| `schemaPath?` | `string` |

###### Returns

`Promise`\<[`SchemaValidationResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemavalidationresult)\>

## Variables

### schemaValidator

```ts
const schemaValidator: SchemaValidator;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts:681](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.ts#L681)

Singleton instance
