[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/lyra-ecosystem/discovery

# defi/protocols/src/modules/lyra-ecosystem/discovery

## Classes

### LyraDiscovery

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L44)

Lyra Tool Discovery service client with x402 payment integration

#### Constructors

##### Constructor

```ts
new LyraDiscovery(
   api: AxiosInstance, 
   config: LyraDiscoveryConfig, 
   onPayment?: (result: LyraPaymentResult) => void): LyraDiscovery;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L50)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `api` | `AxiosInstance` |
| `config` | [`LyraDiscoveryConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyradiscoveryconfig) |
| `onPayment?` | (`result`: [`LyraPaymentResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyrapaymentresult)) => `void` |

###### Returns

[`LyraDiscovery`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/discovery.md#lyradiscovery)

#### Methods

##### analyze()

```ts
analyze(apiUrl: string): Promise<CompatibilityAnalysis>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L182)

Alias for analyzeCompatibility
This is the method mentioned in the spec

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<[`CompatibilityAnalysis`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#compatibilityanalysis)\>

##### analyzeCompatibility()

```ts
analyzeCompatibility(apiUrl: string): Promise<CompatibilityAnalysis>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L160)

Analyze API compatibility with MCP ($0.02)

AI-powered analysis that:
- Evaluates endpoint compatibility
- Identifies potential issues
- Provides migration suggestions
- Estimates implementation effort

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<[`CompatibilityAnalysis`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#compatibilityanalysis)\>

###### Example

```typescript
const analysis = await discovery.analyzeCompatibility("https://api.example.com");
console.log(`MCP Compatible: ${analysis.mcpCompatible}`);
console.log(`Score: ${analysis.compatibilityScore}/100`);
```

##### clearCache()

```ts
clearCache(): void;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L359)

Clear the discovery cache

###### Returns

`void`

##### detectProtocol()

```ts
detectProtocol(apiUrl: string): Promise<"unknown" | "mcp" | "openapi" | "graphql" | "grpc" | "rest" | "websocket">;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L127)

Get detected protocol type (FREE)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<`"unknown"` \| `"mcp"` \| `"openapi"` \| `"graphql"` \| `"grpc"` \| `"rest"` \| `"websocket"`\>

##### discover()

```ts
discover(apiUrl: string, options: DiscoveryOptions): Promise<DiscoveryResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L84)

Discover API endpoints (FREE)

Automatically detects:
- MCP servers
- OpenAPI/Swagger endpoints
- GraphQL schemas
- gRPC services

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |
| `options` | [`DiscoveryOptions`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/discovery.md#discoveryoptions) |

###### Returns

`Promise`\<[`DiscoveryResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#discoveryresult)\>

###### Example

```typescript
const result = await discovery.discover("https://api.example.com");
console.log(`Protocol: ${result.protocol}`);
console.log(`Found ${result.tools.length} tools`);
```

##### estimateCost()

```ts
estimateCost(operation: 
  | "basicDiscovery"
  | "compatibility"
  | "generateConfig"
  | "fullAssistance"): string;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L352)

Check estimated cost before running an operation

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `operation` | \| `"basicDiscovery"` \| `"compatibility"` \| `"generateConfig"` \| `"fullAssistance"` |

###### Returns

`string`

##### generateMcpConfig()

```ts
generateMcpConfig(apiUrl: string, options?: {
  includePrompts?: boolean;
  includeResources?: boolean;
  serverName?: string;
  version?: string;
}): Promise<McpConfigResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L213)

Generate MCP server configuration ($0.10)

Automatically generates:
- MCP server config file
- Tool definitions with schemas
- Resource configurations
- Prompt templates

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |
| `options?` | \{ `includePrompts?`: `boolean`; `includeResources?`: `boolean`; `serverName?`: `string`; `version?`: `string`; \} |
| `options.includePrompts?` | `boolean` |
| `options.includeResources?` | `boolean` |
| `options.serverName?` | `string` |
| `options.version?` | `string` |

###### Returns

`Promise`\<[`McpConfigResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#mcpconfigresult)\>

###### Example

```typescript
const config = await discovery.generateMcpConfig("https://api.example.com");
console.log(JSON.stringify(config.config, null, 2));
```

##### generateToolDefinitions()

```ts
generateToolDefinitions(apiUrl: string): Promise<McpToolConfig[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L248)

Generate tool definitions only ($0.10)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<[`McpToolConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#mcptoolconfig)[]\>

##### getCodeSnippets()

```ts
getCodeSnippets(apiUrl: string, language: "typescript" | "javascript" | "python"): Promise<CodeSnippet[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:315](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L315)

Get code snippets for integration ($0.50)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `apiUrl` | `string` | `undefined` |
| `language` | `"typescript"` \| `"javascript"` \| `"python"` | `"typescript"` |

###### Returns

`Promise`\<[`CodeSnippet`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#codesnippet)[]\>

##### getCompatibilityScore()

```ts
getCompatibilityScore(apiUrl: string): Promise<number>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L189)

