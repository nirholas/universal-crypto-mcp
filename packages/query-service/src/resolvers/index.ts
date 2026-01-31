import { DateTimeResolver, BigIntResolver } from 'graphql-scalars';

export const resolvers = {
  DateTime: DateTimeResolver,
  BigInt: BigIntResolver,

  Query: {
    health: () => ({
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
    }),

    cryptoPrice: async (_: unknown, { symbol }: { symbol: string }) => ({
      symbol: symbol.toUpperCase(),
      price: Math.random() * 50000,
      change24h: (Math.random() - 0.5) * 10,
      volume24h: Math.random() * 1000000000,
      marketCap: BigInt(Math.floor(Math.random() * 1000000000000)),
      lastUpdated: new Date(),
    }),

    cryptoPrices: async (_: unknown, { symbols }: { symbols: string[] }) => 
      symbols.map(symbol => ({
        symbol: symbol.toUpperCase(),
        price: Math.random() * 50000,
        change24h: (Math.random() - 0.5) * 10,
        volume24h: Math.random() * 1000000000,
        marketCap: BigInt(Math.floor(Math.random() * 1000000000000)),
        lastUpdated: new Date(),
      })),

    wallet: async (_: unknown, { address }: { address: string }) => ({
      address,
      balance: Math.random() * 100,
      network: 'ethereum',
      tokens: [
        { symbol: 'USDC', balance: 1000, value: 1000 },
        { symbol: 'WETH', balance: 0.5, value: 1500 },
      ],
    }),

    transactions: async () => ({
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: 0,
    }),
  },

  Mutation: {
    createOrder: async (_: unknown, { input }: { input: any }) => ({
      id: crypto.randomUUID(),
      ...input,
      price: input.price || Math.random() * 50000,
      status: 'PENDING',
      createdAt: new Date(),
    }),

    cancelOrder: async (_: unknown, { orderId }: { orderId: string }) => ({
      id: orderId,
      symbol: 'BTC',
      side: 'BUY',
      amount: 0.1,
      price: 45000,
      status: 'CANCELLED',
      createdAt: new Date(),
    }),
  },
};
