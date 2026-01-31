# System Architecture

## Overview

The Universal Crypto MCP Gateway is a multi-layered architecture that provides a unified API gateway for 20+ cryptocurrency MCP servers with integrated x402 crypto payment processing.

## High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        Clients                             │
│   (AI Agents, Web Apps, Mobile Apps, CLI Tools)           │
└───────────────────────┬────────────────────────────────────┘
                        │ HTTPS
                        │
┌───────────────────────▼────────────────────────────────────┐
│                 Reverse Proxy / CDN                        │
│              (Nginx, Cloudflare, Vercel)                   │
└───────────────────────┬────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│              Universal Crypto MCP Gateway                  │
│                    (Port 3000)                             │
│                                                            │
│  ┌──────────────────────────────────────────────────┐     │
│  │           Middleware Stack                       │     │
│  │  • Request Logger                                │     │
│  │  • CORS Handler                                  │     │
│  │  • Security Headers (Helmet)                     │     │
│  │  • Body Parser                                   │     │
│  │  • Compression                                   │     │
│  │  • Metrics Collector                             │     │
│  └──────────────────┬───────────────────────────────┘     │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐     │
│  │        x402 Payment Gateway                      │     │
│  │  • Signature Verification (EIP-191)              │     │
│  │  • Balance Checking                              │     │
│  │  • Payment Settlement                            │     │
│  │  • Receipt Generation                            │     │
│  └──────────────────┬───────────────────────────────┘     │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐     │
│  │         Rate Limiter                             │     │
│  │  • Free Tier: 10 req/min                         │     │
│  │  • Paid Tier: Unlimited                          │     │
│  │  • Redis-backed (optional)                       │     │
│  └──────────────────┬───────────────────────────────┘     │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐     │
│  │       Endpoint Registry                          │     │
│  │  • Route Matching                                │     │
│  │  • Parameter Validation                          │     │
│  │  • Method Dispatch                               │     │
│  └──────────────────┬───────────────────────────────┘     │
│                     │                                      │
│  ┌──────────────────▼───────────────────────────────┐     │
│  │         MCP Manager                              │     │
│  │  • Process Management                            │     │
│  │  • JSON-RPC Communication                        │     │
│  │  • Health Monitoring                             │     │
│  │  • Auto-restart                                  │     │
│  └──────────────────┬───────────────────────────────┘     │
│                     │                                      │
└─────────────────────┼──────────────────────────────────────┘
                      │
        ┌─────────────┼──────────────┐
        │             │              │
┌───────▼──────┐ ┌───▼──────┐ ┌────▼──────┐
│  DeFi MCP    │ │ Market   │ │ Wallets   │
│  Servers     │ │ Data MCP │ │ MCP       │
│  (7 servers) │ │ Servers  │ │ Servers   │
│              │ │(3 servers)│ │(3 servers)│
└──────────────┘ └──────────┘ └───────────┘
                      ...
        (20 MCP Server Processes)
```

## Component Details

### 1. Express Gateway Layer

**Responsibilities:**
- HTTP request/response handling
- Middleware orchestration
- Error handling
- Health checks

**Key Files:**
- `src/gateway/index.ts` - Main gateway class
- `src/gateway/config.ts` - Configuration management

**Technologies:**
- Express.js 4.x
- TypeScript 5.x
- Node.js 20+

### 2. x402 Payment Gateway

**Responsibilities:**
- Payment verification
- EIP-191 signature validation
- On-chain balance checking
- Payment settlement via facilitator
- 402 Payment Required responses

**Key Files:**
- `src/gateway/x402-gateway.ts` - Payment verification logic
- Token addresses and chain configs

**Flow:**
```
1. Request arrives with/without payment proof
2. If endpoint requires payment:
   a. Check for X-Payment-Proof header
   b. Verify signature against expected payer
   c. Validate payment amount
   d. Settle with facilitator
3. If payment valid: continue
4. If payment invalid/missing: return 402 with payment request
```

### 3. MCP Manager

**Responsibilities:**
- Spawn and manage MCP server processes
- Handle JSON-RPC communication
- Monitor server health
- Auto-restart failed servers

**Key Files:**
- `src/gateway/mcp-manager.ts` - Server lifecycle management
- `src/gateway/mcp-servers.config.ts` - Server configurations

**Process Model:**
```
MCPManager
├── MCPServerInstance (Aave)
│   └── ChildProcess (node dist/index.js)
├── MCPServerInstance (Uniswap)
│   └── ChildProcess (node dist/index.js)
└── MCPServerInstance (CoinGecko)
    └── ChildProcess (node dist/index.js)
    ... (17 more)
```

**Communication:**
- Parent → Child: JSON-RPC via stdin
- Child → Parent: JSON-RPC via stdout
- Logs: stderr

### 4. Endpoint Registry

**Responsibilities:**
- Route registration
- Path matching
- Tool discovery
- Request forwarding

**Key Files:**
- `src/gateway/endpoints.ts` - Route definitions

**Methods:**
- `forwardTo(serverId, method, params)` - Forward to specific server
- `executeMCPTool(toolName, params)` - Execute tool by name
- `listMCPTools()` - List all available tools
- `streamMCP(req, res)` - SSE streaming

### 5. Monitoring & Observability

**Prometheus Metrics:**
```typescript
// Counter metrics
http_requests_total{method, path, status}
x402_payments_total{status}
mcp_tool_calls_total{server, tool}

// Histogram metrics
http_request_duration_seconds
mcp_tool_duration_seconds

