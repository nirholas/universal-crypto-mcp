import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import DataLoader from 'dataloader';

export interface User {
  id: string;
  email: string;
}

export interface Context {
  user: User | null;
  dataloaders: {
    priceLoader: DataLoader<string, any>;
  };
}

export const createContext = async ({
  req,
}: ExpressContextFunctionArgument): Promise<Context> => {
  // Extract user from token
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user: User | null = null;

  if (token) {
    // Verify token and get user
  }

  // Create dataloaders for batching
  const priceLoader = new DataLoader<string, any>(async (symbols) => {
    // Batch fetch prices
    return symbols.map(symbol => ({
      symbol,
      price: Math.random() * 50000,
    }));
  });

  return {
    user,
    dataloaders: { priceLoader },
  };
};
