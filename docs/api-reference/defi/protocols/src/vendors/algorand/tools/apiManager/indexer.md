[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/indexer

# defi/protocols/src/vendors/algorand/tools/apiManager/indexer

## Variables

### indexerTools

```ts
const indexerTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        address: {
           description: string;
           type: string;
        };
        applicationId?: undefined;
        assetId?: undefined;
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        limit?: undefined;
        nextToken?: undefined;
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
        address: {
           description: string;
           type: string;
        };
        applicationId?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        limit: {
           description: string;
           type: string;
        };
        nextToken: {
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
        address?: undefined;
        applicationId: {
           description: string;
           type: string;
        };
        assetId: {
           description: string;
           type: string;
        };
        currencyGreaterThan: {
           description: string;
           type: string;
        };
        currencyLessThan: {
           description: string;
           type: string;
        };
        limit: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
     };
     required?: undefined;
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        appId: {
           description: string;
           type: string;
        };
        boxName?: undefined;
        creator?: undefined;
        limit?: undefined;
        maxBoxes?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        nextToken?: undefined;
        sender?: undefined;
        txid?: undefined;
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
        appId: {
           description: string;
           type: string;
        };
        boxName?: undefined;
        creator?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxBoxes?: undefined;
        maxRound: {
           description: string;
           type: string;
        };
        minRound: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
        sender: {
           description: string;
           type: string;
        };
        txid: {
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
        appId?: undefined;
        boxName?: undefined;
        creator: {
           description: string;
           type: string;
        };
        limit: {
           description: string;
           type: string;
        };
        maxBoxes?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        nextToken: {
           description: string;
           type: string;
        };
        sender?: undefined;
        txid?: undefined;
     };
     required?: undefined;
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        appId: {
           description: string;
           type: string;
        };
        boxName: {
           description: string;
           type: string;
        };
        creator?: undefined;
        limit?: undefined;
        maxBoxes?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        nextToken?: undefined;
        sender?: undefined;
        txid?: undefined;
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
        appId: {
           description: string;
           type: string;
        };
        boxName?: undefined;
        creator?: undefined;
        limit?: undefined;
        maxBoxes: {
           description: string;
           type: string;
        };
        maxRound?: undefined;
        minRound?: undefined;
        nextToken?: undefined;
        sender?: undefined;
        txid?: undefined;
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
        address?: undefined;
        addressRole?: undefined;
        afterTime?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        beforeTime?: undefined;
        creator?: undefined;
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        excludeCloseTo?: undefined;
        limit?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        name?: undefined;
        nextToken?: undefined;
        txid?: undefined;
        unit?: undefined;
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
        address: {
           description: string;
           type: string;
        };
        addressRole?: undefined;
        afterTime?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        beforeTime?: undefined;
        creator?: undefined;
        currencyGreaterThan: {
           description: string;
           type: string;
        };
        currencyLessThan: {
           description: string;
           type: string;
        };
        excludeCloseTo?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxRound?: undefined;
        minRound?: undefined;
        name?: undefined;
        nextToken: {
           description: string;
           type: string;
        };
        txid?: undefined;
        unit?: undefined;
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
        address: {
           description: string;
           type: string;
        };
        addressRole: {
           description: string;
           type: string;
        };
        afterTime: {
           description: string;
           type: string;
        };
        assetId: {
           description: string;
           type: string;
        };
        beforeTime: {
           description: string;
           type: string;
        };
        creator?: undefined;
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        excludeCloseTo: {
           description: string;
           type: string;
        };
        limit: {
           description: string;
           type: string;
        };
        maxRound: {
           description: string;
           type: string;
        };
        minRound: {
           description: string;
           type: string;
        };
        name?: undefined;
        nextToken: {
           description: string;
           type: string;
        };
        txid: {
           description: string;
           type: string;
        };
        unit?: undefined;
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
        address?: undefined;
        addressRole?: undefined;
        afterTime?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        beforeTime?: undefined;
        creator: {
           description: string;
           type: string;
        };
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        excludeCloseTo?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxRound?: undefined;
        minRound?: undefined;
        name: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
        txid?: undefined;
        unit: {
           description: string;
           type: string;
        };
     };
     required?: undefined;
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addressRole?: undefined;
        afterTime?: undefined;
        applicationId?: undefined;
        assetId?: undefined;
        beforeTime?: undefined;
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        limit?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        nextToken?: undefined;
        round?: undefined;
        txId: {
           description: string;
           type: string;
        };
        txType?: undefined;
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
        address: {
           description: string;
           type: string;
        };
        addressRole?: undefined;
        afterTime: {
           description: string;
           type: string;
        };
        applicationId?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        beforeTime: {
           description: string;
           type: string;
        };
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxRound: {
           description: string;
           type: string;
        };
        minRound: {
           description: string;
           type: string;
        };
        nextToken?: undefined;
        round?: undefined;
        txId?: undefined;
        txType: {
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
        address: {
           description: string;
           type: string;
        };
        addressRole: {
           description: string;
           type: string;
        };
        afterTime: {
           description: string;
           type: string;
        };
        applicationId: {
           description: string;
           type: string;
        };
        assetId: {
           description: string;
           type: string;
        };
        beforeTime: {
           description: string;
           type: string;
        };
        currencyGreaterThan: {
           description: string;
           type: string;
        };
        currencyLessThan: {
           description: string;
           type: string;
        };
        limit: {
           description: string;
           type: string;
        };
        maxRound: {
           description: string;
           type: string;
        };
        minRound: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
        round: {
           description: string;
           type: string;
        };
        txId?: undefined;
        txType: {
           description: string;
           type: string;
        };
     };
     required?: undefined;
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/index.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/index.ts#L14)

## Functions

### handleIndexerTools()

```ts
function handleIndexerTools(name: string, args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/index.ts#L22)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>
