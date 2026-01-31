/**
 * Universal Crypto MCP Shared Utilities
 * 
 * A comprehensive set of utilities for building resilient, secure, and observable
 * integrations and agents.
 * 
 * @module @universal-crypto-mcp/shared-utils
 * @author nich <nich@nichxbt.com>
 */

// Rate Limiting
export {
  RateLimiter,
  SlidingWindowRateLimiter,
  RateLimiterRegistry,
  API_RATE_LIMITS,
  type RateLimiterConfig,
  type RateLimitResult,
} from './rate-limiter/index.js';

// Retry & Circuit Breaker
export {
  retry,
  CircuitBreaker,
  ResilientExecutor,
  createResilientExecutor,
  type RetryConfig,
  type RetryResult,
  type CircuitBreakerConfig,
  type CircuitBreakerState,
} from './retry/index.js';

// Error Handling
export {
  UCMCPError,
  ApiError,
  RateLimitError,
  TimeoutError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NetworkError,
  ConfigurationError,
  BlockchainError,
  AgentError,
  GuardrailError,
  isUCMCPError,
  isRetryableError,
  createErrorFromResponse,
  type ErrorContext,
} from './errors/index.js';

// Logging
export {
  ConsoleLogger,
  createLogger,
  redactSensitive,
  withLogging,
  DEFAULT_REDACT_PATTERNS,
  type Logger,
  type LogLevel,
  type LoggerConfig,
} from './logger/index.js';

// Timeout
export {
  withTimeout,
  waitFor,
  createDeadline,
  createTimeoutAbortController,
  DEFAULT_TIMEOUTS,
} from './timeout/index.js';

// Secrets Management
export {
  EnvSecretProvider,
  FileSecretProvider,
  MemorySecretProvider,
  SecretsManager,
  createSecretsManager,
  getApiCredentials,
  getBlockchainCredentials,
  type SecretProvider,
  type SecretValue,
  type SecretsConfig,
} from './secrets/index.js';

// HTTP Client
export {
  HttpClient,
  createApiClient,
  apiClients,
  type HttpClientConfig,
  type RequestOptions,
  type HttpResponse,
} from './http/index.js';

// Metrics
export {
  Counter,
  Gauge,
  Histogram,
  MetricsRegistry,
  httpRequestsTotal,
  httpRequestDuration,
  apiCallsTotal,
  rateLimitHits,
  circuitBreakerState,
  errorsTotal,
} from './metrics/index.js';

// Feature Flags
export {
  FeatureFlagManager,
  isFeatureEnabled,
  requireFeature,
  DEFAULT_FLAGS,
  type FeatureFlag,
  type FeatureFlagConfig,
  type FeatureContext,
} from './feature-flags/index.js';

// Guardrails
export {
  AgentGuardrails,
  ApprovalQueue,
  createDefaultGuardrails,
  createStrictGuardrails,
  createTestGuardrails,
  type AgentAction,
  type SpendingLimit,
  type ApprovalRule,
  type ApprovalRequest,
  type GuardrailConfig,
  type GuardrailCheckResult,
  type ApprovalHandler,
} from './guardrails/index.js';

// Human-in-the-Loop
export {
  HITLManager,
  createConsoleHITL,
  createWebhookHITL,
  createSlackHITL,
  requireHumanApproval,
  type HITLRequest,
  type HITLConfig,
  type NotificationChannel,
  type EscalationRule,
  type HITLEventType,
  type HITLEventHandler,
} from './hitl/index.js';
