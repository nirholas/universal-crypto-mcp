[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/ucai/gas-sponsorship

# defi/protocols/src/x402/ucai/gas-sponsorship

## Classes

### GasSponsorshipService

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L64)

Gas Sponsorship Service

Sponsors gas for user transactions using x402 payments.
Integrates with ERC-4337 account abstraction for gasless UX.

#### Constructors

##### Constructor

```ts
new GasSponsorshipService(sponsorPrivateKey: `0x${string}`, config?: Partial<GasSponsorConfig>): GasSponsorshipService;
```

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L69)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `sponsorPrivateKey` | `` `0x${string}` `` |
| `config?` | `Partial`\<[`GasSponsorConfig`](/docs/api/defi/protocols/src/x402/ucai/types.md#gassponsorconfig)\> |

###### Returns

[`GasSponsorshipService`](/docs/api/defi/protocols/src/x402/ucai/gas-sponsorship.md#gassponsorshipservice)

#### Methods

##### estimateSponsorshipCost()

```ts
estimateSponsorshipCost(
   contractAddress: `0x${string}`, 
   functionName: string, 
   args: unknown[], 
   abi: unknown[], 
   network: string): Promise<{
  gasCostNative: string;
  gasCostUsd: string;
  paymentAmount: string;
  supported: boolean;
}>;
```

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L347)

Estimate sponsorship cost for a transaction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `contractAddress` | `` `0x${string}` `` |
| `functionName` | `string` |
| `args` | `unknown`[] |
| `abi` | `unknown`[] |
| `network` | `string` |

###### Returns

`Promise`\<\{
  `gasCostNative`: `string`;
  `gasCostUsd`: `string`;
  `paymentAmount`: `string`;
  `supported`: `boolean`;
\}\>

##### getSupportedNetworks()

```ts
getSupportedNetworks(): string[];
```

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:431](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L431)

Get supported networks

###### Returns

`string`[]

##### sponsorTransaction()

```ts
sponsorTransaction(request: GasSponsorshipRequest): Promise<GasSponsorshipResult>;
```

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L100)

Sponsor gas for a user's transaction

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | [`GasSponsorshipRequest`](/docs/api/defi/protocols/src/x402/ucai/types.md#gassponsorshiprequest) | Gas sponsorship request |

###### Returns

`Promise`\<[`GasSponsorshipResult`](/docs/api/defi/protocols/src/x402/ucai/types.md#gassponsorshipresult)\>

Sponsorship result with transaction details

##### sponsorUserOperation()

```ts
sponsorUserOperation(userOp: UserOperation, network: string): Promise<GasSponsorshipResult>;
```

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L212)

Sponsor a UserOperation through ERC-4337 account abstraction

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `userOp` | [`UserOperation`](/docs/api/defi/protocols/src/x402/ucai/gas-sponsorship.md#useroperation) | The UserOperation to sponsor |
| `network` | `string` | Network to execute on |

###### Returns

`Promise`\<[`GasSponsorshipResult`](/docs/api/defi/protocols/src/x402/ucai/types.md#gassponsorshipresult)\>

Sponsorship result with UserOp hash

##### updatePriceFeed()

```ts
updatePriceFeed(network: string, priceUsd: number): void;
```

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L424)

Update native token price feed

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `string` |
| `priceUsd` | `number` |

###### Returns

`void`

## Interfaces

### UserOperation

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:439](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L439)

ERC-4337 UserOperation type

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="calldata"></a> `callData` | `` `0x${string}` `` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:443](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L443) |
| <a id="callgaslimit"></a> `callGasLimit` | `bigint` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:444](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L444) |
| <a id="initcode"></a> `initCode` | `` `0x${string}` `` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:442](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L442) |
| <a id="maxfeepergas"></a> `maxFeePerGas` | `bigint` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:447](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L447) |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas` | `bigint` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:448](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L448) |
| <a id="nonce"></a> `nonce` | `bigint` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:441](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L441) |
| <a id="paymasteranddata"></a> `paymasterAndData` | `` `0x${string}` `` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:449](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L449) |
| <a id="preverificationgas"></a> `preVerificationGas` | `bigint` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:446](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L446) |
| <a id="sender"></a> `sender` | `` `0x${string}` `` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L440) |
| <a id="signature"></a> `signature` | `` `0x${string}` `` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:450](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L450) |
| <a id="verificationgaslimit"></a> `verificationGasLimit` | `bigint` | [defi/protocols/src/x402/ucai/gas-sponsorship.ts:445](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L445) |

## Functions

### getGasSponsorService()

```ts
function getGasSponsorService(): GasSponsorshipService;
```

Defined in: [defi/protocols/src/x402/ucai/gas-sponsorship.ts:459](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/gas-sponsorship.ts#L459)

Get or create gas sponsorship service

#### Returns

[`GasSponsorshipService`](/docs/api/defi/protocols/src/x402/ucai/gas-sponsorship.md#gassponsorshipservice)

## References

### default

Renames and re-exports [GasSponsorshipService](/docs/api/defi/protocols/src/x402/ucai/gas-sponsorship.md#gassponsorshipservice)
