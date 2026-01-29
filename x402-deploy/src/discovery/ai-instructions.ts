/**
 * AI Agent Instructions Generator
 *
 * Generates AI-friendly documentation that helps AI agents
 * understand how to interact with x402-enabled APIs.
 */

export interface AIInstructions {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  endpoints: EndpointDoc[];
}

export interface EndpointDoc {
  method: string;
  path: string;
  description: string;
  parameters?: ParameterDoc[];
  response: string;
  price: string;
}

export interface ParameterDoc {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface X402APIConfig {
  name: string;
  description?: string;
  url?: string;
  version?: string;
  payment?: {
    wallet?: string;
    network?: string;
    facilitator?: string;
  };
  pricing?: {
    model?: string;
    default?: string;
    routes?: Record<string, string | { price: string; description?: string }>;
  };
  discovery?: {
    instructions?: string;
  };
}

/**
 * Generate AI-friendly instructions from config and endpoints
 */
export function generateAIInstructions(
  config: X402APIConfig,
  endpoints: EndpointDoc[]
): AIInstructions {
  const baseUrl = config.url || "https://api.example.com";
  const facilitatorUrl =
    config.payment?.facilitator || "https://x402.org/facilitator";

  return {
    name: config.name,
    description: config.discovery?.instructions || config.description || "",
    usage: `
To use this API, include an x-payment header with your payment proof.
You can get payment proofs from ${facilitatorUrl}.

Example:
\`\`\`bash
curl -H "x-payment: <payment-proof>" ${baseUrl}/api/endpoint
\`\`\`

Payment Protocol: x402 (HTTP 402 Payment Required)
Network: ${config.payment?.network || "eip155:8453"} (Base)
Currency: USDC

Steps:
1. Make a request to the endpoint
2. If you receive a 402 response, read the WWW-Authenticate header
3. Submit payment to the facilitator with the payment requirements
4. Include the payment proof in the x-payment header
5. Retry the request with the payment proof
    `.trim(),
    examples: endpoints.slice(0, 3).map((ep) =>
      `
# ${ep.description}
curl -X ${ep.method} \\
  -H "x-payment: <payment-proof>" \\
  ${baseUrl}${ep.path}
      `.trim()
    ),
    endpoints,
  };
}

/**
 * Generate endpoint documentation from route pricing config
 */
export function generateEndpointDocs(
  routes: Record<string, string | { price: string; description?: string }>
): EndpointDoc[] {
  const endpoints: EndpointDoc[] = [];

  for (const [route, pricing] of Object.entries(routes)) {
    const parts = route.split(" ");
    const method = parts.length > 1 ? parts[0] : "GET";
    const path = parts.length > 1 ? parts[1] : parts[0];
    const priceInfo =
      typeof pricing === "string" ? { price: pricing } : pricing;

    endpoints.push({
      method,
      path,
      description: priceInfo.description || `${method} ${path}`,
      response: "JSON response",
      price: priceInfo.price,
    });
  }

  return endpoints;
}

/**
 * Generate a complete llms.txt file content
 */
export function generateLlmsTxt(config: X402APIConfig): string {
  const endpoints = generateEndpointDocs(config.pricing?.routes || {});
  const instructions = generateAIInstructions(config, endpoints);

  let content = `# ${instructions.name}

${instructions.description}

## Payment Information

This API uses the x402 protocol for micropayments.
- Network: ${config.payment?.network || "eip155:8453"}
- Currency: USDC
- Payment Wallet: ${config.payment?.wallet || "Not configured"}

## Usage

${instructions.usage}

`;

  if (endpoints.length > 0) {
    content += `## Endpoints

`;
    for (const endpoint of endpoints) {
      content += `### ${endpoint.method} ${endpoint.path}

${endpoint.description}
- Price: ${endpoint.price}

`;
    }
  }

  if (instructions.examples.length > 0) {
    content += `## Examples

`;
    for (const example of instructions.examples) {
      content += `${example}

`;
    }
  }

  return content;
}

/**
 * Generate a robots.txt that includes AI crawler hints
 */
export function generateRobotsTxt(config: X402APIConfig): string {
  return `User-agent: *
Allow: /

# x402 Payment-enabled API
# Discovery document: /.well-known/x402
# LLM Instructions: /llms.txt

# AI Crawlers
User-agent: GPTBot
Allow: /llms.txt
Allow: /.well-known/x402

User-agent: ChatGPT-User
Allow: /llms.txt
Allow: /.well-known/x402

User-agent: Claude-Web
Allow: /llms.txt
Allow: /.well-known/x402

User-agent: anthropic-ai
Allow: /llms.txt
Allow: /.well-known/x402

# Sitemap
Sitemap: ${config.url || "https://api.example.com"}/sitemap.xml
`;
}

/**
 * Publish to MCP registry
 */
export async function publishToMCPRegistry(config: X402APIConfig): Promise<void> {
  const endpoints = generateEndpointDocs(config.pricing?.routes || {});
  const instructions = generateAIInstructions(config, endpoints);

  const response = await fetch("https://mcp.run/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: config.name,
      description: instructions.description,
      url: config.url,
      version: config.version || "1.0.0",
      payment: {
        enabled: true,
        method: "x402",
        wallet: config.payment?.wallet,
        network: config.payment?.network,
      },
      capabilities: endpoints.map((ep) => ({
        name: `${ep.method} ${ep.path}`,
        description: ep.description,
        price: ep.price,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`MCP registry publish failed: ${await response.text()}`);
  }
}

/**
 * Generate an MCP tool manifest for the API
 */
export function generateMCPManifest(config: X402APIConfig): Record<string, unknown> {
  const endpoints = generateEndpointDocs(config.pricing?.routes || {});

  return {
    name: config.name,
    description: config.description,
    version: config.version || "1.0.0",
    baseUrl: config.url,
    payment: {
      method: "x402",
      wallet: config.payment?.wallet,
      network: config.payment?.network,
    },
    tools: endpoints.map((ep) => ({
      name: `${ep.method.toLowerCase()}_${ep.path.replace(/\//g, "_").replace(/[^a-zA-Z0-9_]/g, "")}`,
      description: ep.description,
      inputSchema: {
        type: "object",
        properties: ep.parameters?.reduce(
          (acc, p) => ({
            ...acc,
            [p.name]: {
              type: p.type,
              description: p.description,
            },
          }),
          {}
        ) || {},
        required: ep.parameters?.filter((p) => p.required).map((p) => p.name) || [],
      },
      pricing: {
        amount: ep.price,
        currency: "USDC",
      },
    })),
  };
}
