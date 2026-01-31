/**
 * wallet Types
 *
 * Auto-extracted from vendor/wallet/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

interface Register {
    config: typeof config;
  }

interface Button {
  font?: Font;
  color?: Color;
  background?: Color;
  border?: Color;
  borderRadius?: BorderRadius;
  hover?: this;
}

interface Text {
  color?: Color;
  font?: Font;
  hover?: this;
}

export interface AppContextProps {
  authEnabled: boolean;
}

export interface SafeApiKitConfig {
  /** chainId - The chainId */
  chainId: bigint
  /** txServiceUrl - Safe Transaction Service URL */
  txServiceUrl?: string
  /**
   * apiKey - The API key to access the Safe Transaction Service.
   * - Required if txServiceUrl is undefined
   * - Required if txServiceUrl contains "safe.global" or "5afe.dev"
   * - Optional otherwise
   */
  apiKey?: string
}

export interface HttpRequest {
  url: string
  method: HttpMethod
  body?: any
}

interface NetworkShortName {
  shortName: string
  chainId: bigint
}

interface DuplicateCheckResult {
  hasDuplicates: boolean
  duplicates: Map<string, bigint[]>
}

export interface GetContractInstanceProps {
  safeProvider: SafeProvider
  safeVersion: SafeVersion
  customContracts?: ContractNetworkConfig
  deploymentType?: DeploymentType
}

export interface GetSafeContractInstanceProps extends GetContractInstanceProps {
  isL1SafeSingleton?: boolean
  customSafeAddress?: string
}

export interface PredictSafeAddressProps {
  safeProvider: SafeProvider
  chainId: bigint // required for performance
  safeAccountConfig: SafeAccountConfig
  safeDeploymentConfig?: SafeDeploymentConfig
  isL1SafeSingleton?: boolean
  customContracts?: ContractNetworkConfig
}

export interface encodeSetupCallDataProps {
  safeProvider: SafeProvider
  safeAccountConfig: SafeAccountConfig
  safeContract: SafeContractImplementationType
  customContracts?: ContractNetworkConfig
  customSafeVersion?: SafeVersion
  deploymentType?: DeploymentType
}

// ============================================================
// Types from vendor code
// ============================================================

type DefaultConfigProps = {
  appName: string;

type DefaultConnectorsProps = {
  app: {
    name: string;

type GetDefaultTransportsProps = {
  chains?: CreateConfigParameters['chains'];

export type useConnectCallbackProps = {
  onConnect?: ({
    address,
    connectorId,
  }: {
    address?: string;

type ModalRoutes = (typeof routes)[keyof typeof routes];

type ValidRoutes = ModalRoutes;

type UseModalProps = {} & useConnectCallbackProps;

type HookProps = {
  isSignedIn: boolean;

type UseSIWEConfig = {
  onSignIn?: (data?: SIWESession) => void;

type RGB = `rgb(${number}, ${number}, ${number})`;

type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;

type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;

type BorderRadius = number | string;

type Font = {
  family?: string;

export type Theme = {
  font?: Font;

export type ThemeMode = {
  preferred: 'light' | 'dark';

export type CustomTheme = {
  connectKit: {
    options?: {
      iconStyle?: 'light' | 'regular' | 'heavy';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export type RainbowConnectorOptions = Parameters<typeof rainbowWallet>[0] & {
  appName: string;

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface WalletConfig {
  // TODO: Define based on vendor/wallet/ patterns
}

export interface WalletState {
  // TODO: Define based on vendor/wallet/ patterns
}

export interface WalletConnector {
  // TODO: Define based on vendor/wallet/ patterns
}

export interface ChainConfig {
  // TODO: Define based on vendor/wallet/ patterns
}
