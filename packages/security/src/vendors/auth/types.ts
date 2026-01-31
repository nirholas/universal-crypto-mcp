/**
 * auth Types
 *
 * Auto-extracted from vendor/auth/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

export interface CompactDecryptGetKey extends types.GetKeyFunction<
  types.CompactJWEHeaderParameters,
  types.FlattenedJWE
> {}

export interface FlattenedDecryptGetKey extends types.GetKeyFunction<
  types.JWEHeaderParameters | undefined,
  types.FlattenedJWE
> {}

export interface GeneralDecryptGetKey extends types.GetKeyFunction<
  types.JWEHeaderParameters,
  types.FlattenedJWE
> {}

export interface Recipient {
  /**
   * Sets the JWE Per-Recipient Unprotected Header on the Recipient object.
   *
   * @param unprotectedHeader JWE Per-Recipient Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWEHeaderParameters): Recipient

  /**
   * Sets the JWE Key Management parameters to be used when encrypting.
   *
   * (ECDH-ES) Use of this method is needed for ECDH based algorithms to set the "apu" (Agreement
   * PartyUInfo) or "apv" (Agreement PartyVInfo) parameters.
   *
   * @param parameters JWE Key Management parameters.
   */
  setKeyManagementParameters(parameters: types.JWEKeyManagementHeaderParameters): Recipient

  /** A shorthand for calling addRecipient() on the enclosing {@link GeneralEncrypt}

interface Cache {
  [alg: string]: types.CryptoKey
}

export interface RemoteJWKSetOptions {
  /**
   * Timeout (in milliseconds) for the HTTP request. When reached the request will be aborted and
   * the verification will fail. Default is 5000 (5 seconds).
   */
  timeoutDuration?: number

  /**
   * Duration (in milliseconds) for which no more HTTP requests will be triggered after a previous
   * successful fetch. Default is 30000 (30 seconds).
   */
  cooldownDuration?: number

  /**
   * Maximum time (in milliseconds) between successful HTTP requests. Default is 600000 (10
   * minutes).
   */
  cacheMaxAge?: number | typeof Infinity

  /** Headers to be sent with the HTTP request. */
  headers?: Record<string, string>

  /** See {@link jwksCache}

export interface ExportedJWKSCache {
  /** Current cached JSON Web Key Set */
  jwks: types.JSONWebKeySet
  /** Last updated at timestamp (seconds since epoch) */
  uat: number
}

export interface CompactVerifyGetKey extends types.GenericGetKeyFunction<
  types.CompactJWSHeaderParameters,
  types.FlattenedJWSInput,
  types.CryptoKey | types.KeyObject | types.JWK | Uint8Array
> {}

export interface FlattenedVerifyGetKey extends types.GenericGetKeyFunction<
  types.JWSHeaderParameters | undefined,
  types.FlattenedJWSInput,
  types.CryptoKey | types.KeyObject | types.JWK | Uint8Array
> {}

export interface Signature {
  /**
   * Sets the JWS Protected Header on the Signature object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: types.JWSHeaderParameters): Signature

  /**
   * Sets the JWS Unprotected Header on the Signature object.
   *
   * @param unprotectedHeader JWS Unprotected Header.
   */
  setUnprotectedHeader(unprotectedHeader: types.JWSHeaderParameters): Signature

  /** A shorthand for calling addSignature() on the enclosing {@link GeneralSign}

export interface GeneralVerifyGetKey extends types.GenericGetKeyFunction<
  types.JWSHeaderParameters,
  types.FlattenedJWSInput,
  types.CryptoKey | types.KeyObject | types.JWK | Uint8Array
> {}

export interface JWTDecryptOptions
  extends types.DecryptOptions, types.JWTClaimVerificationOptions {}

export interface JWTDecryptGetKey extends types.GetKeyFunction<
  types.CompactJWEHeaderParameters,
  types.FlattenedJWE
> {}

export interface UnsecuredResult<PayloadType = types.JWTPayload> {
  payload: PayloadType & types.JWTPayload
  header: types.JWSHeaderParameters
}

export interface JWTVerifyOptions extends types.VerifyOptions, types.JWTClaimVerificationOptions {}

export interface JWTVerifyGetKey extends types.GenericGetKeyFunction<
  types.JWTHeaderParameters,
  types.FlattenedJWSInput,
  types.CryptoKey | types.KeyObject | types.JWK | Uint8Array
> {}

export interface GenerateKeyPairResult {
  /** The generated Private Key. */
  privateKey: types.CryptoKey

