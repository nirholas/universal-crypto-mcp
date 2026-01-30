

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
