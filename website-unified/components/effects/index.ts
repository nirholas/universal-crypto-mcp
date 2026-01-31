// Design System Components - Effects & Animations
// Combines shadcn/ui + Tremor + Aceternity UI patterns + Framer Motion

// Backgrounds & Effects
export { AnimatedBackground } from './AnimatedBackground';
export { Sparkles } from './Sparkles';

// Cards & Containers
export { GlowCard } from './GlowCard';
export { BentoGrid, BentoCard } from './BentoGrid';
export { StatsCard } from './StatsCard';
export { AddressCard } from './AddressCard';
export { AgentCard } from './AgentCard';
export { StakingCard } from './StakingCard';
export { NFTCard, NFTGrid } from './NFTCard';

// Typography & Text
export { GradientText } from './GradientText';
export { AnimatedCounter } from './AnimatedCounter';

// Navigation
export { FloatingDock } from './FloatingDock';
export { ChainSelector } from './ChainSelector';
export { AnimatedTabs } from './AnimatedTabs';

// Crypto-Specific
export { PriceTicker } from './PriceTicker';
export { TokenLogo } from './TokenLogo';
export { TokenTable } from './TokenTable';
export { TokenSearch } from './TokenSearch';
export { TradesFeed } from './TradesFeed';
export { PortfolioPie } from './PortfolioPie';
export { SwapWidget } from './SwapWidget';

// Wallet
export { WalletButton } from './WalletButton';
export { ConnectWalletModal } from './ConnectWalletModal';

// Timeline & Transactions
export { TransactionTimeline } from './TransactionTimeline';
export { TransactionList } from './TransactionList';

// Charts (Tremor-based)
export { AreaChart } from './AreaChart';
export { BarChart } from './BarChart';
export { DonutChart } from './DonutChart';

// Security
export { SecurityBadge } from './SecurityBadge';

// Notifications
export { NotificationCenter } from './NotificationCenter';

// AI Chat
export { AIChatWidget } from './AIChatWidget';

// Loading & Skeletons
export { Skeleton, SkeletonCard, SkeletonTable, SkeletonChart, SkeletonTokenList } from './Skeleton';

// Command Palette & Keyboard Shortcuts
export { CommandPalette, useKeyboardShortcuts } from './CommandPalette';

// Toast Notifications
export { ToastProvider, useToast } from './Toast';

// Modals
export { Modal, ConfirmModal, ModalProvider, useModal } from './Modal';

// Form Elements
export { 
  Input, 
  Textarea, 
  Select, 
  Checkbox, 
  Switch, 
  Slider, 
  Button, 
  RadioGroup 
} from './FormElements';

// Data Table
export { DataTable, SimpleTable } from './DataTable';
export type { Column, DataTableProps } from './DataTable';

// Accordion
export { Accordion, AccordionItem, FAQAccordion } from './Accordion';

// Tooltips & Popovers
export { Tooltip, InfoTooltip, Popover } from './Tooltip';

// Progress Indicators
export { 
  ProgressBar, 
  CircularProgress, 
  StepProgress, 
  Spinner, 
  PulseLoader, 
  SkeletonLoader 
} from './Progress';

// Badges & Tags
export { Badge, StatusBadge, CounterBadge, TagInput, ChipGroup } from './Badge';

// Avatars
export { Avatar, AvatarGroup, CryptoAvatar, ProfileCard } from './Avatar';

// Carousel & Sliders
export { Carousel, CardSlider, Marquee, LogoCloud } from './Carousel';

// File Upload
export { Dropzone, FilePreview, FileUpload, ImageUpload } from './FileUpload';

// Alerts & Notifications
export { 
  InlineAlert, 
  BannerAlert, 
  AlertDialog, 
  AlertStackProvider, 
  useAlertStack 
} from './Alert';

// Menus & Navigation
export { DropdownMenu, ContextMenu, Breadcrumb, ActionButton, KebabMenu } from './Menu';

// DeFi Components
export { AdvancedSwapInterface, LiquidityPoolCard, YieldFarmCard } from './DeFiComponents';

// Crypto Widgets
export { TokenMetrics, TrendingTokens, WhaleActivity, FearGreedIndex, Leaderboard } from './CryptoWidgets';
