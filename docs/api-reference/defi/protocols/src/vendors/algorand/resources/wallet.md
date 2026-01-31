[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/resources/wallet

# defi/protocols/src/vendors/algorand/resources/wallet

## Variables

### walletResources

```ts
const walletResources: {
  canHandle: (uri: string) => boolean;
  getResourceDefinitions: () => (
     | {
     description: string;
     name: string;
     schema: {
        properties: {
           accounts?: undefined;
           address?: undefined;
           assets?: undefined;
           mnemonic?: undefined;
           publicKey?: undefined;
           secretKey: {
              type: string;
           };
        };
        type: string;
     };
     uri: string;
   }
     | {
     description: string;
     name: string;
     schema: {
        properties: {
           accounts?: undefined;
           address?: undefined;
           assets?: undefined;
           mnemonic?: undefined;
           publicKey: {
              type: string;
           };
           secretKey?: undefined;
        };
        type: string;
     };
     uri: string;
   }
     | {
     description: string;
     name: string;
     schema: {
        properties: {
           accounts?: undefined;
           address?: undefined;
           assets?: undefined;
           mnemonic: {
              type: string;
           };
           publicKey?: undefined;
           secretKey?: undefined;
        };
        type: string;
     };
     uri: string;
   }
     | {
     description: string;
     name: string;
     schema: {
        properties: {
           accounts?: undefined;
           address: {
              type: string;
           };
           assets?: undefined;
           mnemonic?: undefined;
           publicKey?: undefined;
           secretKey?: undefined;
        };
        type: string;
     };
     uri: string;
   }
     | {
     description: string;
     name: string;
     schema: {
        properties: {
           accounts: {
              items: {
                 properties: {
                    address: {
                       type: ...;
                    };
                    amount: {
                       type: ...;
                    };
                    assets: {
                       type: ...;
                    };
                 };
                 type: string;
              };
              type: string;
           };
           address?: undefined;
           assets?: undefined;
           mnemonic?: undefined;
           publicKey?: undefined;
           secretKey?: undefined;
        };
        type: string;
     };
     uri: string;
   }
     | {
     description: string;
     name: string;
     schema: {
        properties: {
           accounts?: undefined;
           address?: undefined;
           assets: {
              items: {
                 properties: {
                    amount: {
                       type: ...;
                    };
                    frozen: {
                       type: ...;
                    };
                    id: {
                       type: ...;
                    };
                 };
                 type: string;
              };
              type: string;
           };
           mnemonic?: undefined;
           publicKey?: undefined;
           secretKey?: undefined;
        };
        type: string;
     };
     uri: string;
  })[];
  handle: (uri: string) => Promise<
     | {
     contents: {
        mimeType: string;
        text: string;
        uri: "algorand://wallet/account";
     }[];
   }
     | {
     contents: {
        mimeType: string;
        text: string;
        uri: "algorand://wallet/assets";
     }[];
   }
     | {
     contents: {
        mimeType: string;
        text: string;
        uri: "algorand://wallet/secretkey";
     }[];
   }
     | {
     contents: {
        mimeType: string;
        text: string;
        uri: "algorand://wallet/publickey";
     }[];
   }
     | {
     contents: {
        mimeType: string;
        text: string;
        uri: "algorand://wallet/mnemonic";
     }[];
   }
     | {
     contents: {
        mimeType: string;
        text: string;
        uri: "algorand://wallet/address";
     }[];
  }>;
};
```

Defined in: [defi/protocols/src/vendors/algorand/resources/wallet/index.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/resources/wallet/index.ts#L113)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="canhandle"></a> `canHandle()` | (`uri`: `string`) => `boolean` | [defi/protocols/src/vendors/algorand/resources/wallet/index.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/resources/wallet/index.ts#L114) |
| <a id="getresourcedefinitions"></a> `getResourceDefinitions()` | () => ( \| \{ `description`: `string`; `name`: `string`; `schema`: \{ `properties`: \{ `accounts?`: `undefined`; `address?`: `undefined`; `assets?`: `undefined`; `mnemonic?`: `undefined`; `publicKey?`: `undefined`; `secretKey`: \{ `type`: `string`; \}; \}; `type`: `string`; \}; `uri`: `string`; \} \| \{ `description`: `string`; `name`: `string`; `schema`: \{ `properties`: \{ `accounts?`: `undefined`; `address?`: `undefined`; `assets?`: `undefined`; `mnemonic?`: `undefined`; `publicKey`: \{ `type`: `string`; \}; `secretKey?`: `undefined`; \}; `type`: `string`; \}; `uri`: `string`; \} \| \{ `description`: `string`; `name`: `string`; `schema`: \{ `properties`: \{ `accounts?`: `undefined`; `address?`: `undefined`; `assets?`: `undefined`; `mnemonic`: \{ `type`: `string`; \}; `publicKey?`: `undefined`; `secretKey?`: `undefined`; \}; `type`: `string`; \}; `uri`: `string`; \} \| \{ `description`: `string`; `name`: `string`; `schema`: \{ `properties`: \{ `accounts?`: `undefined`; `address`: \{ `type`: `string`; \}; `assets?`: `undefined`; `mnemonic?`: `undefined`; `publicKey?`: `undefined`; `secretKey?`: `undefined`; \}; `type`: `string`; \}; `uri`: `string`; \} \| \{ `description`: `string`; `name`: `string`; `schema`: \{ `properties`: \{ `accounts`: \{ `items`: \{ `properties`: \{ `address`: \{ `type`: ...; \}; `amount`: \{ `type`: ...; \}; `assets`: \{ `type`: ...; \}; \}; `type`: `string`; \}; `type`: `string`; \}; `address?`: `undefined`; `assets?`: `undefined`; `mnemonic?`: `undefined`; `publicKey?`: `undefined`; `secretKey?`: `undefined`; \}; `type`: `string`; \}; `uri`: `string`; \} \| \{ `description`: `string`; `name`: `string`; `schema`: \{ `properties`: \{ `accounts?`: `undefined`; `address?`: `undefined`; `assets`: \{ `items`: \{ `properties`: \{ `amount`: \{ `type`: ...; \}; `frozen`: \{ `type`: ...; \}; `id`: \{ `type`: ...; \}; \}; `type`: `string`; \}; `type`: `string`; \}; `mnemonic?`: `undefined`; `publicKey?`: `undefined`; `secretKey?`: `undefined`; \}; `type`: `string`; \}; `uri`: `string`; \})[] | [defi/protocols/src/vendors/algorand/resources/wallet/index.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/resources/wallet/index.ts#L272) |
| <a id="handle"></a> `handle()` | (`uri`: `string`) => `Promise`\< \| \{ `contents`: \{ `mimeType`: `string`; `text`: `string`; `uri`: `"algorand://wallet/account"`; \}[]; \} \| \{ `contents`: \{ `mimeType`: `string`; `text`: `string`; `uri`: `"algorand://wallet/assets"`; \}[]; \} \| \{ `contents`: \{ `mimeType`: `string`; `text`: `string`; `uri`: `"algorand://wallet/secretkey"`; \}[]; \} \| \{ `contents`: \{ `mimeType`: `string`; `text`: `string`; `uri`: `"algorand://wallet/publickey"`; \}[]; \} \| \{ `contents`: \{ `mimeType`: `string`; `text`: `string`; `uri`: `"algorand://wallet/mnemonic"`; \}[]; \} \| \{ `contents`: \{ `mimeType`: `string`; `text`: `string`; `uri`: `"algorand://wallet/address"`; \}[]; \}\> | [defi/protocols/src/vendors/algorand/resources/wallet/index.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/resources/wallet/index.ts#L118) |
