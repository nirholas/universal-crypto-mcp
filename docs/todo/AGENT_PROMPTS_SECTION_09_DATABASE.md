# AGENT 13: DATABASE & PERSISTENCE
## 5-Phase Implementation Prompts

---

## PROMPT 1: DATABASE SCHEMA DESIGN

**Context:** Design comprehensive database schema for all platform data.

**Objective:** Create scalable, normalized database schema supporting all platform features.

**Requirements:**
1. **Core Schema** (`website-unified/prisma/schema.prisma`)
   ```prisma
   // User & Auth
   model User {
     id            String    @id @default(cuid())
     address       String    @unique
     chainId       Int
     createdAt     DateTime  @default(now())
     updatedAt     DateTime  @updatedAt
     
     // Relations
     sessions      Session[]
     apiKeys       APIKey[]
     subscriptions Subscription[]
     payments      Payment[]
     alerts        Alert[]
     contacts      Contact[]
     
     // Profile
     profile       UserProfile?
   }
   
   model Session {
     id        String   @id @default(cuid())
     userId    String
     token     String   @unique
     expiresAt DateTime
     createdAt DateTime @default(now())
     metadata  Json
     
     user      User     @relation(fields: [userId], references: [id])
   }
   
   model APIKey {
     id        String   @id @default(cuid())
     userId    String
     name      String
     keyHash   String   @unique
     prefix    String
     scopes    String[]
     rateLimit Json
     lastUsed  DateTime?
     expiresAt DateTime?
     createdAt DateTime @default(now())
     revokedAt DateTime?
     
     user      User     @relation(fields: [userId], references: [id])
   }
   ```

2. **Marketplace Schema**
   ```prisma
   model Service {
     id          String   @id @default(cuid())
     providerId  String
     name        String
     description String
     category    String
     pricing     Json
     endpoint    String
     status      ServiceStatus
     metadata    Json
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     
     provider      User          @relation(fields: [providerId], references: [id])
     subscriptions Subscription[]
     reviews       Review[]
   }
   
   model Subscription {
     id         String   @id @default(cuid())
     userId     String
     serviceId  String
     tier       String
     status     SubscriptionStatus
     startDate  DateTime
     endDate    DateTime?
     usage      Json
     createdAt  DateTime @default(now())
     
     user       User     @relation(fields: [userId], references: [id])
     service    Service  @relation(fields: [serviceId], references: [id])
   }
   
   model Review {
     id        String   @id @default(cuid())
     userId    String
     serviceId String
     rating    Int
     title     String
     body      String
     createdAt DateTime @default(now())
     
     user      User     @relation(fields: [userId], references: [id])
     service   Service  @relation(fields: [serviceId], references: [id])
   }
   ```

3. **Payment Schema**
   ```prisma
   model Payment {
     id          String   @id @default(cuid())
     userId      String
     amount      Decimal
     token       String
     chain       Int
     status      PaymentStatus
     txHash      String?
     metadata    Json
     createdAt   DateTime @default(now())
     confirmedAt DateTime?
     
     user        User     @relation(fields: [userId], references: [id])
   }
   
   model Invoice {
     id           String   @id @default(cuid())
     userId       String
     subscriptionId String?
     amount       Decimal
     status       InvoiceStatus
     items        Json
     dueDate      DateTime
     paidAt       DateTime?
     createdAt    DateTime @default(now())
   }
   ```

4. **Analytics Schema**
   ```prisma
   model ToolExecution {
     id         String   @id @default(cuid())
     userId     String?
     toolId     String
     parameters Json
     result     Json?
     status     ExecutionStatus
     duration   Int
     createdAt  DateTime @default(now())
   }
   
   model Alert {
     id        String   @id @default(cuid())
     userId    String
     type      AlertType
     config    Json
     status    AlertStatus
     lastTriggered DateTime?
     createdAt DateTime @default(now())
     
     user      User     @relation(fields: [userId], references: [id])
   }
   ```

