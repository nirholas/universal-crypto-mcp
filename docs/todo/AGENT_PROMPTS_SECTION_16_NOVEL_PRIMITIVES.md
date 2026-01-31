# AGENT 20: NOVEL PRIMITIVES
## 5-Phase Implementation Prompts

---

## PROMPT 1: AGENT WALLET SYSTEM

**Context:** Build wallet system designed specifically for AI agents.

**Objective:** Create secure agent-controlled wallets with proper permissions and limits.

**Requirements:**
1. **Agent Wallet Manager** (`website-unified/lib/novel/agentWallet.ts`)
   ```typescript
   export class AgentWalletManager {
     private keystore: SecureKeystore;
     
     async createWallet(agentId: string, config: WalletConfig): Promise<AgentWallet> {
       // Generate deterministic wallet for agent
       const wallet = await this.generateWallet(agentId);
       
       // Set up permissions
       await this.setPermissions(wallet.address, config.permissions);
       
       // Configure spending limits
       await this.setLimits(wallet.address, config.limits);
       
       return {
         address: wallet.address,
         chainId: config.chainId,
         permissions: config.permissions,
         limits: config.limits,
       };
     }
     
     async signTransaction(
       agentId: string,
       tx: Transaction
     ): Promise<SignedTransaction> {
       // Validate against limits
       await this.validateTransaction(agentId, tx);
       
       // Get wallet
       const wallet = await this.getWallet(agentId);
       
       // Sign
       return wallet.signTransaction(tx);
     }
     
     async executeTransaction(
       agentId: string,
       tx: Transaction
     ): Promise<TransactionResult> {
       const signed = await this.signTransaction(agentId, tx);
       return this.broadcast(signed);
     }
   }
   ```

2. **Permission System** (`website-unified/lib/novel/permissions.ts`)
   ```typescript
   export enum WalletPermission {
     TRANSFER_NATIVE = 'transfer_native',
     TRANSFER_ERC20 = 'transfer_erc20',
     TRANSFER_NFT = 'transfer_nft',
     APPROVE_TOKEN = 'approve_token',
     SWAP = 'swap',
     PROVIDE_LIQUIDITY = 'provide_liquidity',
     STAKE = 'stake',
     BORROW = 'borrow',
     ARBITRARY_CALL = 'arbitrary_call',
   }
   
   export interface PermissionConfig {
     allowed: WalletPermission[];
     allowedContracts: string[];
     blockedContracts: string[];
     maxGasPerTx: bigint;
     requireApprovalAbove: bigint;
   }
   
   export class PermissionManager {
     async checkPermission(
       walletAddress: string,
       action: WalletPermission,
       params: unknown
     ): Promise<PermissionResult> {
       const config = await this.getConfig(walletAddress);
       
       if (!config.allowed.includes(action)) {
         return { allowed: false, reason: 'Action not permitted' };
       }
       
       // Additional checks based on action type
       return this.validateActionParams(action, params, config);
     }
   }
   ```

3. **Agent Wallet UI** (`website-unified/app/(novel)/agent-wallet/page.tsx`)
   ```typescript
   export default function AgentWalletPage() {
     const { agentId } = useParams();
     const { data: wallet } = useAgentWallet(agentId);
     
     return (
       <div className="agent-wallet">
         <WalletHeader wallet={wallet} />
         
         <div className="wallet-sections">
           <BalanceOverview wallet={wallet} />
           
           <PermissionsPanel
             permissions={wallet?.permissions}
             onUpdate={updatePermissions}
           />
           
           <SpendingLimitsPanel
             limits={wallet?.limits}
             usage={wallet?.usage}
             onUpdate={updateLimits}
           />
           
           <TransactionHistory
             address={wallet?.address}
             filter={{ agent: true }}
           />
           
           <EmergencyControls
             wallet={wallet}
             onPause={() => pauseWallet(wallet.address)}
             onDrain={() => drainToOwner(wallet.address)}
           />
         </div>
       </div>
     );
   }
   ```

