/**
 * state Types
 *
 * Auto-extracted from vendor/state/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

export interface PluginOptions {
  customAtomNames?: string[]
}

export interface Atom<Value> {
  toString: () => string
  read: Read<Value>
  debugLabel?: string
  /**
   * To ONLY be used by Jotai libraries to mark atoms as private. Subject to change.
   * @private
   */
  debugPrivate?: boolean
  /**
   * Fires after atom is referenced by the store for the first time
   * This is an internal API and subject to change without notice.
   */
  INTERNAL_onInit?: (store: Store) => void
}

export interface WritableAtom<
  Value,
  Args extends unknown[],
  Result,
> extends Atom<Value> {
  read: Read<Value, SetAtom<Args, Result>>
  write: Write<Args, Result>
  onMount?: OnMount<Args, Result>
}

interface Foo {
			a: {b: number}

interface Bar {
			foo: Foo
		}

interface State {
	readonly num: number
	readonly foo?: string
	bar: string
	readonly baz: {
		readonly x: number
		readonly y: number
	}

interface Action {
		type: string
		payload: number
	}

interface ProducersFns {
	produce: IProduce
	produceWithPatches: IProduceWithPatches
}

interface ProxyBaseState extends ImmerBaseState {
	parent_?: ImmerState
	revoke_(): void
}

export interface ProxyObjectState extends ProxyBaseState {
	type_: ArchType.Object
	base_: any
	copy_: any
	draft_: Drafted<AnyObject, ProxyObjectState>
}

export interface ProxyArrayState extends ProxyBaseState {
	type_: ArchType.Array
	base_: AnyArray
	copy_: AnyArray | null
	draft_: Drafted<AnyArray, ProxyArrayState>
	operationMethod?: string
	allIndicesReassigned_?: boolean
}

export interface ImmerScope {
	patches_?: Patch[]
	inversePatches_?: Patch[]
	patchPlugin_?: PatchesPlugin
	mapSetPlugin_?: MapSetPlugin
	arrayMethodsPlugin_?: ArrayMethodsPlugin
	canAutoFreeze_: boolean
	drafts_: any[]
	parent_?: ImmerScope
	patchListener_?: PatchListener
	immer_: Immer
	unfinalizedDrafts_: number
	handledSet_: Set<any>
	processedForPatches_: Set<any>
}

export interface Patch {
	op: "replace" | "remove" | "add"
	path: (string | number)[]
	value?: any
}

export interface IProduce {
	/** Curried producer that infers the recipe from the curried output function (e.g. when passing to setState) */
	<Curried>(
		recipe: InferRecipeFromCurried<Curried>,
		initialState?: InferInitialStateFromCurried<Curried>
	): Curried

	/** Curried producer that infers curried from the recipe  */
	<Recipe extends AnyFunc>(recipe: Recipe): InferCurriedFromRecipe<
		Recipe,
		false
	>

	/** Curried producer that infers curried from the State generic, which is explicitly passed in.  */
	<State>(
		recipe: (
			state: Draft<State>,
			initialState: State
		) => ValidRecipeReturnType<State>
	): (state?: State) => State
	<State, Args extends any[]>(
		recipe: (
			state: Draft<State>,
			...args: Args
		) => ValidRecipeReturnType<State>,
		initialState: State
	): (state?: State, ...args: Args) => State
	<State>(recipe: (state: Draft<State>) => ValidRecipeReturnType<State>): (
		state: State
	) => State
	<State, Args extends any[]>(
		recipe: (state: Draft<State>, ...args: Args) => ValidRecipeReturnType<State>
	): (state: State, ...args: Args) => State

	/** Curried producer with initial state, infers recipe from initial state */
	<State, Recipe extends Function>(
		recipe: Recipe,
		initialState: State
	): InferCurriedFromInitialStateAndRecipe<State, Recipe, false>

