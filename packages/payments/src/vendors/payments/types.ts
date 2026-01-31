/**
 * payments Types
 *
 * Auto-extracted from vendor/payments/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

export interface Address {
    /**
     * The ID of the wallet that owns the address
     * @type {string}

export interface AddressBalanceList {
    /**
     * 
     * @type {Array<Balance>}

export interface AddressHistoricalBalanceList {
    /**
     * 
     * @type {Array<HistoricalBalance>}

export interface AddressList {
    /**
     * 
     * @type {Array<Address>}

export interface AddressReputation {
    /**
     * The score of a wallet address, ranging from -100 to 100. A negative score indicates a bad reputation, while a positive score indicates a good reputation.
     * @type {number}

export interface AddressReputationMetadata {
    /**
     * The total number of transactions performed by the address.
     * @type {number}

export interface AddressTransactionList {
    /**
     * 
     * @type {Array<Transaction>}

export interface Asset {
    /**
     * The ID of the blockchain network
     * @type {string}

export interface Balance {
    /**
     * The amount in the atomic units of the asset
     * @type {string}

export interface BroadcastContractInvocationRequest {
    /**
     * The hex-encoded signed payload of the contract invocation
     * @type {string}

export interface BroadcastExternalTransaction200Response {
    /**
     * The transaction hash
     * @type {string}

export interface BroadcastExternalTransactionRequest {
    /**
     * The hex-encoded signed payload of the external address transaction.
     * @type {string}

export interface BroadcastExternalTransferRequest {
    /**
     * The hex-encoded signed payload of the external transfer
     * @type {string}

export interface BroadcastStakingOperationRequest {
    /**
     * The hex-encoded signed payload of the staking operation.
     * @type {string}

export interface BroadcastTradeRequest {
    /**
     * The hex-encoded signed payload of the trade
     * @type {string}

export interface BroadcastTransferRequest {
    /**
     * The hex-encoded signed payload of the transfer
     * @type {string}

export interface BroadcastUserOperationRequest {
    /**
     * The hex-encoded signature of the user operation.
     * @type {string}

export interface BuildStakingOperationRequest {
    /**
     * The ID of the blockchain network
     * @type {string}

export interface Call {
    /**
     * The address the call is interacting with.
     * @type {string}

export interface CompileSmartContractRequest {
    /**
     * The JSON input containing the Solidity code, dependencies, and compiler settings.
     * @type {string}

// ============================================================
// Types from vendor code
// ============================================================

export type SendUserOperationOptions<T extends readonly unknown[]> = {
  /**
   * Array of contract calls to execute in the user operation.
   * Each call can either be:
   * - A direct call with `to`, `value`, and `data`
   * - A contract call with `to`, `abi`, `functionName`, and `args`
   *
   * @example
   * ```ts
   * const calls = [
   *   {
   *     to: "0x1234567890123456789012345678901234567890",
   *     value: parseEther("0.0000005"),
   *     data: "0x",
   *   },
   *   {
   *     to: "0x1234567890123456789012345678901234567890",
   *     abi: erc20Abi,
   *     functionName: "transfer",
   *     args: [to, amount],
   *   },
   * ]
   * ```
   */
  calls: Calls<T>;

