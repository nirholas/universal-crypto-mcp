# Universal Crypto MCP - Comprehensive Repository Audit

## Agent Prompt Instructions

Each agent below is responsible for auditing a specific section of the repository. Each agent should produce a detailed markdown document (2000+ words) with their findings. All 5 documents will be merged manually into a comprehensive audit report.

---

## AGENT 1: Core Infrastructure & Architecture Audit

### Prompt for Agent 1

```
You are an expert software architect and code auditor. Your task is to perform a comprehensive audit of the CORE INFRASTRUCTURE and ARCHITECTURE of the universal-crypto-mcp repository. You must produce a detailed markdown document saved to `/workspaces/universal-crypto-mcp/AUDIT_AGENT_1_CORE_INFRASTRUCTURE.md`.

## YOUR SCOPE

You are responsible for auditing the following directories and files:

### Primary Directories:
1. `/workspaces/universal-crypto-mcp/packages/core/` - Core package functionality
2. `/workspaces/universal-crypto-mcp/packages/shared/` - Shared utilities and types
3. `/workspaces/universal-crypto-mcp/packages/infrastructure/` - Infrastructure components
4. `/workspaces/universal-crypto-mcp/src/` - Main source directory

### Configuration & Root Files:
- `package.json` - Root package configuration
- `pnpm-workspace.yaml` - Workspace configuration
- `tsconfig.json` and `tsconfig.test.json` - TypeScript configuration
- `eslint.config.js` - Linting configuration
- `vitest.config.ts` and `vitest.e2e.config.ts` - Test configuration
- `tsup.config.ts` - Build configuration
- `.prettierrc` and `.prettierignore` - Formatting configuration
- `.npmrc` and `.nvmrc` - Node/npm configuration
- `.editorconfig` - Editor configuration

### CI/CD & GitHub:
- `.github/` directory - GitHub Actions, workflows, templates

## YOUR DELIVERABLES

Create a markdown document with the following sections (minimum 2000 words total):

### Section 1: Executive Summary (200-300 words)
- High-level overview of the core architecture
- Key strengths identified
- Critical issues requiring immediate attention
- Overall health score (1-10) with justification

### Section 2: Package Architecture Analysis (400-500 words)
- Monorepo structure evaluation
- Package interdependencies and coupling analysis
- Dependency management assessment (pnpm workspace)
- Module boundary violations (if any)
- Circular dependency detection
- Package versioning strategy review

### Section 3: TypeScript Configuration Audit (300-400 words)
- tsconfig.json settings analysis
- Type safety level assessment
- Compiler options evaluation
- Path aliases and module resolution
- Test configuration separation
- Recommendations for stricter type checking

### Section 4: Build System & Tooling (300-400 words)
- tsup configuration analysis
- Build output formats (ESM/CJS)
- Tree-shaking capabilities
- Bundle size considerations
- Development vs production builds
- Hot reload/watch mode setup

### Section 5: Code Quality & Linting (300-400 words)
- ESLint configuration completeness
- Rule severity appropriateness
- Prettier integration
- Import ordering rules
- Unused variable/import detection
- Custom rule recommendations

### Section 6: Testing Infrastructure (300-400 words)
- Vitest configuration analysis
- Test coverage configuration
- E2E testing setup
- Mocking strategies
- Test file organization
- CI integration for tests

### Section 7: Core Package Deep Dive (400-500 words)
- Entry points and exports analysis
- API design patterns used
- Error handling strategies
- Logging infrastructure
- Configuration management
- Core utility functions review

### Section 8: Shared Package Analysis (300-400 words)
- Shared types and interfaces
- Utility function quality
- Code reuse patterns
- Documentation quality
- Export organization

### Section 9: Infrastructure Package Review (300-400 words)
- Infrastructure components overview
- Service abstractions
- Connection management
- Resource cleanup patterns
- Scalability considerations

### Section 10: CI/CD Pipeline Audit (300-400 words)
- GitHub Actions workflow analysis
- Build pipeline efficiency
- Test automation coverage
- Deployment automation
- Security scanning integration
- Dependency update automation

### Section 11: Issues & Recommendations Table
Create a detailed table with columns:
| Priority | Issue | Location | Description | Recommended Fix |

### Section 12: Action Items Summary
- Immediate fixes (critical)
- Short-term improvements (1-2 weeks)
- Long-term refactoring suggestions

## IMPORTANT INSTRUCTIONS

1. Read ALL files in your assigned directories thoroughly
2. Use grep_search to find patterns across the codebase
3. Check for consistency between configuration files
4. Identify any security anti-patterns in configurations
5. Note any deprecated dependencies or configurations
6. Look for TODO/FIXME comments indicating technical debt
7. Assess documentation quality within code
8. Be specific with file paths and line numbers when citing issues
9. Provide actionable recommendations, not just observations
10. Use code examples where helpful to illustrate points

Do NOT audit packages outside your scope (defi, trading, marketplace, etc.). Those are assigned to other agents.
```

