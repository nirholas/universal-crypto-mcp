/**
 * ai-agents Types
 *
 * Auto-extracted from vendor/ai-agents/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

interface UseExecutionEventsOptions {
  graphId?: GraphID | string | null;
  graphIds?: (GraphID | string)[];
  enabled?: boolean;
  onExecutionUpdate?: ExecutionEventHandler;
}

interface UsePendingReviewsForExecutionOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export interface CliArgs {
  name?: string;
  protocolFamily?: ProtocolFamily | null;
  networks?: string[];
  walletProvider?: WalletProvider | undefined;
  interactive: boolean;
}

export interface ProviderConfig {
  name: string;
  protocolFamily: ProtocolFamily | null;
  networkIds: NetworkId[];
  walletProvider?: WalletProvider;
  providerKey: "default" | "walletProvider";
}

export interface CreateActionDecoratorParams {
  /**
   * The name of the action
   */
  name: string;

  /**
   * The description of the action
   */
  description: string;

  /**
   * The schema of the action
   */
  schema: z.ZodSchema;
}

export interface ActionMetadata {
  /**
   * The name of the action
   */
  name: string;

  /**
   * The description of the action
   */
  description: string;

  /**
   * The schema of the action
   */
  schema: z.ZodSchema;

  /**
   * The function to invoke the action
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoke: (...args: any[]) => any;

  /**
   * The wallet provider to use for the action
   */
  walletProvider: boolean;
}

export interface Action<TActionSchema extends z.ZodSchema = z.ZodSchema> {
  name: string;
  description: string;
  schema: TActionSchema;
  invoke: (args: z.infer<TActionSchema>) => Promise<string>;
}

interface CustomActionProviderOptions<TWalletProvider extends WalletProvider> {
  name: string;
  description: string;
  schema: z.ZodSchema;
  invoke:
    | ((args: any) => Promise<any>)
    | ((walletProvider: TWalletProvider, args: any) => Promise<any>);
}

export interface Network {
  /**
   * The protocol family of the network.
   */
  protocolFamily: string;

  /**
   * The network ID of the network.
   */
  networkId?: string;

  /**
   * The chain ID of the network.
   */
  chainId?: string;
}

interface ConfigureCdpEvmWalletProviderWithWalletOptions {
  /**
   * The CDP client of the wallet.
   */
  cdp: CdpClient;

  /**
   * The server account of the wallet.
   */
  serverAccount: EvmServerAccount;

  /**
   * The public client of the wallet.
   */
  publicClient: PublicClient;

  /**
   * The network of the wallet.
   */
  network: Network;
}

export interface CdpProviderConfig {
  /**
   * The CDP API Key ID.
   */
  apiKeyId?: string;

  /**
   * The CDP API Key Secret.
   */
  apiKeySecret?: string;

  /**
   * The CDP Wallet Secret.
   */
  walletSecret?: string;
}

export interface CdpWalletProviderConfig extends CdpProviderConfig {
  /**
   * The address of the wallet.
   */
  address?: Address;

  /**
   * The network of the wallet.
   */
  networkId?: string;

  /**
   * The idempotency key of the wallet. Only used when creating a new account.
   */
  idempotencyKey?: string;

  /**
   * Optional RPC URL for Viem public client HTTP transport.
   * Falls back to process.env.RPC_URL when not provided.
   */
  rpcUrl?: string;
}

export interface CdpSmartWalletProviderConfig extends CdpWalletProviderConfig {
  /**
   * The owner account of the smart wallet.
   */
  owner?: EvmServerAccount | LocalAccount | Address;

  /**
   * The name of the smart wallet.
   */
  smartAccountName?: string;

  /**
   * The paymaster URL for gasless transactions.
   */
  paymasterUrl?: string;
}

export interface WalletProviderWithClient {
  /**
   * Gets the CDP client.
   */
  getClient(): CdpClient;
}

interface ConfigureCdpSmartWalletProviderWithWalletOptions {
  /**
   * The CDP client of the wallet.
   */
  cdp: CdpClient;

  /**
   * The smart account of the wallet.
   */
  smartAccount: EvmSmartAccount;

  /**
   * The owner account of the smart wallet.
   */
  ownerAccount: EvmServerAccount | LocalAccount;

  /**
   * The public client of the wallet.
   */
  publicClient: PublicClient;

  /**
   * The network of the wallet.
   */
  network: Network;

  /**
   * The paymaster URL for gasless transactions.
   */
  paymasterUrl?: string;
}

interface ConfigureCdpSolanaWalletProviderWithWalletOptions {
  /**
   * The CDP client of the wallet.
   */
  cdp: CdpClient;

