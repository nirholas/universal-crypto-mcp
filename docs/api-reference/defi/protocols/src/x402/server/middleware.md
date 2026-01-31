[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/server/middleware

# defi/protocols/src/x402/server/middleware

## Functions

### x402DynamicPaywall()

```ts
function x402DynamicPaywall(calculator: PriceCalculator, baseOptions: Omit<PaywallOptions, "price">): MiddlewareHandler;
```

Defined in: [defi/protocols/src/x402/server/middleware.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/middleware.ts#L210)

Create dynamic pricing paywall middleware
Price is calculated at request time based on context

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `calculator` | [`PriceCalculator`](/docs/api/defi/protocols/src/x402/server/types.md#pricecalculator) | Price calculator instance |
| `baseOptions` | `Omit`\<[`PaywallOptions`](/docs/api/defi/protocols/src/x402/server/types.md#paywalloptions), `"price"`\> | Base paywall options (price will be overridden) |

#### Returns

[`MiddlewareHandler`](/docs/api/defi/protocols/src/x402/server/types.md#middlewarehandler)

Express-compatible middleware handler

#### Example

```typescript
import { dynamicPrice } from '@/x402/server/pricing';

const calculator = dynamicPrice({
  base: '0.01',
  perToken: '0.0001',
  surge: (ctx) => ctx.metadata?.peak ? 1.5 : 1.0,
  token: 'USDs',
  network: 'arbitrum'
});

app.post('/ai/generate', x402DynamicPaywall(calculator, {
  token: 'USDs',
  network: 'arbitrum',
  description: 'AI text generation'
}), generateHandler);
```

***

### x402ExtractPayment()

```ts
function x402ExtractPayment(): MiddlewareHandler;
```

Defined in: [defi/protocols/src/x402/server/middleware.ts:442](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/middleware.ts#L442)

Extract payment info middleware
Adds x402Payment object to request if payment headers present

#### Returns

[`MiddlewareHandler`](/docs/api/defi/protocols/src/x402/server/types.md#middlewarehandler)

***

### x402Paywall()

```ts
function x402Paywall(options: PaywallOptions): MiddlewareHandler;
```

Defined in: [defi/protocols/src/x402/server/middleware.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/middleware.ts#L89)

Create x402 paywall middleware (Express-compatible)
Returns 402 Payment Required if not paid, continues if paid

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | [`PaywallOptions`](/docs/api/defi/protocols/src/x402/server/types.md#paywalloptions) | Paywall configuration |

#### Returns

[`MiddlewareHandler`](/docs/api/defi/protocols/src/x402/server/types.md#middlewarehandler)

Express-compatible middleware handler

#### Example

```typescript
// Simple fixed price
app.get('/joke', x402Paywall({
  price: '0.001',
  token: 'USDs',
  network: 'arbitrum',
  description: 'Get a random joke'
}), jokeHandler);

// With custom recipient
app.get('/premium', x402Paywall({
  price: '0.10',
  token: 'USDs',
  network: 'arbitrum',
  recipient: '0x...',
  validitySeconds: 600
}), premiumHandler);
```

***

### x402PaywallFastify()

```ts
function x402PaywallFastify(options: PaywallOptions): (request: {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  method: string;
  url: string;
}, reply: {
  code: unknown;
  headers: unknown;
  send: void;
}) => Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/middleware.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/middleware.ts#L263)

Fastify preHandler adapter

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`PaywallOptions`](/docs/api/defi/protocols/src/x402/server/types.md#paywalloptions) |

#### Returns

```ts
(request: {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  method: string;
  url: string;
}, reply: {
  code: unknown;
  headers: unknown;
  send: void;
}): Promise<void>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | \{ `body?`: `unknown`; `headers`: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>; `method`: `string`; `url`: `string`; \} |
| `request.body?` | `unknown` |
| `request.headers` | `Record`\<`string`, `string` \| `string`[] \| `undefined`\> |
| `request.method` | `string` |
| `request.url` | `string` |
| `reply` | \{ `code`: `unknown`; `headers`: `unknown`; `send`: `void`; \} |
| `reply.code` |
| `reply.headers` |
| `reply.send` |

##### Returns

`Promise`\<`void`\>

#### Example

```typescript
fastify.get('/premium', {
  preHandler: x402PaywallFastify({ price: '0.01', token: 'USDs', network: 'arbitrum' })
}, handler);
```

***

### x402PaywallHono()

```ts
function x402PaywallHono(options: PaywallOptions): (c: {
  req: {
     method: string;
     path: string;
     header: string | undefined;
     text: Promise<string>;
  };
  header: void;
  json: Response;
  status: void;
}, next: () => Promise<void>) => Promise<void | Response>;
```

Defined in: [defi/protocols/src/x402/server/middleware.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/middleware.ts#L314)

Hono middleware adapter

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`PaywallOptions`](/docs/api/defi/protocols/src/x402/server/types.md#paywalloptions) |

#### Returns

```ts
(c: {
  req: {
     method: string;
     path: string;
     header: string | undefined;
     text: Promise<string>;
  };
  header: void;
  json: Response;
  status: void;
}, next: () => Promise<void>): Promise<void | Response>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `c` | \{ `req`: \{ `method`: `string`; `path`: `string`; `header`: `string` \| `undefined`; `text`: `Promise`\<`string`\>; \}; `header`: `void`; `json`: `Response`; `status`: `void`; \} |
| `c.req` | \{ `method`: `string`; `path`: `string`; `header`: `string` \| `undefined`; `text`: `Promise`\<`string`\>; \} |
| `c.req.method` | `string` |
| `c.req.path` | `string` |
| `c.req.header` |
| `c.req.text` |
| `c.header` |
| `c.json` |
| `c.status` |
| `next` | () => `Promise`\<`void`\> |

##### Returns

`Promise`\<`void` \| `Response`\>

#### Example

```typescript
app.use('/premium/*', x402PaywallHono({ price: '0.01', token: 'USDs', network: 'arbitrum' }));
```

***

### x402PaywallKoa()

```ts
function x402PaywallKoa(options: PaywallOptions): (ctx: {
  request: {
     body?: unknown;
     headers: Record<string, string | string[] | undefined>;
     method: string;
     path: string;
  };
  response: {
     body: unknown;
     status: number;
     set: void;
  };
}, next: () => Promise<void>) => Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/middleware.ts:389](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/middleware.ts#L389)

Koa middleware adapter

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`PaywallOptions`](/docs/api/defi/protocols/src/x402/server/types.md#paywalloptions) |

#### Returns

```ts
(ctx: {
  request: {
     body?: unknown;
     headers: Record<string, string | string[] | undefined>;
     method: string;
     path: string;
  };
  response: {
     body: unknown;
     status: number;
     set: void;
  };
}, next: () => Promise<void>): Promise<void>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `ctx` | \{ `request`: \{ `body?`: `unknown`; `headers`: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>; `method`: `string`; `path`: `string`; \}; `response`: \{ `body`: `unknown`; `status`: `number`; `set`: `void`; \}; \} |
| `ctx.request` | \{ `body?`: `unknown`; `headers`: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>; `method`: `string`; `path`: `string`; \} |
| `ctx.request.body?` | `unknown` |
| `ctx.request.headers` | `Record`\<`string`, `string` \| `string`[] \| `undefined`\> |
| `ctx.request.method` | `string` |
| `ctx.request.path` | `string` |
| `ctx.response` | \{ `body`: `unknown`; `status`: `number`; `set`: `void`; \} |
| `ctx.response.body` | `unknown` |
| `ctx.response.status` | `number` |
| `ctx.response.set` |
| `next` | () => `Promise`\<`void`\> |

##### Returns

`Promise`\<`void`\>

#### Example

```typescript
router.get('/premium', x402PaywallKoa({ price: '0.01', token: 'USDs', network: 'arbitrum' }), handler);
```

***

### x402RateLimit()

```ts
function x402RateLimit(options: {
  maxRequests: number;
  skipAboveAmount?: string;
  windowSeconds: number;
}): MiddlewareHandler;
```

Defined in: [defi/protocols/src/x402/server/middleware.ts:510](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/middleware.ts#L510)

Rate limit by payer address
Limits requests per payer within a time window

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | \{ `maxRequests`: `number`; `skipAboveAmount?`: `string`; `windowSeconds`: `number`; \} | - |
| `options.maxRequests` | `number` | Max requests per window |
| `options.skipAboveAmount?` | `string` | Skip rate limit if payment exceeds this amount |
| `options.windowSeconds` | `number` | Window size in seconds |

#### Returns

[`MiddlewareHandler`](/docs/api/defi/protocols/src/x402/server/types.md#middlewarehandler)

***

### x402TrackPayment()

```ts
function x402TrackPayment(onPayment: (payment: {
  amount: string;
  chain: string;
  proof: string;
  resource: string;
  timestamp: number;
  token: string;
}) => void | Promise<void>): MiddlewareHandler;
```

Defined in: [defi/protocols/src/x402/server/middleware.ts:471](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/middleware.ts#L471)

Payment analytics middleware
Tracks successful payments for analytics

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `onPayment` | (`payment`: \{ `amount`: `string`; `chain`: `string`; `proof`: `string`; `resource`: `string`; `timestamp`: `number`; `token`: `string`; \}) => `void` \| `Promise`\<`void`\> |

#### Returns

[`MiddlewareHandler`](/docs/api/defi/protocols/src/x402/server/types.md#middlewarehandler)