	/** Normal producer */
	<Base, D = Draft<Base>>( // By using a default inferred D, rather than Draft<Base> in the recipe, we can override it.
		base: Base,
		recipe: (draft: D) => ValidRecipeReturnType<D>,
		listener?: PatchListener
	): Base
}

export interface IProduceWithPatches {
	// Types copied from IProduce, wrapped with PatchesTuple
	<Recipe extends AnyFunc>(recipe: Recipe): InferCurriedFromRecipe<Recipe, true>
	<State, Recipe extends Function>(
		recipe: Recipe,
		initialState: State
	): InferCurriedFromInitialStateAndRecipe<State, Recipe, true>
	<Base, D = Draft<Base>>(
		base: Base,
		recipe: (draft: D) => ValidRecipeReturnType<D>,
		listener?: PatchListener
	): PatchesTuple<Base>
}

export interface ImmerBaseState {
	parent_?: ImmerState
	scope_: ImmerScope
	modified_: boolean
	finalized_: boolean
	isManual_: boolean
	assigned_: Map<any, boolean> | undefined
	key_?: string | number | symbol
	callbacks_: ((scope: ImmerScope) => void)[]
	draftLocations_?: Map<any, (string | number | symbol)[]>
}

// ============================================================
// Types from vendor code
// ============================================================

type Getter = <Value>(atom: Atom<Value>) => Value

type Setter = <Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
) => Result

type SetAtom<Args extends unknown[], Result> = <A extends Args>(
  ...args: A
) => Result

/**
 * setSelf is for internal use only and subject to change without notice.
 */
type Read<Value, SetSelf = never> = (
  get: Getter,
  options: { readonly signal: AbortSignal;

type AnyValue = unknown
type AnyError = unknown
type AnyAtom = Atom<AnyValue>
type AnyWritableAtom = WritableAtom<AnyValue, unknown[], unknown>
type OnUnmount = () => void
type Getter = Parameters<AnyAtom['read']>[0]
type Setter = Parameters<AnyWritableAtom['write']>[1]
type EpochNumber = number

/**
 * Mutable atom state,
 * tracked for both mounted and unmounted atoms in a store.
 *
 * This should be garbage collectable.
 * We can mutate it during atom read. (except for fields with TODO)
 */
type AtomState<Value = AnyValue> = {
  /**
   * Map of atoms that the atom depends on.
   * The map value is the epoch number of the dependency.
   */
  readonly d: Map<AnyAtom, EpochNumber>
  /**
   * Set of atoms with pending promise that depend on the atom.
   *
   * This may cause memory leaks, but it's for the capability to continue promises
   * TODO(daishi): revisit how to handle this
   */
  readonly p: Set<AnyAtom>
  /** The epoch number of the atom. */
  n: EpochNumber
  /** Atom value */
  v?: Value
  /** Atom error */
  e?: AnyError
}

/**
 * State tracked for mounted atoms. An atom is considered "mounted" if it has a
 * subscriber, or is a transitive dependency of another atom that has a
 * subscriber.
 * The mounted state of an atom is freed once it is no longer mounted.
 */
type Mounted = {
  /** Set of listeners to notify when the atom value changes. */
  readonly l: Set<() => void>
  /** Set of mounted atoms that the atom depends on. */
  readonly d: Set<AnyAtom>
  /** Set of mounted atoms that depends on the atom. */
  readonly t: Set<AnyAtom>
  /** Function to run when the atom is unmounted. */
  u?: () => void
}

type WeakMapLike<K extends object, V> = {
  get(key: K): V | undefined
  set(key: K, value: V): void
  has(key: K): boolean
  delete(key: K): boolean
}

type SetLike<T> = {
  readonly size: number
  add(value: T): void
  has(value: T): boolean
  delete(value: T): boolean
  clear(): void
  forEach(callback: (value: T) => void): void
  [Symbol.iterator](): IterableIterator<T>
}

type AtomStateMap = WeakMapLike<AnyAtom, AtomState>
type MountedMap = WeakMapLike<AnyAtom, Mounted>
type InvalidatedAtoms = WeakMapLike<AnyAtom, EpochNumber>
type ChangedAtoms = SetLike<AnyAtom>
type Callbacks = SetLike<() => void>

type AtomRead = <Value>(
  store: Store,
  atom: Atom<Value>,
  ...params: Parameters<Atom<Value>['read']>
) => Value
type AtomWrite = <Value, Args extends unknown[], Result>(
  store: Store,
  atom: WritableAtom<Value, Args, Result>,
  ...params: Parameters<WritableAtom<Value, Args, Result>['write']>
) => Result
type AtomOnInit = <Value>(store: Store, atom: Atom<Value>) => void
type AtomOnMount = <Value, Args extends unknown[], Result>(
  store: Store,
  atom: WritableAtom<Value, Args, Result>,
  setAtom: (...args: Args) => Result,
) => OnUnmount | void

type EnsureAtomState = <Value>(
  store: Store,
  atom: Atom<Value>,
) => AtomState<Value>
type FlushCallbacks = (store: Store) => void
type RecomputeInvalidatedAtoms = (store: Store) => void
type ReadAtomState = <Value>(
  store: Store,
  atom: Atom<Value>,
) => AtomState<Value>
type InvalidateDependents = (store: Store, atom: AnyAtom) => void
type WriteAtomState = <Value, Args extends unknown[], Result>(
  store: Store,
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
) => Result
type MountDependencies = (store: Store, atom: AnyAtom) => void
type MountAtom = <Value>(store: Store, atom: Atom<Value>) => Mounted
type UnmountAtom = <Value>(
  store: Store,
  atom: Atom<Value>,
) => Mounted | undefined
type SetAtomStateValueOrPromise = <Value>(
  store: Store,
  atom: Atom<Value>,
  valueOrPromise: Value,
) => void
type StoreGet = <Value>(store: Store, atom: Atom<Value>) => Value
type StoreSet = <Value, Args extends unknown[], Result>(
  store: Store,
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
) => Result
type StoreSub = (
  store: Store,
  atom: AnyAtom,
  listener: () => void,
) => () => void
type EnhanceBuildingBlocks = (
  buildingBlocks: Readonly<BuildingBlocks>,
) => Readonly<BuildingBlocks>

type Store = {
  get: <Value>(atom: Atom<Value>) => Value
  set: <Value, Args extends unknown[], Result>(
    atom: WritableAtom<Value, Args, Result>,
    ...args: Args
  ) => Result
  sub: (atom: AnyAtom, listener: () => void) => () => void
}

type BuildingBlocks = [
  // store state
  atomStateMap: AtomStateMap, //                               0
  mountedMap: MountedMap, //                                   1
  invalidatedAtoms: InvalidatedAtoms, //                       2
  changedAtoms: ChangedAtoms, //                               3
  mountCallbacks: Callbacks, //                                4
  unmountCallbacks: Callbacks, //                              5
  storeHooks: StoreHooks, //                                   6
  // atom interceptors
  atomRead: AtomRead, //                                       7
  atomWrite: AtomWrite, //                                     8
  atomOnInit: AtomOnInit, //                                   9
  atomOnMount: AtomOnMount, //                                 10
  // building-block functions
  ensureAtomState: EnsureAtomState, //                         11
  flushCallbacks: FlushCallbacks, //                           12
  recomputeInvalidatedAtoms: RecomputeInvalidatedAtoms, //     13
  readAtomState: ReadAtomState, //                             14
  invalidateDependents: InvalidateDependents, //               15
  writeAtomState: WriteAtomState, //                           16
  mountDependencies: MountDependencies, //                     17
  mountAtom: MountAtom, //                                     18
  unmountAtom: UnmountAtom, //                                 19
  setAtomStateValueOrPromise: SetAtomStateValueOrPromise, //   20
  // store api
  storeGet: StoreGet, //                                       21
  storeSet: StoreSet, //                                       22
  storeSub: StoreSub, //                                       23
  enhanceBuildingBlocks: EnhanceBuildingBlocks | undefined, // 24
]

export type {
  AtomState as INTERNAL_AtomState,
  Mounted as INTERNAL_Mounted,
  AtomStateMap as INTERNAL_AtomStateMap,
  MountedMap as INTERNAL_MountedMap,
  InvalidatedAtoms as INTERNAL_InvalidatedAtoms,
  ChangedAtoms as INTERNAL_ChangedAtoms,
  Callbacks as INTERNAL_Callbacks,
  AtomRead as INTERNAL_AtomRead,
  AtomWrite as INTERNAL_AtomWrite,
  AtomOnInit as INTERNAL_AtomOnInit,
  AtomOnMount as INTERNAL_AtomOnMount,
  EnsureAtomState as INTERNAL_EnsureAtomState,
  FlushCallbacks as INTERNAL_FlushCallbacks,
  RecomputeInvalidatedAtoms as INTERNAL_RecomputeInvalidatedAtoms,
  ReadAtomState as INTERNAL_ReadAtomState,
  InvalidateDependents as INTERNAL_InvalidateDependents,
  WriteAtomState as INTERNAL_WriteAtomState,
  MountDependencies as INTERNAL_MountDependencies,
  MountAtom as INTERNAL_MountAtom,
  UnmountAtom as INTERNAL_UnmountAtom,
  Store as INTERNAL_Store,
  BuildingBlocks as INTERNAL_BuildingBlocks,
  StoreHooks as INTERNAL_StoreHooks,
}

//
// Some util functions
//

function hasInitialValue<T extends Atom<AnyValue>>(
  atom: T,
): atom is T & (T extends Atom<infer Value> ? { init: Value } : never) {
  return 'init' in atom
}

function isActuallyWritableAtom(atom: AnyAtom): atom is AnyWritableAtom {
  return !!(atom as AnyWritableAtom).write
}

function isAtomStateInitialized<Value>(atomState: AtomState<Value>): boolean {
  return 'v' in atomState || 'e' in atomState
}

function returnAtomValue<Value>(atomState: AtomState<Value>): Value {
  if ('e' in atomState) {
    throw atomState.e
  }
  if (import.meta.env?.MODE !== 'production' && !('v' in atomState)) {
    throw new Error('[Bug] atom state is not initialized')
  }
  return atomState.v!
}

//
// Abortable Promise
//

const promiseStateMap: WeakMap<
  PromiseLike<unknown>,
  [pending: boolean, abortHandlers: Set<() => void>]
> = new WeakMap()

function isPendingPromise(value: unknown): value is PromiseLike<unknown> {
  return isPromiseLike(value) && !!promiseStateMap.get(value as never)?.[0]
}

function abortPromise<T>(promise: PromiseLike<T>): void {
  const promiseState = promiseStateMap.get(promise)
  if (promiseState?.[0]) {
    promiseState[0] = false
    promiseState[1].forEach((fn) => fn())
  }
}

function registerAbortHandler<T>(
  promise: PromiseLike<T>,
  abortHandler: () => void,
): void {
  let promiseState = promiseStateMap.get(promise)
  if (!promiseState) {
    promiseState = [true, new Set()]
    promiseStateMap.set(promise, promiseState)
    const settle = () => {
      promiseState![0] = false
    }
    promise.then(settle, settle)
  }
  promiseState[1].add(abortHandler)
}

function isPromiseLike(p: unknown): p is PromiseLike<unknown> {
  return typeof (p as any)?.then === 'function'
}

function addPendingPromiseToDependency(
  atom: AnyAtom,
  promise: PromiseLike<AnyValue>,
  dependencyAtomState: AtomState,
): void {
  if (!dependencyAtomState.p.has(atom)) {
    dependencyAtomState.p.add(atom)
    const cleanup = () => dependencyAtomState.p.delete(atom)
    promise.then(cleanup, cleanup)
  }
}

// TODO(daishi): revisit this implementation
function getMountedOrPendingDependents(
  atom: AnyAtom,
  atomState: AtomState,
  mountedMap: MountedMap,
): Set<AnyAtom> {
  const dependents = new Set<AnyAtom>()
  for (const a of mountedMap.get(atom)?.t || []) {
    dependents.add(a)
  }
  for (const atomWithPendingPromise of atomState.p) {
    dependents.add(atomWithPendingPromise)
  }
  return dependents
}

//
// Store hooks
//

type StoreHook = {
  (): void
  add(callback: () => void): () => void
}

type StoreHookForAtoms = {
  (atom: AnyAtom): void
  add(atom: AnyAtom, callback: () => void): () => void
  add(atom: undefined, callback: (atom: AnyAtom) => void): () => void
}

/** StoreHooks are an experimental API. */
type StoreHooks = {
  /** Listener to notify when the atom state is created. */
  readonly i?: StoreHookForAtoms
  /** Listener to notify when the atom is read. */
  readonly r?: StoreHookForAtoms
  /** Listener to notify when the atom value is changed. */
  readonly c?: StoreHookForAtoms
  /** Listener to notify when the atom is mounted. */
  readonly m?: StoreHookForAtoms
  /** Listener to notify when the atom is unmounted. */
  readonly u?: StoreHookForAtoms
  /** Listener to notify when callbacks are being flushed. */
  readonly f?: StoreHook
}

const createStoreHook = (): StoreHook => {
  const callbacks = new Set<() => void>()
  const notify = () => callbacks.forEach((fn) => fn())
  notify.add = (fn: () => void) => {
    callbacks.add(fn)
    return () => callbacks.delete(fn)
  }
  return notify
}

const createStoreHookForAtoms = (): StoreHookForAtoms => {
  const all: object = {}
  const callbacks = new WeakMap<
    AnyAtom | typeof all,
    Set<(atom?: AnyAtom) => void>
  >()
  const notify = (atom: AnyAtom) => {
    callbacks.get(all)?.forEach((fn) => fn(atom))
    callbacks.get(atom)?.forEach((fn) => fn())
  }
  notify.add = (atom: AnyAtom | undefined, fn: (atom?: AnyAtom) => void) => {
    const key = atom || all
    let fns = callbacks.get(key)
    if (!fns) {
      fns = new Set()
      callbacks.set(key, fns)
    }
    fns.add(fn)
    return () => {
      fns!.delete(fn)
      if (!fns!.size) {
        callbacks.delete(key)
      }
    }
  }
  return notify as StoreHookForAtoms
}

function initializeStoreHooks(storeHooks: StoreHooks): Required<StoreHooks> {
  type SH = { -readonly [P in keyof StoreHooks]: StoreHooks[P] }
  ;

type State = {readonly a: number}
	type Recipe = (state?: State | undefined) => State

	let foo = produce((_: any) => {}, _ as State)
	assert(foo, _ as Recipe)
})

it("can infer state type from recipe function", () => {
	type A = {readonly a: string}
	type B = {readonly b: string}
	type State = A | B
	type Recipe = (state: State) => State

	let foo = produce((draft: State) => {
		assert(draft, _ as State)
		if (Math.random() > 0.5) return {a: "test"}
		else return {b: "boe"}
	})
	const x = foo({a: ""})
	const y = foo({b: ""})
	assert(foo, _ as Recipe)
})

it("can infer state type from recipe function with arguments", () => {
	type State = {readonly a: string} | {readonly b: string}
	type Recipe = (state: State, x: number) => State

	let foo = produce<State, [number]>((draft, x) => {
		assert(draft, _ as Draft<State>)
		assert(x, _ as number)
	})
	assert(foo, _ as Recipe)
})

it("can infer state type from recipe function with arguments and initial state", () => {
	type State = {readonly a: string} | {readonly b: string}
	type Recipe = (state: State | undefined, x: number) => State

	let foo = produce((draft: Draft<State>, x: number) => {}, _ as State)
	assert(foo, _ as Recipe)
})

it("cannot infer state type when the function type and default state are missing", () => {
	type Recipe = <S extends any>(state: S) => S
	const foo = produce((_: any) => {})
	// @ts-expect-error
	assert(foo, _ as Recipe)
})

it("can update readonly state via curried api", () => {
	const newState = produce((draft: Draft<State>) => {
		draft.num++
		draft.foo = "bar"
		draft.bar = "foo"
		draft.baz.x++
		draft.baz.y++
		draft.arr[0].value = "foo"
		draft.arr.push({value: "asf"})
		draft.arr2[0].value = "foo"
		draft.arr2.push({value: "asf"})
	})(state)
	expect(newState).not.toBe(state)
	expect(newState).toEqual(expectedState)
})

it("can update use the non-default export", () => {
	const newState = produce((draft: Draft<State>) => {
		draft.num++
		draft.foo = "bar"
		draft.bar = "foo"
		draft.baz.x++
		draft.baz.y++
		draft.arr[0].value = "foo"
		draft.arr.push({value: "asf"})
		draft.arr2[0].value = "foo"
		draft.arr2.push({value: "asf"})
	})(state)
	expect(newState).not.toBe(state)
	expect(newState).toEqual(expectedState)
})

it("can apply patches", () => {
	let patches: Patch[] = []
	produce(
		{x: 3},
		d => {
			d.x++
		},
		p => {
			patches = p
		}
	)

	expect(applyPatches({}, patches)).toEqual({x: 4})
})

it("can apply readonly patches", () => {
	const [, patches]: readonly [
		{
			x: number
		},
		readonly Patch[],
		readonly Patch[]
	] = produceWithPatches({x: 3}, d => {
		d.x++
	})

	expect(applyPatches({}, patches)).toEqual({x: 4})
})

describe("curried producer", () => {
	it("supports rest parameters", () => {
		type State = {readonly a: 1}

		// No initial state:
		{
			type Recipe = (state: State, a: number, b: number) => State
			let foo = produce((s: State, a: number, b: number) => {})
			assert(foo, _ as Recipe)
			foo(_ as State, 1, 2)
		}

		// Using argument parameters:
		{
			type Recipe = (state: Immutable<State>, ...rest: number[]) => Draft<State>
			let woo = produce((state: Draft<State>, ...args: number[]) => {})
			assert(woo, _ as Recipe)
			woo(_ as State, 1, 2)
		}

		// With initial state:
		{
			type Recipe = (state?: State | undefined, ...rest: number[]) => State
			let bar = produce((state: Draft<State>, ...args: number[]) => {},
			_ as State)
			assert(bar, _ as Recipe)
			bar(_ as State, 1, 2)
			bar(_ as State)
			bar()
		}

		// When args is a tuple:
		{
			type Recipe = (
				state: State | undefined,
				first: string,
				...rest: number[]
			) => State
			let tup = produce(
				(state: Draft<State>, ...args: [string, ...number[]]) => {},
				_ as State
			)
			assert(tup, _ as Recipe)
			tup({a: 1}, "", 2)
			tup(undefined, "", 2)
		}
	})

	it("can be passed a readonly array", () => {
		// No initial state:
		{
			let foo = produce((state: string[]) => {})
			assert(foo, _ as (state: readonly string[]) => string[])
			foo([] as ReadonlyArray<string>)
		}

		// With initial state:
		{
			let bar = produce(() => {}, [] as ReadonlyArray<string>)
			assert(
				bar,
				_ as (state?: readonly string[] | undefined) => readonly string[]
			)
			bar([] as ReadonlyArray<string>)
			bar(undefined)
			bar()
		}
	})
})

it("works with return type of: number", () => {
	let base = {a: 0} as {a: number}
	{
		if (Math.random() === 100) {
			// @ts-expect-error, this return accidentally a number, this is probably a dev error!
			let result = produce(base, draft => draft.a++)
		}
	}
	{
		let result = produce(base, draft => void draft.a++)
		assert(result, _ as {a: number})
	}
})

it("can return an object type that is identical to the base type", () => {
	let base = {a: 0} as {a: number}
	let result = produce(base, draft => {
		return draft.a < 0 ? {a: 0} : undefined
	})
	assert(result, _ as {a: number})
})

it("can NOT return an object type that is _not_ assignable to the base type", () => {
	let base = {a: 0} as {a: number}
	// @ts-expect-error
	let result = produce(base, draft => {
		return draft.a < 0 ? {a: true} : undefined
	})
})

it("does not enforce immutability at the type level", () => {
	let result = produce([] as any[], draft => {
		draft.push(1)
	})
	assert(result, _ as any[])
})

it("can produce an undefined value", () => {
	type State = {readonly a: number} | undefined
	const base = {a: 0} as State

	// Return only nothing.
	let result = produce(base, _ => nothing)
	assert(result, _ as State)

	// Return maybe nothing.
	let result2 = produce(base, draft => {
		if (draft?.a ?? 0 > 0) return nothing
	})
	assert(result2, _ as State)
})

it("can return the draft itself", () => {
	let base = _ as {readonly a: number}
	let result = produce(base, draft => draft)

	assert(result, _ as {readonly a: number})
})

it("works with `void` hack", () => {
	let base = {a: 0} as {readonly a: number}
	let copy = produce(base, s => void s.a++)
	assert(copy, base)
})

it("works with generic parameters", () => {
	let insert = <T>(array: readonly T[], index: number, elem: T) => {
		// Need explicit cast on draft as T[] is wider than readonly T[]
		return produce(array, (draft: T[]) => {
			draft.push(elem)
			draft.splice(index, 0, elem)
			draft.concat([elem])
		})
	}
	let val: {readonly a: ReadonlyArray<number>} = {a: []} as any
	let arr: ReadonlyArray<typeof val> = [] as any
	insert(arr, 0, val)
})

it("can work with non-readonly base types", () => {
	const state = {
		price: 10,
		todos: [
			{
				title: "test",
				done: false
			}
		]
	}
	type State = typeof state

	const newState = produce(state, draft => {
		draft.price += 5
		draft.todos.push({
			title: "hi",
			done: true
		})
	})
	assert(newState, _ as State)

	const reducer = (draft: State) => {
		draft.price += 5
		draft.todos.push({
			title: "hi",
			done: true
		})
	}

	// base case for with-initial-state
	const newState4 = produce(reducer, state)(state)
	assert(newState4, _ as State)
	// no argument case, in that case, immutable version recipe first arg will be inferred
	const newState5 = produce(reducer, state)()
	assert(newState5, _ as State)
	// we can force the return type of the reducer by casting the initial state
	const newState3 = produce(reducer, state as State)()
	assert(newState3, _ as State)
})

it("can work with readonly base types", () => {
	type State = {
		readonly price: number
		readonly todos: readonly {
			readonly title: string
			readonly done: boolean
		}[]
	}

	const state: State = {
		price: 10,
		todos: [
			{
				title: "test",
				done: false
			}
		]
	}

	const newState = produce(state, draft => {
		draft.price + 5
		draft.todos.push({
			title: "hi",
			done: true
		})
	})
	assert(newState, _ as State)
	assert(newState, _ as Immutable<State>) // cause that is the same!

	const reducer = (draft: Draft<State>) => {
		draft.price += 5
		draft.todos.push({
			title: "hi",
			done: true
		})
	}
	const newState2: State = produce(reducer)(state)
	assert(newState2, _ as State)

	// base case for with-initial-state
	const newState4 = produce(reducer, state)(state)
	assert(newState4, _ as State)
	// no argument case, in that case, immutable version recipe first arg will be inferred
	const newState5 = produce(reducer, state)()
	assert(newState5, _ as State)
	// we can force the return type of the reducer by casting initial argument
	const newState3 = produce(reducer, state as State)()
	assert(newState3, _ as State)
})

it("works with generic array", () => {
	const append = <T>(queue: T[], item: T) =>
		// T[] is needed here v. Too bad.
		produce(queue, (queueDraft: T[]) => {
			queueDraft.push(item)
		})

	const queueBefore = [1, 2, 3]

	const queueAfter = append(queueBefore, 4)

	expect(queueAfter).toEqual([1, 2, 3, 4])
	expect(queueBefore).toEqual([1, 2, 3])
})

it("works with Map and Set", () => {
	const m = new Map([["a", {x: 1}]])
	const s = new Set([{x: 2}])

	const res1 = produce(m, draft => {
		assert(draft, _ as Map<string, {x: number}>)
	})
	assert(res1, _ as Map<string, {x: number}>)

	const res2 = produce(s, draft => {
		assert(draft, _ as Set<{x: number}>)
	})
	assert(res2, _ as Set<{x: number}>)
})

it("works with readonly Map and Set", () => {
	type S = {readonly x: number}
	const m: ReadonlyMap<string, S> = new Map([["a", {x: 1}]])
	const s: ReadonlySet<S> = new Set([{x: 2}])

	const res1 = produce(m, (draft: Draft<Map<string, S>>) => {
		assert(draft, _ as Map<string, {x: number}>)
	})
	assert(res1, _ as ReadonlyMap<string, {readonly x: number}>)

	const res2 = produce(s, (draft: Draft<Set<S>>) => {
		assert(draft, _ as Set<{x: number}>)
	})
	assert(res2, _ as ReadonlySet<{readonly x: number}>)
})

it("works with ReadonlyMap and ReadonlySet", () => {
	type S = {readonly x: number}
	const m: ReadonlyMap<string, S> = new Map([["a", {x: 1}]])
	const s: ReadonlySet<S> = new Set([{x: 2}])

	const res1 = produce(m, (draft: Draft<Map<string, S>>) => {
		assert(draft, _ as Map<string, {x: number}>)
	})
	assert(res1, _ as ReadonlyMap<string, {readonly x: number}>)

	const res2 = produce(s, (draft: Draft<Set<S>>) => {
		assert(draft, _ as Set<{x: number}>)
	})
	assert(res2, _ as ReadonlySet<{readonly x: number}>)
})

it("shows error in production if called incorrectly", () => {
	expect(() => {
		debugger
		produce(null as any)
	}).toThrow(
		(global as any).USES_BUILD
			? "[Immer] minified error nr: 6"
			: "[Immer] The first or second argument to `produce` must be a function"
	)
})

it("#749 types Immer", () => {
	const t = {
		x: 3
	}

	const immer = new Immer()
	const z = immer.produce(t, d => {
		d.x++
		// @ts-expect-error
		d.y = 0
	})
	expect(z.x).toBe(4)
	// @ts-expect-error
	expect(z.z).toBeUndefined()
})

it("infers draft, #720", () => {
	function nextNumberCalculator(fn: (base: number) => number) {
		// noop
	}

	const res2 = nextNumberCalculator(
		produce(draft => {
			// @ts-expect-error
			let x: string = draft
			return draft + 1
		})
	)

	const res = nextNumberCalculator(
		produce(draft => {
			// @ts-expect-error
			let x: string = draft
			// return draft + 1;

type Dispatch<A> = (value: A) => void
	type SetStateAction<S> = S | ((prevState: S) => S)

	const [n, setN] = useState({x: 3})

	setN(
		produce(draft => {
			// @ts-expect-error
			draft.y = 4
			draft.x = 5
			return draft
		})
	)

	setN(
		produce(draft => {
			// @ts-expect-error
			draft.y = 4
			draft.x = 5
			// return draft + 1;

type TestExact<Left, Right> =
    (<U>() => U extends Left ? 1 : 0) extends (<U>() => U extends Right ? 1 : 0) ? Any : never;

export type StrictMode = boolean | "class_only"

export class Immer implements ProducersFns {
	autoFreeze_: boolean = true
	useStrictShallowCopy_: StrictMode = false
	useStrictIteration_: boolean = false

	constructor(config?: {
		autoFreeze?: boolean
		useStrictShallowCopy?: StrictMode
		useStrictIteration?: boolean
	}) {
		if (isBoolean(config?.autoFreeze)) this.setAutoFreeze(config!.autoFreeze)
		if (isBoolean(config?.useStrictShallowCopy))
			this.setUseStrictShallowCopy(config!.useStrictShallowCopy)
		if (isBoolean(config?.useStrictIteration))
			this.setUseStrictIteration(config!.useStrictIteration)
	}

	/**
	 * The `produce` function takes a value and a "recipe function" (whose
	 * return value often depends on the base state). The recipe function is
	 * free to mutate its first argument however it wants. All mutations are
	 * only ever applied to a __copy__ of the base state.
	 *
	 * Pass only a function to create a "curried producer" which relieves you
	 * from passing the recipe function every time.
	 *
	 * Only plain objects and arrays are made mutable. All other objects are
	 * considered uncopyable.
	 *
	 * Note: This function is __bound__ to its `Immer` instance.
	 *
	 * @param {any} base - the initial state
	 * @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
	 * @param {Function} patchListener - optional function that will be called with all the patches produced here
	 * @returns {any} a new state, or the initial state if nothing was modified
	 */
	produce: IProduce = (base: any, recipe?: any, patchListener?: any) => {
		// curried invocation
		if (isFunction(base) && !isFunction(recipe)) {
			const defaultBase = recipe
			recipe = base

			const self = this
			return function curriedProduce(
				this: any,
				base = defaultBase,
				...args: any[]
			) {
				return self.produce(base, (draft: Drafted) => recipe.call(this, draft, ...args)) // prettier-ignore
			}
		}

		if (!isFunction(recipe)) die(6)
		if (patchListener !== undefined && !isFunction(patchListener)) die(7)

		let result

		// Only plain objects, arrays, and "immerable classes" are drafted.
		if (isDraftable(base)) {
			const scope = enterScope(this)
			const proxy = createProxy(scope, base, undefined)
			let hasError = true
			try {
				result = recipe(proxy)
				hasError = false
			} finally {
				// finally instead of catch + rethrow better preserves original stack
				if (hasError) revokeScope(scope)
				else leaveScope(scope)
			}
			usePatchesInScope(scope, patchListener)
			return processResult(result, scope)
		} else if (!base || !isObjectish(base)) {
			result = recipe(base)
			if (result === undefined) result = base
			if (result === NOTHING) result = undefined
			if (this.autoFreeze_) freeze(result, true)
			if (patchListener) {
				const p: Patch[] = []
				const ip: Patch[] = []
				getPlugin(PluginPatches).generateReplacementPatches_(base, result, {
					patches_: p,
					inversePatches_: ip
				} as ImmerScope) // dummy scope
				patchListener(p, ip)
			}
			return result
		} else die(1, base)
	}

	produceWithPatches: IProduceWithPatches = (base: any, recipe?: any): any => {
		// curried invocation
		if (isFunction(base)) {
			return (state: any, ...args: any[]) =>
				this.produceWithPatches(state, (draft: any) => base(draft, ...args))
		}

		let patches: Patch[], inversePatches: Patch[]
		const result = this.produce(base, recipe, (p: Patch[], ip: Patch[]) => {
			patches = p
			inversePatches = ip
		})
		return [result, patches!, inversePatches!]
	}

	createDraft<T extends Objectish>(base: T): Draft<T> {
		if (!isDraftable(base)) die(8)
		if (isDraft(base)) base = current(base)
		const scope = enterScope(this)
		const proxy = createProxy(scope, base, undefined)
		proxy[DRAFT_STATE].isManual_ = true
		leaveScope(scope)
		return proxy as any
	}

	finishDraft<D extends Draft<any>>(
		draft: D,
		patchListener?: PatchListener
	): D extends Draft<infer T> ? T : never {
		const state: ImmerState = draft && (draft as any)[DRAFT_STATE]
		if (!state || !state.isManual_) die(9)
		const {scope_: scope} = state
		usePatchesInScope(scope, patchListener)
		return processResult(undefined, scope)
	}

	/**
	 * Pass true to automatically freeze all copies created by Immer.
	 *
	 * By default, auto-freezing is enabled.
	 */
	setAutoFreeze(value: boolean) {
		this.autoFreeze_ = value
	}

	/**
	 * Pass true to enable strict shallow copy.
	 *
	 * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
	 */
	setUseStrictShallowCopy(value: StrictMode) {
		this.useStrictShallowCopy_ = value
	}

	/**
	 * Pass false to use faster iteration that skips non-enumerable properties
	 * but still handles symbols for compatibility.
	 *
	 * By default, strict iteration is enabled (includes all own properties).
	 */
	setUseStrictIteration(value: boolean) {
		this.useStrictIteration_ = value
	}

	shouldUseStrictIteration(): boolean {
		return this.useStrictIteration_
	}

	applyPatches<T extends Objectish>(base: T, patches: readonly Patch[]): T {
		// If a patch replaces the entire state, take that replacement as base
		// before applying patches
		let i: number
		for (i = patches.length - 1;

type MutatingArrayMethod =
	| "push"
	| "pop"
	| "shift"
	| "unshift"
	| "splice"
	| "reverse"
	| "sort"

/**
 * Methods that read from the array without modifying it.
 * These fall into distinct categories based on return semantics:
 *
 * **Subset operations** (return drafts - mutations propagate):
 * - `filter`, `slice`: Return array of draft proxies
 * - `find`, `findLast`: Return single draft proxy or undefined
 *
 * **Transform operations** (return base values - mutations don't track):
 * - `concat`, `flat`: Create new structures, not subsets of original
 *
 * **Primitive-returning** (no draft needed):
 * - `findIndex`, `findLastIndex`, `indexOf`, `lastIndexOf`: Return numbers
 * - `some`, `every`, `includes`: Return booleans
 * - `join`, `toString`, `toLocaleString`: Return strings
 */
type NonMutatingArrayMethod =
	| "filter"
	| "slice"
	| "concat"
	| "flat"
	| "find"
	| "findIndex"
	| "findLast"
	| "findLastIndex"
	| "some"
	| "every"
	| "indexOf"
	| "lastIndexOf"
	| "includes"
	| "join"
	| "toString"
	| "toLocaleString"

/** Union of all array operation methods handled by the plugin. */
export type ArrayOperationMethod = MutatingArrayMethod | NonMutatingArrayMethod

/**
 * Enables optimized array method handling for Immer drafts.
 *
 * This plugin overrides array methods to avoid unnecessary Proxy creation during iteration,
 * significantly improving performance for array-heavy operations.
 *
 * **Mutating methods** (push, pop, shift, unshift, splice, sort, reverse):
 * Operate directly on the copy without creating per-element proxies.
 *
 * **Non-mutating methods** fall into categories:
 * - **Subset operations** (filter, slice, find, findLast): Return draft proxies - mutations track
 * - **Transform operations** (concat, flat): Return base values - mutations don't track
 * - **Primitive-returning** (indexOf, includes, some, every, etc.): Return primitives
 *
 * **Important**: Callbacks for overridden methods receive base values, not drafts.
 * This is the core performance optimization.
 *
 * @example
 * ```ts
 * import { enableArrayMethods, produce } from "immer"
 *
 * enableArrayMethods()
 *
 * const next = produce(state, draft => {
 *   // Optimized - no proxy creation per element
 *   draft.items.sort((a, b) => a.value - b.value)
 *
 *   // filter returns drafts - mutations propagate
 *   const filtered = draft.items.filter(x => x.value > 5)
 *   filtered[0].value = 999 // Affects draft.items[originalIndex]
 * })
 * ```
 *
 * @see https://immerjs.github.io/immer/array-methods
 */
export function enableArrayMethods() {
	const SHIFTING_METHODS = new Set<MutatingArrayMethod>(["shift", "unshift"])

	const QUEUE_METHODS = new Set<MutatingArrayMethod>(["push", "pop"])

	const RESULT_RETURNING_METHODS = new Set<MutatingArrayMethod>([
		...QUEUE_METHODS,
		...SHIFTING_METHODS
	])

	const REORDERING_METHODS = new Set<MutatingArrayMethod>(["reverse", "sort"])

	// Optimized method detection using array-based lookup
	const MUTATING_METHODS = new Set<MutatingArrayMethod>([
		...RESULT_RETURNING_METHODS,
		...REORDERING_METHODS,
		"splice"
	])

	const FIND_METHODS = new Set<NonMutatingArrayMethod>(["find", "findLast"])

	const NON_MUTATING_METHODS = new Set<NonMutatingArrayMethod>([
		"filter",
		"slice",
		"concat",
		"flat",
		...FIND_METHODS,
		"findIndex",
		"findLastIndex",
		"some",
		"every",
		"indexOf",
		"lastIndexOf",
		"includes",
		"join",
		"toString",
		"toLocaleString"
	])

	// Type guard for method detection
	function isMutatingArrayMethod(
		method: string
	): method is MutatingArrayMethod {
		return MUTATING_METHODS.has(method as any)
	}

	function isNonMutatingArrayMethod(
		method: string
	): method is NonMutatingArrayMethod {
		return NON_MUTATING_METHODS.has(method as any)
	}

	function isArrayOperationMethod(
		method: string
	): method is ArrayOperationMethod {
		return isMutatingArrayMethod(method) || isNonMutatingArrayMethod(method)
	}

	function enterOperation(
		state: ProxyArrayState,
		method: ArrayOperationMethod
	) {
		state.operationMethod = method
	}

	function exitOperation(state: ProxyArrayState) {
		state.operationMethod = undefined
	}

	// Shared utility functions for array method handlers
	function executeArrayMethod<T>(
		state: ProxyArrayState,
		operation: () => T,
		markLength = true
	): T {
		prepareCopy(state)
		const result = operation()
		markChanged(state)
		if (markLength) state.assigned_!.set("length", true)
		return result
	}

	function markAllIndicesReassigned(state: ProxyArrayState) {
		state.allIndicesReassigned_ = true
	}

	function normalizeSliceIndex(index: number, length: number): number {
		if (index < 0) {
			return Math.max(length + index, 0)
		}
		return Math.min(index, length)
	}

	/**
	 * Handles mutating operations that add/remove elements (push, pop, shift, unshift, splice).
	 *
	 * Operates directly on `state.copy_` without creating per-element proxies.
	 * For shifting methods (shift, unshift), marks all indices as reassigned since
	 * indices shift.
	 *
	 * @returns For push/pop/shift/unshift: the native method result. For others: the draft.
	 */
	function handleSimpleOperation(
		state: ProxyArrayState,
		method: string,
		args: any[]
	) {
		return executeArrayMethod(state, () => {
			const result = (state.copy_! as any)[method](...args)

			// Handle index reassignment for shifting methods
			if (SHIFTING_METHODS.has(method as MutatingArrayMethod)) {
				markAllIndicesReassigned(state)
			}

			// Return appropriate value based on method
			return RESULT_RETURNING_METHODS.has(method as MutatingArrayMethod)
				? result
				: state.draft_
		})
	}

	/**
	 * Handles reordering operations (reverse, sort) that change element order.
	 *
	 * Operates directly on `state.copy_` and marks all indices as reassigned
	 * since element positions change. Does not mark length as changed since
	 * these operations preserve array length.
	 *
	 * @returns The draft proxy for method chaining.
	 */
	function handleReorderingOperation(
		state: ProxyArrayState,
		method: string,
		args: any[]
	) {
		return executeArrayMethod(
			state,
			() => {
				;

type Config = Parameters<
  (Window extends { __REDUX_DEVTOOLS_EXTENSION__?: infer T }
    ? T
    : { connect: (param: object) => object })['connect']
>[0]

declare module '../vanilla' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface StoreMutators<S, A> {
    'zustand/devtools': WithDevtools<S>
  }
}

// FIXME https://github.com/reduxjs/redux-devtools/issues/1097
type Message = {
  type: string
  payload?: any
  state?: any
}

type WithDispatch = {
  dispatch: (...args: unknown[]) => void
  dispatchFromDevtools: unknown
}

const shouldDispatchFromDevtools = (api: unknown): api is WithDispatch =>
  !!(api as WithDispatch).dispatchFromDevtools &&
  typeof (api as WithDispatch).dispatch === 'function'

type Cast<T, U> = T extends U ? T : U
type Write<T, U> = Omit<T, keyof U> & U
type TakeTwo<T> = T extends { length: 0 }
  ? [undefined, undefined]
  : T extends { length: 1 }
    ? [...args0: Cast<T, unknown[]>, arg1: undefined]
    : T extends { length: 0 | 1 }
      ? [...args0: Cast<T, unknown[]>, arg1: undefined]
      : T extends { length: 2 }
        ? T
        : T extends { length: 1 | 2 }
          ? T
          : T extends { length: 0 | 1 | 2 }
            ? T
            : T extends [infer A0, infer A1, ...unknown[]]
              ? [A0, A1]
              : T extends [infer A0, (infer A1)?, ...unknown[]]
                ? [A0, A1?]
                : T extends [(infer A0)?, (infer A1)?, ...unknown[]]
                  ? [A0?, A1?]
                  : never

type WithDevtools<S> = Write<S, StoreDevtools<S>>

type Action =
  | string
  | {
      type: string
      [x: string | number | symbol]: unknown
    }
type StoreDevtools<S> = S extends {
  setState: {
    // capture both overloads of setState
    (...args: infer Sa1): infer Sr1
    (...args: infer Sa2): infer Sr2
  }
}
  ? {
      setState(...args: [...args: TakeTwo<Sa1>, action?: Action]): Sr1
      setState(...args: [...args: TakeTwo<Sa2>, action?: Action]): Sr2
      devtools: {
        cleanup: () => void
      }
    }
  : never

export interface DevtoolsOptions extends Config {
  name?: string
  enabled?: boolean
  anonymousActionType?: string
  store?: string
}

type Devtools = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  U = T,
>(
  initializer: StateCreator<T, [...Mps, ['zustand/devtools', never]], Mcs, U>,
  devtoolsOptions?: DevtoolsOptions,
) => StateCreator<T, Mps, [['zustand/devtools', never], ...Mcs]>

declare module '../vanilla' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface StoreMutators<S, A> {
    'zustand/devtools': WithDevtools<S>
  }
}

type DevtoolsImpl = <T>(
  storeInitializer: StateCreator<T, [], []>,
  devtoolsOptions?: DevtoolsOptions,
) => StateCreator<T, [], []>

export type NamedSet<T> = WithDevtools<StoreApi<T>>['setState']

type Connection = ReturnType<
  NonNullable<Window['__REDUX_DEVTOOLS_EXTENSION__']>['connect']
>
type ConnectionName = string | undefined
type StoreName = string
type StoreInformation = StoreApi<unknown>
type ConnectionInformation = {
  connection: Connection
  stores: Record<StoreName, StoreInformation>
}

const trackedConnections: Map<ConnectionName, ConnectionInformation> = new Map()

const getTrackedConnectionState = (
  name: string | undefined,
): Record<string, any> => {
  const api = trackedConnections.get(name)
  if (!api) return {}
  return Object.fromEntries(
    Object.entries(api.stores).map(([key, api]) => [key, api.getState()]),
  )
}

const extractConnectionInformation = (
  store: string | undefined,
  extensionConnector: NonNullable<
    (typeof window)['__REDUX_DEVTOOLS_EXTENSION__']
  >,
  options: Omit<DevtoolsOptions, 'enabled' | 'anonymousActionType' | 'store'>,
) => {
  if (store === undefined) {
    return {
      type: 'untracked' as const,
      connection: extensionConnector.connect(options),
    }
  }
  const existingConnection = trackedConnections.get(options.name)
  if (existingConnection) {
    return { type: 'tracked' as const, store, ...existingConnection }
  }
  const newConnection: ConnectionInformation = {
    connection: extensionConnector.connect(options),
    stores: {},
  }
  trackedConnections.set(options.name, newConnection)
  return { type: 'tracked' as const, store, ...newConnection }
}

const removeStoreFromTrackedConnections = (
  name: string | undefined,
  store: string | undefined,
) => {
  if (store === undefined) return
  const connectionInfo = trackedConnections.get(name)
  if (!connectionInfo) return
  delete connectionInfo.stores[store]
  if (Object.keys(connectionInfo.stores).length === 0) {
    trackedConnections.delete(name)
  }
}

const findCallerName = (stack: string | undefined) => {
  if (!stack) return undefined
  const traceLines = stack.split('\n')
  const apiSetStateLineIndex = traceLines.findIndex((traceLine) =>
    traceLine.includes('api.setState'),
  )
  if (apiSetStateLineIndex < 0) return undefined
  const callerLine = traceLines[apiSetStateLineIndex + 1]?.trim() || ''
  return /.+ (.+) .+/.exec(callerLine)?.[1]
}

const devtoolsImpl: DevtoolsImpl =
  (fn, devtoolsOptions = {}) =>
  (set, get, api) => {
    const { enabled, anonymousActionType, store, ...options } = devtoolsOptions

    type S = ReturnType<typeof fn> & {
      [store: string]: ReturnType<typeof fn>
    }
    type PartialState = Partial<S> | ((s: S) => Partial<S>)

    let extensionConnector:
      | (typeof window)['__REDUX_DEVTOOLS_EXTENSION__']
      | false
    try {
      extensionConnector =
        (enabled ?? import.meta.env?.MODE !== 'production') &&
        window.__REDUX_DEVTOOLS_EXTENSION__
    } catch {
      // ignored
    }

    if (!extensionConnector) {
      return fn(set, get, api)
    }

    const { connection, ...connectionInformation } =
      extractConnectionInformation(store, extensionConnector, options)

    let isRecording = true
    api.setState = ((state, replace, nameOrAction: Action) => {
      const r = set(state, replace as any)
      if (!isRecording) return r
      const action: { type: string } =
        nameOrAction === undefined
          ? {
              type:
                anonymousActionType ||
                findCallerName(new Error().stack) ||
                'anonymous',
            }
          : typeof nameOrAction === 'string'
            ? { type: nameOrAction }
            : nameOrAction
      if (store === undefined) {
        connection?.send(action, get())
        return r
      }
      connection?.send(
        {
          ...action,
          type: `${store}/${action.type}`,
        },
        {
          ...getTrackedConnectionState(options.name),
          [store]: api.getState(),
        },
      )
      return r
    }) as NamedSet<S>
    ;

export type StorageValue<S> = {
  state: S
  version?: number
}

export interface PersistStorage<S, R = unknown> {
  getItem: (
    name: string,
  ) => StorageValue<S> | null | Promise<StorageValue<S> | null>
  setItem: (name: string, value: StorageValue<S>) => R
  removeItem: (name: string) => R
}

type JsonStorageOptions = {
  reviver?: (key: string, value: unknown) => unknown
  replacer?: (key: string, value: unknown) => unknown
}

export function createJSONStorage<S, R = unknown>(
  getStorage: () => StateStorage<R>,
  options?: JsonStorageOptions,
): PersistStorage<S, unknown> | undefined {
  let storage: StateStorage<R> | undefined
  try {
    storage = getStorage()
  } catch {
    // prevent error if the storage is not defined (e.g. when server side rendering a page)
    return
  }
  const persistStorage: PersistStorage<S, R> = {
    getItem: (name) => {
      const parse = (str: string | null) => {
        if (str === null) {
          return null
        }
        return JSON.parse(str, options?.reviver) as StorageValue<S>
      }
      const str = storage.getItem(name) ?? null
      if (str instanceof Promise) {
        return str.then(parse)
      }
      return parse(str)
    },
    setItem: (name, newValue) =>
      storage.setItem(name, JSON.stringify(newValue, options?.replacer)),
    removeItem: (name) => storage.removeItem(name),
  }
  return persistStorage
}

export interface PersistOptions<
  S,
  PersistedState = S,
  PersistReturn = unknown,
> {
  /** Name of the storage (must be unique) */
  name: string
  /**
   * Use a custom persist storage.
   *
   * Combining `createJSONStorage` helps creating a persist storage
   * with JSON.parse and JSON.stringify.
   *
   * @default createJSONStorage(() => localStorage)
   */
  storage?: PersistStorage<PersistedState, PersistReturn> | undefined
  /**
   * Filter the persisted value.
   *
   * @params state The state's value
   */
  partialize?: (state: S) => PersistedState
  /**
   * A function returning another (optional) function.
   * The main function will be called before the state rehydration.
   * The returned function will be called after the state rehydration or when an error occurred.
   */
  onRehydrateStorage?: (
    state: S,
  ) => ((state?: S, error?: unknown) => void) | void
  /**
   * If the stored state's version mismatch the one specified here, the storage will not be used.
   * This is useful when adding a breaking change to your store.
   */
  version?: number
  /**
   * A function to perform persisted state migration.
   * This function will be called when persisted state versions mismatch with the one specified here.
   */
  migrate?: (
    persistedState: unknown,
    version: number,
  ) => PersistedState | Promise<PersistedState>
  /**
   * A function to perform custom hydration merges when combining the stored state with the current one.
   * By default, this function does a shallow merge.
   */
  merge?: (persistedState: unknown, currentState: S) => S

  /**
   * An optional boolean that will prevent the persist middleware from triggering hydration on initialization,
   * This allows you to call `rehydrate()` at a specific point in your apps rendering life-cycle.
   *
   * This is useful in SSR application.
   *
   * @default false
   */
  skipHydration?: boolean
}

type PersistListener<S> = (state: S) => void

type StorePersist<S, Ps, Pr> = S extends {
  getState: () => infer T
  setState: {
    // capture both overloads of setState
    (...args: infer Sa1): infer Sr1
    (...args: infer Sa2): infer Sr2
  }
}
  ? {
      setState(...args: Sa1): Sr1 | Pr
      setState(...args: Sa2): Sr2 | Pr
      persist: {
        setOptions: (options: Partial<PersistOptions<T, Ps, Pr>>) => void
        clearStorage: () => void
        rehydrate: () => Promise<void> | void
        hasHydrated: () => boolean
        onHydrate: (fn: PersistListener<T>) => () => void
        onFinishHydration: (fn: PersistListener<T>) => () => void
        getOptions: () => Partial<PersistOptions<T, Ps, Pr>>
      }
    }
  : never

type Thenable<Value> = {
  then<V>(
    onFulfilled: (value: Value) => V | Promise<V> | Thenable<V>,
  ): Thenable<V>
  catch<V>(
    onRejected: (reason: Error) => V | Promise<V> | Thenable<V>,
  ): Thenable<V>
}

const toThenable =
  <Result, Input>(
    fn: (input: Input) => Result | Promise<Result> | Thenable<Result>,
  ) =>
  (input: Input): Thenable<Result> => {
    try {
      const result = fn(input)
      if (result instanceof Promise) {
        return result as Thenable<Result>
      }
      return {
        then(onFulfilled) {
          return toThenable(onFulfilled)(result as Result)
        },
        catch(_onRejected) {
          return this as Thenable<any>
        },
      }
    } catch (e: any) {
      return {
        then(_onFulfilled) {
          return this as Thenable<any>
        },
        catch(onRejected) {
          return toThenable(onRejected)(e)
        },
      }
    }
  }

const persistImpl: PersistImpl = (config, baseOptions) => (set, get, api) => {
  type S = ReturnType<typeof config>
  let options = {
    storage: createJSONStorage<S, void>(() => localStorage),
    partialize: (state: S) => state,
    version: 0,
    merge: (persistedState: unknown, currentState: S) => ({
      ...currentState,
      ...(persistedState as object),
    }),
    ...baseOptions,
  }

  let hasHydrated = false
  // Counter to track hydration versions and prevent race conditions
  // when multiple rehydrate() calls happen concurrently
  let hydrationVersion = 0
  const hydrationListeners = new Set<PersistListener<S>>()
  const finishHydrationListeners = new Set<PersistListener<S>>()
  let storage = options.storage

  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`,
        )
        set(...(args as Parameters<typeof set>))
      },
      get,
      api,
    )
  }

  const setItem = () => {
    const state = options.partialize({ ...get() })
    return (storage as PersistStorage<S, unknown>).setItem(options.name, {
      state,
      version: options.version,
    })
  }

  const savedSetState = api.setState

  api.setState = (state, replace) => {
    savedSetState(state, replace as any)
    return setItem()
  }

  const configResult = config(
    (...args) => {
      set(...(args as Parameters<typeof set>))
      return setItem()
    },
    get,
    api,
  )

  api.getInitialState = () => configResult

  // a workaround to solve the issue of not storing rehydrated state in sync storage
  // the set(state) value would be later overridden with initial state by create()
  // to avoid this, we merge the state from localStorage into the initial state.
  let stateFromStorage: S | undefined

  // rehydrate initial state with existing stored state
  const hydrate = () => {
    if (!storage) return

    // On the first invocation of 'hydrate', state will not yet be defined (this is
    // true for both the 'asynchronous' and 'synchronous' case). Pass 'configResult'
    // as a backup  to 'get()' so listeners and 'onRehydrateStorage' are called with
    // the latest available state.

    // Increment version to invalidate any in-flight hydration
    const currentVersion = ++hydrationVersion
    hasHydrated = false
    hydrationListeners.forEach((cb) => cb(get() ?? configResult))

    const postRehydrationCallback =
      options.onRehydrateStorage?.(get() ?? configResult) || undefined

    // bind is used to avoid `TypeError: Illegal invocation` error
    return toThenable(storage.getItem.bind(storage))(options.name)
      .then((deserializedStorageValue) => {
        if (deserializedStorageValue) {
          if (
            typeof deserializedStorageValue.version === 'number' &&
            deserializedStorageValue.version !== options.version
          ) {
            if (options.migrate) {
              const migration = options.migrate(
                deserializedStorageValue.state,
                deserializedStorageValue.version,
              )
              if (migration instanceof Promise) {
                return migration.then((result) => [true, result] as const)
              }
              return [true, migration] as const
            }
            console.error(
              `State loaded from storage couldn't be migrated since no migrate function was provided`,
            )
          } else {
            return [false, deserializedStorageValue.state] as const
          }
        }
        return [false, undefined] as const
      })
      .then((migrationResult) => {
        // Abort if a newer hydration has started
        if (currentVersion !== hydrationVersion) {
          return
        }
        const [migrated, migratedState] = migrationResult
        stateFromStorage = options.merge(
          migratedState as S,
          get() ?? configResult,
        )

        set(stateFromStorage as S, true)
        if (migrated) {
          return setItem()
        }
      })
      .then(() => {
        // Abort if a newer hydration has started
        if (currentVersion !== hydrationVersion) {
          return
        }
        // TODO: In the asynchronous case, it's possible that the state has changed
        // since it was set in the prior callback. As such, it would be better to
        // pass 'get()' to the 'postRehydrationCallback' to ensure the most up-to-date
        // state is used. However, this could be a breaking change, so this isn't being
        // done now.
        postRehydrationCallback?.(stateFromStorage, undefined)

        // It's possible that 'postRehydrationCallback' updated the state. To ensure
        // that isn't overwritten when returning 'stateFromStorage' below
        // (synchronous-case only), update 'stateFromStorage' to point to the latest
        // state. In the asynchronous case, 'stateFromStorage' isn't used after this
        // callback, so there's no harm in updating it to match the latest state.
        stateFromStorage = get()
        hasHydrated = true
        finishHydrationListeners.forEach((cb) => cb(stateFromStorage as S))
      })
      .catch((e: Error) => {
        // Abort if a newer hydration has started
        if (currentVersion !== hydrationVersion) {
          return
        }
        postRehydrationCallback?.(undefined, e)
      })
  }

  ;

type Write<T, U> = Omit<T, keyof U> & U

type Action = { type: string }

type StoreRedux<A> = {
  dispatch: (a: A) => A
  dispatchFromDevtools: true
}

type ReduxState<A> = {
  dispatch: StoreRedux<A>['dispatch']
}

type WithRedux<S, A> = Write<S, StoreRedux<A>>

type Redux = <
  T,
  A extends Action,
  Cms extends [StoreMutatorIdentifier, unknown][] = [],
>(
  reducer: (state: T, action: A) => T,
  initialState: T,
) => StateCreator<Write<T, ReduxState<A>>, Cms, [['zustand/redux', A]]>

declare module '../vanilla' {
  interface StoreMutators<S, A> {
    'zustand/redux': WithRedux<S, A>
  }
}

type ReduxImpl = <T, A extends Action>(
  reducer: (state: T, action: A) => T,
  initialState: T,
) => StateCreator<T & ReduxState<A>, [], []>

const reduxImpl: ReduxImpl = (reducer, initial) => (set, _get, api) => {
  type S = typeof initial
  type A = Parameters<typeof reducer>[1]
  ;

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface Store {
  // TODO: Define based on vendor/state/ patterns
}

export interface StoreConfig {
  // TODO: Define based on vendor/state/ patterns
}

export interface Selector {
  // TODO: Define based on vendor/state/ patterns
}
