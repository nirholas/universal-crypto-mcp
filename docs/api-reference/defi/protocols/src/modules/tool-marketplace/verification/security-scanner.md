[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/verification/security-scanner

# defi/protocols/src/modules/tool-marketplace/verification/security-scanner

## Classes

### SecurityScanner

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L86)

Security Scanner Service
Scans tool endpoints for security vulnerabilities and potential threats

#### Constructors

##### Constructor

```ts
new SecurityScanner(config: Partial<SecurityScannerConfig>): SecurityScanner;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L89)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`SecurityScannerConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.md#securityscannerconfig)\> |

###### Returns

[`SecurityScanner`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.md#securityscanner)

#### Methods

##### addToBlocklist()

```ts
addToBlocklist(domain: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:693](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L693)

Add domain to blocklist

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `domain` | `string` |

###### Returns

`void`

##### checkDomainReputation()

```ts
checkDomainReputation(domain: string): Promise<DomainInfo>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L240)

Check domain reputation

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `domain` | `string` |

###### Returns

`Promise`\<[`DomainInfo`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#domaininfo)\>

##### getBlocklist()

```ts
getBlocklist(): string[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:716](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L716)

Get all blocklisted domains

###### Returns

`string`[]

##### getLatestScan()

```ts
getLatestScan(toolId: string): 
  | SecurityScanResult
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:685](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L685)

Get latest scan result for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

  \| [`SecurityScanResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityscanresult)
  \| `null`

##### getScanHistory()

```ts
getScanHistory(toolId: string, limit: number): SecurityScanResult[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:677](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L677)

Get scan history for a tool

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `limit` | `number` | `10` |

###### Returns

[`SecurityScanResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityscanresult)[]

##### isBlocklisted()

```ts
isBlocklisted(domain: string): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:709](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L709)

Check if domain is blocklisted

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `domain` | `string` |

###### Returns

`boolean`

##### quickCheck()

```ts
quickCheck(endpoint: string): Promise<{
  criticalFindings: SecurityFinding[];
  passed: boolean;
  score: number;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:723](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L723)

Quick security check (faster, less thorough)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `endpoint` | `string` |

###### Returns

`Promise`\<\{
  `criticalFindings`: [`SecurityFinding`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityfinding)[];
  `passed`: `boolean`;
  `score`: `number`;
\}\>

##### removeFromBlocklist()

```ts
removeFromBlocklist(domain: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:701](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L701)

Remove domain from blocklist

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `domain` | `string` |

###### Returns

`void`

##### scanEndpoint()

```ts
scanEndpoint(toolId: string, endpoint: string): Promise<SecurityScanResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L96)

Perform a full security scan on a tool endpoint

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `endpoint` | `string` |

###### Returns

`Promise`\<[`SecurityScanResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityscanresult)\>

## Interfaces

### SecurityScannerConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L21)

Configuration for security scanning

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="checkdomainreputation-2"></a> `checkDomainReputation` | `boolean` | Check external domain reputation APIs | [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L29) |
| <a id="deepscan"></a> `deepScan` | `boolean` | Enable deep scanning (slower but more thorough) | [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L27) |
| <a id="maxredirects"></a> `maxRedirects` | `number` | Maximum redirects to follow | [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L23) |
| <a id="requesttimeout"></a> `requestTimeout` | `number` | Timeout for requests in milliseconds | [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L25) |

## Variables

### securityScanner

```ts
const securityScanner: SecurityScanner;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts:786](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.ts#L786)

Singleton instance
