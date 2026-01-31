# AGENT 16: TESTING
## 5-Phase Implementation Prompts

---

## PROMPT 1: UNIT TESTING INFRASTRUCTURE

**Context:** Build comprehensive unit testing framework for all platform components.

**Objective:** Create unit tests for utilities, hooks, and business logic.

**Requirements:**
1. **Test Setup** (`website-unified/vitest.config.ts`)
   ```typescript
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';
   import path from 'path';
   
   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: ['./test/setup.ts'],
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         exclude: ['node_modules/', 'test/'],
         thresholds: {
           global: {
             branches: 80,
             functions: 80,
             lines: 80,
             statements: 80,
           },
         },
       },
       include: ['**/*.test.ts', '**/*.test.tsx'],
     },
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './'),
       },
     },
   });
   ```

2. **Test Utilities** (`website-unified/test/utils.tsx`)
   ```typescript
   import { render, RenderOptions } from '@testing-library/react';
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { WagmiConfig } from 'wagmi';
   
   const createTestQueryClient = () => new QueryClient({
     defaultOptions: {
       queries: { retry: false },
       mutations: { retry: false },
     },
   });
   
   export function renderWithProviders(
     ui: React.ReactElement,
     options?: RenderOptions
   ) {
     const queryClient = createTestQueryClient();
     
     function Wrapper({ children }: { children: React.ReactNode }) {
       return (
         <QueryClientProvider client={queryClient}>
           <WagmiConfig config={testConfig}>
             {children}
           </WagmiConfig>
         </QueryClientProvider>
       );
     }
     
     return render(ui, { wrapper: Wrapper, ...options });
   }
   ```

3. **Utility Tests** (`website-unified/lib/__tests__/`)
   ```typescript
   // formatters.test.ts
   describe('formatters', () => {
     describe('formatCurrency', () => {
       it('formats USD correctly', () => {
         expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
       });
       
       it('handles negative values', () => {
         expect(formatCurrency(-100, 'USD')).toBe('-$100.00');
       });
       
       it('handles zero', () => {
         expect(formatCurrency(0, 'USD')).toBe('$0.00');
       });
     });
     
     describe('formatAddress', () => {
       it('truncates Ethereum addresses', () => {
         expect(formatAddress('0x1234567890abcdef1234567890abcdef12345678'))
           .toBe('0x1234...5678');
       });
       
       it('handles invalid addresses', () => {
         expect(formatAddress('invalid')).toBe('invalid');
       });
     });
   });
   ```

4. **Hook Tests** (`website-unified/hooks/__tests__/`)
   ```typescript
   // useBalance.test.ts
   import { renderHook, waitFor } from '@testing-library/react';
   import { useBalance } from '../useBalance';
   
   describe('useBalance', () => {
     it('fetches balance for address', async () => {
       const { result } = renderHook(() => useBalance('0x...'));
       
       await waitFor(() => expect(result.current.isSuccess).toBe(true));
       
       expect(result.current.data).toEqual({
         native: expect.any(BigInt),
         tokens: expect.any(Array),
       });
     });
     
     it('returns error for invalid address', async () => {
       const { result } = renderHook(() => useBalance('invalid'));
       
       await waitFor(() => expect(result.current.isError).toBe(true));
     });
   });
   ```

**Technical Stack:**
- Vitest for testing
- Testing Library
- MSW for mocking
- Coverage with v8
- TypeScript

**Deliverables:**
- Test configuration
- Test utilities
- Utility tests
- Hook tests

---

## PROMPT 2: COMPONENT TESTING

**Context:** Build component tests for UI components and pages.

**Objective:** Create comprehensive React component testing suite.

**Requirements:**
1. **Component Test Patterns** (`website-unified/components/__tests__/`)
   ```typescript
   // Button.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { Button } from '../ui/Button';
   
   describe('Button', () => {
     it('renders with text', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
     });
     
     it('handles click events', () => {
       const onClick = vi.fn();
       render(<Button onClick={onClick}>Click</Button>);
       
       fireEvent.click(screen.getByRole('button'));
       expect(onClick).toHaveBeenCalledTimes(1);
     });
     
     it('shows loading state', () => {
       render(<Button isLoading>Submit</Button>);
       expect(screen.getByRole('button')).toBeDisabled();
       expect(screen.getByTestId('spinner')).toBeInTheDocument();
     });
     
     it('applies variant styles', () => {
       render(<Button variant="primary">Primary</Button>);
       expect(screen.getByRole('button')).toHaveClass('bg-primary');
     });
   });
   ```

