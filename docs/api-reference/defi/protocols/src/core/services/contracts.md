[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/core/services/contracts

# defi/protocols/src/core/services/contracts

## Functions

### getLogs()

```ts
function getLogs(params: GetLogsParameters, network: string): Promise<Log[]>;
```

Defined in: [defi/protocols/src/core/services/contracts.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/contracts.ts#L35)

Get logs for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `params` | `GetLogsParameters` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<`Log`[]\>

***

### isContract()

```ts
function isContract(addressOrEns: string, network: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/core/services/contracts.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/contracts.ts#L46)

Check if an address is a contract

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `addressOrEns` | `string` | `undefined` | Address or ENS name to check |
| `network` | `string` | `'ethereum'` | Network name or chain ID |

#### Returns

`Promise`\<`boolean`\>

True if the address is a contract, false if it's an EOA

***

### multicall()

```ts
function multicall(
   contracts: {
  abi: any[];
  address: `0x${string}`;
  args?: any[];
  functionName: string;
}[], 
   allowFailure: boolean, 
network: string): Promise<any>;
```

Defined in: [defi/protocols/src/core/services/contracts.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/contracts.ts#L62)

Batch multiple contract read calls into a single RPC request using Multicall3

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `contracts` | \{ `abi`: `any`[]; `address`: `` `0x${string}` ``; `args?`: `any`[]; `functionName`: `string`; \}[] | `undefined` | Array of contract calls to batch |
| `allowFailure` | `boolean` | `true` | If true, returns partial results even if some calls fail |
| `network` | `string` | `'ethereum'` | Network name or chain ID |

#### Returns

`Promise`\<`any`\>

Array of results with status

***

### readContract()

```ts
function readContract(params: ReadContractParameters, network: string): Promise<unknown>;
```

Defined in: [defi/protocols/src/core/services/contracts.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/contracts.ts#L15)

Read from a contract for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `params` | `ReadContractParameters` | `undefined` |
| `network` | `string` | `'ethereum'` |

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

Defined in: [defi/protocols/src/core/services/contracts.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/services/contracts.ts#L23)

Write to a contract for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `privateKey` | `` `0x${string}` `` | `undefined` |
| `params` | `Record`\<`string`, `any`\> | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<`` `0x${string}` ``\>