export type SendUserOperationReturnType = {
  /** The address of the smart wallet */
  smartWalletAddress: Address;

export type WaitForUserOperationOptions = {
  /** The hash of the user operation */
  userOpHash: Hex;

export type FailedOperation = {
  /** The address of the smart wallet */
  smartWalletAddress: Address;

export type CompletedOperation = {
  /** The address of the smart wallet */
  smartWalletAddress: Address;

export type WaitForUserOperationReturnType = FailedOperation | CompletedOperation;

export type FundOperationStatusEnum = typeof FundOperationStatusEnum[keyof typeof FundOperationStatusEnum];

export type NetworkProtocolFamilyEnum = typeof NetworkProtocolFamilyEnum[keyof typeof NetworkProtocolFamilyEnum];

export type NetworkIdentifier = typeof NetworkIdentifier[keyof typeof NetworkIdentifier];

export type PayloadSignatureStatusEnum = typeof PayloadSignatureStatusEnum[keyof typeof PayloadSignatureStatusEnum];

export type ServerSignerEventEvent = SeedCreationEvent | SignatureCreationEvent;

export type SmartContractOptions = MultiTokenContractOptions | NFTContractOptions | TokenContractOptions | string;

export type SmartContractType = typeof SmartContractType[keyof typeof SmartContractType];

export type SolidityValueTypeEnum = typeof SolidityValueTypeEnum[keyof typeof SolidityValueTypeEnum];

export type SponsoredSendStatusEnum = typeof SponsoredSendStatusEnum[keyof typeof SponsoredSendStatusEnum];

export type StakingOperationStatusEnum = typeof StakingOperationStatusEnum[keyof typeof StakingOperationStatusEnum];

export type StakingOperationMetadata = Array<SignedVoluntaryExitMessageMetadata>;

export type StakingRewardStateEnum = typeof StakingRewardStateEnum[keyof typeof StakingRewardStateEnum];

export type StakingRewardFormat = typeof StakingRewardFormat[keyof typeof StakingRewardFormat];

export type TokenTransferType = typeof TokenTransferType[keyof typeof TokenTransferType];

// ============================================================
// UCM Payment Types - Production Definitions
// ============================================================

/**
 * Payment status enum
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

/**
 * Payment method type
 */
export const PaymentMethod = {
  CRYPTO: 'crypto',
  CARD: 'card',
  BANK: 'bank',
  X402: 'x402',
} as const;

export type PaymentMethodType = typeof PaymentMethod[keyof typeof PaymentMethod];

/**
 * A payment transaction record
 */
export interface Payment {
  /** Unique payment identifier */
  id: string;
  /** Payment amount in smallest unit (wei, cents, etc.) */
  amount: string;
  /** Currency code (USD, ETH, USDC, etc.) */
  currency: string;
  /** Current payment status */
  status: PaymentStatusType;
  /** Payment method used */
  method: PaymentMethodType;
  /** Payer address or identifier */
  from: string;
  /** Recipient address or identifier */
  to: string;
  /** Associated transaction hash (if on-chain) */
  txHash?: string;
  /** Network ID for crypto payments */
  network?: string;
  /** Timestamp of creation */
  createdAt: number;
  /** Timestamp of last update */
  updatedAt: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Payment intent - a declared intention to make a payment
 */
export interface PaymentIntent {
  /** Unique intent identifier */
  id: string;
  /** Requested payment amount */
  amount: string;
  /** Currency for the payment */
  currency: string;
  /** Recipient address or identifier */
  recipient: string;
  /** Intent status */
  status: 'created' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  /** Preferred payment methods */
  allowedMethods: PaymentMethodType[];
  /** Associated network for crypto */
  network?: string;
  /** Expiration timestamp */
  expiresAt?: number;
  /** Client secret for frontend confirmation */
  clientSecret?: string;
  /** Resulting payment ID when completed */
  paymentId?: string;
  /** Timestamp of creation */
  createdAt: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for payment processing
 */
export interface PaymentConfig {
  /** Supported networks */
  networks: string[];
  /** Supported currencies per network */
  currencies: Record<string, string[]>;
  /** Fee configuration */
  fees: {
    /** Platform fee percentage (e.g., 0.01 = 1%) */
    platformFeePercent: number;
    /** Minimum fee in USD */
    minFeeUsd: number;
    /** Maximum fee in USD */
    maxFeeUsd: number;
  };
  /** Payment limits */
  limits: {
    /** Minimum payment in USD */
    minPaymentUsd: number;
    /** Maximum single payment in USD */
    maxPaymentUsd: number;
    /** Daily limit per user in USD */
    dailyLimitUsd: number;
  };
  /** x402 specific configuration */
  x402?: {
    /** Facilitator URL */
    facilitatorUrl: string;
    /** Supported payment kinds */
    paymentKinds: string[];
  };
}
