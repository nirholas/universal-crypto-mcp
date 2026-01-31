[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/web3-research/storage/researchStorage

# defi/protocols/src/vendors/web3-research/storage/researchStorage

## Classes

### ResearchStorage

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L50)

#### Constructors

##### Constructor

```ts
new ResearchStorage(dataDir: string): ResearchStorage;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L54)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `dataDir` | `string` | `"./research_data"` |

###### Returns

[`ResearchStorage`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchstorage)

#### Methods

##### addLogEntry()

```ts
addLogEntry(message: string): void;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L155)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

###### Returns

`void`

##### addToSection()

```ts
addToSection<K>(section: K, data: any): void;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L125)

###### Type Parameters

| Type Parameter |
| :------ |
| `K` *extends* keyof [`ResearchData`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchdata) |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `section` | `K` |
| `data` | `any` |

###### Returns

`void`

##### completeResearch()

```ts
completeResearch(): void;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L164)

###### Returns

`void`

##### getAllResources()

```ts
getAllResources(): Record<string, any>;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L151)

###### Returns

`Record`\<`string`, `any`\>

##### getCurrentResearch()

```ts
getCurrentResearch(): ResearchData;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L109)

###### Returns

[`ResearchData`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchdata)

##### getResource()

```ts
getResource(resourceId: string): any;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L147)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `resourceId` | `string` |

###### Returns

`any`

##### getSection()

```ts
getSection<K>(section: K): ResearchData[K];
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L113)

###### Type Parameters

| Type Parameter |
| :------ |
| `K` *extends* keyof [`ResearchData`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchdata) |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `section` | `K` |

###### Returns

[`ResearchData`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchdata)\[`K`\]

##### saveCurrentResearch()

```ts
saveCurrentResearch(): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L170)

###### Returns

`Promise`\<`void`\>

##### startNewResearch()

```ts
startNewResearch(tokenName: string, tokenTicker: string): void;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L84)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tokenName` | `string` |
| `tokenTicker` | `string` |

###### Returns

`void`

##### updateSection()

```ts
updateSection<K>(section: K, data: ResearchData[K]): void;
```

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L117)

###### Type Parameters

| Type Parameter |
| :------ |
| `K` *extends* keyof [`ResearchData`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchdata) |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `section` | `K` |
| `data` | [`ResearchData`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchdata)\[`K`\] |

###### Returns

`void`

## Interfaces

### ResearchData

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L25)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="logs"></a> `logs` | [`ResearchLog`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchlog)[] | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L47) |
| <a id="marketdata"></a> `marketData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L31) |
| <a id="newsdata"></a> `newsData` | `any`[] | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L33) |
| <a id="relatedtokens"></a> `relatedTokens` | `any`[] | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L35) |
| <a id="researchdata-1"></a> `researchData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L45) |
| <a id="researchplan"></a> `researchPlan` | [`ResearchPlan`](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchplan-1) | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L28) |
| <a id="resources"></a> `resources` | `Record`\<`string`, \{ `content`: `string`; `fetchedAt`: `string`; `format`: `string`; `url`: `string`; \}\> | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L36) |
| <a id="searchresults"></a> `searchResults` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L29) |
| <a id="socialdata"></a> `socialData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L32) |
| <a id="status"></a> `status` | `"completed"` \| `"in_progress"` \| `"not_started"` | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L46) |
| <a id="teamdata"></a> `teamData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L34) |
| <a id="technicaldata"></a> `technicalData` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L30) |
| <a id="tokenname"></a> `tokenName` | `string` | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L26) |
| <a id="tokenticker"></a> `tokenTicker` | `string` | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L27) |

***

### ResearchLog

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L12)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="message"></a> `message` | `string` | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L14) |
| <a id="timestamp"></a> `timestamp` | `string` | [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L13) |

***

### ResearchPlan

Defined in: [defi/protocols/src/vendors/web3-research/storage/researchStorage.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/storage/researchStorage.ts#L17)

#### Indexable

```ts
[key: string]: {
  description: string;
  sources: string[];
  status: "completed" | "planned" | "in_progress";
}
```

## References

### default

Renames and re-exports [ResearchStorage](/docs/api/defi/protocols/src/vendors/web3-research/storage/researchStorage.md#researchstorage)
