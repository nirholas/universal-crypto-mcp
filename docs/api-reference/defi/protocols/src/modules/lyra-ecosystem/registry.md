[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/lyra-ecosystem/registry

# defi/protocols/src/modules/lyra-ecosystem/registry

## Classes

### LyraRegistry

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L76)

Lyra Registry service client with x402 payment integration

#### Constructors

##### Constructor

```ts
new LyraRegistry(
   api: AxiosInstance, 
   config: LyraRegistryConfig, 
   onPayment?: (result: LyraPaymentResult) => void): LyraRegistry;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L81)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `api` | `AxiosInstance` |
| `config` | [`LyraRegistryConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraregistryconfig) |
| `onPayment?` | (`result`: [`LyraPaymentResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyrapaymentresult)) => `void` |

###### Returns

[`LyraRegistry`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/registry.md#lyraregistry)

#### Methods

##### browse()

```ts
browse(options: BrowseToolsOptions): Promise<ToolListResponse>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L107)

Browse the tool catalog (FREE)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`BrowseToolsOptions`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/registry.md#browsetoolsoptions) |

###### Returns

`Promise`\<[`ToolListResponse`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/registry.md#toollistresponse)\>

###### Example

```typescript
const tools = await registry.browse({ category: "blockchain" });
tools.forEach(t => console.log(`${t.name}: ${t.stars}⭐`));
```

##### deleteTool()

```ts
deleteTool(toolId: string): Promise<{
  message: string;
  success: boolean;
}>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L285)

Delete a registered tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<\{
  `message`: `string`;
  `success`: `boolean`;
\}\>

##### estimateCost()

```ts
estimateCost(operation: "browse" | "toolDetails" | "privateRegistration" | "featuredListing"): string;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:373](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L373)

Check estimated cost before running an operation

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `operation` | `"browse"` \| `"toolDetails"` \| `"privateRegistration"` \| `"featuredListing"` |

###### Returns

`string`

##### getCategories()

```ts
getCategories(): readonly string[];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L359)

Get all available categories

###### Returns

readonly `string`[]

##### getFeaturedTools()

```ts
getFeaturedTools(): Promise<ToolInfo[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L345)

Get featured tools listing

###### Returns

`Promise`\<[`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo)[]\>

##### getPricing()

```ts
getPricing(): {
  browse: "0.00";
  featuredListing: "10.00";
  privateRegistration: "0.05";
  toolDetails: "0.01";
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:366](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L366)

Get pricing information for Lyra Registry services

###### Returns

```ts
{
  browse: "0.00";
  featuredListing: "10.00";
  privateRegistration: "0.05";
  toolDetails: "0.01";
}
```

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `browse` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L51) |
| `featuredListing` | `"10.00"` | `"10.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L54) |
| `privateRegistration` | `"0.05"` | `"0.05"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L53) |
| `toolDetails` | `"0.01"` | `"0.01"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L52) |

##### getToolConfiguration()

```ts
getToolConfiguration(toolId: string): Promise<ToolConfiguration>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L214)

Get tool configuration guide ($0.01)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`ToolConfiguration`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolconfiguration)\>

##### getToolDetails()

```ts
getToolDetails(toolId: string): Promise<DetailedToolInfo>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L186)

Get detailed tool information with examples ($0.01)

Includes:
- Full README
- Code examples
- Configuration options
- Compatibility info
- Changelog

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`DetailedToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#detailedtoolinfo)\>

###### Example

```typescript
const details = await registry.getToolDetails("mcp-server-filesystem");
console.log(details.examples[0].code);
```

##### getToolExamples()

```ts
getToolExamples(toolId: string): Promise<ToolExample[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L206)

Get tool examples only ($0.01)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`ToolExample`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolexample)[]\>

##### getToolInfo()

```ts
getToolInfo(toolId: string): Promise<ToolInfo>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L132)

Get basic info about a tool (FREE)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo)\>

##### getTrending()

```ts
getTrending(limit: number): Promise<ToolInfo[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L158)

Get trending tools (FREE)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `10` |

###### Returns

`Promise`\<[`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo)[]\>

##### listByCategory()

```ts
listByCategory(category: 
  | "data"
  | "media"
  | "ai-ml"
  | "blockchain"
  | "devops"
  | "finance"
  | "gaming"
  | "productivity"
  | "security"
  | "social"
  | "utilities"
| "web3"): Promise<ToolInfo[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L150)

List tools by category (FREE)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `category` | \| `"data"` \| `"media"` \| `"ai-ml"` \| `"blockchain"` \| `"devops"` \| `"finance"` \| `"gaming"` \| `"productivity"` \| `"security"` \| `"social"` \| `"utilities"` \| `"web3"` |

###### Returns

`Promise`\<[`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo)[]\>

