# AGENT 14: SMART CONTRACT INTEGRATION
## 5-Phase Implementation Prompts

---

## PROMPT 1: MARKETPLACE CONTRACT INTEGRATION

**Context:** Integrate AI Service Marketplace smart contracts with the frontend.

**Objective:** Build complete contract integration for marketplace operations.

**Requirements:**
1. **Contract ABIs & Types** (`website-unified/lib/contracts/marketplace/`)
   ```typescript
   // Generated from contracts/marketplace/
   export const AIServiceMarketplaceABI = [...] as const;
   export const ReputationRegistryABI = [...] as const;
   export const EscrowABI = [...] as const;
   export const SubscriptionManagerABI = [...] as const;
   
   // Type-safe contract instances
   export type AIServiceMarketplace = GetContractReturnType<
     typeof AIServiceMarketplaceABI
   >;
   ```

2. **Marketplace Contract Client** (`website-unified/lib/contracts/marketplace/client.ts`)
   ```typescript
   class MarketplaceContractClient {
     constructor(config: ContractConfig);
     
     // Service Registration
     async registerService(params: RegisterServiceParams): Promise<TransactionResult>;
     async updateService(serviceId: bigint, params: UpdateParams): Promise<TransactionResult>;
     async deactivateService(serviceId: bigint): Promise<TransactionResult>;
     
     // Service Discovery
     async getService(serviceId: bigint): Promise<ServiceData>;
     async getServicesByProvider(provider: Address): Promise<ServiceData[]>;
     async getActiveServices(offset: number, limit: number): Promise<ServiceData[]>;
     
     // Subscriptions
     async subscribe(serviceId: bigint, tier: number): Promise<TransactionResult>;
     async cancelSubscription(subscriptionId: bigint): Promise<TransactionResult>;
     async getSubscription(subscriptionId: bigint): Promise<SubscriptionData>;
   }
   ```

3. **Reputation Contract Client** (`website-unified/lib/contracts/marketplace/reputation.ts`)
   ```typescript
   class ReputationContractClient {
     // Read reputation
     async getReputation(provider: Address): Promise<ReputationData>;
     async getReputationHistory(provider: Address): Promise<ReputationEvent[]>;
     
     // Submit review (on-chain)
     async submitReview(params: ReviewParams): Promise<TransactionResult>;
     
     // Dispute resolution
     async initiateDispute(params: DisputeParams): Promise<TransactionResult>;
     async resolveDispute(disputeId: bigint, resolution: Resolution): Promise<TransactionResult>;
   }
   ```

4. **Escrow Contract Client** (`website-unified/lib/contracts/marketplace/escrow.ts`)
   ```typescript
   class EscrowContractClient {
     // Payment escrow
     async deposit(serviceId: bigint, amount: bigint): Promise<TransactionResult>;
     async release(escrowId: bigint): Promise<TransactionResult>;
     async refund(escrowId: bigint): Promise<TransactionResult>;
     
     // Get escrow status
     async getEscrowStatus(escrowId: bigint): Promise<EscrowStatus>;
     async getPendingEscrows(user: Address): Promise<EscrowData[]>;
   }
   ```

**Technical Stack:**
- viem for contract interactions
- wagmi hooks for React
- TypeScript strict mode
- ABI type generation

**Deliverables:**
- Contract ABI imports
- Type-safe contract clients
- Reputation integration
- Escrow management

---

## PROMPT 2: PAYMENT CONTRACT INTEGRATION

**Context:** Integrate x402 and payment smart contracts for crypto payments.

**Objective:** Build payment contract layer for all transaction types.

**Requirements:**
1. **Payment Contract Client** (`website-unified/lib/contracts/payments/client.ts`)
   ```typescript
   class PaymentContractClient {
     constructor(config: PaymentContractConfig);
     
     // Direct payments
     async pay(params: PayParams): Promise<TransactionResult>;
     async payWithToken(params: TokenPayParams): Promise<TransactionResult>;
     
     // Streaming payments
     async createStream(params: StreamParams): Promise<TransactionResult>;
     async cancelStream(streamId: bigint): Promise<TransactionResult>;
     async withdrawFromStream(streamId: bigint): Promise<TransactionResult>;
     
     // Batch payments
     async batchPay(payments: Payment[]): Promise<TransactionResult>;
   }
   ```