---

## AGENT 2: DeFi, Trading & Market Data Audit

### Prompt for Agent 2

```
You are an expert DeFi developer and code auditor with deep knowledge of cryptocurrency trading systems. Your task is to perform a comprehensive audit of the DEFI, TRADING, and MARKET DATA packages of the universal-crypto-mcp repository. You must produce a detailed markdown document saved to `/workspaces/universal-crypto-mcp/AUDIT_AGENT_2_DEFI_TRADING.md`.

## YOUR SCOPE

You are responsible for auditing the following directories:

### Primary Directories:
1. `/workspaces/universal-crypto-mcp/packages/defi/` - DeFi protocol integrations
2. `/workspaces/universal-crypto-mcp/packages/trading/` - Trading functionality
3. `/workspaces/universal-crypto-mcp/packages/market-data/` - Market data services
4. `/workspaces/universal-crypto-mcp/memecoin-trading-bot/` - Memecoin trading bot

### Related Documentation:
- `MEMECOIN-BOT.md` - Memecoin bot documentation

## YOUR DELIVERABLES

Create a markdown document with the following sections (minimum 2000 words total):

### Section 1: Executive Summary (200-300 words)
- Overview of DeFi/trading capabilities
- Supported protocols and exchanges
- Critical security findings
- Overall risk assessment (Low/Medium/High/Critical)

### Section 2: DeFi Package Architecture (400-500 words)
- Protocol integration patterns
- Supported DeFi protocols (Uniswap, Aave, Compound, etc.)
- Smart contract interaction patterns
- Transaction building and signing
- Gas estimation strategies
- Slippage protection mechanisms
- MEV protection considerations

### Section 3: Trading Package Analysis (400-500 words)
- Order types supported
- Exchange integrations
- Order execution flow
- Position management
- Risk management features
- Trading strategy abstractions
- Backtesting capabilities
- Paper trading support

### Section 4: Market Data Services (400-500 words)
- Data sources and providers
- Real-time vs historical data
- WebSocket implementations
- Data normalization patterns
- Caching strategies
- Rate limiting handling
- Data freshness guarantees
- Failover mechanisms

### Section 5: Security Analysis (500-600 words)
This is CRITICAL for financial systems:
- Private key handling review
- Transaction signing security
- Input validation on amounts
- Integer overflow/underflow protection
- Reentrancy considerations
- Front-running protections
- API key storage and rotation
- Secrets management
- Audit trail and logging
- Rate limiting implementations

### Section 6: Memecoin Trading Bot Review (400-500 words)
- Bot architecture overview
- Trading strategies implemented
- Risk parameters and limits
- Token screening/filtering
- Liquidity analysis
- Rug pull detection
- Sniper functionality (if any)
- Performance optimizations

### Section 7: Error Handling & Recovery (300-400 words)
- Transaction failure handling
- Retry mechanisms
- Partial fill handling
- Network error recovery
- State reconciliation
- Dead letter queues
- Alert mechanisms

### Section 8: Performance Analysis (300-400 words)
- Latency considerations
- Batch processing capabilities
- Concurrent request handling
- Memory usage patterns
- Connection pooling
- WebSocket management

### Section 9: Testing Coverage (300-400 words)
- Unit test coverage
- Integration test presence
- Mock implementations for exchanges
- Test data management
- Mainnet fork testing
- Edge case coverage

### Section 10: Code Quality Assessment (300-400 words)
- Type safety in financial calculations
- BigNumber/decimal handling
- Null safety patterns
- Async/await patterns
- Error propagation
- Logging quality

### Section 11: Issues & Recommendations Table
Create a detailed table with columns:
| Priority | Issue | Location | Description | Recommended Fix | Security Impact |

### Section 12: Action Items Summary
- Critical security fixes
- Important functionality improvements
- Nice-to-have enhancements

## IMPORTANT INSTRUCTIONS

1. PAY SPECIAL ATTENTION TO SECURITY - this handles real money
2. Look for hardcoded values that should be configurable
3. Check for proper decimal precision handling
4. Verify all external API calls have proper error handling
5. Look for race conditions in trading logic
6. Check for proper nonce management
7. Verify slippage calculations are correct
8. Look for potential sandwich attack vectors
9. Check API rate limit handling
10. Verify all amounts use safe math operations

Do NOT audit packages outside your scope. Those are assigned to other agents.
```

