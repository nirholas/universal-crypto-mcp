# AGENT 15: STATE MANAGEMENT
## 5-Phase Implementation Prompts

---

## PROMPT 1: GLOBAL STATE ARCHITECTURE

**Context:** Design and implement global state management for the entire platform.

**Objective:** Build scalable state management with proper separation of concerns.

**Requirements:**
1. **Store Architecture** (`website-unified/lib/store/index.ts`)
   ```typescript
   // Zustand stores with slices
   export const useAppStore = create<AppState>()(
     devtools(
       persist(
         subscribeWithSelector((...a) => ({
           ...createUserSlice(...a),
           ...createWalletSlice(...a),
           ...createMarketplaceSlice(...a),
           ...createAnalyticsSlice(...a),
           ...createUISlice(...a),
         })),
         { name: 'app-store' }
       )
     )
   );
   ```

2. **User Store Slice** (`website-unified/lib/store/slices/userSlice.ts`)
   ```typescript
   interface UserSlice {
     // State
     user: User | null;
     session: Session | null;
     isAuthenticated: boolean;
     isLoading: boolean;
     
     // Actions
     setUser: (user: User | null) => void;
     login: () => Promise<void>;
     logout: () => Promise<void>;
     refreshSession: () => Promise<void>;
     updateProfile: (data: ProfileUpdate) => Promise<void>;
   }
   
   export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set, get) => ({
     user: null,
     session: null,
     isAuthenticated: false,
     isLoading: true,
     
     setUser: (user) => set({ user, isAuthenticated: !!user }),
     login: async () => { /* implementation */ },
     logout: async () => { /* implementation */ },
     refreshSession: async () => { /* implementation */ },
     updateProfile: async (data) => { /* implementation */ },
   });
   ```

3. **Wallet Store Slice** (`website-unified/lib/store/slices/walletSlice.ts`)
   ```typescript
   interface WalletSlice {
     // State
     connectedWallets: Wallet[];
     activeWallet: Wallet | null;
     activeChain: Chain | null;
     balances: Map<string, Balance>;
     pendingTxs: Transaction[];
     
     // Actions
     connectWallet: (connector: Connector) => Promise<void>;
     disconnectWallet: (address: string) => void;
     setActiveWallet: (address: string) => void;
     switchChain: (chainId: number) => Promise<void>;
     updateBalances: () => Promise<void>;
     addPendingTx: (tx: Transaction) => void;
     removePendingTx: (hash: string) => void;
   }
   ```

4. **Store Middleware** (`website-unified/lib/store/middleware.ts`)
   ```typescript
   // Logging middleware
   const loggerMiddleware = (config) => (set, get, api) =>
     config(
       (...args) => {
         console.log('Previous state:', get());
         set(...args);
         console.log('Next state:', get());
       },
       get,
       api
     );
   
   // Sync middleware (for WebSocket)
   const syncMiddleware = (config) => (set, get, api) =>
     config(
       (...args) => {
         set(...args);
         syncToServer(get());
       },
       get,
       api
     );
   ```

**Technical Stack:**
- Zustand for global state
- Immer for immutable updates
- React Query for server state
- TypeScript strict mode
- Redux DevTools integration

**Deliverables:**
- Store architecture
- User state management
- Wallet state management
- Middleware system

---

## PROMPT 2: SERVER STATE MANAGEMENT

**Context:** Implement server state management with caching and synchronization.

**Objective:** Build efficient data fetching layer with React Query.

**Requirements:**
1. **Query Client Setup** (`website-unified/lib/query/client.ts`)
   ```typescript
   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 1000 * 60,      // 1 minute
         cacheTime: 1000 * 60 * 5,  // 5 minutes
         refetchOnWindowFocus: true,
         refetchOnReconnect: true,
         retry: 3,
         retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
       },
       mutations: {
         retry: 1,
         onError: handleMutationError,
       },
     },
   });
   ```

2. **Query Keys Factory** (`website-unified/lib/query/keys.ts`)
   ```typescript
   export const queryKeys = {
     // User
     user: {
       all: ['user'] as const,
       detail: (id: string) => ['user', id] as const,
       profile: (id: string) => ['user', id, 'profile'] as const,
       subscriptions: (id: string) => ['user', id, 'subscriptions'] as const,
     },
     
     // Services
     services: {
       all: ['services'] as const,
       list: (filters: Filters) => ['services', 'list', filters] as const,
       detail: (id: string) => ['services', id] as const,
       analytics: (id: string) => ['services', id, 'analytics'] as const,
     },
     
     // Market Data
     prices: {
       all: ['prices'] as const,
       token: (symbol: string) => ['prices', symbol] as const,
       batch: (symbols: string[]) => ['prices', 'batch', symbols] as const,
     },
     
     // Portfolio
     portfolio: {
       summary: (address: string) => ['portfolio', address, 'summary'] as const,
       tokens: (address: string) => ['portfolio', address, 'tokens'] as const,
       nfts: (address: string) => ['portfolio', address, 'nfts'] as const,
       history: (address: string) => ['portfolio', address, 'history'] as const,
     },
   };
   ```

