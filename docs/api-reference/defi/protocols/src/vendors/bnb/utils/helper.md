[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/utils/helper

# defi/protocols/src/vendors/bnb/utils/helper

## Variables

### mcpToolRes

```ts
const mcpToolRes: {
  error: (error: unknown, operation: string) => {
     content: {
        text: string;
        type: "text";
     }[];
  };
  success: (data: unknown) => {
     content: {
        text: string;
        type: "text";
     }[];
  };
};
```

Defined in: [defi/protocols/src/vendors/bnb/utils/helper.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/helper.ts#L52)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="error"></a> `error()` | (`error`: `unknown`, `operation`: `string`) => \{ `content`: \{ `text`: `string`; `type`: `"text"`; \}[]; \} | [defi/protocols/src/vendors/bnb/utils/helper.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/helper.ts#L54) |
| <a id="success"></a> `success()` | (`data`: `unknown`) => \{ `content`: \{ `text`: `string`; `type`: `"text"`; \}[]; \} | [defi/protocols/src/vendors/bnb/utils/helper.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/helper.ts#L65) |

## Functions

### safeParse()

```ts
function safeParse(text: string): any;
```

Defined in: [defi/protocols/src/vendors/bnb/utils/helper.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/helper.ts#L43)

Safely parse a JSON string

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | The JSON string to parse |

#### Returns

`any`

The parsed value

***

### safeStringify()

```ts
function safeStringify(value: any, space?: number): string;
```

Defined in: [defi/protocols/src/vendors/bnb/utils/helper.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/helper.ts#L28)

Safely stringify any JSON value, including those with BigInt

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | The value to stringify |
| `space?` | `number` | Number of spaces to use for indentation (optional) |

#### Returns

`string`

A JSON string representation of the value
