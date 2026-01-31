/**
 * Auth Implementation
 *
 * Native crypto authentication using SIWE (Sign-In With Ethereum)
 * JWT handling with jose library patterns
 */

import * as crypto from 'crypto';
import type { Address } from 'viem';

export * from './types';

// ============================================================
// Types
// ============================================================

interface JWK {
  kty: string;
  kid?: string;
  use?: string;
  alg?: string;
  n?: string;
  e?: string;
  x?: string;
  y?: string;
  crv?: string;
  d?: string;
}

interface JSONWebKeySet {
  keys: JWK[];
}

interface JWSHeaderParameters {
  alg?: string;
  kid?: string;
  typ?: string;
}

interface DecryptOptions {
  keyManagementAlgorithms?: string[];
  contentEncryptionAlgorithms?: string[];
}

interface CompactDecryptResult {
  plaintext: Uint8Array;
  protectedHeader: Record<string, unknown>;
}

interface FlattenedDecryptResult extends CompactDecryptResult {
  sharedUnprotectedHeader?: Record<string, unknown>;
  unprotectedHeader?: Record<string, unknown>;
}

interface GeneralDecryptResult extends FlattenedDecryptResult {}

interface FlattenedJWE {
  protected?: string;
  unprotected?: Record<string, unknown>;
  header?: Record<string, unknown>;
  encrypted_key?: string;
  iv?: string;
  ciphertext: string;
  tag?: string;
  aad?: string;
}

interface GeneralJWE {
  protected?: string;
  unprotected?: Record<string, unknown>;
  recipients: Array<{ header?: Record<string, unknown>; encrypted_key?: string }>;
  iv?: string;
  ciphertext: string;
  tag?: string;
  aad?: string;
}

interface FlattenedJWSInput {
  payload: string | Uint8Array;
  protected?: string;
  header?: Record<string, unknown>;
  signature: string;
}

interface Session {
  address: Address;
  chainId: number;
  expiresAt: number;
  nonce: string;
}

// ============================================================
// JWT/JWE Functions
// ============================================================

export async function compactDecrypt(
  jwe: string | Uint8Array,
  key: crypto.KeyObject | Uint8Array,
  _options?: DecryptOptions
): Promise<CompactDecryptResult> {
  const jweString = typeof jwe === 'string' ? jwe : new TextDecoder().decode(jwe);
  const parts = jweString.split('.');
  
  if (parts.length !== 5) {
    throw new Error('Invalid compact JWE format');
  }

  const [protectedB64, _encryptedKeyB64, ivB64, ciphertextB64, tagB64] = parts;
  
  const protectedHeader = JSON.parse(Buffer.from(protectedB64, 'base64url').toString());
  const iv = Buffer.from(ivB64, 'base64url');
  const ciphertext = Buffer.from(ciphertextB64, 'base64url');
  const tag = Buffer.from(tagB64, 'base64url');

  // Decrypt using AES-GCM
  const keyBuffer = key instanceof Uint8Array ? key : key.export() as Buffer;
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    keyBuffer.slice(0, 32),
    iv
  );
  decipher.setAuthTag(tag);
  
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  return {
    plaintext: new Uint8Array(plaintext),
    protectedHeader,
  };
}

export async function flattenedDecrypt(
  jwe: FlattenedJWE,
  key: crypto.KeyObject | Uint8Array,
  options?: DecryptOptions
): Promise<FlattenedDecryptResult> {
  const compactJWE = [
    jwe.protected || '',
    jwe.encrypted_key || '',
    jwe.iv || '',
    jwe.ciphertext,
    jwe.tag || ''
  ].join('.');

  const result = await compactDecrypt(compactJWE, key, options);
  
  return {
    ...result,
    sharedUnprotectedHeader: jwe.unprotected,
    unprotectedHeader: jwe.header,
  };
}

export async function generalDecrypt(
  jwe: GeneralJWE,
  key: crypto.KeyObject | Uint8Array,
  options?: DecryptOptions
): Promise<GeneralDecryptResult> {
  // Use first recipient's encrypted_key
  const recipient = jwe.recipients[0];
  
  const flattened: FlattenedJWE = {
    protected: jwe.protected,
    unprotected: jwe.unprotected,
    header: recipient?.header,
    encrypted_key: recipient?.encrypted_key,
    iv: jwe.iv,
    ciphertext: jwe.ciphertext,
    tag: jwe.tag,
    aad: jwe.aad,
  };

  return flattenedDecrypt(flattened, key, options);
}

// ============================================================
// JWK Functions
// ============================================================

export async function EmbeddedJWK(
  protectedHeader?: JWSHeaderParameters,
  _token?: FlattenedJWSInput
): Promise<crypto.KeyObject> {
  if (!protectedHeader?.kid) {
    throw new Error('No kid in protected header');
  }
  
  // In production, fetch key from JWK Set
  throw new Error('EmbeddedJWK requires JWK Set configuration');
}

