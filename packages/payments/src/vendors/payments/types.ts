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
// UCM Expected Types (stub)
// ============================================================

export interface Payment {
  // TODO: Define based on vendor/payments/ patterns
}

export interface PaymentIntent {
  // TODO: Define based on vendor/payments/ patterns
}

export interface PaymentConfig {
  // TODO: Define based on vendor/payments/ patterns
}
