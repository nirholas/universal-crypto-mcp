import {z} from 'zod';
import axios from 'axios';
import {
    BanklessAuthenticationError,
    BanklessRateLimitError,
    BanklessResourceNotFoundError,
    BanklessValidationError
} from '../common/banklessErrors';

const BASE_URL = 'https://api.bankless.com/mcp';

// Schema for Input and Output types
export const InputSchema = z.object({
    type: z.string().describe('The type of the input parameter'),
    value: z.any().describe('The value of the input parameter')
});

// Define the interface first
export interface OutputSchemaType {
    type: string;
    components?: OutputSchemaType[];
}

export const OutputSchema: z.ZodType<OutputSchemaType> = z.object({
    type: z.string().describe(`Expected output types for the method call. 
    In case of a tuple, don't use type tuple, but specify the inner types (found in the source) in order. For nested structs, include the substructs types.
    
    Example: 
    struct DataTypeA {
    DataTypeB b;
    //the liquidity index. Expressed in ray
    uint128 liquidityIndex;
    }
    
    struct DataTypeB {
    address token;
    }
    
    results in outputs for function with return type DataTypeA (tuple in abi): outputs: [{"type": "address"}, {"type": "uint128"}]
  `),
    components: z.array(z.lazy(() => OutputSchema)).optional().describe(`optional components for tuple types`)
});

// Schema for read contract request
export const ReadContractSchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
    contract: z.string().describe('The contract address'),
    method: z.string().describe('The contract method to call'),
    inputs: z.array(InputSchema).describe('Input parameters for the method call'),
    outputs: z.array(OutputSchema).describe(`Expected output types for the method call. 
    In case of a tuple, don't use type tuple, but specify the inner types (found in the source) in order. For nested structs, include the substructs types.
    
    Example: 
    struct DataTypeA {
    DataTypeB b;
    //the liquidity index. Expressed in ray
    uint128 liquidityIndex;
    }
    
    struct DataTypeB {
    address token;
    }
    
    results in outputs for function with return type DataTypeA (tuple in abi): outputs: [{"type": "address"}, {"type": "uint128"}]
  `)
});

// Schema for proxy request
export const GetProxySchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
    contract: z.string().describe('The contract address to request the proxy implementation contract for'),
});

// Schema for get ABI request
export const GetAbiSchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
    contract: z.string().describe('The contract address'),
});

// Schema for get source request
export const GetSourceSchema = z.object({
    network: z.string().describe('The blockchain network (e.g., "ethereum", "base")'),
    contract: z.string().describe('The contract address'),
});

// Result types
export type ContractCallResult = {
    value: any;
    type: string;
};

// Proxy type
export type Proxy = {
    implementation: string;
};

// Contract ABI Response type
export type ContractAbiResponse = {
    status: string;
    message: string;
    result: string;
};

// Contract Source Result type
export type ContractSourceResult = {
    sourceCode: string;
    abi: string;
    contractName: string;
    compilerVersion: string;
    optimizationUsed: string;
    runs: string;
    constructorArguments: string;
    evmVersion: string;
    library: string;
    licenseType: string;
    proxy: string;
    implementation: string;
    swarmSource: string;
};

// Contract Source Response type
export type ContractSourceResponse = {
    status: string;
    message: string;
    result: ContractSourceResult[];
};


// Update the process functions to use this type
function processOutput(output: OutputSchemaType) {
    if (output.type === 'tuple' && output.components) {
        return processOutputs(output.components);
    }
    return [output];
}

export function processOutputs(outputs: OutputSchemaType[]) {
    if (!outputs || !Array.isArray(outputs)) {
        return [];
    }

    const result: OutputSchemaType[] = [];

    for (const output of outputs) {
        const processed = processOutput(output);
        result.push(...processed);
    }

    return result;
}

/**
 * Read contract state from a blockchain
 */
export async function readContractState(
    network: string,
    contract: string,
    method: string,
    inputs: z.infer<typeof InputSchema>[],
    outputs: z.infer<typeof OutputSchema>[]
): Promise<ContractCallResult[]> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/contract/read`;

    const cleanedOutputs = processOutputs(outputs);

    try {
        const response = await axios.post(
            endpoint,
            {
                contract,
                method,
                inputs,
                outputs: cleanedOutputs
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
        throw new Error(`Failed to read contract state: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Gets the proxy address for a given network and contract.
 */
export async function getProxy(
    network: string,
    contract: string
): Promise<Proxy> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/contract/${contract}/find-proxy`;

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
        throw new Error(`Failed to get proxy information: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Gets the ABI for a contract.
 */
export async function getAbi(
    network: string,
    contract: string
): Promise<ContractAbiResponse> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/get_abi/${contract}`;

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
        throw new Error(`Failed to get contract ABI: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Gets the source code for a contract.
 */
export async function getSource(
    network: string,
    contract: string
): Promise<ContractSourceResponse> {
    const token = process.env.BANKLESS_API_TOKEN;

    if (!token) {
        throw new BanklessAuthenticationError('BANKLESS_API_TOKEN environment variable is not set');
    }

    const endpoint = `${BASE_URL}/chains/${network}/get_source/${contract}`;

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
        throw new Error(`Failed to get contract source: ${error instanceof Error ? error.message : String(error)}`);
    }
}