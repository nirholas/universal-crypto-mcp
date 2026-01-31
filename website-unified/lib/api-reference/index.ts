/**
 * API Reference Library
 * 
 * Re-exports all API reference functionality for easy importing.
 */

export * from './loader'

// Convenience re-exports for common functions
export {
  getAllApiDocs,
  getApiDocBySlug,
  getAllApiSymbols,
  searchApiSymbols,
  getApiPackagesByCategory,
  getApiStats,
  discoverPackages,
  API_CATEGORIES,
} from './loader'
