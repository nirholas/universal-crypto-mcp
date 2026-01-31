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
      this.cache = (await response.json()) as JSONWebKeySet;
      this.cacheExpiry = Date.now() + 600000; // 10 minute cache
    }

    const getKey = createLocalJWKSet(this.cache);
    return getKey(protectedHeader);
  }
}

// ============================================================
// JWS Signing Classes
// ============================================================

interface Signature {
  setProtectedHeader(header: Record<string, unknown>): this;
  sign(key: crypto.KeyObject | Uint8Array): Promise<string>;
}

export class CompactSign implements Signature {
  private payload: Uint8Array;
  private protectedHeader: Record<string, unknown> = {};

  constructor(payload: Uint8Array) {
    this.payload = payload;
  }

  setProtectedHeader(header: Record<string, unknown>): this {
    this.protectedHeader = header;
    return this;
  }

  async sign(key: crypto.KeyObject | Uint8Array): Promise<string> {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
      ...this.protectedHeader,
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(this.payload).toString('base64url');

    const signingInput = `${headerB64}.${payloadB64}`;
    const alg = (header.alg as string) || 'HS256';

    let signature: string;

    if (alg.startsWith('HS')) {
      // HMAC signatures
      const keyBuffer = key instanceof Uint8Array ? key : key.export() as Buffer;
      const hashAlg = alg === 'HS384' ? 'sha384' : alg === 'HS512' ? 'sha512' : 'sha256';
      signature = crypto.createHmac(hashAlg, keyBuffer).update(signingInput).digest('base64url');
    } else if (alg.startsWith('RS') || alg.startsWith('PS')) {
      // RSA signatures
      const keyObj = key instanceof Uint8Array ? crypto.createPrivateKey(key) : key;
      const hashAlg = alg.includes('384') ? 'sha384' : alg.includes('512') ? 'sha512' : 'sha256';
      const signer = crypto.createSign(hashAlg);
      signer.update(signingInput);
      signature = signer.sign(keyObj, 'base64url');
    } else if (alg.startsWith('ES')) {
      // ECDSA signatures
      const keyObj = key instanceof Uint8Array ? crypto.createPrivateKey(key) : key;
      const hashAlg = alg === 'ES384' ? 'sha384' : alg === 'ES512' ? 'sha512' : 'sha256';
      const signer = crypto.createSign(hashAlg);
      signer.update(signingInput);
      signature = signer.sign({ key: keyObj, dsaEncoding: 'ieee-p1363' }, 'base64url');
    } else {
      throw new Error(`Unsupported algorithm: ${alg}`);
    }

    return `${signingInput}.${signature}`;
  }
}

export class FlattenedSign extends CompactSign {
  private unprotectedHeader: Record<string, unknown> = {};

  setUnprotectedHeader(header: Record<string, unknown>): this {
    this.unprotectedHeader = header;
    return this;
  }

  async signFlattened(key: crypto.KeyObject | Uint8Array): Promise<FlattenedJWSInput & { header?: Record<string, unknown> }> {
    const compact = await this.sign(key);
    const [protectedB64, payloadB64, signatureB64] = compact.split('.');

    return {
      protected: protectedB64,
      payload: payloadB64,
      signature: signatureB64,
      header: Object.keys(this.unprotectedHeader).length > 0 ? this.unprotectedHeader : undefined,
    };
  }
}

export class IndividualSignature {
  private protectedHeader: Record<string, unknown> = {};
  private unprotectedHeader: Record<string, unknown> = {};
  private key: crypto.KeyObject | Uint8Array | null = null;

  setProtectedHeader(header: Record<string, unknown>): this {
    this.protectedHeader = header;
    return this;
  }

  setUnprotectedHeader(header: Record<string, unknown>): this {
    this.unprotectedHeader = header;
    return this;
  }

  setSigningKey(key: crypto.KeyObject | Uint8Array): this {
    this.key = key;
    return this;
  }

  getKey(): crypto.KeyObject | Uint8Array | null {
    return this.key;
  }

  getProtectedHeader(): Record<string, unknown> {
    return this.protectedHeader;
  }

  getUnprotectedHeader(): Record<string, unknown> {
    return this.unprotectedHeader;
  }
}

interface GeneralJWS {
  payload: string;
  signatures: Array<{
    protected: string;
    header?: Record<string, unknown>;
    signature: string;
  }>;
}

export class GeneralSign {
  private payload: Uint8Array;
  private signatures: IndividualSignature[] = [];

  constructor(payload: Uint8Array) {
    this.payload = payload;
  }

