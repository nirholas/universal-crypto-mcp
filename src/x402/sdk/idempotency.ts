/**
 * @fileoverview Idempotency ledger for the X402 payer.
 *
 * Retrying a payment after a timeout or an ambiguous response must not sign a
 * second authorization. Callers supply an idempotency key; a repeat of the same
 * (chain, recipient, amount, token, key) within the TTL returns the original
 * result, and a concurrent repeat joins the call that is already in flight.
 * @license MIT
 */

import { keccak256, toHex } from 'viem';

export interface IdempotencyScope {
  chain: string;
  recipient: string;
  amount: string;
  token: string;
  key: string;
}

/** Stable string identity of a scope. Different purchases never share a slot. */
export function scopeId(scope: IdempotencyScope): string {
  return [
    'x402',
    scope.chain,
    scope.recipient.toLowerCase(),
    scope.amount,
    scope.token,
    scope.key,
  ].join('|');
}

/**
 * Deterministic EIP-3009 nonce for a scope and payer. Signing the same purchase
 * twice yields the same nonce, so the token contract itself refuses to settle
 * it a second time even across process restarts.
 */
export function deriveAuthorizationNonce(scope: IdempotencyScope, payer: string): `0x${string}` {
  return keccak256(toHex(`${scopeId(scope)}|${payer.toLowerCase()}`));
}

interface Entry<T> {
  promise: Promise<T>;
  expires: number;
  settled: boolean;
}

export class IdempotencyLedger<T> {
  private readonly entries = new Map<string, Entry<T>>();

  constructor(
    private readonly ttlMs = 10 * 60 * 1000,
    private readonly maxEntries = 1000,
  ) {}

  /**
   * Run `fn` once per scope. A completed or in-flight entry is reused; a failed
   * attempt is forgotten so the caller can retry with the same key.
   */
  run(scope: IdempotencyScope, fn: () => Promise<T>, now = Date.now()): { promise: Promise<T>; replayed: boolean } {
    this.prune(now);
    const id = scopeId(scope);
    const existing = this.entries.get(id);
    if (existing) return { promise: existing.promise, replayed: true };

    const entry: Entry<T> = {
      promise: fn(),
      expires: now + this.ttlMs,
      settled: false,
    };
    this.entries.set(id, entry);
    entry.promise.then(
      () => {
        entry.settled = true;
      },
      () => {
        if (this.entries.get(id) === entry) this.entries.delete(id);
      },
    );
    return { promise: entry.promise, replayed: false };
  }

  private prune(now: number): void {
    for (const [id, entry] of this.entries) {
      if (entry.settled && entry.expires <= now) this.entries.delete(id);
    }
    while (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.entries.delete(oldest);
    }
  }
}
