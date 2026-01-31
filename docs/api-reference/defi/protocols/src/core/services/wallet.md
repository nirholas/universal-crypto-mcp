[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/core/services/wallet

# defi/protocols/src/core/services/wallet

## Functions

### getConfiguredAccount()

```ts
function getConfiguredAccount(): 
  | {
}
  | {
};
```

Defined in: [defi/protocols/src/core/services/wallet.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/wallet.ts#L12)

Get the configured account from environment (private key or mnemonic)

Configuration options:
- EVM_PRIVATE_KEY: Hex private key (with or without 0x prefix)
- EVM_MNEMONIC: BIP-39 mnemonic phrase (12 or 24 words)
- EVM_ACCOUNT_INDEX: Optional account index for HD wallet derivation (default: 0)

#### Returns

  \| \{
\}
  \| \{
\}

***

### getConfiguredPrivateKey()

```ts
function getConfiguredPrivateKey(): `0x${string}`;
```

Defined in: [defi/protocols/src/core/services/wallet.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/wallet.ts#L49)

Helper to get the configured private key (for services that need it)

For HDAccount (from mnemonic): extracts private key from HD key
For PrivateKeyAccount: returns the original private key

#### Returns

`` `0x${string}` ``

***

### getConfiguredWallet()

```ts
function getConfiguredWallet(): {
  address: `0x${string}`;
};
```

Defined in: [defi/protocols/src/core/services/wallet.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/wallet.ts#L87)

Helper to get configured wallet object

#### Returns

```ts
{
  address: `0x${string}`;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `address` | `` `0x${string}` `` | [defi/protocols/src/core/services/wallet.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/wallet.ts#L87) |

***

### getWalletAddressFromKey()

```ts
function getWalletAddressFromKey(): `0x${string}`;
```

Defined in: [defi/protocols/src/core/services/wallet.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/wallet.ts#L79)

Helper to get wallet address

#### Returns

`` `0x${string}` ``

***

### signMessage()

```ts
function signMessage(message: string): Promise<string>;
```

Defined in: [defi/protocols/src/core/services/wallet.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/wallet.ts#L96)

Sign an arbitrary message using the configured wallet

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The message to sign (can be a string or hex data) |

#### Returns

`Promise`\<`string`\>

The signature as a hex string

***

### signTypedData()

```ts
function signTypedData(
   domain: {
  chainId?: number;
  name?: string;
  salt?: `0x${string}`;
  verifyingContract?: `0x${string}`;
  version?: string;
}, 
   types: Record<string, {
  name: string;
  type: string;
}[]>, 
   primaryType: string, 
message: Record<string, any>): Promise<string>;
```

Defined in: [defi/protocols/src/core/services/wallet.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/wallet.ts#L115)

Sign typed data (EIP-712) using the configured wallet

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `domain` | \{ `chainId?`: `number`; `name?`: `string`; `salt?`: `` `0x${string}` ``; `verifyingContract?`: `` `0x${string}` ``; `version?`: `string`; \} | The EIP-712 domain |
| `domain.chainId?` | `number` | - |
| `domain.name?` | `string` | - |
| `domain.salt?` | `` `0x${string}` `` | - |
| `domain.verifyingContract?` | `` `0x${string}` `` | - |
| `domain.version?` | `string` | - |
| `types` | `Record`\<`string`, \{ `name`: `string`; `type`: `string`; \}[]\> | The types definition (excluding EIP712Domain) |
| `primaryType` | `string` | The primary type name |
| `message` | `Record`\<`string`, `any`\> | The message data to sign |

#### Returns

`Promise`\<`string`\>

The signature as a hex string

