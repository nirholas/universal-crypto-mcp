# Agent 3: Discovery & x402scan Integration

## Role
You are the **Discovery Agent** responsible for building automatic registration with x402scan.com and generating discovery documents.

## Repository Context
```
Repository: nirholas/universal-crypto-mcp
Working Directory: /workspaces/universal-crypto-mcp/x402-deploy
Your Files: src/discovery/**/*
```

## Your Mission
Make every deployed API **automatically discoverable** on x402scan.com with verified ownership.

---

## Task 1: Discovery Document Generator

**File: `src/discovery/document.ts`**

```typescript
import type { X402Config } from "../types/config.js";

export interface DiscoveryDocument {
  version: 1;
  resources: string[];
  ownershipProofs?: string[];
  instructions?: string;
}

/**
 * Generate x402 discovery document
 * This is served at /.well-known/x402
 */
export function generateDiscoveryDocument(
  origin: string,
  config: X402Config
): DiscoveryDocument {
  // Build list of all monetized endpoints
  const resources = buildResourceList(origin, config);
  
  return {
    version: 1,
    resources,
    ownershipProofs: config.discovery?.ownershipProofs || [],
    instructions: buildInstructions(config),
  };
}

/**
 * Build list of all x402-enabled endpoints
 */
function buildResourceList(origin: string, config: X402Config): string[] {
  const routes = config.pricing?.routes || {};
  const resources: string[] = [];
  
  for (const route of Object.keys(routes)) {
    // Convert route pattern to full URL
    // "GET /api/users" -> "https://example.com/api/users"
    const [method, path] = route.split(" ");
    
    // Skip wildcards for now, add concrete paths
    if (!path.includes("*")) {
      resources.push(`${origin}${path}`);
    }
  }
  
  // Always include the main MCP endpoint if it's an MCP server
  if (config.project?.type === "mcp-server") {
    resources.push(`${origin}/mcp`);
  }
  
  // Add API endpoints
  if (config.project?.type === "express" || config.project?.type === "fastapi") {
    // Include common API paths
    resources.push(`${origin}/api`);
  }
  
  return [...new Set(resources)]; // Deduplicate
}

/**
 * Build human-readable instructions
 */
function buildInstructions(config: X402Config): string {
  const lines = [
    `# ${config.name}`,
    "",
    config.discovery?.instructions || "API monetized with x402 protocol.",
    "",
    "## Pricing",
    "",
  ];
  
  const routes = config.pricing?.routes || {};
  for (const [route, pricing] of Object.entries(routes)) {
    const price = typeof pricing === "string" ? pricing : pricing.price;
    lines.push(`- \`${route}\`: ${price}`);
  }
  
  lines.push("");
  lines.push("## Payment");
  lines.push("");
  lines.push(`- Network: ${config.payment?.network}`);
  lines.push(`- Token: ${config.payment?.token || "USDC"}`);
  lines.push(`- Wallet: ${config.payment?.wallet}`);
  
  return lines.join("\n");
}

/**
 * Validate a discovery document
 */
export function validateDiscoveryDocument(
  doc: unknown
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!doc || typeof doc !== "object") {
    return { valid: false, errors: ["Document must be an object"] };
  }
  
  const d = doc as Record<string, unknown>;
  
  if (d.version !== 1) {
    errors.push("version must be 1");
  }
  
  if (!Array.isArray(d.resources)) {
    errors.push("resources must be an array");
  } else {
    for (const resource of d.resources) {
      if (typeof resource !== "string") {
        errors.push("All resources must be strings");
        break;
      }
      try {
        new URL(resource);
      } catch {
        errors.push(`Invalid URL: ${resource}`);
      }
    }
  }
  
  if (d.ownershipProofs !== undefined && !Array.isArray(d.ownershipProofs)) {
    errors.push("ownershipProofs must be an array if provided");
  }
  
  if (d.instructions !== undefined && typeof d.instructions !== "string") {
    errors.push("instructions must be a string if provided");
  }
  
  return { valid: errors.length === 0, errors };
}
```

---

## Task 2: Ownership Proof Generator

**File: `src/discovery/ownership.ts`**

```typescript
import { privateKeyToAccount, signMessage } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export interface OwnershipProof {
  signature: string;
  address: string;
  origin: string;
  timestamp: number;
}