4. **Wallet Security** (`website-unified/lib/novel/walletSecurity.ts`)
   ```typescript
   export class WalletSecurityManager {
     // Transaction simulation before execution
     async simulateTransaction(tx: Transaction): Promise<SimulationResult> {
       const result = await this.tenderly.simulate(tx);
       
       return {
         success: result.success,
         gasUsed: result.gasUsed,
         stateChanges: result.stateChanges,
         balanceChanges: this.parseBalanceChanges(result),
         warnings: this.detectWarnings(result),
       };
     }
     
     // Emergency drain to owner
     async emergencyDrain(walletAddress: string): Promise<void> {
       const owner = await this.getOwner(walletAddress);
       const balances = await this.getAllBalances(walletAddress);
       
       // Transfer all assets to owner
       for (const balance of balances) {
         await this.transfer(walletAddress, owner, balance);
       }
     }
     
     // Freeze wallet
     async freeze(walletAddress: string): Promise<void> {
       await this.setFrozen(walletAddress, true);
     }
   }
   ```

**Technical Stack:**
- Deterministic wallets
- MPC/HSM key management
- Transaction simulation
- Permission contracts
- Emergency controls

**Deliverables:**
- Agent wallet manager
- Permission system
- Wallet UI
- Security controls

---

## PROMPT 2: CREDITS SYSTEM

**Context:** Build prepaid credits system for platform usage.

**Objective:** Create flexible credits for API usage, subscriptions, and payments.

**Requirements:**
1. **Credits Manager** (`website-unified/lib/novel/credits.ts`)
   ```typescript
   export class CreditsManager {
     async getBalance(userId: string): Promise<CreditBalance> {
       const credits = await this.db.credits.findUnique({
         where: { userId },
       });
       
       return {
         available: credits.balance,
         pending: credits.pendingCharges,
         expiring: await this.getExpiringCredits(userId),
       };
     }
     
     async purchase(userId: string, amount: bigint, paymentMethod: string): Promise<PurchaseResult> {
       // Process payment
       const payment = await this.payments.charge(userId, amount, paymentMethod);
       
       // Add credits (with bonus for large purchases)
       const bonus = this.calculateBonus(amount);
       const totalCredits = amount + bonus;
       
       await this.addCredits(userId, totalCredits, {
         source: 'purchase',
         paymentId: payment.id,
         expiresAt: this.calculateExpiry(amount),
       });
       
       return { credits: totalCredits, bonus };
     }
     
     async charge(userId: string, amount: bigint, reason: string): Promise<ChargeResult> {
       const balance = await this.getBalance(userId);
       
       if (balance.available < amount) {
         throw new InsufficientCreditsError(amount, balance.available);
       }
       
       await this.deductCredits(userId, amount, { reason });
       
       return { remaining: balance.available - amount };
     }
     
     async transfer(from: string, to: string, amount: bigint): Promise<void> {
       await this.db.$transaction([
         this.db.credits.update({
           where: { userId: from },
           data: { balance: { decrement: amount } },
         }),
         this.db.credits.update({
           where: { userId: to },
           data: { balance: { increment: amount } },
         }),
       ]);
     }
   }
   ```

2. **Credits Pricing** (`website-unified/lib/novel/creditsPricing.ts`)
   ```typescript
   export const CreditPackages: CreditPackage[] = [
     {
       id: 'starter',
       name: 'Starter',
       credits: 1000,
       price: 10,
       bonus: 0,
     },
     {
       id: 'pro',
       name: 'Pro',
       credits: 5000,
       price: 45,
       bonus: 500, // 10% bonus
     },
     {
       id: 'enterprise',
       name: 'Enterprise',
       credits: 25000,
       price: 200,
       bonus: 5000, // 20% bonus
     },
   ];
   
   export const CreditCosts = {
     toolExecution: {
       simple: 1,    // Basic queries
       medium: 5,    // DeFi operations
       complex: 20,  // Multi-step operations
     },
     marketplaceService: (price: number) => Math.ceil(price * 100), // $1 = 100 credits
     storage: 0.1,   // Per MB per month
     compute: 10,    // Per minute of agent runtime
   };
   ```

3. **Credits UI** (`website-unified/app/(novel)/credits/page.tsx`)
   ```typescript
   export default function CreditsPage() {
     const { data: balance } = useCreditsBalance();
     const { data: history } = useCreditsHistory();
     
     return (
       <div className="credits-page">
         <CreditsBalanceCard balance={balance} />
         
         <div className="purchase-section">
           <h2>Purchase Credits</h2>
           <CreditPackageSelector
             packages={CreditPackages}
             onSelect={purchasePackage}
           />
           
           <CustomAmountInput onPurchase={purchaseCustom} />
         </div>
         
         <div className="usage-section">
           <h2>Credit Usage</h2>
           <UsageBreakdownChart data={balance?.usageBreakdown} />
           <UsageTable history={history} />
         </div>
         
         <div className="expiring-section">
           <h2>Expiring Credits</h2>
           <ExpiringCreditsAlert credits={balance?.expiring} />
         </div>
         
         <div className="auto-reload">
           <h2>Auto-Reload</h2>
           <AutoReloadConfig
             enabled={balance?.autoReload.enabled}
             threshold={balance?.autoReload.threshold}
             amount={balance?.autoReload.amount}
           />
         </div>
       </div>
     );
   }
   ```

