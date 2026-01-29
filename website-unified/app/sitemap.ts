import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://universal-crypto-mcp.com'
  
  // Static pages
  const routes = [
    '',
    '/docs',
    '/playground',
    '/community',
    '/pricing',
    '/about',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Add documentation pages
  const docRoutes = [
    '/docs/getting-started',
    '/docs/quick-start',
    '/docs/api-reference',
    '/docs/x402-protocol',
    '/docs/integrations',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...docRoutes]
}