---

## AGENT 3: Payments, Wallets & Security Audit

### Prompt for Agent 3

```
You are an expert blockchain security auditor specializing in wallet implementations and payment systems. Your task is to perform a comprehensive audit of the PAYMENTS, WALLETS, SECURITY packages and x402 payment protocol of the universal-crypto-mcp repository. You must produce a detailed markdown document saved to `/workspaces/universal-crypto-mcp/AUDIT_AGENT_3_PAYMENTS_SECURITY.md`.

## YOUR SCOPE

You are responsible for auditing the following directories:

### Primary Directories:
1. `/workspaces/universal-crypto-mcp/packages/payments/` - Payment processing
2. `/workspaces/universal-crypto-mcp/packages/wallets/` - Wallet implementations
3. `/workspaces/universal-crypto-mcp/packages/security/` - Security utilities
4. `/workspaces/universal-crypto-mcp/x402/` - x402 payment protocol
5. `/workspaces/universal-crypto-mcp/x402-deploy/` - x402 deployment
6. `/workspaces/universal-crypto-mcp/contracts/` - Smart contracts

### Related Documentation:
- `x402.md` - x402 protocol documentation
- `SECURITY.md` - Security policy

## YOUR DELIVERABLES

Create a markdown document with the following sections (minimum 2000 words total):

### Section 1: Executive Summary (200-300 words)
- Overview of payment/wallet capabilities
- Supported blockchains and standards
- Critical security findings
- Compliance considerations
- Overall security posture rating

### Section 2: Wallet Package Deep Dive (500-600 words)
- Wallet types supported (HD, multi-sig, etc.)
- Key derivation implementations
- BIP-32/39/44 compliance
- Mnemonic handling security
- Private key storage patterns
- Encryption at rest
- Wallet connection protocols (WalletConnect, etc.)
- Hardware wallet support
- Address generation and validation
- Chain-specific implementations

### Section 3: Payments Package Analysis (500-600 words)
- Payment flow architecture
- Supported payment methods
- Payment confirmation handling
- Webhook implementations
- Idempotency handling
- Refund mechanisms
- Fee calculation logic
- Multi-currency support
- Payment state machine
- Timeout handling

### Section 4: x402 Protocol Review (400-500 words)
- Protocol specification compliance
- HTTP 402 implementation
- Payment negotiation flow
- Proof of payment verification
- Token-gated access patterns
- Session management
- Caching strategies
- Error response handling

### Section 5: Smart Contract Audit (500-600 words)
- Contract architecture overview
- Access control patterns
- Upgradeability mechanisms
- Reentrancy protections
- Integer safety
- Oracle usage (if any)
- Gas optimization
- Event emission patterns
- Storage layout concerns
- Initialization security

### Section 6: Security Package Review (400-500 words)
- Cryptographic primitives used
- Signature verification implementations
- Hash function usage
- Random number generation
- Input sanitization utilities
- Rate limiting implementations
- IP blocking/allowlisting
- JWT/token handling
- CORS configuration
- CSP headers

### Section 7: Key Management Analysis (400-500 words)
- Key generation methods
- Key storage security
- Key rotation support
- Backup and recovery
- Multi-party computation (if any)
- Threshold signatures (if any)
- HSM integration (if any)
- Environment variable handling
- Secrets in logs prevention

### Section 8: Authentication & Authorization (300-400 words)
- Authentication mechanisms
- Session management
- Permission models
- API key management
- OAuth implementations (if any)
- Role-based access control
- Audit logging

### Section 9: Vulnerability Assessment (400-500 words)
- Common vulnerability checklist:
  - SQL Injection (N/A if no SQL)
  - XSS vulnerabilities
  - CSRF protections
  - Path traversal
  - Insecure deserialization
  - Sensitive data exposure
  - Broken access control
  - Security misconfiguration
  - Cryptographic failures
  - SSRF vulnerabilities

### Section 10: Compliance Considerations (200-300 words)
- Data privacy (GDPR considerations)
- Financial regulations awareness
- Audit trail completeness
- Data retention policies
- Right to deletion support

### Section 11: Issues & Recommendations Table
Create a detailed table with columns:
| Severity | Issue | Location | CWE ID | Description | Remediation |

### Section 12: Action Items Summary
- Critical (fix immediately)
- High (fix within 1 week)
- Medium (fix within 1 month)
- Low (track for future)

## IMPORTANT INSTRUCTIONS

1. THIS IS THE MOST SECURITY-CRITICAL AUDIT SECTION
2. Use CWE IDs when identifying vulnerabilities
3. Check for exposed secrets in any configuration files
4. Verify all cryptographic operations use secure defaults
5. Look for timing attacks in signature verification
6. Check for proper entropy in random generation
7. Verify all sensitive data is encrypted in transit and at rest
8. Look for hardcoded credentials or keys
9. Check smart contracts for known vulnerability patterns
10. Verify all external inputs are validated

Do NOT audit packages outside your scope. Those are assigned to other agents.
```

