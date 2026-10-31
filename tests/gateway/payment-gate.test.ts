/**
 * Gateway settlement ordering (issue #33): a paid tool is released only after
 * the facilitator has settled the payment, a payment authorization buys one
 * call, and a cached verification can never be reused for a pricier tool.
 */
import { describe, it, expect, vi, afterEach } from "vitest"

import { createPaymentGate } from "@/gateway/payment-gate"
import { PaymentVerifier } from "@/gateway/payment-verifier"
import { TOOL_PRICING } from "@/gateway/pricing"

const PAY_TO = "0x40252CFDF8B20Ed757D61ff157719F33Ec332402"
const NETWORK = "eip155:8453"
const PAYER = "0x1111111111111111111111111111111111111111"
const CHEAP = "price_cheap_tool"
const PRICEY = "price_pricey_tool"

TOOL_PRICING[CHEAP] = { priceUSDC: "1000", description: "cheap", rateLimit: 30, category: "read" } as any
TOOL_PRICING[PRICEY] = { priceUSDC: "5000000", description: "pricey", rateLimit: 30, category: "read" } as any

function payment(amount: string, nonce = "0x" + "ab".repeat(32)) {
  const data = {
    scheme: "exact",
    network: NETWORK,
    payload: {
      from: PAYER,
      to: PAY_TO,
      amount,
      token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      nonce,
      validBefore: Math.floor(Date.now() / 1000) + 300,
    },
    signature: "0x" + "cd".repeat(65),
  }
  return Buffer.from(JSON.stringify(data)).toString("base64")
}

function call(gate: ReturnType<typeof createPaymentGate>, tool: string, header: string) {
  const req: any = {
    path: `/mcp/tool/${tool}`,
    body: {},
    headers: { "x-payment": header },
    ip: "127.0.0.1",
  }
  const result: { status: number; body?: any; released: boolean } = { status: 200, released: false }
  const res: any = {
    status(code: number) {
      result.status = code
      return res
    },
    setHeader() {},
    json(body: any) {
      result.body = body
      return res
    },
  }
  return gate(req, res, () => {
    result.released = true
  }).then(() => result)
}

function makeGate(verifier: any) {
  return createPaymentGate({
    payTo: PAY_TO,
    network: NETWORK,
    verifier,
    rateLimiter: { check: vi.fn().mockResolvedValue({ allowed: true }) } as any,
    usageTracker: { record: vi.fn().mockResolvedValue(undefined) } as any,
  })
}

describe("payment gate settlement ordering", () => {
  it("settles before releasing the tool", async () => {
    const order: string[] = []
    const verifier = {
      verify: vi.fn(async () => (order.push("verify"), { valid: true })),
      settle: vi.fn(async () => (order.push("settle"), { valid: true, transactionHash: "0xabc" })),
    }
    const result = await call(makeGate(verifier), CHEAP, payment("1000"))
    expect(result.released).toBe(true)
    expect(order).toEqual(["verify", "settle"])
  })

  it("does not release the tool when settlement fails", async () => {
    const verifier = {
      verify: vi.fn(async () => ({ valid: true })),
      settle: vi.fn(async () => ({ valid: false, reason: "Settlement failed" })),
    }
    const result = await call(makeGate(verifier), CHEAP, payment("1000"))
    expect(result.released).toBe(false)
    expect(result.status).toBe(402)
  })

  it("rejects a replay of an authorization that already bought a call", async () => {
    const verifier = {
      verify: vi.fn(async () => ({ valid: true })),
      settle: vi.fn(async () => ({ valid: true, transactionHash: "0xabc" })),
    }
    const gate = makeGate(verifier)
    const header = payment("1000")
    const first = await call(gate, CHEAP, header)
    const second = await call(gate, CHEAP, header)
    expect(first.released).toBe(true)
    expect(second.released).toBe(false)
    expect(second.status).toBe(402)
    expect(verifier.settle).toHaveBeenCalledTimes(1)
  })

  it("lets the client retry the same authorization after a failed settlement", async () => {
    const verifier = {
      verify: vi.fn(async () => ({ valid: true })),
      settle: vi
        .fn()
        .mockResolvedValueOnce({ valid: false, reason: "facilitator timeout" })
        .mockResolvedValueOnce({ valid: true, transactionHash: "0xabc" }),
    }
    const gate = makeGate(verifier)
    const header = payment("1000")
    expect((await call(gate, CHEAP, header)).released).toBe(false)
    expect((await call(gate, CHEAP, header)).released).toBe(true)
  })
})

describe("PaymentVerifier", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("re-checks the expected amount even when an earlier verification is cached", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ valid: true }), { status: 200 })),
    )
    const verifier = new PaymentVerifier("https://facilitator.test")
    const data = JSON.parse(Buffer.from(payment("1000"), "base64").toString())
    const terms = { expectedPayTo: PAY_TO, expectedNetwork: NETWORK }

    const cheap = await verifier.verify(data, { ...terms, expectedAmount: "1000" })
    const pricey = await verifier.verify(data, { ...terms, expectedAmount: "5000000" })

    expect(cheap.valid).toBe(true)
    expect(pricey.valid).toBe(false)
    expect(pricey.reason).toMatch(/Insufficient/)
  })

  it("sends the payment requirements to /settle so the facilitator can bind them", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)
    const verifier = new PaymentVerifier("https://facilitator.test")
    const data = JSON.parse(Buffer.from(payment("1000"), "base64").toString())

    await verifier.settle(data, { expectedAmount: "1000", expectedPayTo: PAY_TO, expectedNetwork: NETWORK })

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe("https://facilitator.test/settle")
    expect(JSON.parse(init.body as string).requirements).toEqual({
      amount: "1000",
      payTo: PAY_TO,
      network: NETWORK,
    })
  })
})
