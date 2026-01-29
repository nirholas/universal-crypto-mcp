/**
 * x402scan Integration
 *
 * Client for registering and managing APIs on x402scan.com,
 * the discovery service for x402-enabled APIs.
 */

export interface X402ScanRegistration {
  url: string;
  name: string;
  description: string;
  owner: `0x${string}`;
  network: string;
  pricing: {
    model: string;
    basePrice: string;
    currency: string;
  };
  discoveryDocument: string;
  ownershipProofs: string[];
}

export interface X402ScanSearchResult {
  id: string;
  url: string;
  name: string;
  description: string;
  owner: `0x${string}`;
  network: string;
  verified: boolean;
  lastVerified: Date;
}

export interface X402ScanVerifyResult {
  valid: boolean;
  document: Record<string, unknown> | null;
  errors: string[];
}

/**
 * x402scan client for API discovery registration
 */
export class X402ScanClient {
  private apiUrl: string;

  constructor(apiUrl = "https://x402scan.com/api/v1") {
    this.apiUrl = apiUrl;
  }

  /**
   * Register a new API with x402scan
   */
  async register(
    registration: X402ScanRegistration
  ): Promise<{ id: string; url: string }> {
    const response = await fetch(`${this.apiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registration),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * Update an existing registration
   */
  async update(
    id: string,
    updates: Partial<X402ScanRegistration>
  ): Promise<void> {
    const response = await fetch(`${this.apiUrl}/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Update failed: ${await response.text()}`);
    }
  }

  /**
   * Unregister an API
   */
  async unregister(id: string, signature: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/unregister/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${signature}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unregister failed: ${await response.text()}`);
    }
  }

  /**
   * Verify that a URL has a valid x402 discovery document
   */
  async verify(url: string): Promise<X402ScanVerifyResult> {
    try {
      const discoveryUrl = new URL("/.well-known/x402", url).toString();
      const response = await fetch(discoveryUrl);

      if (!response.ok) {
        return {
          valid: false,
          document: null,
          errors: [`Discovery document not found (${response.status})`],
        };
      }

      const document = await response.json();
      const errors: string[] = [];

      // Basic validation
      if (!document.version) {
        errors.push("Missing version field");
      }
      if (!document.paymentWallet) {
        errors.push("Missing paymentWallet field");
      }
      if (!document.acceptedNetworks?.length) {
        errors.push("Missing or empty acceptedNetworks");
      }
      if (!document.resources?.length) {
        errors.push("Missing or empty resources");
      }

      return {
        valid: errors.length === 0,
        document,
        errors,
      };
    } catch (error) {
      return {
        valid: false,
        document: null,
        errors: [`Failed to fetch discovery document: ${error}`],
      };
    }
  }

  /**
   * Search for x402 APIs
   */
  async search(query: string): Promise<X402ScanSearchResult[]> {
    const response = await fetch(
      `${this.apiUrl}/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * Get API details by ID
   */
  async getById(id: string): Promise<X402ScanSearchResult | null> {
    const response = await fetch(`${this.apiUrl}/api/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Fetch failed: ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * Get API details by URL
   */
  async getByUrl(url: string): Promise<X402ScanSearchResult | null> {
    const response = await fetch(
      `${this.apiUrl}/lookup?url=${encodeURIComponent(url)}`
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Lookup failed: ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * List recently registered APIs
   */
  async listRecent(limit = 20): Promise<X402ScanSearchResult[]> {
    const response = await fetch(`${this.apiUrl}/recent?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`List failed: ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * List popular APIs by usage
   */
  async listPopular(limit = 20): Promise<X402ScanSearchResult[]> {
    const response = await fetch(`${this.apiUrl}/popular?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`List failed: ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * Get verification status for an API
   */
  async getVerificationStatus(
    id: string
  ): Promise<{ verified: boolean; lastCheck: Date; errors: string[] }> {
    const response = await fetch(`${this.apiUrl}/verification/${id}`);

    if (!response.ok) {
      throw new Error(`Status check failed: ${await response.text()}`);
    }

    return response.json();
  }

  /**
   * Request re-verification of an API
   */
  async requestVerification(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/verify/${id}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Verification request failed: ${await response.text()}`);
    }
  }
}

/**
 * Create a registration from x402 config
 */
export function createRegistrationFromConfig(
  config: {
    name: string;
    description?: string;
    payment: {
      wallet: `0x${string}`;
      network: string;
    };
    pricing?: {
      model?: string;
      default?: string;
    };
    discovery?: {
      ownershipProofs?: string[];
    };
  },
  url: string
): X402ScanRegistration {
  return {
    url,
    name: config.name,
    description: config.description || "",
    owner: config.payment.wallet,
    network: config.payment.network,
    pricing: {
      model: config.pricing?.model || "per-call",
      basePrice: config.pricing?.default || "0.001",
      currency: "USDC",
    },
    discoveryDocument: `${url}/.well-known/x402`,
    ownershipProofs: config.discovery?.ownershipProofs || [],
  };
}

export default X402ScanClient;