/**
 * Generate an ownership proof for a domain
 * Signs the origin URL with the wallet's private key
 */
export async function generateOwnershipProof(
  origin: string,
  privateKey: `0x${string}`
): Promise<OwnershipProof> {
  // Create account from private key
  const account = privateKeyToAccount(privateKey);
  
  // Sign the origin URL
  const signature = await account.signMessage({
    message: origin,
  });
  
  return {
    signature,
    address: account.address,
    origin,
    timestamp: Date.now(),
  };
}

/**
 * Generate ownership proof using browser wallet (for CLI interactive mode)
 */
export async function generateOwnershipProofInteractive(
  origin: string,
  walletAddress: string
): Promise<string> {
  // This would be called in a browser context or with a connected wallet
  // For CLI, we'll prompt the user to sign manually
  
  console.log(`
To prove ownership, sign this message with your wallet:

Message: ${origin}
Wallet:  ${walletAddress}

You can sign using:
1. Etherscan: https://etherscan.io/verifiedSignatures
2. MyEtherWallet: https://www.myetherwallet.com/wallet/sign
3. Your wallet's sign message feature

Enter the signature:
  `);
  
  // In actual implementation, this would read from stdin
  return "";
}

/**
 * Verify an ownership proof
 */
export async function verifyOwnershipProof(
  signature: string,
  origin: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const { recoverMessageAddress } = await import("viem");
    
    const recoveredAddress = await recoverMessageAddress({
      message: origin,
      signature: signature as `0x${string}`,
    });
    
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("Failed to verify ownership proof:", error);
    return false;
  }
}

/**
 * Generate multiple ownership proofs for different wallets
 */
export async function generateMultipleProofs(
  origin: string,
  privateKeys: `0x${string}`[]
): Promise<string[]> {
  const proofs: string[] = [];
  
  for (const privateKey of privateKeys) {
    const proof = await generateOwnershipProof(origin, privateKey);
    proofs.push(proof.signature);
  }
  
  return proofs;
}
```

---

## Task 3: x402scan Registration

**File: `src/discovery/register.ts`**

```typescript
export interface RegisterOptions {
  url: string;
  resources: string[];
  ownershipProof?: string;
  instructions?: string;
}

export interface RegistrationResult {
  success: boolean;
  registeredResources: number;
  verificationStatus: "verified" | "pending" | "failed";
  x402scanUrl?: string;
  error?: string;
}

const X402SCAN_API = "https://x402scan.com/api";

/**
 * Register resources with x402scan
 */
export async function registerWithX402Scan(
  options: RegisterOptions
): Promise<RegistrationResult> {
  const { url, resources, ownershipProof, instructions } = options;
  
  try {
    // First, verify the discovery document is accessible
    const discoveryUrl = `${url}/.well-known/x402`;
    const discoveryCheck = await fetch(discoveryUrl);
    
    if (!discoveryCheck.ok) {
      return {
        success: false,
        registeredResources: 0,
        verificationStatus: "failed",
        error: `Discovery document not accessible at ${discoveryUrl}`,
      };
    }
    
    // Submit to x402scan
    const response = await fetch(`${X402SCAN_API}/origins/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: url,
        discoveryUrl,
        ownershipProof,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        registeredResources: 0,
        verificationStatus: "failed",
        error: error.message || "Registration failed",
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      registeredResources: result.resourceCount || resources.length,
      verificationStatus: result.verified ? "verified" : "pending",
      x402scanUrl: `https://x402scan.com/origin/${encodeURIComponent(url)}`,
    };
  } catch (error) {
    return {
      success: false,
      registeredResources: 0,
      verificationStatus: "failed",
      error: `Network error: ${error}`,
    };
  }
}

/**
 * Check registration status
 */
