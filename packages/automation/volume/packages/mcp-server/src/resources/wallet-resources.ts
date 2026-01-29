/**
 * Wallet Resources
 * MCP resource providers for wallet data
 */

import type { Resource, ResourceTemplate } from '../types.js';
import { logger } from '../utils/logger.js';

export const walletResourceTemplates: ResourceTemplate[] = [
  {
    uriTemplate: 'wallets://list',
    name: 'Wallet List',
    description: 'List of all wallets with balances',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'wallets://{walletId}',
    name: 'Wallet Details',
    description: 'Detailed information about a specific wallet',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'wallets://{walletId}/transactions',
    name: 'Wallet Transactions',
    description: 'Recent transactions for a wallet',
    mimeType: 'application/json',
  },
];

export async function getWalletListResource(): Promise<Resource & { content: string }> {
  logger.debug('Fetching wallet list resource');
  
  // TODO: Integrate with wallet-manager
  const wallets: any[] = [];
  
  return {
    uri: 'wallets://list',
    name: 'Wallet List',
    mimeType: 'application/json',
    content: JSON.stringify({ wallets, total: wallets.length }, null, 2),
  };
}

export async function getWalletResource(walletId: string): Promise<Resource & { content: string }> {
  logger.debug({ walletId }, 'Fetching wallet resource');
  
  // TODO: Integrate with wallet-manager
  return {
    uri: `wallets://${walletId}`,
    name: `Wallet ${walletId}`,
    mimeType: 'application/json',
    content: JSON.stringify({ error: 'Wallet not found' }, null, 2),
  };
}

export async function getWalletTransactionsResource(walletId: string): Promise<Resource & { content: string }> {
  logger.debug({ walletId }, 'Fetching wallet transactions resource');
  
  // TODO: Integrate with wallet-manager
  return {
    uri: `wallets://${walletId}/transactions`,
    name: `Transactions for ${walletId}`,
    mimeType: 'application/json',
    content: JSON.stringify({ transactions: [] }, null, 2),
  };
}
