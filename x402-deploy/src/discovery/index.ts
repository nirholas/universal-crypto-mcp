/**
 * x402 Discovery Module
 *
 * This module provides utilities for x402 service discovery:
 * - Discovery document generation (/.well-known/x402)
 * - Ownership proof generation and verification
 * - x402scan registration
 * - DNS TXT record helpers
 * - Validation utilities
 *
 * @example
 * ```typescript
 * import {
 *   generateDiscoveryDocument,
 *   registerWithX402Scan,
 *   generateDnsTxtRecord,
 *   discoveryMiddleware,
 * } from "x402-deploy/discovery";
 *
 * // Generate discovery document
 * const doc = generateDiscoveryDocument(config, "https://api.example.com");
 *
 * // Register with x402scan
 * const result = await registerWithX402Scan(config, "https://api.example.com");
 *
 * // Get DNS setup instructions
 * const dnsInstructions = generateDnsTxtRecord("example.com", "https://example.com/.well-known/x402");
 *
 * // Use Express middleware
 * app.use(discoveryMiddleware({ config }));
 * ```
 */

// Document generation
export {
  generateDiscoveryDocument,
  serializeDiscoveryDocument,
  parseDiscoveryDocument,
  createMinimalDocument,
  type DiscoveryDocument,
  type DiscoveryMetadata,
  type GenerateDocumentOptions,
} from "./document.js";

// Ownership proofs
export {
  generateOwnershipProof,
  verifyOwnershipProof,
  verifyOwnershipSignature,
  recoverOwnershipAddress,
  generateMultipleProofs,
  serializeProof,
  parseProof,
  getProofSignature,
  type OwnershipProof,
  type GenerateProofOptions,
} from "./ownership.js";

// x402scan registration
export {
  registerWithX402Scan,
  updateRegistration,
  unregisterFromX402Scan,
  checkRegistration,
  fetchRegisteredDocument,
  type RegistrationResult,
  type RegistrationOptions,
} from "./register.js";

// Validation
export {
  validateDiscoveryDocument,
  testResourceEndpoint,
  testAllResources,
  generateValidationReport,
  type ValidationResult,
  type ResourceTestResult,
  type PaymentRequirements,
  type AcceptedPayment,
} from "./validate.js";

// DNS helpers
export {
  generateDnsRecord,
  generateDnsTxtRecord,
  getDnsProviderInstructions,
  verifyDnsRecord,
  verifyDnsRecordGoogle,
  verifyDnsRecordMultiProvider,
  getVerificationCommand,
  extractDomainFromUrl,
  type DnsRecord,
  type DnsVerificationResult,
  type DnsProviderInstructions,
} from "./dns.js";

// Middleware
export {
  discoveryMiddleware,
  createDiscoveryHandler,
  honoDiscoveryMiddleware,
  type DiscoveryMiddlewareOptions,
} from "./middleware.js";

// x402scan integration
export {
  X402ScanClient,
  createRegistrationFromConfig,
  type X402ScanRegistration,
  type X402ScanSearchResult,
  type X402ScanVerifyResult,
} from "./x402scan.js";

// AI Instructions
export {
  generateAIInstructions,
  generateEndpointDocs,
  generateLlmsTxt,
  generateRobotsTxt,
  publishToMCPRegistry,
  generateMCPManifest,
  type AIInstructions,
  type EndpointDoc,
  type ParameterDoc,
  type X402APIConfig,
} from "./ai-instructions.js";

// OpenAPI Spec Generator
export {
  generateOpenAPISpec,
  generateOpenAPIYaml,
  validateOpenAPISpec,
  mergeOpenAPISpecs,
  type OpenAPIConfig,
  type OpenAPISpec,
  type PathOperation,
  type RoutePrice,
} from "./openapi.js";
