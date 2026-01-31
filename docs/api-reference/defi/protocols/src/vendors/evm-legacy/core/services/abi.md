[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/evm-legacy/core/services/abi

# defi/protocols/src/vendors/evm-legacy/core/services/abi

## Functions

### fetchContractABI()

```ts
function fetchContractABI(contractAddress: `0x${string}`, network: string): Promise<string>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/abi.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/abi.ts#L18)

Fetch contract ABI from Etherscan v2 API (unified endpoint for all EVM chains)
Requires ETHERSCAN_API_KEY environment variable to be set

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `contractAddress` | `` `0x${string}` `` | `undefined` | The contract address to fetch ABI for |
| `network` | `string` | `'ethereum'` | The network name or chain ID |

#### Returns

`Promise`\<`string`\>

The contract ABI as a JSON string

***

### getFunctionFromABI()

```ts
function getFunctionFromABI(abi: any[], functionName: string): any;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/abi.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/abi.ts#L103)

Get a specific function from an ABI

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `abi` | `any`[] | The contract ABI |
| `functionName` | `string` | The function name to find |

#### Returns

`any`

The function ABI object

***

### getReadableFunctions()

```ts
function getReadableFunctions(abi: any[]): string[];
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/abi.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/abi.ts#L87)

Get list of readable functions from an ABI

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `abi` | `any`[] | The contract ABI |

#### Returns

`string`[]

Array of read-only function names

***

### parseABI()

```ts
function parseABI(abiJson: string): any[];
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/abi.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/abi.ts#L70)

Parse and validate an ABI JSON string

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `abiJson` | `string` | The ABI as a JSON string |

#### Returns

`any`[]

Parsed ABI array
