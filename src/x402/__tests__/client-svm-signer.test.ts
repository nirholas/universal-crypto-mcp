/**
 * @author nich
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license Apache-2.0
 */
import { describe, it, expect } from "vitest"
import bs58 from "bs58"
import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit"

import { createSvmSigner } from "../client.js"

// Deterministic, synthetic 32-byte seed (never a funded key)
const SEED = Uint8Array.from({ length: 32 }, (_, i) => i + 1)

async function expectedAddress(): Promise<string> {
  const signer = await createKeyPairSignerFromPrivateKeyBytes(SEED)
  return signer.address
}

async function secretKey64(): Promise<Uint8Array> {
  const signer = await createKeyPairSignerFromPrivateKeyBytes(SEED, true)
  const pub = new Uint8Array(await crypto.subtle.exportKey("raw", signer.keyPair.publicKey))
  const out = new Uint8Array(64)
  out.set(SEED, 0)
  out.set(pub, 32)
  return out
}

describe("createSvmSigner", () => {
  it("turns a base58 64-byte Solana secret key into a kit TransactionSigner", async () => {
    const key = bs58.encode(await secretKey64())
    const signer = await createSvmSigner(key)
    expect(typeof signer.address).toBe("string")
    expect(signer.address).toBe(await expectedAddress())
    expect(typeof (signer as { signTransactions?: unknown }).signTransactions).toBe("function")
  })

  it("accepts a base58 32-byte seed", async () => {
    const signer = await createSvmSigner(bs58.encode(SEED))
    expect(signer.address).toBe(await expectedAddress())
  })

  it("rejects a key of the wrong length", async () => {
    await expect(createSvmSigner(bs58.encode(new Uint8Array(10)))).rejects.toThrow(/32 or 64 bytes/)
  })
})
