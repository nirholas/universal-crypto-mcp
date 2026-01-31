---
title: "Marketplace API Reference"
description: "API documentation for marketplace, analytics, and service discovery packages"
category: "api"
keywords: ["api", "marketplace", "services", "analytics", "discovery"]
order: 12
---

# Marketplace API Reference

Marketplace packages provide service discovery, usage analytics, and marketplace functionality.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/marketplace-core` | Marketplace infrastructure |
| `@nirholas/marketplace-services` | Service management |
| `@nirholas/marketplace-analytics` | Usage analytics |
| `@nirholas/marketplace-billing` | Marketplace billing |
| `@nirholas/marketplace-discovery` | Service discovery |

---

## Marketplace Core

### Installation

```bash
pnpm add @nirholas/marketplace-core
```

### Configuration

```typescript
import { Marketplace } from '@nirholas/marketplace-core'

const marketplace = new Marketplace({
  database: process.env.DATABASE_URL!,
  redis: process.env.REDIS_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  paymentProcessor: x402Processor,
})
```

### Service Registration

#### registerService

Register a new service in the marketplace.

```typescript
async function registerService(params: ServiceParams): Promise<Service>

interface ServiceParams {
  name: string
  description: string
  category: ServiceCategory
  version: string
  endpoint: string
  pricing: PricingConfig
  documentation?: string
  tags?: string[]
  metadata?: Record<string, unknown>
}

interface Service {
  id: string
  name: string
  slug: string
  description: string
  category: ServiceCategory
  version: string
  endpoint: string
  pricing: PricingConfig
  status: ServiceStatus
  owner: string
  rating: number
  ratingCount: number
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

type ServiceCategory =
  | 'trading'
  | 'market-data'
  | 'defi'
  | 'nft'
  | 'analytics'
  | 'security'
  | 'infrastructure'
  | 'ai'
  | 'other'

type ServiceStatus = 'pending' | 'active' | 'suspended' | 'deprecated'
```

**Example:**

```typescript
const service = await marketplace.registerService({
  name: 'AI Trading Signals',
  description: 'ML-powered trading signals for crypto markets',
  category: 'ai',
  version: '1.0.0',
  endpoint: 'https://api.myservice.com/signals',
  pricing: {
    model: 'per-request',
    price: '0.01',
    currency: 'USDC',
    freeQuota: 100,
  },
  tags: ['trading', 'ai', 'signals', 'machine-learning'],
})
```

#### updateService

Update service configuration.

```typescript
async function updateService(
  serviceId: string,
  updates: Partial<ServiceParams>
): Promise<Service>
```

#### publishService

Publish a service to the marketplace.

```typescript
async function publishService(serviceId: string): Promise<Service>
```

#### deprecateService

Deprecate a service.

```typescript
async function deprecateService(
  serviceId: string,
  options?: DeprecationOptions
): Promise<void>

interface DeprecationOptions {
  reason: string
  replacement?: string       // ID of replacement service
  sunsetDate?: Date
}
```

---

### Pricing Configuration

```typescript
interface PricingConfig {
  model: PricingModel
  price: string
  currency: 'USDC' | 'ETH' | 'credits'
  
  // Per-request pricing
  freeQuota?: number
  
  // Subscription pricing
  interval?: 'monthly' | 'yearly'
  
  // Tiered pricing
  tiers?: PricingTier[]
  
