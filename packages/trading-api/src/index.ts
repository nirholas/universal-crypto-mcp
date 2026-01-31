import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter, type AppRouter } from './routers/index.js';
import { createContext } from './context/index.js';

const app = express();

app.use(cors());

// tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = parseInt(process.env.PORT || '3004', 10);
app.listen(PORT, () => {
  console.log(`🚀 tRPC server running on port ${PORT}`);
  console.log(`📝 tRPC endpoint: http://localhost:${PORT}/trpc`);
});

// Export types for frontend
export type { AppRouter };
