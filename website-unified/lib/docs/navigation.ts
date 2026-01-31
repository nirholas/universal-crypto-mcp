/**
 * Navigation structure for the unified documentation site
 * Aligned with AGENT_DOCUMENTATION_PLAN.md
 */

export interface NavItem {
  title: string
  href?: string
  description?: string
  items?: NavItem[]
  badge?: string
  icon?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

/**
 * Main documentation navigation structure
 * Maps to the 9 top-level sections from Agent Plan
 */
export const mainNavigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      {
        title: 'Introduction',
        href: '/docs/getting-started',
        description: 'Welcome to Universal Crypto MCP',
      },
      {
        title: 'Installation',
        href: '/docs/getting-started/installation',
        description: 'Install and set up your environment',
      },
      {
        title: 'Quick Start',
        href: '/docs/getting-started/quick-start',
        description: 'Get up and running in 5 minutes',
      },
      {
        title: 'Configuration',
        href: '/docs/getting-started/configuration',
        description: 'Configure your MCP server',
      },
      {
        title: 'First Tool',
        href: '/docs/getting-started/first-tool',
        description: 'Create your first MCP tool',
      },
    ],
  },
  {
    title: 'Packages',
    items: [
      {
        title: 'Core & Infrastructure',
        items: [
          {
            title: 'Core Package',
            href: '/docs/packages/core',
            description: 'MCP server core functionality',
          },
          {
            title: 'Shared Utilities',
            href: '/docs/packages/core/shared',
            description: 'Common utilities and helpers',
          },
          {
            title: 'Infrastructure',
            href: '/docs/packages/infrastructure',
            description: 'Service discovery and load balancing',
          },
        ],
      },
      {
        title: 'DeFi Protocols',
        badge: '15 protocols',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/defi',
            description: 'DeFi architecture overview',
          },
          {
            title: 'Uniswap V3',
            href: '/docs/packages/defi/uniswap-v3',
          },
          {
            title: 'Aave',
            href: '/docs/packages/defi/aave',
          },
          {
            title: 'Compound V3',
            href: '/docs/packages/defi/compound-v3',
          },
          {
            title: 'Curve',
            href: '/docs/packages/defi/curve',
          },
          {
            title: 'GMX V2',
            href: '/docs/packages/defi/gmx-v2',
          },
          {
            title: 'Lido',
            href: '/docs/packages/defi/lido',
          },
          {
            title: 'Yearn',
            href: '/docs/packages/defi/yearn',
          },
          {
            title: 'PancakeSwap',
            href: '/docs/packages/defi/pancakeswap',
          },
          {
            title: 'Layer 2s',
            href: '/docs/packages/defi/layer2',
            description: 'Arbitrum, Optimism, Base, zkEVM',
          },
          {
            title: 'All Protocols →',
            href: '/docs/packages/defi/all',
          },
        ],
      },
      {
        title: 'Wallets & Identity',
        badge: '9 integrations',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/wallets',
          },
          {
            title: 'EVM Wallets',
            href: '/docs/packages/wallets/evm',
          },
          {
            title: 'Solana',
            href: '/docs/packages/wallets/solana',
          },
          {
            title: 'Gnosis Safe',
            href: '/docs/packages/wallets/safe',
          },
          {
            title: 'ENS Domains',
            href: '/docs/packages/wallets/ens',
          },
          {
            title: 'WalletConnect',
            href: '/docs/packages/wallets/walletconnect',
          },
        ],
      },
      {
        title: 'Trading & CEX',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/trading',
          },
          {
            title: 'Binance',
            href: '/docs/packages/trading/binance',
          },
          {
            title: 'Trading Bots',
            href: '/docs/packages/trading/bots',
          },
        ],
      },
      {
        title: 'Market Data',
        badge: '17 sources',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/market-data',
          },
          {
            title: 'CoinGecko',
            href: '/docs/packages/market-data/coingecko',
          },
          {
            title: 'Dune Analytics',
            href: '/docs/packages/market-data/dune',
          },
          {
            title: 'DefiLlama',
            href: '/docs/packages/market-data/defillama',
          },
          {
            title: 'All Sources →',
            href: '/docs/packages/market-data/all',
          },
        ],
      },
      {
        title: 'NFT & Gaming',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/nft',
          },
          {
            title: 'OpenSea',
            href: '/docs/packages/nft/opensea',
          },
          {
            title: 'Blur',
            href: '/docs/packages/nft/blur',
          },
        ],
      },
      {
        title: 'AI Agents',
        badge: '505+ agents',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/agents',
          },
          {
            title: 'Agenti Framework',
            href: '/docs/packages/agents/agenti',
          },
          {
            title: 'UCAI',
            href: '/docs/packages/agents/ucai',
          },
          {
            title: 'DeFi Agents',
            href: '/docs/packages/agents/defi',
          },
          {
            title: 'Agent Library',
            href: '/docs/packages/agents/library',
          },
        ],
      },
      {
        title: 'Automation',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/automation',
          },
          {
            title: 'Social Media',
            href: '/docs/packages/automation/social',
          },
          {
            title: 'Volume Bot',
            href: '/docs/packages/automation/volume-bot',
          },
        ],
      },
      {
        title: 'Generators',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/generators',
          },
          {
            title: 'ABI to MCP',
            href: '/docs/packages/generators/abi-to-mcp',
          },
          {
            title: 'Repo to MCP',
            href: '/docs/packages/generators/repo-to-mcp',
          },
          {
            title: 'Doc Extractor',
            href: '/docs/packages/generators/doc-extractor',
          },
        ],
      },
      {
        title: 'Integrations',
        badge: '30+ servers',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/integrations',
          },
          {
            title: 'Blockchain Explorers',
            href: '/docs/packages/integrations/explorers',
          },
          {
            title: 'Analytics Platforms',
            href: '/docs/packages/integrations/analytics',
          },
        ],
      },
      {
        title: 'Security',
        icon: '🔒',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/security',
          },
          {
            title: 'MEV Protection',
            href: '/docs/packages/security/mev',
          },
          {
            title: 'Rugpull Detection',
            href: '/docs/packages/security/rugpull',
          },
        ],
      },
      {
        title: 'Novel Primitives',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/novel',
          },
          {
            title: 'Temporal Oracles',
            href: '/docs/packages/novel/temporal-oracles',
          },
          {
            title: 'Reputation Graphs',
            href: '/docs/packages/novel/reputation',
          },
        ],
      },
      {
        title: 'Marketplace',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/marketplace',
          },
          {
            title: 'Service Registration',
            href: '/docs/packages/marketplace/registration',
          },
          {
            title: 'Smart Contracts',
            href: '/docs/packages/marketplace/contracts',
          },
        ],
      },
      {
        title: 'Credits System',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/credits',
          },
          {
            title: 'Stripe Integration',
            href: '/docs/packages/credits/stripe',
          },
        ],
      },
      {
        title: 'Agent Wallet',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/agent-wallet',
          },
          {
            title: 'Spending Policies',
            href: '/docs/packages/agent-wallet/policies',
          },
        ],
      },
      {
        title: 'Analytics Dashboard',
        items: [
          {
            title: 'Overview',
            href: '/docs/packages/dashboard',
          },
        ],
      },
    ],
  },
  {
    title: 'x402 Protocol',
    items: [
      {
        title: 'Overview',
        items: [
          {
            title: 'What is x402?',
            href: '/docs/x402/overview',
            description: 'AI agents that pay for APIs',
          },
          {
            title: 'Architecture',
            href: '/docs/x402/architecture',
            description: 'Protocol design and payment flows',
          },
          {
            title: 'Use Cases',
            href: '/docs/x402/use-cases',
          },
        ],
      },
      {
        title: 'Getting Started',
        items: [
          {
            title: 'Quick Start',
            href: '/docs/x402/getting-started/quick-start',
          },
          {
            title: 'Server Setup',
            href: '/docs/x402/getting-started/server',
          },
          {
            title: 'Client Setup',
            href: '/docs/x402/getting-started/client',
          },
          {
            title: 'Facilitator Setup',
            href: '/docs/x402/getting-started/facilitator',
          },
        ],
      },
      {
        title: 'Language SDKs',
        items: [
          {
            title: 'TypeScript',
            href: '/docs/x402/typescript',
            badge: '16 packages',
          },
          {
            title: 'Python',
            href: '/docs/x402/python',
          },
          {
            title: 'Go',
            href: '/docs/x402/go',
          },
          {
            title: 'Java',
            href: '/docs/x402/java',
          },
          {
            title: 'Language Comparison',
            href: '/docs/x402/comparison',
          },
        ],
      },
      {
        title: 'HTTP Adapters',
        items: [
          {
            title: 'Express',
            href: '/docs/x402/typescript/adapters/express',
          },
          {
            title: 'Hono',
            href: '/docs/x402/typescript/adapters/hono',
          },
          {
            title: 'Next.js',
            href: '/docs/x402/typescript/adapters/nextjs',
          },
          {
            title: 'FastAPI',
            href: '/docs/x402/python/adapters/fastapi',
          },
          {
            title: 'Flask',
            href: '/docs/x402/python/adapters/flask',
          },
          {
            title: 'Gin (Go)',
            href: '/docs/x402/go/adapters/gin',
          },
        ],
      },
      {
        title: 'Advanced Topics',
        items: [
          {
            title: 'Custom Mechanisms',
            href: '/docs/x402/advanced/mechanisms',
          },
          {
            title: 'Lifecycle Hooks',
            href: '/docs/x402/advanced/hooks',
          },
          {
            title: 'Multi-Chain Payments',
            href: '/docs/x402/advanced/multi-chain',
          },
        ],
      },
      {
        title: 'Deployment',
        items: [
          {
            title: 'x402-deploy',
            href: '/docs/x402/deployment/x402-deploy',
          },
          {
            title: 'Monitoring',
            href: '/docs/x402/deployment/monitoring',
          },
          {
            title: 'Scaling',
            href: '/docs/x402/deployment/scaling',
          },
        ],
      },
      {
        title: 'Integrations',
        items: [
          {
            title: 'MCP Server',
            href: '/docs/x402/integrations/mcp',
          },
          {
            title: 'Agent Wallet',
            href: '/docs/x402/integrations/agent-wallet',
          },
          {
            title: 'Marketplace',
            href: '/docs/x402/integrations/marketplace',
          },
        ],
      },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      {
        title: 'Overview',
        href: '/docs/marketplace',
      },
      {
        title: 'Service Registration',
        href: '/docs/marketplace/registration',
      },
      {
        title: 'Discovery',
        href: '/docs/marketplace/discovery',
      },
      {
        title: 'Subscriptions',
        href: '/docs/marketplace/subscriptions',
      },
      {
        title: 'Reputation System',
        href: '/docs/marketplace/reputation',
      },
      {
        title: 'Analytics',
        href: '/docs/marketplace/analytics',
      },
      {
        title: 'Smart Contracts',
        href: '/docs/marketplace/contracts',
      },
    ],
  },
  {
    title: 'Security',
    items: [
      {
        title: 'Best Practices',
        href: '/docs/security',
        icon: '🔒',
      },
      {
        title: 'MEV Protection',
        href: '/docs/security/mev',
      },
      {
        title: 'Rugpull Detection',
        href: '/docs/security/rugpull',
      },
      {
        title: 'Audit Reports',
        href: '/docs/security/audits',
      },
      {
        title: 'Incident Response',
        href: '/docs/security/incidents',
      },
    ],
  },
  {
    title: 'Tutorials',
    items: [
      {
        title: 'Beginner',
        items: [
          {
            title: 'First MCP Tool',
            href: '/docs/tutorials/beginner/first-tool',
          },
          {
            title: 'First AI Agent',
            href: '/docs/tutorials/beginner/first-agent',
          },
          {
            title: 'First x402 Payment',
            href: '/docs/tutorials/beginner/first-payment',
          },
        ],
      },
      {
        title: 'Intermediate',
        items: [
          {
            title: 'Trading Agent',
            href: '/docs/tutorials/intermediate/trading-agent',
          },
          {
            title: 'DeFi Strategy',
            href: '/docs/tutorials/intermediate/defi-strategy',
          },
          {
            title: 'NFT Bot',
            href: '/docs/tutorials/intermediate/nft-bot',
          },
          {
            title: 'Analytics Dashboard',
            href: '/docs/tutorials/intermediate/dashboard',
          },
        ],
      },
      {
        title: 'Advanced',
        items: [
          {
            title: 'Custom Protocol Integration',
            href: '/docs/tutorials/advanced/custom-protocol',
          },
          {
            title: 'MEV Protection',
            href: '/docs/tutorials/advanced/mev-protection',
          },
          {
            title: 'High-Frequency Trading',
            href: '/docs/tutorials/advanced/hft',
          },
        ],
      },
      {
        title: 'Specialized',
        items: [
          {
            title: 'Solana Agent',
            href: '/docs/tutorials/specialized/solana-agent',
          },
          {
            title: 'L2 Arbitrage',
            href: '/docs/tutorials/specialized/l2-arbitrage',
          },
          {
            title: 'Yield Farming',
            href: '/docs/tutorials/specialized/yield-farming',
          },
        ],
      },
      {
        title: 'All Tutorials →',
        href: '/docs/tutorials',
      },
    ],
  },
  {
    title: 'Use Cases',
    items: [
      {
        title: 'Trading Automation',
        href: '/docs/use-cases/trading',
      },
      {
        title: 'DeFi Portfolio Management',
        href: '/docs/use-cases/defi-portfolio',
      },
      {
        title: 'Payment APIs',
        href: '/docs/use-cases/payment-apis',
      },
      {
        title: 'Agent Monetization',
        href: '/docs/use-cases/agent-monetization',
      },
      {
        title: 'Analytics Dashboards',
        href: '/docs/use-cases/analytics',
      },
      {
        title: 'Security Monitoring',
        href: '/docs/use-cases/security',
      },
    ],
  },
  {
    title: 'Reference',
    items: [
      {
        title: 'API Reference',
        href: '/docs/reference/api',
        badge: 'Auto-generated',
      },
      {
        title: 'Tool Catalog',
        href: '/tools',
        badge: '380+ tools',
      },
      {
        title: 'Chain Support',
        href: '/docs/chains',
        badge: '60+ chains',
      },
      {
        title: 'Comparison Tables',
        href: '/docs/comparisons',
      },
    ],
  },
  {
    title: 'API Reference',
    items: [
      {
        title: 'Overview',
        href: '/docs/api',
        description: 'Complete API documentation for all packages',
      },
      {
        title: 'Core & Infrastructure',
        items: [
          {
            title: 'Core Package',
            href: '/docs/api/core',
            description: 'MCP server core types and utilities',
          },
          {
            title: 'Infrastructure',
            href: '/docs/api/infrastructure',
            description: 'Monitoring, logging, and health checks',
          },
        ],
      },
      {
        title: 'DeFi & Trading',
        items: [
          {
            title: 'DeFi Protocols',
            href: '/docs/api/defi',
            description: 'Uniswap, Aave, Curve, and 15+ protocols',
          },
          {
            title: 'Trading & CEX',
            href: '/docs/api/trading',
            description: 'Binance, trading bots, and memecoin tools',
          },
        ],
      },
      {
        title: 'Data & Analytics',
        items: [
          {
            title: 'Market Data',
            href: '/docs/api/market-data',
            description: 'CoinGecko, DEXScreener, and analytics',
          },
          {
            title: 'Wallets',
            href: '/docs/api/wallets',
            description: 'EVM, Solana, Safe, and wallet connectors',
          },
        ],
      },
      {
        title: 'Advanced Features',
        items: [
          {
            title: 'AI Agents',
            href: '/docs/api/agents',
            description: 'Agent framework and CDP integration',
          },
          {
            title: 'NFT & Gaming',
            href: '/docs/api/nft',
            description: 'Minting, trading, and marketplace APIs',
          },
          {
            title: 'Automation',
            href: '/docs/api/automation',
            description: 'Scheduler, workflows, and triggers',
          },
        ],
      },
      {
        title: 'Payments & Services',
        items: [
          {
            title: 'Payments (x402)',
            href: '/docs/api/payments',
            description: 'x402 protocol and credit system',
          },
          {
            title: 'Marketplace',
            href: '/docs/api/marketplace',
            description: 'Service discovery and analytics',
          },
        ],
      },
      {
        title: 'Security & Integrations',
        items: [
          {
            title: 'Security',
            href: '/docs/api/security',
            description: 'Auditing, monitoring, and risk management',
          },
          {
            title: 'Integrations',
            href: '/docs/api/integrations',
            description: 'Chain connectors and third-party APIs',
          },
        ],
      },
    ],
  },
  {
    title: 'Deployment',
    items: [
      {
        title: 'Quick Start',
        href: '/docs/deployment',
      },
      {
        title: 'Docker',
        href: '/docs/deployment/docker',
      },
      {
        title: 'Kubernetes',
        href: '/docs/deployment/kubernetes',
      },
      {
        title: 'Monitoring',
        href: '/docs/deployment/monitoring',
      },
      {
        title: 'x402-deploy',
        href: '/docs/deployment/x402-deploy',
      },
    ],
  },
  {
    title: 'Contributing',
    items: [
      {
        title: 'Contributing Guide',
        href: '/docs/contributing',
      },
      {
        title: 'Development Setup',
        href: '/docs/contributing/development',
      },
      {
        title: 'Adding Integrations',
        href: '/docs/contributing/integrations',
      },
      {
        title: 'Testing',
        href: '/docs/contributing/testing',
      },
      {
        title: 'Code Standards',
        href: '/docs/contributing/standards',
      },
    ],
  },
]

