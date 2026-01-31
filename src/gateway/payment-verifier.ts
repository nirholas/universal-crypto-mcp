/**
 * x402 Payment Verifier
 * 
 * Verifies payment signatures and settlements via the facilitator
 */

interface PaymentPayload {
  scheme: string
  network: string
  payload: {
    from: string
    to: string
    amount: string
    token: string
    nonce: string
    validBefore: number
  }
  signature: string
}

interface VerificationOptions {
  expectedAmount: string
  expectedPayTo: string
  expectedNetwork: string
}

interface VerificationResult {
  valid: boolean
  reason?: string
  transactionHash?: string
  settledAt?: string
}

export class PaymentVerifier {
  private facilitatorUrl: string
  private cache: Map<string, { result: VerificationResult; expires: number }> = new Map()
  private cacheTTL = 300000 // 5 minutes

  constructor(facilitatorUrl: string) {
    this.facilitatorUrl = facilitatorUrl
  }

  /**
   * Verify a payment signature
   */
  async verify(
    payment: PaymentPayload,
    options: VerificationOptions
  ): Promise<VerificationResult> {
    // Check cache first
    const cacheKey = this.getCacheKey(payment)
    const cached = this.cache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      return cached.result
    }

    // Basic validation
    const basicValidation = this.validateBasic(payment, options)
    if (!basicValidation.valid) {
      return basicValidation
    }

    // Verify with facilitator
    try {
      const result = await this.verifyWithFacilitator(payment, options)
      
      // Cache successful verifications
      if (result.valid) {
        this.cache.set(cacheKey, {
          result,
          expires: Date.now() + this.cacheTTL,
        })
      }

      return result
    } catch (error) {
      console.error("Facilitator verification failed:", error)
      
      // Fallback to local signature verification
      return this.verifyLocally(payment, options)
    }
  }

  /**
   * Basic validation without network call
   */
  private validateBasic(
    payment: PaymentPayload,
    options: VerificationOptions
  ): VerificationResult {
    // Check scheme
    if (payment.scheme !== "exact") {
      return { valid: false, reason: "Unsupported payment scheme" }
    }

    // Check network
    if (payment.network !== options.expectedNetwork) {
      return {
        valid: false,
        reason: `Network mismatch: expected ${options.expectedNetwork}, got ${payment.network}`,
      }
    }

    // Check amount
    const paymentAmount = BigInt(payment.payload.amount)
    const expectedAmount = BigInt(options.expectedAmount)
    if (paymentAmount < expectedAmount) {
      return {
        valid: false,
        reason: `Insufficient payment: expected ${options.expectedAmount}, got ${payment.payload.amount}`,
      }
    }

    // Check recipient
    if (payment.payload.to.toLowerCase() !== options.expectedPayTo.toLowerCase()) {
      return {
        valid: false,
        reason: `Wrong recipient: expected ${options.expectedPayTo}, got ${payment.payload.to}`,
      }
    }

    // Check expiry
    if (payment.payload.validBefore < Date.now() / 1000) {
      return { valid: false, reason: "Payment signature expired" }
    }

    // Check signature exists
    if (!payment.signature || payment.signature.length < 130) {
      return { valid: false, reason: "Invalid signature format" }
    }

    return { valid: true }
  }

  /**
   * Verify with the facilitator service
   */
  private async verifyWithFacilitator(
    payment: PaymentPayload,
    options: VerificationOptions
  ): Promise<VerificationResult> {
    const response = await fetch(`${this.facilitatorUrl}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment,
        requirements: {
          amount: options.expectedAmount,
          payTo: options.expectedPayTo,
          network: options.expectedNetwork,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { valid: false, reason: `Facilitator error: ${error}` }
    }

    const result = await response.json()
    return {
      valid: result.valid === true,
      reason: result.reason,
      transactionHash: result.transactionHash,
      settledAt: result.settledAt,
    }
  }

  /**
   * Local signature verification (fallback)
   */
  private async verifyLocally(
    payment: PaymentPayload,
    options: VerificationOptions
  ): Promise<VerificationResult> {
    try {
      // Import viem for signature verification
      const { verifyTypedData } = await import("viem")
      const { base } = await import("viem/chains")

      // EIP-3009 TransferWithAuthorization typed data
      const domain = {
        name: "USD Coin",
        version: "2",
        chainId: 8453, // Base
        verifyingContract: payment.payload.token as `0x${string}`,
      }

      const types = {
        TransferWithAuthorization: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "validAfter", type: "uint256" },
          { name: "validBefore", type: "uint256" },
          { name: "nonce", type: "bytes32" },
        ],
      }

      const message = {
        from: payment.payload.from as `0x${string}`,
        to: payment.payload.to as `0x${string}`,
        value: BigInt(payment.payload.amount),
        validAfter: 0n,
        validBefore: BigInt(payment.payload.validBefore),
        nonce: payment.payload.nonce as `0x${string}`,
      }

      const valid = await verifyTypedData({
        address: payment.payload.from as `0x${string}`,
        domain,
        types,
        primaryType: "TransferWithAuthorization",
        message,
        signature: payment.signature as `0x${string}`,
      })

      if (valid) {
        return {
          valid: true,
          reason: "Verified locally (facilitator unavailable)",
        }
      } else {
        return { valid: false, reason: "Invalid signature" }
      }
    } catch (error) {
      console.error("Local verification failed:", error)
      return { valid: false, reason: "Verification failed" }
    }
  }

  /**
   * Request settlement from facilitator
   */
  async settle(payment: PaymentPayload): Promise<VerificationResult> {
    try {
      const response = await fetch(`${this.facilitatorUrl}/settle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment }),
      })

      if (!response.ok) {
        const error = await response.text()
        return { valid: false, reason: `Settlement failed: ${error}` }
      }

      const result = await response.json()
      return {
        valid: result.success === true,
        transactionHash: result.transactionHash,
        settledAt: result.settledAt,
      }
    } catch (error) {
      console.error("Settlement request failed:", error)
      return { valid: false, reason: "Settlement request failed" }
    }
  }

  /**
   * Generate cache key for a payment
   */
  private getCacheKey(payment: PaymentPayload): string {
    return `${payment.payload.from}:${payment.payload.nonce}:${payment.signature.slice(-16)}`
  }

  /**
   * Clear verification cache
   */
  clearCache() {
    this.cache.clear()
  }
}
