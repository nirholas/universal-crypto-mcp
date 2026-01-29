import {z} from 'zod';
import axios from 'axios';
import {
    BanklessAuthenticationError,
    BanklessRateLimitError,
    BanklessResourceNotFoundError,
    BanklessValidationError
} from '../common/banklessErrors.js';
import {OutputSchema, processOutputs} from './contracts.js';

const BASE_URL = 'https://api.bankless.com/mcp';

// Schema for event logs request
export const GetEventLogsSchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
    addresses: z.array(z.string()).describe('List of contract addresses to filter events'),
    topic: z.string().describe('Primary topic to filter events'),
    optionalTopics: z.array(z.string().nullable()).optional().describe('Optional additional topics'),
    fromBlock: z.number().optional().describe("Block number to start fetching logs from"),
    toBlock: z.number().optional().describe("Block number to stop fetching logs at")
});

// Schema for building event topic
export const BuildEventTopicSchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
    name: z.string().describe('Event name (e.g., "Transfer(address,address,uint256)")'),
    arguments: z.array(OutputSchema).describe('Event arguments types')
});

// Log result type
export type LogResult = {
    removed: boolean;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
    data: string;
    type?: string;
    topics: string[];
    transactionIndexRaw: string;
    logIndexRaw: string;
    blockNumberRaw: string;
};

// EthLog type
export type EthLog = {
    id?: number;
    jsonrpc?: string;
    result: LogResult[];
    error?: any;
    rawResponse?: any;
    logs?: LogResult[];
};

/**
 * Fetches event logs for a given network and filter criteria.
 */
export async function getEvents(
    network: string,
    addresses: string[],
    topic: string,
    optionalTopics: (string | null)[] = [],
    fromBlock?: number,
    toBlock?: number
): Promise<EthLog> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/events/logs`;

    try {
        const response = await axios.post(
            endpoint,
            {
                addresses,
                topic,
                optionalTopics: optionalTopics || [],
                fromBlock,
                toBlock,
                fetchAll: false,
            },
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
        throw new Error(`Failed to fetch event logs: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Builds an event topic signature based on event name and arguments.
 */
export async function buildEventTopic(
    network: string,
    name: string,
    arguments_: z.infer<typeof OutputSchema>[]
): Promise<string> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/contract/build-event-topic`;

    const cleanedOutputs = processOutputs(arguments_);

    try {
        const response = await axios.post(
            endpoint,
            {
                name,
                arguments: cleanedOutputs
            },
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
        throw new Error(`Failed to build event topic: ${error instanceof Error ? error.message : String(error)}`);
    }
}