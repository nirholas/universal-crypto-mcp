/**
 * Fee Management Routes
 * 
 * API endpoints for fee statistics, tier information, and management.
 * 
 * @author nich
 * @license MIT
 */

import { Router, type Request, type Response } from 'express';
import { type Address } from 'viem';
import { type FeeService } from '../services/fees.js';
import { logger } from '../middleware/logger.js';

/**
 * Create fee management router
 */
export function createFeesRouter(feeService: FeeService): Router {
  const router = Router();

  /**
   * GET /fees/stats
   * Get overall fee statistics
   */
  router.get('/stats', async (_req: Request, res: Response) => {
    try {
      const stats = feeService.getStats();
      res.json({
        success: true,
        data: stats,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Error getting fee stats', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to get fee statistics',
      });
    }
  });

  /**
   * GET /fees/recent
   * Get recent fee records
   */
  router.get('/recent', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const fees = feeService.getRecentFees(limit);
      
      res.json({
        success: true,
        data: fees,
        count: fees.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Error getting recent fees', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to get recent fees',
      });
    }
  });

  /**
   * GET /fees/tier/:address
   * Get fee tier information for a payer
   */
  router.get('/tier/:address', async (req: Request, res: Response) => {
    try {
      const address = req.params.address as Address;
      
      if (!address || !address.startsWith('0x')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid address',
        });
      }

      const tierInfo = feeService.getTierInfo(address);
      
      res.json({
        success: true,
        data: {
          address,
          currentTier: tierInfo.currentTier.name,
          feePercent: tierInfo.currentTier.basisPoints / 100,
          monthlyVolume: tierInfo.volume,
          nextTier: tierInfo.nextTier?.name,
          volumeToNextTier: tierInfo.volumeToNextTier,
          nextTierFeePercent: tierInfo.nextTier 
            ? tierInfo.nextTier.basisPoints / 100 
            : undefined,
        },
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Error getting tier info', { error, address: req.params.address });
      res.status(500).json({
        success: false,
        error: 'Failed to get tier information',
      });
    }
  });

  /**
   * GET /fees/tiers
   * Get all available fee tiers
   */
  router.get('/tiers', async (_req: Request, res: Response) => {
    try {
      // Access the fee tiers from the service
      const tiers = [
        { name: 'standard', minMonthlyVolume: '0', feePercent: 0.10 },
        { name: 'silver', minMonthlyVolume: '10000', feePercent: 0.08 },
        { name: 'gold', minMonthlyVolume: '100000', feePercent: 0.06 },
        { name: 'platinum', minMonthlyVolume: '1000000', feePercent: 0.04 },
      ];
      
      res.json({
        success: true,
        data: tiers,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Error getting fee tiers', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to get fee tiers',
      });
    }
  });

  /**
   * GET /fees/calculate
   * Calculate fee for a given amount
   */
  router.get('/calculate', async (req: Request, res: Response) => {
    try {
      const amount = req.query.amount as string;
      const payer = req.query.payer as Address | undefined;
      const decimals = parseInt(req.query.decimals as string) || 6;

      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required',
        });
      }

      // Parse amount (support both raw and decimal)
      let amountBigInt: bigint;
      if (amount.includes('.')) {
        const [whole, decimal] = amount.split('.');
        const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
        amountBigInt = BigInt(whole + paddedDecimal);
      } else {
        amountBigInt = BigInt(amount);
      }

      const calculation = feeService.calculateFee(amountBigInt, payer, decimals);

      res.json({
        success: true,
        data: {
          grossAmount: calculation.grossAmount.toString(),
          feeAmount: calculation.feeAmount.toString(),
          netAmount: calculation.netAmount.toString(),
          feePercent: calculation.feePercent,
          tierName: calculation.tierName,
        },
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Error calculating fee', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to calculate fee',
      });
    }
  });

  /**
   * GET /fees/unsettled
   * Get unsettled fees (admin only - requires auth in production)
   */
  router.get('/unsettled', async (_req: Request, res: Response) => {
    try {
      const unsettled = feeService.getUnsettledFees();
      
      res.json({
        success: true,
        data: unsettled,
        count: unsettled.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Error getting unsettled fees', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to get unsettled fees',
      });
    }
  });

  return router;
}