4. **Credits API** (`website-unified/app/api/credits/`)
   ```typescript
   // GET /api/credits/balance
   export async function GET(request: Request) {
     const session = await getSession(request);
     const balance = await creditsManager.getBalance(session.userId);
     return Response.json(balance);
   }
   
   // POST /api/credits/purchase
   export async function POST(request: Request) {
     const session = await getSession(request);
     const { packageId, paymentMethod } = await request.json();
     
     const pkg = CreditPackages.find(p => p.id === packageId);
     const result = await creditsManager.purchase(
       session.userId,
       pkg.credits + pkg.bonus,
       paymentMethod
     );
     
     return Response.json(result);
   }
   
   // POST /api/credits/charge
   export async function chargeCredits(request: Request) {
     const { userId, amount, reason } = await request.json();
     const result = await creditsManager.charge(userId, amount, reason);
     return Response.json(result);
   }
   ```

**Technical Requirements:**
- Credit balance tracking
- Purchase with crypto/fiat
- Usage deduction
- Expiry handling
- Auto-reload

**Deliverables:**
- Credits manager
- Pricing system
- Credits UI
- API endpoints

---

## PROMPT 3: REPUTATION & TRUST SYSTEM

**Context:** Build on-chain reputation system for marketplace participants.

**Objective:** Create transparent, verifiable reputation scores.

**Requirements:**
1. **Reputation Calculator** (`website-unified/lib/novel/reputation.ts`)
   ```typescript
   export class ReputationCalculator {
     async calculateScore(address: string): Promise<ReputationScore> {
       const factors = await this.gatherFactors(address);
       
       // Weighted scoring
       const score = 
         factors.transactionHistory * 0.3 +
         factors.reviewScore * 0.25 +
         factors.disputeResolution * 0.2 +
         factors.verifications * 0.15 +
         factors.tenure * 0.1;
       
       return {
         score: Math.round(score),
         factors,
         percentile: await this.calculatePercentile(score),
         badges: await this.determineBadges(factors),
       };
     }
     
     private async gatherFactors(address: string): Promise<ReputationFactors> {
       return {
         transactionHistory: await this.scoreTransactionHistory(address),
         reviewScore: await this.getAverageReviewScore(address),
         disputeResolution: await this.scoreDisputeHistory(address),
         verifications: await this.scoreVerifications(address),
         tenure: await this.scoreTenure(address),
       };
     }
     
     async updateReputation(address: string, event: ReputationEvent): Promise<void> {
       const current = await this.getReputation(address);
       const delta = this.calculateDelta(event);
       
       await this.saveReputation(address, current.score + delta);
       await this.emitReputationChange(address, delta, event);
     }
   }
   ```

2. **Verification System** (`website-unified/lib/novel/verifications.ts`)
   ```typescript
   export enum VerificationType {
     EMAIL = 'email',
     PHONE = 'phone',
     SOCIAL_TWITTER = 'social_twitter',
     SOCIAL_GITHUB = 'social_github',
     ENS_OWNERSHIP = 'ens_ownership',
     WORLDCOIN = 'worldcoin',
     GITCOIN_PASSPORT = 'gitcoin_passport',
   }
   
   export class VerificationManager {
     async verify(
       userId: string,
       type: VerificationType,
       proof: unknown
     ): Promise<VerificationResult> {
       const verifier = this.getVerifier(type);
       const result = await verifier.verify(proof);
       
       if (result.verified) {
         await this.saveVerification(userId, type, result);
         await this.updateReputation(userId, {
           type: 'verification',
           verificationType: type,
         });
       }
       
       return result;
     }
     
     async getVerifications(userId: string): Promise<Verification[]> {
       return this.db.verifications.findMany({
         where: { userId },
       });
     }
   }
   ```

