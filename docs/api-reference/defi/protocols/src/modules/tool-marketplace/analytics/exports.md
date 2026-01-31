[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/analytics/exports

# defi/protocols/src/modules/tool-marketplace/analytics/exports

## Classes

### ExportReportingService

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L142)

Export & Reporting Service

#### Constructors

##### Constructor

```ts
new ExportReportingService(): ExportReportingService;
```

###### Returns

[`ExportReportingService`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportreportingservice)

#### Methods

##### createScheduledReport()

```ts
createScheduledReport(config: Omit<ScheduledReportConfig, "id" | "nextScheduled">): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L284)

Create a scheduled report

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Omit`\<[`ScheduledReportConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#scheduledreportconfig), `"id"` \| `"nextScheduled"`\> |

###### Returns

`string`

##### deleteScheduledReport()

```ts
deleteScheduledReport(id: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:316](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L316)

Delete a scheduled report

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |

###### Returns

`void`

##### deleteWebhook()

```ts
deleteWebhook(id: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:459](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L459)

Delete a webhook

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |

###### Returns

`void`

##### exportCreatorDashboard()

```ts
exportCreatorDashboard(
   creatorAddress: `0x${string}`, 
   periodDays: number, 
format: ExportFormat): Promise<string>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L215)

Export creator dashboard

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `creatorAddress` | `` `0x${string}` `` |
| `periodDays` | `number` |
| `format` | [`ExportFormat`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportformat) |

###### Returns

`Promise`\<`string`\>

##### exportPlatformOverview()

```ts
exportPlatformOverview(periodDays: number, format: ExportFormat): Promise<string>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L259)

Export platform overview

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `periodDays` | `number` |
| `format` | [`ExportFormat`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportformat) |

###### Returns

`Promise`\<`string`\>

##### exportTimeSeries()

```ts
exportTimeSeries(
   metricName: string, 
   startTime: number, 
   endTime: number, 
   granularity: Granularity, 
   format: ExportFormat): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L176)

Export time series data

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `metricName` | `string` |
| `startTime` | `number` |
| `endTime` | `number` |
| `granularity` | [`Granularity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#granularity-2) |
| `format` | [`ExportFormat`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportformat) |

###### Returns

`string`

##### exportToolInsights()

```ts
exportToolInsights(
   toolId: string, 
   periodDays: number, 
format: ExportFormat): Promise<string>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L237)

Export tool insights

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `periodDays` | `number` |
| `format` | [`ExportFormat`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportformat) |

###### Returns

`Promise`\<`string`\>

##### getPrometheusMetrics()

```ts
getPrometheusMetrics(): Promise<string>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:527](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L527)

Get metrics in Prometheus format

###### Returns

`Promise`\<`string`\>

##### handleMetricsEndpoint()

```ts
handleMetricsEndpoint(): Promise<{
  body: string;
  contentType: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:582](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L582)

Get metrics endpoint (for Grafana/Prometheus scraping)

###### Returns

`Promise`\<\{
  `body`: `string`;
  `contentType`: `string`;
\}\>

##### listScheduledReports()

```ts
listScheduledReports(): ScheduledReportConfig[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:323](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L323)

List all scheduled reports

###### Returns

[`ScheduledReportConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#scheduledreportconfig)[]

##### listWebhooks()

```ts
listWebhooks(): WebhookConfig[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:466](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L466)

List all webhooks

###### Returns

[`WebhookConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookconfig)[]

##### registerWebhook()

```ts
registerWebhook(config: Omit<WebhookConfig, "id">): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:436](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L436)

Register a webhook

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Omit`\<[`WebhookConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookconfig), `"id"`\> |

###### Returns

`string`

##### sendToWebhook()

```ts
sendToWebhook(url: string, event: WebhookEvent): Promise<boolean>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:473](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L473)

Send event to a webhook URL

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `url` | `string` |
| `event` | [`WebhookEvent`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookevent) |

###### Returns

