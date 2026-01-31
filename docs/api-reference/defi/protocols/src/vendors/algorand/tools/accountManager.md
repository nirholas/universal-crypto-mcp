[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/accountManager

# defi/protocols/src/vendors/algorand/tools/accountManager

## Classes

### AccountManager

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L70)

#### Constructors

##### Constructor

```ts
new AccountManager(): AccountManager;
```

###### Returns

[`AccountManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/accountManager.md#accountmanager)

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accounttools"></a> `accountTools` | `readonly` | ( \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ \}; `required`: `never`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `sourceAddress`: \{ `description`: `string`; `type`: `string`; \}; `targetAddress`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `mnemonic`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `mdk`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `secretKey`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `seed`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \})[] | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L71) |

#### Methods

##### createAccount()

```ts
static createAccount(): {
  address: string;
  mnemonic: string;
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L245)

Creates a new account

###### Returns

```ts
{
  address: string;
  mnemonic: string;
}
```

Object containing the address and mnemonic

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `address` | `string` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L245) |
| `mnemonic` | `string` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L245) |

##### createRekeyTransaction()

```ts
static createRekeyTransaction(fromAddress: string, toAddress: string): Promise<Transaction>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L268)

Rekeys an account to a new address

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `fromAddress` | `string` | The address to rekey from |
| `toAddress` | `string` | The address to rekey to |

###### Returns

`Promise`\<`Transaction`\>

The rekey transaction object

##### handleTool()

```ts
static handleTool(name: string, args: Record<string, unknown>): Promise<{
  content: {
     text: string;
     type: string;
  }[];
}>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L115)

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

##### masterDerivationKeyToMnemonic()

```ts
static masterDerivationKeyToMnemonic(mdk: Uint8Array): string;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L311)

Converts a master derivation key to a mnemonic

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `mdk` | `Uint8Array` | The master derivation key to convert |

###### Returns

`string`

The mnemonic

##### mnemonicFromSeed()

```ts
static mnemonicFromSeed(seed: Uint8Array): string;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:379](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L379)

Generates a mnemonic from a seed

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `seed` | `Uint8Array` | The seed to generate the mnemonic from |

###### Returns

`string`

The mnemonic

##### mnemonicToMasterDerivationKey()

```ts
static mnemonicToMasterDerivationKey(mnemonic: string): Uint8Array;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:294](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L294)

Converts a mnemonic to a master derivation key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `mnemonic` | `string` | The mnemonic to convert |

###### Returns

`Uint8Array`

The master derivation key

##### mnemonicToSecretKey()

```ts
static mnemonicToSecretKey(mnemonic: string): {
  addr: string;
  sk: Uint8Array;
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L345)

Converts a mnemonic to a secret key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `mnemonic` | `string` | The mnemonic to convert |

###### Returns

```ts
{
  addr: string;
  sk: Uint8Array;
}
```

The secret key

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `addr` | `string` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L345) |
| `sk` | `Uint8Array` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L345) |

##### secretKeyToMnemonic()

```ts
static secretKeyToMnemonic(secretKey: Uint8Array): string;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:328](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L328)

Converts a secret key to a mnemonic

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `secretKey` | `Uint8Array` | The secret key to convert |

###### Returns

`string`

The mnemonic

##### seedFromMnemonic()

```ts
static seedFromMnemonic(mnemonic: string): Uint8Array;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L362)

Generates a seed from a mnemonic

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `mnemonic` | `string` | The mnemonic to generate the seed from |

###### Returns

`Uint8Array`

The seed

## Variables

### accountToolSchemas

