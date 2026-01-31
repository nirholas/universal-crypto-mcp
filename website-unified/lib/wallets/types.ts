/**
 * Wallet Management Types
 * 
 * Core type definitions for multi-chain wallet management
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// ============================================
// Network Types
// ============================================

export type NetworkType = 'mainnet' | 'testnet' | 'l2' | 'sidechain';
export type ChainFamily = 'evm' | 'solana' | 'cosmos' | 'bitcoin';

export interface NetworkConfig {
  id: string;
  chainId: number | string;
  name: string;
  shortName: string;
  family: ChainFamily;
  type: NetworkType;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: string;
    public?: string;
    wss?: string;
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
  iconUrl?: string;
  color?: string;
  testnet?: boolean;
  contracts?: {
    multicall3?: string;
    ensRegistry?: string;
  };
}

export interface NetworkHealth {
  networkId: string;
  blockNumber: number;
  blockTime: number;
  gasPrice: bigint;
  baseFee?: bigint;
  priorityFee?: bigint;
  isHealthy: boolean;
  lastUpdated: Date;
}

// ============================================
// Wallet Provider Types
// ============================================

export type WalletProviderType =
  | 'metamask'
  | 'walletconnect'
  | 'coinbase'
  | 'rainbow'
  | 'phantom'
  | 'solflare'
  | 'ledger'
  | 'trezor'
  | 'safe'
  | 'trust'
  | 'brave'
  | 'injected';

export interface WalletProvider {
  id: WalletProviderType;
  name: string;
  icon: string;
  description: string;
  supportedChains: ChainFamily[];
  downloadUrl?: string;
  isInstalled?: boolean;
  isHardware?: boolean;
  isMultisig?: boolean;
}

export interface ConnectedWallet {
  id: string;
  provider: WalletProviderType;
  walletId?: string;
  address: string;
  chainId: number | string;
  chainFamily: ChainFamily;
  ensName?: string;
  snsName?: string;
  label?: string;
  isConnected?: boolean;
  isDefault?: boolean;
  isActive?: boolean;
  connectedAt: Date | number;
  lastActiveAt?: Date | number;
}

// ============================================
// Token Types
// ============================================

export interface Token {
  address: string;
  chainId: number | string;
  name: string;
  symbol: string;
  decimals: number;
  logoUri?: string;
  isNative?: boolean;
  isVerified?: boolean;
  priceUsd?: number;
  priceChange24h?: number;
}

export interface TokenBalance {
  token: Token;
  balance: bigint;
  balanceFormatted: string;
  valueUsd: number;
  chainId: number | string;
}

// ============================================
// NFT Types
// ============================================

export interface NFT {
  id?: string;
  tokenId: string;
  contractAddress: string;
  chainId: number | string;
  name: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  animationUrl?: string;
  externalUrl?: string;
  collection?: {
    name: string;
    address?: string;
    slug?: string;
    imageUrl?: string;
    floorPrice?: number;
    floorPriceCurrency?: string;
    isVerified?: boolean;
  };
  traits?: NFTTrait[];
  rarity?: {
    rank: number;
    score: number;
    total: number;
  };
  lastSalePrice?: number;
  lastSaleCurrency?: string;
  standard?: string;
  isCompressed?: boolean;
}

export interface NFTTrait {
  traitType: string;
  value: string;
  displayType?: string;
  rarity?: number;
}

// ============================================
// Transaction Types
// ============================================

export type TransactionType = 
  | 'send'
  | 'receive'
  | 'swap'
  | 'approve'
  | 'mint'
  | 'burn'
  | 'stake'
  | 'unstake'
  | 'bridge'
  | 'contract'
  | 'nft_transfer'
  | 'unknown';

export type TransactionStatus = 
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'cancelled'
  | 'replaced';

export interface Transaction {
  hash: string;
  chainId: number | string;
  type: TransactionType;
  status: TransactionStatus;
  from: string;
  to: string;
  value: bigint;
  valueFormatted: string;
  valueUsd?: number;
  token?: Token;
  nft?: NFT;
  gasUsed?: bigint;
  gasFee?: bigint;
  gasPrice?: bigint;
  gasCostUsd?: number;
  nonce?: number;
  blockNumber?: number;
  blockTimestamp?: Date;
  timestamp?: Date;
  confirmations: number;
  data?: string;
  logs?: TransactionLog[];
  description?: string;
}

export interface TransactionLog {
  address: string;
  topics: string[];
  data: string;
  decoded?: {
    eventName: string;
    args: Record<string, unknown>;
  };
}

export interface PendingTransaction extends Transaction {
  submittedAt: Date;
  estimatedConfirmation?: Date;
  canSpeedUp: boolean;
  canCancel: boolean;
}

// ============================================
// Transaction Builder Types
// ============================================

export interface TransactionRequest {
  to: string;
  from?: string;
  value?: bigint;
  data?: string;
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce?: number;
  chainId: number | string;
}

export interface GasEstimate {
  chainId?: number | string;
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  baseFee?: bigint;
  slow?: bigint;
  standard?: bigint;
  fast?: bigint;
  instant?: bigint;
  estimatedCost?: bigint;
  estimatedCostUsd?: number;
  estimatedTime?: number;
}

export interface TransactionSimulation {
  success: boolean;
  gasUsed: bigint;
  returnValue?: string;
  error?: string;
  stateChanges?: StateChange[];
  tokenTransfers?: TokenTransfer[];
  warnings?: SimulationWarning[];
}

export interface StateChange {
  address: string;
  slot: string;
  before: string;
  after: string;
}

export interface TokenTransfer {
  token: Token;
  from: string;
  to: string;
  amount: bigint;
  amountFormatted: string;
}

export interface SimulationWarning {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  code: string;
}

// ============================================
// Contact Types
// ============================================

export interface Contact {
  id: string;
  name: string;
  label?: string;
  addresses: ContactAddress[];
  groups: string[];
  notes?: string;
  isFavorite: boolean;
  totalVolumeUsd: number;
  transactionCount: number;
  createdAt: Date;
  updatedAt: Date;
  // Optional properties used in UI
  avatarUrl?: string;
  isVerified?: boolean;
  ensName?: string;
  tags?: string[];
}

export interface ContactAddress {
  address: string;
  chainFamily: ChainFamily;
  chainId?: number | string;
  chain?: string; // Alias for display purposes
  ensName?: string;
  snsName?: string;
  isVerified: boolean;
  isPrimary?: boolean;
  label?: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  color: string;
  icon?: string;
  contactCount: number;
}

// ============================================
// Security Types
// ============================================

export interface TokenApproval {
  id: string;
  token: Token;
  spender: string;
  spenderName?: string;
  spenderType?: 'dex' | 'lending' | 'nft' | 'bridge' | 'unknown';
  allowance: bigint;
  allowanceFormatted: string;
  isUnlimited: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  valueAtRisk?: number;
  approvedAt?: Date;
  lastUsedAt?: Date;
  transactionHash: string;
}

export interface SecurityScore {
  overall: number;
  approvalScore?: number;
  contractRiskScore?: number;
  exposureScore?: number;
  factors: SecurityFactor[];
  recommendations: SecurityRecommendation[];
  lastUpdated: Date;
}

export interface SecurityFactor {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

export interface SecurityRecommendation {
  severity: string;
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action?: {
    label: string;
    handler: string;
  };
}

export interface ConnectedDApp {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  connectedAt: Date;
  lastActiveAt: Date;
  permissions: string[];
  chainIds: (number | string)[];
}

// ============================================
// Wallet Settings Types
// ============================================

export interface WalletSettings {
  defaultWalletId?: string;
  autoLockTimeout: number;
  requireConfirmation: boolean;
  confirmationThreshold: number;
  displayCurrency: 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH';
  currency: string; // Alias for displayCurrency, used in UI
  hideSmallBalances: boolean;
  hideZeroBalances: boolean;
  smallBalanceThreshold: number;
  showTestnets: boolean;
  favoriteNetworks: string[];
  defaultGasSpeed: 'slow' | 'standard' | 'fast' | 'instant';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    transactions: boolean;
    approvals: boolean;
    security: boolean;
    price: boolean;
  };
}

// ============================================
// Portfolio Types
// ============================================

export interface Portfolio {
  totalValueUsd: number;
  change24h: number;
  changePercent24h: number;
  tokens: TokenBalance[];
  nfts: NFT[];
  defiPositions: DeFiPosition[];
  chainBreakdown: ChainBreakdown[];
  lastUpdated: Date;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  protocolIcon?: string;
  chainId: number | string;
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking' | 'farming';
  tokens: TokenBalance[];
  valueUsd: number;
  apy?: number;
  rewards?: TokenBalance[];
  healthFactor?: number;
}

export interface ChainBreakdown {
  chainId: number | string;
  chainName: string;
  valueUsd: number;
  percentage: number;
  tokenCount: number;
  nftCount: number;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  valueUsd: number;
}

// ============================================
// Wallet State Types
// ============================================

export interface WalletState {
  // Connection state
  isConnecting: boolean;
  isConnected: boolean;
  isReconnecting: boolean;
  error?: Error;
  
  // Connected wallets
  wallets: ConnectedWallet[];
  activeWallet?: ConnectedWallet;
  
  // Network state
  currentNetwork?: NetworkConfig;
  supportedNetworks: NetworkConfig[];
  networkHealth?: NetworkHealth;
  
  // Portfolio state
  portfolio?: Portfolio;
  isLoadingPortfolio: boolean;
  
  // Transaction state
  pendingTransactions: PendingTransaction[];
  
  // Settings
  settings: WalletSettings;
  
  // Recent addresses
  recentAddresses: string[];
  
  // Contacts
  contacts: Contact[];
}

// ============================================
// Connection Data Types
// ============================================

export interface ConnectionData {
  wallet: ConnectedWallet;
  network?: NetworkConfig;
}

// ============================================
// Action Types
// ============================================

export interface WalletActions {
  // Connection
  connect: (provider: WalletProviderType, connectionData?: ConnectionData) => Promise<void>;
  disconnect: (walletId?: string) => Promise<void>;
  switchNetwork: (chainId: number | string, network?: NetworkConfig) => Promise<void>;
  setActiveWallet: (walletId: string) => void;
  
  // Portfolio
  refreshPortfolio: () => Promise<void>;
  hideToken: (tokenAddress: string, chainId: number | string) => void;
  addCustomToken: (token: Token) => Promise<void>;
  
  // Transactions
  sendTransaction: (request: TransactionRequest) => Promise<string>;
  speedUpTransaction: (hash: string) => Promise<string>;
  cancelTransaction: (hash: string) => Promise<string>;
  clearPendingTransactions: () => void;
  
  // Settings
  updateSettings: (settings: Partial<WalletSettings>) => void;
  
  // Contacts
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => Contact;
  deleteContact: (id: string) => void;
  
  // Approvals
  revokeApproval: (tokenAddress: string, spender: string) => Promise<string>;
  batchRevokeApprovals: (approvals: Array<{ tokenAddress: string; spender: string }>) => Promise<string[]>;
}

export type WalletStore = WalletState & WalletActions;
