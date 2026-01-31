[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/storage/webhook-events

# defi/protocols/src/vendors/payments/storage/webhook-events

## Classes

### WebhookEventStore

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L48)

In-memory event store for webhook notifications
Features:
- Automatic cleanup of expired events
- Event deduplication by eventId
- Fast lookup by payment identifier
- Memory-bounded with configurable limits

#### Constructors

##### Constructor

```ts
new WebhookEventStore(config: EventStoreConfig): WebhookEventStore;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L54)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`EventStoreConfig`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#eventstoreconfig) |

###### Returns

[`WebhookEventStore`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#webhookeventstore)

#### Methods

##### cleanup()

```ts
cleanup(): number;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L195)

Remove expired events based on TTL

###### Returns

`number`

Number of events removed

##### clear()

```ts
clear(): void;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L292)

Clear all events from the store

###### Returns

`void`

##### getByEventId()

```ts
getByEventId(eventId: string): 
  | WebhookEvent
  | undefined;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L170)

Get a specific event by eventId

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `eventId` | `string` | The event ID |

###### Returns

  \| [`WebhookEvent`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#webhookevent)
  \| `undefined`

The webhook event or undefined if not found

##### getByIdentifier()

```ts
getByIdentifier(identifier: string): WebhookEvent[];
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L116)

Get all events for a specific payment identifier

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `identifier` | `string` | The payment identifier |

###### Returns

[`WebhookEvent`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#webhookevent)[]

Array of webhook events, sorted by receivedAt (newest first)

##### getConfig()

```ts
getConfig(): EventStoreConfig;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L344)

Get current configuration

###### Returns

[`EventStoreConfig`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#eventstoreconfig)

##### getRecent()

```ts
getRecent(limit: number): WebhookEvent[];
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L147)

Get most recent webhook events

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `limit` | `number` | `50` | Maximum number of events to return |

###### Returns

[`WebhookEvent`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#webhookevent)[]

Array of webhook events, sorted by receivedAt (newest first)

##### getStats()

```ts
getStats(): {
  invalidatedCount: number;
  newestEventAge: number | null;
  oldestEventAge: number | null;
  totalEvents: number;
  uniqueIdentifiers: number;
  validatedCount: number;
};
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L306)

Get store statistics

###### Returns

```ts
{
  invalidatedCount: number;
  newestEventAge: number | null;
  oldestEventAge: number | null;
  totalEvents: number;
  uniqueIdentifiers: number;
  validatedCount: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `invalidatedCount` | `number` | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L312) |
| `newestEventAge` | `number` \| `null` | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:310](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L310) |
| `oldestEventAge` | `number` \| `null` | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L309) |
| `totalEvents` | `number` | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:307](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L307) |
| `uniqueIdentifiers` | `number` | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:308](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L308) |
| `validatedCount` | `number` | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L311) |

##### getValidated()

```ts
getValidated(limit: number): WebhookEvent[];
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L179)

Get all validated events (signature verification passed)

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `limit` | `number` | `50` | Maximum number of events to return |

###### Returns

[`WebhookEvent`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#webhookevent)[]

Array of validated webhook events

##### stopCleanupTask()

```ts
stopCleanupTask(): void;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L278)

Stop automatic cleanup task

###### Returns

`void`

##### store()

```ts
store(event: WebhookEvent): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L70)

Store a webhook event

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `event` | [`WebhookEvent`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#webhookevent) | The webhook event to store |

###### Returns

`boolean`

true if stored successfully, false if duplicate or storage full

##### updateConfig()

```ts
updateConfig(config: Partial<EventStoreConfig>): void;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:351](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L351)

Update configuration (requires restart of cleanup task)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`EventStoreConfig`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#eventstoreconfig)\> |

###### Returns

`void`

## Interfaces

### EventStoreConfig

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L33)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="maxentries"></a> `maxEntries` | `number` | Maximum number of events to store | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L35) |
| <a id="ttlms"></a> `ttlMs` | `number` | Time-to-live for events in milliseconds | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L37) |

***

### WebhookEvent

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L14)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="eventid"></a> `eventId` | `string` | Event ID for deduplication | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L30) |
| <a id="identifier"></a> `identifier` | `string` | Unique payment identifier | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L16) |
| <a id="nonce"></a> `nonce` | `string` | Nonce from X-NONCE header | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L26) |
| <a id="payload"></a> `payload` | `Record`\<`string`, `unknown`\> | Full webhook payload | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L22) |
| <a id="receivedat"></a> `receivedAt` | `Date` | Timestamp when webhook was received | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L20) |
| <a id="signature"></a> `signature` | `string` | HMAC signature from X-SIGNATURE header | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L24) |
| <a id="status"></a> `status` | `string` | Payment status from webhook | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L18) |
| <a id="validated"></a> `validated` | `boolean` | Whether signature validation passed | [defi/protocols/src/vendors/payments/storage/webhook-events.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L28) |

## Functions

### getEventStore()

```ts
function getEventStore(): WebhookEventStore;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:383](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L383)

Get the global event store instance

#### Returns

[`WebhookEventStore`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#webhookeventstore)

#### Throws

Error if not initialized

***

### initializeEventStore()

```ts
function initializeEventStore(config: EventStoreConfig): void;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:368](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L368)

Initialize the global event store

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `config` | [`EventStoreConfig`](/docs/api/defi/protocols/src/vendors/payments/storage/webhook-events.md#eventstoreconfig) | Event store configuration |

#### Returns

`void`

***

### shutdownEventStore()

```ts
function shutdownEventStore(): void;
```

Defined in: [defi/protocols/src/vendors/payments/storage/webhook-events.ts:393](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/storage/webhook-events.ts#L393)

Shutdown the event store (stop cleanup tasks)

#### Returns

`void`