/**
 * Flat list of all doc pages for search and sitemap
 */
export function getAllDocPages(): NavItem[] {
  const pages: NavItem[] = []

  function extractPages(items: NavItem[]) {
    for (const item of items) {
      if (item.href) {
        pages.push(item)
      }
      if (item.items) {
        extractPages(item.items)
      }
    }
  }

  for (const section of mainNavigation) {
    extractPages(section.items)
  }

  return pages
}

/**
 * Get navigation breadcrumbs for a given path
 */
export function getBreadcrumbs(pathname: string): NavItem[] {
  const breadcrumbs: NavItem[] = []
  const segments = pathname.split('/').filter(Boolean)

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const page = getAllDocPages().find(p => p.href === currentPath)
    if (page) {
      breadcrumbs.push(page)
    } else {
      // Create breadcrumb from segment
      breadcrumbs.push({
        title: segment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        href: currentPath,
      })
    }
  }

  return breadcrumbs
}

/**
 * Get next/previous pages for navigation
 */
export function getAdjacentPages(currentPath: string): {
  previous: NavItem | null
  next: NavItem | null
} {
  const allPages = getAllDocPages()
  const currentIndex = allPages.findIndex(p => p.href === currentPath)

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  return {
    previous: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
  }
}

/**
 * Get section for a given path
 */
export function getSection(pathname: string): NavSection | null {
  for (const section of mainNavigation) {
    for (const item of section.items) {
      if (item.href === pathname) {
        return section
      }
      if (item.items) {
        const found = findInItems(item.items, pathname)
        if (found) {
          return section
        }
      }
    }
  }
  return null
}

function findInItems(items: NavItem[], pathname: string): boolean {
  for (const item of items) {
    if (item.href === pathname) {
      return true
    }
    if (item.items && findInItems(item.items, pathname)) {
      return true
    }
  }
  return false
}