---

## AGENT 4: Integrations, Agents & Automation Audit

### Prompt for Agent 4

```
You are an expert software engineer specializing in AI agents, automation systems, and third-party integrations. Your task is to perform a comprehensive audit of the INTEGRATIONS, AGENTS, AUTOMATION, NOVEL, and GENERATORS packages of the universal-crypto-mcp repository. You must produce a detailed markdown document saved to `/workspaces/universal-crypto-mcp/AUDIT_AGENT_4_INTEGRATIONS_AGENTS.md`.

## YOUR SCOPE

You are responsible for auditing the following directories:

### Primary Directories:
1. `/workspaces/universal-crypto-mcp/packages/integrations/` - Third-party integrations
2. `/workspaces/universal-crypto-mcp/packages/agents/` - AI/autonomous agents
3. `/workspaces/universal-crypto-mcp/packages/automation/` - Automation workflows
4. `/workspaces/universal-crypto-mcp/packages/novel/` - Novel/experimental features
5. `/workspaces/universal-crypto-mcp/packages/generators/` - Code/content generators
6. `/workspaces/universal-crypto-mcp/vendor/` - Vendored dependencies
7. `/workspaces/universal-crypto-mcp/xeepy/` - Xeepy integration (if exists)

### Related Files:
- `MCP_SERVER_INTEGRATION.md`
- `NEW_MCP_SERVERS_INTEGRATION.md`
- `INTEGRATION_SUMMARY.md`
- `INTEGRATION_QUICKSTART.md`
- `server.json` - MCP server configuration

## YOUR DELIVERABLES

Create a markdown document with the following sections (minimum 2000 words total):

### Section 1: Executive Summary (200-300 words)
- Overview of integration capabilities
- Number of supported integrations
- Agent architecture summary
- Key findings and concerns
- Integration maturity assessment

### Section 2: Integrations Package Analysis (500-600 words)
- Supported third-party services
- Integration patterns used
- API client implementations
- Authentication handling per integration
- Rate limiting strategies
- Error handling consistency
- Retry logic patterns
- Webhook handling
- Data transformation/normalization
- Integration testing approach

### Section 3: Agents Package Deep Dive (500-600 words)
- Agent architecture overview
- Agent types implemented
- Decision-making logic
- State management
- Memory/context handling
- Tool/function calling patterns
- LLM integration (if any)
- Agent communication patterns
- Autonomy levels and guardrails
- Human-in-the-loop mechanisms

### Section 4: Automation Package Review (400-500 words)
- Workflow definitions
- Trigger mechanisms
- Scheduling capabilities
- Conditional logic handling
- Action execution patterns
- Error recovery in workflows
- Workflow persistence
- Monitoring and observability
- Scalability considerations

### Section 5: MCP Server Integration Analysis (400-500 words)
- MCP protocol compliance
- Tool definitions and schemas
- Resource handling
- Prompt templates
- Server configuration
- Transport mechanisms
- Error responses
- Capability negotiation

### Section 6: Generators Package Review (300-400 words)
- Generator types available
- Template systems used
- Output validation
- Configuration options
- Extensibility patterns
- Generated code quality

### Section 7: Novel Features Assessment (300-400 words)
- Experimental features inventory
- Stability assessment
- Feature flags usage
- Migration paths
- Documentation quality
- Risk assessment

### Section 8: Vendor Dependencies Audit (300-400 words)
- Vendored package inventory
- Version tracking
- Security vulnerabilities
- License compliance
- Update frequency
- Patch management

### Section 9: API Design Consistency (300-400 words)
- Interface consistency across integrations
- Naming conventions
- Error format standardization
- Response structure patterns
- Pagination handling
- Versioning strategy

### Section 10: Observability & Monitoring (300-400 words)
- Logging implementations
- Metrics collection
- Tracing support
- Health checks
- Alerting integration
- Dashboard availability

### Section 11: Issues & Recommendations Table
Create a detailed table with columns:
| Priority | Issue | Location | Description | Recommended Fix |

### Section 12: Action Items Summary
- Critical improvements needed
- Integration gaps to address
- Agent safety improvements
- Documentation needs

## IMPORTANT INSTRUCTIONS

1. Map out all external service dependencies
2. Check for API version pinning
3. Verify all integrations have proper timeout handling
4. Look for potential data leakage to third parties
5. Check agent guardrails and safety mechanisms
6. Verify automation workflows have proper error boundaries
7. Check for hardcoded API endpoints
8. Look for proper secrets handling in integrations
9. Verify all async operations have proper cleanup
10. Check for proper resource disposal

Do NOT audit packages outside your scope. Those are assigned to other agents.
```