2. **Token Approval Handler** (`website-unified/lib/contracts/payments/approvals.ts`)
   ```typescript
   class TokenApprovalHandler {
     // Check allowance
     async getAllowance(token: Address, spender: Address): Promise<bigint>;
     
     // Approve token
     async approve(token: Address, spender: Address, amount: bigint): Promise<TransactionResult>;
     
     // Approve max (infinite)
     async approveMax(token: Address, spender: Address): Promise<TransactionResult>;
     
     // Revoke approval
     async revoke(token: Address, spender: Address): Promise<TransactionResult>;
     
     // Check if approval needed
     async needsApproval(token: Address, spender: Address, amount: bigint): Promise<boolean>;
   }
   ```

3. **Multi-Chain Payment Router** (`website-unified/lib/contracts/payments/router.ts`)
   ```typescript
   class PaymentRouter {
     // Get best route
     async getBestRoute(params: RouteParams): Promise<PaymentRoute>;
     
     // Execute cross-chain payment
     async executeCrossChain(route: PaymentRoute): Promise<TransactionResult>;
     
     // Bridge assets
     async bridge(params: BridgeParams): Promise<TransactionResult>;
     
     // Get fee estimate
     async estimateFees(route: PaymentRoute): Promise<FeeEstimate>;
   }
   ```

4. **Gas Optimization** (`website-unified/lib/contracts/payments/gasOptimizer.ts`)
   ```typescript
   class GasOptimizer {
     // Get optimal gas price
     async getOptimalGasPrice(chain: number): Promise<GasPrice>;
     
     // Estimate transaction gas
     async estimateGas(tx: Transaction): Promise<bigint>;
     
     // Batch for gas savings
     async optimizeBatch(txs: Transaction[]): Promise<OptimizedBatch>;
     
     // EIP-1559 parameters
     async getEIP1559Params(chain: number): Promise<EIP1559Params>;
   }
   ```

**Technical Requirements:**
- Multi-token support
- Cross-chain bridging
- Gas optimization
- Transaction batching
- Permit2 support

**Deliverables:**
- Payment contract client
- Token approval handling
- Cross-chain routing
- Gas optimization

---

## PROMPT 3: DEFI PROTOCOL CONTRACTS

**Context:** Integrate DeFi protocol contracts for lending, swapping, and staking.

**Objective:** Build unified DeFi contract interface for protocol interactions.

**Requirements:**
1. **Uniswap Integration** (`website-unified/lib/contracts/defi/uniswap.ts`)
   ```typescript
   class UniswapClient {
     // Get quote
     async getQuote(params: QuoteParams): Promise<Quote>;
     
     // Execute swap
     async swap(params: SwapParams): Promise<TransactionResult>;
     
     // Add liquidity
     async addLiquidity(params: LiquidityParams): Promise<TransactionResult>;
     
     // Remove liquidity
     async removeLiquidity(params: RemoveLiquidityParams): Promise<TransactionResult>;
     
     // Get pool info
     async getPoolInfo(token0: Address, token1: Address, fee: number): Promise<PoolInfo>;
   }
   ```

2. **Aave Integration** (`website-unified/lib/contracts/defi/aave.ts`)
   ```typescript
   class AaveClient {
     // Lending
     async supply(asset: Address, amount: bigint): Promise<TransactionResult>;
     async withdraw(asset: Address, amount: bigint): Promise<TransactionResult>;
     
     // Borrowing
     async borrow(asset: Address, amount: bigint, rateMode: number): Promise<TransactionResult>;
     async repay(asset: Address, amount: bigint, rateMode: number): Promise<TransactionResult>;
     
     // Health factor
     async getHealthFactor(user: Address): Promise<bigint>;
     
     // User positions
     async getUserPositions(user: Address): Promise<AavePositions>;
   }
   ```

