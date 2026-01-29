/**
 * Token Resources
 * MCP resource providers for token data
 */

import type { Resource, ResourceTemplate } from '../types.js';
import { logger } from '../utils/logger.js';

export const tokenResourceTemplates: ResourceTemplate[] = [
  {
    uriTemplate: 'tokens://{mint}/info',
    name: 'Token Info',
    description: 'Detailed information about a token',
    mimeType: 'application/json',
  },
];

export async function getTokenInfoResource(mint: string): Promise<Resource & { content: string }> {
  logger.debug({ mint }, 'Fetching token info resource');
  
  // TODO: Integrate with solana-core
  return {
    uri: `tokens://${mint}/info`,
    name: `Token ${mint}`,
    mimeType: 'application/json',
    content: JSON.stringify({
      mint,
      symbol: 'UNKNOWN',
      name: 'Unknown Token',
      decimals: 9,
    }, null, 2),
  };
}
