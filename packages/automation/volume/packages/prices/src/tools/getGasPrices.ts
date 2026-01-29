/**
 * MCP Tool: getGasPrices
 * 
 * Get current gas prices for EVM-compatible blockchains.
 * Supports Ethereum, Arbitrum, Base, Polygon, Optimism, and Avalanche.
 */

import { gasFetcher, type GasPrice } from '../apis/gas.js';
import { ValidationError } from '@boosty/mcp-shared';

// ============================================================================
// Input/Output Types
// ============================================================================

export interface GetGasPricesInput {
  /** Chain name (optional - returns all chains if not specified) */
  chain?: string;
}

export interface GetGasPricesOutput {
  gasPrices: GasPrice[];
  supportedChains: string[];
  timestamp: string;
}

// ============================================================================
// Tool Definition (MCP Schema)
// ============================================================================

export const getGasPricesDefinition = {
  name: 'getGasPrices',
  description:
    'Get current gas prices for EVM blockchains. Returns low, medium, and high gas estimates in gwei. Supports Ethereum, Arbitrum, Base, Polygon, Optimism, and Avalanche.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      chain: {
        type: 'string',
        description:
          'Chain name (ethereum, arbitrum, base, polygon, optimism, avalanche). If not specified, returns gas prices for all supported chains.',
        enum: ['ethereum', 'arbitrum', 'base', 'polygon', 'optimism', 'avalanche'],
      },
    },
    required: [],
  },
};

// ============================================================================
// Tool Implementation
// ============================================================================

/**
 * Validate input parameters
 */
function validateInput(input: unknown): GetGasPricesInput {
  if (input === null || input === undefined) {
    return {};
  }

  if (typeof input !== 'object') {
    throw new ValidationError('Input must be an object or empty');
  }

  const { chain } = input as Record<string, unknown>;

  if (chain !== undefined) {
    if (typeof chain !== 'string') {
      throw new ValidationError('Chain must be a string');
    }

    const supportedChains = gasFetcher.getSupportedChains();
    const normalizedChain = chain.toLowerCase().trim();

    if (!supportedChains.includes(normalizedChain)) {
      throw new ValidationError(
        `Unsupported chain: ${chain}. Supported chains: ${supportedChains.join(', ')}`
      );
    }

    return { chain: normalizedChain };
  }

  return {};
}

/**
 * Get gas prices for one or all supported chains
 */
export async function getGasPrices(input: unknown): Promise<GetGasPricesOutput> {
  const { chain } = validateInput(input);

  const supportedChains = gasFetcher.getSupportedChains();
  let gasPrices: GasPrice[];

  if (chain) {
    // Get gas price for specific chain
    const gasPrice = await gasFetcher.getGasPrice(chain);
    gasPrices = [gasPrice];
  } else {
    // Get gas prices for all chains
    gasPrices = await gasFetcher.getAllGasPrices();
  }

  return {
    gasPrices,
    supportedChains,
    timestamp: new Date().toISOString(),
  };
}
