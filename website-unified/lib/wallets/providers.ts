/**
 * Wallet Provider Configurations
 * 
 * Definitions for 10+ wallet providers
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { WalletProvider, WalletProviderType } from './types';

export const walletProviders: Record<WalletProviderType, WalletProvider> = {
  metamask: {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/icons/wallets/metamask.svg',
    description: 'Connect using MetaMask browser extension',
    supportedChains: ['evm'],
    downloadUrl: 'https://metamask.io/download/',
  },
  walletconnect: {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/icons/wallets/walletconnect.svg',
    description: 'Scan with WalletConnect compatible wallet',
    supportedChains: ['evm', 'solana'],
  },
  coinbase: {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '/icons/wallets/coinbase.svg',
    description: 'Connect using Coinbase Wallet',
    supportedChains: ['evm', 'solana'],
    downloadUrl: 'https://www.coinbase.com/wallet',
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '/icons/wallets/rainbow.svg',
    description: 'Connect using Rainbow wallet',
    supportedChains: ['evm'],
    downloadUrl: 'https://rainbow.me/',
  },
  phantom: {
    id: 'phantom',
    name: 'Phantom',
    icon: '/icons/wallets/phantom.svg',
    description: 'Connect using Phantom wallet',
    supportedChains: ['solana', 'evm'],
    downloadUrl: 'https://phantom.app/',
  },
  solflare: {
    id: 'solflare',
    name: 'Solflare',
    icon: '/icons/wallets/solflare.svg',
    description: 'Connect using Solflare wallet',
    supportedChains: ['solana'],
    downloadUrl: 'https://solflare.com/',
  },
  ledger: {
    id: 'ledger',
    name: 'Ledger',
    icon: '/icons/wallets/ledger.svg',
    description: 'Connect using Ledger hardware wallet',
    supportedChains: ['evm', 'solana'],
    downloadUrl: 'https://www.ledger.com/',
    isHardware: true,
  },
  trezor: {
    id: 'trezor',
    name: 'Trezor',
    icon: '/icons/wallets/trezor.svg',
    description: 'Connect using Trezor hardware wallet',
    supportedChains: ['evm'],
    downloadUrl: 'https://trezor.io/',
    isHardware: true,
  },
  safe: {
    id: 'safe',
    name: 'Safe',
    icon: '/icons/wallets/safe.svg',
    description: 'Connect using Safe multisig wallet',
    supportedChains: ['evm'],
    downloadUrl: 'https://safe.global/',
    isMultisig: true,
  },
  trust: {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '/icons/wallets/trust.svg',
    description: 'Connect using Trust Wallet',
    supportedChains: ['evm', 'solana'],
    downloadUrl: 'https://trustwallet.com/',
  },
  brave: {
    id: 'brave',
    name: 'Brave Wallet',
    icon: '/icons/wallets/brave.svg',
    description: 'Connect using Brave browser wallet',
    supportedChains: ['evm', 'solana'],
  },
  injected: {
    id: 'injected',
    name: 'Browser Wallet',
    icon: '/icons/wallets/injected.svg',
    description: 'Connect using injected browser wallet',
    supportedChains: ['evm'],
  },
};

/**
 * Get wallet providers by chain family
 */
export function getWalletProvidersByChain(family: 'evm' | 'solana'): WalletProvider[] {
  return Object.values(walletProviders).filter(p => 
    p.supportedChains.includes(family)
  );
}

/**
 * Get popular wallet providers for quick access
 */
export function getPopularWallets(): WalletProvider[] {
  return [
    walletProviders.metamask,
    walletProviders.walletconnect,
    walletProviders.coinbase,
    walletProviders.phantom,
  ];
}

/**
 * Get hardware wallet providers
 */
export function getHardwareWallets(): WalletProvider[] {
  return Object.values(walletProviders).filter(p => p.isHardware);
}

/**
 * Check if a wallet provider is installed
 */
export function isWalletInstalled(providerId: WalletProviderType): boolean {
  if (typeof window === 'undefined') return false;
  
  switch (providerId) {
    case 'metamask':
      return !!(window as any).ethereum?.isMetaMask;
    case 'coinbase':
      return !!(window as any).ethereum?.isCoinbaseWallet;
    case 'phantom':
      return !!(window as any).phantom?.solana;
    case 'solflare':
      return !!(window as any).solflare;
    case 'brave':
      return !!(window as any).ethereum?.isBraveWallet;
    case 'trust':
      return !!(window as any).ethereum?.isTrust;
    case 'injected':
      return !!(window as any).ethereum;
    default:
      return false;
  }
}
