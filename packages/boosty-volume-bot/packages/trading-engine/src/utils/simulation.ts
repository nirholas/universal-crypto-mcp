/**
 * Transaction Simulation
 * 
 * Simulates transactions before execution to catch errors early.
 */

import {
  Connection,
  Transaction,
  VersionedTransaction,
  SimulatedTransactionResponse,
  RpcResponseAndContext,
  Commitment,
} from '@solana/web3.js';
import { SimulationError } from '../errors.js';

/**
 * Simulation result with detailed information
 */
export interface SimulationResult {
  /** Whether simulation succeeded */
  success: boolean;
  /** Compute units consumed */
  unitsConsumed: number;
  /** Transaction logs */
  logs: string[];
  /** Return data if any */
  returnData?: {
    programId: string;
    data: string;
  };
  /** Error message if simulation failed */
  error?: string;
  /** Accounts that would be affected */
  accounts?: Array<{
    pubkey: string;
    lamports: number;
    owner: string;
  }>;
  /** Inner instructions */
  innerInstructions?: unknown[];
}

/**
 * Simulation configuration
 */
export interface SimulationConfig {
  /** Commitment level for simulation */
  commitment: Commitment;
  /** Include accounts in response */
  includeAccounts?: boolean;
  /** Replace recent blockhash */
  replaceRecentBlockhash?: boolean;
  /** Min context slot */
  minContextSlot?: number;
}

/**
 * Default simulation config
 */
export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  commitment: 'confirmed',
  replaceRecentBlockhash: true,
};

/**
 * Transaction Simulator
 */
export class TransactionSimulator {
  private readonly connection: Connection;
  private readonly config: SimulationConfig;

  constructor(connection: Connection, config: Partial<SimulationConfig> = {}) {
    this.connection = connection;
    this.config = { ...DEFAULT_SIMULATION_CONFIG, ...config };
  }

  /**
   * Simulate a legacy transaction
   */
  async simulateLegacyTransaction(
    transaction: Transaction,
    signers?: string[]
  ): Promise<SimulationResult> {
    const response = await this.connection.simulateTransaction(transaction, {
      commitment: this.config.commitment,
      sigVerify: signers ? signers.length > 0 : false,
      replaceRecentBlockhash: this.config.replaceRecentBlockhash,
      minContextSlot: this.config.minContextSlot,
    });

    return this.parseSimulationResponse(response);
  }

  /**
   * Simulate a versioned transaction
   */
  async simulateVersionedTransaction(
    transaction: VersionedTransaction,
    options: {
      sigVerify?: boolean;
      includeAccounts?: boolean;
      accountsAddresses?: string[];
    } = {}
  ): Promise<SimulationResult> {
    const config: any = {
      commitment: this.config.commitment,
      replaceRecentBlockhash: this.config.replaceRecentBlockhash,
      minContextSlot: this.config.minContextSlot,
    };

    if (options.sigVerify !== undefined) {
      config.sigVerify = options.sigVerify;
    }

    if (options.includeAccounts && options.accountsAddresses) {
      config.accounts = {
        addresses: options.accountsAddresses,
        encoding: 'base64',
      };
    }

    const response = await this.connection.simulateTransaction(transaction, config);
    return this.parseSimulationResponse(response);
  }

  /**
   * Parse simulation response into standard format
   */
  private parseSimulationResponse(
    response: RpcResponseAndContext<SimulatedTransactionResponse>
  ): SimulationResult {
    const { value } = response;

    const result: SimulationResult = {
      success: value.err === null,
      unitsConsumed: value.unitsConsumed ?? 0,
      logs: value.logs ?? [],
    };

    if (value.err) {
      result.error = this.parseSimulationError(value.err);
    }

    if (value.returnData) {
      result.returnData = {
        programId: value.returnData.programId,
        data: value.returnData.data[0],
      };
    }

    if (value.accounts) {
      result.accounts = value.accounts.map((acc, index) => {
        if (!acc) {
          return {
            pubkey: `unknown-${index}`,
            lamports: 0,
            owner: 'unknown',
          };
        }
        return {
          pubkey: `account-${index}`,
          lamports: acc.lamports,
          owner: acc.owner,
        };
      });
    }

    if (value.innerInstructions) {
      result.innerInstructions = value.innerInstructions;
    }

    return result;
  }