  /**
   * The server account of the wallet.
   */
  serverAccount: Awaited<ReturnType<typeof CdpClient.prototype.solana.createAccount>>;

  /**
   * The public client of the wallet.
   */
  connection: Connection;

  /**
   * The network of the wallet.
   */
  network: Network;
}

export interface ConfigureLegacyCdpSmartWalletOptions {
  cdpApiKeyId?: string;
  cdpApiKeySecret?: string;
  networkId?: string;
  smartWalletAddress?: Hex;
  paymasterUrl?: string;
  signer: Signer;
  rpcUrl?: string;
}

interface LegacyCdpSmartWalletProviderConfig {
  smartWallet: NetworkScopedSmartWallet;
  network: Required<Network>;
  chainId: string;
  rpcUrl?: string;
}

export interface LegacyCdpProviderConfig {
  /**
   * The CDP API Key Name.
   */
  apiKeyId?: string;

  /**
   * The CDP API Key Private Key.
   */
  apiKeySecret?: string;
}

export interface LegacyCdpWalletProviderConfig extends LegacyCdpProviderConfig {
  /**
   * The CDP Wallet.
   */
  wallet?: Wallet;

  /**
   * The address of the wallet.
   */
  address?: string;

  /**
   * The network of the wallet.
   */
  network?: Network;

  /**
   * The network ID of the wallet.
   */
  networkId?: string;

  /**
   * Configuration for gas multipliers.
   */
  gas?: {
    /**
     * An internal multiplier on gas limit estimation.
     */
    gasLimitMultiplier?: number;

    /**
     * An internal multiplier on fee per gas estimation.
     */
    feePerGasMultiplier?: number;
  }

// ============================================================
// Types from vendor code
// ============================================================

export type ClientOptions = Omit<CoreClientOptions, 'apiKey' | 'authToken'> & {
  awsSecretKey?: string | null | undefined;

type MessagesResource = Omit<Resources.Messages, 'batches' | 'countTokens'>;

type BetaResource = Omit<Resources.Beta, 'promptCaching' | 'messages'> & {
  messages: Omit<Resources.Beta['messages'], 'batches' | 'countTokens'>;

type AuthProps = {
  url: string;

export type CredentialsData =
  | {
      provider: string;

type ExecutionEventHandler = (execution: GraphExecution) => void;

export type CronFrequency =
  | "every minute"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export type CronExpressionParams =
  | { frequency: "every minute" }
  | {
      frequency: "hourly";

type ParsedKey = { key: string;

export type ProtocolFamily = (typeof PROTOCOL_FAMILIES)[number]["value"];

export type WalletProvider =
  (typeof WALLET_PROVIDERS_BY_PROTOCOL)[keyof typeof WALLET_PROVIDERS_BY_PROTOCOL][number]["value"];

export type NetworkId =
  (typeof NETWORKS_BY_PROTOCOL)[keyof typeof NETWORKS_BY_PROTOCOL][number]["value"];

export type PromptResult = {
  name: string;

export type PromptValues = {
  [K in keyof PromptResult]: K extends "networkIds"
    ? NetworkId[]
    : K extends "overwrite"
      ? boolean
      : string;

export type StoredActionMetadata = Map<string, ActionMetadata>;

export type AgentKitOptions = {
  cdpApiKeyId?: string;

type RequiredEventData = {
  /**
   * The event that took place, e.g. initialize_wallet_provider, agent_action_invocation
   */
  action: string;

export type SOLANA_NETWORK_ID =
  | typeof SOLANA_MAINNET_NETWORK_ID
  | typeof SOLANA_TESTNET_NETWORK_ID
  | typeof SOLANA_DEVNET_NETWORK_ID;

export type SOLANA_CLUSTER =
  | typeof SOLANA_MAINNET_GENESIS_BLOCK_HASH
  | typeof SOLANA_TESTNET_GENESIS_BLOCK_HASH
  | typeof SOLANA_DEVNET_GENESIS_BLOCK_HASH;

type CdpEvmNetwork =
  | "base"
  | "base-sepolia"
  | "ethereum"
  | "ethereum-sepolia"
  | "polygon"
  | "arbitrum"
  | "optimism";

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface AgentConfig {
  // TODO: Define based on vendor/ai-agents/ patterns
}

export interface AgentContext {
  // TODO: Define based on vendor/ai-agents/ patterns
}

export interface ToolResult {
  // TODO: Define based on vendor/ai-agents/ patterns
}

export interface MemoryStore {
  // TODO: Define based on vendor/ai-agents/ patterns
}