3. **Curve Integration** (`website-unified/lib/contracts/defi/curve.ts`)
   ```typescript
   class CurveClient {
     // Get exchange rate
     async getExchangeRate(pool: Address, i: number, j: number, amount: bigint): Promise<bigint>;
     
     // Exchange
     async exchange(pool: Address, i: number, j: number, amount: bigint, minReceived: bigint): Promise<TransactionResult>;
     
     // Add liquidity
     async addLiquidity(pool: Address, amounts: bigint[]): Promise<TransactionResult>;
     
     // Get virtual price
     async getVirtualPrice(pool: Address): Promise<bigint>;
   }
   ```

4. **Staking Integration** (`website-unified/lib/contracts/defi/staking.ts`)
   ```typescript
   class StakingClient {
     // Stake
     async stake(protocol: string, amount: bigint): Promise<TransactionResult>;
     
     // Unstake
     async unstake(protocol: string, amount: bigint): Promise<TransactionResult>;
     
     // Claim rewards
     async claimRewards(protocol: string): Promise<TransactionResult>;
     
     // Get staking info
     async getStakingInfo(protocol: string, user: Address): Promise<StakingInfo>;
     
     // Get APY
     async getAPY(protocol: string): Promise<number>;
   }
   ```

**Technical Requirements:**
- Multi-protocol support
- Slippage protection
- MEV protection
- Price impact calculation
- Transaction simulation

**Deliverables:**
- Uniswap integration
- Aave integration
- Curve integration
- Staking protocols

---

## PROMPT 4: NFT CONTRACT INTEGRATION

**Context:** Integrate NFT marketplace and collection contracts.

**Objective:** Build NFT contract layer for trading and management.

**Requirements:**
1. **NFT Client** (`website-unified/lib/contracts/nft/client.ts`)
   ```typescript
   class NFTClient {
     // ERC-721
     async transfer721(contract: Address, tokenId: bigint, to: Address): Promise<TransactionResult>;
     async approve721(contract: Address, tokenId: bigint, operator: Address): Promise<TransactionResult>;
     async setApprovalForAll(contract: Address, operator: Address, approved: boolean): Promise<TransactionResult>;
     
     // ERC-1155
     async transfer1155(contract: Address, tokenId: bigint, amount: bigint, to: Address): Promise<TransactionResult>;
     
     // Get owned NFTs
     async getOwnedNFTs(owner: Address): Promise<NFT[]>;
   }
   ```

2. **OpenSea Integration** (`website-unified/lib/contracts/nft/opensea.ts`)
   ```typescript
   class OpenSeaClient {
     // List NFT
     async createListing(params: ListingParams): Promise<TransactionResult>;
     
     // Cancel listing
     async cancelListing(listingId: string): Promise<TransactionResult>;
     
     // Buy NFT
     async fulfillListing(listingId: string): Promise<TransactionResult>;
     
     // Make offer
     async createOffer(params: OfferParams): Promise<TransactionResult>;
     
     // Accept offer
     async acceptOffer(offerId: string): Promise<TransactionResult>;
   }
   ```

3. **Blur Integration** (`website-unified/lib/contracts/nft/blur.ts`)
   ```typescript
   class BlurClient {
     // Bid on collection
     async createCollectionBid(params: CollectionBidParams): Promise<TransactionResult>;
     
     // Sweep floor
     async sweepFloor(collection: Address, count: number, maxPrice: bigint): Promise<TransactionResult>;
     
     // Sell into bid
     async sellIntoBid(tokenId: bigint, bidId: string): Promise<TransactionResult>;
   }
   ```

