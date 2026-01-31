[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/nfd

# defi/protocols/src/vendors/algorand/tools/apiManager/nfd

## Variables

### nfdTools

```ts
const nfdTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        afterTime?: undefined;
        buyer?: undefined;
        category?: undefined;
        event?: undefined;
        excludeNFDAsSeller?: undefined;
        includeOwner?: undefined;
        limit?: undefined;
        maxPrice?: undefined;
        minPrice?: undefined;
        name?: undefined;
        nameOrID: {
           description: string;
           type: string;
        };
        nocache: {
           description: string;
           type: string;
        };
        offset?: undefined;
        owner?: undefined;
        poll: {
           description: string;
           type: string;
        };
        requireBuyer?: undefined;
        saleType?: undefined;
        seller?: undefined;
        sort?: undefined;
        state?: undefined;
        type?: undefined;
        view: {
           description: string;
           enum: string[];
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
           items: {
              type: string;
           };
           type: string;
        };
        afterTime?: undefined;
        buyer?: undefined;
        category?: undefined;
        event?: undefined;
        excludeNFDAsSeller?: undefined;
        includeOwner?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxPrice?: undefined;
        minPrice?: undefined;
        name?: undefined;
        nameOrID?: undefined;
        nocache?: undefined;
        offset?: undefined;
        owner?: undefined;
        poll?: undefined;
        requireBuyer?: undefined;
        saleType?: undefined;
        seller?: undefined;
        sort?: undefined;
        state?: undefined;
        type?: undefined;
        view: {
           description: string;
           enum: string[];
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
        afterTime: {
           description: string;
           format: string;
           type: string;
        };
        buyer?: undefined;
        category?: undefined;
        event?: undefined;
        excludeNFDAsSeller?: undefined;
        includeOwner?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxPrice?: undefined;
        minPrice?: undefined;
        name: {
           description: string;
           items: {
              type: string;
           };
           type: string;
        };
        nameOrID?: undefined;
        nocache?: undefined;
        offset?: undefined;
        owner?: undefined;
        poll?: undefined;
        requireBuyer?: undefined;
        saleType?: undefined;
        seller?: undefined;
        sort: {
           description: string;
           enum: string[];
           type: string;
        };
        state?: undefined;
        type: {
           description: string;
           enum: string[];
           type: string;
        };
        view?: undefined;
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
        afterTime?: undefined;
        buyer: {
           description: string;
           type: string;
        };
        category: {
           items: {
              enum: string[];
              type: string;
           };
           type: string;
        };
        event: {
           description: string;
           items: {
              type: string;
           };
           type: string;
        };
        excludeNFDAsSeller: {
           description: string;
           type: string;
        };
        includeOwner: {
           description: string;
           type: string;
        };
        limit: {
           description: string;
           type: string;
        };
        maxPrice: {
           description: string;
           type: string;
        };
        minPrice: {
           description: string;
           type: string;
        };
        name: {
           description: string;
           items?: undefined;
           type: string;
        };
        nameOrID?: undefined;
        nocache?: undefined;
        offset: {
           description: string;
           type: string;
        };
        owner?: undefined;
        poll?: undefined;
        requireBuyer: {
           description: string;
           type: string;
        };
        saleType?: undefined;
        seller: {
           description: string;
           type: string;
        };
        sort: {
           description: string;
           enum: string[];
           type: string;
        };
        state?: undefined;
        type?: undefined;
        view?: undefined;
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
        afterTime?: undefined;
        buyer?: undefined;
        category: {
           items: {
              enum: string[];
              type: string;
           };
           type: string;
        };
        event?: undefined;
        excludeNFDAsSeller?: undefined;
        includeOwner?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxPrice: {
           description: string;
           type: string;
        };
        minPrice: {
           description: string;
           type: string;
        };
        name: {
           description: string;
           items?: undefined;
           type: string;
        };
        nameOrID?: undefined;
        nocache?: undefined;
        offset: {
           description: string;
           type: string;
        };
        owner: {
           description: string;
           type: string;
        };
        poll?: undefined;
        requireBuyer?: undefined;
        saleType: {
           items: {
              enum: string[];
              type: string;
           };
           type: string;
        };
        seller?: undefined;
        sort: {
           description: string;
           enum: string[];
           type: string;
        };
        state: {
           items: {
              enum: string[];
              type: string;
           };
           type: string;
        };
        type?: undefined;
        view: {
           description: string;
           enum: string[];
           type: string;
        };
     };
     required?: undefined;
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/nfd/index.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/nfd/index.ts#L10)

## Functions

### handleNFDTools()

```ts
function handleNFDTools(name: string, args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/nfd/index.ts:605](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/nfd/index.ts#L605)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>
