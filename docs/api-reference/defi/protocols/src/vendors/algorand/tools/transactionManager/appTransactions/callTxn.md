[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/callTxn

# defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/callTxn

## Functions

### handleCallTxn()

```ts
function handleCallTxn(args: Record<string, unknown>, suggestedParams: any): Record<string, any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/callTxn.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/callTxn.ts#L55)

Handles the application call tool request

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

### makeApplicationCallTxn()

```ts
function makeApplicationCallTxn(params: AppCallTxnParams): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/callTxn.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/callTxn.ts#L17)

Creates an application call (NoOp) transaction

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCallTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appcalltxnparams) | The parameters for calling the application |

#### Returns

`Transaction`

The created transaction

#### Throws

If the transaction creation fails
