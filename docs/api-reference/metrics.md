[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / metrics

# metrics

Metrics Collection

Provides metrics collection for observability.
Compatible with Prometheus format.

## Author

nich <nich@nichxbt.com>

## Classes

### Counter

Defined in: [shared/utils/src/metrics/index.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L53)

Counter metric - monotonically increasing value

#### Constructors

##### Constructor

```ts
new Counter(name: string, help: string): Counter;
```

Defined in: [shared/utils/src/metrics/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L58)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `help` | `string` |

###### Returns

[`Counter`](/docs/api/metrics.md#counter)

#### Methods

##### get()

```ts
get(labels?: MetricLabels): number;
```

Defined in: [shared/utils/src/metrics/index.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L75)

Get current value

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) |

###### Returns

`number`

##### inc()

```ts
inc(labels?: MetricLabels, value?: number): void;
```

Defined in: [shared/utils/src/metrics/index.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L66)

Increment counter by value (default 1)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) | `undefined` |
| `value?` | `number` | `1` |

###### Returns

`void`

##### reset()

```ts
reset(labels?: MetricLabels): void;
```

Defined in: [shared/utils/src/metrics/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L82)

Reset counter

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) |

###### Returns

`void`

##### toPrometheus()

```ts
toPrometheus(): string;
```

Defined in: [shared/utils/src/metrics/index.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L93)

Export in Prometheus format

###### Returns

`string`

***

### Gauge

Defined in: [shared/utils/src/metrics/index.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L119)

Gauge metric - value that can go up and down

#### Constructors

##### Constructor

```ts
new Gauge(name: string, help: string): Gauge;
```

Defined in: [shared/utils/src/metrics/index.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L124)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `help` | `string` |

###### Returns

[`Gauge`](/docs/api/metrics.md#gauge)

#### Methods

##### dec()

```ts
dec(labels?: MetricLabels, value?: number): void;
```

Defined in: [shared/utils/src/metrics/index.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L148)

Decrement value

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) | `undefined` |
| `value?` | `number` | `1` |

###### Returns

`void`

##### get()

```ts
get(labels?: MetricLabels): number;
```

Defined in: [shared/utils/src/metrics/index.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L155)

Get current value

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) |

###### Returns

`number`

##### inc()

```ts
inc(labels?: MetricLabels, value?: number): void;
```

Defined in: [shared/utils/src/metrics/index.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L139)

Increment value

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) | `undefined` |
| `value?` | `number` | `1` |

###### Returns

`void`

##### set()

```ts
set(value: number, labels?: MetricLabels): void;
```

Defined in: [shared/utils/src/metrics/index.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L132)

Set value

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `number` |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) |

###### Returns

`void`

##### toPrometheus()

```ts
toPrometheus(): string;
```

Defined in: [shared/utils/src/metrics/index.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L162)

Export in Prometheus format

###### Returns

`string`

***

### Histogram

Defined in: [shared/utils/src/metrics/index.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L190)

Histogram metric - distribution of values

#### Constructors

##### Constructor

```ts
new Histogram(
   name: string, 
   help: string, 
   buckets: number[]): Histogram;
```

Defined in: [shared/utils/src/metrics/index.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L198)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `help` | `string` | `undefined` |
| `buckets` | `number`[] | `DEFAULT_BUCKETS` |

###### Returns

[`Histogram`](/docs/api/metrics.md#histogram)

#### Methods

##### observe()

```ts
observe(value: number, labels?: MetricLabels): void;
```

Defined in: [shared/utils/src/metrics/index.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L207)

Observe a value

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `number` |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) |

###### Returns

`void`

##### startTimer()

```ts
startTimer(labels?: MetricLabels): () => number;
```

Defined in: [shared/utils/src/metrics/index.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L245)

Create a timer that can be stopped later

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) |

###### Returns

```ts
(): number;
```

###### Returns

`number`

##### time()

```ts
time<T>(fn: () => Promise<T>, labels?: MetricLabels): Promise<T>;
```

Defined in: [shared/utils/src/metrics/index.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L233)

Time a function and observe its duration

###### Type Parameters

