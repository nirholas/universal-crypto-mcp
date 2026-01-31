[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/client

# defi/protocols/src/x402/sdk/client

## Classes

### X402Client

Defined in: [defi/protocols/src/x402/sdk/client.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L91)

X402 Payment Protocol SDK Client

Full-featured client for X402 payments with Sperax USDs on Arbitrum.
Supports standard payments, gasless (EIP-3009) payments, batch payments,
HTTP 402 handling, and yield tracking.

#### Example

```typescript
import { X402Client } from '@x402/sdk';

const client = new X402Client({
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY as `0x${string}`,
});

// Simple payment
const result = await client.pay('0x...', '10.00', 'USDs');

// Gasless payment
const auth = await client.createAuthorization('0x...', '1.00', 'USDs');
const tx = await client.settleGasless(auth);

// Handle 402 response
const parsed = await client.handlePaymentRequired(response);

// Track yield
const yieldInfo = await client.getYield('0x...');
```

#### Constructors

##### Constructor

```ts
new X402Client(options: X402ClientConfig): X402Client;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L112)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`X402ClientConfig`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402clientconfig) |

###### Returns

[`X402Client`](/docs/api/defi/protocols/src/x402/sdk/client.md#x402client)

#### Methods

##### approve()

```ts
approve(
   spender: `0x${string}`, 
   amount: string, 
token?: X402Token): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:470](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L470)

Approve token spending

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `spender` | `` `0x${string}` `` |
| `amount` | `string` |
| `token?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### create402Response()

```ts
create402Response(request: PaymentRequest, message?: string): {
  body: object;
  headers: Record<string, string>;
  status: 402;
};
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:388](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L388)

Create a 402 response for servers

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |
| `message?` | `string` |

###### Returns

```ts
{
  body: object;
  headers: Record<string, string>;
  status: 402;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `body` | `object` | [defi/protocols/src/x402/sdk/http/handler.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L99) |
| `headers` | `Record`\<`string`, `string`\> | [defi/protocols/src/x402/sdk/http/handler.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L98) |
| `status` | `402` | [defi/protocols/src/x402/sdk/http/handler.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/handler.ts#L97) |

##### createAuthorization()

```ts
createAuthorization(
   recipient: `0x${string}`, 
   amount: string, 
   token?: X402Token, 
options?: AuthorizationOptions): Promise<EIP3009Authorization>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L255)

Create a gasless payment authorization
The recipient or a relayer can submit this to execute the transfer

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `recipient` | `` `0x${string}` `` | Recipient address |
| `amount` | `string` | Amount to transfer |
| `token?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token to use |
| `options?` | [`AuthorizationOptions`](/docs/api/defi/protocols/src/x402/sdk/types.md#authorizationoptions) | Authorization options |

###### Returns

`Promise`\<[`EIP3009Authorization`](/docs/api/defi/protocols/src/x402/sdk/types.md#eip3009authorization)\>

EIP-3009 authorization

###### Example

```typescript
const auth = await client.createAuthorization('0x...', '1.00', 'USDs');
// Send auth to recipient/relayer...
const tx = await client.settleGasless(auth);
```

##### estimateYield()

```ts
estimateYield(address: `0x${string}`): Promise<YieldEstimate>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:417](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L417)

Estimate yield over time

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `` `0x${string}` `` | Address to estimate for |

###### Returns

`Promise`\<[`YieldEstimate`](/docs/api/defi/protocols/src/x402/sdk/types.md#yieldestimate)\>

Yield estimates

##### getAddress()

```ts
getAddress(): `0x${string}` | undefined;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:449](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L449)

Get own wallet address

###### Returns

`` `0x${string}` `` \| `undefined`

##### getAvailableTokens()

```ts
getAvailableTokens(): X402Token[];
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:550](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L550)

Get available tokens on current chain

###### Returns

[`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token)[]

##### getBalance()

```ts
getBalance(address: `0x${string}`, token?: X402Token): Promise<BalanceInfo>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:441](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L441)

Get token balance

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `` `0x${string}` `` | Address to check |
| `token?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token to check |

###### Returns

`Promise`\<[`BalanceInfo`](/docs/api/defi/protocols/src/x402/sdk/types.md#balanceinfo)\>

Balance info

##### getChainInfo()

```ts
getChainInfo(): {
  chain: X402Chain;
  chainId: number;
  explorerUrl: string;
  isTestnet: boolean;
  name: string;
  rpcUrl: string;
};
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:536](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L536)

Get current chain info

###### Returns

```ts
{
  chain: X402Chain;
  chainId: number;
  explorerUrl: string;
  isTestnet: boolean;
  name: string;
  rpcUrl: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | [defi/protocols/src/x402/sdk/client.ts:538](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L538) |
| `chainId` | `number` | [defi/protocols/src/x402/sdk/client.ts:539](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L539) |
| `explorerUrl` | `string` | [defi/protocols/src/x402/sdk/client.ts:542](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L542) |
| `isTestnet` | `boolean` | [defi/protocols/src/x402/sdk/client.ts:543](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L543) |
| `name` | `string` | [defi/protocols/src/x402/sdk/client.ts:540](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L540) |
| `rpcUrl` | `string` | [defi/protocols/src/x402/sdk/client.ts:541](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L541) |

##### getCurrentAPY()

```ts
getCurrentAPY(): Promise<number>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:425](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L425)

