'use client';

import { useState } from 'react';
import {
  AnimatedBackground,
  GradientText,
  GlowCard,
  BentoGrid,
  BentoCard,
  StatsCard,
  AnimatedCounter,
  PriceTicker,
  TokenTable,
  TokenSearch,
  PortfolioPie,
  SwapWidget,
  FloatingDock,
  WalletButton,
  ConnectWalletModal,
  Sparkles,
  ChainSelector,
  AddressCard,
  AgentCard,
  StakingCard,
  NFTCard,
  NFTGrid,
  SecurityBadge,
  NotificationCenter,
  TransactionList,
  TradesFeed,
  AIChatWidget,
  AnimatedTabs,
  AreaChart,
  BarChart,
  DonutChart,
  Skeleton,
  SkeletonCard,
  SkeletonTokenList,
  ToastProvider,
  useToast,
  CommandPalette,
  Modal,
  ConfirmModal,
} from '@/components/effects';
import { 
  Wallet, 
  BarChart3, 
  ArrowLeftRight, 
  Bot, 
  Shield, 
  Zap,
  TrendingUp,
  Coins,
  LineChart,
  Layers,
  Image,
  Activity,
  Settings,
  Home,
} from 'lucide-react';

// ============================================================
// Mock Data
// ============================================================

const mockTokens = [
  { rank: 1, symbol: 'BTC', name: 'Bitcoin', price: 95420.50, change24h: 2.34, volume24h: 42000000000, marketCap: 1890000000000, sparkline: [89000, 91000, 93000, 92000, 94000, 95000, 95420] },
  { rank: 2, symbol: 'ETH', name: 'Ethereum', price: 3245.80, change24h: -1.23, volume24h: 18000000000, marketCap: 390000000000, sparkline: [3300, 3280, 3200, 3180, 3220, 3260, 3245] },
  { rank: 3, symbol: 'SOL', name: 'Solana', price: 198.45, change24h: 5.67, volume24h: 4200000000, marketCap: 86000000000, sparkline: [180, 185, 190, 195, 192, 196, 198] },
];

const portfolioTokens = [
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', value: 45000, percentage: 45 },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', value: 25000, percentage: 25 },
  { symbol: 'SOL', name: 'Solana', color: '#00FFA3', value: 15000, percentage: 15 },
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142', value: 10000, percentage: 10 },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247E5', value: 5000, percentage: 5 },
];

const swapTokens = [
  { symbol: 'ETH', name: 'Ethereum', balance: 2.5, price: 3245.80 },
  { symbol: 'USDC', name: 'USD Coin', balance: 10000, price: 1.0 },
  { symbol: 'SOL', name: 'Solana', balance: 25, price: 198.45 },
];

const mockNFTs = [
  { id: '1', name: 'Bored Ape #1234', collection: 'BAYC', image: 'https://placekitten.com/400/400', price: 45.5, currency: 'ETH', rarity: 'Rare', likes: 234 },
  { id: '2', name: 'Crypto Punk #5678', collection: 'CryptoPunks', image: 'https://placekitten.com/401/401', price: 89.2, currency: 'ETH', likes: 567 },
];

const mockTransactions = [
  { id: '1', hash: '0x1234567890abcdef', type: 'swap' as const, status: 'success' as const, fromToken: { symbol: 'ETH', amount: '1.5' }, toToken: { symbol: 'USDC', amount: '4800' }, timestamp: new Date(Date.now() - 300000) },
  { id: '2', hash: '0xabcdef1234567890', type: 'send' as const, status: 'pending' as const, fromToken: { symbol: 'SOL', amount: '25' }, timestamp: new Date(Date.now() - 60000) },
];

const mockTrades = [
  { id: '1', type: 'buy' as const, tokenSymbol: 'ETH', amount: '2.5', price: '$3,245', total: '$8,112', time: '2m ago' },
  { id: '2', type: 'sell' as const, tokenSymbol: 'BTC', amount: '0.1', price: '$95,420', total: '$9,542', time: '5m ago' },
];

const mockNotifications = [
  { id: '1', type: 'success' as const, title: 'Transaction Confirmed', message: 'Your swap of 1.5 ETH to USDC was successful', timestamp: new Date(Date.now() - 60000), read: false },
  { id: '2', type: 'price' as const, title: 'Price Alert', message: 'BTC just crossed $95,000!', timestamp: new Date(Date.now() - 3600000), read: true },
];

const mockChartData = [
  { date: 'Jan', value: 4000, volume: 2400 },
  { date: 'Feb', value: 3000, volume: 1398 },
  { date: 'Mar', value: 2000, volume: 9800 },
  { date: 'Apr', value: 2780, volume: 3908 },
  { date: 'May', value: 1890, volume: 4800 },
  { date: 'Jun', value: 2390, volume: 3800 },
];

