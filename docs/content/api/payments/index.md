---
title: "Payments API Reference"
description: "API documentation for payments, x402, and credit system packages"
category: "api"
keywords: ["api", "payments", "x402", "credits", "subscription", "micropayments"]
order: 7
---

# Payments API Reference

Payment packages enable cryptocurrency payments, x402 protocol integration, and credit systems.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/payments-x402` | x402 HTTP payment protocol |
| `@nirholas/payments-processor` | Payment processing |
| `@nirholas/credits-core` | Credit management system |
| `@nirholas/credits-billing` | Billing & subscriptions |
| `@nirholas/credits-usage` | Usage tracking |

---

## x402 Payment Protocol

The x402 package implements the HTTP 402 Payment Required protocol for pay-per-request APIs.

### Installation

```bash
pnpm add @nirholas/payments-x402
```

### Server-Side Integration

#### Express Middleware

```typescript
import express from 'express'
import { createX402Middleware, X402Config } from '@nirholas/payments-x402'

const app = express()

const x402Config: X402Config = {
  facilitator: 'https://facilitator.x402.org',
  payTo: '0xYourWalletAddress',
  network: 'base',
  
  routes: {
    '/api/premium/*': {
      maxAmountRequired: '0.001',   // ETH
      currency: 'ETH',
      description: 'Premium API access',
    },
    '/api/ai/*': {
      maxAmountRequired: '0.10',     // USDC
      currency: 'USDC',
      description: 'AI endpoint access',
    },
  },
}

app.use(createX402Middleware(x402Config))

app.get('/api/premium/data', (req, res) => {
  // This endpoint requires payment
  res.json({ data: 'Premium content' })
})
```

#### Next.js Integration

```typescript
// middleware.ts
import { createX402NextMiddleware } from '@nirholas/payments-x402/next'
import { NextRequest } from 'next/server'

export const config = {
  matcher: '/api/:path*',
}

const x402 = createX402NextMiddleware({
  facilitator: process.env.X402_FACILITATOR_URL!,
  payTo: process.env.PAYMENT_ADDRESS!,
  network: 'base',
})

export function middleware(request: NextRequest) {
  return x402(request)
}
```

### Configuration Options

```typescript
interface X402Config {
  // Required
  facilitator: string           // Facilitator service URL
  payTo: string                 // Wallet address to receive payments
  network: SupportedNetwork     // Blockchain network
  
  // Optional
  routes?: RouteConfig          // Per-route pricing
  defaultPrice?: string         // Default price for all routes
  currency?: 'ETH' | 'USDC'     // Default currency
  testMode?: boolean            // Enable test mode
  
  // Callbacks
  onPaymentReceived?: (payment: Payment) => void
  onPaymentFailed?: (error: PaymentError) => void
  
  // Advanced
  customValidator?: (payment: Payment) => Promise<boolean>
  cachePayments?: boolean
  paymentTimeout?: number       // Seconds
}

type SupportedNetwork = 
  | 'ethereum'
  | 'base'
  | 'arbitrum'
  | 'optimism'
  | 'polygon'
```

### Client-Side Integration

#### Automatic Payment Client

```typescript
import { X402Client } from '@nirholas/payments-x402/client'

const client = new X402Client({
  privateKey: process.env.PRIVATE_KEY!, // Or wallet provider
  network: 'base',
})

// Automatically handles 402 responses
const response = await client.fetch('https://api.example.com/premium/data')
const data = await response.json()
```

#### Manual Payment Flow

```typescript
import { parseX402Challenge, createPayment } from '@nirholas/payments-x402/client'

// 1. Make request, get 402 response
const response = await fetch('https://api.example.com/premium/data')

if (response.status === 402) {
  // 2. Parse payment challenge
  const challenge = parseX402Challenge(response)
  
  // 3. Create and sign payment
  const payment = await createPayment({
    challenge,
    wallet, // ethers/viem wallet
  })
  
  // 4. Retry with payment header
  const paidResponse = await fetch('https://api.example.com/premium/data', {
    headers: {
      'X-402-Payment': payment.signature,
    },
  })
}
```

---

### Payment Types

```typescript
interface Payment {
  id: string
  amount: string
  currency: string
  network: string
  from: string
  to: string
  signature: string
  timestamp: number
  expiresAt: number
  metadata?: Record<string, unknown>
}

interface X402Challenge {
  payTo: string
  amount: string
  currency: string
  network: string
  facilitator: string
  nonce: string
  expiresAt: number
  description?: string
}

interface PaymentReceipt {
  paymentId: string
  transactionHash?: string
  confirmed: boolean
  confirmedAt?: number
}
```

---

## Payment Processor

### Installation

```bash
pnpm add @nirholas/payments-processor
```

### Processor Configuration

```typescript
import { PaymentProcessor } from '@nirholas/payments-processor'

const processor = new PaymentProcessor({
  networks: {
    ethereum: {
      rpcUrl: process.env.ETH_RPC_URL!,
      walletAddress: process.env.ETH_WALLET!,
    },
    base: {
      rpcUrl: process.env.BASE_RPC_URL!,
      walletAddress: process.env.BASE_WALLET!,
    },
  },
  webhookUrl: 'https://your-app.com/webhooks/payments',
  confirmations: {
    ethereum: 12,
    base: 1,
  },
})
```

### Processing Payments

```typescript
// Create payment request
const request = await processor.createPaymentRequest({
  amount: '100.00',
  currency: 'USDC',
  network: 'base',
  metadata: {
    orderId: 'order-123',
    customer: 'customer-456',
  },
  expiresIn: 3600, // 1 hour
})

