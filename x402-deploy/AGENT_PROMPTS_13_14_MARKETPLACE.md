# Agent 13 & 14: Marketplace & Discovery

> Build the ecosystem that makes x402-deploy viral

---

## Agent 13: API Marketplace

**Goal:** Create a marketplace where users can discover and use paid APIs

### Task 13.1: Marketplace Backend 🏪

**File:** `src/marketplace/api.ts`

```typescript
import express from 'express';
import { AnalyticsTracker } from '../dashboard/analytics.js';

export interface APIListing {
  id: string;
  name: string;
  description: string;
  owner: `0x${string}`;
  url: string;
  category: string[];
  pricing: {
    model: 'per-call' | 'subscription' | 'credits';
    basePrice: string;
    currency: 'USDC' | 'USDT' | 'DAI';
  };
  stats: {
    totalCalls: number;
    totalRevenue: string;
    rating: number;
    reviews: number;
  };
  verified: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  apiId: string;
  reviewer: `0x${string}`;
  rating: number;
  comment: string;
  timestamp: Date;
}

export class MarketplaceAPI {
  private listings: Map<string, APIListing> = new Map();
  private reviews: Map<string, Review[]> = new Map();

  // Submit new API to marketplace
  async submitAPI(data: {
    name: string;
    description: string;
    owner: `0x${string}`;
    url: string;
    category: string[];
    pricing: APIListing['pricing'];
  }): Promise<APIListing> {
    const listing: APIListing = {
      id: `api_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...data,
      stats: {
        totalCalls: 0,
        totalRevenue: '0',
        rating: 0,
        reviews: 0
      },
      verified: false,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.listings.set(listing.id, listing);
    return listing;
  }

  // Get all listings with filters
  async getListings(filters?: {
    category?: string;
    minRating?: number;
    maxPrice?: string;
    verified?: boolean;
    search?: string;
  }): Promise<APIListing[]> {
    let results = Array.from(this.listings.values());

    if (filters) {
      if (filters.category) {
        results = results.filter(l => l.category.includes(filters.category!));
      }
      if (filters.minRating) {
        results = results.filter(l => l.stats.rating >= filters.minRating!);
      }
      if (filters.verified !== undefined) {
        results = results.filter(l => l.verified === filters.verified);
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        results = results.filter(l =>
          l.name.toLowerCase().includes(term) ||
          l.description.toLowerCase().includes(term)
        );
      }
    }

    // Sort by featured, then rating, then revenue
    return results.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.stats.rating !== b.stats.rating) {
        return b.stats.rating - a.stats.rating;
      }
      return parseFloat(b.stats.totalRevenue) - parseFloat(a.stats.totalRevenue);
    });
  }

  // Submit review
  async submitReview(
    apiId: string,
    reviewer: `0x${string}`,
    rating: number,
    comment: string
  ): Promise<Review> {
    const review: Review = {
      id: `review_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      apiId,
      reviewer,
      rating: Math.max(1, Math.min(5, rating)), // Clamp 1-5
      comment,
      timestamp: new Date()
    };

    const existing = this.reviews.get(apiId) || [];
    existing.push(review);
    this.reviews.set(apiId, existing);

    // Update API stats
    const listing = this.listings.get(apiId);
    if (listing) {
      const allReviews = this.reviews.get(apiId) || [];
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      
      listing.stats.rating = avgRating;
      listing.stats.reviews = allReviews.length;
      listing.updatedAt = new Date();
    }

    return review;
  }

  // Get reviews for an API
  async getReviews(apiId: string): Promise<Review[]> {
    return this.reviews.get(apiId) || [];
  }

  // Update API stats (called by analytics)
  async updateAPIStats(apiId: string, calls: number, revenue: string): Promise<void> {
    const listing = this.listings.get(apiId);
    if (listing) {
      listing.stats.totalCalls += calls;
      listing.stats.totalRevenue = (
        parseFloat(listing.stats.totalRevenue) + parseFloat(revenue)
      ).toFixed(6);
      listing.updatedAt = new Date();
    }
  }
}

// Express routes
export function createMarketplaceRouter(): express.Router {
  const router = express.Router();
  const marketplace = new MarketplaceAPI();

  // GET /marketplace - List all APIs
  router.get('/', async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
        maxPrice: req.query.maxPrice as string,
        verified: req.query.verified === 'true',
        search: req.query.search as string
      };

      const listings = await marketplace.getListings(filters);
      res.json({ listings, total: listings.length });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // POST /marketplace - Submit new API
  router.post('/', async (req, res) => {
    try {
      const listing = await marketplace.submitAPI(req.body);
      res.status(201).json(listing);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  // GET /marketplace/:id - Get specific API
  router.get('/:id', async (req, res) => {
    try {
      const listings = await marketplace.getListings();
      const listing = listings.find(l => l.id === req.params.id);
      
      if (!listing) {
        return res.status(404).json({ error: 'API not found' });
      }

      const reviews = await marketplace.getReviews(listing.id);
      res.json({ ...listing, reviews });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // POST /marketplace/:id/reviews - Submit review
  router.post('/:id/reviews', async (req, res) => {
    try {
      const { reviewer, rating, comment } = req.body;
      const review = await marketplace.submitReview(
        req.params.id,
        reviewer,
        rating,
        comment
      );
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  return router;
}
```

---

### Task 13.2: CLI Marketplace Commands 🛒

**File:** `src/cli/commands/marketplace.ts`

```typescript
import chalk from 'chalk';
import Table from 'cli-table3';
import { prompt } from 'enquirer';
import ora from 'ora';

export async function marketplaceListCommand(options: {
  category?: string;
  verified?: boolean;
  json?: boolean;
}): Promise<void> {
  const spinner = ora('Fetching marketplace listings...').start();

  try {
    const response = await fetch('https://marketplace.x402.org/api/v1/listings?' + new URLSearchParams({
      ...(options.category && { category: options.category }),
      ...(options.verified !== undefined && { verified: String(options.verified) })
    }));

    const { listings } = await response.json();
    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(listings, null, 2));
      return;
    }

    if (listings.length === 0) {
      console.log(chalk.yellow('\nNo APIs found matching your criteria.\n'));
      return;
    }

    console.log(chalk.bold.cyan(`\n🏪 x402 Marketplace (${listings.length} APIs)\n`));

    const table = new Table({
      head: ['Name', 'Category', 'Price', 'Rating', 'Calls', '✓'],
      colWidths: [25, 20, 15, 10, 10, 5],
      style: {
        head: ['cyan'],
        border: ['gray']
      }
    });

    for (const listing of listings.slice(0, 20)) {
      table.push([
        listing.featured ? chalk.yellow('⭐ ') + listing.name : listing.name,
        listing.category.join(', '),
        `$${listing.pricing.basePrice}`,
        '⭐'.repeat(Math.round(listing.stats.rating)),
        listing.stats.totalCalls.toLocaleString(),
        listing.verified ? chalk.green('✓') : ''
      ]);
    }

    console.log(table.toString());
    console.log(chalk.dim(`\nShowing ${Math.min(20, listings.length)} of ${listings.length} results`));
    console.log(chalk.dim('Run "x402-deploy marketplace view <api-id>" for details\n'));
  } catch (error) {
    spinner.fail('Failed to fetch marketplace');
    console.error(chalk.red(String(error)));
  }
}

export async function marketplaceViewCommand(apiId: string): Promise<void> {
  const spinner = ora('Fetching API details...').start();

  try {
    const response = await fetch(`https://marketplace.x402.org/api/v1/listings/${apiId}`);
    const api = await response.json();
    spinner.stop();

    console.log('\n' + chalk.bold.cyan('═'.repeat(60)));
    console.log(chalk.bold(api.featured ? '⭐ ' + api.name : api.name));
    console.log(chalk.dim(api.description));
    console.log(chalk.bold.cyan('═'.repeat(60)) + '\n');

    console.log(chalk.bold('📊 Stats:'));
    console.log(`  Rating:  ${'⭐'.repeat(Math.round(api.stats.rating))} (${api.stats.rating.toFixed(1)}/5) from ${api.stats.reviews} reviews`);
    console.log(`  Calls:   ${api.stats.totalCalls.toLocaleString()}`);
    console.log(`  Revenue: $${api.stats.totalRevenue}`);
    console.log(`  Owner:   ${api.owner.slice(0, 10)}...${api.owner.slice(-8)}`);

    console.log(chalk.bold('\n💰 Pricing:'));
    console.log(`  Model:    ${api.pricing.model}`);
    console.log(`  Price:    $${api.pricing.basePrice} ${api.pricing.currency}`);

    console.log(chalk.bold('\n🔗 Access:'));
    console.log(`  URL:      ${chalk.cyan(api.url)}`);

    if (api.reviews && api.reviews.length > 0) {
      console.log(chalk.bold('\n💬 Recent Reviews:'));
      for (const review of api.reviews.slice(0, 3)) {
        console.log(`  ${'⭐'.repeat(review.rating)} - ${review.comment}`);
        console.log(chalk.dim(`    by ${review.reviewer.slice(0, 8)}... on ${new Date(review.timestamp).toLocaleDateString()}`));
      }
    }

    console.log('\n' + chalk.bold.cyan('═'.repeat(60)) + '\n');
  } catch (error) {
    spinner.fail('Failed to fetch API details');
    console.error(chalk.red(String(error)));
  }
}

