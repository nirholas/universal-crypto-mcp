[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/clearTxn

# defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/clearTxn

## Functions

### handleClearTxn()

```ts
function handleClearTxn(args: Record<string, unknown>, suggestedParams: any): Record<string, any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/clearTxn.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/clearTxn.ts#L55)

Handles the application clear state tool request

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `args` | `Record`\<`string`, `unknown`\> | The tool arguments |
| `suggestedParams` | `any` | The suggested transaction parameters |

#### Returns

`Record`\<`string`, `any`\>

The transaction parameters

#### Throws

If the parameters are invalid

***

### makeApplicationClearStateTxn()

```ts
function makeApplicationClearStateTxn(params: AppClearStateTxnParams): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/clearTxn.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/clearTxn.ts#L17)

Creates an application clear state transaction

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppClearStateTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appclearstatetxnparams) | The parameters for clearing application state |

#### Returns

`Transaction`

The created transaction

#### Throws

If the transaction creation fails
