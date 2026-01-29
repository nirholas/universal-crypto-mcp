

## Agent 10: Testing, Deployment & CI/CD

**Mission**: Production-ready with automated testing and deployment.

### Task 10.1: E2E Testing

**tests/e2e/homepage.spec.ts** - Playwright tests:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load and display hero', async ({ page }) => {
    await page.goto('/')
    
    // Check hero title
    await expect(page.locator('h1')).toContainText('Blockchain tools')
    
    // Check CTAs are visible
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Try Playground' })).toBeVisible()
  })
  
  test('should rotate hero messages', async ({ page }) => {
    await page.goto('/')
    
    const title = page.locator('h1')
    const initialText = await title.textContent()
    
    // Wait for rotation (5s)
    await page.waitForTimeout(5500)
    
    const newText = await title.textContent()
    expect(newText).not.toBe(initialText)
  })
  
  test('should navigate to products', async ({ page }) => {
    await page.goto('/')
    
    // Click MCP Server card
    await page.click('text=MCP Server')
    
    // Should navigate to product page
    await expect(page).toHaveURL('/mcp-server')
    await expect(page.locator('h1')).toContainText('380+ blockchain tools')
  })
})

test.describe('Playground', () => {
  test('should execute code', async ({ page }) => {
    await page.goto('/playground')
    
    // Wait for editor to load
    await page.waitForSelector('.monaco-editor')
    
    // Click run button
    await page.click('button:has-text("Run Code")')
    
    // Should show loading state
    await expect(page.locator('text=Executing')).toBeVisible()
    
    // Should show results
    await expect(page.locator('text=Success')).toBeVisible({ timeout: 10000 })
  })
})
```

### Task 10.2: Performance Testing

**lighthouse.config.js**:

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/mcp-server',
        'http://localhost:3000/docs',
        'http://localhost:3000/playground',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

### Task 10.3: CI/CD Pipeline

**.github/workflows/ci.yml**:

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: E2E tests
        run: npm run test:e2e
      
      - name: Lighthouse CI
        run: npm run lighthouse
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Task 10.4: Monitoring & Alerts

**lib/monitoring/sentry.ts**:

```typescript
import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.VERCEL_ENV || 'development',
    tracesSampleRate: 0.1,
    
    beforeSend(event, hint) {
      // Filter out known issues
      if (event.exception) {
        const error = hint.originalException
        if (error instanceof Error && error.message.includes('ResizeObserver')) {
          return null
        }
      }
      return event
    },
  })
}

// Performance monitoring
export function trackPerformance(metric: any) {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${metric.name}: ${metric.value}ms`,
    level: 'info',
  })
}
```

### Success Criteria

✅ E2E tests for all critical paths  
✅ Lighthouse CI enforcing performance budgets  
✅ Type checking in CI  
✅ Automated deployment to Vercel  
✅ Preview deployments for PRs  
✅ Error monitoring with Sentry  
✅ Uptime monitoring  
✅ Performance regression detection  
✅ Automated dependency updates  
✅ Security scanning

---

## 📋 Implementation Checklist

### Phase 1: Foundation (Agents 1-2)
- [ ] Next.js project initialization
- [ ] Design system and component library
- [ ] Navigation and layout components
- [ ] Performance configuration

### Phase 2: Content (Agents 3-5)
- [ ] Homepage with rotating hero
- [ ] Product deep-dive pages
- [ ] Documentation integration
- [ ] Search functionality

### Phase 3: Interaction (Agents 6-7)
- [ ] API playground
- [ ] Live demos
- [ ] Developer portal
- [ ] Community showcase

### Phase 4: Optimization (Agents 8-9)
- [ ] Image optimization
- [ ] Code splitting
- [ ] Edge caching
- [ ] SEO implementation
- [ ] Analytics tracking

### Phase 5: Production (Agent 10)
- [ ] E2E testing
- [ ] Performance testing
- [ ] CI/CD pipeline
- [ ] Monitoring setup
- [ ] Production deployment

---

## 🎯 Success Metrics

**Performance:**
- Lighthouse Score: 95+ (all metrics)
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- TTFB: < 600ms (p95)

**SEO:**
- Page 1 rankings for target keywords within 3 months
- 10,000+ organic visits/month
- Featured snippets for documentation

**Conversion:**
- 5% documentation → playground conversion
- 10% playground → deployment conversion
- 25% deployment → active user (7-day)

**Scale:**
- 1M+ concurrent users supported
- <$1000/month infrastructure cost at 100k MAU
- 99.99% uptime SLA