export async function marketplacePublishCommand(): Promise<void> {
  console.log(chalk.bold.cyan('\n🚀 Publish to x402 Marketplace\n'));

  const answers = await prompt<{
    name: string;
    description: string;
    category: string;
    url: string;
    pricing: string;
  }>([
    {
      type: 'input',
      name: 'name',
      message: 'API Name:',
      required: true
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      required: true
    },
    {
      type: 'select',
      name: 'category',
      message: 'Category:',
      choices: [
        'AI/ML',
        'Trading',
        'Data',
        'Analytics',
        'Blockchain',
        'Social',
        'Media',
        'Other'
      ]
    },
    {
      type: 'input',
      name: 'url',
      message: 'API URL:',
      required: true
    },
    {
      type: 'input',
      name: 'pricing',
      message: 'Base price (e.g., 0.001):',
      required: true
    }
  ]);

  const spinner = ora('Publishing to marketplace...').start();

  try {
    // Read wallet from config
    const config = await import('../../utils/config.js').then(m => m.loadConfig());

    const response = await fetch('https://marketplace.x402.org/api/v1/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: answers.name,
        description: answers.description,
        owner: config.payment.wallet,
        url: answers.url,
        category: [answers.category],
        pricing: {
          model: 'per-call',
          basePrice: answers.pricing,
          currency: 'USDC'
        }
      })
    });

    const listing = await response.json();
    spinner.succeed('Published to marketplace!');

    console.log(chalk.green(`\n✓ Your API is now live on the marketplace!`));
    console.log(chalk.cyan(`  View at: https://marketplace.x402.org/api/${listing.id}\n`));
  } catch (error) {
    spinner.fail('Failed to publish');
    console.error(chalk.red(String(error)));
  }
}
```

---

## Agent 14: Enhanced Discovery

**Goal:** Make x402 APIs discoverable by AI agents and developers

### Task 14.1: x402scan Integration 🔍

**File:** `src/discovery/x402scan.ts`

```typescript
export interface X402ScanRegistration {
  url: string;
  name: string;
  description: string;
  owner: `0x${string}`;
  network: string;
  pricing: any;
  discoveryDocument: string;
  ownershipProofs: string[];
}