**Technical Stack:**
- Prisma ORM
- PostgreSQL database
- Redis for caching
- Connection pooling
- TypeScript types generation

**Deliverables:**
- Complete Prisma schema
- Database migrations
- Type definitions
- Seed scripts

---

## PROMPT 2: DATA ACCESS LAYER

**Context:** Build data access layer with repositories and query optimization.

**Objective:** Create efficient, type-safe data access patterns.

**Requirements:**
1. **Base Repository** (`website-unified/lib/db/repository.ts`)
   ```typescript
   abstract class BaseRepository<T, CreateInput, UpdateInput> {
     protected prisma: PrismaClient;
     
     abstract findById(id: string): Promise<T | null>;
     abstract findMany(filters: Filters<T>): Promise<T[]>;
     abstract create(data: CreateInput): Promise<T>;
     abstract update(id: string, data: UpdateInput): Promise<T>;
     abstract delete(id: string): Promise<void>;
     
     // Pagination
     async paginate(
       filters: Filters<T>,
       page: number,
       limit: number
     ): Promise<PaginatedResult<T>>;
     
     // Transaction
     async transaction<R>(
       fn: (tx: PrismaClient) => Promise<R>
     ): Promise<R>;
   }
   ```

2. **User Repository** (`website-unified/lib/db/repositories/userRepository.ts`)
   ```typescript
   class UserRepository extends BaseRepository<User, CreateUserInput, UpdateUserInput> {
     async findByAddress(address: string): Promise<User | null>;
     async findWithSubscriptions(userId: string): Promise<UserWithSubscriptions>;
     async findWithPayments(userId: string, limit?: number): Promise<UserWithPayments>;
     async updateLastLogin(userId: string): Promise<void>;
     async getStats(userId: string): Promise<UserStats>;
   }
   ```

3. **Service Repository** (`website-unified/lib/db/repositories/serviceRepository.ts`)
   ```typescript
   class ServiceRepository extends BaseRepository<Service, CreateServiceInput, UpdateServiceInput> {
     async search(query: ServiceSearchQuery): Promise<SearchResult<Service>>;
     async findByProvider(providerId: string): Promise<Service[]>;
     async findByCategory(category: string): Promise<Service[]>;
     async getPopular(limit: number): Promise<Service[]>;
     async getAnalytics(serviceId: string): Promise<ServiceAnalytics>;
   }
   ```

4. **Query Builder** (`website-unified/lib/db/queryBuilder.ts`)
   ```typescript
   class QueryBuilder<T> {
     where(conditions: WhereConditions<T>): this;
     orderBy(field: keyof T, direction: 'asc' | 'desc'): this;
     include(relations: string[]): this;
     select(fields: (keyof T)[]): this;
     limit(count: number): this;
     offset(count: number): this;
     build(): PrismaQuery;
   }
   ```

**Technical Requirements:**
- Type-safe queries
- Query optimization
- Eager loading strategies
- Soft delete support
- Audit fields

**Deliverables:**
- Base repository pattern
- Domain repositories
- Query builder
- Transaction support

---

## PROMPT 3: CACHING LAYER

**Context:** Implement caching system for performance optimization.

**Objective:** Build multi-level caching with Redis and in-memory options.

**Requirements:**
1. **Cache Manager** (`website-unified/lib/cache/cacheManager.ts`)
   ```typescript
   class CacheManager {
     // Redis client
     private redis: Redis;
     
     // In-memory cache
     private memory: LRUCache<string, unknown>;
     
     // Get with fallback
     async get<T>(
       key: string,
       fallback: () => Promise<T>,
       options?: CacheOptions
     ): Promise<T>;
     
     // Set value
     async set(key: string, value: unknown, ttl?: number): Promise<void>;
     
     // Delete
     async delete(key: string): Promise<void>;
     
     // Pattern delete
     async deletePattern(pattern: string): Promise<void>;
     
     // Cache tags
     async taggedCache(tags: string[]): TaggedCache;
   }
   ```

