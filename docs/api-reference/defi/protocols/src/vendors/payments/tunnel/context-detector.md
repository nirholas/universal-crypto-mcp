[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tunnel/context-detector

# defi/protocols/src/vendors/payments/tunnel/context-detector

## Enumerations

### ExecutionContext

Defined in: [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L15)

#### Enumeration Members

| Enumeration Member | Value | Defined in |
| :------ | :------ | :------ |
| <a id="docker"></a> `DOCKER` | `"docker"` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L18) |
| <a id="kubernetes"></a> `KUBERNETES` | `"kubernetes"` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L19) |
| <a id="local"></a> `LOCAL` | `"local"` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L21) |
| <a id="n8n"></a> `N8N` | `"n8n"` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L16) |
| <a id="opal"></a> `OPAL` | `"opal"` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L17) |
| <a id="server"></a> `SERVER` | `"server"` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L20) |
| <a id="unknown"></a> `UNKNOWN` | `"unknown"` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L22) |

## Interfaces

### ContextDetectionResult

Defined in: [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L25)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="confidence"></a> `confidence` | `number` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L27) |
| <a id="context"></a> `context` | [`ExecutionContext`](/docs/api/defi/protocols/src/vendors/payments/tunnel/context-detector.md#executioncontext) | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L26) |
| <a id="indicators"></a> `indicators` | `string`[] | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L29) |
| <a id="publicurl"></a> `publicUrl?` | `string` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L30) |
| <a id="suggestedprovider"></a> `suggestedProvider` | [`TunnelProvider`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelprovider) | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L28) |

## Functions

### detectContext()

```ts
function detectContext(): ContextDetectionResult;
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L36)

Detects the current execution context

#### Returns

[`ContextDetectionResult`](/docs/api/defi/protocols/src/vendors/payments/tunnel/context-detector.md#contextdetectionresult)

***

### getRecommendedTunnelConfig()

```ts
function getRecommendedTunnelConfig(detectionResult: ContextDetectionResult): {
  provider: TunnelProvider;
  publicUrl?: string;
  reason: string;
};
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L229)

Gets recommended tunnel configuration based on context

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `detectionResult` | [`ContextDetectionResult`](/docs/api/defi/protocols/src/vendors/payments/tunnel/context-detector.md#contextdetectionresult) |

#### Returns

```ts
{
  provider: TunnelProvider;
  publicUrl?: string;
  reason: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `provider` | [`TunnelProvider`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelprovider) | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L232) |
| `publicUrl?` | `string` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L234) |
| `reason` | `string` | [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L233) |

***

### validatePublicUrl()

```ts
function validatePublicUrl(url: string): Promise<{
  error?: string;
  valid: boolean;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/context-detector.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/context-detector.ts#L201)

Validates if a detected public URL is actually accessible

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`\<\{
  `error?`: `string`;
  `valid`: `boolean`;
\}\>

## References

### default

Renames and re-exports [detectContext](/docs/api/defi/protocols/src/vendors/payments/tunnel/context-detector.md#detectcontext)
