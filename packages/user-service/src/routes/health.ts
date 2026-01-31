import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

healthRouter.get('/ready', (req, res) => {
  // Add database/redis connection checks here
  res.json({ status: 'ready' });
});

healthRouter.get('/live', (req, res) => {
  res.json({ status: 'alive' });
});