  /**
   * Parse simulation error into readable string
   */
  private parseSimulationError(err: unknown): string {
    if (typeof err === 'string') {
      return err;
    }

    if (typeof err === 'object' && err !== null) {
      // Handle InstructionError
      if ('InstructionError' in err) {
        const instructionError = (err as any).InstructionError;
        if (Array.isArray(instructionError) && instructionError.length >= 2) {
          const [index, errorDetail] = instructionError;
          if (typeof errorDetail === 'object' && errorDetail !== null) {
            const errorKey = Object.keys(errorDetail)[0];
            const errorValue = errorDetail[errorKey];
            return `Instruction ${index}: ${errorKey}${errorValue ? ` (${errorValue})` : ''}`;
          }
          return `Instruction ${index}: ${JSON.stringify(errorDetail)}`;
        }
      }

      // Handle other error formats
      return JSON.stringify(err);
    }

    return String(err);
  }

  /**
   * Simulate and throw if failed
   */
  async simulateOrThrow(
    transaction: Transaction | VersionedTransaction
  ): Promise<SimulationResult> {
    let result: SimulationResult;

    if (transaction instanceof VersionedTransaction) {
      result = await this.simulateVersionedTransaction(transaction);
    } else {
      result = await this.simulateLegacyTransaction(transaction);
    }

    if (!result.success) {
      throw new SimulationError(
        result.error ?? 'Unknown simulation error',
        result.logs,
        result.unitsConsumed
      );
    }

    return result;
  }

  /**
   * Estimate compute units for a transaction
   */
  async estimateComputeUnits(
    transaction: Transaction | VersionedTransaction
  ): Promise<number> {
    const result = transaction instanceof VersionedTransaction
      ? await this.simulateVersionedTransaction(transaction, { sigVerify: false })
      : await this.simulateLegacyTransaction(transaction);

    // Add 10% buffer for safety
    return Math.ceil(result.unitsConsumed * 1.1);
  }

  /**
   * Check if transaction will likely succeed
   */
  async willSucceed(
    transaction: Transaction | VersionedTransaction
  ): Promise<{ likely: boolean; reason?: string }> {
    try {
      const result = transaction instanceof VersionedTransaction
        ? await this.simulateVersionedTransaction(transaction, { sigVerify: false })
        : await this.simulateLegacyTransaction(transaction);

      if (result.success) {
        return { likely: true };
      }

      return {
        likely: false,
        reason: result.error,
      };
    } catch (error) {
      return {
        likely: false,
        reason: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get detailed simulation with account states
   */
  async getDetailedSimulation(
    transaction: VersionedTransaction,
    accountsToFetch: string[]
  ): Promise<SimulationResult> {
    return this.simulateVersionedTransaction(transaction, {
      sigVerify: false,
      includeAccounts: true,
      accountsAddresses: accountsToFetch,
    });
  }
}

/**
 * Create a transaction simulator
 */
export function createSimulator(
  connection: Connection,
  config?: Partial<SimulationConfig>
): TransactionSimulator {
  return new TransactionSimulator(connection, config);
}

/**
 * Quick simulation check
 */
export async function quickSimulate(
  connection: Connection,
  transaction: Transaction | VersionedTransaction
): Promise<SimulationResult> {
  const simulator = new TransactionSimulator(connection);
  
  if (transaction instanceof VersionedTransaction) {
    return simulator.simulateVersionedTransaction(transaction, { sigVerify: false });
  }
  
  return simulator.simulateLegacyTransaction(transaction);
}
