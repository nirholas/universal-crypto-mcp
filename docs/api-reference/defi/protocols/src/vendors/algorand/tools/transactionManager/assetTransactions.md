[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions

# defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions

## Classes

### AssetTransactionManager

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L122)

#### Constructors

##### Constructor

```ts
new AssetTransactionManager(): AssetTransactionManager;
```

###### Returns

[`AssetTransactionManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.md#assettransactionmanager)

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

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L210)

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

##### makeAssetConfigTxn()

```ts
static makeAssetConfigTxn(params: {
  assetIndex: number;
  clawback?: string;
  freeze?: string;
  from: string;
  manager?: string;
  note?: Uint8Array<ArrayBufferLike>;
  rekeyTo?: string;
  reserve?: string;
  strictEmptyAddressChecking: boolean;
  suggestedParams: SuggestedParams;
}): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L149)

Creates an asset configuration transaction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `assetIndex`: `number`; `clawback?`: `string`; `freeze?`: `string`; `from`: `string`; `manager?`: `string`; `note?`: `Uint8Array`\<`ArrayBufferLike`\>; `rekeyTo?`: `string`; `reserve?`: `string`; `strictEmptyAddressChecking`: `boolean`; `suggestedParams`: `SuggestedParams`; \} |
| `params.assetIndex` | `number` |
| `params.clawback?` | `string` |
| `params.freeze?` | `string` |
| `params.from` | `string` |
| `params.manager?` | `string` |
| `params.note?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `params.rekeyTo?` | `string` |
| `params.reserve?` | `string` |
| `params.strictEmptyAddressChecking` | `boolean` |
| `params.suggestedParams` | `SuggestedParams` |

###### Returns

`Transaction`

##### makeAssetCreateTxn()

```ts
static makeAssetCreateTxn(params: {
  assetMetadataHash?: string | Uint8Array<ArrayBufferLike>;
  assetName?: string;
  assetURL?: string;
  clawback?: string;
  decimals: number;
  defaultFrozen: boolean;
  freeze?: string;
  from: string;
  manager?: string;
  note?: Uint8Array<ArrayBufferLike>;
  rekeyTo?: string;
  reserve?: string;
  suggestedParams: SuggestedParams;
  total: number | bigint;
  unitName?: string;
}): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L126)

Creates an asset creation transaction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `assetMetadataHash?`: `string` \| `Uint8Array`\<`ArrayBufferLike`\>; `assetName?`: `string`; `assetURL?`: `string`; `clawback?`: `string`; `decimals`: `number`; `defaultFrozen`: `boolean`; `freeze?`: `string`; `from`: `string`; `manager?`: `string`; `note?`: `Uint8Array`\<`ArrayBufferLike`\>; `rekeyTo?`: `string`; `reserve?`: `string`; `suggestedParams`: `SuggestedParams`; `total`: `number` \| `bigint`; `unitName?`: `string`; \} |
| `params.assetMetadataHash?` | `string` \| `Uint8Array`\<`ArrayBufferLike`\> |
| `params.assetName?` | `string` |
| `params.assetURL?` | `string` |
| `params.clawback?` | `string` |
| `params.decimals` | `number` |
| `params.defaultFrozen` | `boolean` |
| `params.freeze?` | `string` |
| `params.from` | `string` |
| `params.manager?` | `string` |
| `params.note?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `params.rekeyTo?` | `string` |
| `params.reserve?` | `string` |
| `params.suggestedParams` | `SuggestedParams` |
| `params.total` | `number` \| `bigint` |
| `params.unitName?` | `string` |

###### Returns

`Transaction`

##### makeAssetDestroyTxn()

```ts
static makeAssetDestroyTxn(params: {
  assetIndex: number;
  from: string;
  note?: Uint8Array<ArrayBufferLike>;
  rekeyTo?: string;
  suggestedParams: SuggestedParams;
}): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L167)

Creates an asset destroy transaction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `assetIndex`: `number`; `from`: `string`; `note?`: `Uint8Array`\<`ArrayBufferLike`\>; `rekeyTo?`: `string`; `suggestedParams`: `SuggestedParams`; \} |
| `params.assetIndex` | `number` |
| `params.from` | `string` |
| `params.note?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `params.rekeyTo?` | `string` |
| `params.suggestedParams` | `SuggestedParams` |

###### Returns

`Transaction`

##### makeAssetFreezeTxn()

```ts
static makeAssetFreezeTxn(params: {
  assetIndex: number;
  freezeState: boolean;
  freezeTarget: string;
  from: string;
  note?: Uint8Array<ArrayBufferLike>;
  rekeyTo?: string;
  suggestedParams: SuggestedParams;
}): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L180)