  // Usage-based pricing
  usageMetric?: string
  includedUsage?: number
  overagePrice?: string
}

type PricingModel = 
  | 'free'
  | 'per-request'
  | 'subscription'
  | 'tiered'
  | 'usage-based'

interface PricingTier {
  name: string
  price: string
  features: string[]
  limits?: Record<string, number>
}
```

---

## Service Management

### Installation

```bash
pnpm add @nirholas/marketplace-services
```

### Service Manager

```typescript
import { ServiceManager } from '@nirholas/marketplace-services'

const manager = new ServiceManager({
  marketplace,
  healthCheckInterval: 60000, // 1 minute
})
```

### Service Operations

#### getService

Get service details.

```typescript
async function getService(serviceId: string): Promise<Service>
async function getServiceBySlug(slug: string): Promise<Service>
```

#### listServices

List services with filtering.

```typescript
async function listServices(filters?: ServiceFilters): Promise<ServiceList>

interface ServiceFilters {
  category?: ServiceCategory
  status?: ServiceStatus
  owner?: string
  tags?: string[]
  search?: string
  minRating?: number
  sort?: 'popular' | 'rating' | 'newest' | 'name'
  page?: number
  limit?: number
}

interface ServiceList {
  services: Service[]
  total: number
  page: number
  pages: number
}
```

#### subscribeToService

Subscribe to a service.

```typescript
async function subscribeToService(
  serviceId: string,
  options?: SubscriptionOptions
): Promise<Subscription>

interface SubscriptionOptions {
  tier?: string
  paymentMethod: 'crypto' | 'stripe'
  autoRenew?: boolean
}

interface Subscription {
  id: string
  serviceId: string
  userId: string
  tier: string
  status: 'active' | 'past_due' | 'canceled'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  apiKey: string
  usageQuota: number
  usageUsed: number
}
```

#### getApiKey

Get or regenerate API key for a service.

```typescript
async function getApiKey(serviceId: string): Promise<string>
async function regenerateApiKey(serviceId: string): Promise<string>
```

---

### Service Health

```typescript
// Check service health
const health = await manager.checkHealth(serviceId)

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  latency: number
  lastCheck: Date
  uptime: number // Percentage over last 30 days
  incidents: Incident[]
}

// Subscribe to health updates
manager.onHealthChange(serviceId, (health) => {
  if (health.status === 'unhealthy') {
    notifyTeam(service, health)
  }
})
```

---

## Analytics

### Installation

```bash
pnpm add @nirholas/marketplace-analytics
```

### Analytics Client

```typescript
import { Analytics } from '@nirholas/marketplace-analytics'

const analytics = new Analytics({
  database: process.env.DATABASE_URL!,
  clickhouse: process.env.CLICKHOUSE_URL, // For high-volume analytics
})
```

### Tracking Events

```typescript
// Track API usage
await analytics.trackUsage({
  serviceId: 'service-123',
  userId: 'user-456',
  endpoint: '/api/signals',
  method: 'GET',
  statusCode: 200,
  responseTime: 145,
  credits: 1,
  metadata: {
    symbol: 'BTC',
  },
})

// Track revenue
await analytics.trackRevenue({
  serviceId: 'service-123',
  userId: 'user-456',
  amount: '10.00',
  currency: 'USDC',
  type: 'subscription',
})
```

### Analytics Queries

#### getServiceStats

Get service statistics.

```typescript
async function getServiceStats(
  serviceId: string,
  period?: Period
): Promise<ServiceStats>

interface ServiceStats {
  requests: number
  uniqueUsers: number
  successRate: number
  avgResponseTime: number
  revenue: number
  credits: number
  topEndpoints: EndpointStats[]
  topUsers: UserStats[]
  errorRate: number
}

type Period = 'hour' | 'day' | 'week' | 'month' | 'year'
```

#### getUsageTimeseries

Get time-series usage data.

```typescript
async function getUsageTimeseries(
  serviceId: string,
  options: TimeseriesOptions
): Promise<TimeseriesData>

interface TimeseriesOptions {
  metric: 'requests' | 'users' | 'revenue' | 'errors'
  granularity: 'minute' | 'hour' | 'day' | 'week'
  startDate: Date
  endDate: Date
}

interface TimeseriesData {
  points: Array<{
    timestamp: Date
    value: number
  }>
  total: number
  average: number
  min: number
  max: number
}
```

#### getUserAnalytics

Get user-level analytics.

```typescript
async function getUserAnalytics(userId: string): Promise<UserAnalytics>

interface UserAnalytics {
  totalRequests: number
  totalSpent: number
  servicesUsed: number
  favoriteServices: ServiceUsage[]
  usageByCategory: Record<string, number>
  recentActivity: Activity[]
}
```

---

## Service Discovery

### Installation

```bash
pnpm add @nirholas/marketplace-discovery
```

### Discovery Client

```typescript
import { Discovery } from '@nirholas/marketplace-discovery'

