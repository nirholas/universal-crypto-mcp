[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/payments/standard

# defi/protocols/src/x402/sdk/payments/standard

## Classes

### StandardPayment

Defined in: [defi/protocols/src/x402/sdk/payments/standard.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/standard.ts#L40)

Standard ERC-20 payment handler

#### Constructors

##### Constructor

```ts
new StandardPayment(
   publicClient: {
}, 
   walletClient: 
  | {
}
  | undefined, 
   chain: X402Chain): StandardPayment;
```

Defined in: [defi/protocols/src/x402/sdk/payments/standard.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/standard.ts#L41)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `publicClient` | \{ \} |
| `walletClient` | \| \{ \} \| `undefined` |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |

###### Returns

[`StandardPayment`](/docs/api/defi/protocols/src/x402/sdk/payments/standard.md#standardpayment)

#### Methods

##### approve()

```ts
approve(
   spender: `0x${string}`, 
   amount: string, 
token: X402Token): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/standard.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/standard.ts#L154)

Approve token spending

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `spender` | `` `0x${string}` `` |
| `amount` | `string` |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### execute()

```ts
execute(request: PaymentRequest): Promise<PaymentTransaction>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/standard.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/standard.ts#L50)

Execute a standard ERC-20 transfer

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |

###### Returns

`Promise`\<[`PaymentTransaction`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymenttransaction)\>

##### getAllowance()

```ts
getAllowance(
   owner: `0x${string}`, 
   spender: `0x${string}`, 
token: X402Token): Promise<BalanceInfo>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/standard.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/standard.ts#L195)

Get token allowance

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `owner` | `` `0x${string}` `` |
| `spender` | `` `0x${string}` `` |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<[`BalanceInfo`](/docs/api/defi/protocols/src/x402/sdk/types.md#balanceinfo)\>

##### getBalance()

```ts
getBalance(address: `0x${string}`, token: X402Token): Promise<BalanceInfo>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/standard.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/standard.ts#L128)

Get token balance for an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<[`BalanceInfo`](/docs/api/defi/protocols/src/x402/sdk/types.md#balanceinfo)\>
