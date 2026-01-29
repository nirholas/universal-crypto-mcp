/**
 * DNS TXT Record Helpers
 *
 * Utilities for generating and verifying DNS TXT records
 * for x402 discovery.
 */

/**
 * DNS record information
 */
export interface DnsRecord {
  /** Record name (e.g., "_x402.example.com") */
  name: string;
  /** Record type */
  type: "TXT";
  /** Record value */
  value: string;
}

/**
 * DNS verification result
 */
export interface DnsVerificationResult {
  /** Whether the record was found */
  found: boolean;
  /** The record value if found */
  value?: string;
  /** Whether the value matches expected */
  matches?: boolean;
  /** Error message if verification failed */
  error?: string;
}

/**
 * DNS provider instructions
 */
export interface DnsProviderInstructions {
  /** Provider name */
  provider: string;
  /** Name field value */
  name: string;
  /** Value/Content field value */
  value: string;
  /** Additional notes */
  notes?: string;
}

/**
 * Generate the DNS TXT record for x402 discovery
 *
 * @param domain - The domain name (e.g., "example.com")
 * @param discoveryUrl - The discovery document URL
 * @returns DNS record information
 *
 * @example
 * ```typescript
 * const record = generateDnsRecord("example.com", "https://example.com/.well-known/x402");
 * // { name: "_x402.example.com", type: "TXT", value: "https://example.com/.well-known/x402" }
 * ```
 */
export function generateDnsRecord(
  domain: string,
  discoveryUrl: string
): DnsRecord {
  return {
    name: `_x402.${domain}`,
    type: "TXT",
    value: discoveryUrl,
  };
}

/**
 * Generate human-readable DNS TXT record instructions
 *
 * @param domain - The domain name
 * @param discoveryUrl - The discovery document URL
 * @returns Formatted instructions string
 */
export function generateDnsTxtRecord(
  domain: string,
  discoveryUrl: string
): string {
  const record = generateDnsRecord(domain, discoveryUrl);

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                         x402 DNS TXT Record Setup                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

Add this TXT record to your DNS configuration to enable x402 discovery:

  Name:   ${record.name}
  Type:   ${record.type}
  Value:  ${record.value}

────────────────────────────────────────────────────────────────────────────────
PROVIDER-SPECIFIC INSTRUCTIONS
────────────────────────────────────────────────────────────────────────────────

Cloudflare:
  Name:     _x402
  Type:     TXT
  Content:  ${record.value}

AWS Route53:
  Name:     ${record.name}
  Type:     TXT
  Value:    "${record.value}"

Google Cloud DNS:
  Name:     _x402
  Type:     TXT
  Data:     "${record.value}"

GoDaddy:
  Host:     _x402
  TXT Value: ${record.value}

Namecheap:
  Host:     _x402
  Type:     TXT
  Value:    ${record.value}

DigitalOcean:
  Hostname: _x402
  Value:    ${record.value}
  TTL:      3600

Vercel:
  Name:     _x402
  Type:     TXT
  Value:    ${record.value}

────────────────────────────────────────────────────────────────────────────────
VERIFICATION
────────────────────────────────────────────────────────────────────────────────

After adding the record, verify with:

  dig TXT ${record.name}

Or use our verification:

  npx x402-deploy verify-dns ${domain}

Note: DNS changes may take up to 48 hours to propagate globally.
`.trim();
}

/**
 * Get provider-specific DNS instructions
 */
export function getDnsProviderInstructions(
  domain: string,
  discoveryUrl: string
): DnsProviderInstructions[] {
  const record = generateDnsRecord(domain, discoveryUrl);

  return [
    {
      provider: "Cloudflare",
      name: "_x402",
      value: record.value,
      notes: "Proxied status doesn't affect TXT records",
    },
    {
      provider: "AWS Route53",
      name: record.name,
      value: `"${record.value}"`,
      notes: "Value must be wrapped in double quotes",
    },
    {
      provider: "Google Cloud DNS",
      name: "_x402",
      value: `"${record.value}"`,
      notes: "Value must be wrapped in double quotes",
    },
    {
      provider: "GoDaddy",
      name: "_x402",
      value: record.value,
    },
    {
      provider: "Namecheap",
      name: "_x402",
      value: record.value,
    },
    {
      provider: "DigitalOcean",
      name: "_x402",
      value: record.value,
    },
    {
      provider: "Vercel",
      name: "_x402",
      value: record.value,
    },
  ];
}

/**
 * Verify DNS TXT record using DNS-over-HTTPS
 *
 * @param domain - The domain to check
 * @param expectedValue - Optional expected value to match
 * @returns Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyDnsRecord("example.com");
 * if (result.found) {
 *   console.log("Found:", result.value);
 * }
 * ```
 */
export async function verifyDnsRecord(
  domain: string,
  expectedValue?: string
): Promise<DnsVerificationResult> {
  const recordName = `_x402.${domain}`;

  try {
    // Use Cloudflare's DNS-over-HTTPS
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${recordName}&type=TXT`,
      {
        headers: {
          Accept: "application/dns-json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`DNS query failed: ${response.statusText}`);
    }

    const data = await response.json() as {
      Status: number;
      Answer?: Array<{ data: string }>;
    };

    // Check for NXDOMAIN or no answers
    if (data.Status === 3 || !data.Answer || data.Answer.length === 0) {
      return { found: false };
    }

    // Extract the TXT record value
    // DNS-JSON returns values with quotes, so we strip them
    const value = data.Answer[0].data.replace(/^"|"$/g, "");

    const result: DnsVerificationResult = {
      found: true,
      value,
    };

    // Check if it matches expected value
    if (expectedValue) {
      result.matches = value === expectedValue;
    }

    return result;
  } catch (error) {
    return {
      found: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Verify DNS using Google's DNS-over-HTTPS as fallback
 */
export async function verifyDnsRecordGoogle(
  domain: string
): Promise<DnsVerificationResult> {
  const recordName = `_x402.${domain}`;

  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${recordName}&type=TXT`,
      {
        headers: {
          Accept: "application/dns-json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`DNS query failed: ${response.statusText}`);
    }

    const data = await response.json() as {
      Status: number;
      Answer?: Array<{ data: string }>;
    };

    if (data.Status !== 0 || !data.Answer || data.Answer.length === 0) {
      return { found: false };
    }

    const value = data.Answer[0].data.replace(/^"|"$/g, "");

    return {
      found: true,
      value,
    };
  } catch (error) {
    return {
      found: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Verify DNS using multiple providers for reliability
 */
export async function verifyDnsRecordMultiProvider(
  domain: string
): Promise<DnsVerificationResult> {
  // Try Cloudflare first
  const cloudflareResult = await verifyDnsRecord(domain);
  if (cloudflareResult.found) {
    return cloudflareResult;
  }

  // Fall back to Google
  const googleResult = await verifyDnsRecordGoogle(domain);
  if (googleResult.found) {
    return googleResult;
  }

  // Return the last error
  return googleResult;
}

/**
 * Generate a simple verification command
 */
export function getVerificationCommand(domain: string): string {
  return `dig TXT _x402.${domain} +short`;
}

/**
 * Parse a domain from a URL
 */
export function extractDomainFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    // If it's not a valid URL, assume it's already a domain
    return url;
  }
}
