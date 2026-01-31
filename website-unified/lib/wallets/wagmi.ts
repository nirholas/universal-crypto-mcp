/**
 * Wagmi Configuration for EVM Wallet Connections
 * 
 * Real wallet connection logic using wagmi v2 + viem
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { createConfig, http, Config } from 'wagmi';
import { 
  mainnet, 
  polygon, 
  arbitrum, 
  optimism, 
  base,
  avalanche,
  bsc,
  gnosis,
  fantom,
  celo,
  zkSync,
  linea,
  scroll,
  mantle,
  manta,
  blast,
  mode,
  sepolia,
  polygonAmoy,
  arbitrumSepolia,
  optimismSepolia,
  baseSepolia,
} from 'wagmi/chains';
import { 
  injected, 
  metaMask, 
  coinbaseWallet, 
  walletConnect,
  safe,
} from 'wagmi/connectors';

// ============================================
// Chain Configuration
// ============================================

// Supported chains with custom RPC configuration
export const supportedChains = [
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
  bsc,
  gnosis,
  fantom,
  celo,
  zkSync,
  linea,
  scroll,
  mantle,
  manta,
  blast,
  mode,
  // Testnets
  sepolia,
  polygonAmoy,
  arbitrumSepolia,
  optimismSepolia,
  baseSepolia,
] as const;

export type SupportedChain = (typeof supportedChains)[number];

// ============================================
// Transport Configuration
// ============================================

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

function getAlchemyUrl(network: string): string {
  return `https://${network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
}

const transports = {
  [mainnet.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('eth-mainnet') : undefined),
  [polygon.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('polygon-mainnet') : undefined),
  [arbitrum.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('arb-mainnet') : undefined),
  [optimism.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('opt-mainnet') : undefined),
  [base.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('base-mainnet') : undefined),
  [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  [bsc.id]: http('https://bsc-dataseed.binance.org'),
  [gnosis.id]: http('https://rpc.gnosischain.com'),
  [fantom.id]: http('https://rpc.ftm.tools'),
  [celo.id]: http('https://forno.celo.org'),
  [zkSync.id]: http('https://mainnet.era.zksync.io'),
  [linea.id]: http('https://rpc.linea.build'),
  [scroll.id]: http('https://rpc.scroll.io'),
  [mantle.id]: http('https://rpc.mantle.xyz'),
  [manta.id]: http('https://pacific-rpc.manta.network/http'),
  [blast.id]: http('https://rpc.blast.io'),
  [mode.id]: http('https://mainnet.mode.network'),
  // Testnets
  [sepolia.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('eth-sepolia') : undefined),
  [polygonAmoy.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('polygon-amoy') : undefined),
  [arbitrumSepolia.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('arb-sepolia') : undefined),
  [optimismSepolia.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('opt-sepolia') : undefined),
  [baseSepolia.id]: http(ALCHEMY_API_KEY ? getAlchemyUrl('base-sepolia') : undefined),
};

// ============================================
// Connector Configuration
// ============================================

const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const connectors = [
  // Injected wallets (MetaMask, Rabby, etc.)
  injected({
    shimDisconnect: true,
  }),
  
  // MetaMask specifically
  metaMask({
    dappMetadata: {
      name: 'Universal Crypto MCP',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://universal-crypto.mcp',
    },
  }),
  
  // Coinbase Wallet
  coinbaseWallet({
    appName: 'Universal Crypto MCP',
    appLogoUrl: 'https://universal-crypto.mcp/logo.png',
  }),
  
  // WalletConnect v2
  ...(WALLETCONNECT_PROJECT_ID
    ? [
        walletConnect({
          projectId: WALLETCONNECT_PROJECT_ID,
          showQrModal: true,
          metadata: {
            name: 'Universal Crypto MCP',
            description: 'Universal Crypto Wallet Manager',
            url: 'https://universal-crypto.mcp',
            icons: ['https://universal-crypto.mcp/logo.png'],
          },
        }),
      ]
    : []),
  
  // Safe (Gnosis Safe)
  safe(),
];

// ============================================
// Wagmi Config
// ============================================

export const wagmiConfig: Config = createConfig({
  chains: supportedChains,
  connectors,
  transports,
  multiInjectedProviderDiscovery: true,
  ssr: true,
});

// ============================================
// Chain Helpers
// ============================================

/**
 * Get chain by ID
 */
