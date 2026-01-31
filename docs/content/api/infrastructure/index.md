---
title: "Infrastructure API Reference"
description: "API documentation for infrastructure, monitoring, and DevOps packages"
category: "api"
keywords: ["api", "infrastructure", "monitoring", "prometheus", "logging", "health"]
order: 11
---

# Infrastructure API Reference

Infrastructure packages provide monitoring, health checks, logging, and DevOps capabilities.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/infrastructure-monitoring` | Metrics and monitoring |
| `@nirholas/infrastructure-health` | Health check system |
| `@nirholas/infrastructure-logging` | Structured logging |
| `@nirholas/infrastructure-config` | Configuration management |
| `@nirholas/infrastructure-cache` | Caching layer |

---

## Monitoring

### Installation

```bash
pnpm add @nirholas/infrastructure-monitoring
```

### Configuration

```typescript
import { Monitor } from '@nirholas/infrastructure-monitoring'

const monitor = new Monitor({
  serviceName: 'universal-crypto-mcp',
  environment: process.env.NODE_ENV || 'development',
  
  // Prometheus metrics
  prometheus: {
    enabled: true,
    port: 9090,
    path: '/metrics',
  },
  
  // StatsD/Datadog
  statsd: {
    enabled: true,
    host: process.env.STATSD_HOST,
    port: 8125,
    prefix: 'crypto_mcp',
  },
  
  // Default labels
  labels: {
    version: process.env.VERSION || '1.0.0',
    region: process.env.REGION || 'us-east-1',
  },
})
```

### Metrics

#### Counter

Track cumulative values.

```typescript
const requestCounter = monitor.createCounter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labels: ['method', 'path', 'status'],
})

// Increment
requestCounter.inc({ method: 'GET', path: '/api/prices', status: '200' })
requestCounter.inc({ method: 'POST', path: '/api/trade', status: '201' }, 1)
```

#### Gauge

Track values that can go up and down.

```typescript
const activeConnections = monitor.createGauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labels: ['type'],
})

activeConnections.set({ type: 'websocket' }, 42)
activeConnections.inc({ type: 'http' })
activeConnections.dec({ type: 'http' })
```

#### Histogram

Track distributions of values.

```typescript
const responseTime = monitor.createHistogram({
  name: 'http_response_time_seconds',
  help: 'HTTP response time in seconds',
  labels: ['method', 'path'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
})

// Observe values
responseTime.observe({ method: 'GET', path: '/api/prices' }, 0.045)

// Or use timer
const timer = responseTime.startTimer({ method: 'POST', path: '/api/trade' })
await processRequest()
timer() // Records duration
```

#### Summary

Track percentiles over time.

```typescript
const requestSize = monitor.createSummary({
  name: 'http_request_size_bytes',
  help: 'HTTP request size in bytes',
  percentiles: [0.5, 0.9, 0.95, 0.99],
})

requestSize.observe(1024)
```

---

### Express Middleware

```typescript
import express from 'express'
import { createMetricsMiddleware } from '@nirholas/infrastructure-monitoring'

const app = express()

// Add metrics middleware
app.use(createMetricsMiddleware(monitor, {
  excludePaths: ['/health', '/metrics'],
  customLabels: (req) => ({
    user_tier: req.user?.tier || 'anonymous',
  }),
}))

// Expose metrics endpoint
app.get('/metrics', monitor.metricsHandler())
```

---

## Health Checks

### Installation

```bash
pnpm add @nirholas/infrastructure-health
```

### Health Check Configuration

```typescript
import { HealthChecker } from '@nirholas/infrastructure-health'

const health = new HealthChecker({
  serviceName: 'universal-crypto-mcp',
  timeout: 5000,
  interval: 30000,
})
```

### Registering Checks

```typescript
// Database check
health.register({
  name: 'database',
  check: async () => {
    await db.query('SELECT 1')
    return { status: 'healthy' }
  },
  critical: true,
  timeout: 3000,
})

// Redis check
health.register({
  name: 'redis',
  check: async () => {
    const pong = await redis.ping()
    return { 
      status: pong === 'PONG' ? 'healthy' : 'unhealthy',
      latency: await redis.latency(),
    }
  },
  critical: true,
})

// External API check
health.register({
  name: 'coingecko',
  check: async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/ping')
    return {
      status: response.ok ? 'healthy' : 'degraded',
      responseTime: response.headers.get('x-response-time'),
    }
  },
  critical: false,
})

