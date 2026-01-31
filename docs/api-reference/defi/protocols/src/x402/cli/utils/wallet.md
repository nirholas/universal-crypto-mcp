[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/cli/utils/wallet

# defi/protocols/src/x402/cli/utils/wallet

## Interfaces

### GeneratedWallet

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L20)

Generated wallet information

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address"></a> `address` | `string` | [defi/protocols/src/x402/cli/utils/wallet.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L21) |
| <a id="mnemonic"></a> `mnemonic?` | `string` | [defi/protocols/src/x402/cli/utils/wallet.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L23) |
| <a id="privatekey"></a> `privateKey` | `` `0x${string}` `` | [defi/protocols/src/x402/cli/utils/wallet.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L22) |

## Functions

### deriveAddress()

```ts
function deriveAddress(privateKey: `0x${string}`): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L58)

Derive address from private key

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `privateKey` | `` `0x${string}` `` |

#### Returns

`string`

***

### exportWallet()

```ts
function exportWallet(privateKey: `0x${string}`): {
  address: string;
  created: string;
  format: string;
  privateKey: string;
};
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L88)

Export wallet information for backup

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `privateKey` | `` `0x${string}` `` |

#### Returns

```ts
{
  address: string;
  created: string;
  format: string;
  privateKey: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `address` | `string` | [defi/protocols/src/x402/cli/utils/wallet.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L89) |
| `created` | `string` | [defi/protocols/src/x402/cli/utils/wallet.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L91) |
| `format` | `string` | [defi/protocols/src/x402/cli/utils/wallet.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L92) |
| `privateKey` | `string` | [defi/protocols/src/x402/cli/utils/wallet.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L90) |

***

### generateVanityAddress()

```ts
function generateVanityAddress(
   prefix: string, 
   maxAttempts: number, 
   onProgress?: (attempt: number) => void): Promise<
  | GeneratedWallet
| null>;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L185)

Create a vanity address (starts with specific characters)
Warning: This can be computationally expensive!

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `prefix` | `string` | `undefined` |
| `maxAttempts` | `number` | `100000` |
| `onProgress?` | (`attempt`: `number`) => `void` | `undefined` |

#### Returns

`Promise`\<
  \| [`GeneratedWallet`](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#generatedwallet)
  \| `null`\>

***

### generateWallet()

```ts
function generateWallet(): GeneratedWallet;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L29)

Generate a new random wallet

#### Returns

[`GeneratedWallet`](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#generatedwallet)

***

### generateWalletWithMnemonic()

```ts
function generateWalletWithMnemonic(): GeneratedWallet;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L42)

Generate a new wallet with mnemonic phrase

#### Returns

[`GeneratedWallet`](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#generatedwallet)

***

### importWallet()

```ts
function importWallet(input: string): 
  | GeneratedWallet
  | null;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L107)

Import wallet from various formats

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

  \| [`GeneratedWallet`](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#generatedwallet)
  \| `null`

***

### isValidAddress()

```ts
function isValidAddress(address: string): boolean;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L81)

Validate Ethereum address format

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

***

### isValidPrivateKey()

```ts
function isValidPrivateKey(key: string): boolean;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L65)

Validate private key format

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

***

### maskPrivateKey()

```ts
function maskPrivateKey(key: string): string;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L174)

Mask private key for display

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

***

### printWalletInfo()

```ts
function printWalletInfo(wallet: GeneratedWallet, showPrivate: boolean): void;
```

Defined in: [defi/protocols/src/x402/cli/utils/wallet.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/cli/utils/wallet.ts#L156)

Print wallet information in a formatted way

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `wallet` | [`GeneratedWallet`](/docs/api/defi/protocols/src/x402/cli/utils/wallet.md#generatedwallet) | `undefined` |
| `showPrivate` | `boolean` | `false` |

#### Returns

`void`