export class X402ScanClient {
  private apiUrl: string;

  constructor(apiUrl = 'https://x402scan.com/api/v1') {
    this.apiUrl = apiUrl;
  }

  async register(registration: X402ScanRegistration): Promise<{ id: string; url: string }> {
    const response = await fetch(`${this.apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration)
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${await response.text()}`);
    }

    return response.json();
  }

  async update(id: string, updates: Partial<X402ScanRegistration>): Promise<void> {
    const response = await fetch(`${this.apiUrl}/update/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Update failed: ${await response.text()}`);
    }
  }

  async verify(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${url}/.well-known/x402`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async search(query: string): Promise<X402ScanRegistration[]> {
    const response = await fetch(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
    return response.json();
  }
}
```

---

### Task 14.2: AI Agent Instructions 🤖

**File:** `src/discovery/ai-instructions.ts`

Generate AI-friendly documentation:

```typescript
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

export function generateAIInstructions(config: any, endpoints: EndpointDoc[]): AIInstructions {
  return {
    name: config.name,
    description: config.discovery?.instructions || config.description,
    usage: `
To use this API, include an x-payment header with your payment proof.
You can get payment proofs from https://x402.org/facilitator.

Example:
\`\`\`bash
curl -H "x-payment: <payment-proof>" ${config.url}/api/endpoint
\`\`\`
    `.trim(),
    examples: endpoints.slice(0, 3).map(ep => `
# ${ep.description}
curl -X ${ep.method} \\
  -H "x-payment: <payment-proof>" \\
  ${config.url}${ep.path}
    `.trim()),
    endpoints
  };
}

