# AGENT 9: API ROUTES IMPLEMENTATION
## 5-Phase Implementation Prompts

---

## PROMPT 1: CORE API INFRASTRUCTURE

**Context:** Build Next.js API routes connecting frontend to MCP tools and backend services.

**Objective:** Create robust API layer with proper routing, validation, and error handling.

**Requirements:**
1. **API Route Structure** (`website-unified/app/api/`)
   ```
   api/
   ├── auth/           # Authentication endpoints
   ├── tools/          # MCP tool execution
   ├── marketplace/    # Marketplace operations
   ├── wallets/        # Wallet operations
   ├── analytics/      # Analytics data
   ├── payments/       # Payment processing
   ├── subscriptions/  # Subscription management
   └── webhooks/       # External webhooks
   ```

2. **Base Route Handler** (`website-unified/lib/api/handler.ts`)
   - Request validation with Zod
   - Error handling middleware
   - Rate limiting
   - Request logging
   - Response formatting
   - CORS configuration
   - Authentication check

3. **API Response Types** (`website-unified/lib/api/types.ts`)
   ```typescript
   interface APIResponse<T> {
     success: boolean;
     data?: T;
     error?: {
       code: string;
       message: string;
       details?: unknown;
     };
     meta?: {
       page?: number;
       total?: number;
       rateLimit?: RateLimitInfo;
     };
   }
   ```

4. **Error Handling** (`website-unified/lib/api/errors.ts`)
   - Custom error classes
   - Error code mapping
   - User-friendly messages
   - Error logging
   - Sentry integration
   - Rate limit errors
   - Validation errors

**Technical Stack:**
- Next.js 14 Route Handlers
- Zod for validation
- Edge runtime where applicable
- TypeScript strict mode
- OpenAPI spec generation

**Deliverables:**
- API route structure
- Base handler utilities
- Error handling system
- Type definitions

---

## PROMPT 2: MCP TOOL EXECUTION ROUTES

**Context:** Create API routes for executing MCP tools from the frontend.

**Objective:** Build secure tool execution endpoints with proper validation and output handling.

**Requirements:**
1. **Tool Execution Endpoint** (`website-unified/app/api/tools/execute/route.ts`)
   ```typescript
   POST /api/tools/execute
   Body: {
     toolId: string;
     parameters: Record<string, unknown>;
     options?: {
       timeout?: number;
       streaming?: boolean;
     };
   }
   Response: {
     success: boolean;
     result: unknown;
     executionTime: number;
     metadata: ExecutionMetadata;
   }
   ```

2. **Tool Catalog Endpoint** (`website-unified/app/api/tools/route.ts`)
   ```typescript
   GET /api/tools
   Query: {
     category?: string;
     search?: string;
     page?: number;
     limit?: number;
   }
   Response: {
     tools: Tool[];
     total: number;
     categories: Category[];
   }
   ```

3. **Tool Details Endpoint** (`website-unified/app/api/tools/[id]/route.ts`)
   ```typescript
   GET /api/tools/[id]
   Response: {
     tool: ToolDetail;
     schema: JSONSchema;
     examples: Example[];
     relatedTools: Tool[];
   }
   ```

4. **Streaming Execution** (`website-unified/app/api/tools/stream/route.ts`)
   - Server-Sent Events for long operations
   - Progress updates
   - Partial results
   - Cancellation support
   - Timeout handling

**Technical Requirements:**
- MCP client connection (packages/core)
- Parameter validation against schema
- Execution timeout management
- Result caching
- Usage tracking

**Deliverables:**
- Tool execution endpoint
- Tool catalog API
- Streaming support
- Execution monitoring

---

## PROMPT 3: MARKETPLACE API ROUTES

**Context:** Build API routes for marketplace operations including services, subscriptions, and providers.

**Objective:** Create complete marketplace API for service discovery and management.

**Requirements:**
1. **Service Discovery** (`website-unified/app/api/marketplace/services/route.ts`)
   ```typescript
   GET /api/marketplace/services
   Query: {
     category?: string;
     priceRange?: string;
     rating?: number;
     search?: string;
     sort?: 'popularity' | 'price' | 'rating' | 'newest';
   }
   Response: {
     services: Service[];
     total: number;
     facets: SearchFacets;
   }
   ```

2. **Provider Endpoints** (`website-unified/app/api/marketplace/provider/`)
   ```typescript
   POST /api/marketplace/provider/register
   GET /api/marketplace/provider/services
   PUT /api/marketplace/provider/services/[id]
   GET /api/marketplace/provider/analytics
   POST /api/marketplace/provider/withdraw
   ```

