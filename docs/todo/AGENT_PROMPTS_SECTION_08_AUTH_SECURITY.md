# AGENT 12: AUTH & SECURITY SYSTEM
## 5-Phase Implementation Prompts

---

## PROMPT 1: WALLET-BASED AUTHENTICATION

**Context:** Implement secure wallet-based authentication system (Sign-In with Ethereum/Solana).

**Objective:** Build Web3 native authentication with session management.

**Requirements:**
1. **SIWE Implementation** (`website-unified/lib/auth/siwe.ts`)
   ```typescript
   class SIWEAuth {
     // Generate nonce
     generateNonce(): string;
     
     // Create sign-in message
     createMessage(params: SIWEParams): SiweMessage;
     
     // Verify signature
     verifySignature(message: string, signature: string): Promise<{
       valid: boolean;
       address: string;
       chainId: number;
     }>;
     
     // Create session
     createSession(address: string, chainId: number): Promise<Session>;
   }
   ```

2. **Solana Sign-In** (`website-unified/lib/auth/solanaAuth.ts`)
   ```typescript
   class SolanaAuth {
     // Generate message
     createMessage(publicKey: PublicKey, domain: string): string;
     
     // Verify signature
     verifySignature(message: string, signature: Uint8Array, publicKey: PublicKey): boolean;
     
     // Create session
     createSession(publicKey: string): Promise<Session>;
   }
   ```

3. **Auth API Routes** (`website-unified/app/api/auth/`)
   ```typescript
   // GET /api/auth/nonce - Get nonce for signing
   // POST /api/auth/verify - Verify signature and create session
   // GET /api/auth/session - Get current session
   // POST /api/auth/logout - Destroy session
   // POST /api/auth/refresh - Refresh session token
   ```

4. **Session Management** (`website-unified/lib/auth/session.ts`)
   ```typescript
   class SessionManager {
     // Create session
     create(userId: string, metadata: SessionMetadata): Promise<Session>;
     
     // Validate session
     validate(token: string): Promise<Session | null>;
     
     // Refresh session
     refresh(token: string): Promise<Session>;
     
     // Revoke session
     revoke(sessionId: string): Promise<void>;
     
     // Get all user sessions
     getUserSessions(userId: string): Promise<Session[]>;
   }
   ```

**Technical Stack:**
- siwe for EVM
- @solana/wallet-adapter
- jose for JWT
- iron-session for cookie sessions
- TypeScript strict mode

**Deliverables:**
- SIWE authentication
- Solana authentication
- Session management
- Auth API endpoints

---

## PROMPT 2: AUTHORIZATION & PERMISSIONS

**Context:** Build role-based access control and permission system.

**Objective:** Create comprehensive authorization layer for platform features.

**Requirements:**
1. **Role Definitions** (`website-unified/lib/auth/roles.ts`)
   ```typescript
   enum Role {
     GUEST = 'guest',
     USER = 'user',
     PROVIDER = 'provider',
     ADMIN = 'admin',
     SUPER_ADMIN = 'super_admin',
   }
   
   interface Permission {
     resource: string;
     actions: ('create' | 'read' | 'update' | 'delete')[];
   }
   
   const RolePermissions: Record<Role, Permission[]> = {
     // Define permissions per role
   };
   ```

2. **Authorization Middleware** (`website-unified/lib/auth/middleware.ts`)
   ```typescript
   // API route middleware
   function withAuth(
     handler: NextApiHandler,
     options?: AuthOptions
   ): NextApiHandler;
   
   // Check permission
   function hasPermission(
     user: User,
     resource: string,
     action: string
   ): boolean;
   
   // Require role
   function requireRole(
     roles: Role | Role[]
   ): MiddlewareFunction;
   ```

3. **Resource-Based Access** (`website-unified/lib/auth/resourceAccess.ts`)
   ```typescript
   class ResourceAccess {
     // Check resource ownership
     isOwner(userId: string, resource: Resource): boolean;
     
     // Check team access
     hasTeamAccess(userId: string, teamId: string, action: string): boolean;
     
     // Check subscription access
     hasSubscriptionAccess(userId: string, serviceId: string): boolean;
     
     // Check rate limit
     checkRateLimit(userId: string, action: string): boolean;
   }
   ```

