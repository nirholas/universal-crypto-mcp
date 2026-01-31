[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions

# defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions

## Classes

### AppTransactionManager

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/index.ts#L58)

#### Constructors

##### Constructor

```ts
new AppTransactionManager(): AppTransactionManager;
```

###### Returns

[`AppTransactionManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions.md#apptransactionmanager)

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

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/index.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/index.ts#L62)

Handle application transaction tools

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

## References

### AppCallTxnParams

Re-exports [AppCallTxnParams](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appcalltxnparams)

***

### AppClearStateTxnParams

Re-exports [AppClearStateTxnParams](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appclearstatetxnparams)

***

### AppCloseOutTxnParams

Re-exports [AppCloseOutTxnParams](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appcloseouttxnparams)

***

### AppCreateTxnParams

Re-exports [AppCreateTxnParams](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appcreatetxnparams)

***

### AppDeleteTxnParams

Re-exports [AppDeleteTxnParams](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appdeletetxnparams)

***

### AppOptInTxnParams

Re-exports [AppOptInTxnParams](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appoptintxnparams)

***

### appTransactionSchemas

Re-exports [appTransactionSchemas](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#apptransactionschemas)

***

### appTransactionTools

Re-exports [appTransactionTools](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#apptransactiontools)

***

### AppUpdateTxnParams

Re-exports [AppUpdateTxnParams](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appupdatetxnparams)

***

### BaseAppTxnParams

Re-exports [BaseAppTxnParams](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams)

***

### handleCallTxn

Re-exports [handleCallTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/callTxn.md#handlecalltxn)

***

### handleClearTxn

Re-exports [handleClearTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/clearTxn.md#handlecleartxn)

***

### handleCloseOutTxn

Re-exports [handleCloseOutTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/closeOutTxn.md#handlecloseouttxn)

***

### handleCreateTxn

Re-exports [handleCreateTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/createTxn.md#handlecreatetxn)

***

### handleDeleteTxn

Re-exports [handleDeleteTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/deleteTxn.md#handledeletetxn)

***

### handleOptInTxn

Re-exports [handleOptInTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/optInTxn.md#handleoptintxn)

***

### handleUpdateTxn

Re-exports [handleUpdateTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/updateTxn.md#handleupdatetxn)

***

### makeApplicationCallTxn

Re-exports [makeApplicationCallTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/callTxn.md#makeapplicationcalltxn)

***

### makeApplicationClearStateTxn

Re-exports [makeApplicationClearStateTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/clearTxn.md#makeapplicationclearstatetxn)

***

### makeApplicationCloseOutTxn

Re-exports [makeApplicationCloseOutTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/closeOutTxn.md#makeapplicationcloseouttxn)

***

### makeApplicationCreateTxn

Re-exports [makeApplicationCreateTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/createTxn.md#makeapplicationcreatetxn)

***

### makeApplicationDeleteTxn

Re-exports [makeApplicationDeleteTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/deleteTxn.md#makeapplicationdeletetxn)

***

### makeApplicationOptInTxn

Re-exports [makeApplicationOptInTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/optInTxn.md#makeapplicationoptintxn)

***

### makeApplicationUpdateTxn

Re-exports [makeApplicationUpdateTxn](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/updateTxn.md#makeapplicationupdatetxn)
