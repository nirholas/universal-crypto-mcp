import { router, publicProcedure, protectedProcedure } from '../procedures/index.js';
import { z } from 'zod';

export const appRouter = router({
  // Public procedures
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),

  // Crypto price lookup
  getPrice: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input }) => {
      // Replace with real API call
      return {
        symbol: input.symbol.toUpperCase(),
        price: Math.random() * 50000,
        change24h: (Math.random() - 0.5) * 10,
      };
    }),

  // Protected mutation example
  createOrder: protectedProcedure
    .input(z.object({
      symbol: z.string(),
      side: z.enum(['buy', 'sell']),
      amount: z.number().positive(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Implement order creation
      return {
        orderId: crypto.randomUUID(),
        ...input,
        userId: ctx.user?.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }),

  // List operations with pagination
  listTransactions: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // Implement pagination
      return {
        items: [],
        nextCursor: null,
      };
    }),
});

export type AppRouter = typeof appRouter;