| Type Parameter |
| :------ |
| `T` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | () => `Promise`\<`T`\> |
| `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) |

###### Returns

`Promise`\<`T`\>

##### toPrometheus()

```ts
toPrometheus(): string;
```

Defined in: [shared/utils/src/metrics/index.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L257)

Export in Prometheus format

###### Returns

`string`

***

### MetricsRegistry

Defined in: [shared/utils/src/metrics/index.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L292)

Central registry for all metrics

#### Constructors

##### Constructor

```ts
new MetricsRegistry(prefix: string): MetricsRegistry;
```

Defined in: [shared/utils/src/metrics/index.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L298)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `prefix` | `string` | `''` |

###### Returns

[`MetricsRegistry`](/docs/api/metrics.md#metricsregistry)

#### Methods

##### counter()

```ts
counter(name: string, help: string): Counter;
```

Defined in: [shared/utils/src/metrics/index.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L305)

Create or get a counter

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `help` | `string` |

###### Returns

[`Counter`](/docs/api/metrics.md#counter)

##### gauge()

```ts
gauge(name: string, help: string): Gauge;
```

Defined in: [shared/utils/src/metrics/index.ts:318](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L318)

Create or get a gauge

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `help` | `string` |

###### Returns

[`Gauge`](/docs/api/metrics.md#gauge)

##### histogram()

```ts
histogram(
   name: string, 
   help: string, 
   buckets?: number[]): Histogram;