4. **NFT Metadata** (`website-unified/lib/contracts/nft/metadata.ts`)
   ```typescript
   class NFTMetadataClient {
     // Get token URI
     async getTokenURI(contract: Address, tokenId: bigint): Promise<string>;
     
     // Parse metadata
     async getMetadata(tokenURI: string): Promise<NFTMetadata>;
     
     // Get collection info
     async getCollectionInfo(contract: Address): Promise<CollectionInfo>;
     
     // Refresh metadata
     async refreshMetadata(contract: Address, tokenId: bigint): Promise<void>;
   }
   ```

**Technical Requirements:**
- ERC-721/1155 support
- Seaport protocol
- Blur pool integration
- IPFS/Arweave metadata
- Rarity calculation

**Deliverables:**
- NFT contract client
- OpenSea integration
- Blur integration
- Metadata handling

---

## PROMPT 5: CONTRACT MONITORING & EVENTS

**Context:** Build event listening and contract state monitoring system.

**Objective:** Create real-time contract event streaming and state tracking.

**Requirements:**
1. **Event Listener** (`website-unified/lib/contracts/events/listener.ts`)
   ```typescript
   class ContractEventListener {
     // Subscribe to events
     subscribe(contract: Address, event: string, callback: EventCallback): Unsubscribe;
     
     // Filter events
     subscribeWithFilter(contract: Address, event: string, filter: EventFilter, callback: EventCallback): Unsubscribe;
     
     // Get historical events
     async getEvents(contract: Address, event: string, fromBlock: bigint, toBlock: bigint): Promise<Event[]>;
     
     // Watch all events
     watchAll(contract: Address, callback: EventCallback): Unsubscribe;
   }
   ```

2. **Event Decoder** (`website-unified/lib/contracts/events/decoder.ts`)
   ```typescript
   class EventDecoder {
     // Decode log
     decodeLog(log: Log, abi: Abi): DecodedEvent;
     
     // Parse transaction
     async parseTransaction(txHash: Hash): Promise<ParsedTransaction>;
     
     // Get human-readable description
     getDescription(event: DecodedEvent): string;
     
     // Categorize event
     categorize(event: DecodedEvent): EventCategory;
   }
   ```

3. **State Watcher** (`website-unified/lib/contracts/state/watcher.ts`)
   ```typescript
   class StateWatcher {
     // Watch state changes
     watch(contract: Address, slot: bigint, callback: StateCallback): Unsubscribe;
     
     // Get current state
     async getState(contract: Address, slot: bigint): Promise<bigint>;
     
     // Multicall for batch reads
     async multicall(calls: Call[]): Promise<unknown[]>;
     
     // Watch multiple contracts
     watchMultiple(watches: Watch[]): Unsubscribe;
   }
   ```

4. **Transaction Monitor** (`website-unified/lib/contracts/monitoring/txMonitor.ts`)
   ```typescript
   class TransactionMonitor {
     // Monitor pending tx
     monitor(txHash: Hash, callbacks: TxCallbacks): void;
     
     // Get tx status
     async getStatus(txHash: Hash): Promise<TxStatus>;
     
     // Speed up transaction
     async speedUp(txHash: Hash, gasPrice: bigint): Promise<Hash>;
     
     // Cancel transaction
     async cancel(txHash: Hash): Promise<Hash>;
     
     // Get receipt with retries
     async waitForReceipt(txHash: Hash, confirmations: number): Promise<Receipt>;
   }
   ```

**Technical Requirements:**
- WebSocket subscriptions
- Event indexing
- Transaction simulation
- Reorg handling
- Multi-chain support

**Deliverables:**
- Event listening system
- Event decoding
- State monitoring
- Transaction tracking

---

**Integration Notes:**
- Contract clients used by API routes (Agent 9)
- Events feed WebSocket (Agent 11)
- Transactions stored in DB (Agent 13)
- Security checks (Agent 12)
- Payment flow (Agent 10)

**Success Criteria:**
- Type-safe contract calls
- < 1s event latency
- Reliable transaction tracking
- Accurate gas estimation
- Multi-chain support
- Error recovery
- Transaction simulation
