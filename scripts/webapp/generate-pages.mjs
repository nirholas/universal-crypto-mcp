#!/usr/bin/env node
/**
 * Generate Web App Pages from Packages
 * 
 * Scans all packages and generates corresponding Next.js pages,
 * API routes, and React components automatically.
 * 
 * Usage: node scripts/webapp/generate-pages.mjs [--dry-run] [--package <name>]
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = join(__dirname, '../..');
const PACKAGES_DIR = join(ROOT_DIR, 'packages');
const WEBAPP_DIR = join(ROOT_DIR, 'website-unified');
const APP_DIR = join(WEBAPP_DIR, 'app');
const COMPONENTS_DIR = join(WEBAPP_DIR, 'components');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const PACKAGE_FILTER = args.includes('--package') ? args[args.indexOf('--package') + 1] : null;

// ============================================================
// Package to Page Mapping
// ============================================================

const PACKAGE_PAGE_MAP = {
  'wallets': {
    route: '(wallets)',
    pages: [
      { path: 'connect', title: 'Connect Wallet', component: 'WalletConnect' },
      { path: 'portfolio', title: 'Portfolio', component: 'Portfolio' },
      { path: 'transactions', title: 'Transactions', component: 'TransactionHistory' },
      { path: 'smart-accounts', title: 'Smart Accounts', component: 'SmartAccounts' },
    ],
    apiRoutes: ['connect', 'disconnect', 'sign', 'balance', 'transactions'],
  },
  'defi': {
    route: '(defi)',
    pages: [
      { path: 'swap', title: 'Token Swap', component: 'SwapInterface' },
      { path: 'pools', title: 'Liquidity Pools', component: 'PoolsDashboard' },
      { path: 'yield', title: 'Yield Farming', component: 'YieldDashboard' },
      { path: 'bridge', title: 'Cross-Chain Bridge', component: 'BridgeInterface' },
      { path: 'protocols', title: 'DeFi Protocols', component: 'ProtocolsList' },
    ],
    apiRoutes: ['swap', 'pools', 'tvl', 'apy', 'bridge'],
  },
  'trading': {
    route: '(trading)',
    pages: [
      { path: 'spot', title: 'Spot Trading', component: 'SpotTrading' },
      { path: 'orderbook', title: 'Order Book', component: 'OrderBook' },
      { path: 'charts', title: 'Charts', component: 'TradingCharts' },
      { path: 'positions', title: 'Positions', component: 'Positions' },
      { path: 'history', title: 'Trade History', component: 'TradeHistory' },
    ],
    apiRoutes: ['order', 'cancel', 'positions', 'history', 'ticker'],
  },
  'agents': {
    route: '(agents)',
    pages: [
      { path: 'create', title: 'Create Agent', component: 'AgentBuilder' },
      { path: 'manage', title: 'Manage Agents', component: 'AgentManager' },
      { path: 'logs', title: 'Agent Logs', component: 'AgentLogs' },
      { path: 'marketplace', title: 'Agent Marketplace', component: 'AgentMarketplace' },
    ],
    apiRoutes: ['create', 'start', 'stop', 'logs', 'list'],
  },
  'market-data': {
    route: '(market-data)',
    pages: [
      { path: 'prices', title: 'Live Prices', component: 'LivePrices' },
      { path: 'watchlist', title: 'Watchlist', component: 'Watchlist' },
      { path: 'news', title: 'Crypto News', component: 'CryptoNews' },
      { path: 'alerts', title: 'Price Alerts', component: 'PriceAlerts' },
    ],
    apiRoutes: ['prices', 'ohlcv', 'news', 'alerts'],
  },
  'nft': {
    route: '(nft)',
    pages: [
      { path: 'gallery', title: 'NFT Gallery', component: 'NFTGallery' },
      { path: 'mint', title: 'Mint NFT', component: 'NFTMint' },
      { path: 'collections', title: 'Collections', component: 'NFTCollections' },
      { path: 'marketplace', title: 'NFT Marketplace', component: 'NFTMarketplace' },
    ],
    apiRoutes: ['mint', 'transfer', 'list', 'buy', 'metadata'],
  },
  'payments': {
    route: '(payments)',
    pages: [
      { path: 'send', title: 'Send Payment', component: 'SendPayment' },
      { path: 'receive', title: 'Receive Payment', component: 'ReceivePayment' },
      { path: 'invoices', title: 'Invoices', component: 'Invoices' },
      { path: 'subscriptions', title: 'Subscriptions', component: 'Subscriptions' },
    ],
    apiRoutes: ['create', 'verify', 'webhook', 'invoice'],
  },
  'security': {
    route: '(security)',
    pages: [
      { path: 'audit', title: 'Security Audit', component: 'SecurityAudit' },
      { path: 'approvals', title: 'Token Approvals', component: 'TokenApprovals' },
      { path: 'scan', title: 'Contract Scanner', component: 'ContractScanner' },
    ],
    apiRoutes: ['audit', 'approvals', 'revoke', 'scan'],
  },
  'automation': {
    route: '(automation)',
    pages: [
      { path: 'workflows', title: 'Workflows', component: 'WorkflowBuilder' },
      { path: 'triggers', title: 'Triggers', component: 'TriggerManager' },
      { path: 'schedules', title: 'Schedules', component: 'ScheduleManager' },
      { path: 'logs', title: 'Automation Logs', component: 'AutomationLogs' },
    ],
    apiRoutes: ['create', 'run', 'schedule', 'logs'],
  },
  'credits': {
    route: '(credits)',
    pages: [
      { path: 'balance', title: 'Credit Balance', component: 'CreditBalance' },
      { path: 'purchase', title: 'Purchase Credits', component: 'PurchaseCredits' },
      { path: 'usage', title: 'Usage History', component: 'UsageHistory' },
    ],
    apiRoutes: ['balance', 'purchase', 'usage', 'plans'],
  },
};

// ============================================================
// Page Generator
// ============================================================

function generatePageContent(pkg, page) {
  return `import { Metadata } from 'next';
import { ${page.component} } from '@/components/${pkg}/${page.component}';

export const metadata: Metadata = {
  title: '${page.title} | Universal Crypto MCP',
  description: '${page.title} - Powered by Universal Crypto MCP',
};

export default function ${page.component}Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">${page.title}</h1>
      <${page.component} />
    </div>
  );
}
`;
}

function generateLayoutContent(pkg, config) {
  const pages = config.pages.map(p => ({
    name: p.title,
    href: `/${pkg}/${p.path}`,
  }));

  return `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | ${pkg.charAt(0).toUpperCase() + pkg.slice(1)}',
    default: '${pkg.charAt(0).toUpperCase() + pkg.slice(1)}',
  },
};

const navigation = ${JSON.stringify(pages, null, 2)};

export default function ${pkg.charAt(0).toUpperCase() + pkg.slice(1)}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/40 p-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
`;
}

// ============================================================
// Component Generator
// ============================================================

function generateComponentContent(pkg, page) {
  return `'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ${page.component}Props {
  className?: string;
}

export function ${page.component}({ className }: ${page.component}Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/${pkg}/${page.path}');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>${page.title}</CardTitle>
        <CardDescription>
          Manage your ${page.title.toLowerCase()} settings and view data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement ${page.component} UI */}
        <div className="grid gap-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">
              Component: ${page.component}
            </p>
            <p className="text-muted-foreground">
              Package: @ucm/${pkg}
            </p>
            {data && (
              <pre className="mt-4 p-4 bg-background rounded text-xs overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
          <div className="flex gap-2">
            <Button>Primary Action</Button>
            <Button variant="outline">Secondary Action</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ${page.component};
`;
}

// ============================================================
// API Route Generator
// ============================================================

function generateAPIRoute(pkg, route) {
  return `import { NextRequest, NextResponse } from 'next/server';

// GET /api/${pkg}/${route}
export async function GET(request: NextRequest) {
  try {
    // TODO: Import and use actual package implementation
    // import { ${route} } from '@ucm/${pkg}';
    
    const searchParams = request.nextUrl.searchParams;
    
    // Placeholder response
    return NextResponse.json({
      success: true,
      package: '${pkg}',
      route: '${route}',
      timestamp: new Date().toISOString(),
      data: {
        message: 'Implement ${route} logic from @ucm/${pkg}',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/${pkg}/${route}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Import and use actual package implementation
    // import { ${route} } from '@ucm/${pkg}';
    
    return NextResponse.json({
      success: true,
      package: '${pkg}',
      route: '${route}',
      timestamp: new Date().toISOString(),
      data: {
        message: 'Implement ${route} POST logic from @ucm/${pkg}',
        received: body,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
`;
}

// ============================================================
// File Writer
// ============================================================

function writeFile(filePath, content) {
  const relativePath = relative(ROOT_DIR, filePath);
  
  if (DRY_RUN) {
    console.log(`   [DRY] ${relativePath}`);
    return;
  }
  
  if (existsSync(filePath)) {
    console.log(`   ⏭️  ${relativePath} (exists)`);
    return;
  }
  
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  console.log(`   ✅ ${relativePath}`);
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('================================================');
  console.log('🚀 Web App Page Generator');
  console.log('================================================\n');

  if (DRY_RUN) console.log('🔍 DRY RUN MODE\n');

  const packages = PACKAGE_FILTER 
    ? [PACKAGE_FILTER] 
    : Object.keys(PACKAGE_PAGE_MAP);

  let totalPages = 0;
  let totalComponents = 0;
  let totalAPIs = 0;

  for (const pkg of packages) {
    const config = PACKAGE_PAGE_MAP[pkg];
    if (!config) {
      console.log(`⚠️  No config for package: ${pkg}`);
      continue;
    }

    console.log(`\n📦 Processing: ${pkg}`);
    console.log(`   Route group: ${config.route}`);

    // Generate layout
    const layoutPath = join(APP_DIR, config.route, 'layout.tsx');
    writeFile(layoutPath, generateLayoutContent(pkg, config));

    // Generate pages
    console.log(`\n   📄 Pages:`);
    for (const page of config.pages) {
      const pagePath = join(APP_DIR, config.route, page.path, 'page.tsx');
      writeFile(pagePath, generatePageContent(pkg, page));
      totalPages++;
    }

    // Generate components
    console.log(`\n   🧩 Components:`);
    const componentDir = join(COMPONENTS_DIR, pkg);
    mkdirSync(componentDir, { recursive: true });

    for (const page of config.pages) {
      const componentPath = join(componentDir, `${page.component}.tsx`);
      writeFile(componentPath, generateComponentContent(pkg, page));
      totalComponents++;
    }

    // Generate index file
    const indexContent = config.pages
      .map(p => `export { ${p.component} } from './${p.component}';`)
      .join('\n') + '\n';
    writeFile(join(componentDir, 'index.ts'), indexContent);

    // Generate API routes
    console.log(`\n   🔌 API Routes:`);
    for (const route of config.apiRoutes) {
      const apiPath = join(APP_DIR, 'api', pkg, route, 'route.ts');
      writeFile(apiPath, generateAPIRoute(pkg, route));
      totalAPIs++;
    }
  }

  console.log('\n================================================');
  console.log(`📊 Summary:`);
  console.log(`   Pages: ${totalPages}`);
  console.log(`   Components: ${totalComponents}`);
  console.log(`   API Routes: ${totalAPIs}`);
  console.log('================================================');
}

main().catch(console.error);
