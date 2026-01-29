# MCP Blockchain Server & DApp

A secure system enabling AI assistants to interact with blockchain smart contracts while ensuring users maintain complete control over their private keys and transaction signing.

## Overview

This project addresses a key challenge in AI-blockchain integration: allowing AI assistants to read blockchain data and prepare transactions while ensuring users maintain exclusive control over transaction signing and private keys.

The system consists of:

1. **MCP Server**: A Model Context Protocol server that exposes blockchain operations as tools that can be used by AI assistants
2. **Web DApp**: A React application that provides a user interface for wallet connection and transaction signing
3. **Database**: PostgreSQL database for storing users, API keys, and transaction records
4. **Caching**: Redis for caching frequently accessed data

## Features

### MCP Server Features

- **Blockchain Data Access**: Read balances, contract state, and other on-chain data
- **Transaction Preparation**: Create unsigned transactions for user approval
- **Multi-Chain Support**: Works with Ethereum, Polygon, and other EVM-compatible chains
- **Smart Contract Interaction**: Read from verified smart contracts on supported networks
- **Security-First Design**: Private keys never leave the user's wallet

### Web DApp Features

- **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- **Transaction Review**: Clear UI for reviewing transaction details before signing
- **Transaction Signing**: Sign transactions with connected wallet
- **Transaction Tracking**: Monitor status of submitted transactions
- **Mobile Compatibility**: Responsive design works on all devices

## Security Principles

1. **Private Key Isolation**: Keys never leave the user's wallet
2. **Transaction Verification**: Clear UI for reviewing transaction details
3. **API Authentication**: Secure API key management
4. **Rate Limiting**: Prevent abuse
5. **Input Validation**: Sanitize all inputs
6. **Audit Logging**: Track all operations
7. **HTTPS Only**: Secure communications
8. **Content Security Policy**: Prevent XSS

## Transaction Flow

1. AI assistant requests transaction through MCP Server
2. MCP Server prepares unsigned transaction with UUID
3. MCP Server returns transaction URL to AI assistant
4. AI assistant provides URL to user
5. User opens URL in browser
6. User connects wallet and reviews transaction details
7. User approves and signs transaction with their wallet
8. Web DApp submits signed transaction to blockchain
9. Transaction status is updated and tracked

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Redis (optional, for caching)
- Infura API key (for blockchain access)
- Etherscan API key (for contract ABIs)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zhangzhongnan928/mcp-blockchain-server.git
cd mcp-blockchain-server
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Set up the database:
```bash
# For detailed instructions, see the Database Setup Guide
# docs/database-setup.md

# Create the PostgreSQL database
createdb mcp_blockchain

# Run database migrations
npm run db:migrate
# or
yarn db:migrate
```

See [Database Setup Guide](docs/database-setup.md) for detailed instructions on installing and configuring PostgreSQL.

5. Start the server:
```bash
npm run dev
# or
yarn dev
```

### Using Docker Compose

For a quick start using Docker:

```bash
# Create .env file with required environment variables
cp .env.example .env
# Edit .env with your configurations

# Start the services
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- MCP Server
- Web DApp

## Development

### Server Structure

- `src/mcp`: MCP server implementation
- `src/services`: Core business logic services
- `src/utils`: Utility functions
- `src/index.ts`: Main entry point

### Web DApp Structure

- `web/src/components`: React components
- `web/src/hooks`: Custom React hooks
- `web/src/services`: API services
- `web/src/pages`: Page components

## Using the MCP Server

The MCP Server exposes several tools that can be used by AI assistants:

- `get-chains`: Get list of supported blockchain networks
- `get-balance`: Get account balance for an address
- `read-contract`: Read data from a smart contract
- `prepare-transaction`: Prepare an unsigned transaction for user approval
- `get-transaction-status`: Get the current status of a transaction

### Example Tool Usage

```typescript
// Example of using the get-balance tool
const result = await callTool("get-balance", {
  chainId: "1",
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
});
```

## Troubleshooting

If you encounter issues with dependencies:

```bash
# MCP SDK issue - install directly from GitHub
npm uninstall @modelcontextprotocol/sdk
npm install modelcontextprotocol/typescript-sdk
```

For database connection issues, see the [Database Setup Guide](docs/database-setup.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
