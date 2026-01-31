'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  // Form Elements
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Slider,
  Button,
  RadioGroup,
  // DataTable
  DataTable,
  // Accordion
  Accordion,
  AccordionItem,
  FAQAccordion,
  // Tooltip
  Tooltip,
  InfoTooltip,
  // Progress
  ProgressBar,
  CircularProgress,
  StepProgress,
  Spinner,
  PulseLoader,
  // Badges
  Badge,
  StatusBadge,
  CounterBadge,
  TagInput,
  ChipGroup,
  // Avatar
  Avatar,
  AvatarGroup,
  CryptoAvatar,
  ProfileCard,
  // Alert
  InlineAlert,
  AlertDialog,
  // Menu
  DropdownMenu,
  Breadcrumb,
  ActionButton,
  KebabMenu,
  // DeFi
  AdvancedSwapInterface,
  LiquidityPoolCard,
  YieldFarmCard,
  // Crypto Widgets
  TokenMetrics,
  TrendingTokens,
  WhaleActivity,
  FearGreedIndex,
  Leaderboard,
  // Other
  AnimatedBackground,
  GlowCard,
  GradientText,
} from '@/components/effects';
import { Home, Settings, User, Bell, Copy, Trash, Edit, Download, Search, Mail } from 'lucide-react';

