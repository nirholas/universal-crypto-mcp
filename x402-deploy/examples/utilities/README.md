# Enhanced Utilities Examples

This directory contains examples of using the advanced utilities provided by x402-deploy.

## Available Utility Examples

1. **retry.example.ts** - Retry logic with exponential backoff
2. **circuit-breaker.example.ts** - Circuit breaker pattern for resilience
3. **cache.example.ts** - Caching with TTL and LRU eviction
4. **metrics.example.ts** - Performance monitoring and metrics
5. **health.example.ts** - Health checks and monitoring
6. **sanitize.example.ts** - Input sanitization and validation
7. **security.example.ts** - Security utilities and helpers

## Running Examples

```bash
# Install dependencies
pnpm install

# Run individual examples
pnpm tsx examples/utilities/retry.example.ts
pnpm tsx examples/utilities/circuit-breaker.example.ts
pnpm tsx examples/utilities/cache.example.ts
```

## Key Features

- **Production-ready utilities** for resilience, performance, and security
- **TypeScript-first** with full type safety
- **Well-tested patterns** from industry best practices
- **Easy integration** with existing Express/MCP applications
