/**
 * Core Types for NLP Interface
 * Production-ready type definitions for DeFi conversational AI
 */

import { z } from 'zod';

// ============================================================================
// Intent Recognition Types
// ============================================================================

export type IntentCategory = 
  | 'price_query'
  | 'wallet_query'
  | 'yield_query'
  | 'portfolio_query'
  | 'gas_query'
  | 'nft_query'
  | 'defi_positions'
  | 'token_comparison'
  | 'market_sentiment'
  | 'risk_assessment'
  | 'transaction_history'
  | 'ens_resolution'
  | 'approvals_check'
  | 'general_help'
  | 'greeting'
  | 'unknown';

export interface Intent {
  category: IntentCategory;
  confidence: number;
  subIntent?: string;
  rawQuery: string;
}

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  normalizedValue: string;
  confidence: number;
  position: { start: number; end: number };
}

export type EntityType =
  | 'token_symbol'
  | 'wallet_address'
  | 'ens_name'
  | 'chain'
  | 'currency'
  | 'time_period'
  | 'number'
  | 'percentage'
  | 'protocol'
  | 'pool_id'
  | 'risk_level';

// ============================================================================
// API Call Types
// ============================================================================

export type ToolName =
  // Prices
  | 'getTokenPrice'
  | 'getTokenPriceHistory'
  | 'getGasPrices'
  | 'getTopMovers'
  | 'getFearGreedIndex'
  | 'comparePrices'
  // Wallets
  | 'getWalletPortfolio'
  | 'getTokenBalances'
  | 'getNFTs'
  | 'getDeFiPositions'
  | 'getWalletHistory'
  | 'getApprovals'
  | 'resolveENS'
  // Yields
  | 'getTopYields'
  | 'getPoolDetails'
  | 'getYieldHistory'
  | 'compareYields'
  | 'getStablecoinYields'
  | 'getLPYields'
  | 'estimateReturns'
  | 'getRiskAssessment';

export interface APICall {
  tool: ToolName;
  parameters: Record<string, unknown>;
  priority: number;
}

export interface ParsedQuery {
  intent: Intent;
  entities: ExtractedEntity[];
  apiCalls: APICall[];
  followUpQuestions?: string[];
  clarificationNeeded?: boolean;
  clarificationPrompt?: string;
}

// ============================================================================
// Session Types
// ============================================================================

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  intent?: Intent;
  apiCalls?: APICall[];
  apiResults?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface Session {
  id: string;
  userId: string;
  turns: ConversationTurn[];
  context: SessionContext;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface SessionContext {
  lastWalletAddress?: string;
  lastTokens?: string[];
  lastChain?: string;
  preferredCurrency?: string;
  userPreferences?: UserPreferences;
  conversationState?: ConversationState;
}

export interface UserPreferences {
  defaultChain: string;
  defaultCurrency: string;
  riskTolerance: 'low' | 'medium' | 'high';
  favoriteTokens: string[];
  watchedWallets: string[];
}

export type ConversationState = 
  | 'idle'
  | 'awaiting_wallet'
  | 'awaiting_token'
  | 'awaiting_confirmation'
  | 'processing'
  | 'follow_up';

// ============================================================================
// User & Onboarding Types
// ============================================================================

export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  preferences: UserPreferences;
  onboardingComplete: boolean;
  createdAt: Date;
  lastActiveAt: Date;
  tier: 'free' | 'pro' | 'enterprise';
  apiKey?: string;
}

export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
  action: 'collect_wallet' | 'set_preferences' | 'tutorial' | 'complete';
  required: boolean;
}

// ============================================================================
// Response Types
// ============================================================================

export interface NLPResponse {
  success: boolean;
  sessionId: string;
  response: {
    text: string;
    data?: unknown;
    suggestions?: string[];
    actions?: SuggestedAction[];
  };
  metadata: {
    intent: Intent;
    processingTime: number;
    apiCallsMade: number;
  };
}

export interface SuggestedAction {
  label: string;
  query: string;
  icon?: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface NLPConfig {
  openaiApiKey?: string;
  embeddingModel: string;
  completionModel: string;
  maxTokens: number;
  temperature: number;
  sessionTTL: number;
  redisUrl?: string;
  rateLimitPerMinute: number;
  enableCaching: boolean;
  debugMode: boolean;
}

// ============================================================================
// Zod Schemas for Validation
// ============================================================================

export const QueryRequestSchema = z.object({
  query: z.string().min(1).max(1000),
  sessionId: z.string().uuid().optional(),
  userId: z.string().optional(),
  context: z.record(z.unknown()).optional(),
});

export type QueryRequest = z.infer<typeof QueryRequestSchema>;

export const FeedbackSchema = z.object({
  sessionId: z.string().uuid(),
  turnId: z.string().uuid(),
  rating: z.enum(['positive', 'negative']),
  comment: z.string().max(500).optional(),
});

export type FeedbackRequest = z.infer<typeof FeedbackSchema>;