Creates an asset freeze transaction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `assetIndex`: `number`; `freezeState`: `boolean`; `freezeTarget`: `string`; `from`: `string`; `note?`: `Uint8Array`\<`ArrayBufferLike`\>; `rekeyTo?`: `string`; `suggestedParams`: `SuggestedParams`; \} |
| `params.assetIndex` | `number` |
| `params.freezeState` | `boolean` |
| `params.freezeTarget` | `string` |
| `params.from` | `string` |
| `params.note?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `params.rekeyTo?` | `string` |
| `params.suggestedParams` | `SuggestedParams` |

###### Returns

`Transaction`

##### makeAssetTransferTxn()

```ts
static makeAssetTransferTxn(params: {
  amount: number | bigint;
  assetIndex: number;
  closeRemainderTo?: string;
  from: string;
  note?: Uint8Array<ArrayBufferLike>;
  rekeyTo?: string;
  revocationTarget?: string;
  suggestedParams: SuggestedParams;
  to: string;
}): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L195)

Creates an asset transfer transaction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `amount`: `number` \| `bigint`; `assetIndex`: `number`; `closeRemainderTo?`: `string`; `from`: `string`; `note?`: `Uint8Array`\<`ArrayBufferLike`\>; `rekeyTo?`: `string`; `revocationTarget?`: `string`; `suggestedParams`: `SuggestedParams`; `to`: `string`; \} |
| `params.amount` | `number` \| `bigint` |
| `params.assetIndex` | `number` |
| `params.closeRemainderTo?` | `string` |
| `params.from` | `string` |
| `params.note?` | `Uint8Array`\<`ArrayBufferLike`\> |
| `params.rekeyTo?` | `string` |
| `params.revocationTarget?` | `string` |
| `params.suggestedParams` | `SuggestedParams` |
| `params.to` | `string` |

###### Returns

`Transaction`

## Variables

### assetTransactionSchemas

