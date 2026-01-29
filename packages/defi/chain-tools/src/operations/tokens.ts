import { z } from 'zod';
import axios from 'axios';
import { BanklessAuthenticationError, BanklessRateLimitError, BanklessResourceNotFoundError, BanklessValidationError } from '../common/banklessErrors.js';

const BASE_URL = 'https://api.bankless.com/mcp';

// Schema for token balances on network request
export const TokenBalancesOnNetworkSchema = z.object({
  network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
  address: z.string().describe('The address to check token balances for')
});


/**
 * Fetches all token balances for a given address on a specific network.
 * 
 * @param network - The blockchain network (e.g., "base", "ethereum") 
 * @param address - The address to check token balances for
 * @returns An object containing token balances and total dollar value
 */
export async function getTokenBalancesOnNetwork(
  network: string,
  address: string
): Promise<{
  balances: Array<{
    amount: number;
    network: string;
    token: {
      network: string;
      logo: string;
      name: string;
      symbol: string;
      address: string;
      decimals: number;
      totalSupply: number;
      underlyingTokens: Array<any>;
      verified: boolean;
      type: string;
    };
    price: number;
    decimalAmount: number;
    dollarValue: number;
  }>;
  totalDollarValue: number;
}> {
  const token = process.env.BANKLESS_API_TOKEN;
  
  if (!token) {
    throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
  }

  const endpoint = `${BASE_URL}/token/balance/${address}/${network}`;
  
  try {
    const response = await axios.get(
      endpoint,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-BANKLESS-TOKEN': `${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 'unknown';
      const errorMessage = error.response?.data?.message || error.message;
      
      if (statusCode === 401 || statusCode === 403) {
        throw new BanklessAuthenticationError(`Authentication Failed: ${errorMessage}`);
      } else if (statusCode === 404) {
        throw new BanklessResourceNotFoundError(`Address or network not found: ${address} on ${network}`);
      } else if (statusCode === 422) {
        throw new BanklessValidationError(`Validation Error: ${errorMessage}`, error.response?.data);
      } else if (statusCode === 429) {
        const resetAt = new Date();
        resetAt.setSeconds(resetAt.getSeconds() + 60);
        throw new BanklessRateLimitError(`Rate Limit Exceeded: ${errorMessage}`, resetAt);
      }
      
      throw new Error(`Bankless API Error (${statusCode}): ${errorMessage}`);
    }
    throw new Error(`Failed to get token balances: ${error instanceof Error ? error.message : String(error)}`);
  }
}