`Promise`\<`boolean`\>

##### startScheduler()

```ts
startScheduler(intervalMs: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L148)

Start the report scheduler

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `intervalMs` | `number` | `60000` |

###### Returns

`void`

##### stopScheduler()

```ts
stopScheduler(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L161)

Stop the report scheduler

###### Returns

`void`

##### triggerEvent()

```ts
triggerEvent(event: WebhookEvent): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:511](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L511)

Trigger event to all relevant webhooks

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`WebhookEvent`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookevent) |

###### Returns

`Promise`\<`void`\>

##### updateScheduledReport()

```ts
updateScheduledReport(id: string, updates: Partial<ScheduledReportConfig>): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L303)

Update a scheduled report

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |
| `updates` | `Partial`\<[`ScheduledReportConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#scheduledreportconfig)\> |

###### Returns

`void`

##### updateWebhook()

```ts
updateWebhook(id: string, updates: Partial<WebhookConfig>): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:447](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L447)

Update a webhook

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |
| `updates` | `Partial`\<[`WebhookConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookconfig)\> |

###### Returns

`void`

## Interfaces

### ScheduledReportConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L23)

Scheduled report configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="emails"></a> `emails` | `string`[] | Email recipients | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L35) |
| <a id="enabled"></a> `enabled` | `boolean` | Enabled status | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L41) |
| <a id="format"></a> `format` | [`ExportFormat`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportformat) | Export format | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L39) |
| <a id="frequency"></a> `frequency` | `"daily"` \| `"weekly"` \| `"monthly"` | Schedule frequency | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L33) |
| <a id="id"></a> `id` | `string` | Report ID | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L25) |
| <a id="lastsent"></a> `lastSent?` | `number` | Last sent timestamp | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L43) |
| <a id="name"></a> `name` | `string` | Report name | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L27) |
| <a id="nextscheduled"></a> `nextScheduled` | `number` | Next scheduled timestamp | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L45) |
| <a id="target"></a> `target?` | `string` | Target (tool ID or creator address) | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L31) |
| <a id="type"></a> `type` | `"creator_dashboard"` \| `"tool_insights"` \| `"platform_overview"` | Report type | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L29) |
| <a id="webhooks"></a> `webhooks` | `string`[] | Webhook URLs | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L37) |

***

### WebhookConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L51)

Webhook configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="enabled-1"></a> `enabled` | `boolean` | Enabled status | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L61) |
| <a id="events"></a> `events` | [`WebhookEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookeventtype-1)[] | Event types to send | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L57) |
| <a id="id-1"></a> `id` | `string` | Webhook ID | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L53) |
| <a id="retrypolicy"></a> `retryPolicy` | \{ `backoffMs`: `number`; `maxRetries`: `number`; \} | Retry configuration | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L63) |
| `retryPolicy.backoffMs` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L65) |
| `retryPolicy.maxRetries` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L64) |
| <a id="secret"></a> `secret?` | `string` | Secret for HMAC signing | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L59) |
| <a id="url"></a> `url` | `string` | Webhook URL | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L55) |

***

### WebhookEvent

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L83)

Webhook event payload

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="data"></a> `data` | `Record`\<`string`, `unknown`\> | Event data | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L89) |
| <a id="timestamp"></a> `timestamp` | `number` | Event timestamp | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L87) |
| <a id="type-1"></a> `type` | [`WebhookEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookeventtype-1) | Event type | [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L85) |

## Type Aliases

### ExportFormat

```ts
type ExportFormat = "csv" | "json" | "prometheus";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L18)

Export format types

***

### WebhookEventType

```ts
type WebhookEventType = 
  | "revenue_threshold"
  | "usage_spike"
  | "anomaly_detected"
  | "churn_risk"
  | "daily_summary"
  | "weekly_summary";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L72)

Webhook event types

## Variables

### exportReporting

```ts
const exportReporting: ExportReportingService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/exports.ts:743](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/exports.ts#L743)
