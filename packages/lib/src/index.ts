/**
 * @ucm/lib - Unified Library Layer
 * 
 * This is the main entry point that re-exports all adapters.
 * Each adapter wraps popular open-source packages with UCM conventions.
 * 
 * Reference implementations: See /vendor/ directory
 */

// Wallet - EVM & Solana wallet connection
export * from './wallet';

// UI - Component primitives and styled components
export * from './ui';

// Charts - Data visualization
export * from './charts';

// State - State management utilities
export * from './state';

// Auth - Authentication adapters
export * from './auth';

// AI - AI agent integrations
export * from './ai';

// Realtime - WebSocket and real-time utilities
export * from './realtime';

// Forms - Form handling and validation
export * from './forms';

// API - API client utilities
export * from './api';

// Database - Database client adapters
export * from './database';

// Contracts - Smart contract utilities
export * from './contracts';

// Payments - Payment processing
export * from './payments';
