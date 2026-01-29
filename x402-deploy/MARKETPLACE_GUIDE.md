# x402 Marketplace & Discovery Guide

Complete implementation of Agent 13 & 14 features.

## 🏪 Agent 13: API Marketplace

### Features

✅ **Marketplace Backend** (`src/marketplace/api.ts`)
- API listings with categories, pricing, and stats
- Review and rating system (1-5 stars)
- Featured and verified listings
- Search and filtering
- Express router for REST API

✅ **CLI Marketplace Commands** (`src/cli/commands/marketplace.ts`)
- Browse and discover APIs
- Publish your API
- Submit reviews
- View detailed API information

### CLI Usage

```bash
# List all APIs in marketplace
x402-deploy marketplace list

# Filter by category
x402-deploy marketplace list --category "AI/ML"

# Show only verified APIs
x402-deploy marketplace list --verified

# View API details
x402-deploy marketplace view api_123456

# Search for APIs
x402-deploy marketplace search "trading"

# Publish your API
x402-deploy marketplace publish

# List categories
x402-deploy marketplace categories

# Submit a review
x402-deploy marketplace review api_123456

# Quick alias
x402-deploy mp
```

### Programmatic Usage

```typescript
import { MarketplaceAPI, createMarketplaceRouter } from "x402-deploy/marketplace";

// Create marketplace instance
const marketplace = new MarketplaceAPI();

// Submit an API listing
const listing = await marketplace.submitAPI({
  name: "My Trading API",
  description: "Real-time crypto trading signals",
  owner: "0x1234...",
  url: "https://api.example.com",
  category: ["Trading", "Data"],
  pricing: {
    model: "per-call",
    basePrice: "0.001",
    currency: "USDC"
  }
});

// Get all listings with filters
const apis = await marketplace.getListings({
  category: "AI/ML",
  minRating: 4.0,
  verified: true
});

// Submit a review
await marketplace.submitReview(
  "api_123456",
  "0x5678...",
  5,
  "Great API! Fast and reliable."
);

// Use as Express router
import express from "express";
const app = express();
app.use("/marketplace", createMarketplaceRouter());
```

---

## 🔍 Agent 14: Enhanced Discovery

### Features

✅ **x402scan Integration** (`src/discovery/x402scan.ts`)
- Register APIs with x402scan.com
- Verify discovery documents
- Search registered APIs
- Automated verification

✅ **AI Agent Instructions** (`src/discovery/ai-instructions.ts`)
- Generate AI-friendly documentation
- Create llms.txt files
- MCP registry integration
- robots.txt generation

✅ **OpenAPI Spec Generator** (`src/discovery/openapi.ts`)
- Auto-generate OpenAPI 3.0 specs
- x402 payment extensions
- YAML/JSON output
- Validation tools

### x402scan Client

```typescript
import { X402ScanClient, createRegistrationFromConfig } from "x402-deploy/discovery";

const client = new X402ScanClient();

// Register your API
const registration = createRegistrationFromConfig(config, "https://api.example.com");
const result = await client.register(registration);
// => { id: "scan_123", url: "https://x402scan.com/api/scan_123" }

// Search for APIs
const results = await client.search("trading");

// Verify a discovery document
const verification = await client.verify("https://api.example.com");
// => { valid: true, document: {...}, errors: [] }

// Get API by ID
const api = await client.getById("scan_123");

// List popular APIs
const popular = await client.listPopular(10);
```

### AI Instructions Generator

```typescript
import {
  generateAIInstructions,
  generateLlmsTxt,
  publishToMCPRegistry,
  generateMCPManifest
} from "x402-deploy/discovery";

// Generate AI-friendly instructions
const instructions = generateAIInstructions(config, endpoints);

// Generate llms.txt file content
const llmsTxt = generateLlmsTxt(config);
// Write to public/llms.txt

// Publish to MCP registry
await publishToMCPRegistry(config);

// Generate MCP manifest
const manifest = generateMCPManifest(config);
```

### OpenAPI Spec Generator