2. **Form Component Tests** (`website-unified/components/__tests__/forms/`)
   ```typescript
   // ServiceRegistrationForm.test.tsx
   import { render, screen, fireEvent, waitFor } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { ServiceRegistrationForm } from '../../marketplace/ServiceRegistrationForm';
   
   describe('ServiceRegistrationForm', () => {
     const onSubmit = vi.fn();
     
     beforeEach(() => {
       onSubmit.mockClear();
     });
     
     it('validates required fields', async () => {
       render(<ServiceRegistrationForm onSubmit={onSubmit} />);
       
       fireEvent.click(screen.getByRole('button', { name: /submit/i }));
       
       await waitFor(() => {
         expect(screen.getByText(/name is required/i)).toBeInTheDocument();
         expect(screen.getByText(/description is required/i)).toBeInTheDocument();
       });
       
       expect(onSubmit).not.toHaveBeenCalled();
     });
     
     it('submits valid form data', async () => {
       const user = userEvent.setup();
       render(<ServiceRegistrationForm onSubmit={onSubmit} />);
       
       await user.type(screen.getByLabelText(/name/i), 'My Service');
       await user.type(screen.getByLabelText(/description/i), 'A great service');
       await user.selectOptions(screen.getByLabelText(/category/i), 'trading');
       await user.type(screen.getByLabelText(/price/i), '9.99');
       
       await user.click(screen.getByRole('button', { name: /submit/i }));
       
       await waitFor(() => {
         expect(onSubmit).toHaveBeenCalledWith({
           name: 'My Service',
           description: 'A great service',
           category: 'trading',
           price: '9.99',
         });
       });
     });
   });
   ```

3. **Accessibility Tests** (`website-unified/test/a11y.test.tsx`)
   ```typescript
   import { axe, toHaveNoViolations } from 'jest-axe';
   import { render } from '@testing-library/react';
   
   expect.extend(toHaveNoViolations);
   
   describe('Accessibility', () => {
     it('Button has no accessibility violations', async () => {
       const { container } = render(<Button>Click me</Button>);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });
     
     it('Form has no accessibility violations', async () => {
       const { container } = render(<ServiceRegistrationForm onSubmit={() => {}} />);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });
     
     it('Modal has proper ARIA attributes', async () => {
       const { container } = render(<Modal isOpen={true}>Content</Modal>);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });
   });
   ```

4. **Snapshot Tests** (`website-unified/components/__tests__/snapshots/`)
   ```typescript
   // ServiceCard.snapshot.test.tsx
   import { render } from '@testing-library/react';
   import { ServiceCard } from '../../marketplace/ServiceCard';
   
   describe('ServiceCard Snapshots', () => {
     const mockService = {
       id: '1',
       name: 'Trading Signals',
       description: 'AI-powered trading signals',
       category: 'trading',
       price: '49.99',
       rating: 4.5,
     };
     
     it('matches snapshot', () => {
       const { container } = render(<ServiceCard service={mockService} />);
       expect(container).toMatchSnapshot();
     });
     
     it('matches snapshot when loading', () => {
       const { container } = render(<ServiceCard service={mockService} isLoading />);
       expect(container).toMatchSnapshot();
     });
   });
   ```

**Technical Requirements:**
- Testing Library best practices
- User event simulation
- Accessibility testing
- Snapshot testing
- Visual regression (optional)

**Deliverables:**
- Component test patterns
- Form testing
- Accessibility tests
- Snapshot tests

---

## PROMPT 3: INTEGRATION TESTING

**Context:** Build integration tests for API routes and database operations.

**Objective:** Create integration tests for backend functionality.