export default function ComponentsV2Page() {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    bio: '',
    country: '',
    newsletter: false,
    darkMode: true,
    volume: 50,
    plan: 'pro',
    tags: ['React', 'TypeScript'],
    chips: ['defi'],
  });

  const [showAlertDialog, setShowAlertDialog] = useState(false);

  // Demo Data
  const tableData = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 67890.50, change: 2.34, volume: 45000000000 },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3456.78, change: -1.23, volume: 28000000000 },
    { id: 3, name: 'Solana', symbol: 'SOL', price: 145.67, change: 5.67, volume: 5000000000 },
    { id: 4, name: 'Cardano', symbol: 'ADA', price: 0.89, change: -0.45, volume: 800000000 },
    { id: 5, name: 'Polygon', symbol: 'MATIC', price: 1.23, change: 3.21, volume: 1200000000 },
  ];

  const faqItems = [
    { question: 'What chains are supported?', answer: 'We support Ethereum, Solana, Polygon, Arbitrum, Base, and many more.' },
    { question: 'How do fees work?', answer: 'We charge a 0.3% fee on swaps. There are no hidden fees.' },
    { question: 'Is my wallet safe?', answer: 'Yes, we never have access to your private keys. All transactions are signed locally.' },
  ];

  const trendingTokens = [
    { rank: 1, symbol: 'PEPE', name: 'Pepe', price: 0.0000124, change24h: 45.67, volume24h: 500000000 },
    { rank: 2, symbol: 'WIF', name: 'dogwifhat', price: 2.34, change24h: 23.45, volume24h: 300000000 },
    { rank: 3, symbol: 'BONK', name: 'Bonk', price: 0.0000234, change24h: 12.34, volume24h: 200000000 },
    { rank: 4, symbol: 'FLOKI', name: 'Floki', price: 0.000234, change24h: -5.67, volume24h: 150000000 },
    { rank: 5, symbol: 'SHIB', name: 'Shiba Inu', price: 0.0000245, change24h: 8.90, volume24h: 400000000 },
  ];

  const whaleTransactions = [
    { id: '1', type: 'buy' as const, token: 'ETH', amount: 1500, usdValue: 4850000, timestamp: new Date(Date.now() - 120000) },
    { id: '2', type: 'sell' as const, token: 'BTC', amount: 50, usdValue: 3400000, timestamp: new Date(Date.now() - 300000) },
    { id: '3', type: 'transfer' as const, token: 'USDC', amount: 10000000, usdValue: 10000000, timestamp: new Date(Date.now() - 600000) },
  ];

  const leaderboardEntries = [
    { rank: 1, address: '0x1234567890abcdef1234567890abcdef12345678', ens: 'whale.eth', value: 2450000, change: 156.7 },
    { rank: 2, address: '0xabcdef1234567890abcdef1234567890abcdef12', ens: 'trader.eth', value: 1890000, change: 89.3 },
    { rank: 3, address: '0x567890abcdef1234567890abcdef123456789012', value: 1234000, change: 67.8 },
  ];

  const poolData = {
    token0: { symbol: 'ETH' },
    token1: { symbol: 'USDC' },
    tvl: 45000000,
    apr: 12.5,
    volume24h: 8500000,
    fees24h: 25500,
    userLiquidity: 12500,
  };

  const farmData = {
    name: 'ETH-USDC LP',
    token: { symbol: 'LP' },
    rewardToken: { symbol: 'UNI' },
    apy: 45.67,
    tvl: 25000000,
    earned: 12.345,
    staked: 1000,
    multiplier: '2x',
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <AnimatedBackground variant="particles" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <GradientText as="h1" className="text-5xl font-bold mb-4">
            Design System V2
          </GradientText>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Complete component library with 48 animated components for crypto dashboards
          </p>
        </header>

        {/* ============================================================ */}
        {/* FORM ELEMENTS */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-500 rounded-full" />
            Form Elements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Input Variants</h3>
                <Input 
                  label="Email" 
                  placeholder="you@example.com" 
                  icon={<Mail className="w-4 h-4" />}
                  value={formValues.email}
                  onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                />
                <Input 
                  label="Password" 
                  type="password"
                  placeholder="••••••••" 
                />
                <Input 
                  label="With Error" 
                  error="This field is required"
                  placeholder="Error state"
                />
                <Input 
                  label="Success State" 
                  success
                  defaultValue="Valid input"
                />
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Textarea & Select</h3>
                <Textarea 
                  label="Bio" 
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
                <Select
                  label="Country"
                  placeholder="Select a country"
                  options={[
                    { value: 'us', label: 'United States' },
                    { value: 'uk', label: 'United Kingdom' },
                    { value: 'de', label: 'Germany' },
                    { value: 'jp', label: 'Japan' },
                  ]}
                  value={formValues.country}
                  onChange={(val) => setFormValues({ ...formValues, country: val })}
                />
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Toggles & Switches</h3>
                <Checkbox
                  label="Subscribe to newsletter"
                  description="Get weekly updates"
                  checked={formValues.newsletter}
                  onChange={(val) => setFormValues({ ...formValues, newsletter: val })}
                />
                <Switch
                  label="Dark Mode"
                  checked={formValues.darkMode}
                  onChange={(val) => setFormValues({ ...formValues, darkMode: val })}
                />
                <div className="pt-2">
                  <Slider
                    label="Volume"
                    value={formValues.volume}
                    onChange={(val) => setFormValues({ ...formValues, volume: val })}
                  />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Radio Group</h3>
                <RadioGroup
                  label="Select Plan"
                  options={[
                    { value: 'free', label: 'Free', description: 'Basic features' },
                    { value: 'pro', label: 'Pro', description: 'Advanced features' },
                    { value: 'enterprise', label: 'Enterprise', description: 'Custom solutions' },
                  ]}
                  value={formValues.plan}
                  onChange={(val) => setFormValues({ ...formValues, plan: val })}
                />
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button loading>Loading</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Tags & Chips</h3>
                <TagInput
                  tags={formValues.tags}
                  onChange={(tags) => setFormValues({ ...formValues, tags })}
                  placeholder="Add tag..."
                />
                <ChipGroup
                  options={[
                    { value: 'defi', label: 'DeFi' },
                    { value: 'nft', label: 'NFT' },
                    { value: 'gaming', label: 'Gaming' },
                  ]}
                  value={formValues.chips}
                  onChange={(val) => setFormValues({ ...formValues, chips: val as string[] })}
                  multiple
                />
              </div>
            </GlowCard>
          </div>
        </section>

        {/* ============================================================ */}
        {/* DATA TABLE */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full" />
            Data Table
          </h2>

          <DataTable
            data={tableData}
            columns={[
              { key: 'name', header: 'Name', sortable: true },
              { key: 'symbol', header: 'Symbol' },
              { 
                key: 'price', 
                header: 'Price', 
                sortable: true,
                align: 'right',
                render: (val) => `$${val.toLocaleString()}`
              },
              { 
                key: 'change', 
                header: '24h Change', 
                sortable: true,
                align: 'right',
                render: (val) => (
                  <span className={val >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {val >= 0 ? '+' : ''}{val}%
                  </span>
                )
              },
              { 
                key: 'volume', 
                header: 'Volume', 
                sortable: true,
                align: 'right',
                render: (val) => `$${(val / 1e9).toFixed(2)}B`
              },
            ]}
            searchable
            searchKeys={['name', 'symbol']}
            pageSize={5}
          />
        </section>

        {/* ============================================================ */}
        {/* PROGRESS & LOADING */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            Progress & Loading
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlowCard>
              <div className="p-6 space-y-6">
                <h3 className="font-semibold">Linear Progress</h3>
                <ProgressBar value={75} label="Upload Progress" />
                <ProgressBar value={45} variant="success" label="Success" />
                <ProgressBar value={30} variant="warning" label="Warning" />
                <ProgressBar value={60} variant="danger" label="Danger" />
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6">
                <h3 className="font-semibold mb-6">Circular Progress</h3>
                <div className="flex justify-around">
                  <CircularProgress value={75} label="Complete" />
                  <CircularProgress value={45} variant="success" label="Health" />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6">
                <h3 className="font-semibold mb-6">Loading States</h3>
                <div className="flex items-center gap-8 justify-center">
                  <div className="text-center">
                    <Spinner size="lg" />
                    <p className="text-sm text-white/50 mt-2">Spinner</p>
                  </div>
                  <div className="text-center">
                    <PulseLoader size="lg" />
                    <p className="text-sm text-white/50 mt-2">Pulse</p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          <div className="mt-6">
            <GlowCard>
              <div className="p-6">
                <h3 className="font-semibold mb-6">Step Progress</h3>
                <StepProgress
                  steps={[
                    { label: 'Connect Wallet', description: 'Sign in with your wallet' },
                    { label: 'Select Amount', description: 'Choose how much to stake' },
                    { label: 'Confirm', description: 'Review and confirm' },
                    { label: 'Complete', description: 'Transaction complete' },
                  ]}
                  currentStep={2}
                />
              </div>
            </GlowCard>
          </div>
        </section>

        {/* ============================================================ */}
        {/* BADGES & AVATARS */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-pink-500 rounded-full" />
            Badges & Avatars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Badge Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="gradient">Gradient</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge dot variant="success">With Dot</Badge>
                  <Badge removable onRemove={() => {}}>Removable</Badge>
                  <CounterBadge count={5} />
                  <CounterBadge count={150} max={99} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Status Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="online" />
                  <StatusBadge status="offline" />
                  <StatusBadge status="idle" />
                  <StatusBadge status="busy" />
                  <StatusBadge status="pending" />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Avatars</h3>
                <div className="flex items-center gap-4">
                  <Avatar size="xs" fallback="JD" />
                  <Avatar size="sm" fallback="JD" />
                  <Avatar size="md" fallback="JD" />
                  <Avatar size="lg" fallback="JD" status="online" />
                  <Avatar size="xl" fallback="JD" />
                </div>
                <div className="mt-4">
                  <AvatarGroup
                    avatars={[
                      { fallback: 'JD' },
                      { fallback: 'AB' },
                      { fallback: 'CD' },
                      { fallback: 'EF' },
                      { fallback: 'GH' },
                      { fallback: 'IJ' },
                    ]}
                    max={4}
                  />
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <CryptoAvatar symbol="ETH" chain="ethereum" />
                  <CryptoAvatar symbol="SOL" chain="solana" />
                  <CryptoAvatar symbol="MATIC" chain="polygon" />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="md:col-span-2 lg:col-span-3">
              <ProfileCard
                name="Vitalik Buterin"
                title="Ethereum Co-Founder"
                address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                stats={[
                  { label: 'Holdings', value: '$1.2B' },
                  { label: 'Transactions', value: '15,234' },
                  { label: 'NFTs', value: '847' },
                ]}
              />
            </GlowCard>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MENUS & TOOLTIPS */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            Menus & Tooltips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Dropdown Menu</h3>
                <DropdownMenu
                  trigger={
                    <Button variant="secondary">
                      <Settings className="w-4 h-4" /> Options
                    </Button>
                  }
                  items={[
                    { label: 'Edit', icon: <Edit className="w-4 h-4" />, shortcut: '⌘E' },
                    { label: 'Copy', icon: <Copy className="w-4 h-4" />, shortcut: '⌘C' },
                    { label: 'Download', icon: <Download className="w-4 h-4" /> },
                    { label: 'Delete', icon: <Trash className="w-4 h-4" />, danger: true },
                  ]}
                />
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Action Button</h3>
                <ActionButton
                  label="Create"
                  onClick={() => console.log('Create')}
                  moreActions={[
                    { label: 'Create Token', onClick: () => {} },
                    { label: 'Create Pool', onClick: () => {} },
                    { label: 'Create Farm', onClick: () => {} },
                  ]}
                />
                <div className="mt-4">
                  <KebabMenu
                    items={[
                      { label: 'View Details' },
                      { label: 'Share' },
                      { label: 'Report', danger: true },
                    ]}
                  />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold mb-4">Tooltips</h3>
                <div className="flex items-center gap-4">
                  <Tooltip content="Top tooltip" position="top">
                    <Button variant="ghost" size="sm">Top</Button>
                  </Tooltip>
                  <Tooltip content="Right tooltip" position="right">
                    <Button variant="ghost" size="sm">Right</Button>
                  </Tooltip>
                  <Tooltip content="Bottom tooltip with longer text that wraps" position="bottom">
                    <Button variant="ghost" size="sm">Bottom</Button>
                  </Tooltip>
                  <InfoTooltip content="This is an info tooltip explaining something important" />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="md:col-span-2 lg:col-span-3">
              <div className="p-6">
                <h3 className="font-semibold mb-4">Breadcrumb</h3>
                <Breadcrumb
                  items={[
                    { label: 'Home', icon: <Home className="w-4 h-4" />, onClick: () => {} },
                    { label: 'Dashboard', onClick: () => {} },
                    { label: 'Settings', onClick: () => {} },
                    { label: 'Profile' },
                  ]}
                />
              </div>
            </GlowCard>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ALERTS */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            Alerts & Dialogs
          </h2>

          <div className="space-y-4">
            <InlineAlert type="info" title="Info" message="This is an informational message." closable />
            <InlineAlert type="success" title="Success!" message="Your transaction has been confirmed." />
            <InlineAlert type="warning" title="Warning" message="Gas prices are unusually high right now." action={{ label: 'Learn more', onClick: () => {} }} />
            <InlineAlert type="error" title="Error" message="Transaction failed. Please try again." closable />
          </div>

          <div className="mt-6">
            <Button variant="danger" onClick={() => setShowAlertDialog(true)}>
              Open Confirmation Dialog
            </Button>
          </div>

          <AlertDialog
            isOpen={showAlertDialog}
            onClose={() => setShowAlertDialog(false)}
            onConfirm={() => setShowAlertDialog(false)}
            type="warning"
            title="Confirm Action"
            message="Are you sure you want to proceed? This action cannot be undone."
            confirmLabel="Yes, proceed"
            cancelLabel="Cancel"
          />
        </section>

        {/* ============================================================ */}
        {/* ACCORDION & FAQ */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-cyan-500 rounded-full" />
            Accordion & FAQ
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Default Accordion</h3>
              <Accordion variant="bordered">
                <AccordionItem id="1" title="What is Universal Crypto MCP?">
                  A comprehensive crypto automation platform that connects to 100+ protocols.
                </AccordionItem>
                <AccordionItem id="2" title="How does it work?">
                  Connect your wallet, configure your agents, and let them trade automatically.
                </AccordionItem>
                <AccordionItem id="3" title="Is it secure?">
                  Yes, all private keys remain local. We never have access to your funds.
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h3 className="font-semibold mb-4">FAQ Accordion</h3>
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* DEFI COMPONENTS */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-indigo-500 rounded-full" />
            DeFi Components
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AdvancedSwapInterface className="lg:col-span-1" />
            
            <div className="space-y-4">
              <LiquidityPoolCard pool={poolData} />
              <YieldFarmCard farm={farmData} />
            </div>

            <div className="space-y-4">
              <FearGreedIndex value={72} />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CRYPTO WIDGETS */}
        {/* ============================================================ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full" />
            Crypto Widgets
          </h2>

          <TokenMetrics
            symbol="ETH"
            name="Ethereum"
            price={3456.78}
            change24h={2.34}
            marketCap={415000000000}
            volume24h={28000000000}
            holders={125000000}
            liquidity={5000000000}
            className="mb-6"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <TrendingTokens tokens={trendingTokens} />
            <WhaleActivity transactions={whaleTransactions} />
            <Leaderboard entries={leaderboardEntries} />
          </div>
        </section>

        {/* Summary */}
        <footer className="text-center py-12 border-t border-white/10">
          <GradientText as="h2" className="text-3xl font-bold mb-4">
            48 Components Ready to Use
          </GradientText>
          <p className="text-white/60 max-w-xl mx-auto">
            All components are built with Framer Motion, fully accessible, and designed for crypto dashboards.
          </p>
        </footer>
      </div>
    </div>
  );
}