3. **Reputation Display** (`website-unified/components/novel/ReputationBadge.tsx`)
   ```typescript
   interface ReputationBadgeProps {
     address: string;
     size?: 'sm' | 'md' | 'lg';
     showDetails?: boolean;
   }
   
   export function ReputationBadge({ address, size = 'md', showDetails = false }: ReputationBadgeProps) {
     const { data: reputation } = useReputation(address);
     
     const color = useMemo(() => {
       if (reputation?.score >= 90) return 'gold';
       if (reputation?.score >= 70) return 'green';
       if (reputation?.score >= 50) return 'blue';
       return 'gray';
     }, [reputation?.score]);
     
     return (
       <div className={`reputation-badge reputation-${size}`}>
         <div className={`score-circle bg-${color}`}>
           {reputation?.score}
         </div>
         
         <div className="badges">
           {reputation?.badges.map(badge => (
             <Tooltip key={badge.id} content={badge.description}>
               <BadgeIcon type={badge.type} />
             </Tooltip>
           ))}
         </div>
         
         {showDetails && (
           <ReputationDetails
             factors={reputation?.factors}
             verifications={reputation?.verifications}
           />
         )}
       </div>
     );
   }
   ```

4. **Reputation API** (`website-unified/app/api/reputation/`)
   ```typescript
   // GET /api/reputation/[address]
   export async function GET(
     request: Request,
     { params }: { params: { address: string } }
   ) {
     const reputation = await reputationCalculator.calculateScore(params.address);
     return Response.json(reputation);
   }
   
   // POST /api/reputation/verify
   export async function POST(request: Request) {
     const session = await getSession(request);
     const { type, proof } = await request.json();
     
     const result = await verificationManager.verify(
       session.userId,
       type,
       proof
     );
     
     return Response.json(result);
   }
   ```

**Technical Requirements:**
- On-chain reputation
- Multiple verification types
- Score calculation
- Badge system
- Historical tracking

**Deliverables:**
- Reputation calculator
- Verification system
- Reputation UI
- API endpoints

---

## PROMPT 4: CROSS-CHAIN ORCHESTRATION

**Context:** Build system for seamless cross-chain operations.

**Objective:** Create unified cross-chain transaction experience.

**Requirements:**
1. **Cross-Chain Router** (`website-unified/lib/novel/crossChain.ts`)
   ```typescript
   export class CrossChainRouter {
     private bridges: Map<string, BridgeAdapter>;
     
     constructor() {
       this.bridges = new Map([
         ['stargate', new StargateBridge()],
         ['wormhole', new WormholeBridge()],
         ['layerzero', new LayerZeroBridge()],
         ['ccip', new ChainlinkCCIP()],
       ]);
     }
     
     async findBestRoute(
       sourceChain: number,
       destChain: number,
       token: string,
       amount: bigint
     ): Promise<CrossChainRoute> {
       const routes = await Promise.all(
         Array.from(this.bridges.values()).map(bridge =>
           bridge.getRoute(sourceChain, destChain, token, amount)
         )
       );
       
       // Sort by total cost (fees + slippage)
       routes.sort((a, b) => a.totalCost - b.totalCost);
       
       return routes[0];
     }
     
     async executeRoute(route: CrossChainRoute): Promise<CrossChainResult> {
       const bridge = this.bridges.get(route.bridge);
       
       // Execute source chain transaction
       const sourceTx = await bridge.executeSource(route);
       
       // Wait for bridge confirmation
       const bridgeConfirmation = await bridge.waitForConfirmation(sourceTx);
       
       // Execute destination claim (if needed)
       const destTx = await bridge.executeDest(bridgeConfirmation);
       
       return {
         sourceChain: route.sourceChain,
         destChain: route.destChain,
         sourceTx: sourceTx.hash,
         destTx: destTx?.hash,
         bridgeTime: Date.now() - sourceTx.timestamp,
       };
     }
   }
   ```

2. **Chain Abstraction** (`website-unified/lib/novel/chainAbstraction.ts`)
   ```typescript
   export class ChainAbstractor {
     async execute(
       intent: UserIntent,
       userWallet: Wallet
     ): Promise<ExecutionResult> {
       // Parse intent
       const parsed = await this.parseIntent(intent);
       
       // Determine required assets and chains
       const requirements = await this.analyzeRequirements(parsed);
       
       // Check balances across chains
       const balances = await this.getMultiChainBalances(userWallet.address);
       
       // Plan execution (may involve bridging)
       const plan = await this.planExecution(requirements, balances);
       
       // Execute plan
       return this.executePlan(plan, userWallet);
     }
     
     private async planExecution(
       requirements: Requirements,
       balances: MultiChainBalance
     ): Promise<ExecutionPlan> {
       const steps: ExecutionStep[] = [];
       
       for (const req of requirements.assets) {
         const source = this.findBestSource(req, balances);
         
         if (source.chain !== req.targetChain) {
           // Add bridge step
           steps.push({
             type: 'bridge',
             sourceChain: source.chain,
             destChain: req.targetChain,
             token: req.token,
             amount: req.amount,
           });
         }
       }
       
       // Add main operation
       steps.push(...requirements.operations);
       
       return { steps };
     }
   }
   ```