**Requirements:**
1. **API Route Tests** (`website-unified/app/api/__tests__/`)
   ```typescript
   // services.test.ts
   import { createMocks } from 'node-mocks-http';
   import { GET, POST } from '../marketplace/services/route';
   import { prismaMock } from '@/test/mocks/prisma';
   
   describe('GET /api/marketplace/services', () => {
     it('returns paginated services', async () => {
       prismaMock.service.findMany.mockResolvedValue([
         { id: '1', name: 'Service 1' },
         { id: '2', name: 'Service 2' },
       ]);
       
       const { req } = createMocks({
         method: 'GET',
         query: { page: '1', limit: '10' },
       });
       
       const response = await GET(req);
       const data = await response.json();
       
       expect(response.status).toBe(200);
       expect(data.services).toHaveLength(2);
       expect(data.total).toBeDefined();
     });
     
     it('filters by category', async () => {
       prismaMock.service.findMany.mockResolvedValue([
         { id: '1', name: 'Trading Service', category: 'trading' },
       ]);
       
       const { req } = createMocks({
         method: 'GET',
         query: { category: 'trading' },
       });
       
       const response = await GET(req);
       const data = await response.json();
       
       expect(data.services[0].category).toBe('trading');
     });
   });
   
   describe('POST /api/marketplace/services', () => {
     it('creates new service with valid data', async () => {
       const newService = {
         name: 'New Service',
         description: 'Description',
         category: 'trading',
         price: '9.99',
       };
       
       prismaMock.service.create.mockResolvedValue({
         id: '1',
         ...newService,
       });
       
       const { req } = createMocks({
         method: 'POST',
         body: newService,
       });
       
       const response = await POST(req);
       const data = await response.json();
       
       expect(response.status).toBe(201);
       expect(data.id).toBeDefined();
     });
     
     it('returns 400 for invalid data', async () => {
       const { req } = createMocks({
         method: 'POST',
         body: { name: '' }, // Invalid
       });
       
       const response = await POST(req);
       
       expect(response.status).toBe(400);
     });
   });
   ```

2. **Database Integration Tests** (`website-unified/lib/db/__tests__/`)
   ```typescript
   // userRepository.integration.test.ts
   import { UserRepository } from '../repositories/userRepository';
   import { prisma } from '../client';
   
   describe('UserRepository Integration', () => {
     const repo = new UserRepository(prisma);
     
     beforeEach(async () => {
       await prisma.user.deleteMany();
     });
     
     afterAll(async () => {
       await prisma.$disconnect();
     });
     
     it('creates and retrieves user', async () => {
       const user = await repo.create({
         address: '0x1234567890abcdef1234567890abcdef12345678',
         chainId: 1,
       });
       
       expect(user.id).toBeDefined();
       
       const retrieved = await repo.findByAddress(user.address);
       expect(retrieved?.id).toBe(user.id);
     });
     
     it('updates user profile', async () => {
       const user = await repo.create({
         address: '0x...',
         chainId: 1,
       });
       
       await repo.update(user.id, {
         profile: { name: 'Test User' },
       });
       
       const updated = await repo.findById(user.id);
       expect(updated?.profile?.name).toBe('Test User');
     });
   });
   ```

3. **MSW API Mocking** (`website-unified/test/mocks/handlers.ts`)
   ```typescript
   import { rest } from 'msw';
   
   export const handlers = [
     // Marketplace services
     rest.get('/api/marketplace/services', (req, res, ctx) => {
       return res(
         ctx.json({
           services: [
             { id: '1', name: 'Service 1' },
             { id: '2', name: 'Service 2' },
           ],
           total: 2,
         })
       );
     }),
     
     // Price data
     rest.get('/api/analytics/market/prices', (req, res, ctx) => {
       const symbols = req.url.searchParams.get('symbols')?.split(',');
       const prices = symbols?.map(symbol => ({
         symbol,
         price: Math.random() * 1000,
       }));
       
       return res(ctx.json({ prices }));
     }),
     
     // Error scenarios
     rest.get('/api/error-test', (req, res, ctx) => {
       return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
     }),
   ];
   ```

4. **WebSocket Tests** (`website-unified/lib/websocket/__tests__/`)
   ```typescript
   // wsClient.test.ts
   import WS from 'jest-websocket-mock';
   import { WebSocketClient } from '../client';
   
   describe('WebSocketClient', () => {
     let server: WS;
     let client: WebSocketClient;
     
     beforeEach(() => {
       server = new WS('ws://localhost:1234');
       client = new WebSocketClient('ws://localhost:1234');
     });
     
     afterEach(() => {
       WS.clean();
     });
     
     it('connects to server', async () => {
       await client.connect();
       await server.connected;
       
       expect(client.isConnected()).toBe(true);
     });
     
     it('receives messages', async () => {
       const messageHandler = vi.fn();
       client.on('message', messageHandler);
       
       await client.connect();
       
       server.send(JSON.stringify({ type: 'PRICE_UPDATE', data: { BTC: 50000 } }));
       
       expect(messageHandler).toHaveBeenCalledWith({
         type: 'PRICE_UPDATE',
         data: { BTC: 50000 },
       });
     });
     
     it('reconnects on disconnect', async () => {
       await client.connect();
       
       server.close();
       
       // Wait for reconnection
       await new Promise(resolve => setTimeout(resolve, 1000));
       
       expect(client.isConnected()).toBe(true);
     });
   });
   ```

