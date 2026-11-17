/**
 * Tests for the LCX Liberty DEX swap provider (HTTP is mocked, no live calls)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest"

import { TEST_ADDRESSES, createMockViemClient } from "../../../../tests/setup"

vi.mock("@/evm/services/clients.js", () => ({
  getPublicClient: vi.fn(),
  getWalletClient: vi.fn()
}))

vi.mock("viem/accounts", () => ({
  privateKeyToAccount: vi.fn().mockReturnValue({
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f1E123"
  })
}))

import { registerSwapTools } from "./tools.js"

import { getPublicClient, getWalletClient } from "@/evm/services/clients.js"

type ToolHandler = (args: Record<string, unknown>) => Promise<any>

const ROUTER = "0x0000000000b1ae06c96aB73FF4360d7AeAaB56F0"
const NATIVE = "0x0000000000000000000000000000000000000000"
const TAKER = "0x742d35Cc6634C0532925a3b844Bc9e7595f1E123"
const PRIVATE_KEY = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
const SWAP_HASH = "0x2222222222222222222222222222222222222222222222222222222222222222"
const USDC = TEST_ADDRESSES.ETH_MAINNET.USDC
const WETH = TEST_ADDRESSES.ETH_MAINNET.WETH

function lcxQuote(overrides: Record<string, unknown> = {}) {
  return {
    quoteId: "q_123",
    chainId: 1,
    input: { token: USDC, amount: "1000000000", decimals: 6 },
    output: {
      token: WETH,
      amount: "400000000000000000",
      minimumAmount: "398000000000000000",
      decimals: 18
    },
    priceImpactPct: 0.05,
    gasEstimateWei: "150000",
    spender: ROUTER,
    expiresAt: 1790000120,
    ...overrides
  }
}

function lcxBuild(overrides: Record<string, unknown> = {}, swap: Record<string, unknown> = {}) {
  return {
    swap: { chainId: 1, to: ROUTER, data: "0xabcdef", value: "0", ...swap },
    minAmountOut: "398000000000000000",
    deadline: 1790000300,
    routerDeployed: true,
    simulation: { status: "ok" },
    ...overrides
  }
}

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "",
    json: vi.fn().mockResolvedValue(body)
  }
}

describe("LCX Liberty DEX swap provider", () => {
  let registeredTools: Map<string, { handler: ToolHandler; schema: any }>
  let mockPublicClient: ReturnType<typeof createMockViemClient> & Record<string, any>
  let mockWalletClient: ReturnType<typeof createMockViemClient> & Record<string, any>
  let mockFetch: Mock

  const parse = (result: any) => JSON.parse(result.content[0].text)
  const requestBody = (call: number): Record<string, unknown> =>
    JSON.parse(String(mockFetch.mock.calls[call]?.[1]?.body))

  beforeEach(() => {
    mockPublicClient = createMockViemClient()
    mockWalletClient = createMockViemClient()
    mockPublicClient.getChainId = vi.fn().mockResolvedValue(1)
    mockPublicClient.waitForTransactionReceipt = vi.fn().mockResolvedValue({
      status: "success",
      blockNumber: 18000000n,
      gasUsed: 180000n
    })
    mockWalletClient.sendTransaction = vi.fn().mockResolvedValue(SWAP_HASH)
    ;(getPublicClient as Mock).mockReturnValue(mockPublicClient)
    ;(getWalletClient as Mock).mockReturnValue(mockWalletClient)

    mockFetch = vi.fn()
    vi.stubGlobal("fetch", mockFetch)
    process.env.LCX_API_KEY = "test-key"

    registeredTools = new Map()
    const server = {
      tool: vi.fn((name: string, description: string, schema: any, handler: ToolHandler) => {
        registeredTools.set(name, { handler, schema })
      })
    } as unknown as McpServer
    registerSwapTools(server)
  })

  afterEach(() => {
    delete process.env.LCX_API_KEY
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  describe("get_swap_quote", () => {
    const args = {
      tokenIn: USDC,
      tokenOut: WETH,
      amountIn: "1000000000",
      network: "ethereum",
      dex: "lcx-liberty"
    }

    it("returns the LCX Liberty DEX quote", async () => {
      mockFetch.mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))

      const data = parse(await registeredTools.get("get_swap_quote")!.handler(args))

      expect(data.dex).toBe("lcx-liberty")
      expect(data.amountOut).toBe("400000000000000000")
      expect(data.minAmountOut).toBe("398000000000000000")
      expect(data.router).toBe(ROUTER)
      expect(data.chainId).toBe(1)
      expect(data.priceImpact).toBe("0.05%")
      expect(mockPublicClient.readContract).not.toHaveBeenCalled()

      expect(mockFetch).toHaveBeenCalledWith(
        "https://swap-api.lcx.com/v1/quote",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({ Authorization: "Bearer test-key" })
        })
      )
      expect(requestBody(0)).toEqual({
        chainId: 1,
        tokenIn: USDC,
        tokenOut: WETH,
        amountIn: "1000000000",
        slippageBps: 50
      })
    })

    it("asks for LCX_API_KEY and makes no request when it is unset", async () => {
      delete process.env.LCX_API_KEY

      const result = await registeredTools.get("get_swap_quote")!.handler(args)

      expect(result.content[0].text).toContain("LCX_API_KEY")
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it("refuses a chain without a published router", async () => {
      mockPublicClient.getChainId = vi.fn().mockResolvedValue(204)

      const result = await registeredTools
        .get("get_swap_quote")!
        .handler({ ...args, network: "opbnb" })

      expect(result.content[0].text).toContain("does not support chain 204")
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it("rejects a quote whose spender is not the published router", async () => {
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ success: true, data: { quote: lcxQuote({ spender: TAKER }) } })
      )

      const result = await registeredTools.get("get_swap_quote")!.handler(args)

      expect(result.content[0].text).toContain("Error")
      expect(result.content[0].text).toContain("spender")
    })

    it("rejects a quote for a different amount or token", async () => {
      mockFetch
        .mockResolvedValueOnce(
          jsonResponse({
            success: true,
            data: { quote: lcxQuote({ input: { token: USDC, amount: "1" } }) }
          })
        )
        .mockResolvedValueOnce(
          jsonResponse({
            success: true,
            data: { quote: lcxQuote({ output: { token: USDC, amount: "1", minimumAmount: "1" } }) }
          })
        )

      const tool = registeredTools.get("get_swap_quote")!
      expect((await tool.handler(args)).content[0].text).toContain("Error")
      expect((await tool.handler(args)).content[0].text).toContain("tokens do not match")
    })

    it("surfaces the API error code", async () => {
      mockFetch.mockResolvedValueOnce(
        jsonResponse(
          {
            success: false,
            code: "INVALID_API_KEY",
            error: "INVALID_API_KEY",
            message: "Unknown key"
          },
          401
        )
      )

      const result = await registeredTools.get("get_swap_quote")!.handler(args)

      expect(result.content[0].text).toContain("HTTP 401 INVALID_API_KEY")
    })
  })

  describe("get_best_route", () => {
    const args = { tokenIn: USDC, tokenOut: WETH, amountIn: "1000000000", network: "ethereum" }

    it("does not call LCX Liberty DEX without LCX_API_KEY", async () => {
      delete process.env.LCX_API_KEY
      mockPublicClient.readContract
        .mockResolvedValueOnce([1000000000n, 390000000000000000n])
        .mockResolvedValueOnce([1000000000n, 380000000000000000n])

      const data = parse(await registeredTools.get("get_best_route")!.handler(args))

      expect(mockFetch).not.toHaveBeenCalled()
      expect(data.allQuotes.map((q: any) => q.dex)).toEqual(["uniswap", "sushiswap"])
    })

    it("adds the LCX Liberty DEX quote to the comparison when the key is set", async () => {
      mockPublicClient.readContract
        .mockResolvedValueOnce([1000000000n, 390000000000000000n])
        .mockResolvedValueOnce([1000000000n, 380000000000000000n])
      mockFetch.mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))

      const data = parse(await registeredTools.get("get_best_route")!.handler(args))

      expect(data.allQuotes).toHaveLength(3)
      expect(data.allQuotes).toContainEqual({
        dex: "lcx-liberty",
        amountOut: "400000000000000000",
        router: ROUTER
      })
    })

    it("skips LCX Liberty DEX when it has no route", async () => {
      mockPublicClient.readContract
        .mockResolvedValueOnce([1000000000n, 390000000000000000n])
        .mockResolvedValueOnce([1000000000n, 380000000000000000n])
      mockFetch.mockResolvedValueOnce(
        jsonResponse(
          { success: false, code: "no_route", error: "no_route", message: "No route" },
          400
        )
      )

      const data = parse(await registeredTools.get("get_best_route")!.handler(args))

      expect(data.allQuotes.map((q: any) => q.dex)).toEqual(["uniswap", "sushiswap"])
    })
  })

  describe("execute_swap", () => {
    const args = {
      tokenIn: USDC,
      tokenOut: WETH,
      amountIn: "1000000000",
      minAmountOut: "390000000000000000",
      network: "ethereum",
      privateKey: PRIVATE_KEY,
      dex: "lcx-liberty"
    }

    it("approves exactly the amount sold, then sends the built transaction", async () => {
      mockPublicClient.readContract.mockResolvedValueOnce(0n)
      mockWalletClient.writeContract = vi.fn().mockResolvedValue("0x1111")
      mockFetch
        .mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))
        .mockResolvedValueOnce(jsonResponse({ success: true, data: lcxBuild() }))

      const data = parse(await registeredTools.get("execute_swap")!.handler(args))

      expect(data.success).toBe(true)
      expect(data.transactionHash).toBe(SWAP_HASH)
      expect(data.dex).toBe("lcx-liberty")

      expect(mockWalletClient.writeContract).toHaveBeenCalledTimes(1)
      expect(mockWalletClient.writeContract).toHaveBeenCalledWith(
        expect.objectContaining({
          address: USDC,
          functionName: "approve",
          args: [ROUTER, 1000000000n]
        })
      )

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        "https://swap-api.lcx.com/v1/build",
        expect.anything()
      )
      expect(requestBody(1)).toEqual({ quoteId: "q_123", recipient: TAKER, slippageBps: 50 })

      expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
        expect.objectContaining({ to: ROUTER, data: "0xabcdef", value: 0n })
      )
    })

    it("skips the approval when the allowance already covers the amount", async () => {
      mockPublicClient.readContract.mockResolvedValueOnce(1000000000n)
      mockFetch
        .mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))
        .mockResolvedValueOnce(jsonResponse({ success: true, data: lcxBuild() }))

      const data = parse(await registeredTools.get("execute_swap")!.handler(args))

      expect(data.success).toBe(true)
      expect(mockWalletClient.writeContract).not.toHaveBeenCalled()
    })

    it("sells the native coin with value equal to amountIn and no approval", async () => {
      const amountIn = "1000000000000000000"
      mockFetch
        .mockResolvedValueOnce(
          jsonResponse({
            success: true,
            data: {
              quote: lcxQuote({
                input: { token: NATIVE, amount: amountIn },
                output: { token: USDC, amount: "2500000000", minimumAmount: "2487500000" }
              })
            }
          })
        )
        .mockResolvedValueOnce(
          jsonResponse({
            success: true,
            data: lcxBuild({ minAmountOut: "2487500000" }, { value: amountIn })
          })
        )

      const data = parse(
        await registeredTools.get("execute_swap")!.handler({
          ...args,
          tokenIn: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          tokenOut: USDC,
          amountIn,
          minAmountOut: "2400000000"
        })
      )

      expect(data.success).toBe(true)
      expect(requestBody(0).tokenIn).toBe(NATIVE)
      expect(mockPublicClient.readContract).not.toHaveBeenCalled()
      expect(mockWalletClient.writeContract).not.toHaveBeenCalled()
      expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
        expect.objectContaining({ to: ROUTER, value: BigInt(amountIn) })
      )
    })

    it("refuses when the quoted minimum is below minAmountOut", async () => {
      mockFetch.mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))

      const result = await registeredTools.get("execute_swap")!.handler({
        ...args,
        minAmountOut: "399000000000000000"
      })

      expect(result.content[0].text).toContain("is below minAmountOut")
      expect(mockWalletClient.writeContract).not.toHaveBeenCalled()
      expect(mockWalletClient.sendTransaction).not.toHaveBeenCalled()
    })

    it.each([
      ["a different target", lcxBuild({}, { to: TAKER }), "targets"],
      ["a different chain", lcxBuild({}, { chainId: 10 }), "is for chain 10"],
      ["an undeployed router", lcxBuild({ routerDeployed: false }), "not deployed"],
      ["a different minimum output", lcxBuild({ minAmountOut: "1" }), "minimum output"],
      ["native value on a token sell", lcxBuild({}, { value: "5" }), "sends value"]
    ])("rejects a build with %s", async (_label, build, message) => {
      mockPublicClient.readContract.mockResolvedValueOnce(1000000000n)
      mockFetch
        .mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))
        .mockResolvedValueOnce(jsonResponse({ success: true, data: build }))

      const result = await registeredTools.get("execute_swap")!.handler(args)

      expect(result.content[0].text).toContain("Error executing swap")
      expect(result.content[0].text).toContain(message)
      expect(mockWalletClient.sendTransaction).not.toHaveBeenCalled()
    })
  })

  describe("get_supported_dexs", () => {
    it("lists LCX Liberty DEX only when LCX_API_KEY is set", async () => {
      const tool = registeredTools.get("get_supported_dexs")!

      const withKey = parse(await tool.handler({ network: "base" }))
      expect(withKey.supportedDEXs).toContainEqual({ name: "lcx-liberty", router: ROUTER })

      delete process.env.LCX_API_KEY
      const withoutKey = parse(await tool.handler({ network: "base" }))
      expect(withoutKey.supportedDEXs.some((d: any) => d.name === "lcx-liberty")).toBe(false)
    })

    it("does not list it for a network without a router", async () => {
      const data = parse(
        await registeredTools.get("get_supported_dexs")!.handler({ network: "opbnb" })
      )
      expect(data.supportedDEXs).toEqual([])
    })
  })
})