3. **Query Hooks** (`website-unified/lib/query/hooks/`)
   ```typescript
   // useServices.ts
   export function useServices(filters: ServiceFilters) {
     return useQuery({
       queryKey: queryKeys.services.list(filters),
       queryFn: () => fetchServices(filters),
       keepPreviousData: true,
     });
   }
   
   export function useService(id: string) {
     return useQuery({
       queryKey: queryKeys.services.detail(id),
       queryFn: () => fetchService(id),
       enabled: !!id,
     });
   }
   
   export function useServiceAnalytics(id: string) {
     return useQuery({
       queryKey: queryKeys.services.analytics(id),
       queryFn: () => fetchServiceAnalytics(id),
       enabled: !!id,
       refetchInterval: 30000, // 30 seconds
     });
   }
   ```

4. **Mutation Hooks** (`website-unified/lib/query/mutations/`)
   ```typescript
   // useServiceMutations.ts
   export function useCreateService() {
     const queryClient = useQueryClient();
     
     return useMutation({
       mutationFn: createService,
       onSuccess: (newService) => {
         queryClient.invalidateQueries(queryKeys.services.all);
         queryClient.setQueryData(
           queryKeys.services.detail(newService.id),
           newService
         );
       },
       onError: handleError,
     });
   }
   
   export function useUpdateService() {
     const queryClient = useQueryClient();
     
     return useMutation({
       mutationFn: updateService,
       onMutate: async (variables) => {
         // Optimistic update
         await queryClient.cancelQueries(queryKeys.services.detail(variables.id));
         const previous = queryClient.getQueryData(queryKeys.services.detail(variables.id));
         queryClient.setQueryData(queryKeys.services.detail(variables.id), (old) => ({
           ...old,
           ...variables.data,
         }));
         return { previous };
       },
       onError: (err, variables, context) => {
         // Rollback
         queryClient.setQueryData(
           queryKeys.services.detail(variables.id),
           context?.previous
         );
       },
       onSettled: (data, error, variables) => {
         queryClient.invalidateQueries(queryKeys.services.detail(variables.id));
       },
     });
   }
   ```

**Technical Requirements:**
- React Query v5
- Optimistic updates
- Cache invalidation
- Background refetching
- Error boundaries

**Deliverables:**
- Query client configuration
- Query key factory
- Data fetching hooks
- Mutation hooks

---

## PROMPT 3: REAL-TIME STATE SYNCHRONIZATION

**Context:** Synchronize state with WebSocket for real-time updates.

**Objective:** Build real-time state sync between server and client.

**Requirements:**
1. **WebSocket State Sync** (`website-unified/lib/store/sync/wsSync.ts`)
   ```typescript
   class WebSocketStateSync {
     private ws: WebSocket;
     private store: StoreApi<AppState>;
     
     constructor(store: StoreApi<AppState>) {
       this.store = store;
       this.connect();
     }
     
     connect(): void {
       this.ws = new WebSocket(WS_URL);
       this.ws.onmessage = this.handleMessage.bind(this);
       this.ws.onclose = this.handleDisconnect.bind(this);
     }
     
     handleMessage(event: MessageEvent): void {
       const message = JSON.parse(event.data);
       
       switch (message.type) {
         case 'PRICE_UPDATE':
           this.store.getState().updatePrice(message.data);
           break;
         case 'BALANCE_UPDATE':
           this.store.getState().updateBalance(message.data);
           break;
         case 'TX_CONFIRMED':
           this.store.getState().confirmTransaction(message.data);
           break;
         case 'NOTIFICATION':
           this.store.getState().addNotification(message.data);
           break;
       }
     }
     
     subscribe(channel: string): void {
       this.ws.send(JSON.stringify({ type: 'SUBSCRIBE', channel }));
     }
     
     unsubscribe(channel: string): void {
       this.ws.send(JSON.stringify({ type: 'UNSUBSCRIBE', channel }));
     }
   }
   ```

