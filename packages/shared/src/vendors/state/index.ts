/**
 * state Implementation
 *
 * State management utilities - atoms, stores, and selectors
 * Works standalone without React dependencies
 */

export * from './types';

// ============================================================
// Types
// ============================================================

type Listener<T> = (value: T, prev: T) => void;
type Unsubscribe = () => void;

interface AtomConfig<T> {
  key: string;
  default: T;
}

interface Atom<T> {
  key: string;
  default: T;
  get: () => T;
  set: (value: T | ((prev: T) => T)) => void;
  subscribe: (listener: Listener<T>) => Unsubscribe;
  reset: () => void;
}

interface SelectorConfig<T> {
  key: string;
  get: (opts: { get: <U>(atom: Atom<U>) => U }) => T;
}

interface Selector<T> {
  key: string;
  get: () => T;
  subscribe: (listener: Listener<T>) => Unsubscribe;
}

interface Store {
  get: <T>(atom: Atom<T>) => T;
  set: <T>(atom: Atom<T>, value: T | ((prev: T) => T)) => void;
  subscribe: <T>(atom: Atom<T>, listener: Listener<T>) => Unsubscribe;
  reset: <T>(atom: Atom<T>) => void;
}

interface Contact {
  id: string;
  first?: string;
  last?: string;
  twitter?: string;
  avatar?: string;
  notes?: string;
  createdAt: number;
}

interface SearchOptions {
  indexName: string;
  query: string;
  pageParam?: number;
  hitsPerPage?: number;
}

// ============================================================
// Core State Management
// ============================================================

const atomValues = new Map<string, unknown>();
const atomListeners = new Map<string, Set<Listener<unknown>>>();

export function atom<T>(config: AtomConfig<T>): Atom<T> {
  const { key, default: defaultValue } = config;

  if (!atomValues.has(key)) {
    atomValues.set(key, defaultValue);
  }

  if (!atomListeners.has(key)) {
    atomListeners.set(key, new Set());
  }

  return {
    key,
    default: defaultValue,
    get: () => atomValues.get(key) as T,
    set: (value) => {
      const prev = atomValues.get(key) as T;
      const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
      atomValues.set(key, next);
      atomListeners.get(key)?.forEach((listener) => listener(next, prev));
    },
    subscribe: (listener) => {
      atomListeners.get(key)?.add(listener as Listener<unknown>);
      return () => {
        atomListeners.get(key)?.delete(listener as Listener<unknown>);
      };
    },
    reset: () => {
      const prev = atomValues.get(key) as T;
      atomValues.set(key, defaultValue);
      atomListeners.get(key)?.forEach((listener) => listener(defaultValue, prev));
    },
  };
}

