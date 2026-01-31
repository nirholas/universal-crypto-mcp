[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/lyra-ecosystem/intel

# defi/protocols/src/modules/lyra-ecosystem/intel

## Classes

### LyraIntel

Defined in: [defi/protocols/src/modules/lyra-ecosystem/intel.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/intel.ts#L29)

Lyra Intel service client with x402 payment integration

#### Constructors

##### Constructor

```ts
new LyraIntel(
   api: AxiosInstance, 
   config: LyraIntelConfig, 
   onPayment?: (result: LyraPaymentResult) => void): LyraIntel;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/intel.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/intel.ts#L35)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `api` | `AxiosInstance` |
| `config` | [`LyraIntelConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraintelconfig) |
| `onPayment?` | (`result`: [`LyraPaymentResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyrapaymentresult)) => `void` |

###### Returns

[`LyraIntel`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/intel.md#lyraintel)

#### Methods

##### analyzeFile()

```ts
analyzeFile(options: {
  content: string;
  filename: string;
  language?: string;
}): Promise<FileAnalysisResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/intel.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/intel.ts#L65)

Analyze a single file (FREE)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `content`: `string`; `filename`: `string`; `language?`: `string`; \} |
| `options.content` | `string` |
| `options.filename` | `string` |
| `options.language?` | `string` |

###### Returns

`Promise`\<[`FileAnalysisResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#fileanalysisresult)\>

###### Example

```typescript
const result = await intel.analyzeFile({
  content: "const x = 1;",
  filename: "example.ts"
});
```

##### enterpriseAnalysis()

```ts
enterpriseAnalysis(repoUrl: string, options?: {
  branch?: string;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
  workspacePattern?: string;
}): Promise<EnterpriseAnalysisResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/intel.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/intel.ts#L216)

Enterprise-grade monorepo analysis ($1.00)

Comprehensive analysis for large codebases:
- Cross-package dependency analysis
- Circular dependency detection
- Build optimization recommendations
- Architecture assessment
- Security across all packages

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `repoUrl` | `string` |
| `options?` | \{ `branch?`: `string`; `packageManager?`: `"npm"` \| `"yarn"` \| `"pnpm"` \| `"bun"`; `workspacePattern?`: `string`; \} |
| `options.branch?` | `string` |
| `options.packageManager?` | `"npm"` \| `"yarn"` \| `"pnpm"` \| `"bun"` |
| `options.workspacePattern?` | `string` |

###### Returns

`Promise`\<[`EnterpriseAnalysisResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#enterpriseanalysisresult)\>

###### Example

```typescript
const analysis = await intel.enterpriseAnalysis("https://github.com/org/monorepo");
console.log(`Packages: ${analysis.monorepoInfo.packages}`);
```

##### estimateCost()

```ts
estimateCost(operation: "fileAnalysis" | "securityScan" | "repoAudit" | "enterpriseAnalysis"): string;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/intel.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/intel.ts#L260)

Check estimated cost before running an operation

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `operation` | `"fileAnalysis"` \| `"securityScan"` \| `"repoAudit"` \| `"enterpriseAnalysis"` |

###### Returns

`string`

##### getPricing()

```ts
getPricing(): {
  enterpriseAnalysis: "1.00";
  fileAnalysis: "0.00";
  repoAudit: "0.10";
  securityScan: "0.05";
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/intel.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/intel.ts#L253)

Get pricing information for Lyra Intel services

###### Returns

```ts
{
  enterpriseAnalysis: "1.00";
  fileAnalysis: "0.00";
  repoAudit: "0.10";
  securityScan: "0.05";
}
```

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `enterpriseAnalysis` | `"1.00"` | `"1.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L47) |
| `fileAnalysis` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L44) |
| `repoAudit` | `"0.10"` | `"0.10"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L46) |
| `securityScan` | `"0.05"` | `"0.05"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L45) |

##### repoAudit()

```ts
repoAudit(repoUrl: string, options?: {
  branch?: string;
  excludePaths?: string[];
  focus?: ("security" | "quality" | "performance")[];
}): Promise<RepoAuditResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/intel.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/intel.ts#L166)

Perform a full repository audit ($0.10)

Includes:
- Security analysis
- Code quality metrics
- Maintainability score
- Technical debt estimation
- Best practice recommendations

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `repoUrl` | `string` |
| `options?` | \{ `branch?`: `string`; `excludePaths?`: `string`[]; `focus?`: (`"security"` \| `"quality"` \| `"performance"`)[]; \} |
| `options.branch?` | `string` |
| `options.excludePaths?` | `string`[] |
| `options.focus?` | (`"security"` \| `"quality"` \| `"performance"`)[] |

###### Returns

`Promise`\<[`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult)\>

###### Example

```typescript
const audit = await intel.repoAudit("https://github.com/user/repo");
console.log(`Overall score: ${audit.overallScore}/100`);
```

##### securityScan()

```ts
securityScan(repoUrl: string): Promise<SecurityScanResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/intel.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/intel.ts#L115)

Perform a security vulnerability scan ($0.05)

Scans code for:
- SQL injection
- XSS vulnerabilities
- Insecure dependencies
- Hardcoded secrets
- OWASP Top 10

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `repoUrl` | `string` |

###### Returns

`Promise`\<[`SecurityScanResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#securityscanresult)\>

###### Example

```typescript
const result = await intel.securityScan("https://github.com/user/repo");
console.log(`Security score: ${result.score}/100`);
```
