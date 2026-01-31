[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/news/x402-discovery

# defi/protocols/src/modules/news/x402-discovery

## Interfaces

### BazaarExtension

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L35)

Bazaar extension for UI discoverability

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="info"></a> `info?` | \{ `input`: `unknown`; `output?`: `unknown`; \} | [defi/protocols/src/modules/news/x402-discovery.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L36) |
| `info.input` | `unknown` | [defi/protocols/src/modules/news/x402-discovery.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L37) |
| `info.output?` | `unknown` | [defi/protocols/src/modules/news/x402-discovery.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L38) |
| <a id="schema"></a> `schema?` | `unknown` | [defi/protocols/src/modules/news/x402-discovery.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L40) |

***

### X402Accepts

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L17)

V2 Accepts schema for x402scan

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L20) |
| <a id="asset"></a> `asset` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L23) |
| <a id="extra"></a> `extra` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/modules/news/x402-discovery.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L24) |
| <a id="maxtimeoutseconds"></a> `maxTimeoutSeconds` | `number` | [defi/protocols/src/modules/news/x402-discovery.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L22) |
| <a id="network"></a> `network` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L19) |
| <a id="payto"></a> `payTo` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L21) |
| <a id="scheme"></a> `scheme` | `"exact"` | [defi/protocols/src/modules/news/x402-discovery.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L18) |

***

### X402DiscoveryDocument

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L55)

Discovery document for /.well-known/x402

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="contact"></a> `contact?` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L61) |
| <a id="description"></a> `description` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L57) |
| <a id="documentation"></a> `documentation?` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L60) |
| <a id="homepage"></a> `homepage?` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L59) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L56) |
| <a id="resources"></a> `resources` | [`X402Response`](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402response)[] | [defi/protocols/src/modules/news/x402-discovery.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L62) |
| <a id="version"></a> `version` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L58) |

***

### X402Resource

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L28)

Resource metadata

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-1"></a> `description` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L30) |
| <a id="mimetype"></a> `mimeType` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L31) |
| <a id="url"></a> `url` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L29) |

***

### X402Response

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L44)

V2 x402 Response

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="accepts"></a> `accepts?` | [`X402Accepts`](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402accepts)[] | [defi/protocols/src/modules/news/x402-discovery.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L47) |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/modules/news/x402-discovery.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L46) |
| <a id="extensions"></a> `extensions?` | \{ `bazaar?`: [`BazaarExtension`](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#bazaarextension); \} | [defi/protocols/src/modules/news/x402-discovery.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L49) |
| `extensions.bazaar?` | [`BazaarExtension`](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#bazaarextension) | [defi/protocols/src/modules/news/x402-discovery.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L50) |
| <a id="resource"></a> `resource?` | [`X402Resource`](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402resource) | [defi/protocols/src/modules/news/x402-discovery.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L48) |
| <a id="x402version"></a> `x402Version` | `2` | [defi/protocols/src/modules/news/x402-discovery.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L45) |

## Variables

### PREMIUM\_NEWS\_RESOURCES

```ts
const PREMIUM_NEWS_RESOURCES: X402Response[];
```

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L91)

Premium News API resources with x402scan V2 schema compliance

## Functions

### createX402DiscoveryHandler()

```ts
function createX402DiscoveryHandler(): () => Promise<Response>;
```

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:684](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L684)

Example Next.js API route handler for /.well-known/x402

Usage in Next.js:
```typescript
// app/.well-known/x402/route.ts
import { createX402DiscoveryHandler } from '@/modules/news/x402-discovery';
export const GET = createX402DiscoveryHandler();
```

#### Returns

```ts
(): Promise<Response>;
```

##### Returns

`Promise`\<`Response`\>

***

### generateDiscoveryDocument()

```ts
function generateDiscoveryDocument(): X402DiscoveryDocument;
```

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:650](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L650)

Generate the /.well-known/x402 discovery document

#### Returns

[`X402DiscoveryDocument`](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402discoverydocument)

***

### getDiscoveryDocumentJSON()

```ts
function getDiscoveryDocumentJSON(): string;
```

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:666](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L666)

Get discovery document as JSON string

#### Returns

`string`

***

### validateDiscoveryDocument()

```ts
function validateDiscoveryDocument(): {
  errors: Record<string, string[]>;
  valid: boolean;
};
```

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:767](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L767)

Validate all resources in discovery document

#### Returns

```ts
{
  errors: Record<string, string[]>;
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `errors` | `Record`\<`string`, `string`[]\> | [defi/protocols/src/modules/news/x402-discovery.ts:767](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L767) |
| `valid` | `boolean` | [defi/protocols/src/modules/news/x402-discovery.ts:767](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L767) |

***

### validateResource()

```ts
function validateResource(resource: X402Response): {
  errors: string[];
  valid: boolean;
};
```

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:731](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L731)

Validate a resource against x402scan V2 schema

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `resource` | [`X402Response`](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402response) |

#### Returns

```ts
{
  errors: string[];
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `errors` | `string`[] | [defi/protocols/src/modules/news/x402-discovery.ts:731](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L731) |
| `valid` | `boolean` | [defi/protocols/src/modules/news/x402-discovery.ts:731](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L731) |

***

### x402DiscoveryMiddleware()

```ts
function x402DiscoveryMiddleware(_req: unknown, res: {
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
}): void;
```

Defined in: [defi/protocols/src/modules/news/x402-discovery.ts:715](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/x402-discovery.ts#L715)

Express middleware for /.well-known/x402

Usage:
```typescript
import express from 'express';
import { x402DiscoveryMiddleware } from '@/modules/news/x402-discovery';

const app = express();
app.use('/.well-known/x402', x402DiscoveryMiddleware);
```

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `_req` | `unknown` |
| `res` | \{ `json`: (`data`: `unknown`) => `void`; `setHeader`: (`name`: `string`, `value`: `string`) => `void`; \} |
| `res.json` | (`data`: `unknown`) => `void` |
| `res.setHeader` | (`name`: `string`, `value`: `string`) => `void` |

#### Returns

`void`