  addSignature(key: crypto.KeyObject | Uint8Array): IndividualSignature {
    const sig = new IndividualSignature();
    sig.setSigningKey(key);
    this.signatures.push(sig);
    return sig;
  }

  async sign(): Promise<GeneralJWS> {
    if (this.signatures.length === 0) {
      throw new Error('At least one signature required');
    }

    const payloadB64 = Buffer.from(this.payload).toString('base64url');
    const result: GeneralJWS = {
      payload: payloadB64,
      signatures: [],
    };

    for (const sig of this.signatures) {
      const key = sig.getKey();
      if (!key) {
        throw new Error('Signature key not set');
      }

      const compactSign = new CompactSign(this.payload);
      compactSign.setProtectedHeader(sig.getProtectedHeader());
      const compact = await compactSign.sign(key);
      const [protectedB64, , signatureB64] = compact.split('.');

      result.signatures.push({
        protected: protectedB64,
        header: Object.keys(sig.getUnprotectedHeader()).length > 0 ? sig.getUnprotectedHeader() : undefined,
        signature: signatureB64,
      });
    }

    return result;
  }
}

// ============================================================
// JWT Sign & Verify
// ============================================================

interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export class SignJWT {
  private payload: JWTPayload;
  private protectedHeader: Record<string, unknown> = {};

  constructor(payload: JWTPayload) {
    this.payload = payload;
  }

  setProtectedHeader(header: Record<string, unknown>): this {
    this.protectedHeader = header;
    return this;
  }

  setIssuedAt(iat?: number): this {
    this.payload.iat = iat ?? Math.floor(Date.now() / 1000);
    return this;
  }

  setExpirationTime(exp: number | string): this {
    if (typeof exp === 'string') {
      // Parse duration string like "2h", "7d"
      const match = exp.match(/^(\d+)([smhd])$/);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const seconds = { s: 1, m: 60, h: 3600, d: 86400 }[unit] || 1;
        this.payload.exp = Math.floor(Date.now() / 1000) + value * seconds;
      }
    } else {
      this.payload.exp = exp;
    }
    return this;
  }

  setNotBefore(nbf: number): this {
    this.payload.nbf = nbf;
    return this;
  }

  setIssuer(iss: string): this {
    this.payload.iss = iss;
    return this;
  }

  setSubject(sub: string): this {
    this.payload.sub = sub;
    return this;
  }

  setAudience(aud: string | string[]): this {
    this.payload.aud = aud;
    return this;
  }

  setJti(jti: string): this {
    this.payload.jti = jti;
    return this;
  }

  async sign(key: crypto.KeyObject | Uint8Array): Promise<string> {
    const signer = new CompactSign(Buffer.from(JSON.stringify(this.payload)));
    signer.setProtectedHeader({ ...this.protectedHeader, typ: 'JWT' });
    return signer.sign(key);
  }
}

export async function jwtVerify(
  jwt: string,
  key: crypto.KeyObject | Uint8Array | ((header: JWSHeaderParameters) => Promise<crypto.KeyObject>)
): Promise<{ payload: JWTPayload; protectedHeader: Record<string, unknown> }> {
  const parts = jwt.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());

  // Get key if it's a function
  const verifyKey = typeof key === 'function' ? await key(header) : key;

  // Verify signature
  const signingInput = `${headerB64}.${payloadB64}`;
  const alg = header.alg || 'HS256';

  let valid = false;

  if (alg.startsWith('HS')) {
    const keyBuffer = verifyKey instanceof Uint8Array ? verifyKey : verifyKey.export() as Buffer;
    const hashAlg = alg === 'HS384' ? 'sha384' : alg === 'HS512' ? 'sha512' : 'sha256';
    const expected = crypto.createHmac(hashAlg, keyBuffer).update(signingInput).digest('base64url');
    valid = crypto.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expected));
  } else if (alg.startsWith('RS') || alg.startsWith('PS') || alg.startsWith('ES')) {
    const keyObj = verifyKey instanceof Uint8Array ? crypto.createPublicKey(verifyKey) : verifyKey;
    const hashAlg = alg.includes('384') ? 'sha384' : alg.includes('512') ? 'sha512' : 'sha256';
    const verifier = crypto.createVerify(hashAlg);
    verifier.update(signingInput);
    const opts = alg.startsWith('ES') ? { key: keyObj, dsaEncoding: 'ieee-p1363' as const } : keyObj;
    valid = verifier.verify(opts, signatureB64, 'base64url');
  }

  if (!valid) {
    throw new Error('Invalid signature');
  }

  // Validate claims
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }
  if (payload.nbf && payload.nbf > now) {
    throw new Error('Token not yet valid');
  }

  return { payload, protectedHeader: header };
}