4. **Auth Context Provider** (`website-unified/providers/AuthProvider.tsx`)
   ```typescript
   interface AuthContext {
     user: User | null;
     session: Session | null;
     isAuthenticated: boolean;
     isLoading: boolean;
     login: () => Promise<void>;
     logout: () => Promise<void>;
     hasPermission: (resource: string, action: string) => boolean;
   }
   ```

**Technical Requirements:**
- Role hierarchy
- Permission inheritance
- Resource ownership checks
- Rate limiting per role
- Audit logging

**Deliverables:**
- Role-based access control
- Authorization middleware
- Permission checking
- Auth context provider

---

## PROMPT 3: API KEY MANAGEMENT

**Context:** Implement API key system for programmatic access and third-party integrations.

**Objective:** Build secure API key generation, validation, and management.

**Requirements:**
1. **API Key Generator** (`website-unified/lib/auth/apiKeys.ts`)
   ```typescript
   class APIKeyManager {
     // Generate new key
     generate(userId: string, options: KeyOptions): Promise<{
       keyId: string;
       secret: string; // Only shown once
       prefix: string;
     }>;
     
     // Validate key
     validate(key: string): Promise<{
       valid: boolean;
       userId?: string;
       permissions?: string[];
       rateLimit?: RateLimit;
     }>;
     
     // Revoke key
     revoke(keyId: string): Promise<void>;
     
     // List user keys
     listKeys(userId: string): Promise<APIKey[]>;
   }
   ```

2. **Key Scopes** (`website-unified/lib/auth/keyScopes.ts`)
   ```typescript
   enum KeyScope {
     TOOLS_READ = 'tools:read',
     TOOLS_EXECUTE = 'tools:execute',
     MARKETPLACE_READ = 'marketplace:read',
     MARKETPLACE_WRITE = 'marketplace:write',
     PAYMENTS_READ = 'payments:read',
     PAYMENTS_WRITE = 'payments:write',
     ANALYTICS_READ = 'analytics:read',
     ADMIN = 'admin',
   }
   
   interface ScopedKey {
     scopes: KeyScope[];
     rateLimit: {
       requests: number;
       window: number;
     };
     expiresAt?: Date;
   }
   ```

3. **API Key UI** (`website-unified/app/(settings)/api-keys/page.tsx`)
   - List all API keys
   - Create new key wizard
   - Scope selection
   - Rate limit configuration
   - Key rotation
   - Usage statistics
   - Revoke with confirmation

4. **Key Validation Middleware** (`website-unified/lib/auth/validateApiKey.ts`)
   ```typescript
   async function validateApiKey(request: Request): Promise<{
     valid: boolean;
     user?: User;
     scopes?: KeyScope[];
     error?: string;
   }>;
   ```

**Technical Requirements:**
- Secure key generation (crypto.randomBytes)
- Key hashing (never store plaintext)
- Prefix for identification (ucm_live_, ucm_test_)
- Usage tracking
- Rate limiting per key

**Deliverables:**
- API key generation system
- Key validation middleware
- Key management UI
- Usage tracking

---

## PROMPT 4: SECURITY MONITORING & PROTECTION

**Context:** Implement security monitoring, threat detection, and protection mechanisms.

**Objective:** Build comprehensive security layer to protect users and platform.

**Requirements:**
1. **Rate Limiter** (`website-unified/lib/security/rateLimiter.ts`)
   ```typescript
   class RateLimiter {
     // Check rate limit
     check(key: string, limit: RateLimit): Promise<{
       allowed: boolean;
       remaining: number;
       resetAt: number;
     }>;
     
     // Sliding window implementation
     slidingWindow(key: string, window: number, max: number): Promise<boolean>;
     
     // Token bucket implementation
     tokenBucket(key: string, rate: number, capacity: number): Promise<boolean>;
   }
   ```

2. **Security Headers** (`website-unified/lib/security/headers.ts`)
   ```typescript
   const securityHeaders = {
     'Content-Security-Policy': `...`,
     'X-Frame-Options': 'DENY',
     'X-Content-Type-Options': 'nosniff',
     'Referrer-Policy': 'strict-origin-when-cross-origin',
     'Permissions-Policy': `...`,
     'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
   };
   ```

