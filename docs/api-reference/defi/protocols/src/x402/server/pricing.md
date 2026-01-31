[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/server/pricing

# defi/protocols/src/x402/server/pricing

## Interfaces

### PriceTier

Defined in: [defi/protocols/src/x402/server/pricing.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L240)

Tier configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="maxrequests"></a> `maxRequests?` | `number` | Maximum requests for this tier (undefined = unlimited) | [defi/protocols/src/x402/server/pricing.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L242) |
| <a id="name"></a> `name?` | `string` | Tier name | [defi/protocols/src/x402/server/pricing.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L246) |
| <a id="price"></a> `price` | `string` | Price per request at this tier | [defi/protocols/src/x402/server/pricing.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L244) |

***

### ResourceBasedPricingOptions

Defined in: [defi/protocols/src/x402/server/pricing.ts:467](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L467)

Resource-based pricing options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="defaultprice"></a> `defaultPrice` | `string` | Default price for unmatched resources | [defi/protocols/src/x402/server/pricing.ts:469](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L469) |
| <a id="network"></a> `network` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Network | [defi/protocols/src/x402/server/pricing.ts:475](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L475) |
| <a id="resources"></a> `resources` | [`ResourcePricing`](/docs/api/defi/protocols/src/x402/server/pricing.md#resourcepricing)[] | Resource-specific pricing | [defi/protocols/src/x402/server/pricing.ts:471](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L471) |
| <a id="token"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token | [defi/protocols/src/x402/server/pricing.ts:473](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L473) |

***

### ResourcePricing

Defined in: [defi/protocols/src/x402/server/pricing.ts:455](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L455)

Resource pricing map

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description"></a> `description?` | `string` | Description | [defi/protocols/src/x402/server/pricing.ts:461](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L461) |
| <a id="pattern"></a> `pattern` | `string` | Path pattern (supports wildcards) | [defi/protocols/src/x402/server/pricing.ts:457](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L457) |
| <a id="price-1"></a> `price` | `string` | Price for this resource | [defi/protocols/src/x402/server/pricing.ts:459](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L459) |

***

### TieredPricingOptions

Defined in: [defi/protocols/src/x402/server/pricing.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L252)

Tiered pricing options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="countperiod"></a> `countPeriod?` | `"day"` \| `"week"` \| `"month"` \| `"hour"` | Period for counting requests (default: 'day') | [defi/protocols/src/x402/server/pricing.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L262) |
| <a id="getrequestcount"></a> `getRequestCount?` | (`ctx`: [`PricingContext`](/docs/api/defi/protocols/src/x402/server/types.md#pricingcontext)) => `number` \| `Promise`\<`number`\> | Function to get current request count for client | [defi/protocols/src/x402/server/pricing.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L260) |
| <a id="network-1"></a> `network` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Network | [defi/protocols/src/x402/server/pricing.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L258) |
| <a id="tiers"></a> `tiers` | [`PriceTier`](/docs/api/defi/protocols/src/x402/server/pricing.md#pricetier)[] | Price tiers (ordered from smallest to largest) | [defi/protocols/src/x402/server/pricing.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L254) |
| <a id="token-1"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token for pricing | [defi/protocols/src/x402/server/pricing.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L256) |

***

### TimeBasedPricingOptions

Defined in: [defi/protocols/src/x402/server/pricing.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L344)

Time-based pricing options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="defaultprice-1"></a> `defaultPrice` | `string` | Default price | [defi/protocols/src/x402/server/pricing.ts:346](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L346) |
| <a id="network-2"></a> `network` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Network | [defi/protocols/src/x402/server/pricing.ts:360](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L360) |
| <a id="offpeakhours"></a> `offPeakHours?` | \{ `end`: `number`; `start`: `number`; \} | Off-peak hours (24-hour format) | [defi/protocols/src/x402/server/pricing.ts:354](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L354) |
| `offPeakHours.end` | `number` | - | [defi/protocols/src/x402/server/pricing.ts:354](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L354) |
| `offPeakHours.start` | `number` | - | [defi/protocols/src/x402/server/pricing.ts:354](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L354) |
| <a id="offpeakprice"></a> `offPeakPrice?` | `string` | Off-peak hours pricing (lower) | [defi/protocols/src/x402/server/pricing.ts:350](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L350) |
| <a id="peakhours"></a> `peakHours?` | \{ `end`: `number`; `start`: `number`; \} | Peak hours (24-hour format) | [defi/protocols/src/x402/server/pricing.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L352) |
| `peakHours.end` | `number` | - | [defi/protocols/src/x402/server/pricing.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L352) |
| `peakHours.start` | `number` | - | [defi/protocols/src/x402/server/pricing.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L352) |
| <a id="peakprice"></a> `peakPrice?` | `string` | Peak hours pricing (higher) | [defi/protocols/src/x402/server/pricing.ts:348](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L348) |
| <a id="timezone"></a> `timezone?` | `string` | Timezone (default: 'UTC') | [defi/protocols/src/x402/server/pricing.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L362) |
| <a id="token-2"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token | [defi/protocols/src/x402/server/pricing.ts:358](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L358) |
| <a id="weekendmultiplier"></a> `weekendMultiplier?` | `number` | Weekend pricing multiplier | [defi/protocols/src/x402/server/pricing.ts:356](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L356) |

## Functions

### compositePrice()

```ts
function compositePrice(calculators: PriceCalculator[], options: {
  combine: "add" | "multiply" | "max" | "min" | "average";
  maxPrice?: string;
  minPrice?: string;
  network: X402Chain;
  token: X402Token;
}): PriceCalculator;
```

Defined in: [defi/protocols/src/x402/server/pricing.ts:564](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L564)

Combine multiple calculators with custom logic

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `calculators` | [`PriceCalculator`](/docs/api/defi/protocols/src/x402/server/types.md#pricecalculator)[] |
| `options` | \{ `combine`: `"add"` \| `"multiply"` \| `"max"` \| `"min"` \| `"average"`; `maxPrice?`: `string`; `minPrice?`: `string`; `network`: [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain); `token`: [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token); \} |
| `options.combine` | `"add"` \| `"multiply"` \| `"max"` \| `"min"` \| `"average"` |
| `options.maxPrice?` | `string` |
| `options.minPrice?` | `string` |
| `options.network` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |
| `options.token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

#### Returns

[`PriceCalculator`](/docs/api/defi/protocols/src/x402/server/types.md#pricecalculator)

#### Example

```typescript
const calculator = compositePrice([
  resourceBasedPrice({ ... }),
  timeBasedPrice({ ... }),
], {
  combine: 'multiply',  // or 'add', 'max', 'min', 'average'
  token: 'USDs',
  network: 'arbitrum'
});
```

***

### createPricingContext()

```ts
function createPricingContext(req: GenericRequest, options?: {
  clientAddress?: `0x${string}`;
  metadata?: Record<string, unknown>;
}): PricingContext;
```

Defined in: [defi/protocols/src/x402/server/pricing.ts:631](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L631)

Create pricing context from Express request

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `req` | [`GenericRequest`](/docs/api/defi/protocols/src/x402/server/types.md#genericrequest) |
| `options?` | \{ `clientAddress?`: `` `0x${string}` ``; `metadata?`: `Record`\<`string`, `unknown`\>; \} |
| `options.clientAddress?` | `` `0x${string}` `` |
| `options.metadata?` | `Record`\<`string`, `unknown`\> |

#### Returns

[`PricingContext`](/docs/api/defi/protocols/src/x402/server/types.md#pricingcontext)

***

### dynamicPrice()

```ts
function dynamicPrice(options: DynamicPricingOptions): PriceCalculator;
```

Defined in: [defi/protocols/src/x402/server/pricing.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L81)

Create a dynamic price calculator

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`DynamicPricingOptions`](/docs/api/defi/protocols/src/x402/server/types.md#dynamicpricingoptions) |

#### Returns

[`PriceCalculator`](/docs/api/defi/protocols/src/x402/server/types.md#pricecalculator)

#### Example

```typescript
const calculator = dynamicPrice({
  base: '0.01',
  perToken: '0.0001',  // $0.0001 per AI token
  perKB: '0.001',      // $0.001 per KB response
  surge: async (ctx) => {
    // 1.5x during peak hours
    const hour = new Date().getHours();
    return (hour >= 9 && hour <= 17) ? 1.5 : 1.0;
  },
  discount: async (ctx) => {
    // 20% off for verified addresses
    if (ctx.clientAddress && await isVerified(ctx.clientAddress)) {
      return 0.8;
    }
    return 1.0;
  },
  minPrice: '0.001',
  maxPrice: '1.00',
  token: 'USDs',
  network: 'arbitrum'
});
```

***

### fixedPrice()

```ts
function fixedPrice(
   price: string, 
   token: X402Token, 
   network: X402Chain): PriceCalculator;
```

Defined in: [defi/protocols/src/x402/server/pricing.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L211)

Create a simple fixed price calculator

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `price` | `string` |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |
| `network` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |

#### Returns

[`PriceCalculator`](/docs/api/defi/protocols/src/x402/server/types.md#pricecalculator)

#### Example

```typescript
const calculator = fixedPrice('0.01', 'USDs', 'arbitrum');
```

***

### resourceBasedPrice()

```ts
function resourceBasedPrice(options: ResourceBasedPricingOptions): PriceCalculator;
```

Defined in: [defi/protocols/src/x402/server/pricing.ts:497](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L497)

Create resource-based price calculator
Different prices for different endpoints

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`ResourceBasedPricingOptions`](/docs/api/defi/protocols/src/x402/server/pricing.md#resourcebasedpricingoptions) |

#### Returns

[`PriceCalculator`](/docs/api/defi/protocols/src/x402/server/types.md#pricecalculator)

#### Example

```typescript
const calculator = resourceBasedPrice({
  defaultPrice: '0.01',
  resources: [
    { pattern: '/api/joke', price: '0.001', description: 'Random joke' },
    { pattern: '/api/summary', price: '0.01', description: 'Text summary' },
    { pattern: '/api/image/*', price: '0.05', description: 'Image generation' },
    { pattern: '/api/premium/*', price: '0.10', description: 'Premium features' },
  ],
  token: 'USDs',
  network: 'arbitrum'
});
```

***

### tieredPrice()

```ts
function tieredPrice(options: TieredPricingOptions): PriceCalculator;
```

Defined in: [defi/protocols/src/x402/server/pricing.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L286)

Create tiered price calculator
Price decreases as usage increases

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`TieredPricingOptions`](/docs/api/defi/protocols/src/x402/server/pricing.md#tieredpricingoptions) |

#### Returns

[`PriceCalculator`](/docs/api/defi/protocols/src/x402/server/types.md#pricecalculator)

#### Example

```typescript
const calculator = tieredPrice({
  tiers: [
    { maxRequests: 100, price: '0.01', name: 'Basic' },
    { maxRequests: 1000, price: '0.008', name: 'Standard' },
    { maxRequests: 10000, price: '0.005', name: 'Pro' },
    { price: '0.002', name: 'Enterprise' }  // Unlimited
  ],
  token: 'USDs',
  network: 'arbitrum',
  getRequestCount: async (ctx) => {
    return await db.getRequestCount(ctx.clientAddress, 'month');
  }
});
```

***

### timeBasedPrice()

```ts
function timeBasedPrice(options: TimeBasedPricingOptions): PriceCalculator;
```

Defined in: [defi/protocols/src/x402/server/pricing.ts:383](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/pricing.ts#L383)

Create time-based price calculator
Prices vary based on time of day, day of week

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`TimeBasedPricingOptions`](/docs/api/defi/protocols/src/x402/server/pricing.md#timebasedpricingoptions) |

#### Returns

[`PriceCalculator`](/docs/api/defi/protocols/src/x402/server/types.md#pricecalculator)

#### Example

```typescript
const calculator = timeBasedPrice({
  defaultPrice: '0.01',
  peakPrice: '0.015',      // 50% more during peak
  offPeakPrice: '0.005',   // 50% less during off-peak
  peakHours: { start: 9, end: 17 },     // 9am-5pm
  offPeakHours: { start: 0, end: 6 },   // Midnight-6am
  weekendMultiplier: 0.8,  // 20% off on weekends
  token: 'USDs',
  network: 'arbitrum'
});
```