3. **Cross-Chain UI** (`website-unified/components/novel/CrossChainSwap.tsx`)
   ```typescript
   export function CrossChainSwap() {
     const [swap, setSwap] = useState<SwapConfig>({
       sourceChain: 1,
       destChain: 42161,
       tokenIn: 'ETH',
       tokenOut: 'USDC',
       amount: '',
     });
     
     const { data: route } = useCrossChainRoute(swap);
     
     return (
       <div className="cross-chain-swap">
         <ChainSelector
           label="From"
           value={swap.sourceChain}
           onChange={(chain) => setSwap({ ...swap, sourceChain: chain })}
         />
         
         <TokenAmountInput
           token={swap.tokenIn}
           amount={swap.amount}
           chain={swap.sourceChain}
           onChange={(token, amount) => setSwap({ ...swap, tokenIn: token, amount })}
         />
         
         <SwapDirectionButton />
         
         <ChainSelector
           label="To"
           value={swap.destChain}
           onChange={(chain) => setSwap({ ...swap, destChain: chain })}
         />
         
         <TokenSelector
           value={swap.tokenOut}
           chain={swap.destChain}
           onChange={(token) => setSwap({ ...swap, tokenOut: token })}
         />
         
         {route && (
           <RoutePreview route={route}>
             <RouteStep step="Source Swap" details={route.sourceSwap} />
             <RouteStep step="Bridge" details={route.bridge} />
             <RouteStep step="Dest Swap" details={route.destSwap} />
             <RouteSummary
               fee={route.totalFee}
               time={route.estimatedTime}
               received={route.amountOut}
             />
           </RoutePreview>
         )}
         
         <ExecuteButton route={route} />
       </div>
     );
   }
   ```

4. **Bridge Status Tracker** (`website-unified/components/novel/BridgeTracker.tsx`)
   ```typescript
   export function BridgeTracker({ txHash }: { txHash: string }) {
     const { data: status } = useBridgeStatus(txHash);
     
     const steps = [
       { name: 'Source Confirmed', status: status?.sourceConfirmed ? 'complete' : 'pending' },
       { name: 'Bridge Processing', status: status?.bridgeStatus },
       { name: 'Dest Confirmed', status: status?.destConfirmed ? 'complete' : 'pending' },
     ];
     
     return (
       <div className="bridge-tracker">
         <ProgressSteps steps={steps} />
         
         <div className="details">
           <DetailRow label="Source TX" value={status?.sourceTx} />
           <DetailRow label="Bridge" value={status?.bridgeName} />
           <DetailRow label="Dest TX" value={status?.destTx} />
           <DetailRow label="Estimated Time" value={formatDuration(status?.estimatedTime)} />
         </div>
         
         {status?.status === 'complete' && (
           <SuccessMessage>
             Bridge complete! {status.amountReceived} received.
           </SuccessMessage>
         )}
       </div>
     );
   }
   ```

**Technical Requirements:**
- Multi-bridge aggregation
- Optimal route finding
- Transaction tracking
- Chain abstraction
- Error recovery

**Deliverables:**
- Cross-chain router
- Chain abstraction
- Swap UI
- Bridge tracker

---

## PROMPT 5: NOVEL PROTOCOL INTEGRATIONS

**Context:** Integrate novel crypto primitives and emerging protocols.

**Objective:** Build support for cutting-edge crypto innovations.

**Requirements:**
1. **Intent-Based Transactions** (`website-unified/lib/novel/intents.ts`)
   ```typescript
   export class IntentEngine {
     async parseIntent(naturalLanguage: string): Promise<ParsedIntent> {
       const parsed = await this.llm.parse(naturalLanguage, {
         schema: IntentSchema,
       });
       
       return {
         action: parsed.action,
         params: parsed.params,
         constraints: parsed.constraints,
       };
     }
     
     async solve(intent: ParsedIntent): Promise<IntentSolution> {
       // Find solvers
       const solvers = await this.getSolvers(intent.action);
       
       // Get solutions from all solvers
       const solutions = await Promise.all(
         solvers.map(solver => solver.solve(intent))
       );
       
       // Pick best solution
       return this.selectBest(solutions, intent.constraints);
     }
     
     async execute(solution: IntentSolution): Promise<ExecutionResult> {
       return this.executor.execute(solution);
     }
   }
   ```

