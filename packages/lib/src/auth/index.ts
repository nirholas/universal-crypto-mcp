/**
 * Authentication Layer
 * 
 * Unified auth adapters for Web3 and traditional auth.
 * Supports SIWE, NextAuth, and custom auth flows.
 * 
 * Reference: /vendor/auth/
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// ============================================================
// Types
// ============================================================

export interface Session {
  userId: string;
  address?: string;
  chainId?: number;
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

export interface AuthConfig {
  secret: string;
  expiresIn?: string;
  issuer?: string;
}

export interface SIWEMessage {
  domain: string;
  address: string;
  statement?: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
  expirationTime?: string;
}

// ============================================================
// JWT Utilities
// ============================================================

const DEFAULT_EXPIRES_IN = '7d';

export async function createJWT(
  payload: JWTPayload,
  config: AuthConfig
): Promise<string> {
  const secret = new TextEncoder().encode(config.secret);
  
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.expiresIn || DEFAULT_EXPIRES_IN)
    .setIssuer(config.issuer || 'ucm')
    .sign(secret);
}

export async function verifyJWT(
  token: string,
  config: AuthConfig
): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(config.secret);
    const { payload } = await jwtVerify(token, secret, {
      issuer: config.issuer || 'ucm',
    });
    return payload;
  } catch {
    return null;
  }
}

// ============================================================
// SIWE (Sign-In with Ethereum)
// ============================================================

export function createSIWEMessage(params: {
  domain: string;
  address: string;
  uri: string;
  chainId: number;
  nonce: string;
  statement?: string;
}): string {
  const message = [
    `${params.domain} wants you to sign in with your Ethereum account:`,
    params.address,
    '',
    params.statement || 'Sign in to Universal Crypto MCP',
    '',
    `URI: ${params.uri}`,
    `Version: 1`,
    `Chain ID: ${params.chainId}`,
    `Nonce: ${params.nonce}`,
    `Issued At: ${new Date().toISOString()}`,
  ].join('\n');

  return message;
}

export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================================
// Session Management
// ============================================================

export interface SessionStore {
  get: (sessionId: string) => Promise<Session | null>;
  set: (sessionId: string, session: Session) => Promise<void>;
  delete: (sessionId: string) => Promise<void>;
}

export function createMemorySessionStore(): SessionStore {
  const sessions = new Map<string, Session>();

  return {
    async get(sessionId) {
      const session = sessions.get(sessionId);
      if (!session) return null;
      if (new Date() > session.expiresAt) {
        sessions.delete(sessionId);
        return null;
      }
      return session;
    },
    async set(sessionId, session) {
      sessions.set(sessionId, session);
    },
    async delete(sessionId) {
      sessions.delete(sessionId);
    },
  };
}

// ============================================================
// Re-exports
// ============================================================

export { SignJWT, jwtVerify } from 'jose';