---

## AGENT 5: Marketplace, Documentation & DevOps Audit

### Prompt for Agent 5

```
You are an expert DevOps engineer and technical writer with experience in marketplace platforms. Your task is to perform a comprehensive audit of the MARKETPLACE, DOCUMENTATION, EXAMPLES, SCRIPTS, and DEVOPS configuration of the universal-crypto-mcp repository. You must produce a detailed markdown document saved to `/workspaces/universal-crypto-mcp/AUDIT_AGENT_5_MARKETPLACE_DEVOPS.md`.

## YOUR SCOPE

You are responsible for auditing the following directories:

### Primary Directories:
1. `/workspaces/universal-crypto-mcp/packages/marketplace/` - Marketplace functionality
2. `/workspaces/universal-crypto-mcp/docs/` - Documentation
3. `/workspaces/universal-crypto-mcp/examples/` - Example code
4. `/workspaces/universal-crypto-mcp/scripts/` - Build/utility scripts
5. `/workspaces/universal-crypto-mcp/docker/` - Docker configuration
6. `/workspaces/universal-crypto-mcp/campaign/` - Marketing campaign assets
7. `/workspaces/universal-crypto-mcp/website-unified/` - Website source
8. `/workspaces/universal-crypto-mcp/test/` and `/workspaces/universal-crypto-mcp/tests/` - Test directories
9. `/workspaces/universal-crypto-mcp/temp-indicators/` - Temporary indicators

### Configuration Files:
- `Dockerfile`
- `docker-compose.yml`
- `foundry.toml`
- `typedoc.json`
- `codecov.yml`
- `cliff.toml` (changelog generation)
- `requirements.txt`

### Root Documentation:
- `README.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `CHANGELOG.md`
- `LICENSE`
- `THIRD-PARTY-LICENSES.md`
- `MARKETPLACE.md` and related marketplace docs
- All other `.md` files in root