3. **Threat Detection** (`website-unified/lib/security/threatDetection.ts`)
   ```typescript
   class ThreatDetector {
     // Detect suspicious patterns
     detectAnomalies(request: Request, user: User): Promise<ThreatLevel>;
     
     // Check IP reputation
     checkIP(ip: string): Promise<IPReputation>;
     
     // Detect bot traffic
     detectBot(request: Request): Promise<boolean>;
     
     // Log security event
     logSecurityEvent(event: SecurityEvent): Promise<void>;
   }
   ```

4. **Transaction Security** (`website-unified/lib/security/transactionSecurity.ts`)
   ```typescript
   class TransactionSecurity {
     // Simulate transaction
     simulate(tx: Transaction): Promise<SimulationResult>;
     
     // Check for malicious contracts
     checkContract(address: string): Promise<ContractRisk>;
     
     // Verify transaction matches intent
     verifyIntent(tx: Transaction, intent: UserIntent): boolean;
     
     // Approval warnings
     getApprovalWarnings(tx: Transaction): Warning[];
   }
   ```

**Technical Requirements:**
- Redis for rate limiting
- IP geolocation
- Bot detection
- Security event logging
- Transaction simulation

**Deliverables:**
- Rate limiting system
- Security headers
- Threat detection
- Transaction security

---

## PROMPT 5: AUDIT LOGGING & COMPLIANCE

**Context:** Build comprehensive audit logging for security, compliance, and debugging.

**Objective:** Create audit trail system for all sensitive operations.

**Requirements:**
1. **Audit Logger** (`website-unified/lib/security/auditLogger.ts`)
   ```typescript
   class AuditLogger {
     // Log event
     log(event: AuditEvent): Promise<void>;
     
     // Query logs
     query(filters: AuditFilters): Promise<AuditEvent[]>;
     
     // Export logs
     export(filters: AuditFilters, format: 'json' | 'csv'): Promise<string>;
     
     // Retention policy
     applyRetention(days: number): Promise<number>;
   }
   
   interface AuditEvent {
     timestamp: Date;
     userId: string;
     action: string;
     resource: string;
     resourceId: string;
     metadata: Record<string, unknown>;
     ip: string;
     userAgent: string;
     result: 'success' | 'failure';
     errorMessage?: string;
   }
   ```

2. **Action Types** (`website-unified/lib/security/auditActions.ts`)
   ```typescript
   enum AuditAction {
     // Auth
     LOGIN = 'auth.login',
     LOGOUT = 'auth.logout',
     LOGIN_FAILED = 'auth.login_failed',
     
     // API Keys
     API_KEY_CREATED = 'api_key.created',
     API_KEY_REVOKED = 'api_key.revoked',
     
     // Payments
     PAYMENT_INITIATED = 'payment.initiated',
     PAYMENT_COMPLETED = 'payment.completed',
     PAYMENT_FAILED = 'payment.failed',
     
     // Admin
     USER_ROLE_CHANGED = 'admin.role_changed',
     SERVICE_APPROVED = 'admin.service_approved',
     // ... more actions
   }
   ```

3. **Audit Dashboard** (`website-unified/app/(admin)/audit/page.tsx`)
   - Real-time audit log stream
   - Filter by user, action, date
   - Search across events
   - Export functionality
   - Anomaly highlighting
   - Action drill-down

4. **Compliance Reports** (`website-unified/lib/security/complianceReports.ts`)
   ```typescript
   class ComplianceReporter {
     // Generate access report
     generateAccessReport(userId: string, period: DateRange): Promise<AccessReport>;
     
     // Generate activity report
     generateActivityReport(period: DateRange): Promise<ActivityReport>;
     
     // Data export (GDPR)
     exportUserData(userId: string): Promise<UserDataExport>;
     
     // Data deletion (GDPR)
     deleteUserData(userId: string): Promise<void>;
   }
   ```

**Technical Requirements:**
- Immutable audit log storage
- Efficient querying
- Log retention policies
- GDPR compliance
- Real-time streaming

**Deliverables:**
- Audit logging system
- Audit action definitions
- Admin audit dashboard
- Compliance reporting

---

**Integration Notes:**
- Auth integrates with all API routes (Agent 9)
- Session tokens in WebSocket (Agent 11)
- Payment authorization (Agent 10)
- Database storage (Agent 13)
- Admin dashboard access

**Success Criteria:**
- Secure wallet authentication
- Sub-100ms auth checks
- Zero authentication bypasses
- Complete audit trail
- GDPR compliant data handling
- API key security
- Effective rate limiting