3. **Subscription Endpoints** (`website-unified/app/api/marketplace/subscriptions/`)
   ```typescript
   POST /api/marketplace/subscriptions/create
   GET /api/marketplace/subscriptions
   PUT /api/marketplace/subscriptions/[id]/cancel
   GET /api/marketplace/subscriptions/[id]/usage
   POST /api/marketplace/subscriptions/[id]/upgrade
   ```

4. **Reputation Endpoints** (`website-unified/app/api/marketplace/reputation/`)
   ```typescript
   GET /api/marketplace/reputation/[provider]
   POST /api/marketplace/reviews
   GET /api/marketplace/reviews/[service]
   POST /api/marketplace/disputes
   ```

**Technical Requirements:**
- Integration with packages/marketplace
- Smart contract reads/writes
- Payment processing integration
- Reputation calculation
- Search indexing

**Deliverables:**
- Service discovery API
- Provider management API
- Subscription lifecycle API
- Reputation system API

---

## PROMPT 4: WALLET & TRANSACTION ROUTES

**Context:** Build API routes for wallet operations and transaction management.

**Objective:** Create secure wallet API for balance checks, transaction building, and history.

**Requirements:**
1. **Balance Endpoints** (`website-unified/app/api/wallets/balance/route.ts`)
   ```typescript
   GET /api/wallets/balance
   Query: {
     address: string;
     chains?: string[];
     tokens?: string[];
   }
   Response: {
     native: Balance[];
     tokens: TokenBalance[];
     nfts: NFTBalance[];
     total: { usd: number };
   }
   ```

2. **Transaction Endpoints** (`website-unified/app/api/wallets/transactions/`)
   ```typescript
   GET /api/wallets/transactions
   POST /api/wallets/transactions/build
   POST /api/wallets/transactions/simulate
   GET /api/wallets/transactions/[hash]
   GET /api/wallets/transactions/pending
   ```

3. **Token Operations** (`website-unified/app/api/wallets/tokens/`)
   ```typescript
   GET /api/wallets/tokens/list
   GET /api/wallets/tokens/prices
   GET /api/wallets/tokens/approvals
   POST /api/wallets/tokens/approve
   POST /api/wallets/tokens/revoke
   ```

4. **Address Book** (`website-unified/app/api/wallets/contacts/`)
   ```typescript
   GET /api/wallets/contacts
   POST /api/wallets/contacts
   PUT /api/wallets/contacts/[id]
   DELETE /api/wallets/contacts/[id]
   POST /api/wallets/contacts/validate
   ```

**Technical Requirements:**
- Multi-chain RPC connections
- Balance aggregation
- Transaction simulation (Tenderly)
- Address validation
- ENS/SNS resolution

**Deliverables:**
- Balance fetching API
- Transaction management API
- Token operations API
- Contact management API

---

## PROMPT 5: ANALYTICS & DATA ROUTES

**Context:** Build API routes for analytics, market data, and reporting.

**Objective:** Create data API for portfolio analytics, market data, and tax reporting.

**Requirements:**
1. **Portfolio Analytics** (`website-unified/app/api/analytics/portfolio/`)
   ```typescript
   GET /api/analytics/portfolio/summary
   GET /api/analytics/portfolio/history
   GET /api/analytics/portfolio/allocation
   GET /api/analytics/portfolio/pnl
   GET /api/analytics/portfolio/transactions
   ```

2. **Market Data** (`website-unified/app/api/analytics/market/`)
   ```typescript
   GET /api/analytics/market/overview
   GET /api/analytics/market/token/[symbol]
   GET /api/analytics/market/trending
   GET /api/analytics/market/screener
   GET /api/analytics/market/prices
   ```

3. **DeFi Analytics** (`website-unified/app/api/analytics/defi/`)
   ```typescript
   GET /api/analytics/defi/positions
   GET /api/analytics/defi/yields
   GET /api/analytics/defi/protocols
   GET /api/analytics/defi/il-calculator
   ```

4. **Tax Reporting** (`website-unified/app/api/analytics/tax/`)
   ```typescript
   GET /api/analytics/tax/summary
   GET /api/analytics/tax/transactions
   POST /api/analytics/tax/generate-report
   GET /api/analytics/tax/cost-basis
   ```

**Technical Requirements:**
- Integration with packages/market-data
- Historical data storage
- Report generation (PDF/CSV)
- Caching for expensive queries
- Rate limiting for external APIs

**Deliverables:**
- Portfolio analytics API
- Market data API
- DeFi analytics API
- Tax reporting API

---

**Integration Notes:**
- All routes use shared auth middleware (Agent 12)
- Database queries via Prisma (Agent 13)
- Real-time via WebSocket routes (Agent 11)
- Payment processing via x402 (Agent 10)
- Rate limiting per user/IP

**Success Criteria:**
- All endpoints properly typed
- Request/response validation
- Comprehensive error handling
- Rate limiting in place
- API documentation generated
- 95%+ test coverage
- < 200ms average response time
