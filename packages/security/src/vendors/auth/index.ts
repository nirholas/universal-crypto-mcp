/**
 * auth Implementation
 *
 * Adapted from: jwt-library, middleware, nextjs-auth, session-manager
 * See vendor/auth/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export export async function compactDecrypt(
  jwe: string | Uint8Array,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.DecryptOptions,
): Promise<types.CompactDecryptResult>
/**
 * @param jwe Compact JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 * {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: compactDecrypt');
}

// From vendor code
export export function flattenedDecrypt(
  jwe: types.FlattenedJWE,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.DecryptOptions,
): Promise<types.FlattenedDecryptResult>
/**
 * @param jwe Flattened JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 * {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: flattenedDecrypt');
}

// From vendor code
export export function generalDecrypt(
  jwe: types.GeneralJWE,
  key: types.CryptoKey | types.KeyObject | types.JWK | Uint8Array,
  options?: types.DecryptOptions,
): Promise<types.GeneralDecryptResult>
/**
 * @param jwe General JWE.
 * @param getKey Function resolving Private Key or Secret to decrypt the JWE with. See
 * {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: generalDecrypt');
}

// From vendor code
export export async function EmbeddedJWK(
  protectedHeader?: types.JWSHeaderParameters,
  token?: types.FlattenedJWSInput,
): Promise<types.CryptoKey> {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: EmbeddedJWK');
}

// From vendor code
export export async function calculateJwkThumbprint(
  key: types.JWK | types.CryptoKey | types.KeyObject,
  digestAlgorithm?: 'sha256' | 'sha384' | 'sha512',
): Promise<string> {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: calculateJwkThumbprint');
}

// From vendor code
export export async function calculateJwkThumbprintUri(
  key: types.CryptoKey | types.KeyObject | types.JWK,
  digestAlgorithm?: 'sha256' | 'sha384' | 'sha512',
): Promise<string> {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: calculateJwkThumbprintUri');
}

// From vendor code
export function getKtyFromAlg(alg: unknown) {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: getKtyFromAlg');
}

// From vendor code
export function isJWKSLike(jwks: unknown): jwks is types.JSONWebKeySet {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: isJWKSLike');
}

// From vendor code
export function isJWKLike(key: unknown) {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: isJWKLike');
}

// From vendor code
export async function importWithAlgCache(cache: WeakMap<types.JWK, Cache>, jwk: types.JWK, alg: string) {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: importWithAlgCache');
}

// From vendor code
export export function createLocalJWKSet(
  jwks: types.JSONWebKeySet,
): (
  protectedHeader?: types.JWSHeaderParameters,
  token?: types.FlattenedJWSInput,
) => Promise<types.CryptoKey> {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: createLocalJWKSet');
}

// From vendor code
export function isCloudflareWorkers() {
  // TODO: Implement - see vendor/auth/
  throw new Error('Not implemented: isCloudflareWorkers');
}

// UCM expected export
export function signIn(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/auth/ patterns
  throw new Error('Not implemented: signIn');
}

// UCM expected export
export function signOut(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/auth/ patterns
  throw new Error('Not implemented: signOut');
}

// UCM expected export
export function getSession(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/auth/ patterns
  throw new Error('Not implemented: getSession');
}

// UCM expected export
export function withAuth(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/auth/ patterns
  throw new Error('Not implemented: withAuth');
}

// UCM expected export
export function verifyToken(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/auth/ patterns
  throw new Error('Not implemented: verifyToken');
}

// ============================================================
// Classes
// ============================================================

// From vendor code
export export class CompactEncrypt {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: CompactEncrypt');
  }
}

// From vendor code
export export class FlattenedEncrypt {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: FlattenedEncrypt');
  }
}

// From vendor code
export class IndividualRecipient implements Recipient {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: IndividualRecipient');
  }
}

// From vendor code
export export class GeneralEncrypt {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: GeneralEncrypt');
  }
}

// From vendor code
export class LocalJWKSet {
  constructor() {
    // TODO: Implement - see vendor/auth/
    throw new Error('Not implemented: LocalJWKSet');
  }
}

// From vendor code
export class RemoteJWKSet {
  constructor() {
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
