export const typeDefs = `#graphql
  scalar DateTime
  scalar BigInt

  type Query {
    health: HealthStatus!
    cryptoPrice(symbol: String!): CryptoPrice
    cryptoPrices(symbols: [String!]!): [CryptoPrice!]!
    wallet(address: String!): Wallet
    transactions(address: String!, first: Int, after: String): TransactionConnection!
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    cancelOrder(orderId: ID!): Order!
  }

  type Subscription {
    priceUpdated(symbol: String!): CryptoPrice!
    newTransaction(address: String!): Transaction!
  }

  type HealthStatus {
    status: String!
    timestamp: DateTime!
    uptime: Float!
  }

  type CryptoPrice {
    symbol: String!
    price: Float!
    change24h: Float!
    volume24h: Float!
    marketCap: BigInt!
    lastUpdated: DateTime!
  }

  type Wallet {
    address: String!
    balance: Float!
    network: String!
    tokens: [TokenBalance!]!
  }

  type TokenBalance {
    symbol: String!
    balance: Float!
    value: Float!
  }

  type Transaction {
    id: ID!
    hash: String!
    from: String!
    to: String!
    value: Float!
    status: TransactionStatus!
    timestamp: DateTime!
  }

  type TransactionConnection {
    edges: [TransactionEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type TransactionEdge {
    node: Transaction!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type Order {
    id: ID!
    symbol: String!
    side: OrderSide!
    amount: Float!
    price: Float!
    status: OrderStatus!
    createdAt: DateTime!
  }

  enum TransactionStatus {
    PENDING
    CONFIRMED
    FAILED
  }

  enum OrderSide {
    BUY
    SELL
  }

  enum OrderStatus {
    PENDING
    FILLED
    PARTIAL
    CANCELLED
  }

  input CreateOrderInput {
    symbol: String!
    side: OrderSide!
    amount: Float!
    price: Float
  }
`;