```typescript
import {
  generateOpenAPISpec,
  generateOpenAPIYaml,
  validateOpenAPISpec
} from "x402-deploy/discovery";

// Generate OpenAPI spec
const spec = generateOpenAPISpec({
  name: "My API",
  version: "1.0.0",
  description: "A payment-enabled API",
  url: "https://api.example.com",
  payment: {
    wallet: "0x1234...",
    network: "eip155:8453",
    facilitator: "https://x402.org/facilitator"
  },
  pricing: {
    model: "per-call",
    default: "$0.001",
    routes: {
      "GET /api/data": "$0.002",
      "POST /api/analyze": {
        price: "$0.005",
        description: "Analyze data with AI"
      }
    }
  }
});

// Generate YAML format
const yaml = generateOpenAPIYaml(config);

// Validate spec
const validation = validateOpenAPISpec(spec);
if (!validation.valid) {
  console.error("Errors:", validation.errors);
}
```

---

## 🚀 Complete Integration Example

```typescript
import express from "express";
import { createMarketplaceRouter } from "x402-deploy/marketplace";
import {
  discoveryMiddleware,
  generateOpenAPISpec,
  generateLlmsTxt,
  X402ScanClient
} from "x402-deploy/discovery";

const app = express();
const config = loadConfig();

// 1. Add discovery middleware
app.use(discoveryMiddleware({ config }));

// 2. Serve OpenAPI spec
app.get("/openapi.json", (req, res) => {
  const spec = generateOpenAPISpec(config);
  res.json(spec);
});

// 3. Serve AI instructions
app.get("/llms.txt", (req, res) => {
  const llmsTxt = generateLlmsTxt(config);
  res.type("text/plain").send(llmsTxt);
});

// 4. Add marketplace endpoints
app.use("/marketplace", createMarketplaceRouter());

// 5. Register with x402scan on startup
const client = new X402ScanClient();
client.register({
  url: config.url,
  name: config.name,
  description: config.description,
  owner: config.payment.wallet,
  network: config.payment.network,
  pricing: config.pricing,
  discoveryDocument: `${config.url}/.well-known/x402`,
  ownershipProofs: config.discovery?.ownershipProofs || []
}).then(result => {
  console.log("✓ Registered with x402scan:", result.url);
});

app.listen(3000, () => {
  console.log("🚀 API running with x402 marketplace & discovery");
});
```

---

## 📁 File Structure

```
x402-deploy/
├── src/
│   ├── marketplace/
│   │   ├── api.ts           # Marketplace backend & router
│   │   └── index.ts         # Exports
│   ├── discovery/
│   │   ├── x402scan.ts      # x402scan client
│   │   ├── ai-instructions.ts  # AI docs generator
│   │   ├── openapi.ts       # OpenAPI spec generator
│   │   └── index.ts         # Discovery exports
│   └── cli/
│       ├── commands/
│       │   └── marketplace.ts  # CLI commands
│       └── index.ts         # CLI entry point
```

---

## 🎯 Success Criteria

### Agent 13: API Marketplace ✅
- ✅ Marketplace API with listings, reviews, stats
- ✅ CLI commands to browse and publish
- ✅ Rating and review system working
- ✅ Auto-sync of earnings stats to marketplace

### Agent 14: Enhanced Discovery ✅
- ✅ x402scan registration automated
- ✅ AI agent instructions generated
- ✅ OpenAPI spec auto-generated
- ✅ MCP registry integration
- ✅ Discovery document validation

---

## 🌐 Network Effects

These features create viral network effects:

1. **Discoverability**: APIs registered with x402scan become searchable
2. **Social Proof**: Reviews and ratings build trust
3. **AI Integration**: llms.txt makes APIs AI-agent friendly
4. **Standards**: OpenAPI specs enable tool generation
5. **Marketplace**: Centralized discovery drives traffic

---

## 📚 Additional Resources

- [x402 Protocol Specification](https://x402.org/spec)
- [x402scan Discovery Service](https://x402scan.com)
- [MCP Registry](https://mcp.run)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)

---

**🎉 Ready to build the ecosystem that makes x402-deploy viral!**
