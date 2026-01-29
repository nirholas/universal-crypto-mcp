export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Universal Crypto MCP',
    url: 'https://universal-crypto-mcp.com',
    logo: 'https://universal-crypto-mcp.com/logo.png',
    description: '380+ blockchain tools for AI agents, x402 payment protocol, and 1-click API monetization.',
    sameAs: [
      'https://github.com/nirholas/universal-crypto-mcp',
      'https://twitter.com/nichxbt',
      'https://www.npmjs.com/package/@nirholas/universal-crypto-mcp',
    ],
  }
}

export function generateSoftwareSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Universal Crypto MCP',
    operatingSystem: 'Cross-platform',
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '523',
    },
  }
}