2. **Account Abstraction** (`website-unified/lib/novel/accountAbstraction.ts`)
   ```typescript
   export class SmartAccountManager {
     async createSmartAccount(owner: Address): Promise<SmartAccount> {
       const account = await this.factory.createAccount(owner);
       
       return {
         address: account.address,
         owner,
         modules: [],
       };
     }
     
     async addModule(
       account: Address,
       module: AccountModule
     ): Promise<void> {
       // Session keys, spending limits, recovery, etc.
       await this.account.addModule(module.address, module.config);
     }
     
     async sponsorTransaction(
       account: Address,
       tx: Transaction
     ): Promise<SponsoredTx> {
       // Get paymaster to sponsor gas
       const paymaster = await this.getPaymaster();
       return paymaster.sponsor(account, tx);
     }
     
     async batchTransactions(
       account: Address,
       txs: Transaction[]
     ): Promise<UserOperation> {
       // Combine multiple transactions into one
       return this.bundler.createUserOp(account, txs);
     }
   }
   ```

3. **Prediction Markets** (`website-unified/lib/novel/predictions.ts`)
   ```typescript
   export class PredictionMarketClient {
     async getMarkets(filters: MarketFilters): Promise<PredictionMarket[]> {
       return this.polymarket.getMarkets(filters);
     }
     
     async getMarketDetails(marketId: string): Promise<MarketDetails> {
       const market = await this.polymarket.getMarket(marketId);
       const orderBook = await this.polymarket.getOrderBook(marketId);
       
       return {
         ...market,
         orderBook,
         positions: await this.getPositions(marketId),
       };
     }
     
     async placeBet(
       marketId: string,
       outcome: string,
       amount: bigint
     ): Promise<TransactionResult> {
       return this.polymarket.buy(marketId, outcome, amount);
     }
     
     async redeemWinnings(marketId: string): Promise<TransactionResult> {
       return this.polymarket.redeem(marketId);
     }
   }
   ```

4. **Novel Primitives UI** (`website-unified/app/(novel)/primitives/page.tsx`)
   ```typescript
   export default function NovelPrimitivesPage() {
     return (
       <div className="novel-primitives">
         <h1>Novel Crypto Primitives</h1>
         
         <div className="primitives-grid">
           <PrimitiveCard
             title="Agent Wallets"
             description="Wallets designed for AI agents with permissions and limits"
             href="/novel/agent-wallet"
             icon="🤖"
           />
           
           <PrimitiveCard
             title="Intent-Based Trading"
             description="Describe what you want, let solvers find the best execution"
             href="/novel/intents"
             icon="🎯"
           />
           
           <PrimitiveCard
             title="Smart Accounts"
             description="Gasless transactions, session keys, and social recovery"
             href="/novel/smart-accounts"
             icon="🔐"
           />
           
           <PrimitiveCard
             title="Cross-Chain"
             description="Seamless operations across 60+ networks"
             href="/novel/cross-chain"
             icon="🌐"
           />
           
           <PrimitiveCard
             title="Prediction Markets"
             description="Trade on future outcomes"
             href="/novel/predictions"
             icon="🔮"
           />
           
           <PrimitiveCard
             title="Reputation System"
             description="On-chain verifiable reputation"
             href="/novel/reputation"
             icon="⭐"
           />
         </div>
       </div>
     );
   }
   ```

**Technical Requirements:**
- Intent parsing
- Account abstraction (ERC-4337)
- Prediction market integration
- Novel protocol adapters
- Future-proof architecture

**Deliverables:**
- Intent engine
- Smart account manager
- Prediction markets
- Novel primitives UI

---

**Integration Notes:**
- Agent wallets for Agent 19
- Credits for platform monetization
- Reputation for marketplace
- Cross-chain for all operations
- Novel primitives as differentiators

**Success Criteria:**
- Secure agent wallets
- Functional credits system
- Accurate reputation scores
- Fast cross-chain operations
- Working novel primitives
- Complete UI coverage
- Production-ready code