##### registerTool()

```ts
registerTool(registration: PrivateToolRegistration): Promise<RegistrationResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L244)

Register a private tool ($0.05)

Register your MCP server tool in the Lyra Registry:
- Private: Only you can see it
- Organization: Shared with your org
- Public: Listed in the catalog

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `registration` | [`PrivateToolRegistration`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#privatetoolregistration) |

###### Returns

`Promise`\<[`RegistrationResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/registry.md#registrationresult)\>

###### Example

```typescript
const result = await registry.registerTool({
  name: "my-mcp-tool",
  description: "My custom MCP tool",
  version: "1.0.0",
  endpoint: "https://api.mytool.com/mcp",
  category: "utilities",
  visibility: "private"
});
console.log(`Tool ID: ${result.toolId}`);
```

##### requestFeaturedListing()

```ts
requestFeaturedListing(request: FeaturedListingRequest): Promise<FeaturedListingResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L317)

Request a featured listing ($10/month)

Featured tools get:
- Homepage placement
- Search result priority
- "Featured" badge
- Analytics dashboard

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`FeaturedListingRequest`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#featuredlistingrequest) |

###### Returns

`Promise`\<[`FeaturedListingResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/registry.md#featuredlistingresult)\>

###### Example

```typescript
const listing = await registry.requestFeaturedListing({
  toolId: "my-tool-id",
  featuredUntil: new Date("2026-02-27"),
  tier: "premium"
});
```

##### search()

```ts
search(query: string, limit: number): Promise<ToolInfo[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L142)

Search tools by name or description (FREE)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `query` | `string` | `undefined` |
| `limit` | `number` | `10` |

###### Returns

`Promise`\<[`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo)[]\>

##### updateTool()

```ts
updateTool(toolId: string, updates: Partial<PrivateToolRegistration>): Promise<{
  message: string;
  success: boolean;
}>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L268)

Update a registered tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `updates` | `Partial`\<[`PrivateToolRegistration`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#privatetoolregistration)\> |

###### Returns

`Promise`\<\{
  `message`: `string`;
  `success`: `boolean`;
\}\>

## Interfaces

### BrowseToolsOptions

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L29)

Search/filter options for browsing tools

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="category"></a> `category?` | \| `"data"` \| `"media"` \| `"ai-ml"` \| `"blockchain"` \| `"devops"` \| `"finance"` \| `"gaming"` \| `"productivity"` \| `"security"` \| `"social"` \| `"utilities"` \| `"web3"` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L31) |
| <a id="limit"></a> `limit?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L37) |
| <a id="minstars"></a> `minStars?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L33) |
| <a id="page"></a> `page?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L36) |
| <a id="query"></a> `query?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L30) |
| <a id="sortby"></a> `sortBy?` | `"name"` \| `"stars"` \| `"downloads"` \| `"updated"` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L34) |
| <a id="sortorder"></a> `sortOrder?` | `"asc"` \| `"desc"` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L35) |
| <a id="tags"></a> `tags?` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L32) |

***

### FeaturedListingResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L65)

Featured listing confirmation

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="featureduntil"></a> `featuredUntil` | `string` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L68) |
| <a id="invoiceid"></a> `invoiceId` | `string` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L70) |
| <a id="success"></a> `success` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L66) |
| <a id="tier"></a> `tier` | `"basic"` \| `"premium"` \| `"spotlight"` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L69) |
| <a id="toolid"></a> `toolId` | `string` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L67) |

***

### RegistrationResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L54)

Result of private tool registration

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apikey"></a> `apiKey` | `string` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L57) |
| <a id="message"></a> `message` | `string` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L59) |
| <a id="success-1"></a> `success` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L55) |
| <a id="toolid-1"></a> `toolId` | `string` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L56) |
| <a id="webhooksecret"></a> `webhookSecret?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L58) |

***

### ToolListResponse

Defined in: [defi/protocols/src/modules/lyra-ecosystem/registry.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L43)

Paginated response for tool listings

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="hasmore"></a> `hasMore` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L48) |
| <a id="limit-1"></a> `limit` | `number` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L47) |
| <a id="page-1"></a> `page` | `number` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L46) |
| <a id="tools"></a> `tools` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo)[] | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L44) |
| <a id="total"></a> `total` | `number` | [defi/protocols/src/modules/lyra-ecosystem/registry.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/registry.ts#L45) |