2. **Cache Strategies** (`website-unified/lib/cache/strategies.ts`)
   ```typescript
   // Read-through cache
   async function readThrough<T>(
     key: string,
     fetcher: () => Promise<T>,
     ttl: number
   ): Promise<T>;
   
   // Write-through cache
   async function writeThrough<T>(
     key: string,
     value: T,
     writer: (value: T) => Promise<void>
   ): Promise<void>;
   
   // Cache-aside pattern
   async function cacheAside<T>(
     key: string,
     fetcher: () => Promise<T>,
     ttl: number
   ): Promise<T>;
   ```

3. **Cache Keys** (`website-unified/lib/cache/keys.ts`)
   ```typescript
   const CacheKeys = {
     user: (id: string) => `user:${id}`,
     userSession: (token: string) => `session:${token}`,
     service: (id: string) => `service:${id}`,
     serviceList: (category: string, page: number) => `services:${category}:${page}`,
     price: (symbol: string) => `price:${symbol}`,
     portfolio: (address: string) => `portfolio:${address}`,
     toolSchema: (toolId: string) => `tool:schema:${toolId}`,
   };
   
   const CacheTTL = {
     session: 3600,        // 1 hour
     user: 300,            // 5 minutes
     service: 60,          // 1 minute
     price: 10,            // 10 seconds
     portfolio: 30,        // 30 seconds
     toolSchema: 86400,    // 24 hours
   };
   ```

4. **Cache Invalidation** (`website-unified/lib/cache/invalidation.ts`)
   ```typescript
   class CacheInvalidator {
     // Invalidate on model change
     async onUserUpdate(userId: string): Promise<void>;
     async onServiceUpdate(serviceId: string): Promise<void>;
     async onPaymentComplete(paymentId: string): Promise<void>;
     
     // Bulk invalidation
     async invalidateCategory(category: string): Promise<void>;
     async invalidateUserCache(userId: string): Promise<void>;
     
     // Event-based invalidation
     subscribe(event: string, handler: InvalidationHandler): void;
   }
   ```

**Technical Requirements:**
- Redis cluster support
- LRU eviction
- TTL management
- Cache warming
- Metrics collection

**Deliverables:**
- Cache manager
- Caching strategies
- Key management
- Invalidation system

---

## PROMPT 4: DATABASE MIGRATIONS & SEEDING

**Context:** Create migration system and seed data for development/testing.

**Objective:** Build reliable migration workflow and comprehensive seed data.

**Requirements:**
1. **Migration Scripts** (`website-unified/prisma/migrations/`)
   ```
   migrations/
   ├── 20260101000000_initial/
   ├── 20260101000001_add_marketplace/
   ├── 20260101000002_add_payments/
   ├── 20260101000003_add_analytics/
   └── 20260101000004_add_audit_logs/
   ```

2. **Seed Data** (`website-unified/prisma/seed.ts`)
   ```typescript
   async function seed() {
     // Create test users
     const users = await seedUsers();
     
     // Create marketplace services
     const services = await seedServices(users);
     
     // Create subscriptions
     await seedSubscriptions(users, services);
     
     // Create sample payments
     await seedPayments(users);
     
     // Create tool executions
     await seedToolExecutions(users);
     
     // Create alerts
     await seedAlerts(users);
   }
   ```

3. **Test Fixtures** (`website-unified/lib/db/fixtures/`)
   ```typescript
   // User fixtures
   export const testUsers: UserFixture[] = [
     {
       address: '0x1234...abcd',
       chainId: 1,
       profile: { name: 'Test User 1' },
     },
     // ... more fixtures
   ];
   
   // Service fixtures
   export const testServices: ServiceFixture[] = [
     {
       name: 'AI Trading Signals',
       category: 'trading',
       pricing: { type: 'subscription', price: '49.99' },
     },
     // ... more fixtures
   ];
   ```

