[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/evm/services/contracts

# defi/protocols/src/vendors/bnb/evm/services/contracts

## Functions

### getLogs()

```ts
function getLogs(params: GetLogsParameters, network: string): Promise<Log[]>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/contracts.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/contracts.ts#L44)

Get logs for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `params` | `GetLogsParameters` | `undefined` |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<`Log`[]\>

***

### isContract()

```ts
function isContract(addressOrEns: string, network: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/contracts.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/contracts.ts#L58)

Check if an address is a contract

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `addressOrEns` | `string` | `undefined` | Address or ENS name to check |
| `network` | `string` | `"ethereum"` | Network name or chain ID |

#### Returns

`Promise`\<`boolean`\>

True if the address is a contract, false if it's an EOA

***

### readContract()

```ts
function readContract(params: ReadContractParameters, network: string): Promise<unknown>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/contracts.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/contracts.ts#L21)

Read from a contract for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `params` | `ReadContractParameters` | `undefined` |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<`unknown`\>

***

### writeContract()

```ts
function writeContract(
   privateKey: `0x${string}`, 
   params: Record<string, any>, 
network: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/contracts.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/contracts.ts#L32)

Write to a contract for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `privateKey` | `` `0x${string}` `` | `undefined` |
| `params` | `Record`\<`string`, `any`\> | `undefined` |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<`` `0x${string}` ``\>
