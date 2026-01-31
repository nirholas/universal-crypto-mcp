[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/ucai/abi-generation

# defi/protocols/src/x402/ucai/abi-generation

## Classes

### ABIGenerationService

Defined in: [defi/protocols/src/x402/ucai/abi-generation.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/abi-generation.ts#L160)

Custom ABI Generation Service

Generates ABIs from unverified contracts using bytecode analysis,
pattern matching, and AI-enhanced interface detection.

#### Constructors

##### Constructor

```ts
new ABIGenerationService(apiKeys?: Record<string, string>): ABIGenerationService;
```

Defined in: [defi/protocols/src/x402/ucai/abi-generation.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/abi-generation.ts#L163)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiKeys?` | `Record`\<`string`, `string`\> |

###### Returns

[`ABIGenerationService`](/docs/api/defi/protocols/src/x402/ucai/abi-generation.md#abigenerationservice)

#### Methods

##### generateABI()

```ts
generateABI(request: ABIGenerationRequest): Promise<ABIGenerationResult>;
```

Defined in: [defi/protocols/src/x402/ucai/abi-generation.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/abi-generation.ts#L180)

Generate ABI for a contract

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | [`ABIGenerationRequest`](/docs/api/defi/protocols/src/x402/ucai/types.md#abigenerationrequest) | ABI generation request |

###### Returns

`Promise`\<[`ABIGenerationResult`](/docs/api/defi/protocols/src/x402/ucai/types.md#abigenerationresult)\>

ABI generation result

##### getPricing()

```ts
getPricing(): string;
```

Defined in: [defi/protocols/src/x402/ucai/abi-generation.ts:671](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/abi-generation.ts#L671)

Get pricing for ABI generation

###### Returns

`string`

## Functions

### getABIGenerationService()

```ts
function getABIGenerationService(): ABIGenerationService;
```

Defined in: [defi/protocols/src/x402/ucai/abi-generation.ts:682](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/abi-generation.ts#L682)

Get or create ABI generation service

#### Returns

[`ABIGenerationService`](/docs/api/defi/protocols/src/x402/ucai/abi-generation.md#abigenerationservice)

## References

### default

Renames and re-exports [ABIGenerationService](/docs/api/defi/protocols/src/x402/ucai/abi-generation.md#abigenerationservice)
