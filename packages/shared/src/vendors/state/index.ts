/**
 * state Implementation
 *
 * Adapted from: async-state, atomic, immutable, store
 * See vendor/state/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export export async function search<TData>({
  indexName,
  query,
  pageParam,
  hitsPerPage = 10,
}: SearchOptions): Promise< {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: search');
}

// From vendor code
export function useAlgolia<TData>({
  indexName,
  query,
  hitsPerPage = 10,
  staleTime,
  gcTime,
}: UseAlgoliaOptions) {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: useAlgolia');
}

// From vendor code
export function chatAnswer(_question: string) {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: chatAnswer');
}

// From vendor code
export function makeQueryClient() {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: makeQueryClient');
}

// From vendor code
export export function getQueryClient() {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: getQueryClient');
}

// From vendor code
export export async function getContacts(query?: string) {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: getContacts');
}

// From vendor code
export export async function createContact(
  data: Pick<Contact, 'first' | 'last' | 'twitter' | 'avatar' | 'notes'>,
) {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: createContact');
}

// From vendor code
export export async function getContact(id: string) {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: getContact');
}

// From vendor code
export export async function updateContact(id: string, updates: Partial<Contact>) {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: updateContact');
}

// From vendor code
export export async function deleteContact(id: string) {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: deleteContact');
}

// From vendor code
export function set(contacts: Contact[]) {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: set');
}

// From vendor code
export async function fakeNetwork() {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: fakeNetwork');
}

// From vendor code
export function debugLabelPlugin(
  { types: t }: typeof babel,
  options?: PluginOptions,
): PluginObj {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: debugLabelPlugin');
}

// From vendor code
export function reactRefreshPlugin(
  { types: t }: typeof babel,
  options?: PluginOptions,
): PluginObj {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: reactRefreshPlugin');
}

// From vendor code
export function jotaiPreset(
  _: typeof babel,
  options?: PluginOptions,
): {
  // TODO: Implement - see vendor/state/
  throw new Error('Not implemented: jotaiPreset');
}

// UCM expected export
export function createStore(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/state/ patterns
  throw new Error('Not implemented: createStore');
}

// UCM expected export
export function useStore(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/state/ patterns
  throw new Error('Not implemented: useStore');
}

// UCM expected export
export function atom(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/state/ patterns
  throw new Error('Not implemented: atom');
}

// UCM expected export
export function selector(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/state/ patterns
  throw new Error('Not implemented: selector');
}

// ============================================================
// Classes
// ============================================================

// From vendor code
export class Foo {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: Foo');
  }
}

// From vendor code
export class Foo {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: Foo');
  }
}

// From vendor code
export class Stock {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: Stock');
  }
}

// From vendor code
export class X {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: X');
  }
}

// From vendor code
export export class Any {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: Any');
  }
}

// From vendor code
export export class Immer implements ProducersFns {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: Immer');
  }
}

// From vendor code
export class DraftMap extends Map {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: DraftMap');
  }
}

// From vendor code
export class DraftSet extends Set {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: DraftSet');
  }
}

// From vendor code
export class CustomReporter implements Reporter {
  constructor() {
    // TODO: Implement - see vendor/state/
    throw new Error('Not implemented: CustomReporter');
  }
}
