[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/web3-research/types/research

# defi/protocols/src/vendors/web3-research/types/research

## Interfaces

### ResearchData

Defined in: [defi/protocols/src/vendors/web3-research/types/research.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L22)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="logs"></a> `logs` | [`ResearchLog`](/docs/api/defi/protocols/src/vendors/web3-research/types/research.md#researchlog)[] | [defi/protocols/src/vendors/web3-research/types/research.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L40) |
| <a id="marketdata"></a> `marketData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/types/research.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L28) |
| <a id="newsdata"></a> `newsData` | \{ `date?`: `string`; `excerpt?`: `string`; `source?`: `string`; `title`: `string`; `url`: `string`; \}[] | [defi/protocols/src/vendors/web3-research/types/research.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L30) |
| <a id="relatedtokens"></a> `relatedTokens` | `any`[] | [defi/protocols/src/vendors/web3-research/types/research.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L38) |
| <a id="researchplan"></a> `researchPlan` | [`ResearchPlan`](/docs/api/defi/protocols/src/vendors/web3-research/types/research.md#researchplan-1) | [defi/protocols/src/vendors/web3-research/types/research.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L25) |
| <a id="searchresults"></a> `searchResults` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/types/research.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L26) |
| <a id="socialdata"></a> `socialData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/types/research.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L29) |
| <a id="status"></a> `status` | `"completed"` \| `"in_progress"` \| `"not_started"` | [defi/protocols/src/vendors/web3-research/types/research.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L39) |
| <a id="teamdata"></a> `teamData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/types/research.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L37) |
| <a id="technicaldata"></a> `technicalData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/types/research.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L27) |
| <a id="tokenname"></a> `tokenName` | `string` | [defi/protocols/src/vendors/web3-research/types/research.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L23) |
| <a id="tokenticker"></a> `tokenTicker` | `string` | [defi/protocols/src/vendors/web3-research/types/research.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L24) |

***

### ResearchLog

Defined in: [defi/protocols/src/vendors/web3-research/types/research.ts:9](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L9)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="message"></a> `message` | `string` | [defi/protocols/src/vendors/web3-research/types/research.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L11) |
| <a id="timestamp"></a> `timestamp` | `string` | [defi/protocols/src/vendors/web3-research/types/research.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L10) |

***

### ResearchPlan

Defined in: [defi/protocols/src/vendors/web3-research/types/research.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/research.ts#L14)

#### Indexable

```ts
[key: string]: {
  description: string;
  sources: string[];
  status: "completed" | "planned" | "in_progress";
}
```