4. **Migration Utilities** (`website-unified/lib/db/migrationUtils.ts`)
   ```typescript
   class MigrationUtils {
     // Safe migration with rollback
     async safeMigrate(migration: Migration): Promise<void>;
     
     // Data migration helpers
     async migrateData<T>(
       source: () => AsyncIterator<T>,
       transform: (item: T) => TransformedItem,
       destination: (items: TransformedItem[]) => Promise<void>,
       batchSize: number
     ): Promise<MigrationReport>;
     
     // Schema validation
     async validateSchema(): Promise<ValidationResult>;
   }
   ```

**Technical Requirements:**
- Reversible migrations
- Zero-downtime migrations
- Data integrity checks
- Seed idempotency
- Environment-specific seeds

**Deliverables:**
- Migration scripts
- Seed data system
- Test fixtures
- Migration utilities

---

## PROMPT 5: DATABASE MONITORING & OPTIMIZATION

**Context:** Implement database monitoring, query optimization, and maintenance.

**Objective:** Build observability and optimization tooling for database operations.

**Requirements:**
1. **Query Monitor** (`website-unified/lib/db/monitoring/queryMonitor.ts`)
   ```typescript
   class QueryMonitor {
     // Log slow queries
     logSlowQuery(query: string, duration: number, params: unknown[]): void;
     
     // Get slow query report
     getSlowQueries(threshold: number, limit: number): SlowQuery[];
     
     // Query statistics
     getQueryStats(): QueryStats;
     
     // N+1 detection
     detectNPlusOne(queries: Query[]): NPlusOneAlert[];
   }
   ```

2. **Connection Pool Monitor** (`website-unified/lib/db/monitoring/poolMonitor.ts`)
   ```typescript
   class PoolMonitor {
     // Get pool stats
     getStats(): PoolStats;
     
     // Check connection health
     healthCheck(): Promise<HealthCheckResult>;
     
     // Connection metrics
     metrics: {
       active: number;
       idle: number;
       waiting: number;
       total: number;
     };
   }
   ```

3. **Query Optimization** (`website-unified/lib/db/optimization/queryOptimizer.ts`)
   ```typescript
   class QueryOptimizer {
     // Analyze query plan
     explain(query: string): Promise<QueryPlan>;
     
     // Suggest indexes
     suggestIndexes(queries: SlowQuery[]): IndexSuggestion[];
     
     // Optimize query
     optimize(query: string): OptimizedQuery;
     
     // Batch operations
     batchInsert<T>(items: T[], batchSize: number): Promise<void>;
     batchUpdate<T>(updates: Update<T>[], batchSize: number): Promise<void>;
   }
   ```

4. **Maintenance Tasks** (`website-unified/lib/db/maintenance/`)
   ```typescript
   // Cleanup old data
   async function cleanupOldSessions(olderThan: Date): Promise<number>;
   async function cleanupOldExecutions(olderThan: Date): Promise<number>;
   async function cleanupExpiredTokens(): Promise<number>;
   
   // Vacuum and analyze
   async function vacuumTables(): Promise<void>;
   async function analyzeStats(): Promise<void>;
   
   // Backup
   async function createBackup(): Promise<BackupResult>;
   async function restoreBackup(backupId: string): Promise<void>;
   ```

**Technical Requirements:**
- Query logging
- Performance metrics
- Index management
- Automated cleanup
- Backup scheduling

**Deliverables:**
- Query monitoring
- Connection pool monitoring
- Optimization tools
- Maintenance jobs

---

**Integration Notes:**
- All data access through repositories
- Cache layer for read-heavy operations
- Audit logging for writes (Agent 12)
- Real-time subscriptions (Agent 11)
- Transaction support for payments (Agent 10)

**Success Criteria:**
- < 50ms average query time
- 99.9% uptime
- Efficient caching hit rate
- Zero data loss
- Automated backups
- Clean migration history
- Comprehensive monitoring