## YOUR DELIVERABLES

Create a markdown document with the following sections (minimum 2000 words total):

### Section 1: Executive Summary (200-300 words)
- Overview of marketplace capabilities
- Documentation quality assessment
- DevOps maturity level
- Key findings and concerns
- Overall developer experience rating

### Section 2: Marketplace Package Analysis (500-600 words)
- Marketplace architecture
- Listing/catalog management
- Search and discovery
- Pricing models supported
- Payment integration
- Seller/buyer flows
- Review/rating system
- Dispute handling
- Analytics and reporting
- API design

### Section 3: Docker & Containerization (400-500 words)
- Dockerfile analysis
  - Base image selection
  - Layer optimization
  - Security scanning
  - Multi-stage builds
  - Build arguments handling
- docker-compose.yml review
  - Service definitions
  - Network configuration
  - Volume management
  - Environment variables
  - Health checks
  - Resource limits
- Container security assessment
- Production readiness

### Section 4: Documentation Quality Audit (500-600 words)
- README.md completeness
  - Project description
  - Installation instructions
  - Quick start guide
  - Feature overview
  - License information
  - Contributing guidelines link
- API documentation
  - Completeness
  - Accuracy
  - Examples provided
  - TypeDoc configuration
- Inline code documentation
  - JSDoc/TSDoc usage
  - Comment quality
  - Type documentation
- Architecture documentation
- Deployment documentation

### Section 5: Examples Assessment (300-400 words)
- Example coverage
- Example quality and correctness
- Running instructions
- Dependencies management
- Educational value
- Maintenance status

### Section 6: Scripts Audit (400-500 words)
- Script inventory
- Shell script quality
  - Error handling
  - Input validation
  - Portability
  - Logging
- TypeScript scripts review
- Automation coverage
- Script documentation
- CI/CD script integration

### Section 7: Test Infrastructure Review (400-500 words)
- Test directory organization
- Test frameworks used
- Test coverage analysis
- Test data management
- Mock/stub patterns
- Integration test setup
- E2E test coverage
- Performance testing
- Test documentation

### Section 8: Website & Campaign Review (300-400 words)
- Website structure
- Content accuracy
- SEO considerations
- Accessibility compliance
- Campaign material quality
- Brand consistency

### Section 9: DevOps Best Practices (400-500 words)
- Infrastructure as Code
- Environment management
- Secret management
- Monitoring setup
- Logging aggregation
- Backup strategies
- Disaster recovery
- Scaling strategies
- Cost optimization

### Section 10: Dependency Management (300-400 words)
- Dependency audit
- License compliance
- Security vulnerabilities
- Update strategy
- Lock file management
- Peer dependency handling

