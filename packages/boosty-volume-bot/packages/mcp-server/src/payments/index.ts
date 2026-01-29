/**
 * x402 Payments Module
 * HTTP 402 micropayment integration for MCP tools
 */

// Types
export type {
  X402Config,
  PaymentNetwork,
  PriceSpec,
  ToolPricing,
  CategoryPricing,
  PaymentVerification,
  PaymentSettlement,
  PaymentSession,
  ToolPaymentRequirements,
  PaymentRequiredResponse,
  PaymentRequirementsList,
  PaymentEvent,
  PaymentEventHandler,
} from './types.js';

// Configuration
export {
  DEFAULT_CATEGORY_PRICING,
  DEFAULT_TOOL_PRICING,
  ALWAYS_FREE_TOOLS,
  createDefaultX402Config,
  getToolPrice,
  parsePrice,
  formatPrice,
} from './config.js';

// Service
export { X402PaymentService } from './service.js';

// Middleware
export {
  X402PaymentMiddleware,
  withPaymentGating,
  createX402MiddlewareFromEnv,
  type ToolCallContext,
  type PaymentMiddlewareResult,
} from './middleware.js';
