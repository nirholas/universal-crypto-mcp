import { Router } from 'express';

export const apiRouter = Router();

// Example endpoints - extend as needed
apiRouter.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api/v1/docs',
    },
  });
});

// Add more route modules here
// apiRouter.use('/users', usersRouter);
// apiRouter.use('/auth', authRouter);
// apiRouter.use('/crypto', cryptoRouter);