### Section 11: Issues & Recommendations Table
Create a detailed table with columns:
| Priority | Issue | Location | Category | Description | Recommended Fix |

### Section 12: Action Items Summary
- Documentation improvements
- DevOps enhancements
- Example additions
- Marketplace features

## IMPORTANT INSTRUCTIONS

1. Run through examples to verify they work
2. Check all documentation links are valid
3. Verify Docker builds successfully
4. Check for sensitive data in scripts
5. Verify all environment variables are documented
6. Look for outdated documentation
7. Check test coverage reports if available
8. Verify all npm scripts are documented
9. Check for proper .gitignore entries
10. Verify changelog is up to date

Do NOT audit packages outside your scope. Those are assigned to other agents.
```

---

## Execution Instructions

### How to Run These Agents

1. **Launch each agent sequentially or in parallel** (if you have the capacity)
2. Each agent should:
   - Read all files in their assigned scope
   - Use `grep_search` for pattern analysis
   - Use `semantic_search` for context
   - Create their individual markdown file
3. **Expected output files:**
   - `AUDIT_AGENT_1_CORE_INFRASTRUCTURE.md`
   - `AUDIT_AGENT_2_DEFI_TRADING.md`
   - `AUDIT_AGENT_3_PAYMENTS_SECURITY.md`
   - `AUDIT_AGENT_4_INTEGRATIONS_AGENTS.md`
   - `AUDIT_AGENT_5_MARKETPLACE_DEVOPS.md`

### Coverage Verification Checklist

| Directory | Agent | Covered |
|-----------|-------|---------|
| packages/core | Agent 1 | ☐ |
| packages/shared | Agent 1 | ☐ |
| packages/infrastructure | Agent 1 | ☐ |
| packages/defi | Agent 2 | ☐ |
| packages/trading | Agent 2 | ☐ |
| packages/market-data | Agent 2 | ☐ |
| packages/payments | Agent 3 | ☐ |
| packages/wallets | Agent 3 | ☐ |
| packages/security | Agent 3 | ☐ |
| packages/integrations | Agent 4 | ☐ |
| packages/agents | Agent 4 | ☐ |
| packages/automation | Agent 4 | ☐ |
| packages/novel | Agent 4 | ☐ |
| packages/generators | Agent 4 | ☐ |
| packages/marketplace | Agent 5 | ☐ |
| memecoin-trading-bot | Agent 2 | ☐ |
| x402 | Agent 3 | ☐ |
| contracts | Agent 3 | ☐ |
| docs | Agent 5 | ☐ |
| examples | Agent 5 | ☐ |
| scripts | Agent 5 | ☐ |
| docker | Agent 5 | ☐ |
| campaign | Agent 5 | ☐ |
| website-unified | Agent 5 | ☐ |
| .github | Agent 1 | ☐ |
| vendor | Agent 4 | ☐ |
| xeepy | Agent 4 | ☐ |
| src | Agent 1 | ☐ |
| test/tests | Agent 5 | ☐ |

### If Additional Agents Are Needed

If 5 agents are insufficient to cover the codebase thoroughly, consider these additional agents:

**Agent 6-10 (Extended Coverage):**
- Agent 6: Deep-dive on a specific complex package
- Agent 7: Cross-cutting concerns (logging, errors, validation)
- Agent 8: Performance and optimization audit
- Agent 9: Accessibility and internationalization
- Agent 10: Final synthesis and gap analysis

---

## Merge Instructions (Manual)

After all agents complete:

1. Collect all 5 markdown files
2. Create `COMPREHENSIVE_AUDIT_REPORT.md`
3. Structure as:
   - Executive Summary (synthesized)
   - Section per agent (can keep separate or interleave)
   - Consolidated Issues Table
   - Prioritized Action Items
   - Appendices with detailed findings

---

*Generated for universal-crypto-mcp repository audit*
*Date: [Current Date]*
*Audit Version: 1.0*