// Disk space check
health.register({
  name: 'disk',
  check: async () => {
    const { available, total } = await checkDiskSpace('/')
    const percentFree = (available / total) * 100
    return {
      status: percentFree > 10 ? 'healthy' : 'unhealthy',
      percentFree: percentFree.toFixed(2),
    }
  },
  critical: false,
})
```

### Health Check Types

```typescript
interface HealthCheck {
  name: string
  check: () => Promise<HealthResult>
  critical?: boolean          // Affects overall status
  timeout?: number
  interval?: number           // Override global interval
  tags?: string[]
}

interface HealthResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  message?: string
  details?: Record<string, unknown>
  duration?: number
}

interface HealthReport {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: Date
  version: string
  uptime: number
  checks: Record<string, HealthResult>
}
```

### Express Integration

```typescript
import express from 'express'
import { createHealthMiddleware } from '@nirholas/infrastructure-health'

const app = express()

// Liveness probe (basic)
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Readiness probe (full checks)
app.get('/health/ready', createHealthMiddleware(health, {
  detailed: false,
}))

// Detailed health (internal use)
app.get('/health', createHealthMiddleware(health, {
  detailed: true,
  includeMetrics: true,
}))
```

---

## Logging

### Installation

```bash
pnpm add @nirholas/infrastructure-logging
```

### Logger Configuration

```typescript
import { Logger } from '@nirholas/infrastructure-logging'

const logger = new Logger({
  service: 'universal-crypto-mcp',
  level: process.env.LOG_LEVEL || 'info',
  
  // Output format
  format: 'json', // or 'pretty' for development
  
  // Output destinations
  transports: [
    { type: 'console' },
    { 
      type: 'file',
      path: '/var/log/app.log',
      rotate: true,
      maxSize: '100M',
      maxFiles: 7,
    },
    {
      type: 'elasticsearch',
      node: process.env.ELASTICSEARCH_URL,
      index: 'logs-crypto-mcp',
    },
  ],
  
  // Default metadata
  defaultMeta: {
    version: process.env.VERSION,
    environment: process.env.NODE_ENV,
    host: os.hostname(),
  },
})
```

### Logging Methods

```typescript
// Basic logging
logger.debug('Debug message', { data: 'value' })
logger.info('User logged in', { userId: '123' })
logger.warn('Rate limit approaching', { current: 90, max: 100 })
logger.error('Database connection failed', { error: err })

// With structured context
const requestLogger = logger.child({
  requestId: req.id,
  userId: req.user?.id,
})

requestLogger.info('Processing request', { path: req.path })
requestLogger.error('Request failed', { error: err.message })

// Performance logging
const timer = logger.startTimer()
await processRequest()
timer.done('Request processed', { path: '/api/data' })

// Transaction logging
const txLogger = logger.transaction('trade-execution')
txLogger.step('validated', { orderId: '123' })
txLogger.step('submitted', { txHash: '0x...' })
txLogger.complete({ status: 'confirmed' })
// or txLogger.fail(error)
```

### Log Levels

```typescript
type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

// Level configuration
logger.setLevel('debug') // Show debug and above
logger.setLevel('warn')  // Show warn and above only
```

### Express Middleware

```typescript
import { createLoggingMiddleware } from '@nirholas/infrastructure-logging'

app.use(createLoggingMiddleware(logger, {
  excludePaths: ['/health', '/metrics'],
  includeBody: true,
  redactFields: ['password', 'apiKey', 'secret'],
  slowRequestThreshold: 1000,
}))
```

---

## Configuration

### Installation

```bash
pnpm add @nirholas/infrastructure-config
```

### Configuration Management

```typescript
import { Config } from '@nirholas/infrastructure-config'

