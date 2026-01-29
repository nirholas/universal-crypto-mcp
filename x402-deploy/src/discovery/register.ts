/**
 * x402scan Registration
 *
 * Automatically registers deployed services with x402scan for discovery.
 */

import type { X402Config } from "../types/config.js";
import { generateDiscoveryDocument, type DiscoveryDocument } from "./document.js";
import { validateDiscoveryDocument } from "./validate.js";

/**
 * x402scan API base URL
 */
const X402SCAN_API_URL = "https://x402scan.com/api";

/**
 * Registration result
 */
export interface RegistrationResult {
  /** Whether registration succeeded */
  success: boolean;
  /** Number of resources registered */
  registeredResources: number;
  /** Whether ownership was verified */
  verified: boolean;
  /** URL to view on x402scan */
  x402scanUrl: string;
  /** Registration ID for future updates */
  registrationId?: string;
  /** Error message if failed */
  error?: string;
}

/**
 * Registration options
 */
export interface RegistrationOptions {
  /** Skip validation before registration */
  skipValidation?: boolean;
  /** Force re-registration even if already registered */
  force?: boolean;
  /** Custom x402scan API URL (for testing) */
  apiUrl?: string;
  /** API key for authenticated registration */
  apiKey?: string;
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Register a service with x402scan
 *
 * @param config - The x402 deployment configuration
 * @param deployUrl - The deployed service URL
 * @param options - Registration options
 * @returns Registration result
 *
 * @example
 * ```typescript
 * const result = await registerWithX402Scan(config, "https://api.example.com");
 * if (result.success) {
 *   console.log(`Registered! View at ${result.x402scanUrl}`);
 * }
 * ```
 */
export async function registerWithX402Scan(
  config: X402Config,
  deployUrl: string,
  options: RegistrationOptions = {}
): Promise<RegistrationResult> {
  const apiUrl = options.apiUrl ?? X402SCAN_API_URL;
  const timeout = options.timeout ?? 30000;

  try {
    // Generate discovery document
    const discoveryDoc = generateDiscoveryDocument(config, deployUrl, {
      includeMetadata: true,
    });

    // Validate unless skipped
    if (!options.skipValidation) {
      const validation = await validateDiscoveryDocument(discoveryDoc);
      if (!validation.valid) {
        return {
          success: false,
          registeredResources: 0,
          verified: false,
          x402scanUrl: "",
          error: `Validation failed: ${validation.errors.join(", ")}`,
        };
      }
    }

    // Build registration request
    const registrationPayload = {
      origin: deployUrl,
      discoveryDocument: discoveryDoc,
      walletAddress: config.payment.wallet,
      network: config.payment.network,
      force: options.force ?? false,
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Call x402scan registration API
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options.apiKey && { Authorization: `Bearer ${options.apiKey}` }),
        },
        body: JSON.stringify(registrationPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Registration failed (${response.status}): ${errorBody}`);
      }

      const result = await response.json();

      // Extract hostname for x402scan URL
      const hostname = new URL(deployUrl).hostname;

      return {
        success: true,
        registeredResources: discoveryDoc.resources.length,
        verified: result.verified ?? false,
        x402scanUrl: `https://x402scan.com/origin/${hostname}`,
        registrationId: result.registrationId,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // If x402scan is unreachable, return a graceful failure
    if (errorMessage.includes("fetch") || errorMessage.includes("network")) {
      return {
        success: false,
        registeredResources: 0,
        verified: false,
        x402scanUrl: "",
        error: `x402scan is unreachable. The service is deployed but not registered for discovery. You can register manually at https://x402scan.com/register`,
      };
    }

    return {
      success: false,
      registeredResources: 0,
      verified: false,
      x402scanUrl: "",
      error: errorMessage,
    };
  }
}

/**
 * Update an existing registration
 */
export async function updateRegistration(
  registrationId: string,
  config: X402Config,
  deployUrl: string,
  options: RegistrationOptions = {}
): Promise<RegistrationResult> {
  const apiUrl = options.apiUrl ?? X402SCAN_API_URL;
  const timeout = options.timeout ?? 30000;

  try {
    const discoveryDoc = generateDiscoveryDocument(config, deployUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${apiUrl}/registrations/${registrationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(options.apiKey && { Authorization: `Bearer ${options.apiKey}` }),
        },
        body: JSON.stringify({
          origin: deployUrl,
          discoveryDocument: discoveryDoc,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`);
      }

      const result = await response.json();
      const hostname = new URL(deployUrl).hostname;

      return {
        success: true,
        registeredResources: discoveryDoc.resources.length,
        verified: result.verified ?? false,
        x402scanUrl: `https://x402scan.com/origin/${hostname}`,
        registrationId,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    return {
      success: false,
      registeredResources: 0,
      verified: false,
      x402scanUrl: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Unregister a service from x402scan
 */
export async function unregisterFromX402Scan(
  registrationId: string,
  options: RegistrationOptions = {}
): Promise<{ success: boolean; error?: string }> {
  const apiUrl = options.apiUrl ?? X402SCAN_API_URL;

  try {
    const response = await fetch(`${apiUrl}/registrations/${registrationId}`, {
      method: "DELETE",
      headers: {
        ...(options.apiKey && { Authorization: `Bearer ${options.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Unregistration failed: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check if a service is already registered
 */
export async function checkRegistration(
  deployUrl: string,
  options: RegistrationOptions = {}
): Promise<{
  registered: boolean;
  registrationId?: string;
  lastUpdated?: string;
}> {
  const apiUrl = options.apiUrl ?? X402SCAN_API_URL;

  try {
    const hostname = new URL(deployUrl).hostname;
    const response = await fetch(`${apiUrl}/origins/${hostname}`);

    if (response.status === 404) {
      return { registered: false };
    }

    if (!response.ok) {
      return { registered: false };
    }

    const data = await response.json();

    return {
      registered: true,
      registrationId: data.registrationId,
      lastUpdated: data.lastUpdated,
    };
  } catch {
    return { registered: false };
  }
}

/**
 * Fetch an existing discovery document from x402scan
 */
export async function fetchRegisteredDocument(
  deployUrl: string,
  options: RegistrationOptions = {}
): Promise<DiscoveryDocument | null> {
  const apiUrl = options.apiUrl ?? X402SCAN_API_URL;

  try {
    const hostname = new URL(deployUrl).hostname;
    const response = await fetch(`${apiUrl}/origins/${hostname}/discovery`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}
