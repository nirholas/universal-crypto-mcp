/**
 * LCX Liberty DEX swap API client (docs: https://dex.lcx.com/docs).
 *
 * Opt-in: the swap tools only call it when LCX_API_KEY is set. Every quote and
 * build is checked against the published router for the chain before it is
 * used, and any mismatch is treated as a failed quote.
 */
import type { Address, Hex } from "viem"

import { getChain } from "@/evm/chains.js"

export const LCX_DEX_ID = "lcx-liberty"

const LCX_API_BASE = "https://swap-api.lcx.com/v1"
const LCX_NATIVE = "0x0000000000000000000000000000000000000000"
const EEEE_NATIVE = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
// Fixed so the build can repeat it: /build requires the slippage the quote used
const LCX_SLIPPAGE_BPS = 50

// Published LCX Liberty DEX routers for the networks this server can reach
const LCX_ROUTERS: Record<number, Address> = {
  1: "0x0000000000b1ae06c96aB73FF4360d7AeAaB56F0",
  10: "0x0000000000b1ae06c96aB73FF4360d7AeAaB56F0",
  8453: "0x0000000000b1ae06c96aB73FF4360d7AeAaB56F0",
  42161: "0x0000000000b1ae06c96aB73FF4360d7AeAaB56F0",
  56: "0x0000000000654902B6Ed6cC240cc81CB4c4a3dff",
  137: "0x0000000000654902B6Ed6cC240cc81CB4c4a3dff"
}

export interface LcxQuote {
  quoteId: string
  chainId: number
  input: { token: string; amount: string; decimals?: number }
  output: { token: string; amount: string; minimumAmount: string; decimals?: number }
  priceImpactPct?: number | null
  gasEstimateWei?: string | null
  spender: string
  expiresAt: number
}

export interface LcxBuild {
  swap: { chainId: number; to: Address; data: Hex; value: string }
  minAmountOut: string
  deadline: number
  routerDeployed: boolean
}

export interface LcxSwapRequest {
  chainId: number
  tokenIn: string
  tokenOut: string
  amountIn: string
}

interface LcxEnvelope<T> {
  success?: boolean
  data?: T
  code?: string
  error?: string
  message?: string
}

export function getLcxApiKey(): string | undefined {
  const apiKey = process.env.LCX_API_KEY?.trim()
  return apiKey === "" ? undefined : apiKey
}

export function requireLcxApiKey(): string {
  const apiKey = getLcxApiKey()
  if (!apiKey) {
    throw new Error(
      "LCX Liberty DEX needs an API key: set LCX_API_KEY (free key at https://dex.lcx.com/dashboard)"
    )
  }
  return apiKey
}

export function isLcxDex(dex?: string): boolean {
  const id = dex?.toLowerCase()
  return id === LCX_DEX_ID || id === "lcx"
}

export function getLcxRouterForNetwork(network: string): Address | undefined {
  try {
    return LCX_ROUTERS[getChain(network).id]
  } catch {
    return undefined
  }
}

// LCX Liberty DEX names the native coin with the zero address; accept the 0xEeee alias too
export function toLcxToken(token: string): string {
  return token.toLowerCase() === EEEE_NATIVE ? LCX_NATIVE : token
}

export function isLcxNative(token: string): boolean {
  return toLcxToken(token) === LCX_NATIVE
}

const sameAddress = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

function routerFor(chainId: number): Address {
  const router = LCX_ROUTERS[chainId]
  if (!router) throw new Error(`LCX Liberty DEX does not support chain ${chainId}`)
  return router
}

async function lcxPost<T>(path: string, body: Record<string, unknown>, apiKey: string): Promise<T> {
  const res = await fetch(`${LCX_API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  })
  const json = (await res.json().catch(() => null)) as LcxEnvelope<T> | null
  if (!res.ok || !json?.success || !json.data) {
    const code = json?.code ? ` ${json.code}` : ""
    const reason = json?.message ?? json?.error ?? res.statusText
    throw new Error(`LCX Liberty DEX ${path} failed (HTTP ${res.status}${code}): ${reason}`)
  }
  return json.data
}

export async function getLcxQuote(request: LcxSwapRequest, apiKey: string): Promise<LcxQuote> {
  const router = routerFor(request.chainId)
  const tokenIn = toLcxToken(request.tokenIn)
  const tokenOut = toLcxToken(request.tokenOut)
  const { quote } = await lcxPost<{ quote: LcxQuote }>(
    "/quote",
    {
      chainId: request.chainId,
      tokenIn,
      tokenOut,
      amountIn: request.amountIn,
      slippageBps: LCX_SLIPPAGE_BPS
    },
    apiKey
  )

  if (!sameAddress(quote.spender, router)) {
    throw new Error(`LCX Liberty DEX quote names spender ${quote.spender}, expected ${router}`)
  }
  if (quote.chainId !== request.chainId) {
    throw new Error(
      `LCX Liberty DEX quote is for chain ${quote.chainId}, expected ${request.chainId}`
    )
  }
  if (BigInt(quote.input.amount) !== BigInt(request.amountIn)) {
    throw new Error(
      `LCX Liberty DEX quote sells ${quote.input.amount}, expected ${request.amountIn}`
    )
  }
  if (!sameAddress(quote.input.token, tokenIn) || !sameAddress(quote.output.token, tokenOut)) {
    throw new Error("LCX Liberty DEX quote tokens do not match the request")
  }
  return quote
}

export async function buildLcxSwap(
  quote: LcxQuote,
  recipient: Address,
  request: LcxSwapRequest,
  apiKey: string
): Promise<LcxBuild> {
  const router = routerFor(request.chainId)
  const build = await lcxPost<LcxBuild>(
    "/build",
    { quoteId: quote.quoteId, recipient, slippageBps: LCX_SLIPPAGE_BPS },
    apiKey
  )

  if (!sameAddress(build.swap.to, router)) {
    throw new Error(`LCX Liberty DEX build targets ${build.swap.to}, expected ${router}`)
  }
  if (build.swap.chainId !== request.chainId) {
    throw new Error(
      `LCX Liberty DEX build is for chain ${build.swap.chainId}, expected ${request.chainId}`
    )
  }
  if (!build.routerDeployed) {
    throw new Error(`LCX Liberty DEX router is not deployed on chain ${request.chainId}`)
  }
  if (BigInt(build.minAmountOut) !== BigInt(quote.output.minimumAmount)) {
    throw new Error("LCX Liberty DEX build minimum output does not match the quote")
  }
  const expectedValue = isLcxNative(request.tokenIn) ? BigInt(request.amountIn) : 0n
  if (BigInt(build.swap.value) !== expectedValue) {
    throw new Error(
      `LCX Liberty DEX build sends value ${build.swap.value}, expected ${expectedValue}`
    )
  }
  return build
}
