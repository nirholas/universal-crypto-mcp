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
  PortfolioPie,
  SwapWidget,
  FloatingDock,
  WalletButton,
  ConnectWalletModal,
  Sparkles,
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
} from 'lucide-react';

// Mock data
const mockTokens = [
  { rank: 1, symbol: 'BTC', name: 'Bitcoin', price: 95420.50, change24h: 2.34, volume24h: 42000000000, marketCap: 1890000000000, sparkline: [89000, 91000, 93000, 92000, 94000, 95000, 95420] },
  { rank: 2, symbol: 'ETH', name: 'Ethereum', price: 3245.80, change24h: -1.23, volume24h: 18000000000, marketCap: 390000000000, sparkline: [3300, 3280, 3200, 3180, 3220, 3260, 3245] },
  { rank: 3, symbol: 'SOL', name: 'Solana', price: 198.45, change24h: 5.67, volume24h: 4200000000, marketCap: 86000000000, sparkline: [180, 185, 190, 195, 192, 196, 198] },
  { rank: 4, symbol: 'DOGE', name: 'Dogecoin', price: 0.3842, change24h: 12.45, volume24h: 2100000000, marketCap: 56000000000, sparkline: [0.32, 0.33, 0.35, 0.37, 0.36, 0.38, 0.38] },
  { rank: 5, symbol: 'AVAX', name: 'Avalanche', price: 42.18, change24h: -0.89, volume24h: 890000000, marketCap: 17000000000, sparkline: [43, 42.5, 42, 41.5, 42, 42.2, 42.18] },
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
  { symbol: 'AVAX', name: 'Avalanche', balance: 50, price: 42.18 },
];

const dockItems = [
  { icon: <Wallet className="w-6 h-6" />, label: 'Wallets', href: '/wallets' },
  { icon: <BarChart3 className="w-6 h-6" />, label: 'Dashboard', href: '/dashboard' },
  { icon: <ArrowLeftRight className="w-6 h-6" />, label: 'Swap', href: '/swap' },
  { icon: <Bot className="w-6 h-6" />, label: 'Agents', href: '/agents' },
  { icon: <Shield className="w-6 h-6" />, label: 'Security', href: '/security' },
];

export default function DesignSystemDemo() {
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const handleConnect = async (walletId: string) => {
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f12312');
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen text-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-3">
            <Sparkles>
              <span className="text-2xl font-bold">
                <GradientText gradient="purple">CryptoMCP</GradientText>
              </span>
            </Sparkles>
          </div>
          
          <div className="flex items-center gap-4">
            <PriceTicker symbol="BTC" price={95420.50} change={2.34} />
            <PriceTicker symbol="ETH" price={3245.80} change={-1.23} />
            <WalletButton 
              address={walletAddress}
              onConnect={() => setShowConnectModal(true)}
              onDisconnect={() => setWalletAddress(undefined)}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 px-8 pb-32">
          {/* Hero Section */}
          <section className="max-w-6xl mx-auto text-center py-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <GradientText gradient="purple">Universal Crypto</GradientText>
              <br />
              <span className="text-white">MCP Dashboard</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              The most powerful crypto toolkit. Trade, manage wallets, run AI agents, 
              and explore DeFi - all in one beautiful interface.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setShowConnectModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                View Docs
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Value Locked"
                value="$2.4B"
                change={12.5}
                icon={<Coins className="w-6 h-6 text-purple-400" />}
              />
              <StatsCard
                title="24h Volume"
                value="$847M"
                change={-3.2}
                icon={<LineChart className="w-6 h-6 text-cyan-400" />}
              />
              <StatsCard
                title="Active Agents"
                value="1,234"
                change={28.9}
                icon={<Bot className="w-6 h-6 text-emerald-400" />}
              />
              <StatsCard
                title="Transactions"
                value={<AnimatedCounter value={42847} />}
                icon={<Zap className="w-6 h-6 text-amber-400" />}
              />
            </div>
          </section>

          {/* Bento Grid */}
          <section className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">
              <GradientText gradient="blue">Features</GradientText>
            </h2>
            <BentoGrid>
              <BentoCard colSpan={2} rowSpan={2}>
                <h3 className="text-xl font-semibold text-white mb-2">Token Prices</h3>
                <TokenTable tokens={mockTokens} />
              </BentoCard>
              <BentoCard>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Swap</h3>
                <SwapWidget tokens={swapTokens} />
              </BentoCard>
              <BentoCard>
                <h3 className="text-lg font-semibold text-white mb-4">Portfolio</h3>
                <PortfolioPie tokens={portfolioTokens} totalValue={100000} />
              </BentoCard>
            </BentoGrid>
          </section>

          {/* Glow Cards */}
          <section className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8">
              <GradientText gradient="green">Why Choose Us</GradientText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlowCard glowColor="purple">
                <Bot className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Agents</h3>
                <p className="text-white/60">
                  Deploy intelligent agents that trade, monitor, and manage your portfolio 24/7.
                </p>
              </GlowCard>
              <GlowCard glowColor="blue">
                <Shield className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                <p className="text-white/60">
                  Bank-grade security with multi-sig, hardware wallet support, and audit trails.
                </p>
              </GlowCard>
              <GlowCard glowColor="green">
                <Zap className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-white/60">
                  Optimized for speed with sub-second transaction finality across all chains.
                </p>
              </GlowCard>
            </div>
          </section>
        </main>

        {/* Floating Dock */}
        <FloatingDock items={dockItems} />

        {/* Connect Wallet Modal */}
        <ConnectWalletModal
          isOpen={showConnectModal}
          onClose={() => setShowConnectModal(false)}
          onConnect={handleConnect}
        />
      </div>
    </AnimatedBackground>
  );
}