2. **Query Invalidation** (`website-unified/lib/store/sync/queryInvalidation.ts`)
   ```typescript
   // Invalidate queries based on WebSocket events
   function setupQueryInvalidation(queryClient: QueryClient, wsSync: WebSocketStateSync) {
     wsSync.on('SERVICE_UPDATED', (serviceId: string) => {
       queryClient.invalidateQueries(queryKeys.services.detail(serviceId));
     });
     
     wsSync.on('SUBSCRIPTION_CHANGED', (userId: string) => {
       queryClient.invalidateQueries(queryKeys.user.subscriptions(userId));
     });
     
     wsSync.on('PAYMENT_RECEIVED', (userId: string) => {
       queryClient.invalidateQueries(queryKeys.payments.history(userId));
       queryClient.invalidateQueries(queryKeys.portfolio.summary(userId));
     });
   }
   ```

3. **Optimistic Updates with Rollback** (`website-unified/lib/store/sync/optimistic.ts`)
   ```typescript
   class OptimisticUpdateManager {
     private pendingUpdates: Map<string, PendingUpdate>;
     
     // Apply optimistic update
     apply<T>(updateId: string, update: () => T): { rollback: () => void } {
       const snapshot = this.snapshot();
       update();
       
       this.pendingUpdates.set(updateId, { snapshot, timestamp: Date.now() });
       
       return {
         rollback: () => this.rollback(updateId),
       };
     }
     
     // Confirm update (server acknowledged)
     confirm(updateId: string): void {
       this.pendingUpdates.delete(updateId);
     }
     
     // Rollback update (server rejected)
     rollback(updateId: string): void {
       const pending = this.pendingUpdates.get(updateId);
       if (pending) {
         this.restore(pending.snapshot);
         this.pendingUpdates.delete(updateId);
       }
     }
   }
   ```

4. **Conflict Resolution** (`website-unified/lib/store/sync/conflictResolution.ts`)
   ```typescript
   class ConflictResolver {
     // Detect conflicts
     detectConflict(local: State, server: State): Conflict | null;
     
     // Resolve with strategies
     resolve(conflict: Conflict, strategy: Strategy): State;
     
     // Strategies
     strategies: {
       serverWins: (conflict: Conflict) => State;
       clientWins: (conflict: Conflict) => State;
       merge: (conflict: Conflict) => State;
       prompt: (conflict: Conflict) => Promise<State>;
     };
   }
   ```

**Technical Requirements:**
- WebSocket integration
- Query invalidation
- Optimistic updates
- Conflict resolution
- Offline support

**Deliverables:**
- WebSocket state sync
- Query invalidation
- Optimistic update manager
- Conflict resolution

---

## PROMPT 4: UI STATE MANAGEMENT

**Context:** Manage UI-specific state for modals, toasts, and user preferences.

**Objective:** Build comprehensive UI state management.

**Requirements:**
1. **UI Store Slice** (`website-unified/lib/store/slices/uiSlice.ts`)
   ```typescript
   interface UISlice {
     // Modal state
     modals: {
       connectWallet: boolean;
       checkout: boolean;
       settings: boolean;
       [key: string]: boolean;
     };
     modalData: Record<string, unknown>;
     
     // Toast state
     toasts: Toast[];
     
     // Sidebar state
     sidebarOpen: boolean;
     sidebarCollapsed: boolean;
     
     // Theme
     theme: 'light' | 'dark' | 'system';
     
     // Actions
     openModal: (modal: string, data?: unknown) => void;
     closeModal: (modal: string) => void;
     showToast: (toast: Omit<Toast, 'id'>) => void;
     dismissToast: (id: string) => void;
     toggleSidebar: () => void;
     setTheme: (theme: Theme) => void;
   }
   ```

2. **Notification System** (`website-unified/lib/store/notifications.ts`)
   ```typescript
   interface NotificationState {
     notifications: Notification[];
     unreadCount: number;
     
     // Actions
     addNotification: (notification: Notification) => void;
     markAsRead: (id: string) => void;
     markAllAsRead: () => void;
     dismiss: (id: string) => void;
     clearAll: () => void;
   }
   
   // Notification types
   type NotificationVariant = 'info' | 'success' | 'warning' | 'error';
   
   interface Notification {
     id: string;
     variant: NotificationVariant;
     title: string;
     message?: string;
     action?: {
       label: string;
       onClick: () => void;
     };
     timestamp: number;
     read: boolean;
     persistent?: boolean;
   }
   ```

