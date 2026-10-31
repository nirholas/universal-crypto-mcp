/**
 * Replay guard for x402 payment authorizations.
 *
 * An authorization (EIP-3009 nonce) must buy exactly one call. The guard is
 * per process and bounded; the nonce consumed on-chain by settlement remains
 * the durable guarantee across restarts and replicas.
 *
 * @license Apache-2.0
 */
export class ReplayGuard {
  private readonly seen = new Map<string, number>()

  constructor(
    private readonly ttlMs = 10 * 60 * 1000,
    private readonly maxEntries = 10_000,
  ) {}

  /** Returns false when the key was already claimed and has not expired. */
  claim(key: string, now = Date.now()): boolean {
    this.prune(now)
    if (this.seen.has(key)) return false
    this.seen.set(key, now + this.ttlMs)
    return true
  }

  /** Give a claim back, e.g. when settlement failed and the client may retry. */
  release(key: string): void {
    this.seen.delete(key)
  }

  private prune(now: number): void {
    for (const [key, expires] of this.seen) {
      if (expires <= now) this.seen.delete(key)
    }
    while (this.seen.size >= this.maxEntries) {
      const oldest = this.seen.keys().next().value
      if (oldest === undefined) break
      this.seen.delete(oldest)
    }
  }
}

/** Stable identity of a payment authorization: payer plus nonce, falling back to the signature. */
export function authorizationKey(payment: {
  payload?: { from?: string; nonce?: string }
  signature?: string
}): string {
  const from = String(payment.payload?.from ?? "").toLowerCase()
  const nonce = payment.payload?.nonce
  if (nonce) return `nonce:${from}:${String(nonce).toLowerCase()}`
  return `sig:${from}:${String(payment.signature ?? "").toLowerCase()}`
}