const discovery = new Discovery({
  marketplace,
  cache: redisCache,
  refreshInterval: 300000, // 5 minutes
})
```

### Discovery Operations

#### search

Search for services.

```typescript
async function search(query: SearchQuery): Promise<SearchResults>

interface SearchQuery {
  text?: string
  category?: ServiceCategory
  tags?: string[]
  priceRange?: {
    min?: number
    max?: number
    currency: string
  }
  features?: string[]
  sort?: 'relevance' | 'rating' | 'popular' | 'price'
}

interface SearchResults {
  services: ServiceResult[]
  facets: SearchFacets
  total: number
  took: number // milliseconds
}

interface ServiceResult extends Service {
  score: number
  highlights: Record<string, string[]>
}

interface SearchFacets {
  categories: Array<{ name: string; count: number }>
  tags: Array<{ name: string; count: number }>
  priceRanges: Array<{ range: string; count: number }>
}
```

#### recommend

Get service recommendations.

```typescript
async function recommend(userId: string): Promise<Service[]>

// Get similar services
async function getSimilar(serviceId: string): Promise<Service[]>

// Get trending services
async function getTrending(category?: ServiceCategory): Promise<Service[]>

// Get new services
async function getNew(limit?: number): Promise<Service[]>
```

#### compare

Compare multiple services.

```typescript
async function compare(serviceIds: string[]): Promise<Comparison>

interface Comparison {
  services: Service[]
  features: FeatureComparison[]
  pricing: PricingComparison
  ratings: RatingComparison
  recommendation: string
}
```

---

## Marketplace Billing

### Installation

```bash
pnpm add @nirholas/marketplace-billing
```

### Billing Manager

```typescript
import { MarketplaceBilling } from '@nirholas/marketplace-billing'

const billing = new MarketplaceBilling({
  marketplace,
  paymentProcessor: x402Processor,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  commissionRate: 0.1, // 10%
})
```

### Provider Earnings

```typescript
// Get provider earnings
const earnings = await billing.getProviderEarnings(providerId, {
  period: 'month',
})

interface ProviderEarnings {
  gross: number
  commission: number
  net: number
  pending: number
  paid: number
  currency: string
  transactions: Transaction[]
}

// Request payout
const payout = await billing.requestPayout(providerId, {
  amount: '1000',
  currency: 'USDC',
  destination: '0x...',
  network: 'base',
})

// Get payout history
const payouts = await billing.getPayoutHistory(providerId)
```

### Consumer Billing

```typescript
// Get consumer spending
const spending = await billing.getConsumerSpending(userId, {
  period: 'month',
})

interface ConsumerSpending {
  total: number
  byService: Record<string, number>
  byCategory: Record<string, number>
  transactions: Transaction[]
}

// Get invoices
const invoices = await billing.getInvoices(userId)

// Download invoice PDF
const pdf = await billing.getInvoicePDF(invoiceId)
```

---

## Error Types

```typescript
class MarketplaceError extends Error {
  code: string
}

// Service errors
class ServiceNotFoundError extends MarketplaceError {}
class ServiceValidationError extends MarketplaceError {}
class ServiceAlreadyExistsError extends MarketplaceError {}
class ServiceSuspendedError extends MarketplaceError {}

// Subscription errors
class SubscriptionNotFoundError extends MarketplaceError {}
class SubscriptionExpiredError extends MarketplaceError {}
class QuotaExceededError extends MarketplaceError {}

// Billing errors
class PaymentRequiredError extends MarketplaceError {}
class InsufficientFundsError extends MarketplaceError {}
class PayoutError extends MarketplaceError {}

// Discovery errors
class SearchError extends MarketplaceError {}
class RateLimitError extends MarketplaceError {}
```

---

## Type Exports

```typescript
export type {
  Service,
  ServiceParams,
  ServiceCategory,
  ServiceStatus,
  PricingConfig,
  PricingModel,
  Subscription,
  ServiceHealth,
  ServiceStats,
  SearchQuery,
  SearchResults,
  ProviderEarnings,
  ConsumerSpending,
}
```