Get current USDs APY

###### Returns

`Promise`\<`number`\>

##### getPublicClient()

```ts
getPublicClient(): {
};
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:456](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L456)

Get the underlying public client (for advanced use)

###### Returns

```ts
{
}
```

##### getRevenueSplitter()

```ts
getRevenueSplitter(address: `0x${string}`): RevenueSplitter;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:494](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L494)

Get Revenue Splitter contract interface

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `` `0x${string}` `` | Revenue splitter contract address |

###### Returns

[`RevenueSplitter`](/docs/api/defi/protocols/src/x402/sdk/contracts/revenue-splitter.md#revenuesplitter)

##### getUSDs()

```ts
getUSDs(): USDs;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:482](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L482)

Get USDs contract interface

###### Returns

[`USDs`](/docs/api/defi/protocols/src/x402/sdk/contracts/usds.md#usds)

##### getWalletClient()

```ts
getWalletClient(): 
  | {
}
  | undefined;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:463](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L463)

Get the underlying wallet client (for advanced use)

###### Returns

  \| \{
\}
  \| `undefined`

##### getYield()

```ts
getYield(address: `0x${string}`): Promise<YieldInfo>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:406](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L406)

Get yield information for an address
Only available for USDs on Arbitrum

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `` `0x${string}` `` | Address to check |

###### Returns

`Promise`\<[`YieldInfo`](/docs/api/defi/protocols/src/x402/sdk/types.md#yieldinfo)\>

Yield information

##### handlePaymentRequired()

```ts
handlePaymentRequired(response: 
  | Response
  | HTTP402Response, options?: Handle402Options): Promise<HTTP402ParseResult & {
  transaction?: PaymentTransaction;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L341)

Handle an HTTP 402 Payment Required response

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `response` | \| `Response` \| [`HTTP402Response`](/docs/api/defi/protocols/src/x402/sdk/types.md#http402response) | HTTP 402 response or fetch Response |
| `options?` | [`Handle402Options`](/docs/api/defi/protocols/src/x402/sdk/types.md#handle402options) | Handling options |

###### Returns

`Promise`\<[`HTTP402ParseResult`](/docs/api/defi/protocols/src/x402/sdk/types.md#http402parseresult) & \{
  `transaction?`: [`PaymentTransaction`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymenttransaction);
\}\>

Parsed payment request

##### off()

```ts
off(listener: PaymentEventListener): void;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:512](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L512)

Remove payment event listener

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `listener` | [`PaymentEventListener`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymenteventlistener) |

###### Returns

`void`

##### on()

```ts
on(listener: PaymentEventListener): void;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:505](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L505)

Add payment event listener

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `listener` | [`PaymentEventListener`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymenteventlistener) |

###### Returns

`void`

##### pay()

```ts
pay(
   recipient: `0x${string}`, 
   amount: string, 
token?: X402Token): Promise<PaymentResult>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L187)

Execute a simple payment

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `recipient` | `` `0x${string}` `` | Recipient address |
| `amount` | `string` | Amount to pay (human-readable, e.g., "10.00") |
| `token?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token to use (default: chain default token) |

###### Returns

`Promise`\<[`PaymentResult`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentresult)\>

Payment result with transaction details

###### Example

```typescript
const result = await client.pay('0x...', '10.00', 'USDs');
console.log('Tx:', result.transaction.hash);
```

##### payBatch()

```ts
payBatch(
   items: BatchPaymentItem[], 
   token?: X402Token, 
   options?: {
  continueOnError?: boolean;
}): Promise<BatchPaymentResult>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:321](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L321)

Execute multiple payments

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `items` | [`BatchPaymentItem`](/docs/api/defi/protocols/src/x402/sdk/types.md#batchpaymentitem)[] | Array of payment items |
| `token?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token to use for all payments |
| `options?` | \{ `continueOnError?`: `boolean`; \} | Batch options |
| `options.continueOnError?` | `boolean` | - |

###### Returns

`Promise`\<[`BatchPaymentResult`](/docs/api/defi/protocols/src/x402/sdk/types.md#batchpaymentresult)\>

Batch payment result

##### settleGasless()

```ts
settleGasless(authorization: EIP3009Authorization, token?: X402Token): Promise<PaymentTransaction>;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L289)

Settle a gasless payment authorization on-chain

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `authorization` | [`EIP3009Authorization`](/docs/api/defi/protocols/src/x402/sdk/types.md#eip3009authorization) | EIP-3009 authorization |
| `token?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token (must match authorization) |

###### Returns

`Promise`\<[`PaymentTransaction`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymenttransaction)\>

Completed transaction

##### supportsGasless()

```ts
supportsGasless(token?: X402Token): boolean;
```

Defined in: [defi/protocols/src/x402/sdk/client.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/client.ts#L304)

Check if gasless payments are supported for a token

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `token?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`boolean`
