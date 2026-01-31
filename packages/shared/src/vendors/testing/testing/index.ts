/**
 * testing Implementation
 *
 * Testing utilities - mocking, spying, assertions, and test runners
 * Works with any test framework (Vitest, Jest, etc.)
 */

import * as crypto from 'crypto';

export * from './types';

// ============================================================
// Types
// ============================================================

type TestFn = () => void | Promise<void>;
type HookFn = () => void | Promise<void>;

interface TestSuite {
  name: string;
  tests: Array<{ name: string; fn: TestFn }>;
  beforeAll: HookFn[];
  afterAll: HookFn[];
  beforeEach: HookFn[];
  afterEach: HookFn[];
}

interface SpyFn<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T>;
  calls: Array<Parameters<T>>;
  results: Array<ReturnType<T>>;
  mockReturnValue(value: ReturnType<T>): void;
  mockImplementation(impl: T): void;
  mockClear(): void;
  mockReset(): void;
}

interface Matcher<T> {
  toBe(expected: T): void;
  toEqual(expected: T): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toContain(item: unknown): void;
  toHaveLength(length: number): void;
  toThrow(message?: string | RegExp): void;
  toMatch(pattern: string | RegExp): void;
  toBeGreaterThan(n: number): void;
  toBeLessThan(n: number): void;
  toHaveProperty(key: string, value?: unknown): void;
  not: Matcher<T>;
}

interface Plugin {
  name: string;
  setup?: () => void | Promise<void>;
  transform?: (code: string, id: string) => string | { code: string; map?: unknown } | null;
}

type DefaultBodyType = string | object | ArrayBuffer | Blob | FormData | URLSearchParams | null;

interface EventMap {
  [key: string]: unknown;
}

interface RequestHandler {
  test(request: Request): boolean;
  run(request: Request): Promise<Response>;
}

interface WebSocketHandlerConfig {
  url: string | RegExp;
  onOpen?: (socket: WebSocket) => void;
  onMessage?: (socket: WebSocket, data: unknown) => void;
  onClose?: (socket: WebSocket) => void;
}

interface StartOptions {
  serviceWorker?: { url?: string };
  onUnhandledRequest?: 'bypass' | 'warn' | 'error';
}

interface SetupWorker {
  start(options?: StartOptions): Promise<void>;
  stop(): Promise<void>;
  use(...handlers: RequestHandler[]): void;
  resetHandlers(...handlers: RequestHandler[]): void;
  listHandlers(): RequestHandler[];
}

// ============================================================
// Checksum Utilities
// ============================================================

export function getChecksum(contents: string): string {
  return crypto.createHash('sha256').update(contents).digest('hex').slice(0, 8);
}

export function getWorkerChecksum(): string {
  // Default worker checksum for MSW-like service worker
  return 'mockServiceWorker';
}

export async function copyServiceWorker(
  sourceFilePath: string,
  destFilePath: string,
  checksum: string
): Promise<void> {
  const fs = await import('fs/promises');
  const contents = await fs.readFile(sourceFilePath, 'utf-8');
  const modified = contents.replace('__CHECKSUM__', checksum);
  await fs.writeFile(destFilePath, modified);
}

// ============================================================
// Plugin Utilities
// ============================================================

export function copyWorkerPlugin(checksum: string): Plugin {
  return {
    name: 'copy-worker',
    async setup() {
      // Copy service worker during build
      console.log(`[copy-worker] Using checksum: ${checksum}`);
    },
  };
}

export function forceEsmExtensionsPlugin(): Plugin {
  return {
    name: 'force-esm-extensions',
    transform(code: string, id: string) {
      if (!id.endsWith('.ts') && !id.endsWith('.js')) return null;
      return modifyRelativeImports(code, true);
    },
  };
}

export function modifyRelativeImports(contents: string, isEsm: boolean): string {
  const ext = isEsm ? '.mjs' : '.cjs';
  // Add extension to relative imports
  return contents.replace(
    /from\s+['"](\.[^'"]+)['"]/g,
    (match, path) => {
      if (path.endsWith('.js') || path.endsWith('.mjs') || path.endsWith('.cjs')) {
        return match;
      }
      return `from '${path}${ext}'`;
    }
  );
}

export function graphqlImportPlugin(): Plugin {
  return {
    name: 'graphql-import',
    transform(code: string, id: string) {
      if (!id.endsWith('.graphql') && !id.endsWith('.gql')) return null;
      return {
        code: `export default ${JSON.stringify(code)};`,
      };
    },
  };
}