export function selector<T>(config: SelectorConfig<T>): Selector<T> {
  const { key, get: computeFn } = config;
  const listeners = new Set<Listener<T>>();
  let cachedValue: T | undefined;
  const dependencies = new Set<Atom<unknown>>();

  const compute = (): T => {
    dependencies.clear();
    const value = computeFn({
      get: <U>(dep: Atom<U>) => {
        dependencies.add(dep as Atom<unknown>);
        return dep.get();
      },
    });
    return value;
  };

  // Subscribe to dependencies
  const setupDependencies = () => {
    dependencies.forEach((dep) => {
      dep.subscribe(() => {
        const prev = cachedValue;
        cachedValue = compute();
        if (cachedValue !== prev) {
          listeners.forEach((l) => l(cachedValue as T, prev as T));
        }
      });
    });
  };

  return {
    key,
    get: () => {
      if (cachedValue === undefined) {
        cachedValue = compute();
        setupDependencies();
      }
      return cachedValue;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function createStore(): Store {
  return {
    get: <T>(a: Atom<T>) => a.get(),
    set: <T>(a: Atom<T>, value: T | ((prev: T) => T)) => a.set(value),
    subscribe: <T>(a: Atom<T>, listener: Listener<T>) => a.subscribe(listener),
    reset: <T>(a: Atom<T>) => a.reset(),
  };
}

let defaultStore: Store | null = null;

export function useStore(): Store {
  if (!defaultStore) {
    defaultStore = createStore();
  }
  return defaultStore;
}

// ============================================================
// Contact CRUD (Example State Operations)
// ============================================================

const contactsAtom = atom<Contact[]>({ key: 'contacts', default: [] });

export function set(contacts: Contact[]): void {
  contactsAtom.set(contacts);
}

export async function getContacts(query?: string): Promise<Contact[]> {
  await fakeNetwork();
  let contacts = contactsAtom.get();
  if (query) {
    const q = query.toLowerCase();
    contacts = contacts.filter(
      (c) =>
        c.first?.toLowerCase().includes(q) ||
        c.last?.toLowerCase().includes(q) ||
        c.twitter?.toLowerCase().includes(q)
    );
  }
  return contacts.sort((a, b) => b.createdAt - a.createdAt);
}

export async function createContact(
  data: Pick<Contact, 'first' | 'last' | 'twitter' | 'avatar' | 'notes'>
): Promise<Contact> {
  await fakeNetwork();
  const id = Math.random().toString(36).substring(2, 9);
  const contact: Contact = { ...data, id, createdAt: Date.now() };
  contactsAtom.set((prev) => [...prev, contact]);
  return contact;
}

export async function getContact(id: string): Promise<Contact | null> {
  await fakeNetwork();
  const contacts = contactsAtom.get();
  return contacts.find((c) => c.id === id) || null;
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
  await fakeNetwork();
  let updated: Contact | null = null;
  contactsAtom.set((prev) =>
    prev.map((c) => {
      if (c.id === id) {
        updated = { ...c, ...updates };
        return updated;
      }
      return c;
    })
  );
  return updated;
}

export async function deleteContact(id: string): Promise<boolean> {
  await fakeNetwork();
  const prev = contactsAtom.get();
  contactsAtom.set(prev.filter((c) => c.id !== id));
  return prev.length !== contactsAtom.get().length;
}

export async function fakeNetwork(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
}

// ============================================================
// Query Client (Simple Implementation)
// ============================================================

interface QueryState<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isError: boolean;
}

interface QueryClient {
  queries: Map<string, QueryState<unknown>>;
  get<T>(key: string): QueryState<T> | undefined;
  set<T>(key: string, state: QueryState<T>): void;
  invalidate(key: string): void;
  clear(): void;
}

let queryClient: QueryClient | null = null;

export function makeQueryClient(): QueryClient {
  return {
    queries: new Map(),
    get<T>(key: string) {
      return this.queries.get(key) as QueryState<T> | undefined;
    },
    set<T>(key: string, state: QueryState<T>) {
      this.queries.set(key, state);
    },
    invalidate(key: string) {
      this.queries.delete(key);
    },
    clear() {
      this.queries.clear();
    },
  };
}

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = makeQueryClient();
  }
  return queryClient;
}

// ============================================================
// Search (Algolia-compatible Interface)
// ============================================================

interface SearchResult<T> {
  hits: T[];
  page: number;
  nbPages: number;
  hitsPerPage: number;
  nbHits: number;
}

interface UseAlgoliaOptions {
  indexName: string;
  query: string;
  hitsPerPage?: number;
  staleTime?: number;
  gcTime?: number;
}

export async function search<TData>({
  indexName,
  query,
  pageParam = 0,
  hitsPerPage = 10,
}: SearchOptions): Promise<SearchResult<TData>> {
  // This would normally call Algolia API
  // For now, search local contacts
  await fakeNetwork();
  
  const allData = contactsAtom.get() as unknown as TData[];
  const filtered = query
    ? allData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
      )
    : allData;
  
  const start = pageParam * hitsPerPage;
  const hits = filtered.slice(start, start + hitsPerPage);
  
  return {
    hits,
    page: pageParam,
    nbPages: Math.ceil(filtered.length / hitsPerPage),
    hitsPerPage,
    nbHits: filtered.length,
  };
}