  /** Public Key corresponding to the generated Private Key. */
  publicKey: types.CryptoKey
}

export interface GenerateKeyPairOptions {
  /**
   * The EC "crv" (Curve) or OKP "crv" (Subtype of Key Pair) value to generate. The curve must be
   * both supported on the runtime as well as applicable for the given JWA algorithm identifier.
   */
  crv?: string

  /**
   * A hint for RSA algorithms to generate an RSA key of a given `modulusLength` (Key size in bits).
   * JOSE requires 2048 bits or larger. Default is 2048.
   */
  modulusLength?: number

  /**
   * The value to use as {@link !SubtleCrypto.generateKey}

export interface GenerateSecretOptions {
  /**
   * The value to use as {@link !SubtleCrypto.generateKey}

export interface KeyImportOptions {
  /**
   * The value to use as {@link !SubtleCrypto.importKey}

// ============================================================
// Types from vendor code
// ============================================================

export type FetchImplementation = (
  /** URL the request is being made sent to {@link !fetch} as the `resource` argument */
  url: string,
  /** Options otherwise sent to {@link !fetch} as the `options` argument */
  options: {
    /** HTTP Headers */
    headers: Headers
    /** The {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods request method} */
    method: 'GET'
    /** See {@link !Request.redirect} */
    redirect: 'manual'
    signal: AbortSignal
  },
) => Promise<Response>

async function fetchJwks(
  url: string,
  headers: Headers,
  signal: AbortSignal,
  fetchImpl: FetchImplementation = fetch,
) {
  const response = await fetchImpl(url, {
    method: 'GET',
    signal,
    redirect: 'manual',
    headers,
  }).catch((err) => {
    if (err.name === 'TimeoutError') {
      throw new JWKSTimeout()
    }

    throw err
  })

  if (response.status !== 200) {
    throw new JOSEError('Expected 200 OK from the JSON Web Key Set HTTP response')
  }

  try {
    return await response.json()
  } catch {
    throw new JOSEError('Failed to parse the JSON Web Key Set HTTP response as JSON')
  }
}

/**
 * > [!WARNING]\
 * > This option has security implications that must be understood, assessed for applicability, and
 * > accepted before use. It is critical that the JSON Web Key Set cache only be writable by your own
 * > code.
 *
 * This option is intended for cloud computing runtimes that cannot keep an in memory cache between
 * their code's invocations. Use in runtimes where an in memory cache between requests is available
 * is not desirable.
 *
 * When passed to {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} this allows the passed in
 * object to:
 *
 * - Serve as an initial value for the JSON Web Key Set that the module would otherwise need to
 *   trigger an HTTP request for
 * - Have the JSON Web Key Set the function optionally ended up triggering an HTTP request for
 *   assigned to it as properties
 *
 * The intended use pattern is:
 *
 * - Before verifying with {@link jwks/remote.createRemoteJWKSet createRemoteJWKSet} you pull the
 *   previously cached object from a low-latency key-value store offered by the cloud computing
 *   runtime it is executed on;

type PkgDep = Record<string, string>;

type PasswordsMap = Record<string, string>;

type Password = PasswordsMap | string;

type RequestType = IncomingMessage | Request;

type ResponseType = Response | ServerResponse;

type ResponseCookie = CookieListItem &
  Pick<CookieSerializeOptions, "httpOnly" | "maxAge" | "priority">;

type CookieOptions = Omit<CookieSerializeOptions, "encode">;

export type IronSession<T> = T & {
  /**
   * Encrypts the session data and sets the cookie.
   */
  readonly save: () => Promise<void>;

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface AuthOptions {
  // TODO: Define based on vendor/auth/ patterns
}

export interface Provider {
  // TODO: Define based on vendor/auth/ patterns
}
