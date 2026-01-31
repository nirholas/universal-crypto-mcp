/**
 * Request and Error Logging Middleware
 */

import { Request, Response, NextFunction } from 'express';
import Logger from './logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string || `req-${Date.now()}`;
  
  // Add request ID to request
  (req as any).requestId = requestId;
  
  // Log request
  Logger.info({
    type: 'request',
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    Logger.info({
      type: 'response',
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
    });
  });

  next();
}

export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction): void {
  const requestId = (req as any).requestId || 'unknown';
  
  Logger.error({
    type: 'error',
    requestId,
    method: req.method,
    path: req.path,
    error: {
      message: err.message,
      name: err.name,
      stack: err.stack,
    },
  });

  next(err);
}