export function useAlgolia<TData>({
  indexName,
  query,
  hitsPerPage = 10,
}: UseAlgoliaOptions): {
  data: TData[];
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => Promise<void>;
} {
  let data: TData[] = [];
  let page = 0;
  let isLoading = false;
  let error: Error | null = null;

  const fetchNextPage = async () => {
    isLoading = true;
    try {
      const result = await search<TData>({ indexName, query, pageParam: page, hitsPerPage });
      data = [...data, ...result.hits];
      page++;
    } catch (e) {
      error = e as Error;
    }
    isLoading = false;
  };

  // Initial fetch
  fetchNextPage();

  return { data, isLoading, error, fetchNextPage };
}

export function chatAnswer(question: string): string {
  // Simple echo for chat interface
  return `I received your question: "${question}". Please implement your AI backend.`;
}

// ============================================================
// Babel Plugins (Stubs for build tools)
// ============================================================

type PluginOptions = Record<string, unknown>;
type PluginObj = { visitor: Record<string, unknown> };

export function debugLabelPlugin(
  _babel: unknown,
  _options?: PluginOptions
): PluginObj {
  return { visitor: {} };
}

export function reactRefreshPlugin(
  _babel: unknown,
  _options?: PluginOptions
): PluginObj {
  return { visitor: {} };
}

export function jotaiPreset(
  _babel: unknown,
  _options?: PluginOptions
): { plugins: PluginObj[] } {
  return {
    plugins: [debugLabelPlugin(_babel), reactRefreshPlugin(_babel)],
  };
}

// ============================================================
// Immutable Data Structures
// ============================================================

export class DraftMap<K, V> extends Map<K, V> {
  private _modified = false;

  set(key: K, value: V): this {
    this._modified = true;
    return super.set(key, value);
  }

  delete(key: K): boolean {
    this._modified = true;
    return super.delete(key);
  }

  get modified(): boolean {
    return this._modified;
  }
}

export class DraftSet<T> extends Set<T> {
  private _modified = false;

  add(value: T): this {
    this._modified = true;
    return super.add(value);
  }

  delete(value: T): boolean {
    this._modified = true;
    return super.delete(value);
  }

  get modified(): boolean {
    return this._modified;
  }
}

// ============================================================
// Immer-like Producer
// ============================================================

type Recipe<T> = (draft: T) => void | T;

interface ProducersFns {
  produce<T>(base: T, recipe: Recipe<T>): T;
}

export class Immer implements ProducersFns {
  produce<T>(base: T, recipe: Recipe<T>): T {
    // Simple implementation - deep clone and mutate
    const draft = structuredClone(base);
    const result = recipe(draft);
    return result !== undefined ? result : draft;
  }
}

// ============================================================
// Utility Classes
// ============================================================

export class Stock<T> {
  private value: T;
  private listeners = new Set<Listener<T>>();

  constructor(initial: T) {
    this.value = initial;
  }

  get(): T {
    return this.value;
  }

  set(value: T): void {
    const prev = this.value;
    this.value = value;
    this.listeners.forEach((l) => l(value, prev));
  }

  subscribe(listener: Listener<T>): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export class Any {
  private value: unknown;

  constructor(value?: unknown) {
    this.value = value;
  }

  get(): unknown {
    return this.value;
  }

  set(value: unknown): void {
    this.value = value;
  }
}

interface Reporter {
  report(message: string, data?: unknown): void;
}

export class CustomReporter implements Reporter {
  private logs: Array<{ message: string; data?: unknown; timestamp: number }> = [];

  report(message: string, data?: unknown): void {
    this.logs.push({ message, data, timestamp: Date.now() });
    console.log(`[Reporter] ${message}`, data || '');
  }

  getLogs(): typeof this.logs {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}
