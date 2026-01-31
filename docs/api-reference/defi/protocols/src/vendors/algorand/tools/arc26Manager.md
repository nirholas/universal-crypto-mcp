[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/arc26Manager

# defi/protocols/src/vendors/algorand/tools/arc26Manager

## Classes

### Arc26Manager

Defined in: [defi/protocols/src/vendors/algorand/tools/arc26Manager.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/arc26Manager.ts#L19)

#### Constructors

##### Constructor

```ts
new Arc26Manager(): Arc26Manager;
```

###### Returns

[`Arc26Manager`](/docs/api/defi/protocols/src/vendors/algorand/tools/arc26Manager.md#arc26manager)

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="arc26tools"></a> `arc26Tools` | `public` | \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `address`: \{ `description`: `string`; `type`: `string`; \}; `amount`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `asset`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `label`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `xnote`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \}[] | [defi/protocols/src/vendors/algorand/tools/arc26Manager.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/arc26Manager.ts#L20) |

#### Methods

##### generateUriAndQr()

```ts
generateUriAndQr(params: Arc26ToolInput): Promise<{
  qrCode: string;
  uri: string;
}>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/arc26Manager.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/arc26Manager.ts#L67)

Constructs an Algorand URI according to ARC-26 specification and generates a QR code

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `params` | `Arc26ToolInput` | The parameters for constructing the URI |

###### Returns

`Promise`\<\{
  `qrCode`: `string`;
  `uri`: `string`;
\}\>

Object containing the URI and QR code as base64 data URL

##### handleTool()

```ts
handleTool(name: string, args: Record<string, unknown>): Promise<{
  content: (
     | {
     mimeType?: undefined;
     text: string;
     type: string;
   }
     | {
     mimeType: string;
     text: string;
     type: string;
  })[];
}>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/arc26Manager.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/arc26Manager.ts#L127)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `Record`\<`string`, `unknown`\> |

###### Returns

`Promise`\<\{
  `content`: (
     \| \{
     `mimeType?`: `undefined`;
     `text`: `string`;
     `type`: `string`;
   \}
     \| \{
     `mimeType`: `string`;
     `text`: `string`;
     `type`: `string`;
  \})[];
\}\>

## Variables

### arc26Manager

```ts
const arc26Manager: Arc26Manager;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/arc26Manager.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/arc26Manager.ts#L158)