```ts
const assetTransactionSchemas: {
  makeAssetConfigTxn: {
     properties: {
        assetIndex: {
           description: string;
           type: string;
        };
        clawback: {
           description: string;
           optional: boolean;
           type: string;
        };
        freeze: {
           description: string;
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        manager: {
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
        reserve: {
           description: string;
           optional: boolean;
           type: string;
        };
        strictEmptyAddressChecking: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makeAssetCreateTxn: {
     properties: {
        assetMetadataHash: {
           description: string;
           optional: boolean;
           type: string;
        };
        assetName: {
           description: string;
           optional: boolean;
           type: string;
        };
        assetURL: {
           description: string;
           optional: boolean;
           type: string;
        };
        clawback: {
           description: string;
           optional: boolean;
           type: string;
        };
        decimals: {
           description: string;
           type: string;
        };
        defaultFrozen: {
           description: string;
           type: string;
        };
        freeze: {
           description: string;
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        manager: {
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
        reserve: {
           description: string;
           optional: boolean;
           type: string;
        };
        total: {
           description: string;
           type: string;
        };
        unitName: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makeAssetDestroyTxn: {
     properties: {
        assetIndex: {
           description: string;
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
     };
     required: string[];
     type: string;
  };
  makeAssetFreezeTxn: {
     properties: {
        assetIndex: {
           description: string;
           type: string;
        };
        freezeState: {
           description: string;
           type: string;
        };
        freezeTarget: {
           description: string;
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
     };
     required: string[];
     type: string;
  };
  makeAssetTransferTxn: {
     properties: {
        amount: {
           description: string;
           type: string;
        };
        assetIndex: {
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

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L20)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="makeassetconfigtxn-2"></a> `makeAssetConfigTxn` | \{ `properties`: \{ `assetIndex`: \{ `description`: `string`; `type`: `string`; \}; `clawback`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `freeze`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `manager`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `reserve`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `strictEmptyAddressChecking`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L41) |
| `makeAssetConfigTxn.properties` | \{ `assetIndex`: \{ `description`: `string`; `type`: `string`; \}; `clawback`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `freeze`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `manager`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `reserve`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `strictEmptyAddressChecking`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L43) |
| `makeAssetConfigTxn.properties.assetIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L45) |
| `makeAssetConfigTxn.properties.assetIndex.description` | `string` | `'Index of the asset to reconfigure'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L45) |
| `makeAssetConfigTxn.properties.assetIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L45) |
| `makeAssetConfigTxn.properties.clawback` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L49) |
| `makeAssetConfigTxn.properties.clawback.description` | `string` | `'New address that can revoke the asset from holders'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L49) |
| `makeAssetConfigTxn.properties.clawback.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L49) |
| `makeAssetConfigTxn.properties.clawback.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L49) |
| `makeAssetConfigTxn.properties.freeze` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L48) |
| `makeAssetConfigTxn.properties.freeze.description` | `string` | `'New address that can freeze/unfreeze holder accounts'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L48) |
| `makeAssetConfigTxn.properties.freeze.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L48) |
| `makeAssetConfigTxn.properties.freeze.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L48) |
| `makeAssetConfigTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L44) |
| `makeAssetConfigTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L44) |
| `makeAssetConfigTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L44) |
| `makeAssetConfigTxn.properties.manager` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L46) |
| `makeAssetConfigTxn.properties.manager.description` | `string` | `'New address that can manage the asset configuration'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L46) |
| `makeAssetConfigTxn.properties.manager.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L46) |
| `makeAssetConfigTxn.properties.manager.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L46) |
| `makeAssetConfigTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L51) |
| `makeAssetConfigTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L51) |
| `makeAssetConfigTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L51) |
| `makeAssetConfigTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L51) |
| `makeAssetConfigTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L52) |
| `makeAssetConfigTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L52) |
| `makeAssetConfigTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L52) |
| `makeAssetConfigTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L52) |
| `makeAssetConfigTxn.properties.reserve` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L47) |
| `makeAssetConfigTxn.properties.reserve.description` | `string` | `'New address holding reserve funds for the asset'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L47) |
| `makeAssetConfigTxn.properties.reserve.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L47) |
| `makeAssetConfigTxn.properties.reserve.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L47) |
| `makeAssetConfigTxn.properties.strictEmptyAddressChecking` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L50) |
| `makeAssetConfigTxn.properties.strictEmptyAddressChecking.description` | `string` | `'Whether to error if any provided address is empty'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L50) |
| `makeAssetConfigTxn.properties.strictEmptyAddressChecking.type` | `string` | `'boolean'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L50) |
| `makeAssetConfigTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L54) |
| `makeAssetConfigTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L42) |
| <a id="makeassetcreatetxn-2"></a> `makeAssetCreateTxn` | \{ `properties`: \{ `assetMetadataHash`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `assetName`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `assetURL`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `clawback`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `decimals`: \{ `description`: `string`; `type`: `string`; \}; `defaultFrozen`: \{ `description`: `string`; `type`: `string`; \}; `freeze`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `manager`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `reserve`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `total`: \{ `description`: `string`; `type`: `string`; \}; `unitName`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L21) |
| `makeAssetCreateTxn.properties` | \{ `assetMetadataHash`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `assetName`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `assetURL`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `clawback`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `decimals`: \{ `description`: `string`; `type`: `string`; \}; `defaultFrozen`: \{ `description`: `string`; `type`: `string`; \}; `freeze`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `manager`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `reserve`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `total`: \{ `description`: `string`; `type`: `string`; \}; `unitName`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L23) |
| `makeAssetCreateTxn.properties.assetMetadataHash` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L31) |
| `makeAssetCreateTxn.properties.assetMetadataHash.description` | `string` | `'Hash commitment of some sort of asset metadata (32-byte string)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L31) |
| `makeAssetCreateTxn.properties.assetMetadataHash.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L31) |
| `makeAssetCreateTxn.properties.assetMetadataHash.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L31) |
| `makeAssetCreateTxn.properties.assetName` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L29) |
| `makeAssetCreateTxn.properties.assetName.description` | `string` | `'Full name of the asset (1-32 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L29) |
| `makeAssetCreateTxn.properties.assetName.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L29) |
| `makeAssetCreateTxn.properties.assetName.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L29) |
| `makeAssetCreateTxn.properties.assetURL` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L30) |
| `makeAssetCreateTxn.properties.assetURL.description` | `string` | `'URL where more information about the asset can be found'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L30) |
| `makeAssetCreateTxn.properties.assetURL.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L30) |
| `makeAssetCreateTxn.properties.assetURL.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L30) |
| `makeAssetCreateTxn.properties.clawback` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L35) |
| `makeAssetCreateTxn.properties.clawback.description` | `string` | `'Address that can revoke the asset from holders'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L35) |
| `makeAssetCreateTxn.properties.clawback.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L35) |
| `makeAssetCreateTxn.properties.clawback.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L35) |
| `makeAssetCreateTxn.properties.decimals` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L26) |
| `makeAssetCreateTxn.properties.decimals.description` | `string` | `'Number of decimals for display purposes (0-19)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L26) |
| `makeAssetCreateTxn.properties.decimals.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L26) |
| `makeAssetCreateTxn.properties.defaultFrozen` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L27) |
| `makeAssetCreateTxn.properties.defaultFrozen.description` | `string` | `'Whether accounts should be frozen by default'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L27) |
| `makeAssetCreateTxn.properties.defaultFrozen.type` | `string` | `'boolean'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L27) |
| `makeAssetCreateTxn.properties.freeze` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L34) |
| `makeAssetCreateTxn.properties.freeze.description` | `string` | `'Address that can freeze/unfreeze holder accounts'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L34) |
| `makeAssetCreateTxn.properties.freeze.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L34) |
| `makeAssetCreateTxn.properties.freeze.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L34) |
| `makeAssetCreateTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L24) |
| `makeAssetCreateTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L24) |
| `makeAssetCreateTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L24) |
| `makeAssetCreateTxn.properties.manager` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L32) |
| `makeAssetCreateTxn.properties.manager.description` | `string` | `'Address that can manage the asset configuration'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L32) |
| `makeAssetCreateTxn.properties.manager.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L32) |
| `makeAssetCreateTxn.properties.manager.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L32) |
| `makeAssetCreateTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L36) |
| `makeAssetCreateTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L36) |
| `makeAssetCreateTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L36) |
| `makeAssetCreateTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L36) |
| `makeAssetCreateTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L37) |
| `makeAssetCreateTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L37) |
| `makeAssetCreateTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L37) |
| `makeAssetCreateTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L37) |
| `makeAssetCreateTxn.properties.reserve` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L33) |
| `makeAssetCreateTxn.properties.reserve.description` | `string` | `'Address holding reserve funds for the asset'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L33) |
| `makeAssetCreateTxn.properties.reserve.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L33) |
| `makeAssetCreateTxn.properties.reserve.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L33) |
| `makeAssetCreateTxn.properties.total` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L25) |
| `makeAssetCreateTxn.properties.total.description` | `string` | `'Total number of base units of the asset to create'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L25) |
| `makeAssetCreateTxn.properties.total.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L25) |
| `makeAssetCreateTxn.properties.unitName` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L28) |
| `makeAssetCreateTxn.properties.unitName.description` | `string` | `'Short name for the asset (1-8 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L28) |
| `makeAssetCreateTxn.properties.unitName.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L28) |
| `makeAssetCreateTxn.properties.unitName.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L28) |
| `makeAssetCreateTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L39) |
| `makeAssetCreateTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L22) |
| <a id="makeassetdestroytxn-2"></a> `makeAssetDestroyTxn` | \{ `properties`: \{ `assetIndex`: \{ `description`: `string`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L56) |
| `makeAssetDestroyTxn.properties` | \{ `assetIndex`: \{ `description`: `string`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L58) |
| `makeAssetDestroyTxn.properties.assetIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L60) |
| `makeAssetDestroyTxn.properties.assetIndex.description` | `string` | `'Index of the asset to destroy'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L60) |
| `makeAssetDestroyTxn.properties.assetIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L60) |
| `makeAssetDestroyTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L59) |
| `makeAssetDestroyTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L59) |
| `makeAssetDestroyTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L59) |
| `makeAssetDestroyTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L61) |
| `makeAssetDestroyTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L61) |
| `makeAssetDestroyTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L61) |
| `makeAssetDestroyTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L61) |
| `makeAssetDestroyTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L62) |
| `makeAssetDestroyTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L62) |
| `makeAssetDestroyTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L62) |
| `makeAssetDestroyTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L62) |
| `makeAssetDestroyTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L64) |
| `makeAssetDestroyTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L57) |
| <a id="makeassetfreezetxn-2"></a> `makeAssetFreezeTxn` | \{ `properties`: \{ `assetIndex`: \{ `description`: `string`; `type`: `string`; \}; `freezeState`: \{ `description`: `string`; `type`: `string`; \}; `freezeTarget`: \{ `description`: `string`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L66) |
| `makeAssetFreezeTxn.properties` | \{ `assetIndex`: \{ `description`: `string`; `type`: `string`; \}; `freezeState`: \{ `description`: `string`; `type`: `string`; \}; `freezeTarget`: \{ `description`: `string`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L68) |
| `makeAssetFreezeTxn.properties.assetIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L70) |
| `makeAssetFreezeTxn.properties.assetIndex.description` | `string` | `'Index of the asset being frozen'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L70) |
| `makeAssetFreezeTxn.properties.assetIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L70) |
| `makeAssetFreezeTxn.properties.freezeState` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L72) |
| `makeAssetFreezeTxn.properties.freezeState.description` | `string` | `'True to freeze the asset, false to unfreeze'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L72) |
| `makeAssetFreezeTxn.properties.freezeState.type` | `string` | `'boolean'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L72) |
| `makeAssetFreezeTxn.properties.freezeTarget` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L71) |
| `makeAssetFreezeTxn.properties.freezeTarget.description` | `string` | `'Address of the account whose asset is being frozen/unfrozen'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L71) |
| `makeAssetFreezeTxn.properties.freezeTarget.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L71) |
| `makeAssetFreezeTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L69) |
| `makeAssetFreezeTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L69) |
| `makeAssetFreezeTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L69) |
| `makeAssetFreezeTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L73) |
| `makeAssetFreezeTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L73) |
| `makeAssetFreezeTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L73) |
| `makeAssetFreezeTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L73) |
| `makeAssetFreezeTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L74) |
| `makeAssetFreezeTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L74) |
| `makeAssetFreezeTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L74) |
| `makeAssetFreezeTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L74) |
| `makeAssetFreezeTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L76) |
| `makeAssetFreezeTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L67) |
| <a id="makeassettransfertxn-2"></a> `makeAssetTransferTxn` | \{ `properties`: \{ `amount`: \{ `description`: `string`; `type`: `string`; \}; `assetIndex`: \{ `description`: `string`; `type`: `string`; \}; `closeRemainderTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `to`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L78) |
| `makeAssetTransferTxn.properties` | \{ `amount`: \{ `description`: `string`; `type`: `string`; \}; `assetIndex`: \{ `description`: `string`; `type`: `string`; \}; `closeRemainderTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `to`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L80) |
| `makeAssetTransferTxn.properties.amount` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L84) |
| `makeAssetTransferTxn.properties.amount.description` | `string` | `'Amount of asset base units to transfer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L84) |
| `makeAssetTransferTxn.properties.amount.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L84) |
| `makeAssetTransferTxn.properties.assetIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L83) |
| `makeAssetTransferTxn.properties.assetIndex.description` | `string` | `'Index of the asset being transferred'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L83) |
| `makeAssetTransferTxn.properties.assetIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L83) |
| `makeAssetTransferTxn.properties.closeRemainderTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L86) |
| `makeAssetTransferTxn.properties.closeRemainderTo.description` | `string` | `'Address to send remaining asset balance to (close asset holding)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L86) |
| `makeAssetTransferTxn.properties.closeRemainderTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L86) |
| `makeAssetTransferTxn.properties.closeRemainderTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L86) |
| `makeAssetTransferTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L81) |
| `makeAssetTransferTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L81) |
| `makeAssetTransferTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L81) |
| `makeAssetTransferTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L85) |
| `makeAssetTransferTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L85) |
| `makeAssetTransferTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L85) |
| `makeAssetTransferTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L85) |
| `makeAssetTransferTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L87) |
| `makeAssetTransferTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L87) |
| `makeAssetTransferTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L87) |
| `makeAssetTransferTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L87) |
| `makeAssetTransferTxn.properties.to` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L82) |
| `makeAssetTransferTxn.properties.to.description` | `string` | `'Recipient address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L82) |
| `makeAssetTransferTxn.properties.to.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L82) |
| `makeAssetTransferTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L89) |
| `makeAssetTransferTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L79) |

***

### assetTransactionTools

```ts
const assetTransactionTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        assetMetadataHash: {
           description: string;
           optional: boolean;
           type: string;
        };
        assetName: {
           description: string;
           optional: boolean;
           type: string;
        };
        assetURL: {
           description: string;
           optional: boolean;
           type: string;
        };
        clawback: {
           description: string;
           optional: boolean;
           type: string;
        };
        decimals: {
           description: string;
           type: string;
        };
        defaultFrozen: {
           description: string;
           type: string;
        };
        freeze: {
           description: string;
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        manager: {
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
        reserve: {
           description: string;
           optional: boolean;
           type: string;
        };
        total: {
           description: string;
           type: string;
        };
        unitName: {
           description: string;
           optional: boolean;
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
        assetIndex: {
           description: string;
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
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.ts#L94)
