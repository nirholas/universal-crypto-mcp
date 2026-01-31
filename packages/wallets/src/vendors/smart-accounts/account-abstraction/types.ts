/**
 * account-abstraction Types
 *
 * Auto-extracted from vendor/account-abstraction/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

export interface AccountEntryPointRegistry<Name extends string = string>
  extends EntryPointRegistryBase<
    SmartContractAccount<Name, EntryPointVersion>
  > {
  "0.6.0": SmartContractAccount<Name, "0.6.0">;
  "0.7.0": SmartContractAccount<Name, "0.7.0">;
}

// ============================================================
// Types from vendor code
// ============================================================

type DefineInstanceParams = {
  chain: Chain;

type ToPaymasterArgs = {
  entryPointVersion: "0.6.0" | "0.7.0";

export type Paymaster = {
  entryPointVersion: "0.6.0" | "0.7.0";

export type RundlerParameters = {
  /**
   * The path to the rundler binary
   *
   * @default rundler
   */
  binary?: string;

export type AccountOp = {
  target: Address;

export type SignatureRequest =
  | {
      type: "personal_sign";

export type SigningMethods = {
  prepareSign: (request: SignatureRequest) => Promise<SignatureRequest>;

export type GetEntryPointFromAccount<
  TAccount extends SmartContractAccount | undefined,
  TAccountOverride extends SmartContractAccount = SmartContractAccount,
> =
  GetAccountParameter<TAccount, TAccountOverride> extends SmartContractAccount<
    string,
    infer TEntryPointVersion
  >
    ? TEntryPointVersion
    : EntryPointVersion;

export type GetAccountParameter<
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined,
  TAccountOverride extends SmartContractAccount = SmartContractAccount,
> =
  IsUndefined<TAccount> extends true
    ? { account: TAccountOverride }
    : { account?: TAccountOverride };

export type UpgradeToAndCallParams = {
  upgradeToAddress: Address;

export type SmartContractAccountWithSigner<
  Name extends string = string,
  TSigner extends SmartAccountSigner = SmartAccountSigner,
  TEntryPointVersion extends EntryPointVersion = EntryPointVersion,
> = SmartContractAccount<Name, TEntryPointVersion> & {
  getSigner: () => TSigner;

export type SmartContractAccount<
  Name extends string = string,
  TEntryPointVersion extends EntryPointVersion = EntryPointVersion,
> = LocalAccount<Name> & {
  source: Name;

export type ToSmartContractAccountParams<
  Name extends string = string,
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TEntryPointVersion extends EntryPointVersion = EntryPointVersion,
> = {
  source: Name;

export type GetAccountAddressParams = {
  client: PublicClient;

export type BundlerClient<T extends Transport = Transport> = Client<
  T,
  Chain,
  undefined,
  [...PublicRpcSchema, ...BundlerRpcSchema],
  PublicActions<T, Chain> & BundlerActions
>;

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface SmartAccount {
  // TODO: Define based on vendor/account-abstraction/ patterns
}

export interface UserOperation {
  // TODO: Define based on vendor/account-abstraction/ patterns
}

export interface Bundler {
  // TODO: Define based on vendor/account-abstraction/ patterns
}
