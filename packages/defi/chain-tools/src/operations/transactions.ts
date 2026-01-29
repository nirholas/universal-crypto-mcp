import {z} from 'zod';
import axios from 'axios';
import {
    BanklessAuthenticationError,
    BanklessRateLimitError,
    BanklessResourceNotFoundError,
    BanklessValidationError
} from '../common/banklessErrors.js';

const BASE_URL = 'https://api.bankless.com/mcp';

// Schema for transaction history request
export const TransactionHistorySchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
    user: z.string().describe('The user address'),
    contract: z.string().nullable().optional().describe('The contract address (optional)'),
    methodId: z.string().nullable().optional().describe('The method ID to filter by (optional)'),
    startBlock: z.string().nullable().optional().describe('The starting block number (optional)'),
    includeData: z.boolean().default(true).describe('Whether to include transaction data')
});

// Schema for transaction info request
export const TransactionInfoSchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "polygon")'),
    txHash: z.string().describe('The transaction hash to fetch details for')
});

// Transaction History Response type
export type SimplifiedTransactionVO = {
    hash: string;
    data: string;
    network: string;
    timestamp: string;
};

// Transaction Info Response type
export type TransactionInfoVO = {
    hash: string;
    blockNumber: number;
    timestamp: string;
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gasUsed: string;
    status: boolean;
    input: string;
    network: string;
    receipt?: {
        contractAddress?: string;
        logs: Array<{
            address: string;
            topics: string[];
            data: string;
        }>;
    };
};

/**
 * Gets transaction history for a user and optional contract.
 */
export async function getTransactionHistory(
    network: string,
    user: string,
    contract?: string | null,
    methodId?: string | null,
    startBlock?: string | null,
    includeData: boolean = true
): Promise<SimplifiedTransactionVO[]> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/transaction-history`;

    try {
        const response = await axios.post(
            endpoint,
            {
                user,
                contract,
                methodId,
                startBlock,
                includeData
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-BANKLESS-TOKEN': `${token}`
                }
            }
        );

        const data = Array.isArray(response.data) ? response.data : [];

        if (data.length > 10000) {
            throw new BanklessValidationError(`too many results, try again with a more specific query`);
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status || 'unknown';
            const errorMessage = error.response?.data?.message || error.message;

            if (statusCode === 401 || statusCode === 403) {
                throw new BanklessAuthenticationError(`Authentication Failed: ${errorMessage}`);
            } else if (statusCode === 404) {
                throw new BanklessResourceNotFoundError(`Not Found: ${errorMessage}`);
            } else if (statusCode === 422) {
                throw new BanklessValidationError(`Validation Error: ${errorMessage}`, error.response?.data);
            } else if (statusCode === 429) {
                // Extract reset timestamp or default to 60 seconds from now
                const resetAt = new Date();
                resetAt.setSeconds(resetAt.getSeconds() + 60);
                throw new BanklessRateLimitError(`Rate Limit Exceeded: ${errorMessage}`, resetAt);
            }

            throw new Error(`Bankless API Error (${statusCode}): ${errorMessage}`);
        }
        throw new Error(`Failed to get transaction history: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Gets detailed information about a specific transaction.
 */
export async function getTransactionInfo(
    network: string,
    txHash: string
): Promise<TransactionInfoVO> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/tx/${txHash}`;

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
                throw new BanklessResourceNotFoundError(`Transaction not found: ${txHash}`);
            } else if (statusCode === 422) {
                throw new BanklessValidationError(`Validation Error: ${errorMessage}`, error.response?.data);
            } else if (statusCode === 429) {
                // Extract reset timestamp or default to 60 seconds from now
                const resetAt = new Date();
                resetAt.setSeconds(resetAt.getSeconds() + 60);
                throw new BanklessRateLimitError(`Rate Limit Exceeded: ${errorMessage}`, resetAt);
            }

            throw new Error(`Bankless API Error (${statusCode}): ${errorMessage}`);
        }
        throw new Error(`Failed to get transaction info: ${error instanceof Error ? error.message : String(error)}`);
    }
}