export async function calculateJwkThumbprint(
  key: JWK | crypto.KeyObject,
  digestAlgorithm: 'sha256' | 'sha384' | 'sha512' = 'sha256'
): Promise<string> {
  let jwk: JWK;
  
  if ('kty' in key) {
    jwk = key;
  } else {
    const exported = key.export({ format: 'jwk' }) as JWK;
    jwk = exported;
  }

  // Create canonical JWK representation based on key type
  let canonical: Record<string, string>;
  
  switch (jwk.kty) {
    case 'RSA':
      canonical = { e: jwk.e!, kty: 'RSA', n: jwk.n! };
      break;
    case 'EC':
      canonical = { crv: jwk.crv!, kty: 'EC', x: jwk.x!, y: jwk.y! };
      break;
    case 'OKP':
      canonical = { crv: jwk.crv!, kty: 'OKP', x: jwk.x! };
      break;
    case 'oct':
      throw new Error('Cannot compute thumbprint of symmetric key');
    default:
      throw new Error(`Unsupported key type: ${jwk.kty}`);
  }

  const hash = crypto.createHash(digestAlgorithm);
  hash.update(JSON.stringify(canonical));
  return hash.digest('base64url');
}

export async function calculateJwkThumbprintUri(
  key: crypto.KeyObject | JWK,
  digestAlgorithm: 'sha256' | 'sha384' | 'sha512' = 'sha256'
): Promise<string> {
  const thumbprint = await calculateJwkThumbprint(key, digestAlgorithm);
  return `urn:ietf:params:oauth:jwk-thumbprint:sha-${digestAlgorithm.slice(3)}:${thumbprint}`;
}

export function getKtyFromAlg(alg: unknown): string {
  if (typeof alg !== 'string') {
    throw new Error('Invalid algorithm');
  }

  if (alg.startsWith('RS') || alg.startsWith('PS')) return 'RSA';
  if (alg.startsWith('ES')) return 'EC';
  if (alg.startsWith('Ed')) return 'OKP';
  if (alg.startsWith('HS') || alg.startsWith('A')) return 'oct';
  
  throw new Error(`Unknown algorithm: ${alg}`);
}

export function isJWKSLike(jwks: unknown): jwks is JSONWebKeySet {
  return (
    typeof jwks === 'object' &&
    jwks !== null &&
    'keys' in jwks &&
    Array.isArray((jwks as JSONWebKeySet).keys)
  );
}

export function isJWKLike(key: unknown): key is JWK {
  return (
    typeof key === 'object' &&
    key !== null &&
    'kty' in key &&
    typeof (key as JWK).kty === 'string'
  );
}

const jwkCache = new WeakMap<JWK, Map<string, crypto.KeyObject>>();

export async function importWithAlgCache(
  _cache: WeakMap<JWK, unknown>,
  jwk: JWK,
  alg: string
): Promise<crypto.KeyObject> {
  let algCache = jwkCache.get(jwk);
  if (!algCache) {
    algCache = new Map();
    jwkCache.set(jwk, algCache);
  }

  let key = algCache.get(alg);
  if (!key) {
    key = crypto.createPublicKey({ key: jwk, format: 'jwk' });
    algCache.set(alg, key);
  }

  return key;
}

export function createLocalJWKSet(
  jwks: JSONWebKeySet
): (protectedHeader?: JWSHeaderParameters, _token?: FlattenedJWSInput) => Promise<crypto.KeyObject> {
  return async (protectedHeader) => {
    if (!protectedHeader?.kid) {
      throw new Error('No kid in protected header');
    }

    const jwk = jwks.keys.find(k => k.kid === protectedHeader.kid);
    if (!jwk) {
      throw new Error(`Key not found: ${protectedHeader.kid}`);
    }

    return crypto.createPublicKey({ key: jwk, format: 'jwk' });
  };
}

export function isCloudflareWorkers(): boolean {
  return typeof globalThis.caches !== 'undefined' && 
         typeof (globalThis as unknown as { WebSocketPair?: unknown }).WebSocketPair !== 'undefined';
}

// ============================================================
// Session Management (SIWE-based)
// ============================================================

const sessions = new Map<string, Session>();

export async function signIn(params: {
  message: string;
  signature: string;
  address: Address;
  chainId: number;
}): Promise<{ sessionId: string; expiresAt: number }> {
  // Verify SIWE signature using viem
  const { verifyMessage } = await import('viem');
  const { mainnet } = await import('viem/chains');
  const { createPublicClient, http } = await import('viem');

  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const valid = await client.verifyMessage({
    address: params.address,
    message: params.message,
    signature: params.signature as `0x${string}`,
  });

  if (!valid) {
    throw new Error('Invalid signature');
  }

  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  sessions.set(sessionId, {
    address: params.address,
    chainId: params.chainId,
    expiresAt,
    nonce: crypto.randomBytes(16).toString('hex'),
  });

  return { sessionId, expiresAt };
}

