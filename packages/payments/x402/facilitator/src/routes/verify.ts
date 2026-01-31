/**
 * Payment Verification Route
 * 
 * POST /verify - Verify on-chain payment transactions
 */

import { Router, type Request, type Response } from 'express';
import type { Address } from 'viem';
import { parseUnits } from 'viem';
import type { ArbitrumClient } from '../services/arbitrum.js';
import type { PaymentCache } from '../services/cache.js';
import type { FeeService } from '../services/fees.js';
import type { VerifyRequest, VerifyResponse, ErrorResponse } from '../types.js';
import { logger } from '../middleware/logger.js';
import { createVerificationRateLimiter } from '../middleware/rateLimit.js';
import { recordVerification } from '../services/metrics.js';

/**
 * Create verification router
 */
export function createVerifyRouter(
  arbitrumClient: ArbitrumClient,
  paymentCache: PaymentCache,
  feeService: FeeService
): Router {
  const router = Router();

  // Apply rate limiting
  router.use(createVerificationRateLimiter());

  /**
   * POST /verify - Verify payment transaction
   */
  router.post('/', async (req: Request, res: Response) => {
    const body = req.body as Partial<VerifyRequest>;

    // Validate required fields
    if (!body.txHash) {
      return res.status(400).json({
        error: 'Missing required field: txHash',
        code: 'MISSING_TX_HASH',
      } satisfies ErrorResponse);
    }

    if (!body.paymentRequest) {
      return res.status(400).json({
        error: 'Missing required field: paymentRequest',
        code: 'MISSING_PAYMENT_REQUEST',
      } satisfies ErrorResponse);
    }

    const { txHash, paymentRequest } = body;

    // Validate txHash format
    if (!txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
      return res.status(400).json({
        error: 'Invalid transaction hash format',
        code: 'INVALID_TX_HASH',
      } satisfies ErrorResponse);
    }

    // Validate payment request
    if (!paymentRequest.price || !paymentRequest.recipient || !paymentRequest.token) {
      return res.status(400).json({
        error: 'Invalid payment request: missing price, recipient, or token',
        code: 'INVALID_PAYMENT_REQUEST',
      } satisfies ErrorResponse);
    }

    logger.info('Verifying payment', {
      txHash,
      amount: paymentRequest.price,
      token: paymentRequest.token,
      recipient: paymentRequest.recipient,
    });

    const startTime = Date.now();

    try {
      // Check cache first
      const cached = paymentCache.get(txHash);
      if (cached?.verified) {
        logger.info('Payment verified (cached)', { txHash });
        recordVerification({
          network: paymentRequest.chain || 'arbitrum',
          token: paymentRequest.token,
          success: true,
          durationMs: Date.now() - startTime,
        });
        return res.json({
          verified: true,
          txHash,
          timestamp: cached.timestamp,
          blockNumber: cached.blockNumber,
        } satisfies VerifyResponse);
      }

      // Verify on-chain
      const result = await arbitrumClient.verifyTransfer(
        txHash as `0x${string}`,
        paymentRequest.recipient as Address,
        paymentRequest.price,
        paymentRequest.token
      );

      if (result.verified) {
        // Calculate and record fee (0.1% platform fee)
        const decimals = paymentRequest.token === 'USDC' || paymentRequest.token === 'USDT' ? 6 : 18;
        const amountBigInt = parseUnits(paymentRequest.price, decimals);
        const feeCalc = feeService.calculateFee(amountBigInt, result.from as Address, decimals);
        
        // Record the fee
        const feeRecord = feeService.recordFee({
          paymentId: txHash,
          payer: result.from as Address,
          payee: paymentRequest.recipient as Address,
          grossAmount: feeCalc.grossAmount,
          feeAmount: feeCalc.feeAmount,
          network: paymentRequest.chain || 'arbitrum',
          token: paymentRequest.token,
          txHash,
          decimals,
        });

        // Cache the verified payment
        paymentCache.set(txHash, {
          txHash,
          verified: true,
          settled: false,
          amount: paymentRequest.price,
          token: paymentRequest.token,
          to: paymentRequest.recipient as Address,
          from: result.from as Address,
          feeRecordId: feeRecord.id,
          timestamp: Date.now(),
          blockNumber: result.blockNumber,
        });

        logger.info('Payment verified with fee', { 
          txHash, 
          blockNumber: result.blockNumber,
          feeAmount: feeRecord.feeAmount,
          feePercent: feeRecord.feePercent,
        });

        recordVerification({
          network: paymentRequest.chain || 'arbitrum',
          token: paymentRequest.token,
          success: true,
          durationMs: Date.now() - startTime,
        });

        return res.json({
          verified: true,
          txHash,
          timestamp: Date.now(),
          blockNumber: result.blockNumber,
          confirmations: result.confirmations,
        } satisfies VerifyResponse);
      }

      // Payment not verified
      logger.warn('Payment verification failed', { txHash, error: result.error });
      recordVerification({
        network: paymentRequest.chain || 'arbitrum',
        token: paymentRequest.token,
        success: false,
        durationMs: Date.now() - startTime,
      });
      return res.status(400).json({
        verified: false,
        txHash,
        timestamp: Date.now(),
        error: result.error || 'Payment verification failed',
      } satisfies VerifyResponse);
    } catch (error) {
      logger.error('Error verifying payment', { error, txHash });
      recordVerification({
        network: paymentRequest.chain || 'arbitrum',
        token: paymentRequest.token,
        success: false,
        durationMs: Date.now() - startTime,
      });
      return res.status(500).json({
        error: 'Internal server error during verification',
        code: 'VERIFICATION_ERROR',
        details: String(error),
      } satisfies ErrorResponse);
    }
  });

  return router;
}
