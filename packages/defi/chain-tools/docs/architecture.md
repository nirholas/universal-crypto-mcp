# Architecture Overview

This document outlines the high-level architecture of the MCP Blockchain Server & DApp system.

## System Components

### MCP Server (Cloud)

The MCP Server is a Node.js application that handles blockchain read operations and transaction preparation. It exposes an API that AI assistants can use to interact with blockchain data and prepare transactions for user approval.

**Key Responsibilities:**

- Reading blockchain data (balances, contract state, etc.)
- Preparing unsigned transactions
- Generating unique transaction IDs
- Managing API authentication
- Maintaining transaction state

### Web DApp

The Web DApp is a React application that provides a user interface for wallet connection and transaction approval. It connects to the MCP Server API and allows users to review and sign transactions using their own wallets.

**Key Responsibilities:**

- Wallet connection (via Web3Modal)
- Transaction review and approval
- Transaction signing
- Transaction submission
- User management

### AI Integration

The AI Integration layer provides an API and SDK for AI assistants to use the MCP Server. It allows AI assistants to read blockchain data and prepare transactions for user approval.

**Key Responsibilities:**

- API authentication
- API rate limiting
- Standardized blockchain operations
- Transaction preparation

## Transaction Flow

### Read Operations

1. AI queries MCP Server API directly
2. MCP Server retrieves blockchain data
3. MCP Server returns data to AI

### Write Operations

1. AI requests transaction through MCP Server
2. MCP Server prepares unsigned transaction with UUID
3. MCP Server returns transaction URL to AI
4. AI provides URL to user
5. User opens URL in browser
6. Web DApp prompts user to connect wallet
7. Web DApp displays transaction details for review
8. User approves and signs with their wallet
9. Web DApp submits signed transaction to blockchain
10. Transaction status is updated and recorded

## Data Flow Diagram

```
┌────────────┐      ┌───────────────┐      ┌──────────────┐
│            │      │               │      │              │
│     AI     │◄────►│   MCP Server  │◄────►│   Web DApp   │
│ Assistant  │      │               │      │              │
└────────────┘      └───────────────┘      └──────────┬───┘
                                                      │
                                                      ▼
                                            ┌──────────────┐
                                            │              │
                                            │  Blockchain  │
                                            │              │
                                            └──────────────┘
```

## Security Considerations

See [Security](security.md) document for detailed security considerations.

## Technology Stack

### MCP Server

- Node.js with Express
- PostgreSQL for users, Redis for caching
- ethers.js or Web3.js for blockchain integration
- JWT for API authentication

### Web DApp

- React with TypeScript
- Web3Modal or Rainbow Kit for wallet integration
- Redux or Context API for state management
- Tailwind CSS for styling