console.log(request.paymentAddress)
console.log(request.qrCode) // Base64 QR code

// Check payment status
const status = await processor.getPaymentStatus(request.id)
if (status.confirmed) {
  console.log(`Payment confirmed: ${status.transactionHash}`)
}

// List payments
const payments = await processor.listPayments({
  status: 'confirmed',
  startDate: new Date('2024-01-01'),
  limit: 100,
})
```

---

## Credits System

### Installation

```bash
pnpm add @nirholas/credits-core
```

### Credit Manager

```typescript
import { CreditManager } from '@nirholas/credits-core'

const credits = new CreditManager({
  database: process.env.DATABASE_URL!,
  defaultBalance: 100, // Starting credits for new users
})

// Get user balance
const balance = await credits.getBalance(userId)
console.log(`Credits: ${balance.available} / ${balance.pending}`)

// Add credits
await credits.addCredits(userId, 500, {
  reason: 'purchase',
  transactionId: 'tx-123',
})

// Deduct credits
const result = await credits.deductCredits(userId, 10, {
  reason: 'api-usage',
  endpoint: '/api/ai/generate',
})

if (!result.success) {
  throw new Error('Insufficient credits')
}

// Get transaction history
const history = await credits.getHistory(userId, {
  limit: 50,
  type: 'deduction',
})
```

### Credit Types

```typescript
interface CreditBalance {
  userId: string
  available: number
  pending: number
  reserved: number
  lifetime: number
  updatedAt: Date
}

interface CreditTransaction {
  id: string
  userId: string
  type: 'addition' | 'deduction' | 'reservation' | 'release'
  amount: number
  balance: number
  reason: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  currency: string
  bonus?: number
  popular?: boolean
}
```

---

## Billing & Subscriptions

### Installation

```bash
pnpm add @nirholas/credits-billing
```

### Subscription Management

```typescript
import { BillingManager } from '@nirholas/credits-billing'

const billing = new BillingManager({
  database: process.env.DATABASE_URL!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  cryptoProcessor: paymentProcessor,
})

// Create subscription
const subscription = await billing.createSubscription({
  userId: 'user-123',
  planId: 'pro',
  paymentMethod: 'crypto',
  network: 'base',
})

// Get subscription
const sub = await billing.getSubscription(userId)
console.log(`Plan: ${sub.plan.name}`)
console.log(`Status: ${sub.status}`)
console.log(`Next billing: ${sub.nextBillingDate}`)

// Cancel subscription
await billing.cancelSubscription(userId, {
  reason: 'user_requested',
  immediate: false, // Cancel at end of period
})

// Change plan
await billing.changePlan(userId, 'enterprise')
```

### Plan Configuration

```typescript
interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
    currency: string
  }
  credits: {
    monthly: number
    rollover: boolean
    maxRollover?: number
  }
  features: string[]
  limits: {
    apiCalls: number
    storage: number
    teamMembers: number
  }
}

interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: 'active' | 'past_due' | 'canceled' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  nextBillingDate: Date
  canceledAt?: Date
  trialEnd?: Date
}
```

---

## Usage Tracking

### Installation

```bash
pnpm add @nirholas/credits-usage
```

### Usage Tracker

```typescript
import { UsageTracker } from '@nirholas/credits-usage'

const usage = new UsageTracker({
  database: process.env.DATABASE_URL!,
  redis: process.env.REDIS_URL, // Optional for real-time tracking
})

// Track usage event
await usage.track({
  userId: 'user-123',
  event: 'api_call',
  endpoint: '/api/ai/generate',
  credits: 5,
  metadata: {
    model: 'gpt-4',
    tokens: 1500,
  },
})

// Get usage summary
const summary = await usage.getSummary(userId, {
  period: 'month',
  groupBy: 'endpoint',
})

// Get real-time usage
const realtime = await usage.getRealtime(userId)
console.log(`Today: ${realtime.today} credits`)
console.log(`This hour: ${realtime.hour} credits`)

// Check limits
const limits = await usage.checkLimits(userId)
if (limits.exceeded) {
  throw new Error(`Rate limit exceeded: ${limits.reason}`)
}
```

### Usage Types

```typescript
interface UsageEvent {
  id: string
  userId: string
  event: string
  endpoint?: string
  credits: number
  metadata?: Record<string, unknown>
  timestamp: Date
}

interface UsageSummary {
  period: string
  totalCredits: number
  totalEvents: number
  byEndpoint: Record<string, number>
  byEvent: Record<string, number>
  dailyBreakdown: Array<{
    date: string
    credits: number
    events: number
  }>
}

interface UsageLimits {
  exceeded: boolean
  reason?: string
  limits: {
    daily: { current: number; max: number }
    hourly: { current: number; max: number }
    perMinute: { current: number; max: number }
  }
  resetsAt: Date
}
```

---

## Error Types

```typescript
class PaymentError extends Error {
  code: string
}

// x402 errors
class X402ChallengeError extends PaymentError {}
class X402PaymentExpiredError extends PaymentError {}
class X402InvalidSignatureError extends PaymentError {}
class X402InsufficientFundsError extends PaymentError {}

// Credit errors
class InsufficientCreditsError extends PaymentError {}
class CreditTransactionError extends PaymentError {}

// Billing errors
class SubscriptionNotFoundError extends PaymentError {}
class PlanNotFoundError extends PaymentError {}
class PaymentMethodError extends PaymentError {}

// Usage errors
class RateLimitExceededError extends PaymentError {}
class UsageTrackingError extends PaymentError {}
```