export async function checkRegistrationStatus(
  origin: string
): Promise<{
  registered: boolean;
  verified: boolean;
  resourceCount: number;
  lastChecked?: string;
}> {
  try {
    const response = await fetch(
      `${X402SCAN_API}/origins/${encodeURIComponent(origin)}/status`
    );
    
    if (!response.ok) {
      return {
        registered: false,
        verified: false,
        resourceCount: 0,
      };
    }
    
    return await response.json();
  } catch {
    return {
      registered: false,
      verified: false,
      resourceCount: 0,
    };
  }
}

/**
 * Update registration (add new resources, update instructions)
 */
export async function updateRegistration(
  origin: string,
  updates: {
    resources?: string[];
    instructions?: string;
    ownershipProof?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${X402SCAN_API}/origins/${encodeURIComponent(origin)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: `Network error: ${error}` };
  }
}

/**
 * Remove registration
 */
export async function removeRegistration(
  origin: string,
  ownershipProof: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${X402SCAN_API}/origins/${encodeURIComponent(origin)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-ownership-proof": ownershipProof,
        },
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: `Network error: ${error}` };
  }
}
```

---

## Task 4: DNS TXT Record Helper

**File: `src/discovery/dns.ts`**

```typescript
import { resolve } from "dns/promises";

/**
 * Check for x402 DNS TXT record
 */
export async function checkDnsTxtRecord(
  domain: string
): Promise<{ found: boolean; url?: string }> {
  try {
    const records = await resolve(`_x402.${domain}`, "TXT");
    
    for (const record of records) {
      const txt = Array.isArray(record) ? record.join("") : record;
      if (txt.startsWith("https://")) {
        return { found: true, url: txt };
      }
    }
    
    return { found: false };
  } catch {
    return { found: false };
  }
}

/**
 * Generate DNS TXT record instructions
 */
export function generateDnsInstructions(
  domain: string,
  discoveryUrl: string
): string {
  return `
To add DNS-based discovery, add this TXT record to your DNS:

Record Type: TXT
Name:        _x402.${domain}
Value:       ${discoveryUrl}
TTL:         3600 (1 hour)

Example for common DNS providers:

Cloudflare:
  Type: TXT
  Name: _x402
  Content: ${discoveryUrl}

Namecheap:
  Type: TXT
  Host: _x402
  Value: ${discoveryUrl}

GoDaddy:
  Type: TXT
  Name: _x402
  Value: ${discoveryUrl}

After adding the record, it may take up to 24 hours to propagate.
You can verify with: dig _x402.${domain} TXT
  `.trim();
}

/**
 * Verify both well-known and DNS discovery methods
 */
export async function verifyDiscoveryMethods(
  origin: string
): Promise<{
  wellKnown: { available: boolean; document?: any };
  dns: { available: boolean; url?: string };
}> {
  const domain = new URL(origin).hostname;
  
  // Check well-known
  let wellKnownResult: { available: boolean; document?: any } = {
    available: false,
  };
  
  try {
    const response = await fetch(`${origin}/.well-known/x402`);
    if (response.ok) {
      wellKnownResult = {
        available: true,
        document: await response.json(),
      };
    }
  } catch {
    // Well-known not available
  }
  
  // Check DNS
  const dnsResult = await checkDnsTxtRecord(domain);
  
  return {
    wellKnown: wellKnownResult,
    dns: {
      available: dnsResult.found,
      url: dnsResult.url,
    },
  };
}
```

---

## Task 5: Validation & Testing

**File: `src/discovery/validate.ts`**

```typescript
import { validateDiscoveryDocument } from "./document.js";
import { verifyOwnershipProof } from "./ownership.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  resources: {
    url: string;
    accessible: boolean;
    returns402: boolean;
    price?: string;
  }[];
}

/**
 * Fully validate a deployed x402 API
 */
