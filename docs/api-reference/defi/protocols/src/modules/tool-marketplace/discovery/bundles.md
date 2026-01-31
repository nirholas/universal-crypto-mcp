[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/bundles

# defi/protocols/src/modules/tool-marketplace/discovery/bundles

## Classes

### BundleManager

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L85)

Tool Bundles Manager

#### Constructors

##### Constructor

```ts
new BundleManager(platformAddress: `0x${string}`): BundleManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L91)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `platformAddress` | `` `0x${string}` `` |

###### Returns

[`BundleManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/bundles.md#bundlemanager)

#### Methods

##### autoGenerateBundles()

```ts
autoGenerateBundles(): Promise<ToolBundle[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:430](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L430)

Auto-generate bundles based on tool categories and tags

###### Returns

`Promise`\<[`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)[]\>

##### cancelSubscription()

```ts
cancelSubscription(subscriptionId: string, userAddress: `0x${string}`): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:368](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L368)

Cancel subscription

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |
| `userAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<`void`\>

##### createBundle()

```ts
createBundle(input: CreateBundleInput): Promise<ToolBundle>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L135)

Create a new bundle

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`CreateBundleInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#createbundleinput) |

###### Returns

`Promise`\<[`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)\>

##### deleteBundle()

```ts
deleteBundle(bundleId: string, callerAddress: `0x${string}`): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L230)

Delete bundle

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `bundleId` | `string` |
| `callerAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<`void`\>

##### getBundle()

```ts
getBundle(bundleId: string): 
  | ToolBundle
  | undefined;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L189)

Get bundle by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `bundleId` | `string` |

###### Returns

  \| [`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)
  \| `undefined`

##### getBundlesForTool()

```ts
getBundlesForTool(toolId: string): ToolBundle[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:421](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L421)

Get bundles containing a specific tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)[]

##### getStats()

```ts
getStats(): {
  avgDiscount: number;
  curatedBundles: number;
  topCategories: {
     category: string;
     count: number;
  }[];
  totalBundles: number;
  totalSubscribers: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:523](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L523)

Get bundle statistics

###### Returns

```ts
{
  avgDiscount: number;
  curatedBundles: number;
  topCategories: {
     category: string;
     count: number;
  }[];
  totalBundles: number;
  totalSubscribers: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `avgDiscount` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:527](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L527) |
| `curatedBundles` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:525](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L525) |
| `topCategories` | \{ `category`: `string`; `count`: `number`; \}[] | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:528](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L528) |
| `totalBundles` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:524](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L524) |
| `totalSubscribers` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:526](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L526) |

##### getUserSubscriptions()

```ts
getUserSubscriptions(userAddress: `0x${string}`): BundleSubscription[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L395)

Get user's subscriptions

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |

###### Returns

[`BundleSubscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#bundlesubscription)[]

##### hasAccess()

```ts
hasAccess(userAddress: `0x${string}`, bundleId: string): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:404](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L404)

Check if user has access to a bundle

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |
| `bundleId` | `string` |

###### Returns

`boolean`

##### listBundles()

```ts
listBundles(options: {
  category?: string;
  creatorAddress?: `0x${string}`;
  curatedOnly?: boolean;
  limit?: number;
  minDiscount?: number;
  offset?: number;
  sortBy?: "price" | "subscribers" | "discount" | "rating" | "newest";
}): ToolBundle[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L254)

List all bundles

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `category?`: `string`; `creatorAddress?`: `` `0x${string}` ``; `curatedOnly?`: `boolean`; `limit?`: `number`; `minDiscount?`: `number`; `offset?`: `number`; `sortBy?`: `"price"` \| `"subscribers"` \| `"discount"` \| `"rating"` \| `"newest"`; \} |
| `options.category?` | `string` |
| `options.creatorAddress?` | `` `0x${string}` `` |
| `options.curatedOnly?` | `boolean` |
| `options.limit?` | `number` |
| `options.minDiscount?` | `number` |
| `options.offset?` | `number` |
| `options.sortBy?` | `"price"` \| `"subscribers"` \| `"discount"` \| `"rating"` \| `"newest"` |

###### Returns

[`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)[]

##### loadTools()

```ts
loadTools(tools: RegisteredTool[]): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L98)

Load tools

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] |

###### Returns

`void`

##### processRenewals()

```ts
processRenewals(): Promise<{
  expired: number;
  renewed: number;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:563](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L563)

Process subscription renewals

###### Returns

`Promise`\<\{
  `expired`: `number`;
  `renewed`: `number`;
\}\>

##### subscribe()

```ts
subscribe(
   bundleId: string, 
   userAddress: `0x${string}`, 
   options: {
  autoRenew?: boolean;
}): Promise<BundleSubscription>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L319)

Subscribe to a bundle

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `bundleId` | `string` |
| `userAddress` | `` `0x${string}` `` |
| `options` | \{ `autoRenew?`: `boolean`; \} |
| `options.autoRenew?` | `boolean` |

###### Returns

`Promise`\<[`BundleSubscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#bundlesubscription)\>

##### suggestBundleForUser()

```ts
suggestBundleForUser(usedToolIds: string[], options: {
  maxPrice?: string;
}): 
  | ToolBundle
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:489](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L489)

Suggest bundle for a user based on their usage

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `usedToolIds` | `string`[] |
| `options` | \{ `maxPrice?`: `string`; \} |
| `options.maxPrice?` | `string` |

