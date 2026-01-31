/**
 * account-abstraction Implementation
 *
 * Adapted from: alchemy-aa
 * See vendor/account-abstraction/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export export async function resetBalance<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends SmartContractAccount = SmartContractAccount,
>(
  client: SmartAccountClient<transport, chain, account>,
  testClient: Client & { mode: "anvil" },
) {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: resetBalance');
}

// From vendor code
export function defineInstance(params: DefineInstanceParams) {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: defineInstance');
}

// From vendor code
export export async function isRundlerInstalled(rundlerPath: string) {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: isRundlerInstalled');
}

// From vendor code
export export async function cleanupRundler(rundlerPath: string) {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: cleanupRundler');
}

// From vendor code
export export async function downloadLatestRundlerRelease(
  filePath: string,
  version = "v0.8.2",
) {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: downloadLatestRundlerRelease');
}

// From vendor code
export export function toArgs(
  obj: {
    [key: string]:
      | Record<string, any>
      | string
      | readonly string[]
      | boolean
      | number
      | bigint
      | undefined;
  },
  options: { casing: "kebab" | "snake" } = { casing: "kebab" },
) {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: toArgs');
}

// From vendor code
export export function toFlagCase(str: string, separator = "-") {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: toFlagCase');
}

// From vendor code
export export async function toSmartContractAccount<
  Name extends string = string,
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TEntryPointVersion extends EntryPointVersion = EntryPointVersion,
>({
  transport,
  chain,
  entryPoint,
  source,
  accountAddress,
  getAccountInitCode,
  getNonce,
  signMessage,
  signTypedData,
  encodeBatchExecute,
  encodeExecute,
  getDummySignature,
  signUserOperationHash,
  encodeUpgradeToAndCall,
}: ToSmartContractAccountParams<
  Name,
  TTransport,
  TChain,
  TEntryPointVersion
>): Promise<SmartContractAccount<Name, TEntryPointVersion>>;

/**
 * Converts an account to a smart contract account and sets up various account-related methods using the provided parameters like transport, chain, entry point, and other utilities.
 *
 * @example
 * ```ts
 * import {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: toSmartContractAccount');
}

// From vendor code
export function hasAddBreadcrumb<A extends {}>(
  a: A,
): a is A & {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: hasAddBreadcrumb');
}

// From vendor code
export export function clientHeaderTrack<X extends {}>(client: X, crumb: string): X {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: clientHeaderTrack');
}

// From vendor code
export export function createBundlerClient<TTransport extends Transport>(
  args: PublicClientConfig<TTransport, Chain> & { type?: string },
): BundlerClient<TTransport>;

/**
 * Creates a Bundler Client using the provided configuration parameters, including chain and optional type.
 *
 * @example
 * ```ts
 * import {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: createBundlerClient');
}

// From vendor code
export export function isSmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined,
>(
  client: Client<TTransport, TChain, TAccount>,
): client is SmartAccountClient<TTransport, TChain, TAccount> {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: isSmartAccountClient');
}

// From vendor code
export export function isBaseSmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined =
    | SmartContractAccount
    | undefined,
>(
  client: Client<TTransport, TChain, TAccount>,
): client is BaseSmartAccountClient<TTransport, TChain, TAccount> {
  // TODO: Implement - see vendor/account-abstraction/
  throw new Error('Not implemented: isBaseSmartAccountClient');
}

// UCM expected export
export function createSmartAccount(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/account-abstraction/ patterns
  throw new Error('Not implemented: createSmartAccount');
}

// UCM expected export
export function bundleUserOps(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/account-abstraction/ patterns
  throw new Error('Not implemented: bundleUserOps');
}

// UCM expected export
export function paymaster(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/account-abstraction/ patterns
  throw new Error('Not implemented: paymaster');
}

// ============================================================
// Classes
// ============================================================

// From vendor code
export export class SoftWebauthnDevice {
  constructor() {
    // TODO: Implement - see vendor/account-abstraction/
    throw new Error('Not implemented: SoftWebauthnDevice');
  }
}
