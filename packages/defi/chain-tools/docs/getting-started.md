# Getting Started

This guide will help you set up and run the MCP Blockchain Server & DApp system.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Redis (optional, for caching)

## Installation

### Clone the Repository

```bash
git clone https://github.com/zhangzhongnan928/mcp-blockchain-server.git
cd mcp-blockchain-server
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgres://username:password@localhost:5432/mcp_blockchain

# Redis (optional)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d

# Blockchain
INFURA_API_KEY=your-infura-api-key
ETHERSCAN_API_KEY=your-etherscan-api-key

# Web DApp
WEB_DAPP_URL=http://localhost:3001
```

### Set Up Database

```bash
npm run db:migrate
# or
yarn db:migrate
```

## Running the Server

### Development

```bash
npm run dev
# or
yarn dev
```

The server will be available at http://localhost:3000.

### Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Using Docker

### Build the Docker Image

```bash
docker build -t mcp-blockchain-server .
```

### Run the Docker Container

```bash
docker run -p 3000:3000 --env-file .env mcp-blockchain-server
```

## Web DApp

The Web DApp is located in the `web` directory.

### Install Dependencies

```bash
cd web
npm install
# or
yarn install
```

### Set Up Environment Variables

Create a `.env` file in the `web` directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_INFURA_ID=your-infura-id
```

### Run the Web DApp

```bash
npm run dev
# or
yarn dev
```

The Web DApp will be available at http://localhost:3001.

## Testing

### Run Tests

```bash
npm test
# or
yarn test
```

### Run Lint

```bash
npm run lint
# or
yarn lint
```

## API Documentation

API documentation is available at http://localhost:3000/api/docs when the server is running in development mode.

## Next Steps

- Review the [Architecture Documentation](architecture.md)
- Check out the [API Documentation](api.md)
- Learn about [Security Considerations](security.md)