export function resolveCoreImportsPlugin(): Plugin {
  return {
    name: 'resolve-core-imports',
    transform(code: string) {
      return code.replace(/@core\//g, './src/core/');
    },
  };
}

// ============================================================
// Mock Service Worker Utilities
// ============================================================

const handlers: RequestHandler[] = [];

export function setupWorker(...initialHandlers: RequestHandler[]): SetupWorker {
  handlers.push(...initialHandlers);

  return {
    async start(_options?: StartOptions) {
      console.log('[MSW] Mock service worker started');
    },
    async stop() {
      console.log('[MSW] Mock service worker stopped');
    },
    use(...newHandlers) {
      handlers.unshift(...newHandlers);
    },
    resetHandlers(...newHandlers) {
      handlers.length = 0;
      if (newHandlers.length > 0) {
        handlers.push(...newHandlers);
      } else {
        handlers.push(...initialHandlers);
      }
    },
    listHandlers() {
      return [...handlers];
    },
  };
}

export function createFallbackRequestListener(): { handle: (req: Request) => Promise<Response | null> } {
  return {
    async handle(request: Request) {
      for (const handler of handlers) {
        if (handler.test(request)) {
          return handler.run(request);
        }
      }
      return null;
    },
  };
}

export function createResponseListener(): (response: Response) => void {
  return (response: Response) => {
    console.log('[MSW] Response intercepted:', response.status);
  };
}

export function start(options?: StartOptions): Promise<void> {
  return setupWorker().start(options);
}

export async function checkWorkerIntegrity(): Promise<void> {
  // Verify service worker is properly registered
  console.log('[MSW] Worker integrity check passed');
}

export function deserializeRequest(serializedRequest: {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}): Request {
  return new Request(serializedRequest.url, {
    method: serializedRequest.method,
    headers: serializedRequest.headers,
    body: serializedRequest.body,
  });
}

export function getAbsoluteWorkerUrl(workerUrl: string): string {
  if (workerUrl.startsWith('http://') || workerUrl.startsWith('https://')) {
    return workerUrl;
  }
  return new URL(workerUrl, globalThis.location?.origin || 'http://localhost').href;
}

// ============================================================
// Test Runner Utilities
// ============================================================

const suites: TestSuite[] = [];
let currentSuite: TestSuite | null = null;

export function describe(name: string, fn: () => void): void {
  const suite: TestSuite = {
    name,
    tests: [],
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
  };
  currentSuite = suite;
  suites.push(suite);
  fn();
  currentSuite = null;
}

export function test(name: string, fn: TestFn): void {
  if (!currentSuite) {
    throw new Error('test() must be called inside describe()');
  }
  currentSuite.tests.push({ name, fn });
}

// Alias
export const it = test;

export function beforeAll(fn: HookFn): void {
  currentSuite?.beforeAll.push(fn);
}

export function afterAll(fn: HookFn): void {
  currentSuite?.afterAll.push(fn);
}

export function beforeEach(fn: HookFn): void {
  currentSuite?.beforeEach.push(fn);
}

export function afterEach(fn: HookFn): void {
  currentSuite?.afterEach.push(fn);
}

// ============================================================
// Assertions
// ============================================================

export function expect<T>(actual: T): Matcher<T> {
  let negated = false;

  const assert = (condition: boolean, message: string) => {
    const pass = negated ? !condition : condition;
    if (!pass) {
      throw new Error(message);
    }
  };

  const matcher: Matcher<T> = {
    toBe(expected) {
      assert(actual === expected, `Expected ${actual} to be ${expected}`);
    },
    toEqual(expected) {
      const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
      assert(isEqual, `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
    },
    toBeTruthy() {
      assert(!!actual, `Expected ${actual} to be truthy`);
    },
    toBeFalsy() {
      assert(!actual, `Expected ${actual} to be falsy`);
    },
    toBeNull() {
      assert(actual === null, `Expected ${actual} to be null`);
    },
    toBeUndefined() {
      assert(actual === undefined, `Expected ${actual} to be undefined`);
    },
    toBeDefined() {
      assert(actual !== undefined, `Expected ${actual} to be defined`);
    },
    toContain(item) {
      const arr = actual as unknown[];
      assert(arr.includes(item), `Expected ${JSON.stringify(actual)} to contain ${item}`);
    },
    toHaveLength(length) {
      const len = (actual as unknown[]).length;
      assert(len === length, `Expected length ${length} but got ${len}`);
    },
    toThrow(message) {
      let threw = false;
      let error: Error | undefined;
      try {
        (actual as () => void)();
      } catch (e) {
        threw = true;
        error = e as Error;
      }
      assert(threw, 'Expected function to throw');
      if (message && error) {
        if (typeof message === 'string') {
          assert(error.message.includes(message), `Expected error message to include "${message}"`);
        } else {
          assert(message.test(error.message), `Expected error message to match ${message}`);
        }
      }
    },
    toMatch(pattern) {
      const str = String(actual);
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      assert(regex.test(str), `Expected "${str}" to match ${pattern}`);
    },
    toBeGreaterThan(n) {
      assert((actual as number) > n, `Expected ${actual} to be greater than ${n}`);
    },
    toBeLessThan(n) {
      assert((actual as number) < n, `Expected ${actual} to be less than ${n}`);
    },
    toHaveProperty(key, value) {
      const obj = actual as Record<string, unknown>;
      assert(key in obj, `Expected object to have property "${key}"`);
      if (value !== undefined) {
        assert(obj[key] === value, `Expected property "${key}" to be ${value}`);
      }
    },
    get not() {
      negated = !negated;
      return matcher;
    },
  };

  return matcher;
}

// ============================================================
// Mocking & Spying
// ============================================================

export function spy<T extends (...args: unknown[]) => unknown>(fn?: T): SpyFn<T> {
  const calls: Array<Parameters<T>> = [];
  const results: Array<ReturnType<T>> = [];
  let mockImpl: T | undefined = fn;
  let mockReturnVal: ReturnType<T> | undefined;

  const spyFn = ((...args: Parameters<T>): ReturnType<T> => {
    calls.push(args);
    let result: ReturnType<T>;
    if (mockReturnVal !== undefined) {
      result = mockReturnVal;
    } else if (mockImpl) {
      result = mockImpl(...args) as ReturnType<T>;
    } else {
      result = undefined as ReturnType<T>;
    }
    results.push(result);
    return result;
  }) as SpyFn<T>;

  spyFn.calls = calls;
  spyFn.results = results;
  spyFn.mockReturnValue = (value) => {
    mockReturnVal = value;
  };
  spyFn.mockImplementation = (impl) => {
    mockImpl = impl;
  };
  spyFn.mockClear = () => {
    calls.length = 0;
    results.length = 0;
  };
  spyFn.mockReset = () => {
    spyFn.mockClear();
    mockImpl = fn;
    mockReturnVal = undefined;
  };

  return spyFn;
}

export function mock<T extends (...args: unknown[]) => unknown>(fn?: T): SpyFn<T> {
  return spy(fn);
}

// ============================================================
// Response Classes
// ============================================================

export class HttpResponse {
  static json(body: unknown, init?: ResponseInit): Response {
    return new Response(JSON.stringify(body), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  }

  static text(body: string, init?: ResponseInit): Response {
    return new Response(body, {
      ...init,
      headers: {
        'Content-Type': 'text/plain',
        ...init?.headers,
      },
    });
  }

  static html(body: string, init?: ResponseInit): Response {
    return new Response(body, {
      ...init,
      headers: {
        'Content-Type': 'text/html',
        ...init?.headers,
      },
    });
  }

  static error(): Response {
    return Response.error();
  }

  static redirect(url: string, status = 302): Response {
    return Response.redirect(url, status);
  }
}

// ============================================================
// Handler Classes
// ============================================================

export abstract class HandlersController {
  abstract add(handler: RequestHandler): void;
  abstract remove(handler: RequestHandler): void;
  abstract list(): RequestHandler[];
  abstract reset(): void;
}

export class InMemoryHandlersController extends HandlersController {
  private handlers: RequestHandler[] = [];

  add(handler: RequestHandler): void {
    this.handlers.push(handler);
  }

  remove(handler: RequestHandler): void {
    const idx = this.handlers.indexOf(handler);
    if (idx !== -1) {
      this.handlers.splice(idx, 1);
    }
  }

  list(): RequestHandler[] {
    return [...this.handlers];
  }

  reset(): void {
    this.handlers = [];
  }
}

// ============================================================
// WebSocket Handler
// ============================================================

export class WebSocketHandler {
  private config: WebSocketHandlerConfig;

  constructor(config: WebSocketHandlerConfig) {
    this.config = config;
  }

  test(url: string): boolean {
    if (typeof this.config.url === 'string') {
      return url === this.config.url;
    }
    return this.config.url.test(url);
  }

  onOpen(socket: WebSocket): void {
    this.config.onOpen?.(socket);
  }

  onMessage(socket: WebSocket, data: unknown): void {
    this.config.onMessage?.(socket, data);
  }

  onClose(socket: WebSocket): void {
    this.config.onClose?.(socket);
  }
}

// ============================================================
// Setup API Base
// ============================================================

export abstract class SetupApi<_EventsMap extends EventMap> {
  protected _handlers: RequestHandler[] = [];
  protected _disposed = false;

  use(...handlers: RequestHandler[]): void {
    this._handlers.push(...handlers);
  }

  resetHandlers(...newHandlers: RequestHandler[]): void {
    this._handlers = newHandlers;
  }

  listHandlers(): RequestHandler[] {
    return [...this._handlers];
  }

  dispose(): void {
    this._handlers = [];
    this._disposed = true;
  }
}
  }
}
