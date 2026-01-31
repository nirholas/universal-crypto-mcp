[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions

# defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions

## Classes

### AccountTransactionManager

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L84)

#### Constructors

##### Constructor

```ts
new AccountTransactionManager(): AccountTransactionManager;
```

###### Returns

[`AccountTransactionManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.md#accounttransactionmanager)

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

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L120)

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

##### makeKeyRegTxn()

```ts
static makeKeyRegTxn(txn: {
  from: string;
  nonParticipation?: boolean;
  note?: Uint8Array<ArrayBufferLike>;
  rekeyTo?: string;
  selectionKey: string;
  stateProofKey: string;
  suggestedParams: SuggestedParams;
  voteFirst: number;
  voteKey: string;
  voteKeyDilution: number;
  voteLast: number;
}): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L103)

Creates a key registration transaction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `txn` | \{ `from`: `string`; `nonParticipation?`: `boolean`; `note?`: `Uint8Array`\<`ArrayBufferLike`\>; `rekeyTo?`: `string`; `selectionKey`: `string`; `stateProofKey`: `string`; `suggestedParams`: `SuggestedParams`; `voteFirst`: `number`; `voteKey`: `string`; `voteKeyDilution`: `number`; `voteLast`: `number`; \} |
| `txn.from` | `string` |
| `txn.nonParticipation?` | `boolean` |
| `txn.note?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `txn.rekeyTo?` | `string` |
| `txn.selectionKey` | `string` |
| `txn.stateProofKey` | `string` |
| `txn.suggestedParams` | `SuggestedParams` |
| `txn.voteFirst` | `number` |
| `txn.voteKey` | `string` |
| `txn.voteKeyDilution` | `number` |
| `txn.voteLast` | `number` |

###### Returns

`Transaction`

##### makePaymentTxn()

```ts
static makePaymentTxn(txn: {
  amount: number;
  closeRemainderTo?: string;
  from: string;
  note?: Uint8Array<ArrayBufferLike>;
  rekeyTo?: string;
  suggestedParams: SuggestedParams;
  to: string;
}): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L88)