###### Returns

  \| [`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)
  \| `null`

##### updateBundle()

```ts
updateBundle(
   bundleId: string, 
   updates: Partial<Pick<ToolBundle, "name" | "description" | "discountPercent" | "tags">>, 
callerAddress: `0x${string}`): Promise<ToolBundle>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L196)

Update bundle

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `bundleId` | `string` |
| `updates` | `Partial`\<`Pick`\<[`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle), `"name"` \| `"description"` \| `"discountPercent"` \| `"tags"`\>\> |
| `callerAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)\>

## Variables

### BUNDLE\_TEMPLATES

```ts
const BUNDLE_TEMPLATES: {
  aiAnalytics: {
     category: string;
     description: string;
     discountPercent: number;
     name: string;
     requiredCategories: string[];
     requiredTags: string[];
     tags: string[];
  };
  dataComplete: {
     category: string;
     description: string;
     discountPercent: number;
     name: string;
     requiredCategories: string[];
     requiredTags: string[];
     tags: string[];
  };
  defiStarter: {
     category: string;
     description: string;
     discountPercent: number;
     name: string;
     requiredCategories: string[];
     requiredTags: string[];
     tags: string[];
  };
  nftCreator: {
     category: string;
     description: string;
     discountPercent: number;
     name: string;
     requiredCategories: string[];
     requiredTags: string[];
     tags: string[];
  };
  tradingPro: {
     category: string;
     description: string;
     discountPercent: number;
     name: string;
     requiredCategories: string[];
     requiredTags: string[];
     tags: string[];
  };
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L34)

Pre-defined bundle templates

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="aianalytics"></a> `aiAnalytics` | \{ `category`: `string`; `description`: `string`; `discountPercent`: `number`; `name`: `string`; `requiredCategories`: `string`[]; `requiredTags`: `string`[]; `tags`: `string`[]; \} | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L62) |
| `aiAnalytics.category` | `string` | `"ai"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L65) |
| `aiAnalytics.description` | `string` | `"AI-powered tools for market prediction, sentiment analysis, and insights"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L64) |
| `aiAnalytics.discountPercent` | `number` | `25` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L69) |
| `aiAnalytics.name` | `string` | `"AI Analytics Suite"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L63) |
| `aiAnalytics.requiredCategories` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L67) |
| `aiAnalytics.requiredTags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L68) |
| `aiAnalytics.tags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L66) |
| <a id="datacomplete"></a> `dataComplete` | \{ `category`: `string`; `description`: `string`; `discountPercent`: `number`; `name`: `string`; `requiredCategories`: `string`[]; `requiredTags`: `string`[]; `tags`: `string`[]; \} | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L71) |
| `dataComplete.category` | `string` | `"data"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L74) |
| `dataComplete.description` | `string` | `"Comprehensive data access: prices, volumes, on-chain metrics, and historical data"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L73) |
| `dataComplete.discountPercent` | `number` | `20` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L78) |
| `dataComplete.name` | `string` | `"Data Complete Package"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L72) |
| `dataComplete.requiredCategories` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L76) |
| `dataComplete.requiredTags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L77) |
| `dataComplete.tags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L75) |
| <a id="defistarter"></a> `defiStarter` | \{ `category`: `string`; `description`: `string`; `discountPercent`: `number`; `name`: `string`; `requiredCategories`: `string`[]; `requiredTags`: `string`[]; `tags`: `string`[]; \} | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L35) |
| `defiStarter.category` | `string` | `"defi"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L38) |
| `defiStarter.description` | `string` | `"Essential tools for DeFi operations: price feeds, swap quotes, and gas estimation"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L37) |
| `defiStarter.discountPercent` | `number` | `15` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L42) |
| `defiStarter.name` | `string` | `"DeFi Starter Pack"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L36) |
| `defiStarter.requiredCategories` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L40) |
| `defiStarter.requiredTags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L41) |
| `defiStarter.tags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L39) |
| <a id="nftcreator"></a> `nftCreator` | \{ `category`: `string`; `description`: `string`; `discountPercent`: `number`; `name`: `string`; `requiredCategories`: `string`[]; `requiredTags`: `string`[]; `tags`: `string`[]; \} | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L53) |
| `nftCreator.category` | `string` | `"nft"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L56) |
| `nftCreator.description` | `string` | `"Everything for NFT creators: metadata tools, marketplace integration, and analytics"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L55) |
| `nftCreator.discountPercent` | `number` | `10` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L60) |
| `nftCreator.name` | `string` | `"NFT Creator Toolkit"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L54) |
| `nftCreator.requiredCategories` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L58) |
| `nftCreator.requiredTags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L59) |
| `nftCreator.tags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L57) |
| <a id="tradingpro"></a> `tradingPro` | \{ `category`: `string`; `description`: `string`; `discountPercent`: `number`; `name`: `string`; `requiredCategories`: `string`[]; `requiredTags`: `string`[]; `tags`: `string`[]; \} | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L44) |
| `tradingPro.category` | `string` | `"trading"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L47) |
| `tradingPro.description` | `string` | `"Professional trading tools: real-time prices, technical analysis, and alerts"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L46) |
| `tradingPro.discountPercent` | `number` | `20` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L51) |
| `tradingPro.name` | `string` | `"Trading Pro Bundle"` | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L45) |
| `tradingPro.requiredCategories` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L49) |
| `tradingPro.requiredTags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L50) |
| `tradingPro.tags` | `string`[] | - | [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L48) |

***

### bundleManager

```ts
const bundleManager: BundleManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts:604](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/bundles.ts#L604)

Singleton instance