const config = new Config({
  sources: [
    { type: 'env' },                    // Environment variables
    { type: 'file', path: './config.json' },
    { type: 'file', path: './config.local.json', optional: true },
    { type: 'vault', url: process.env.VAULT_URL, token: process.env.VAULT_TOKEN },
  ],
  
  // Schema validation
  schema: {
    type: 'object',
    properties: {
      port: { type: 'number', default: 3000 },
      database: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          poolSize: { type: 'number', default: 10 },
        },
        required: ['url'],
      },
    },
    required: ['database'],
  },
})

await config.load()
```

### Accessing Configuration

```typescript
// Get values
const port = config.get<number>('port')
const dbUrl = config.get<string>('database.url')

// With defaults
const timeout = config.get<number>('timeout', 5000)

// Required values (throws if missing)
const apiKey = config.getRequired<string>('apiKey')

// Type-safe access
interface AppConfig {
  port: number
  database: {
    url: string
    poolSize: number
  }
}

const appConfig = config.getAll<AppConfig>()

// Watch for changes
config.on('change', (key, value, oldValue) => {
  logger.info('Config changed', { key, value, oldValue })
})
```

---

## Caching

### Installation

```bash
pnpm add @nirholas/infrastructure-cache
```

### Cache Configuration

```typescript
import { Cache } from '@nirholas/infrastructure-cache'

const cache = new Cache({
  // In-memory cache
  memory: {
    enabled: true,
    maxSize: 1000,
    ttl: 60, // seconds
  },
  
  // Redis cache
  redis: {
    enabled: true,
    url: process.env.REDIS_URL!,
    keyPrefix: 'crypto-mcp:',
    ttl: 300,
  },
  
  // Two-tier caching (memory -> redis)
  multilevel: true,
})
```

### Cache Operations

```typescript
// Basic operations
await cache.set('user:123', userData, { ttl: 3600 })
const user = await cache.get<User>('user:123')
await cache.del('user:123')

// Get or fetch pattern
const prices = await cache.getOrFetch(
  'prices:btc',
  async () => {
    return await fetchBTCPrice()
  },
  { ttl: 60 }
)

// Batch operations
await cache.mset({
  'price:btc': 50000,
  'price:eth': 3000,
}, { ttl: 60 })

const prices = await cache.mget(['price:btc', 'price:eth'])

// Cache invalidation
await cache.invalidate('prices:*')  // Pattern-based
await cache.clear()                  // Clear all

// Cache stats
const stats = cache.getStats()
console.log(`Hit rate: ${stats.hitRate}%`)
```

### Decorators (TypeScript)

```typescript
import { Cacheable, CacheEvict } from '@nirholas/infrastructure-cache'

class PriceService {
  @Cacheable({ key: 'price:#{symbol}', ttl: 60 })
  async getPrice(symbol: string): Promise<number> {
    return await fetchPrice(symbol)
  }
  
  @CacheEvict({ keys: ['price:#{symbol}', 'prices:all'] })
  async updatePrice(symbol: string, price: number): Promise<void> {
    await savePrice(symbol, price)
  }
}
```

---

## Error Types

```typescript
class InfrastructureError extends Error {
  code: string
}

// Monitoring errors
class MetricsError extends InfrastructureError {}
class MetricNotFoundError extends InfrastructureError {}

// Health check errors
class HealthCheckError extends InfrastructureError {}
class HealthCheckTimeoutError extends InfrastructureError {}

// Logging errors
class LoggingError extends InfrastructureError {}
class TransportError extends InfrastructureError {}

// Config errors
class ConfigError extends InfrastructureError {}
class ConfigValidationError extends InfrastructureError {}
class ConfigSourceError extends InfrastructureError {}

// Cache errors
class CacheError extends InfrastructureError {}
class CacheConnectionError extends InfrastructureError {}
class CacheSerializationError extends InfrastructureError {}
```

---

## Type Exports

```typescript
export type {
  // Monitoring
  Counter,
  Gauge,
  Histogram,
  Summary,
  MetricsMiddlewareOptions,
  
  // Health
  HealthCheck,
  HealthResult,
  HealthReport,
  
  // Logging
  Logger,
  LogLevel,
  LogEntry,
  
  // Config
  ConfigSource,
  ConfigSchema,
  
  // Cache
  CacheOptions,
  CacheStats,
}
```
