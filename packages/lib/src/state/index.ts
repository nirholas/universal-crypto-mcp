/**
 * State Management Layer
 * 
 * Unified state management combining Zustand, Jotai, and TanStack Query.
 * 
 * Reference: /vendor/state/
 */

import { create, type StateCreator } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================
// Types
// ============================================================

export interface StoreOptions {
  name: string;
  persist?: boolean;
  devtools?: boolean;
}

// ============================================================
// Store Factory
// ============================================================

/**
 * Create a Zustand store with standard middleware
 */
export function createStore<T extends object>(
  initializer: StateCreator<T, [['zustand/immer', never]], []>,
  options: StoreOptions
) {
  let store = create<T>()(
    subscribeWithSelector(
      immer(initializer)
    )
  );

  if (options.devtools) {
    store = create<T>()(
      devtools(
        subscribeWithSelector(
          immer(initializer)
        ),
        { name: options.name }
      )
    );
  }

  if (options.persist) {
    store = create<T>()(
      devtools(
        persist(
          subscribeWithSelector(
            immer(initializer)
          ),
          { name: options.name }
        ),
        { name: options.name }
      )
    );
  }

  return store;
}

// ============================================================
// Re-exports
// ============================================================

export { create } from 'zustand';
export { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
export { immer } from 'zustand/middleware/immer';

// TanStack Query re-exports
export {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

// Immer re-exports
export { produce, enableMapSet, enablePatches } from 'immer';

// ============================================================
// Utility Hooks
// ============================================================

/**
 * Create a selector hook for a store
 */
export function createSelectors<T extends object>(store: ReturnType<typeof create<T>>) {
  const selectors = {} as {
    [K in keyof T]: () => T[K];
  };

  for (const key of Object.keys(store.getState()) as (keyof T)[]) {
    selectors[key] = () => store((state) => state[key]);
  }

  return selectors;
}