Creates a payment transaction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `txn` | \{ `amount`: `number`; `closeRemainderTo?`: `string`; `from`: `string`; `note?`: `Uint8Array`\<`ArrayBufferLike`\>; `rekeyTo?`: `string`; `suggestedParams`: `SuggestedParams`; `to`: `string`; \} |
| `txn.amount` | `number` |
| `txn.closeRemainderTo?` | `string` |
| `txn.from` | `string` |
| `txn.note?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `txn.rekeyTo?` | `string` |
| `txn.suggestedParams` | `SuggestedParams` |
| `txn.to` | `string` |

###### Returns

`Transaction`

## Variables

### accountTransactionSchemas

```ts
const accountTransactionSchemas: {
  makeKeyRegTxn: {
     properties: {
        from: {
           description: string;
           type: string;
        };
        nonParticipation: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
        selectionKey: {
           description: string;
           type: string;
        };
        stateProofKey: {
           description: string;
           type: string;
        };
        voteFirst: {
           description: string;
           type: string;
        };
        voteKey: {
           description: string;
           type: string;
        };
        voteKeyDilution: {
           description: string;
           type: string;
        };
        voteLast: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makePaymentTxn: {
     description: string;
     properties: {
        amount: {
           description: string;
           type: string;
        };
        closeRemainderTo: {
           description: string;
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
        to: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L17)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="makekeyregtxn-2"></a> `makeKeyRegTxn` | \{ `properties`: \{ `from`: \{ `description`: `string`; `type`: `string`; \}; `nonParticipation`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `selectionKey`: \{ `description`: `string`; `type`: `string`; \}; `stateProofKey`: \{ `description`: `string`; `type`: `string`; \}; `voteFirst`: \{ `description`: `string`; `type`: `string`; \}; `voteKey`: \{ `description`: `string`; `type`: `string`; \}; `voteKeyDilution`: \{ `description`: `string`; `type`: `string`; \}; `voteLast`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L52) |
| `makeKeyRegTxn.properties` | \{ `from`: \{ `description`: `string`; `type`: `string`; \}; `nonParticipation`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `selectionKey`: \{ `description`: `string`; `type`: `string`; \}; `stateProofKey`: \{ `description`: `string`; `type`: `string`; \}; `voteFirst`: \{ `description`: `string`; `type`: `string`; \}; `voteKey`: \{ `description`: `string`; `type`: `string`; \}; `voteKeyDilution`: \{ `description`: `string`; `type`: `string`; \}; `voteLast`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L54) |
| `makeKeyRegTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L55) |
| `makeKeyRegTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L55) |
| `makeKeyRegTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L55) |
| `makeKeyRegTxn.properties.nonParticipation` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L62) |
| `makeKeyRegTxn.properties.nonParticipation.description` | `string` | `'Mark account as nonparticipating for rewards'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L62) |
| `makeKeyRegTxn.properties.nonParticipation.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L62) |
| `makeKeyRegTxn.properties.nonParticipation.type` | `string` | `'boolean'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L62) |
| `makeKeyRegTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L63) |
| `makeKeyRegTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L63) |
| `makeKeyRegTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L63) |
| `makeKeyRegTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L63) |
| `makeKeyRegTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L64) |
| `makeKeyRegTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L64) |
| `makeKeyRegTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L64) |
| `makeKeyRegTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L64) |
| `makeKeyRegTxn.properties.selectionKey` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L57) |
| `makeKeyRegTxn.properties.selectionKey.description` | `string` | `'VRF public key (32 bytes base64 encoded)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L57) |
| `makeKeyRegTxn.properties.selectionKey.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L57) |
| `makeKeyRegTxn.properties.stateProofKey` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L58) |
| `makeKeyRegTxn.properties.stateProofKey.description` | `string` | `'State proof public key (64 bytes base64 encoded)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L58) |
| `makeKeyRegTxn.properties.stateProofKey.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L58) |
| `makeKeyRegTxn.properties.voteFirst` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L59) |
| `makeKeyRegTxn.properties.voteFirst.description` | `string` | `'First round this participation key is valid'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L59) |
| `makeKeyRegTxn.properties.voteFirst.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L59) |
| `makeKeyRegTxn.properties.voteKey` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L56) |
| `makeKeyRegTxn.properties.voteKey.description` | `string` | `'The root participation public key (58 bytes base64 encoded)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L56) |
| `makeKeyRegTxn.properties.voteKey.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L56) |
| `makeKeyRegTxn.properties.voteKeyDilution` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L61) |
| `makeKeyRegTxn.properties.voteKeyDilution.description` | `string` | `'Dilution for the 2-level participation key'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L61) |
| `makeKeyRegTxn.properties.voteKeyDilution.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L61) |
| `makeKeyRegTxn.properties.voteLast` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L60) |
| `makeKeyRegTxn.properties.voteLast.description` | `string` | `'Last round this participation key is valid'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L60) |
| `makeKeyRegTxn.properties.voteLast.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L60) |
| `makeKeyRegTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L66) |
| `makeKeyRegTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L53) |
| <a id="makepaymenttxn-2"></a> `makePaymentTxn` | \{ `description`: `string`; `properties`: \{ `amount`: \{ `description`: `string`; `type`: `string`; \}; `closeRemainderTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `to`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L18) |
| `makePaymentTxn.description` | `string` | `'Create a payment transaction with proper Algorand address strings'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L20) |
| `makePaymentTxn.properties` | \{ `amount`: \{ `description`: `string`; `type`: `string`; \}; `closeRemainderTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `to`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L21) |
| `makePaymentTxn.properties.amount` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L30) |
| `makePaymentTxn.properties.amount.description` | `string` | `'Amount in microAlgos'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L32) |
| `makePaymentTxn.properties.amount.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L31) |
| `makePaymentTxn.properties.closeRemainderTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L39) |
| `makePaymentTxn.properties.closeRemainderTo.description` | `string` | `'Optional close remainder to address in standard Algorand format'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L42) |
| `makePaymentTxn.properties.closeRemainderTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L41) |
| `makePaymentTxn.properties.closeRemainderTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L40) |
| `makePaymentTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L22) |
| `makePaymentTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L24) |
| `makePaymentTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L23) |
| `makePaymentTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L34) |
| `makePaymentTxn.properties.note.description` | `string` | `'Optional transaction note'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L37) |
| `makePaymentTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L36) |
| `makePaymentTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L35) |
| `makePaymentTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L44) |
| `makePaymentTxn.properties.rekeyTo.description` | `string` | `'Optional rekey to address in standard Algorand format'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L47) |
| `makePaymentTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L46) |
| `makePaymentTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L45) |
| `makePaymentTxn.properties.to` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L26) |
| `makePaymentTxn.properties.to.description` | `string` | `'Receiver address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L28) |
| `makePaymentTxn.properties.to.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L27) |
| `makePaymentTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L50) |
| `makePaymentTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L19) |

***

### accountTransactionTools

```ts
const accountTransactionTools: (
  | {
  description: string;
  inputSchema: {
     description: string;
     properties: {
        amount: {
           description: string;
           type: string;
        };
        closeRemainderTo: {
           description: string;
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
        to: {
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
        from: {
           description: string;
           type: string;
        };
        nonParticipation: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
        selectionKey: {
           description: string;
           type: string;
        };
        stateProofKey: {
           description: string;
           type: string;
        };
        voteFirst: {
           description: string;
           type: string;
        };
        voteKey: {
           description: string;
           type: string;
        };
        voteKeyDilution: {
           description: string;
           type: string;
        };
        voteLast: {
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

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.ts#L71)
