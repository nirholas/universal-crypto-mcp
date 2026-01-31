[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/algod

# defi/protocols/src/vendors/algorand/tools/apiManager/algod

## Variables

### algodTools

```ts
const algodTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        address: {
           description: string;
           type: string;
        };
        appId?: undefined;
        assetId?: undefined;
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
        appId: {
           description: string;
           type: string;
        };
        assetId?: undefined;
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
        maxBoxes?: undefined;
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
        boxName: {
           description: string;
           type: string;
        };
        maxBoxes?: undefined;
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
        maxBoxes: {
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
        assetId: {
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
        maxTxns?: undefined;
        round?: undefined;
        txId: {
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
        maxTxns?: undefined;
        round?: undefined;
        txId?: undefined;
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
        maxTxns: {
           description: string;
           type: string;
        };
        round?: undefined;
        txId?: undefined;
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
        maxTxns?: undefined;
        round?: undefined;
        txId?: undefined;
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
        maxTxns?: undefined;
        round: {
           description: string;
           type: string;
        };
        txId?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/index.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/index.ts#L14)

## Functions

### handleAlgodTools()

```ts
function handleAlgodTools(name: string, args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/index.ts#L22)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>