export function signOut(sessionId: string): void {
  sessions.delete(sessionId);
}

export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId);
  
  if (!session) return null;
  
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export function withAuth<T extends (...args: unknown[]) => unknown>(
  handler: T,
  options?: { requireSession?: boolean }
): T {
  return ((...args: unknown[]) => {
    // Extract session from args (depends on framework)
    const sessionId = (args[0] as { headers?: { authorization?: string } })?.headers?.authorization?.replace('Bearer ', '');
    
    if (options?.requireSession !== false && !sessionId) {
      throw new Error('Authentication required');
    }

    if (sessionId) {
      const session = getSession(sessionId);
      if (!session) {
        throw new Error('Invalid or expired session');
      }
    }

    return handler(...args);
  }) as T;
}

export function verifyToken(token: string, secret: string): { valid: boolean; payload?: unknown; error?: string } {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    if (!headerB64 || !payloadB64 || !signatureB64) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (signatureB64 !== expectedSignature) {
      return { valid: false, error: 'Invalid signature' };
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
}

// ============================================================
// Encryption Classes
// ============================================================

export class CompactEncrypt {
  private plaintext: Uint8Array;
  private protectedHeader: Record<string, unknown> = {};

  constructor(plaintext: Uint8Array) {
    this.plaintext = plaintext;
  }

  setProtectedHeader(header: Record<string, unknown>): this {
    this.protectedHeader = header;
    return this;
  }

  async encrypt(key: Uint8Array): Promise<string> {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key.slice(0, 32), iv);
    
    const ciphertext = Buffer.concat([
      cipher.update(this.plaintext),
      cipher.final()
    ]);
    const tag = cipher.getAuthTag();

    const parts = [
      Buffer.from(JSON.stringify(this.protectedHeader)).toString('base64url'),
      '', // encrypted key (empty for direct encryption)
      iv.toString('base64url'),
      ciphertext.toString('base64url'),
      tag.toString('base64url')
    ];

    return parts.join('.');
  }
}

export class FlattenedEncrypt extends CompactEncrypt {
  async encrypt(key: Uint8Array): Promise<FlattenedJWE> {
    const compact = await super.encrypt(key);
    const [protectedHeader, encryptedKey, iv, ciphertext, tag] = compact.split('.');

    return {
      protected: protectedHeader,
      encrypted_key: encryptedKey,
      iv,
      ciphertext,
      tag,
    };
  }
}

export class GeneralEncrypt extends CompactEncrypt {
  private recipients: Array<{ key: Uint8Array; header?: Record<string, unknown> }> = [];

  addRecipient(key: Uint8Array, header?: Record<string, unknown>): this {
    this.recipients.push({ key, header });
    return this;
  }

  async encrypt(_key?: Uint8Array): Promise<GeneralJWE> {
    if (this.recipients.length === 0) {
      throw new Error('At least one recipient required');
    }

    const compact = await super.encrypt(this.recipients[0].key);
    const [protectedHeader, _, iv, ciphertext, tag] = compact.split('.');

    return {
      protected: protectedHeader,
      recipients: this.recipients.map(r => ({ header: r.header })),
      iv,
      ciphertext,
      tag,
    };
  }
}

// ============================================================
// JWK Set Classes
// ============================================================

export class LocalJWKSet {
  private jwks: JSONWebKeySet;
  private getKey: ReturnType<typeof createLocalJWKSet>;

  constructor(jwks: JSONWebKeySet) {
    this.jwks = jwks;
    this.getKey = createLocalJWKSet(jwks);
  }

  async getPublicKey(protectedHeader: JWSHeaderParameters): Promise<crypto.KeyObject> {
    return this.getKey(protectedHeader);
  }
}

export class RemoteJWKSet {
  private url: string;
  private cache: JSONWebKeySet | null = null;
  private cacheExpiry = 0;

  constructor(url: string | URL) {
    this.url = url.toString();
  }

  async getPublicKey(protectedHeader: JWSHeaderParameters): Promise<crypto.KeyObject> {
    if (!this.cache || Date.now() > this.cacheExpiry) {
      const response = await fetch(this.url);
      this.cache = await response.json() as JSONWebKeySet;
      this.cacheExpiry = Date.now() + 600000; // 10 minute cache
    }

    const getKey = createLocalJWKSet(this.cache);
    return getKey(protectedHeader);
  }
}
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: RemoteJWKSet');
  }
}

// From vendor code
export export class CompactSign {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: CompactSign');
  }
}

// From vendor code
export export class FlattenedSign {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: FlattenedSign');
  }
}

// From vendor code
export class IndividualSignature implements Signature {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: IndividualSignature');
  }
}

// From vendor code
export export class GeneralSign {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: GeneralSign');
  }
}