const dockItems = [
  { icon: <Home className="w-6 h-6" />, label: 'Home', href: '/' },
  { icon: <Wallet className="w-6 h-6" />, label: 'Wallets', href: '/wallets' },
  { icon: <BarChart3 className="w-6 h-6" />, label: 'Dashboard', href: '/dashboard' },
  { icon: <Bot className="w-6 h-6" />, label: 'Agents', href: '/agents' },
  { icon: <Settings className="w-6 h-6" />, label: 'Settings', href: '/settings' },
];

// ============================================================
// Component Sections
// ============================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function ComponentGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================

function LibraryContent() {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedChain, setSelectedChain] = useState<any>(null);
  const toast = useToast();

  const handleConnect = async (walletId: string) => {
    await new Promise(r => setTimeout(r, 1500));
    setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f12312');
    toast.success('Wallet Connected', `Connected via ${walletId}`);
  };

  const tabContent = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" />, content: <p className="text-white/60">Overview content goes here</p> },
    { id: 'tokens', label: 'Tokens', icon: <Coins className="w-4 h-4" />, badge: 12, content: <p className="text-white/60">Tokens content goes here</p> },
    { id: 'nfts', label: 'NFTs', icon: <Image className="w-4 h-4" />, content: <p className="text-white/60">NFTs content goes here</p> },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <Sparkles>
            <span className="text-2xl font-bold">
              <GradientText gradient="purple">Component Library</GradientText>
            </span>
          </Sparkles>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationCenter notifications={mockNotifications} />
          <ChainSelector 
            chains={[
              { id: 1, name: 'Ethereum', icon: '⟠', color: '#627EEA' },
              { id: 137, name: 'Polygon', icon: '⬡', color: '#8247E5' },
            ]}
            selectedChain={selectedChain}
            onSelect={setSelectedChain}
          />
          <WalletButton 
            address={walletAddress}
            onConnect={() => setShowConnectModal(true)}
            onDisconnect={() => setWalletAddress(undefined)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-12 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <GradientText gradient="rainbow">35+ Sexy Components</GradientText>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            A comprehensive design system built with Framer Motion, Tremor, and Radix UI.
            Perfect for crypto dashboards, DeFi apps, and Web3 projects.
          </p>
        </div>

        {/* Stats Overview */}
        <Section title="Stats Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Value" value="$124.5K" change={12.5} icon={<Coins className="w-6 h-6 text-purple-400" />} />
            <StatsCard title="24h Volume" value="$847M" change={-3.2} icon={<LineChart className="w-6 h-6 text-cyan-400" />} />
            <StatsCard title="Active Agents" value="1,234" change={28.9} icon={<Bot className="w-6 h-6 text-emerald-400" />} />
            <StatsCard title="Transactions" value={<AnimatedCounter value={42847} />} icon={<Zap className="w-6 h-6 text-amber-400" />} />
          </div>
        </Section>

        {/* Glow Cards */}
        <Section title="Glow Cards">
          <ComponentGrid>
            <GlowCard glowColor="purple">
              <Bot className="w-10 h-10 text-purple-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">AI Agents</h3>
              <p className="text-white/60 text-sm">Deploy intelligent trading agents that work 24/7.</p>
            </GlowCard>
            <GlowCard glowColor="blue">
              <Shield className="w-10 h-10 text-cyan-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Security</h3>
              <p className="text-white/60 text-sm">Enterprise-grade security for your assets.</p>
            </GlowCard>
            <GlowCard glowColor="green">
              <Zap className="w-10 h-10 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Fast</h3>
              <p className="text-white/60 text-sm">Sub-second transaction finality.</p>
            </GlowCard>
          </ComponentGrid>
        </Section>

        {/* Charts */}
        <Section title="Charts (Tremor)">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AreaChart
              title="Portfolio Value"
              subtitle="Last 6 months"
              data={mockChartData}
              index="date"
              categories={['value']}
              colors={['purple']}
            />
            <BarChart
              title="Trading Volume"
              subtitle="By month"
              data={mockChartData}
              index="date"
              categories={['volume']}
              colors={['cyan']}
            />
          </div>
        </Section>

        {/* Token Components */}
        <Section title="Token Components">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <PriceTicker symbol="BTC" price={95420.50} change={2.34} />
              <PriceTicker symbol="ETH" price={3245.80} change={-1.23} />
              <PriceTicker symbol="SOL" price={198.45} change={5.67} />
            </div>
            
            <TokenSearch
              tokens={mockTokens}
              trendingTokens={mockTokens.slice(0, 3)}
              onSelect={(t) => toast.info('Selected', t.symbol)}
            />

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <TokenTable tokens={mockTokens} />
            </div>
          </div>
        </Section>

        {/* Portfolio */}
        <Section title="Portfolio Visualization">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <PortfolioPie tokens={portfolioTokens} totalValue={100000} />
          </div>
        </Section>

        {/* Swap Widget */}
        <Section title="Swap Widget">
          <SwapWidget tokens={swapTokens} />
        </Section>

        {/* Agent Cards */}
        <Section title="Agent Cards">
          <ComponentGrid>
            <AgentCard
              id="1"
              name="DCA Bot"
              description="Dollar cost average into BTC and ETH weekly"
              avatar={<Bot className="w-7 h-7 text-white" />}
              status="active"
              stats={{ trades: 156, profit: 2450, profitPercent: 12.5, runtime: '45 days' }}
            />
            <AgentCard
              id="2"
              name="Arbitrage Hunter"
              description="Find and execute cross-DEX arbitrage opportunities"
              avatar={<Zap className="w-7 h-7 text-white" />}
              status="paused"
              stats={{ trades: 89, profit: -120, profitPercent: -2.1 }}
            />
          </ComponentGrid>
        </Section>

        {/* Staking */}
        <Section title="Staking Cards">
          <ComponentGrid>
            <StakingCard
              pool={{
                id: '1',
                name: 'ETH Staking',
                token: { symbol: 'ETH' },
                rewardToken: { symbol: 'stETH' },
                apy: 4.2,
                tvl: 1500000000,
                lockPeriod: 'Flexible',
                userStaked: 2.5,
                userRewards: 0.105,
              }}
            />
            <StakingCard
              pool={{
                id: '2',
                name: 'SOL Staking',
                token: { symbol: 'SOL' },
                apy: 7.8,
                tvl: 450000000,
                lockPeriod: '30 days',
              }}
            />
          </ComponentGrid>
        </Section>

        {/* NFT Cards */}
        <Section title="NFT Cards">
          <NFTGrid
            nfts={mockNFTs}
            onBuy={(nft) => toast.success('Purchase', `Buying ${nft.name}`)}
            onView={(nft) => toast.info('Viewing', nft.name)}
          />
        </Section>

        {/* Transactions */}
        <Section title="Transaction Components">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Transaction List</h3>
              <TransactionList transactions={mockTransactions} />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Live Trades</h3>
              <TradesFeed trades={mockTrades} />
            </div>
          </div>
        </Section>

        {/* Address Card */}
        <Section title="Address Card">
          <div className="max-w-md">
            <AddressCard
              address="0x742d35Cc6634C0532925a3b844Bc9e7595f12312"
              ensName="vitalik.eth"
              totalValue={124567.89}
              balances={[
                { symbol: 'ETH', name: 'Ethereum', balance: 25.5, value: 82758.9 },
                { symbol: 'USDC', name: 'USD Coin', balance: 35000, value: 35000 },
                { symbol: 'SOL', name: 'Solana', balance: 34, value: 6747.3 },
              ]}
            />
          </div>
        </Section>

        {/* Security */}
        <Section title="Security Components">
          <div className="flex flex-wrap gap-4">
            <SecurityBadge level="safe" score={95} />
            <SecurityBadge level="low" score={82} />
            <SecurityBadge level="medium" score={65} />
            <SecurityBadge level="high" score={35} />
            <SecurityBadge level="critical" score={12} />
          </div>
        </Section>

        {/* Tabs */}
        <Section title="Animated Tabs">
          <div className="space-y-8">
            <AnimatedTabs tabs={tabContent} variant="default" />
            <AnimatedTabs tabs={tabContent} variant="pills" />
            <AnimatedTabs tabs={tabContent} variant="underline" />
          </div>
        </Section>

        {/* Skeletons */}
        <Section title="Loading Skeletons">
          <ComponentGrid>
            <SkeletonCard />
            <SkeletonTokenList count={3} />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </ComponentGrid>
        </Section>

        {/* Buttons */}
        <Section title="Interactive Elements">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => toast.success('Success!', 'This is a success message')}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-medium text-white transition-colors"
            >
              Show Success Toast
            </button>
            <button
              onClick={() => toast.error('Error!', 'Something went wrong')}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-medium text-white transition-colors"
            >
              Show Error Toast
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-medium text-white transition-colors"
            >
              Open Confirm Modal
            </button>
          </div>
        </Section>
      </main>

      {/* Floating Dock */}
      <FloatingDock items={dockItems} />

      {/* Modals */}
      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={handleConnect}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          toast.success('Confirmed!', 'Action was confirmed');
          setShowConfirmModal(false);
        }}
        title="Confirm Action"
        description="Are you sure you want to proceed with this action?"
        variant="default"
      />

      {/* AI Chat */}
      <AIChatWidget
        title="Crypto Assistant"
        onSendMessage={async (msg) => {
          await new Promise(r => setTimeout(r, 1000));
          return `You asked: "${msg}". This is a demo response from the AI assistant!`;
        }}
      />
    </div>
  );
}

// Wrap with providers
export default function ComponentLibraryPage() {
  return (
    <AnimatedBackground>
      <ToastProvider position="bottom-right">
        <LibraryContent />
      </ToastProvider>
    </AnimatedBackground>
  );
}