export async function validateDeployment(
  origin: string
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const resources: ValidationResult["resources"] = [];
  
  // Step 1: Check discovery document
  let discoveryDoc: any;
  try {
    const response = await fetch(`${origin}/.well-known/x402`);
    if (!response.ok) {
      errors.push(`Discovery document returned ${response.status}`);
    } else {
      discoveryDoc = await response.json();
      const validation = validateDiscoveryDocument(discoveryDoc);
      errors.push(...validation.errors);
    }
  } catch (error) {
    errors.push(`Failed to fetch discovery document: ${error}`);
  }
  
  // Step 2: Verify ownership proofs
  if (discoveryDoc?.ownershipProofs?.length) {
    for (const proof of discoveryDoc.ownershipProofs) {
      // Get payTo address from a resource
      const testResource = discoveryDoc.resources[0];
      if (testResource) {
        try {
          const resourceResponse = await fetch(testResource);
          if (resourceResponse.status === 402) {
            const body = await resourceResponse.json();
            const payTo = body.accepts?.payTo;
            if (payTo) {
              const verified = await verifyOwnershipProof(proof, origin, payTo);
              if (!verified) {
                warnings.push(`Ownership proof not verified for ${payTo}`);
              }
            }
          }
        } catch {
          warnings.push(`Could not verify ownership for ${testResource}`);
        }
      }
    }
  } else {
    warnings.push("No ownership proofs provided - origin will be unverified");
  }
  
  // Step 3: Test each resource
  if (discoveryDoc?.resources) {
    for (const resourceUrl of discoveryDoc.resources) {
      const resourceResult = await testResource(resourceUrl);
      resources.push(resourceResult);
      
      if (!resourceResult.accessible) {
        errors.push(`Resource not accessible: ${resourceUrl}`);
      } else if (!resourceResult.returns402) {
        warnings.push(`Resource doesn't return 402: ${resourceUrl}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    resources,
  };
}

/**
 * Test a single resource endpoint
 */
async function testResource(url: string): Promise<{
  url: string;
  accessible: boolean;
  returns402: boolean;
  price?: string;
}> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    
    if (response.status === 402) {
      const body = await response.json();
      return {
        url,
        accessible: true,
        returns402: true,
        price: body.accepts?.maxAmountRequired,
      };
    }
    
    return {
      url,
      accessible: true,
      returns402: false,
    };
  } catch {
    return {
      url,
      accessible: false,
      returns402: false,
    };
  }
}

/**
 * Quick health check for deployment
 */
export async function healthCheck(origin: string): Promise<{
  healthy: boolean;
  checks: Record<string, boolean>;
}> {
  const checks: Record<string, boolean> = {};
  
  // Check health endpoint
  try {
    const healthResponse = await fetch(`${origin}/health`);
    checks.health = healthResponse.ok;
  } catch {
    checks.health = false;
  }
  
  // Check discovery
  try {
    const discoveryResponse = await fetch(`${origin}/.well-known/x402`);
    checks.discovery = discoveryResponse.ok;
  } catch {
    checks.discovery = false;
  }
  
  // Check 402 response
  try {
    const apiResponse = await fetch(`${origin}/mcp`);
    checks.paymentRequired = apiResponse.status === 402;
  } catch {
    checks.paymentRequired = false;
  }
  
  return {
    healthy: Object.values(checks).every(Boolean),
    checks,
  };
}
```

---

## Task 6: Discovery Middleware

**File: `src/discovery/middleware.ts`**

```typescript
import type { Request, Response, NextFunction } from "express";
import type { X402Config } from "../types/config.js";
import { generateDiscoveryDocument } from "./document.js";

/**
 * Express middleware to serve discovery document
 */
export function discoveryMiddleware(config: X402Config) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/.well-known/x402") {
      const origin = `${req.protocol}://${req.get("host")}`;
      const document = generateDiscoveryDocument(origin, config);
      
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=3600");
      
      return res.json(document);
    }
    
    next();
  };
}

/**
 * Generate static discovery document file
 */
export function generateDiscoveryFile(
  origin: string,
  config: X402Config
): string {
  const document = generateDiscoveryDocument(origin, config);
  return JSON.stringify(document, null, 2);
}
```

---

## Deliverables Checklist

- [ ] `document.ts` - Discovery document generator
- [ ] `ownership.ts` - Ownership proof generation/verification
- [ ] `register.ts` - x402scan registration
- [ ] `dns.ts` - DNS TXT record helpers
- [ ] `validate.ts` - Deployment validation
- [ ] `middleware.ts` - Express middleware
- [ ] `index.ts` - Export all functions

## Dependencies
```json
{
  "dependencies": {
    "viem": "^2.0.0"
  }
}
```
