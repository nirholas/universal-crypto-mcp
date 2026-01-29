# Contributing to x402-deploy

Thank you for your interest in contributing to x402-deploy! This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

---

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm v8 or higher (or npm/yarn)
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/universal-crypto-mcp.git
cd universal-crypto-mcp/x402-deploy
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/nirholas/universal-crypto-mcp.git
```

---

## Development Setup

### Install Dependencies

```bash
pnpm install
```

### Build

```bash
pnpm run build
```

### Run Tests

```bash
pnpm run test
```

### Run Linter

```bash
pnpm run lint
pnpm run lint:fix  # Auto-fix issues
```

### Run in Development Mode

```bash
pnpm run dev
```

### Link Locally

To test the CLI locally:

```bash
npm link
x402-deploy --version
```

---

## Making Changes

### Branch Naming

Use descriptive branch names:

- `feature/add-new-provider` - New features
- `fix/payment-verification-bug` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/cleanup-gateway` - Code refactoring
- `test/add-dashboard-tests` - Test additions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or fixing tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(cli): add support for Fly.io deployment
fix(gateway): handle expired payment tokens correctly
docs(readme): update installation instructions
test(discovery): add tests for ownership proofs
```

### Keep Changes Focused

- One feature/fix per pull request
- Split large changes into smaller PRs
- Keep PRs under 500 lines when possible

---

## Pull Request Process

### Before Submitting

1. **Update your fork:**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run all checks:**
```bash
pnpm run build
pnpm run test
pnpm run lint
```

3. **Update documentation** if needed

4. **Add tests** for new features

### Submitting

1. Push your branch:
```bash
git push origin feature/your-feature
```

2. Create a Pull Request on GitHub

3. Fill out the PR template completely

4. Wait for review

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (describe)

## Testing
Describe how you tested the changes

## Checklist
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainers will review within 3-5 business days
2. Address feedback promptly
3. Once approved, maintainer will merge
4. Your contribution will be in the next release!

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Explicit types for public APIs
- Use interfaces over types when possible

```typescript
// Good
interface PaymentConfig {
  wallet: string;
  network: string;
  token?: string;
}

export function verifyPayment(config: PaymentConfig): Promise<boolean> {
  // ...
}

// Avoid
export function verifyPayment(config: any): any {
  // ...
}
```

### File Structure

```
src/
├── cli/
│   ├── commands/      # CLI commands
│   └── index.ts       # CLI entry point
├── gateway/
│   ├── middleware.ts  # Express middleware
│   ├── mcp-wrapper.ts # MCP wrapper
│   └── ...
├── dashboard/
│   ├── analytics.ts   # Analytics tracking
│   └── ...
├── types/
│   └── config.ts      # Type definitions
└── utils/
    └── ...            # Shared utilities
```

### Naming Conventions

- **Files:** kebab-case (`payment-verifier.ts`)
- **Classes:** PascalCase (`PricingEngine`)
- **Functions:** camelCase (`verifyPayment`)
- **Constants:** UPPER_SNAKE_CASE (`DEFAULT_NETWORK`)
- **Interfaces:** PascalCase (`X402Config`)

### Error Handling

```typescript
// Good - specific error types
class PaymentVerificationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PaymentVerificationError';
  }
}

// Throw with context
throw new PaymentVerificationError(
  'Payment expired',
  'PAYMENT_EXPIRED'
);
```

### Async/Await

```typescript
// Good - async/await
async function deployProject(config: X402Config): Promise<DeployResult> {
  const build = await buildProject(config);
  const deploy = await uploadToProvider(build);
  return deploy;
}

// Avoid - nested promises
function deployProject(config: X402Config): Promise<DeployResult> {
  return buildProject(config).then(build => {
    return uploadToProvider(build).then(deploy => {
      return deploy;
    });
  });
}
```

---

## Testing Guidelines

### Test Structure

```
tests/
├── unit/
│   ├── gateway.test.ts
│   ├── discovery.test.ts
│   └── ...
├── integration/
│   └── deploy.test.ts
└── e2e/
    └── full-flow.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PaymentVerifier', () => {
  describe('verifyPayment', () => {
    it('should accept valid payment header', async () => {
      const result = await verifyPayment({
        paymentHeader: validHeader,
        expectedPrice: '$0.01',
        network: 'eip155:8453',
      });

      expect(result.valid).toBe(true);
      expect(result.payer).toBeDefined();
    });

    it('should reject expired payment', async () => {
      const result = await verifyPayment({
        paymentHeader: expiredHeader,
        expectedPrice: '$0.01',
        network: 'eip155:8453',
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('PAYMENT_EXPIRED');
    });
  });
});
```

### Test Coverage

- Aim for 80%+ coverage on core modules
- 100% coverage on payment verification
- All error paths should be tested

### Running Tests

```bash
# All tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:coverage

# Specific file
pnpm run test gateway.test.ts
```

---

## Documentation

### Code Comments

```typescript
/**
 * Verify a payment header against expected requirements
 * 
 * @param options - Verification options
 * @param options.paymentHeader - Base64-encoded payment data
 * @param options.expectedPrice - Expected price (e.g., "$0.01")
 * @param options.network - CAIP-2 network identifier
 * @returns Verification result with payer info if valid
 * 
 * @example
 * ```typescript
 * const result = await verifyPayment({
 *   paymentHeader: req.headers['x-payment'],
 *   expectedPrice: '$0.01',
 *   network: 'eip155:8453'
 * });
 * ```
 */
export async function verifyPayment(options: VerifyOptions): Promise<VerifyResult> {
  // ...
}
```

### README Updates

- Update README.md for new features
- Add examples for new functionality
- Keep installation instructions current

### Docs Folder

- Add new pages for major features
- Update configuration reference
- Include troubleshooting guides

---

## Project Areas

### CLI (`src/cli/`)

Commands for the `x402-deploy` CLI tool.

**Adding a new command:**

1. Create `src/cli/commands/your-command.ts`
2. Export the command function
3. Register in `src/cli/index.ts`
4. Add tests
5. Update CLI documentation

### Gateway (`src/gateway/`)

Payment verification middleware.

**Key files:**
- `middleware.ts` - Express middleware
- `mcp-wrapper.ts` - MCP server wrapper
- `payment-verifier.ts` - Payment verification logic
- `pricing-engine.ts` - Route-based pricing

### Deployers (`src/deployers/`)

Platform-specific deployment logic.

**Adding a new provider:**

1. Create `src/deployers/your-provider.ts`
2. Implement the `Deployer` interface
3. Register in `src/deployers/index.ts`
4. Add configuration options
5. Write integration tests
6. Update documentation

### Discovery (`src/discovery/`)

x402scan registration and discovery documents.

### Dashboard (`src/dashboard/`)

Analytics and webhook handling.

---

## Community

### Getting Help

- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Questions and ideas
- **Discord** - Real-time chat

### Recognition

Contributors are recognized in:

- CHANGELOG.md for each release
- GitHub contributors page
- Special thanks in major releases

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to x402-deploy! 🎉