**Technical Requirements:**
- API route testing
- Database integration tests
- MSW for API mocking
- WebSocket testing
- Test isolation

**Deliverables:**
- API route tests
- Database tests
- Mock handlers
- WebSocket tests

---

## PROMPT 4: END-TO-END TESTING

**Context:** Build E2E tests for critical user flows.

**Objective:** Create Playwright E2E tests for complete user journeys.

**Requirements:**
1. **Playwright Config** (`website-unified/playwright.config.ts`)
   ```typescript
   import { defineConfig, devices } from '@playwright/test';
   
   export default defineConfig({
     testDir: './e2e',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: 'html',
     use: {
       baseURL: 'http://localhost:3000',
       trace: 'on-first-retry',
       screenshot: 'only-on-failure',
     },
     projects: [
       { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
       { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
       { name: 'webkit', use: { ...devices['Desktop Safari'] } },
       { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
       { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
     ],
     webServer: {
       command: 'pnpm dev',
       url: 'http://localhost:3000',
       reuseExistingServer: !process.env.CI,
     },
   });
   ```

2. **Auth E2E Tests** (`website-unified/e2e/auth.spec.ts`)
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test.describe('Authentication', () => {
     test('connects wallet and signs in', async ({ page }) => {
       await page.goto('/');
       
       // Click connect wallet
       await page.click('[data-testid="connect-wallet"]');
       
       // Select MetaMask (mocked)
       await page.click('[data-testid="wallet-metamask"]');
       
       // Wait for connection
       await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();
       
       // Verify signed in state
       await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
     });
     
     test('shows error on rejected signature', async ({ page }) => {
       await page.goto('/');
       
       // Mock rejection
       await page.route('**/api/auth/verify', route => {
         route.fulfill({ status: 401, body: JSON.stringify({ error: 'Signature rejected' }) });
       });
       
       await page.click('[data-testid="connect-wallet"]');
       await page.click('[data-testid="wallet-metamask"]');
       
       await expect(page.locator('[data-testid="error-message"]')).toContainText('Signature rejected');
     });
   });
   ```

3. **Marketplace E2E Tests** (`website-unified/e2e/marketplace.spec.ts`)
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test.describe('Marketplace', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/marketplace');
     });
     
     test('searches for services', async ({ page }) => {
       await page.fill('[data-testid="search-input"]', 'trading signals');
       await page.keyboard.press('Enter');
       
       await expect(page.locator('[data-testid="service-card"]')).toHaveCount(expect.any(Number));
       await expect(page.locator('[data-testid="service-card"]').first()).toContainText('trading');
     });
     
     test('filters by category', async ({ page }) => {
       await page.click('[data-testid="category-filter"]');
       await page.click('[data-testid="category-trading"]');
       
       await expect(page.url()).toContain('category=trading');
       
       const cards = page.locator('[data-testid="service-card"]');
       await expect(cards.first().locator('[data-testid="category-badge"]')).toContainText('Trading');
     });
     
     test('views service details', async ({ page }) => {
       await page.click('[data-testid="service-card"]').first();
       
       await expect(page.url()).toMatch(/\/marketplace\/service\/[\w-]+/);
       await expect(page.locator('[data-testid="service-title"]')).toBeVisible();
       await expect(page.locator('[data-testid="subscribe-button"]')).toBeVisible();
     });
     
     test('subscribes to service', async ({ page }) => {
       await page.click('[data-testid="service-card"]').first();
       await page.click('[data-testid="subscribe-button"]');
       
       // Select tier
       await page.click('[data-testid="tier-professional"]');
       
       // Confirm payment
       await page.click('[data-testid="confirm-payment"]');
       
       await expect(page.locator('[data-testid="success-message"]')).toContainText('Subscribed successfully');
     });
   });
   ```

