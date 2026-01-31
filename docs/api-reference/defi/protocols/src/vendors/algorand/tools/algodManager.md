[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/algodManager

# defi/protocols/src/vendors/algorand/tools/algodManager

## Classes

### AlgodManager

Defined in: [defi/protocols/src/vendors/algorand/tools/algodManager.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L87)

#### Constructors

##### Constructor

```ts
new AlgodManager(): AlgodManager;
```

###### Returns

[`AlgodManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/algodManager.md#algodmanager)

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="algodtools"></a> `algodTools` | `readonly` | ( \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `source`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `bytecode`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `signedTxns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `allowEmptySignatures`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `allowMoreLogging`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `allowUnnamedResources`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `execTraceConfig`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `extraOpcodeBudget`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `round`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `txnGroups`: \{ `description`: `string`; `items`: \{ `description`: `string`; `properties`: \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \})[] | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L88) |

#### Methods

##### compile()

```ts
static compile(source: string | Uint8Array<ArrayBufferLike>): Promise<CompileResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/algodManager.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L217)

Compiles TEAL source code to binary

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `source` | `string` \| `Uint8Array`\<`ArrayBufferLike`\> | TEAL source code as string or bytes |

###### Returns

`Promise`\<`CompileResponse`\>

Compilation result with hash and bytecode

##### disassemble()

```ts
static disassemble(bytecode: string | Uint8Array<ArrayBufferLike>): Promise<DisassembleResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/algodManager.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L244)

Disassembles TEAL bytecode back to source

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `bytecode` | `string` \| `Uint8Array`\<`ArrayBufferLike`\> | TEAL bytecode as string or bytes |

###### Returns

`Promise`\<`DisassembleResponse`\>

Disassembled TEAL source code

##### handleTool()

```ts
static handleTool(name: string, args: Record<string, unknown>): Promise<{
  content: {
     text: string;
     type: string;
  }[];
}>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/algodManager.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L117)

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

##### sendRawTransaction()

```ts
static sendRawTransaction(signedTxns: Uint8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike>[]): Promise<PostTransactionsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/algodManager.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L262)

Broadcasts signed transactions to the network

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `signedTxns` | `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[] | Single signed transaction or array of signed transactions |

###### Returns

`Promise`\<`PostTransactionsResponse`\>

Transaction ID of the submission

##### simulateRawTransactions()

```ts
static simulateRawTransactions(txns: Uint8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike>[]): Promise<SimulateResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/algodManager.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L280)

Simulates raw transactions

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txns` | `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[] | Single transaction or array of transactions to simulate |

###### Returns

`Promise`\<`SimulateResponse`\>

Simulation results

##### simulateTransactions()

