[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager

# defi/protocols/src/vendors/algorand/tools/transactionManager

## Classes

### TransactionManager

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/index.ts#L21)

#### Constructors

##### Constructor

```ts
new TransactionManager(): TransactionManager;
```

###### Returns

[`TransactionManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager.md#transactionmanager)

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

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/index.ts#L23)

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

### transactionTools

```ts
const transactionTools: (
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
}
  | {
  description: string;
  inputSchema: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        approvalProgram: {
           description: string;
           type: string;
        };
        clearProgram: {
           description: string;
           type: string;
        };
        extraPages: {
           description: string;
           optional: boolean;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        lease: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        numGlobalByteSlices: {
           description: string;
           type: string;
        };
        numGlobalInts: {
           description: string;
           type: string;
        };
        numLocalByteSlices: {
           description: string;
           type: string;
        };
        numLocalInts: {
           description: string;
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
}
  | {
  description: string;
  inputSchema: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appIndex: {
           description: string;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
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
}
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

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/index.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/index.ts#L14)

## References

### AccountTransactionManager

Re-exports [AccountTransactionManager](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/accountTransactions.md#accounttransactionmanager)

***

### AppTransactionManager

Re-exports [AppTransactionManager](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions.md#apptransactionmanager)

***

### AssetTransactionManager

Re-exports [AssetTransactionManager](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/assetTransactions.md#assettransactionmanager)

***

### GeneralTransactionManager

Re-exports [GeneralTransactionManager](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/generalTransaction.md#generaltransactionmanager)