// ============================================================
// SIWE (Sign-In With Ethereum)
// ============================================================

export interface SiweMessage {
  domain: string;
  address: Address;
  statement?: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
  expirationTime?: string;
  notBefore?: string;
  requestId?: string;
  resources?: string[];
}

export function createSiweMessage(params: Omit<SiweMessage, 'version' | 'issuedAt'>): string {
  const message: SiweMessage = {
    ...params,
    version: '1',
    issuedAt: new Date().toISOString(),
  };

  let msg = `${message.domain} wants you to sign in with your Ethereum account:\n`;
  msg += `${message.address}\n\n`;

  if (message.statement) {
    msg += `${message.statement}\n\n`;
  }

  msg += `URI: ${message.uri}\n`;
  msg += `Version: ${message.version}\n`;
  msg += `Chain ID: ${message.chainId}\n`;
  msg += `Nonce: ${message.nonce}\n`;
  msg += `Issued At: ${message.issuedAt}`;

  if (message.expirationTime) {
    msg += `\nExpiration Time: ${message.expirationTime}`;
  }
  if (message.notBefore) {
    msg += `\nNot Before: ${message.notBefore}`;
  }
  if (message.requestId) {
    msg += `\nRequest ID: ${message.requestId}`;
  }
  if (message.resources && message.resources.length > 0) {
    msg += `\nResources:`;
    for (const resource of message.resources) {
      msg += `\n- ${resource}`;
    }
  }

  return msg;
}

export function parseSiweMessage(message: string): SiweMessage {
  const lines = message.split('\n');

  const domainMatch = lines[0]?.match(/^(.+) wants you to sign in with your Ethereum account:$/);
  const domain = domainMatch?.[1] || '';
  const address = lines[1] as Address;

  let statement: string | undefined;
  let lineIndex = 2;

  // Skip empty line after address
  if (lines[lineIndex] === '') lineIndex++;

  // Check for statement (everything until URI line)
  const statementLines: string[] = [];
  while (lineIndex < lines.length && !lines[lineIndex].startsWith('URI:')) {
    if (lines[lineIndex] !== '') {
      statementLines.push(lines[lineIndex]);
    }
    lineIndex++;
  }
  if (statementLines.length > 0) {
    statement = statementLines.join('\n');
  }

  const getValue = (prefix: string): string | undefined => {
    const line = lines.find(l => l.startsWith(prefix));
    return line?.slice(prefix.length).trim();
  };

  const resources: string[] = [];
  let inResources = false;
  for (const line of lines) {
    if (line === 'Resources:') {
      inResources = true;
      continue;
    }
    if (inResources && line.startsWith('- ')) {
      resources.push(line.slice(2));
    }
  }

  return {
    domain,
    address,
    statement,
    uri: getValue('URI:') || '',
    version: getValue('Version:') || '1',
    chainId: parseInt(getValue('Chain ID:') || '1', 10),
    nonce: getValue('Nonce:') || '',
    issuedAt: getValue('Issued At:') || '',
    expirationTime: getValue('Expiration Time:'),
    notBefore: getValue('Not Before:'),
    requestId: getValue('Request ID:'),
    resources: resources.length > 0 ? resources : undefined,
  };
}

export async function verifySiweSignature(
  message: string,
  signature: `0x${string}`,
  expectedAddress?: Address
): Promise<{ valid: boolean; address: Address; siweMessage: SiweMessage }> {
  const { recoverMessageAddress } = await import('viem');

  const recoveredAddress = await recoverMessageAddress({
    message,
    signature,
  });

  const siweMessage = parseSiweMessage(message);

  // Verify address matches
  const addressToCheck = expectedAddress || siweMessage.address;
  const valid = recoveredAddress.toLowerCase() === addressToCheck.toLowerCase();

  // Check expiration
  if (siweMessage.expirationTime) {
    const expiry = new Date(siweMessage.expirationTime);
    if (expiry < new Date()) {
      return { valid: false, address: recoveredAddress, siweMessage };
    }
  }

  // Check not before
  if (siweMessage.notBefore) {
    const notBefore = new Date(siweMessage.notBefore);
    if (notBefore > new Date()) {
      return { valid: false, address: recoveredAddress, siweMessage };
    }
  }

  return { valid, address: recoveredAddress, siweMessage };
}

export function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}
