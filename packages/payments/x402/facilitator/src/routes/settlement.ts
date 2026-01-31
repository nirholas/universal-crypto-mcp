/**
 * Fee Settlement Routes
 * 
 * Admin API for managing fee settlement and withdrawal.
 * 
 * @author nich
 * @license MIT
 */

import { type Router } from 'express';
import { z } from 'zod';
import { type FeeSettlementService } from '../services/settlement.js';
import { validateRequest } from '../middleware/validator.js';
import { logger } from '../middleware/logger.js';

/**
 * Request schemas
 */
const SettleAllSchema = z.object({
  adminKey: z.string().min(1),
});

const SettleNetworkSchema = z.object({
  adminKey: z.string().min(1),
  network: z.string(),
  token: z.string(),
});

/**
 * Create settlement routes
 */
export function createSettlementRoutes(settlementService: FeeSettlementService): Router {
  const router = require('express').Router() as Router;

  // Admin key from environment
  const ADMIN_KEY = process.env.ADMIN_KEY;
  if (!ADMIN_KEY) {
    logger.warn('ADMIN_KEY not set - settlement endpoints disabled');
  }

  /**
   * Validate admin key middleware
   */
  const requireAdmin = (req: any, res: any, next: any) => {
    const { adminKey } = req.body || req.query;
    
    if (!ADMIN_KEY) {
      return res.status(503).json({
        error: 'Settlement endpoints not configured',
        message: 'ADMIN_KEY environment variable not set',
      });
    }

    if (adminKey !== ADMIN_KEY) {
      logger.warn('Unauthorized settlement attempt', {
        ip: req.ip,
        path: req.path,
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid admin key',
      });
    }

    next();
  };

  /**
   * GET /settlement/pending
   * Get pending fees ready for settlement
   */
  router.get('/pending', async (req, res) => {
    try {
      const pending = await settlementService.getPendingFees();
      
      const summary = pending.map(p => ({
        network: p.network,
        token: p.token,
        totalAmount: p.totalAmount.toString(),
        feeCount: p.feeIds.length,
        payerCount: p.payerAmounts.size,
      }));

      res.json({
        pending: summary,
        shouldSettle: await settlementService.shouldSettle(),
      });
    } catch (error) {
      logger.error('Error fetching pending fees', { error });
      res.status(500).json({
        error: 'Failed to fetch pending fees',
        message: String(error),
      });
    }
  });

  /**
   * POST /settlement/settle-all
   * Settle all pending fees across networks (requires admin key)
   */
  router.post(
    '/settle-all',
    validateRequest(SettleAllSchema),
    requireAdmin,
    async (req, res) => {
      try {
        logger.info('Manual settlement triggered', { ip: req.ip });
        
        const results = await settlementService.settleAll();
        
        res.json({
          success: true,
          results,
          summary: {
            totalSettlements: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
          },
        });
      } catch (error) {
        logger.error('Settlement failed', { error });
        res.status(500).json({
          error: 'Settlement failed',
          message: String(error),
        });
      }
    }
  );

  /**
   * POST /settlement/settle-network
   * Settle fees for a specific network and token (requires admin key)
   */
  router.post(
    '/settle-network',
    validateRequest(SettleNetworkSchema),
    requireAdmin,
    async (req, res) => {
      try {
        const { network, token } = req.body;
        
        logger.info('Network settlement triggered', { network, token, ip: req.ip });
        
        const result = await settlementService.settleNetwork(network, token);
        
        res.json({
          success: result.success,
          result,
        });
      } catch (error) {
        logger.error('Network settlement failed', { error });
        res.status(500).json({
          error: 'Network settlement failed',
          message: String(error),
        });
      }
    }
  );

  /**
   * GET /settlement/history
   * Get settlement history
   */
  router.get('/history', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
      const history = settlementService.getSettlementHistory(limit);
      
      res.json({ history });
    } catch (error) {
      logger.error('Error fetching settlement history', { error });
      res.status(500).json({
        error: 'Failed to fetch settlement history',
        message: String(error),
      });
    }
  });

  /**
   * GET /settlement/stats
   * Get settlement statistics
   */
  router.get('/stats', async (req, res) => {
    try {
      const stats = settlementService.getStats();
      res.json(stats);
    } catch (error) {
      logger.error('Error fetching settlement stats', { error });
      res.status(500).json({
        error: 'Failed to fetch settlement stats',
        message: String(error),
      });
    }
  });

  return router;
}