```ts
const accountToolSchemas: {
  createAccount: {
     properties: {
     };
     required: never[];
     type: string;
  };
  mdkToMnemonic: {
     properties: {
        mdk: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  mnemonicFromSeed: {
     properties: {
        seed: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  mnemonicToMdk: {
     properties: {
        mnemonic: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  mnemonicToSecretKey: {
     properties: {
        mnemonic: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  rekeyAccount: {
     properties: {
        sourceAddress: {
           description: string;
           type: string;
        };
        targetAddress: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  secretKeyToMnemonic: {
     properties: {
        secretKey: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  seedFromMnemonic: {
     properties: {
        mnemonic: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/accountManager.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L12)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="createaccount-2"></a> `createAccount` | \{ `properties`: \{ \}; `required`: `never`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L13) |
| `createAccount.properties` | \{ \} | `{}` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L15) |
| `createAccount.required` | `never`[] | `[]` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L16) |
| `createAccount.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L14) |
| <a id="mdktomnemonic"></a> `mdkToMnemonic` | \{ `properties`: \{ `mdk`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L33) |
| `mdkToMnemonic.properties` | \{ `mdk`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L35) |
| `mdkToMnemonic.properties.mdk` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L36) |
| `mdkToMnemonic.properties.mdk.description` | `string` | `'The master derivation key in hexadecimal format'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L36) |
| `mdkToMnemonic.properties.mdk.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L36) |
| `mdkToMnemonic.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L38) |
| `mdkToMnemonic.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L34) |
| <a id="mnemonicfromseed-2"></a> `mnemonicFromSeed` | \{ `properties`: \{ `seed`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L61) |
| `mnemonicFromSeed.properties` | \{ `seed`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L63) |
| `mnemonicFromSeed.properties.seed` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L64) |
| `mnemonicFromSeed.properties.seed.description` | `string` | `'The seed in hexadecimal format to generate a mnemonic from'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L64) |
| `mnemonicFromSeed.properties.seed.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L64) |
| `mnemonicFromSeed.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L66) |
| `mnemonicFromSeed.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L62) |
| <a id="mnemonictomdk"></a> `mnemonicToMdk` | \{ `properties`: \{ `mnemonic`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L26) |
| `mnemonicToMdk.properties` | \{ `mnemonic`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L28) |
| `mnemonicToMdk.properties.mnemonic` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L29) |
| `mnemonicToMdk.properties.mnemonic.description` | `string` | `'The mnemonic phrase to convert to a master derivation key'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L29) |
| `mnemonicToMdk.properties.mnemonic.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L29) |
| `mnemonicToMdk.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L31) |
| `mnemonicToMdk.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L27) |
| <a id="mnemonictosecretkey-2"></a> `mnemonicToSecretKey` | \{ `properties`: \{ `mnemonic`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L47) |
| `mnemonicToSecretKey.properties` | \{ `mnemonic`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L49) |
| `mnemonicToSecretKey.properties.mnemonic` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L50) |
| `mnemonicToSecretKey.properties.mnemonic.description` | `string` | `'The mnemonic phrase to convert to a secret key'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L50) |
| `mnemonicToSecretKey.properties.mnemonic.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L50) |
| `mnemonicToSecretKey.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L52) |
| `mnemonicToSecretKey.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L48) |
| <a id="rekeyaccount"></a> `rekeyAccount` | \{ `properties`: \{ `sourceAddress`: \{ `description`: `string`; `type`: `string`; \}; `targetAddress`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L18) |
| `rekeyAccount.properties` | \{ `sourceAddress`: \{ `description`: `string`; `type`: `string`; \}; `targetAddress`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L20) |
| `rekeyAccount.properties.sourceAddress` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L21) |
| `rekeyAccount.properties.sourceAddress.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L21) |
| `rekeyAccount.properties.sourceAddress.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L21) |
| `rekeyAccount.properties.targetAddress` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L22) |
| `rekeyAccount.properties.targetAddress.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L22) |
| `rekeyAccount.properties.targetAddress.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L22) |
| `rekeyAccount.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L24) |
| `rekeyAccount.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L19) |
| <a id="secretkeytomnemonic-2"></a> `secretKeyToMnemonic` | \{ `properties`: \{ `secretKey`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L40) |
| `secretKeyToMnemonic.properties` | \{ `secretKey`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L42) |
| `secretKeyToMnemonic.properties.secretKey` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L43) |
| `secretKeyToMnemonic.properties.secretKey.description` | `string` | `'The secret key in hexadecimal format'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L43) |
| `secretKeyToMnemonic.properties.secretKey.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L43) |
| `secretKeyToMnemonic.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L45) |
| `secretKeyToMnemonic.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L41) |
| <a id="seedfrommnemonic-2"></a> `seedFromMnemonic` | \{ `properties`: \{ `mnemonic`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L54) |
| `seedFromMnemonic.properties` | \{ `mnemonic`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L56) |
| `seedFromMnemonic.properties.mnemonic` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L57) |
| `seedFromMnemonic.properties.mnemonic.description` | `string` | `'The mnemonic phrase to generate a seed from'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L57) |
| `seedFromMnemonic.properties.mnemonic.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L57) |
| `seedFromMnemonic.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L59) |
| `seedFromMnemonic.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/accountManager.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/accountManager.ts#L55) |