3. **User Preferences** (`website-unified/lib/store/preferences.ts`)
   ```typescript
   interface PreferencesState {
     // Display
     currency: 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH';
     locale: string;
     timezone: string;
     
     // Trading
     slippageTolerance: number;
     gasPreference: 'low' | 'medium' | 'high' | 'custom';
     customGasPrice?: bigint;
     
     // Notifications
     emailNotifications: boolean;
     pushNotifications: boolean;
     priceAlerts: boolean;
     
     // Privacy
     hideBalances: boolean;
     analyticsOptOut: boolean;
     
     // Actions
     updatePreference: <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => void;
     resetPreferences: () => void;
   }
   ```

4. **Persistent Storage** (`website-unified/lib/store/persistence.ts`)
   ```typescript
   // Custom storage for SSR compatibility
   const customStorage: StateStorage = {
     getItem: (name) => {
       if (typeof window === 'undefined') return null;
       return localStorage.getItem(name);
     },
     setItem: (name, value) => {
       if (typeof window === 'undefined') return;
       localStorage.setItem(name, value);
     },
     removeItem: (name) => {
       if (typeof window === 'undefined') return;
       localStorage.removeItem(name);
     },
   };
   
   // Selective persistence
   const persistConfig = {
     name: 'user-preferences',
     storage: createJSONStorage(() => customStorage),
     partialize: (state: AppState) => ({
       theme: state.theme,
       preferences: state.preferences,
       favoriteTools: state.favoriteTools,
       recentSearches: state.recentSearches,
     }),
   };
   ```

**Technical Requirements:**
- Modal management
- Toast notifications
- User preferences
- SSR-compatible persistence
- Theme management

**Deliverables:**
- UI state slice
- Notification system
- Preferences management
- Persistent storage

---

## PROMPT 5: STATE DEVTOOLS & DEBUGGING

**Context:** Build debugging tools and state inspection capabilities.

**Objective:** Create comprehensive state debugging and monitoring.

**Requirements:**
1. **State Inspector** (`website-unified/lib/store/devtools/inspector.ts`)
   ```typescript
   class StateInspector {
     // Get current state snapshot
     getSnapshot(): StateSnapshot;
     
     // Compare states
     diff(prev: State, next: State): StateDiff;
     
     // State history
     getHistory(): StateChange[];
     
     // Time travel
     goToState(index: number): void;
     
     // Export state
     exportState(): string;
     
     // Import state
     importState(json: string): void;
   }
   ```

2. **Action Logger** (`website-unified/lib/store/devtools/logger.ts`)
   ```typescript
   const actionLogger = (config) => (set, get, api) =>
     config(
       (args) => {
         const prevState = get();
         const actionName = args.type || 'anonymous';
         
         console.group(`Action: ${actionName}`);
         console.log('Prev State:', prevState);
         console.log('Payload:', args);
         
         set(args);
         
         console.log('Next State:', get());
         console.groupEnd();
         
         // Send to monitoring
         trackAction(actionName, args, prevState, get());
       },
       get,
       api
     );
   ```

3. **Performance Monitor** (`website-unified/lib/store/devtools/performance.ts`)
   ```typescript
   class StatePerformanceMonitor {
     // Track render counts
     trackRenders(component: string): void;
     
     // Track selector performance
     trackSelector(name: string, duration: number): void;
     
     // Get metrics
     getMetrics(): PerformanceMetrics;
     
     // Identify slow selectors
     getSlowSelectors(threshold: number): SlowSelector[];
     
     // Subscription analysis
     analyzeSubscriptions(): SubscriptionAnalysis;
   }
   ```

4. **Debug Panel** (`website-unified/components/debug/StateDebugPanel.tsx`)
   ```typescript
   function StateDebugPanel() {
     // Only in development
     if (process.env.NODE_ENV !== 'development') return null;
     
     return (
       <DebugOverlay>
         <StateTree state={useAppStore.getState()} />
         <ActionHistory actions={getActionHistory()} />
         <PerformanceMetrics metrics={getMetrics()} />
         <SubscriptionList subscriptions={getSubscriptions()} />
         <TimeTravel history={getStateHistory()} />
       </DebugOverlay>
     );
   }
   ```

**Technical Requirements:**
- Redux DevTools integration
- Action logging
- Performance monitoring
- State snapshots
- Time travel debugging

**Deliverables:**
- State inspector
- Action logger
- Performance monitor
- Debug panel component

---

**Integration Notes:**
- Zustand stores for client state
- React Query for server state
- WebSocket sync (Agent 11)
- Auth state (Agent 12)
- Persistence for preferences

**Success Criteria:**
- < 16ms render updates
- Efficient re-renders (minimal)
- Proper state isolation
- SSR compatibility
- DevTools integration
- Reliable persistence
- Real-time sync
