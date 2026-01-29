import {z} from 'zod';
import axios from 'axios';
import {
    BanklessAuthenticationError,
    BanklessRateLimitError,
    BanklessResourceNotFoundError,
    BanklessValidationError
} from '../common/banklessErrors.js';

const BASE_URL = 'https://api.bankless.com/mcp';

// Schema for block info request
export const BlockInfoSchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
    blockId: z.string().describe('The block number or block hash to fetch information for')
});

// Block Info Response type - matches the Kotlin model
export type BlockInfoVO = {
    number: string; // BigInteger in Kotlin
    hash: string;
    timestamp: string; // BigInteger in Kotlin
    baseFeePerGas: string; // BigInteger in Kotlin
    blobGasUsed: string; // BigInteger in Kotlin
    gasUsed: string; // BigInteger in Kotlin
    gasLimit: string; // BigInteger in Kotlin
    readableTimestamp: string; // Instant in Kotlin, ISO string in TypeScript
    network: string; // Added to maintain consistency with other response types
};

/**
 * Gets detailed information about a specific block.
 * Can be queried by block number or block hash.
 */
export async function getBlockInfo(
    network: string,
    blockId: string
): Promise<BlockInfoVO> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/block/${blockId}`;

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

        // Convert server response to match our BlockInfoVO structure
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status || 'unknown';
            const errorMessage = error.response?.data?.message || error.message;

            if (statusCode === 401 || statusCode === 403) {
                throw new BanklessAuthenticationError(`Authentication Failed: ${errorMessage}`);
            } else if (statusCode === 404) {
                throw new BanklessResourceNotFoundError(`Block not found: ${blockId}`);
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
        throw new Error(`Failed to get block info: ${error instanceof Error ? error.message : String(error)}`);
    }
}