// Gauge metrics
mcp_servers_active
mcp_servers_failed
```

**Health Checks:**
- `/health` - Overall system health
- `/ready` - Readiness for traffic
- `/live` - Process liveness

### 6. Rate Limiting

**Implementation:**
- In-memory rate limiter (development)
- Redis-backed limiter (production)
- Token bucket algorithm

**Tiers:**
```typescript
FREE_TIER: {
  window: 60_000,  // 1 minute
  max: 10          // 10 requests
}

PAID_TIER: {
  unlimited: true  // No rate limit with valid payment
}
```

## Data Flow

### Typical Request Flow

```
1. Client sends request
   ↓
2. Express middleware stack
   - CORS check
   - Body parsing
   - Request ID generation
   - Logging
   ↓
3. x402 payment check
   - If free endpoint: continue
   - If paid endpoint:
     * Verify payment proof
     * Settle with facilitator
     * Continue or return 402
   ↓
4. Rate limiting
   - Check Redis/memory
   - Allow or reject
   ↓
5. Endpoint registry
   - Match route
   - Extract params
   ↓
6. MCP Manager
   - Select server
   - Send JSON-RPC request
   - Wait for response
   ↓
7. Response formatting
   - Add headers
   - Record metrics
   - Return to client
```

### x402 Payment Flow

```
1. Client makes request without payment
   ↓
2. Gateway returns 402 Payment Required
   {
     "error": "Payment required",
     "payment": {
       "amount": "0.001",
       "token": "USDC",
       "network": "base",
       "recipient": "0xB1314...",
       "validUntil": 1738368000
     }
   }
   ↓
3. Client creates payment transaction
   ↓
4. Client signs payment proof (EIP-191)
   ↓
5. Client retries request with headers:
   X-Payment-Proof: 0x1234...
   X-Payment-Token: USDC
   X-Payment-Chain: base
   X-Payment-Address: 0xABCD...
   ↓
6. Gateway verifies signature
   ↓
7. Gateway settles with facilitator
   ↓
8. Request proceeds
```

## Deployment Topologies

### Single Server (Development)

```
┌─────────────────────┐
│   Gateway Process   │
│   ├── Express       │
│   ├── 20 MCP        │
│   │   Child         │
│   │   Processes     │
│   └── Redis (opt)   │
└─────────────────────┘
```

### Production (Docker/K8s)

```
┌─────────────┐
│  Load       │
│  Balancer   │
└──────┬──────┘
       │
   ┌───┴────┬────────┬────────┐
   │        │        │        │
┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐
│Gate │  │Gate │  │Gate │  │Gate │
│ Pod │  │ Pod │  │ Pod │  │ Pod │
└──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
   │        │        │        │
   └────────┴────────┴────────┘
            │
      ┌─────▼─────┐
      │   Redis   │
      │  Cluster  │
      └───────────┘
```

### Serverless (Vercel)

```
┌──────────────┐
│  Edge CDN    │
└──────┬───────┘
       │
┌──────▼───────┐
│  Serverless  │
│  Functions   │
│  (Gateway)   │
└──────┬───────┘
       │
┌──────▼───────┐
│  External    │
│  MCP Servers │
│  (Separate   │
│   Deploy)    │
└──────────────┘
```

## Security Architecture

### Defense in Depth

```
Layer 1: Network
├── DDoS Protection (Cloudflare)
├── Rate Limiting (Edge + App)
└── IP Whitelisting (Optional)

Layer 2: Application
├── CORS Validation
├── Helmet Security Headers
├── Input Validation (Zod)
└── Request Size Limits

Layer 3: Authentication
├── x402 Payment Verification
├── Signature Validation (EIP-191)
└── API Keys (Optional)

Layer 4: Authorization
├── Rate Limits by Tier
├── Endpoint Access Control
└── Payment Verification

Layer 5: Data
├── No PII Storage
├── Payment Proofs Only
└── Encrypted Env Variables
```

## Scalability Patterns

### Horizontal Scaling
- Stateless gateway design
- Shared Redis for rate limiting
- MCP servers can be external

### Vertical Scaling
- Process-based MCP servers
- Node.js cluster mode
- Increase MCP server count

### Caching Strategy
- Response caching (optional)
- Redis cache layer
- CDN caching for static responses

## Error Handling

### Error Propagation

```
MCP Server Error
    ↓
MCP Manager catches
    ↓
Logs to monitoring
    ↓
Returns sanitized error
    ↓
Gateway formats response
    ↓
Client receives error
```

### Error Categories

1. **4xx Client Errors**
   - 400 Bad Request
   - 402 Payment Required
   - 404 Not Found
   - 429 Too Many Requests

2. **5xx Server Errors**
   - 500 Internal Server Error
   - 502 Bad Gateway (MCP server down)
   - 503 Service Unavailable
   - 504 Gateway Timeout

## Performance Considerations

### Latency Budget

```
Total Request Time: < 1000ms
├── Network: 50ms
├── x402 Verification: 100ms
├── Rate Limit Check: 10ms
├── MCP Server Processing: 500ms
└── Response Formatting: 50ms
```

### Optimization Techniques

1. **Connection Pooling**
   - Redis connection pool
   - HTTP keep-alive

2. **Streaming**
   - SSE for long-running operations
   - Chunked transfer encoding

3. **Parallel Processing**
   - Multiple MCP server calls
   - Async/await patterns

4. **Caching**
   - Response caching
   - Tool schema caching