export function getChainById(chainId: number): SupportedChain | undefined {
  return supportedChains.find((chain) => chain.id === chainId);
}

/**
 * Check if chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return supportedChains.some((chain) => chain.id === chainId);
}

/**
 * Get native currency for chain
 */
export function getNativeCurrency(chainId: number): { name: string; symbol: string; decimals: number } | undefined {
  const chain = getChainById(chainId);
  return chain?.nativeCurrency;
}

/**
 * Get block explorer URL
 */
export function getBlockExplorerUrl(chainId: number): string | undefined {
  const chain = getChainById(chainId);
  return chain?.blockExplorers?.default?.url;
}

// ============================================
// Wallet Connector Helpers
// ============================================

/**
 * Get available injected wallets
 */
export function getInjectedWallets(): Array<{ name: string; icon?: string; rdns?: string }> {
  if (typeof window === 'undefined') return [];
  
  const wallets: Array<{ name: string; icon?: string; rdns?: string }> = [];
  
  // Check for EIP-6963 providers
  const providers = (window as any).ethereum?.providers;
  if (Array.isArray(providers)) {
    providers.forEach((provider: any) => {
      if (provider.info) {
        wallets.push({
          name: provider.info.name,
          icon: provider.info.icon,
          rdns: provider.info.rdns,
        });
      }
    });
  }
  
  // Check for standard injected provider
  if ((window as any).ethereum && !providers) {
    const eth = (window as any).ethereum;
    
    if (eth.isMetaMask) {
      wallets.push({ name: 'MetaMask', rdns: 'io.metamask' });
    } else if (eth.isCoinbaseWallet) {
      wallets.push({ name: 'Coinbase Wallet', rdns: 'com.coinbase.wallet' });
    } else if (eth.isRabby) {
      wallets.push({ name: 'Rabby', rdns: 'io.rabby' });
    } else if (eth.isBraveWallet) {
      wallets.push({ name: 'Brave Wallet', rdns: 'com.brave.wallet' });
    } else if (eth.isTrust) {
      wallets.push({ name: 'Trust Wallet', rdns: 'com.trustwallet.app' });
    } else {
      wallets.push({ name: 'Injected Wallet' });
    }
  }
  
  return wallets;
}

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).ethereum?.isMetaMask);
}

/**
 * Check if Coinbase Wallet is installed
 */
export function isCoinbaseWalletInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).ethereum?.isCoinbaseWallet);
}

// ============================================
// Transaction Helpers
// ============================================

export interface TransactionRequest {
  to: `0x${string}`;
  value?: bigint;
  data?: `0x${string}`;
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce?: number;
}

/**
 * Estimate gas for a transaction
 */
export async function estimateTransactionGas(
  request: TransactionRequest,
  chainId: number
): Promise<bigint> {
  const chain = getChainById(chainId);
  if (!chain) throw new Error('Unsupported chain');
  
  const { estimateGas } = await import('viem/actions');
  const { createPublicClient } = await import('viem');
  
  const client = createPublicClient({
    chain,
    transport: transports[chainId as keyof typeof transports] || http(),
  });
  
  return estimateGas(client, {
    account: request.to, // Will be overridden by actual account
    to: request.to,
    value: request.value,
    data: request.data,
  });
}

/**
 * Get current gas prices for a chain
 */
export async function getCurrentGasPrices(chainId: number): Promise<{
  gasPrice: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}> {
  const chain = getChainById(chainId);
  if (!chain) throw new Error('Unsupported chain');
  
  const { createPublicClient } = await import('viem');
  const { getGasPrice, estimateFeesPerGas } = await import('viem/actions');
  
  const client = createPublicClient({
    chain,
    transport: transports[chainId as keyof typeof transports] || http(),
  });
  
  try {
    // Try EIP-1559 first
    const fees = await estimateFeesPerGas(client);
    return {
      gasPrice: fees.gasPrice || BigInt(0),
      maxFeePerGas: fees.maxFeePerGas,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
    };
  } catch {
    // Fall back to legacy gas price
    const gasPrice = await getGasPrice(client);
    return { gasPrice };
  }
}

// ============================================
// Config Export
// ============================================

export default wagmiConfig;