```

Defined in: [shared/utils/src/metrics/index.ts:331](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L331)

Create or get a histogram

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `help` | `string` |
| `buckets?` | `number`[] |

###### Returns

[`Histogram`](/docs/api/metrics.md#histogram)

##### reset()

```ts
reset(): void;
```

Defined in: [shared/utils/src/metrics/index.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L363)

Reset all metrics

###### Returns

`void`

##### toPrometheus()

```ts
toPrometheus(): string;
```

Defined in: [shared/utils/src/metrics/index.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L344)

Export all metrics in Prometheus format

###### Returns

`string`

## Interfaces

### CounterMetric

Defined in: [shared/utils/src/metrics/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L28)

#### Extends

- [`Metric`](/docs/api/metrics.md#metric)

#### Properties

| Property | Type | Overrides | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="help"></a> `help` | `string` | - | [`Metric`](/docs/api/metrics.md#metric).[`help`](/docs/api/metrics.md#help-3) | [shared/utils/src/metrics/index.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L24) |
| <a id="labels"></a> `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) | - | [`Metric`](/docs/api/metrics.md#metric).[`labels`](/docs/api/metrics.md#labels-3) | [shared/utils/src/metrics/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L25) |
| <a id="name"></a> `name` | `string` | - | [`Metric`](/docs/api/metrics.md#metric).[`name`](/docs/api/metrics.md#name-3) | [shared/utils/src/metrics/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L22) |
| <a id="type"></a> `type` | `"counter"` | [`Metric`](/docs/api/metrics.md#metric).[`type`](/docs/api/metrics.md#type-3) | - | [shared/utils/src/metrics/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L29) |
| <a id="value"></a> `value` | `number` | - | - | [shared/utils/src/metrics/index.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L30) |

***

### GaugeMetric

Defined in: [shared/utils/src/metrics/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L33)

#### Extends

- [`Metric`](/docs/api/metrics.md#metric)

#### Properties

| Property | Type | Overrides | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="help-1"></a> `help` | `string` | - | [`Metric`](/docs/api/metrics.md#metric).[`help`](/docs/api/metrics.md#help-3) | [shared/utils/src/metrics/index.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L24) |
| <a id="labels-1"></a> `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) | - | [`Metric`](/docs/api/metrics.md#metric).[`labels`](/docs/api/metrics.md#labels-3) | [shared/utils/src/metrics/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L25) |
| <a id="name-1"></a> `name` | `string` | - | [`Metric`](/docs/api/metrics.md#metric).[`name`](/docs/api/metrics.md#name-3) | [shared/utils/src/metrics/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L22) |
| <a id="type-1"></a> `type` | `"gauge"` | [`Metric`](/docs/api/metrics.md#metric).[`type`](/docs/api/metrics.md#type-3) | - | [shared/utils/src/metrics/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L34) |
| <a id="value-1"></a> `value` | `number` | - | - | [shared/utils/src/metrics/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L35) |

***

### HistogramMetric

Defined in: [shared/utils/src/metrics/index.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L38)

#### Extends

- [`Metric`](/docs/api/metrics.md#metric)

#### Properties

| Property | Type | Overrides | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="buckets"></a> `buckets` | `number`[] | - | - | [shared/utils/src/metrics/index.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L40) |
| <a id="count"></a> `count` | `number` | - | - | [shared/utils/src/metrics/index.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L43) |
| <a id="help-2"></a> `help` | `string` | - | [`Metric`](/docs/api/metrics.md#metric).[`help`](/docs/api/metrics.md#help-3) | [shared/utils/src/metrics/index.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L24) |
| <a id="labels-2"></a> `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) | - | [`Metric`](/docs/api/metrics.md#metric).[`labels`](/docs/api/metrics.md#labels-3) | [shared/utils/src/metrics/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L25) |
| <a id="name-2"></a> `name` | `string` | - | [`Metric`](/docs/api/metrics.md#metric).[`name`](/docs/api/metrics.md#name-3) | [shared/utils/src/metrics/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L22) |
| <a id="sum"></a> `sum` | `number` | - | - | [shared/utils/src/metrics/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L42) |
| <a id="type-2"></a> `type` | `"histogram"` | [`Metric`](/docs/api/metrics.md#metric).[`type`](/docs/api/metrics.md#type-3) | - | [shared/utils/src/metrics/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L39) |
| <a id="values"></a> `values` | `number`[] | - | - | [shared/utils/src/metrics/index.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L41) |

***

### Metric

Defined in: [shared/utils/src/metrics/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L21)

#### Extended by

- [`CounterMetric`](/docs/api/metrics.md#countermetric)
- [`GaugeMetric`](/docs/api/metrics.md#gaugemetric)
- [`HistogramMetric`](/docs/api/metrics.md#histogrammetric)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="help-3"></a> `help` | `string` | [shared/utils/src/metrics/index.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L24) |
| <a id="labels-3"></a> `labels?` | [`MetricLabels`](/docs/api/metrics.md#metriclabels-1) | [shared/utils/src/metrics/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L25) |
| <a id="name-3"></a> `name` | `string` | [shared/utils/src/metrics/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L22) |
| <a id="type-3"></a> `type` | [`MetricType`](/docs/api/metrics.md#metrictype-1) | [shared/utils/src/metrics/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L23) |

***

### MetricLabels

Defined in: [shared/utils/src/metrics/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L17)

#### Indexable

```ts
[key: string]: string | number | boolean
```

## Type Aliases

### MetricType

```ts
type MetricType = "counter" | "gauge" | "histogram" | "summary";
```

Defined in: [shared/utils/src/metrics/index.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L15)

## Variables

### activeConnections

```ts
const activeConnections: Gauge;
```

Defined in: [shared/utils/src/metrics/index.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L407)

***

### apiCallDuration

```ts
const apiCallDuration: Histogram;
```

Defined in: [shared/utils/src/metrics/index.ts:392](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L392)

***

### apiCallsTotal

```ts
const apiCallsTotal: Counter;
```

Defined in: [shared/utils/src/metrics/index.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L387)

***

### circuitBreakerState

```ts
const circuitBreakerState: Gauge;
```

Defined in: [shared/utils/src/metrics/index.ts:402](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L402)

***

### errorsTotal

```ts
const errorsTotal: Counter;
```

Defined in: [shared/utils/src/metrics/index.ts:412](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L412)

***

### httpRequestDuration

```ts
const httpRequestDuration: Histogram;
```

Defined in: [shared/utils/src/metrics/index.ts:382](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L382)

***

### httpRequestsTotal

```ts
const httpRequestsTotal: Counter;
```

Defined in: [shared/utils/src/metrics/index.ts:377](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L377)

***

### metrics

```ts
const metrics: MetricsRegistry;
```

Defined in: [shared/utils/src/metrics/index.ts:374](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L374)

***

### rateLimitHits

```ts
const rateLimitHits: Counter;
```

Defined in: [shared/utils/src/metrics/index.ts:397](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L397)

## Functions

### getMetricsHandler()

```ts
function getMetricsHandler(): {
  body: string;
  contentType: string;
};
```

Defined in: [shared/utils/src/metrics/index.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L424)

Get metrics in Prometheus format (for HTTP handler)

#### Returns

```ts
{
  body: string;
  contentType: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `body` | `string` | [shared/utils/src/metrics/index.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L424) |
| `contentType` | `string` | [shared/utils/src/metrics/index.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/metrics/index.ts#L424) |
