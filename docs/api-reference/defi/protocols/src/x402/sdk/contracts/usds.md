[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/contracts/usds

# defi/protocols/src/x402/sdk/contracts/usds

## Classes

### USDs

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L17)

USDs (Sperax USD) contract interface
Provides typed access to USDs functions

#### Constructors

##### Constructor

```ts
new USDs(publicClient: {
}, walletClient?: {
}): USDs;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L24)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `publicClient` | \{ \} |
| `walletClient?` | \{ \} |

###### Returns

[`USDs`](/docs/api/defi/protocols/src/x402/sdk/contracts/usds.md#usds)

#### Properties

| Property | Modifier | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="address"></a> `address` | `readonly` | `` `0x${string}` `` | `SPERAX_USD_ADDRESS` | [defi/protocols/src/x402/sdk/contracts/usds.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L18) |
| <a id="decimals"></a> `decimals` | `readonly` | `18` | `18` | [defi/protocols/src/x402/sdk/contracts/usds.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L19) |
| <a id="name"></a> `name` | `readonly` | `"Sperax USD"` | `'Sperax USD'` | [defi/protocols/src/x402/sdk/contracts/usds.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L21) |
| <a id="symbol"></a> `symbol` | `readonly` | `"USDs"` | `'USDs'` | [defi/protocols/src/x402/sdk/contracts/usds.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L20) |

#### Methods

##### allowance()

```ts
allowance(owner: `0x${string}`, spender: `0x${string}`): Promise<{
  formatted: string;
  raw: bigint;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L53)

Get token allowance

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `owner` | `` `0x${string}` `` |
| `spender` | `` `0x${string}` `` |

###### Returns

`Promise`\<\{
  `formatted`: `string`;
  `raw`: `bigint`;
\}\>

##### approve()

```ts
approve(spender: `0x${string}`, amount: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L169)

Approve spender

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `spender` | `` `0x${string}` `` |
| `amount` | `string` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### authorizationState()

```ts
authorizationState(authorizer: `0x${string}`, nonce: `0x${string}`): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L127)

Check if authorization nonce has been used

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `authorizer` | `` `0x${string}` `` |
| `nonce` | `` `0x${string}` `` |

###### Returns

`Promise`\<`boolean`\>

##### balanceOf()

```ts
balanceOf(account: `0x${string}`): Promise<{
  formatted: string;
  raw: bigint;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L36)

Get token balance

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `account` | `` `0x${string}` `` |

###### Returns

`Promise`\<\{
  `formatted`: `string`;
  `raw`: `bigint`;
\}\>

##### formatAmount()

```ts
formatAmount(amount: bigint): string;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L284)

Format bigint to string

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `bigint` |

###### Returns

`string`

##### isRebaseEnabled()

```ts
isRebaseEnabled(account: `0x${string}`): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L95)

Check if rebasing is enabled for an account

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `account` | `` `0x${string}` `` |

###### Returns

`Promise`\<`boolean`\>

##### parseAmount()

```ts
parseAmount(amount: string): bigint;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L277)

Parse amount string to bigint

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `string` |

###### Returns

`bigint`

##### rebaseOptIn()

```ts
rebaseOptIn(): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L221)

Opt in to rebasing

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### rebaseOptOut()

```ts
rebaseOptOut(): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L241)

Opt out of rebasing

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### rebasingCreditsPerToken()

```ts
rebasingCreditsPerToken(): Promise<bigint>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L111)

Get rebase credits per token

###### Returns

`Promise`\<`bigint`\>

##### totalSupply()

```ts
totalSupply(): Promise<{
  formatted: string;
  raw: bigint;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L70)

Get total supply

###### Returns

`Promise`\<\{
  `formatted`: `string`;
  `raw`: `bigint`;
\}\>

##### transfer()

```ts
transfer(to: `0x${string}`, amount: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L147)

Transfer tokens

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `to` | `` `0x${string}` `` |
| `amount` | `string` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### transferWithAuthorization()

```ts
transferWithAuthorization(
   from: `0x${string}`, 
   to: `0x${string}`, 
   value: bigint, 
   validAfter: bigint, 
   validBefore: bigint, 
   nonce: `0x${string}`, 
   v: number, 
   r: `0x${string}`, 
s: `0x${string}`): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/usds.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/usds.ts#L191)

Transfer with authorization (EIP-3009)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `from` | `` `0x${string}` `` |
| `to` | `` `0x${string}` `` |
| `value` | `bigint` |
| `validAfter` | `bigint` |
| `validBefore` | `bigint` |
| `nonce` | `` `0x${string}` `` |
| `v` | `number` |
| `r` | `` `0x${string}` `` |
| `s` | `` `0x${string}` `` |

###### Returns

`Promise`\<`` `0x${string}` ``\>
