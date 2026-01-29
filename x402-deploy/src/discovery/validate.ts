/**
 * Discovery Document Validation
 *
 * Validates discovery documents and tests resource endpoints
 * to ensure proper x402 compliance.
 */

import type { DiscoveryDocument } from "./document.js";

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether the document is valid */
  valid: boolean;
  /** Critical errors that must be fixed */
  errors: string[];
  /** Non-critical warnings */
  warnings: string[];
}

/**
 * Resource test result
 */
export interface ResourceTestResult {
  /** The resource URL tested */
  url: string;
  /** Whether the resource is reachable */
  reachable: boolean;
  /** Whether it returns 402 Payment Required */
  returns402: boolean;
  /** HTTP status code received */
  statusCode?: number;
  /** Payment requirements from 402 response */
  paymentRequirements?: PaymentRequirements;
  /** Response time in milliseconds */
  responseTime?: number;
  /** Error message if unreachable */
  error?: string;
}

/**
 * Payment requirements from 402 response
 */
export interface PaymentRequirements {
  /** Accepted payment methods */
  accepts?: AcceptedPayment[];
  /** Payment description */
  description?: string;
  /** Payment instructions URL */
  instructionsUrl?: string;
}

/**
 * Accepted payment method
 */
export interface AcceptedPayment {
  /** Payment scheme (e.g., "exact") */
  scheme: string;
  /** Network identifier (CAIP-2) */
  network: string;
  /** Maximum amount in base units */
  maxAmountRequired: string;
  /** Payment resource URL */
  resource: string;
  /** Recipient address */
  payTo: string;
  /** Required token */
  requiredDecimals?: number;
  /** Extra data */
  extra?: Record<string, unknown>;
}

/**
 * Validate a discovery document
 *
 * @param doc - The discovery document to validate
 * @returns Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const result = await validateDiscoveryDocument(doc);
 * if (!result.valid) {
 *   console.error("Errors:", result.errors);
 * }
 * ```
 */
