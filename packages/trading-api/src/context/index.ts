import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Context {
  user: User | null;
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
}

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> => {
  // Extract user from JWT token
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user: User | null = null;

  if (token) {
    try {
      // Verify and decode JWT - implement your logic
      // user = await verifyToken(token);
    } catch {
      // Invalid token
    }
  }

  return { user, req, res };
};