```ts
static simulateTransactions(request: {
  allowEmptySignatures?: boolean;
  allowMoreLogging?: boolean;
  allowUnnamedResources?: boolean;
  execTraceConfig?: any;
  extraOpcodeBudget?: number;
  round?: number;
  txnGroups: {
     txns: EncodedSignedTransaction[];
  }[];
}): Promise<SimulateResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/algodManager.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L298)

Simulates transactions with detailed configuration

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | \{ `allowEmptySignatures?`: `boolean`; `allowMoreLogging?`: `boolean`; `allowUnnamedResources?`: `boolean`; `execTraceConfig?`: `any`; `extraOpcodeBudget?`: `number`; `round?`: `number`; `txnGroups`: \{ `txns`: `EncodedSignedTransaction`[]; \}[]; \} | Simulation request with transaction groups and configuration |
| `request.allowEmptySignatures?` | `boolean` | - |
| `request.allowMoreLogging?` | `boolean` | - |
| `request.allowUnnamedResources?` | `boolean` | - |
| `request.execTraceConfig?` | `any` | - |
| `request.extraOpcodeBudget?` | `number` | - |
| `request.round?` | `number` | - |
| `request.txnGroups` | \{ `txns`: `EncodedSignedTransaction`[]; \}[] | - |

###### Returns

`Promise`\<`SimulateResponse`\>

Simulation results

## Variables

### algodToolSchemas

```ts
const algodToolSchemas: {
  compileTeal: {
     properties: {
        source: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  disassembleTeal: {
     properties: {
        bytecode: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  sendRawTransaction: {
     properties: {
        signedTxns: {
           description: string;
           items: {
              description: string;
              type: string;
           };
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  simulateRawTransactions: {
     properties: {
        txns: {
           description: string;
           items: {
              description: string;
              type: string;
           };
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  simulateTransactions: {
     properties: {
        allowEmptySignatures: {
           description: string;
           optional: boolean;
           type: string;
        };
        allowMoreLogging: {
           description: string;
           optional: boolean;
           type: string;
        };
        allowUnnamedResources: {
           description: string;
           optional: boolean;
           type: string;
        };
        execTraceConfig: {
           description: string;
           optional: boolean;
           type: string;
        };
        extraOpcodeBudget: {
           description: string;
           optional: boolean;
           type: string;
        };
        round: {
           description: string;
           optional: boolean;
           type: string;
        };
        txnGroups: {
           description: string;
           items: {
              description: string;
              properties: {
                 txns: {
                    description: string;
                    items: {
                       description: string;
                       type: string;
                    };
                    type: string;
                 };
              };
              required: string[];
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

Defined in: [defi/protocols/src/vendors/algorand/tools/algodManager.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L20)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="compileteal"></a> `compileTeal` | \{ `properties`: \{ `source`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L21) |
| `compileTeal.properties` | \{ `source`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L23) |
| `compileTeal.properties.source` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L24) |
| `compileTeal.properties.source.description` | `string` | `'Logic that executes when the app is called (compiled TEAL as base64)'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L24) |
| `compileTeal.properties.source.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L24) |
| `compileTeal.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L26) |
| `compileTeal.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L22) |
| <a id="disassembleteal"></a> `disassembleTeal` | \{ `properties`: \{ `bytecode`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L28) |
| `disassembleTeal.properties` | \{ `bytecode`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L30) |
| `disassembleTeal.properties.bytecode` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L31) |
| `disassembleTeal.properties.bytecode.description` | `string` | `'TEAL bytecode to disassemble into source code'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L31) |
| `disassembleTeal.properties.bytecode.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L31) |
| `disassembleTeal.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L33) |
| `disassembleTeal.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L29) |
| <a id="sendrawtransaction-2"></a> `sendRawTransaction` | \{ `properties`: \{ `signedTxns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L35) |
| `sendRawTransaction.properties` | \{ `signedTxns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L37) |
| `sendRawTransaction.properties.signedTxns` | \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L38) |
| `sendRawTransaction.properties.signedTxns.description` | `string` | `'Array of signed transactions to submit to the network'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L41) |
| `sendRawTransaction.properties.signedTxns.items` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L40) |
| `sendRawTransaction.properties.signedTxns.items.description` | `string` | `'Base64-encoded signed transaction'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L40) |
| `sendRawTransaction.properties.signedTxns.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L40) |
| `sendRawTransaction.properties.signedTxns.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L39) |
| `sendRawTransaction.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L44) |
| `sendRawTransaction.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L36) |
| <a id="simulaterawtransactions-2"></a> `simulateRawTransactions` | \{ `properties`: \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L46) |
| `simulateRawTransactions.properties` | \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L48) |
| `simulateRawTransactions.properties.txns` | \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L49) |
| `simulateRawTransactions.properties.txns.description` | `string` | `'Array of transactions to simulate'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L52) |
| `simulateRawTransactions.properties.txns.items` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L51) |
| `simulateRawTransactions.properties.txns.items.description` | `string` | `'Base64-encoded transaction'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L51) |
| `simulateRawTransactions.properties.txns.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L51) |
| `simulateRawTransactions.properties.txns.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L50) |
| `simulateRawTransactions.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L55) |
| `simulateRawTransactions.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L47) |
| <a id="simulatetransactions-2"></a> `simulateTransactions` | \{ `properties`: \{ `allowEmptySignatures`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `allowMoreLogging`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `allowUnnamedResources`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `execTraceConfig`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `extraOpcodeBudget`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `round`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `txnGroups`: \{ `description`: `string`; `items`: \{ `description`: `string`; `properties`: \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L57) |
| `simulateTransactions.properties` | \{ `allowEmptySignatures`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `allowMoreLogging`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `allowUnnamedResources`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `execTraceConfig`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `extraOpcodeBudget`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `round`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `txnGroups`: \{ `description`: `string`; `items`: \{ `description`: `string`; `properties`: \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L59) |
| `simulateTransactions.properties.allowEmptySignatures` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L76) |
| `simulateTransactions.properties.allowEmptySignatures.description` | `string` | `'Allow transactions without signatures'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L76) |
| `simulateTransactions.properties.allowEmptySignatures.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L76) |
| `simulateTransactions.properties.allowEmptySignatures.type` | `string` | `'boolean'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L76) |
| `simulateTransactions.properties.allowMoreLogging` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L77) |
| `simulateTransactions.properties.allowMoreLogging.description` | `string` | `'Enable additional logging during simulation'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L77) |
| `simulateTransactions.properties.allowMoreLogging.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L77) |
| `simulateTransactions.properties.allowMoreLogging.type` | `string` | `'boolean'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L77) |
| `simulateTransactions.properties.allowUnnamedResources` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L78) |
| `simulateTransactions.properties.allowUnnamedResources.description` | `string` | `'Allow access to resources not listed in transaction'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L78) |
| `simulateTransactions.properties.allowUnnamedResources.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L78) |
| `simulateTransactions.properties.allowUnnamedResources.type` | `string` | `'boolean'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L78) |
| `simulateTransactions.properties.execTraceConfig` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L79) |
| `simulateTransactions.properties.execTraceConfig.description` | `string` | `'Configuration for execution trace output'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L79) |
| `simulateTransactions.properties.execTraceConfig.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L79) |
| `simulateTransactions.properties.execTraceConfig.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L79) |
| `simulateTransactions.properties.extraOpcodeBudget` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L80) |
| `simulateTransactions.properties.extraOpcodeBudget.description` | `string` | `'Additional budget for TEAL program execution'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L80) |
| `simulateTransactions.properties.extraOpcodeBudget.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L80) |
| `simulateTransactions.properties.extraOpcodeBudget.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L80) |
| `simulateTransactions.properties.round` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L81) |
| `simulateTransactions.properties.round.description` | `string` | `'Round at which to simulate the transactions'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L81) |
| `simulateTransactions.properties.round.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L81) |
| `simulateTransactions.properties.round.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L81) |
| `simulateTransactions.properties.txnGroups` | \{ `description`: `string`; `items`: \{ `description`: `string`; `properties`: \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L60) |
| `simulateTransactions.properties.txnGroups.description` | `string` | `'Array of transaction groups to simulate'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L74) |
| `simulateTransactions.properties.txnGroups.items` | \{ `description`: `string`; `properties`: \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L62) |
| `simulateTransactions.properties.txnGroups.items.description` | `string` | `'Group of transactions to simulate together'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L72) |
| `simulateTransactions.properties.txnGroups.items.properties` | \{ `txns`: \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L64) |
| `simulateTransactions.properties.txnGroups.items.properties.txns` | \{ `description`: `string`; `items`: \{ `description`: `string`; `type`: `string`; \}; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L65) |
| `simulateTransactions.properties.txnGroups.items.properties.txns.description` | `string` | `'Array of transactions in this group'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L68) |
| `simulateTransactions.properties.txnGroups.items.properties.txns.items` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L67) |
| `simulateTransactions.properties.txnGroups.items.properties.txns.items.description` | `string` | `'Transaction object to simulate'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L67) |
| `simulateTransactions.properties.txnGroups.items.properties.txns.items.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L67) |
| `simulateTransactions.properties.txnGroups.items.properties.txns.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L66) |
| `simulateTransactions.properties.txnGroups.items.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L71) |
| `simulateTransactions.properties.txnGroups.items.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L63) |
| `simulateTransactions.properties.txnGroups.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L61) |
| `simulateTransactions.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L83) |
| `simulateTransactions.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/algodManager.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/algodManager.ts#L58) |