export async function validateDiscoveryDocument(
  doc: DiscoveryDocument
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check version
  if (doc.version !== 1) {
    errors.push(`Invalid version: ${doc.version}. Must be 1.`);
  }

  // Check resources array
  if (!doc.resources) {
    errors.push("Missing 'resources' field");
  } else if (!Array.isArray(doc.resources)) {
    errors.push("'resources' must be an array");
  } else if (doc.resources.length === 0) {
    errors.push("No resources defined. At least one payable resource is required.");
  } else {
    // Validate each resource URL
    for (const resource of doc.resources) {
      if (typeof resource !== "string") {
        errors.push(`Invalid resource type: ${typeof resource}. Must be string.`);
        continue;
      }

      try {
        const url = new URL(resource);

        // Check for HTTPS
        if (url.protocol !== "https:" && !resource.includes("localhost")) {
          warnings.push(`Resource should use HTTPS: ${resource}`);
        }
      } catch {
        errors.push(`Invalid resource URL: ${resource}`);
      }
    }

    // Check for duplicate resources
    const uniqueResources = new Set(doc.resources);
    if (uniqueResources.size !== doc.resources.length) {
      warnings.push("Duplicate resources detected");
    }
  }

  // Check ownership proofs format
  if (doc.ownershipProofs) {
    if (!Array.isArray(doc.ownershipProofs)) {
      errors.push("'ownershipProofs' must be an array");
    } else {
      for (let i = 0; i < doc.ownershipProofs.length; i++) {
        const proof = doc.ownershipProofs[i];
        if (typeof proof !== "string") {
          errors.push(`Ownership proof ${i} must be a string`);
          continue;
        }

        // EIP-191 signatures should be 132 characters (0x + 65 bytes hex)
        if (!proof.startsWith("0x")) {
          errors.push(`Ownership proof ${i} must start with 0x`);
        } else if (proof.length !== 132) {
          warnings.push(
            `Ownership proof ${i} has unexpected length: ${proof.length} (expected 132)`
          );
        }
      }
    }
  } else {
    warnings.push(
      "No ownership proofs provided. Consider adding proofs for verification on x402scan."
    );
  }

  // Check instructions
  if (!doc.instructions) {
    warnings.push(
      "No instructions provided. Consider adding human-readable instructions for better discoverability."
    );
  } else if (typeof doc.instructions !== "string") {
    errors.push("'instructions' must be a string");
  } else if (doc.instructions.length > 5000) {
    warnings.push("Instructions are very long. Consider keeping under 5000 characters.");
  }

  // Check metadata if present
  if (doc.metadata) {
    if (typeof doc.metadata !== "object") {
      errors.push("'metadata' must be an object");
    } else {
      if (doc.metadata.termsUrl) {
        try {
          new URL(doc.metadata.termsUrl);
        } catch {
          errors.push(`Invalid termsUrl: ${doc.metadata.termsUrl}`);
        }
      }

      if (doc.metadata.docsUrl) {
        try {
          new URL(doc.metadata.docsUrl);
        } catch {
          errors.push(`Invalid docsUrl: ${doc.metadata.docsUrl}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Test a resource endpoint for x402 compliance
 *
 * @param url - The resource URL to test
 * @param options - Test options
 * @returns Test result
 *
 * @example
 * ```typescript
 * const result = await testResourceEndpoint("https://api.example.com/resource");
 * if (result.returns402) {
 *   console.log("Payment requirements:", result.paymentRequirements);
 * }
 * ```
 */
export async function testResourceEndpoint(
  url: string,
  options: { timeout?: number; method?: string } = {}
): Promise<ResourceTestResult> {
  const { timeout = 10000, method = "GET" } = options;

  const startTime = Date.now();

  try {
    // Skip wildcard URLs
    if (url.includes("*")) {
      return {
        url,
        reachable: false,
        returns402: false,
        error: "Cannot test wildcard URL patterns",
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now() - startTime;

      if (response.status === 402) {
        // Try to parse payment requirements
        let paymentRequirements: PaymentRequirements | undefined;

        try {
          const body = await response.json();
          paymentRequirements = {
            accepts: body.accepts,
            description: body.description,
            instructionsUrl: body.instructionsUrl,
          };
        } catch {
          // Response might not be JSON
        }

        return {
          url,
          reachable: true,
          returns402: true,
          statusCode: 402,
          paymentRequirements,
          responseTime,
        };
      }

      return {
        url,
        reachable: true,
        returns402: false,
        statusCode: response.status,
        responseTime,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      url,
      reachable: false,
      returns402: false,
      responseTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Test all resources in a discovery document
 *
 * @param doc - The discovery document
 * @param options - Test options
 * @returns Array of test results
 */
export async function testAllResources(
  doc: DiscoveryDocument,
  options: { timeout?: number; parallel?: boolean } = {}
): Promise<ResourceTestResult[]> {
  const { parallel = true } = options;

  // Filter out wildcard URLs
  const testableUrls = doc.resources.filter((url) => !url.includes("*"));

  if (parallel) {
    return Promise.all(
      testableUrls.map((url) => testResourceEndpoint(url, options))
    );
  }

  // Sequential testing
  const results: ResourceTestResult[] = [];
  for (const url of testableUrls) {
    const result = await testResourceEndpoint(url, options);
    results.push(result);
  }

  return results;
}

/**
 * Generate a validation report
 */
export function generateValidationReport(
  validation: ValidationResult,
  resourceTests?: ResourceTestResult[]
): string {
  const lines: string[] = [];

  lines.push("# x402 Discovery Document Validation Report");
  lines.push("");

  // Overall status
  lines.push(`## Status: ${validation.valid ? "✅ VALID" : "❌ INVALID"}`);
  lines.push("");

  // Errors
  if (validation.errors.length > 0) {
    lines.push("## Errors");
    for (const error of validation.errors) {
      lines.push(`- ❌ ${error}`);
    }
    lines.push("");
  }

  // Warnings
  if (validation.warnings.length > 0) {
    lines.push("## Warnings");
    for (const warning of validation.warnings) {
      lines.push(`- ⚠️ ${warning}`);
    }
    lines.push("");
  }

  // Resource tests
  if (resourceTests && resourceTests.length > 0) {
    lines.push("## Resource Tests");
    lines.push("");

    for (const test of resourceTests) {
      const status = test.reachable
        ? test.returns402
          ? "✅ Returns 402"
          : `⚠️ Returns ${test.statusCode}`
        : "❌ Unreachable";

      lines.push(`### ${test.url}`);
      lines.push(`- Status: ${status}`);
      if (test.responseTime) {
        lines.push(`- Response Time: ${test.responseTime}ms`);
      }
      if (test.error) {
        lines.push(`- Error: ${test.error}`);
      }
      if (test.paymentRequirements?.accepts) {
        lines.push(`- Accepts: ${test.paymentRequirements.accepts.length} payment method(s)`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}
