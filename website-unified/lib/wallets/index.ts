/**
 * Wallet Library Exports
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// Types
export * from './types';

// Networks
export * from './networks';

// Providers
export * from './providers';

// Store
export * from './store';

// Utils
export * from './utils';

// Hooks
export * from './hooks';

// API Layer
export * as api from './api';

// Wagmi Configuration (EVM)
export { wagmiConfig, supportedChains } from './wagmi';
export type { SupportedChain } from './wagmi';

// Solana Configuration
export * from './solana';

// QR Code Generation
export * from './qrcode';
