import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from '../context/index.js';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof Error ? error.cause.message : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure middleware
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { ...ctx, user: ctx.user },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
