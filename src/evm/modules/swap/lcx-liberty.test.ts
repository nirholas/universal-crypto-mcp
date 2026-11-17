/**
 * Tests for the LCX Liberty DEX swap provider (HTTP is mocked, no live calls)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { encodeFunctionData, type Hex } from "viem"
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

import { LCX_ROUTER_ABI, verifyLcxCalldata, type LcxBuild, type LcxQuote } from "./lcx-liberty.js"
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
const BEBOP_ROUTER = "0xbeb0009aca35087ce7ccf11637e24dd1aad3bf2a"
const BEBOP_SETTLEMENT = "0xbbbbbbb520d69a9775e85b458c58c648259fad5f"
const POOL = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"
const FUTURE = 4102444800n // 1 Jan 2100

const lc = (address: string) => address.toLowerCase() as Hex

interface SwapFields {
  tokenIn: string
  tokenOut: string
  totalIn: bigint
  minAmountOut: bigint
  recipient: string
  deadline: bigint
}

const FIELDS: SwapFields = {
  tokenIn: USDC,
  tokenOut: WETH,
  totalIn: 1000000000n,
  minAmountOut: 398000000000000000n,
  recipient: TAKER,
  deadline: FUTURE
}

function leg(amountIn: bigint, f: SwapFields) {
  return {
    amountIn,
    hops: [{ family: 1, pool: lc(POOL), tokenIn: lc(f.tokenIn), tokenOut: lc(f.tokenOut), aux: 0n }]
  }
}

function swapSplitData(overrides: Partial<SwapFields> = {}): Hex {
  const f = { ...FIELDS, ...overrides }
  return encodeFunctionData({
    abi: LCX_ROUTER_ABI,
    functionName: "swapSplit",
    args: [
      lc(f.tokenIn),
      lc(f.tokenOut),
      f.totalIn,
      f.minAmountOut,
      lc(f.recipient),
      f.deadline,
      [leg(f.totalIn, f)]
    ]
  })
}

function propAmmSplitData(overrides: Partial<SwapFields> = {}): Hex {
  const f = { ...FIELDS, ...overrides }
  const half = f.totalIn / 2n
  return encodeFunctionData({
    abi: LCX_ROUTER_ABI,
    functionName: "swapSplitWithPropAMMSplit",
    args: [
      {
        tokenIn: lc(f.tokenIn),
        tokenOut: lc(f.tokenOut),
        totalIn: f.totalIn,
        minAmountOut: f.minAmountOut,
        recipient: lc(f.recipient),
        deadline: f.deadline,
        integrator: NATIVE
      },
      [leg(half, f)],
      [leg(f.totalIn - half, f)],
      { venue: lc(POOL), venueIn: half, venueMinOut: 1n }
    ]
  })
}

function makerSwapData(
  overrides: Partial<SwapFields> = {},
  maker: Partial<{ target: Hex; spender: Hex; amountIn: bigint }> = {}
): Hex {
  const f = { ...FIELDS, ...overrides }
  const half = f.totalIn / 2n
  return encodeFunctionData({
    abi: LCX_ROUTER_ABI,
    functionName: "makerSwap",
    args: [
      {
        tokenIn: lc(f.tokenIn),
        tokenOut: lc(f.tokenOut),
        amountIn: f.totalIn,
        minAmountOut: f.minAmountOut,
        recipient: lc(f.recipient),
        deadline: f.deadline
      },
      [leg(f.totalIn - half, f)],
      {
        target: BEBOP_ROUTER,
        spender: BEBOP_SETTLEMENT,
        amountIn: half,
        minOut: 1n,
        data: "0x1234",
        ...maker
      },
      [leg(half, f)]
    ]
  })
}

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
    swap: { chainId: 1, to: ROUTER, data: swapSplitData(), value: "0", ...swap },
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

      expect(mockPublicClient.call).toHaveBeenCalledWith({
        account: TAKER,
        to: ROUTER,
        data: swapSplitData(),
        value: 0n
      })
      expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
        expect.objectContaining({ to: ROUTER, data: swapSplitData(), value: 0n })
      )
      // The simulation runs after the approval is mined and before the swap is signed
      const firstCall = (mock: Mock) => mock.mock.invocationCallOrder[0] ?? Number.NaN
      const approvalMined = firstCall(mockPublicClient.waitForTransactionReceipt)
      const simulated = firstCall(mockPublicClient.call)
      const sent = firstCall(mockWalletClient.sendTransaction)
      expect(approvalMined).toBeLessThan(simulated)
      expect(simulated).toBeLessThan(sent)
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
            data: lcxBuild(
              { minAmountOut: "2487500000" },
              {
                value: amountIn,
                data: swapSplitData({
                  tokenIn: NATIVE,
                  tokenOut: USDC,
                  totalIn: BigInt(amountIn),
                  minAmountOut: 2487500000n
                })
              }
            )
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
      mockFetch
        .mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))
        .mockResolvedValueOnce(jsonResponse({ success: true, data: build }))

      const result = await registeredTools.get("execute_swap")!.handler(args)

      expect(result.content[0].text).toContain("Error executing swap")
      expect(result.content[0].text).toContain(message)
      expect(mockWalletClient.sendTransaction).not.toHaveBeenCalled()
    })

    it("refuses calldata that pays someone else before approving anything", async () => {
      mockPublicClient.readContract.mockResolvedValueOnce(0n)
      mockWalletClient.writeContract = vi.fn().mockResolvedValue("0x1111")
      mockFetch
        .mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))
        .mockResolvedValueOnce(
          jsonResponse({
            success: true,
            data: lcxBuild({}, { data: swapSplitData({ recipient: USDC }) })
          })
        )

      const result = await registeredTools.get("execute_swap")!.handler(args)

      expect(result.content[0].text).toContain("Error executing swap")
      expect(result.content[0].text).toContain("pays")
      expect(mockPublicClient.readContract).not.toHaveBeenCalled()
      expect(mockWalletClient.writeContract).not.toHaveBeenCalled()
      expect(mockPublicClient.call).not.toHaveBeenCalled()
      expect(mockWalletClient.sendTransaction).not.toHaveBeenCalled()
    })

    it("refuses to send when the simulation reverts", async () => {
      mockPublicClient.readContract.mockResolvedValueOnce(1000000000n)
      mockPublicClient.call = vi.fn().mockRejectedValue(new Error("execution reverted"))
      mockFetch
        .mockResolvedValueOnce(jsonResponse({ success: true, data: { quote: lcxQuote() } }))
        .mockResolvedValueOnce(jsonResponse({ success: true, data: lcxBuild() }))

      const result = await registeredTools.get("execute_swap")!.handler(args)

      expect(result.content[0].text).toContain("simulation reverted")
      expect(mockWalletClient.sendTransaction).not.toHaveBeenCalled()
    })
  })

  describe("verifyLcxCalldata", () => {
    const quote = lcxQuote() as LcxQuote
    const expected = {
      recipient: TAKER as Hex,
      amountIn: "1000000000",
      tokenIn: USDC,
      tokenOut: WETH,
      minAmountOut: "390000000000000000"
    }
    const withData = (data: Hex, swap: Record<string, unknown> = {}) =>
      lcxBuild({}, { data, ...swap }) as unknown as LcxBuild

    it("accepts swapSplit calldata that matches the request", () => {
      const fields = verifyLcxCalldata(withData(swapSplitData()), quote, expected)
      expect(fields.totalIn).toBe(1000000000n)
      expect(fields.minAmountOut).toBe(398000000000000000n)
    })

    it("accepts swapSplitWithPropAMMSplit calldata that matches the request", () => {
      const fields = verifyLcxCalldata(withData(propAmmSplitData()), quote, expected)
      expect(lc(fields.recipient)).toBe(lc(TAKER))
    })

    it("accepts a makerSwap filled through Bebop", () => {
      expect(() => verifyLcxCalldata(withData(makerSwapData()), quote, expected)).not.toThrow()
    })

    it("accepts a floor above the quote", () => {
      const data = swapSplitData({ minAmountOut: 399000000000000000n })
      expect(() => verifyLcxCalldata(withData(data), quote, expected)).not.toThrow()
    })

    it("accepts a native sell whose value equals totalIn", () => {
      const nativeQuote = lcxQuote({
        input: { token: NATIVE, amount: "1000000000000000000" },
        output: { token: USDC, amount: "2500000000", minimumAmount: "2487500000" }
      }) as LcxQuote
      const data = swapSplitData({
        tokenIn: NATIVE,
        tokenOut: USDC,
        totalIn: 1000000000000000000n,
        minAmountOut: 2487500000n
      })
      const native = {
        ...expected,
        tokenIn: NATIVE,
        tokenOut: USDC,
        amountIn: "1000000000000000000",
        minAmountOut: "0"
      }

      expect(() =>
        verifyLcxCalldata(withData(data, { value: "1000000000000000000" }), nativeQuote, native)
      ).not.toThrow()
      expect(() => verifyLcxCalldata(withData(data, { value: "0" }), nativeQuote, native)).toThrow(
        "sends value"
      )
    })

    it.each([
      ["a different recipient", () => withData(swapSplitData({ recipient: USDC })), "pays"],
      [
        "a wrapper that pays someone else",
        () => withData(propAmmSplitData({ recipient: USDC })),
        "pays"
      ],
      [
        "a floor below the quote",
        () => withData(swapSplitData({ minAmountOut: 397999999999999999n })),
        "floor"
      ],
      ["a different totalIn", () => withData(swapSplitData({ totalIn: 1000000001n })), "sells"],
      [
        "swapped tokens",
        () => withData(swapSplitData({ tokenIn: WETH, tokenOut: USDC })),
        "tokens do not match"
      ],
      [
        "an unknown selector",
        () => withData(`0xdeadbeef${swapSplitData().slice(10)}`),
        "does not decode"
      ],
      ["garbage data", () => withData("0x1234"), "does not decode"],
      ["an expired deadline", () => withData(swapSplitData({ deadline: 1n })), "deadline"],
      [
        "a makerSwap with a non-Bebop target",
        () => withData(makerSwapData({}, { target: lc(USDC) })),
        "Bebop"
      ],
      [
        "a makerSwap with a non-Bebop spender",
        () => withData(makerSwapData({}, { spender: lc(USDC) })),
        "Bebop"
      ],
      [
        "a maker leg larger than the amount sold",
        () => withData(makerSwapData({}, { amountIn: 1000000001n })),
        "Bebop"
      ],
      ["value on a token sell", () => withData(swapSplitData(), { value: "5" }), "sends value"],
      ["a different target", () => withData(swapSplitData(), { to: TAKER }), "targets"]
    ])("refuses %s", (_label, build, message) => {
      expect(() => verifyLcxCalldata(build(), quote, expected)).toThrow(message)
    })

    it("refuses a floor below the caller's minAmountOut even when it clears the quote", () => {
      expect(() =>
        verifyLcxCalldata(withData(swapSplitData()), quote, {
          ...expected,
          minAmountOut: "399000000000000000"
        })
      ).toThrow("floor")
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