4. **Tool Playground E2E Tests** (`website-unified/e2e/playground.spec.ts`)
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test.describe('Tool Playground', () => {
     test('executes a tool', async ({ page }) => {
       await page.goto('/playground/tools');
       
       // Search for tool
       await page.fill('[data-testid="tool-search"]', 'getBalance');
       await page.click('[data-testid="tool-card"]').first();
       
       // Fill parameters
       await page.fill('[data-testid="param-address"]', '0x...');
       await page.selectOption('[data-testid="param-chain"]', 'ethereum');
       
       // Execute
       await page.click('[data-testid="execute-button"]');
       
       // Wait for result
       await expect(page.locator('[data-testid="output-display"]')).toBeVisible();
       await expect(page.locator('[data-testid="execution-status"]')).toContainText('Success');
     });
     
     test('saves execution to history', async ({ page }) => {
       // Execute a tool...
       
       await page.goto('/playground/workspace');
       
       await expect(page.locator('[data-testid="history-item"]')).toHaveCount(expect.any(Number));
     });
   });
   ```

**Technical Requirements:**
- Playwright test runner
- Multi-browser testing
- Mobile testing
- Visual regression
- CI integration

**Deliverables:**
- Playwright configuration
- Authentication E2E tests
- Marketplace E2E tests
- Playground E2E tests

---

## PROMPT 5: TEST AUTOMATION & CI

**Context:** Set up continuous testing pipeline and automation.

**Objective:** Create automated testing infrastructure for CI/CD.

**Requirements:**
1. **GitHub Actions Workflow** (`.github/workflows/test.yml`)
   ```yaml
   name: Test Suite
   
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main]
   
   jobs:
     unit-tests:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'pnpm'
         - run: pnpm install
         - run: pnpm test:unit
         - uses: codecov/codecov-action@v3
           with:
             files: ./coverage/lcov.info
   
     integration-tests:
       runs-on: ubuntu-latest
       services:
         postgres:
           image: postgres:15
           env:
             POSTGRES_PASSWORD: postgres
           ports:
             - 5432:5432
         redis:
           image: redis:7
           ports:
             - 6379:6379
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v4
         - run: pnpm install
         - run: pnpm prisma migrate deploy
         - run: pnpm test:integration
   
     e2e-tests:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v4
         - run: pnpm install
         - run: npx playwright install --with-deps
         - run: pnpm build
         - run: pnpm test:e2e
         - uses: actions/upload-artifact@v3
           if: always()
           with:
             name: playwright-report
             path: playwright-report/
   ```

2. **Test Scripts** (`website-unified/package.json`)
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:unit": "vitest run --coverage",
       "test:integration": "vitest run --config vitest.integration.config.ts",
       "test:e2e": "playwright test",
       "test:e2e:ui": "playwright test --ui",
       "test:all": "pnpm test:unit && pnpm test:integration && pnpm test:e2e",
       "test:watch": "vitest watch",
       "test:coverage": "vitest run --coverage --reporter=verbose"
     }
   }
   ```

3. **Test Reporting** (`website-unified/test/reporters/`)
   ```typescript
   // customReporter.ts
   import { Reporter, TestCase, TestResult } from 'vitest';
   
   class CustomReporter implements Reporter {
     onTestStart(test: TestCase): void {
       console.log(`Running: ${test.name}`);
     }
     
     onTestEnd(test: TestCase, result: TestResult): void {
       if (result.status === 'failed') {
         // Send to monitoring
         sendToMonitoring({
           test: test.name,
           file: test.file,
           error: result.error,
         });
       }
     }
     
     onFinished(): void {
       generateReport();
     }
   }
   ```

4. **Test Data Factories** (`website-unified/test/factories/`)
   ```typescript
   // userFactory.ts
   import { faker } from '@faker-js/faker';
   
   export function createUser(overrides?: Partial<User>): User {
     return {
       id: faker.string.uuid(),
       address: faker.finance.ethereumAddress(),
       chainId: 1,
       createdAt: faker.date.past(),
       updatedAt: faker.date.recent(),
       profile: {
         name: faker.person.fullName(),
         avatar: faker.image.avatar(),
       },
       ...overrides,
     };
   }
   
   export function createManyUsers(count: number): User[] {
     return Array.from({ length: count }, () => createUser());
   }
   
   // serviceFactory.ts
   export function createService(overrides?: Partial<Service>): Service {
     return {
       id: faker.string.uuid(),
       name: faker.company.name(),
       description: faker.company.catchPhrase(),
       category: faker.helpers.arrayElement(['trading', 'data', 'ai']),
       price: faker.commerce.price(),
       rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
       ...overrides,
     };
   }
   ```

**Technical Requirements:**
- GitHub Actions integration
- Parallel test execution
- Coverage reporting
- Artifact storage
- Slack notifications

**Deliverables:**
- CI workflow configuration
- Test scripts
- Custom reporters
- Test data factories

---

**Integration Notes:**
- Unit tests for all utilities
- Component tests for UI
- Integration tests for API
- E2E tests for user flows
- CI/CD pipeline

**Success Criteria:**
- 80%+ code coverage
- All critical paths tested
- < 10 min CI runtime
- Zero flaky tests
- Automated reporting
- Branch protection rules
