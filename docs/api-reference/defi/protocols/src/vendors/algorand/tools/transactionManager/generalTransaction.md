[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction

# defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction

## Classes

### GeneralTransactionManager

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L89)

#### Constructors

##### Constructor

```ts
new GeneralTransactionManager(): GeneralTransactionManager;
```

###### Returns

[`GeneralTransactionManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.md#generaltransactionmanager)

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

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L94)

Assigns a group ID to a list of transactions

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

### generalTransactionSchemas

```ts
const generalTransactionSchemas: {
  assignGroupId: {
     properties: {
        transactions: {
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
  decodeObj: {
     properties: {
        bytes: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  encodeObj: {
     properties: {
        obj: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  signBytes: {
     properties: {
        bytes: {
           description: string;
           type: string;
        };
        sk: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  signTransaction: {
     properties: {
        sk: {
           description: string;
           type: string;
        };
        transaction: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L16)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="assigngroupid"></a> `assignGroupId` | \{ `properties`: \{ `transactions`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L17) |
| `assignGroupId.properties` | \{ `transactions`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L19) |
| `assignGroupId.properties.transactions` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L20) |
| `assignGroupId.properties.transactions.description` | `string` | `'Array of transaction objects to be assigned a group ID'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L23) |
| `assignGroupId.properties.transactions.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L22) |
| `assignGroupId.properties.transactions.items.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L22) |
| `assignGroupId.properties.transactions.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L21) |
| `assignGroupId.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L26) |
| `assignGroupId.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L18) |
| <a id="decodeobj"></a> `decodeObj` | \{ `properties`: \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L51) |
| `decodeObj.properties` | \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L53) |
| `decodeObj.properties.bytes` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L54) |
| `decodeObj.properties.bytes.description` | `string` | `'Base64-encoded msgpack bytes to be decoded into an object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L54) |
| `decodeObj.properties.bytes.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L54) |
| `decodeObj.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L56) |
| `decodeObj.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L52) |
| <a id="encodeobj"></a> `encodeObj` | \{ `properties`: \{ `obj`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L44) |
| `encodeObj.properties` | \{ `obj`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L46) |
| `encodeObj.properties.obj` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L47) |
| `encodeObj.properties.obj.description` | `string` | `'Object to be encoded into msgpack format'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L47) |
| `encodeObj.properties.obj.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L47) |
| `encodeObj.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L49) |
| `encodeObj.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L45) |
| <a id="signbytes"></a> `signBytes` | \{ `properties`: \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; `sk`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L36) |
| `signBytes.properties` | \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; `sk`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L38) |
| `signBytes.properties.bytes` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L39) |
| `signBytes.properties.bytes.description` | `string` | `'Base64-encoded bytes to be signed'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L39) |
| `signBytes.properties.bytes.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L39) |
| `signBytes.properties.sk` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L40) |
| `signBytes.properties.sk.description` | `string` | `'Secret key in hexadecimal format to sign the bytes with'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L40) |
| `signBytes.properties.sk.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L40) |
| `signBytes.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L42) |
| `signBytes.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L37) |
| <a id="signtransaction"></a> `signTransaction` | \{ `properties`: \{ `sk`: \{ `description`: `string`; `type`: `string`; \}; `transaction`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L28) |
| `signTransaction.properties` | \{ `sk`: \{ `description`: `string`; `type`: `string`; \}; `transaction`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L30) |
| `signTransaction.properties.sk` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L32) |
| `signTransaction.properties.sk.description` | `string` | `'Secret key in hexadecimal format to sign the transaction with'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L32) |
| `signTransaction.properties.sk.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L32) |
| `signTransaction.properties.transaction` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L31) |
| `signTransaction.properties.transaction.description` | `string` | `'Transaction object to be signed'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L31) |
| `signTransaction.properties.transaction.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L31) |
| `signTransaction.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L34) |
| `signTransaction.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L29) |

***

### generalTransactionTools

```ts
const generalTransactionTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        transactions: {
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
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        sk: {
           description: string;
           type: string;
        };
        transaction: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        obj: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        bytes: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.ts#L61)