export async function publishToMCPRegistry(config: any): Promise<void> {
  const instructions = generateAIInstructions(config, []);
  
  await fetch('https://mcp.run/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: config.name,
      description: instructions.description,
      url: config.url,
      payment: {
        enabled: true,
        method: 'x402',
        wallet: config.payment.wallet
      }
    })
  });
}
```

---

### Task 14.3: OpenAPI Spec Generator 📄

**File:** `src/discovery/openapi.ts`

```typescript
export function generateOpenAPISpec(config: any): any {
  return {
    openapi: '3.0.0',
    info: {
      title: config.name,
      version: config.version || '1.0.0',
      description: config.description,
      'x-payment': {
        method: 'x402',
        wallet: config.payment.wallet,
        network: config.payment.network,
        facilitator: config.payment.facilitator
      }
    },
    servers: [
      {
        url: config.url || 'https://api.example.com',
        description: 'Production server'
      }
    ],
    paths: generatePaths(config.pricing?.routes || {}),
    components: {
      securitySchemes: {
        x402Payment: {
          type: 'apiKey',
          in: 'header',
          name: 'x-payment',
          description: 'x402 payment proof from facilitator'
        }
      }
    },
    security: [
      { x402Payment: [] }
    ]
  };
}

function generatePaths(routes: Record<string, string>): any {
  const paths: any = {};

  for (const [route, price] of Object.entries(routes)) {
    const [method, path] = route.split(' ');
    
    if (!paths[path]) {
      paths[path] = {};
    }

    paths[path][method.toLowerCase()] = {
      summary: `${method} ${path}`,
      'x-price': price,
      responses: {
        '200': {
          description: 'Successful response'
        },
        '402': {
          description: 'Payment required',
          headers: {
            'WWW-Authenticate': {
              schema: { type: 'string' },
              description: 'Payment requirements'
            }
          }
        }
      }
    };
  }

  return paths;
}
```

---

## Success Criteria

**Agent 13 Complete When:**
- ✅ Marketplace API with listings, reviews, stats
- ✅ CLI commands to browse and publish
- ✅ Rating and review system working
- ✅ Auto-sync of earnings stats to marketplace

**Agent 14 Complete When:**
- ✅ x402scan registration automated
- ✅ AI agent instructions generated
- ✅ OpenAPI spec auto-generated
- ✅ MCP registry integration
- ✅ Discovery document validation

---

**These features create network effects and make x402-deploy a platform! 🌐**
