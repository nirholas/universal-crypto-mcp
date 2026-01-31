[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/ucai/contract-analysis

# defi/protocols/src/x402/ucai/contract-analysis

## Classes

### ContractAnalysisService

Defined in: [defi/protocols/src/x402/ucai/contract-analysis.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/contract-analysis.ts#L134)

Premium Contract Analysis Service

Provides comprehensive security analysis of smart contracts
including vulnerability detection, rug pull indicators, and more.

#### Constructors

##### Constructor

```ts
new ContractAnalysisService(apiKeys?: Record<string, string>): ContractAnalysisService;
```

Defined in: [defi/protocols/src/x402/ucai/contract-analysis.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/contract-analysis.ts#L137)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiKeys?` | `Record`\<`string`, `string`\> |

###### Returns

[`ContractAnalysisService`](/docs/api/defi/protocols/src/x402/ucai/contract-analysis.md#contractanalysisservice)

#### Methods

##### analyzeContract()

```ts
analyzeContract(request: ContractAnalysisRequest): Promise<SecurityAuditResult>;
```

Defined in: [defi/protocols/src/x402/ucai/contract-analysis.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/contract-analysis.ts#L154)

Perform comprehensive contract analysis

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | [`ContractAnalysisRequest`](/docs/api/defi/protocols/src/x402/ucai/types.md#contractanalysisrequest) | Analysis request |

###### Returns

`Promise`\<[`SecurityAuditResult`](/docs/api/defi/protocols/src/x402/ucai/types.md#securityauditresult)\>

Security audit result

##### analyzeRugPullRisk()

```ts
analyzeRugPullRisk(contractAddress: `0x${string}`, network: string): Promise<RugPullIndicators>;
```

Defined in: [defi/protocols/src/x402/ucai/contract-analysis.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/contract-analysis.ts#L222)

Analyze contract for rug pull indicators

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `contractAddress` | `` `0x${string}` `` |
| `network` | `string` |

###### Returns

`Promise`\<[`RugPullIndicators`](/docs/api/defi/protocols/src/x402/ucai/types.md#rugpullindicators)\>

##### getPricing()

```ts
getPricing(): string;
```

Defined in: [defi/protocols/src/x402/ucai/contract-analysis.ts:661](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/contract-analysis.ts#L661)

Get analysis pricing

###### Returns

`string`

## Functions

### getContractAnalysisService()

```ts
function getContractAnalysisService(): ContractAnalysisService;
```

Defined in: [defi/protocols/src/x402/ucai/contract-analysis.ts:672](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/contract-analysis.ts#L672)

Get or create contract analysis service

#### Returns

[`ContractAnalysisService`](/docs/api/defi/protocols/src/x402/ucai/contract-analysis.md#contractanalysisservice)

## References

### default

Renames and re-exports [ContractAnalysisService](/docs/api/defi/protocols/src/x402/ucai/contract-analysis.md#contractanalysisservice)
