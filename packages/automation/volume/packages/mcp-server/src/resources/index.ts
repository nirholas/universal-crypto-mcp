/**
 * Resources Index - Export all resource providers
 */

export * from './wallet-resources.js';
export * from './campaign-resources.js';
export * from './bot-resources.js';
export * from './token-resources.js';

import { walletResourceTemplates } from './wallet-resources.js';
import { campaignResourceTemplates } from './campaign-resources.js';
import { botResourceTemplates } from './bot-resources.js';
import { tokenResourceTemplates } from './token-resources.js';

export const allResourceTemplates = [
  ...walletResourceTemplates,
  ...campaignResourceTemplates,
  ...botResourceTemplates,
  ...tokenResourceTemplates,
];