Get compatibility score only ($0.02)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<`number`\>

##### getFullAssistance()

```ts
getFullAssistance(apiUrl: string, options?: {
  generateDocs?: boolean;
  includeTests?: boolean;
  targetLanguage?: "typescript" | "javascript" | "python";
}): Promise<IntegrationAssistance>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L282)

Get full integration assistance ($0.50)

Complete integration package:
- Compatibility analysis
- Generated MCP config
- Code snippets for integration
- Test cases
- Documentation
- Support contact

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |
| `options?` | \{ `generateDocs?`: `boolean`; `includeTests?`: `boolean`; `targetLanguage?`: `"typescript"` \| `"javascript"` \| `"python"`; \} |
| `options.generateDocs?` | `boolean` |
| `options.includeTests?` | `boolean` |
| `options.targetLanguage?` | `"typescript"` \| `"javascript"` \| `"python"` |

###### Returns

`Promise`\<[`IntegrationAssistance`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#integrationassistance)\>

###### Example

```typescript
const assistance = await discovery.getFullAssistance("https://api.example.com");

// Use generated code snippets
assistance.codeSnippets.forEach(snippet => {
  console.log(`// ${snippet.title}`);
  console.log(snippet.code);
});
```

##### getPricing()

```ts
getPricing(): {
  basicDiscovery: "0.00";
  compatibility: "0.02";
  fullAssistance: "0.50";
  generateConfig: "0.10";
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L345)

Get pricing information for Lyra Discovery services

###### Returns

```ts
{
  basicDiscovery: "0.00";
  compatibility: "0.02";
  fullAssistance: "0.50";
  generateConfig: "0.10";
}
```

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `basicDiscovery` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L58) |
| `compatibility` | `"0.02"` | `"0.02"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L59) |
| `fullAssistance` | `"0.50"` | `"0.50"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L61) |
| `generateConfig` | `"0.10"` | `"0.10"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L60) |

##### getSupportedProtocols()

```ts
getSupportedProtocols(): readonly string[];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:338](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L338)

Get supported protocols for discovery

###### Returns

readonly `string`[]

##### getTestCases()

```ts
getTestCases(apiUrl: string): Promise<TestCase[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:326](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L326)

Get test cases for integration ($0.50)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<[`TestCase`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#testcase)[]\>

##### isMcpCompatible()

```ts
isMcpCompatible(apiUrl: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L119)

Check if an API is MCP compatible (FREE)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### listTools()

```ts
listTools(apiUrl: string): Promise<DiscoveredTool[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L135)

List discovered tools from an API (FREE)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<[`DiscoveredTool`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#discoveredtool)[]\>

## Interfaces

### DiscoveryOptions

Defined in: [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L29)

Options for API discovery

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="auth"></a> `auth?` | \{ `type`: `"basic"` \| `"bearer"` \| `"apikey"`; `value`: `string`; \} | Include authentication headers for protected APIs | [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L35) |
| `auth.type` | `"basic"` \| `"bearer"` \| `"apikey"` | - | [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L36) |
| `auth.value` | `string` | - | [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L37) |
| <a id="forcerefresh"></a> `forceRefresh?` | `boolean` | Force re-discovery even if cached | [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L31) |
| <a id="timeout"></a> `timeout?` | `number` | Timeout in milliseconds | [defi/protocols/src/modules/lyra-ecosystem/discovery.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/discovery.ts#L33) |
