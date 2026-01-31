/**
 * payments Implementation
 *
 * Adapted from: coinbase-sdk, stripe-sdk
 * See vendor/payments/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export async function listSolanaStakingRewards(wallet: string) {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: listSolanaStakingRewards');
}

// From vendor code
export async function stakeOperations(signer: KeyPairSigner) {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: stakeOperations');
}

// From vendor code
export function getTxLink(networkID: string, signature: string): string {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: getTxLink');
}

// From vendor code
export export function coinbaseApiKeyPath(): string {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: coinbaseApiKeyPath');
}

// From vendor code
export export async function getKeypair(path?: string): Promise<KeyPairSigner> {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: getKeypair');
}

// From vendor code
export function replaceHome(filePath: string): string {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: replaceHome');
}

// From vendor code
export export async function sendUserOperation<T extends readonly unknown[]>(
  wallet: SmartWallet,
  options: SendUserOperationOptions<T>,
): Promise<SendUserOperationReturnType> {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: sendUserOperation');
}

// From vendor code
export export async function waitForUserOperation(
  options: WaitForUserOperationOptions,
): Promise<WaitForUserOperationReturnType> {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: waitForUserOperation');
}

// From vendor code
export function setFlattenedQueryParams(urlSearchParams: URLSearchParams, parameter: any, key: string = ""): void {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: setFlattenedQueryParams');
}

// From vendor code
export async function refreshMeterEventSession() {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: refreshMeterEventSession');
}

// From vendor code
export async function sendMeterEvent(meterEvent: any) {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: sendMeterEvent');
}

// From vendor code
export async function handler(request) {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: handler');
}

// From vendor code
export async function bootstrap() {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: bootstrap');
}

// From vendor code
export function requestCallback(
        err: any,
        response: HttpClientResponseInterface
      ): void {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: requestCallback');
}

// From vendor code
export export function stripeMethod(
  spec: MethodSpec
): (...args: any[]) => Promise<any> {
  // TODO: Implement - see vendor/payments/
  throw new Error('Not implemented: stripeMethod');
}

// UCM expected export
export function createPayment(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/payments/ patterns
  throw new Error('Not implemented: createPayment');
}

// UCM expected export
export function verifyPayment(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/payments/ patterns
  throw new Error('Not implemented: verifyPayment');
}

// UCM expected export
export function webhook(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/payments/ patterns
  throw new Error('Not implemented: webhook');
}

// UCM expected export
export function refund(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/payments/ patterns
  throw new Error('Not implemented: refund');
}

// ============================================================
// Classes
// ============================================================

// From vendor code
export export class AddressesApi extends BaseAPI implements AddressesApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: AddressesApi');
  }
}

// From vendor code
export export class AssetsApi extends BaseAPI implements AssetsApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: AssetsApi');
  }
}

// From vendor code
export export class BalanceHistoryApi extends BaseAPI implements BalanceHistoryApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: BalanceHistoryApi');
  }
}

// From vendor code
export export class ContractEventsApi extends BaseAPI implements ContractEventsApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: ContractEventsApi');
  }
}

// From vendor code
export export class ContractInvocationsApi extends BaseAPI implements ContractInvocationsApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: ContractInvocationsApi');
  }
}

// From vendor code
export export class ExternalAddressesApi extends BaseAPI implements ExternalAddressesApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: ExternalAddressesApi');
  }
}

// From vendor code
export export class FundApi extends BaseAPI implements FundApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: FundApi');
  }
}

// From vendor code
export export class MPCWalletStakeApi extends BaseAPI implements MPCWalletStakeApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: MPCWalletStakeApi');
  }
}

// From vendor code
export export class NetworksApi extends BaseAPI implements NetworksApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: NetworksApi');
  }
}

// From vendor code
export export class OnchainIdentityApi extends BaseAPI implements OnchainIdentityApiInterface {
  constructor() {
    // TODO: Implement - see vendor/payments/
    throw new Error('Not implemented: OnchainIdentityApi');
  }
}
