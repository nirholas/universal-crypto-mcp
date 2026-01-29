/**
 * Type declarations for @x402 packages
 * These are stubs for TypeScript compilation - actual implementation comes from npm packages
 */

declare module '@x402/core/server' {
  export class HTTPFacilitatorClient {
    constructor(config: { url: string });
  }

  export class x402ResourceServer {
    constructor(facilitator: HTTPFacilitatorClient);
    register(network: string, scheme: unknown): void;
    getPaymentDetails(resource: string): Promise<unknown>;
  }
}

declare module '@x402/core/types' {
  export interface Network {
    id: string;
    name: string;
  }

  export interface PaymentDetails {
    amount: string;
    asset: string;
    network: string;
  }
}

declare module '@x402/evm/exact/server' {
  export class ExactEvmScheme {
    constructor();
  }
}

declare module '@x402/svm/exact/server' {
  export class ExactSvmScheme {
    constructor();
  }
}
