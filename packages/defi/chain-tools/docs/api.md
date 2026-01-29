# API Documentation

This document outlines the API endpoints and interfaces for the MCP Blockchain Server.

## Authentication

All API endpoints require authentication using JWT tokens. To obtain a token, you must first authenticate with your API key.

```http
POST /api/auth/login
Content-Type: application/json

{
  "apiKey": "your-api-key"
}
```

Response:

```json
{
  "token": "your-jwt-token"
}
```

All subsequent requests should include this token in the Authorization header:

```http
Authorization: Bearer your-jwt-token
```

## API Endpoints

### Chains

#### List Supported Chains

```http
GET /api/v1/chains
```

Response:

```json
{
  "chains": [
    {
      "id": "1",
      "name": "Ethereum Mainnet",
      "currency": "ETH",
      "rpcUrl": "https://mainnet.infura.io/v3/..."
    },
    {
      "id": "137",
      "name": "Polygon",
      "currency": "MATIC",
      "rpcUrl": "https://polygon-rpc.com"
    }
  ]
}
```

#### Get Account Balance

```http
GET /api/v1/chains/{chainId}/balance/{address}
```

Response:

```json
{
  "address": "0x...",
  "balance": "1.234567890",
  "currency": "ETH"
}
```

#### Read Contract

```http
GET /api/v1/chains/{chainId}/contract/{address}/read
```

Query Parameters:

- `method`: Contract method to call
- `args`: Comma-separated list of arguments

Response:

```json
{
  "result": "..."
}
```

### Transactions

#### Prepare Transaction

```http
POST /api/v1/transaction/prepare
Content-Type: application/json

{
  "chainId": "1",
  "from": "0x...",
  "to": "0x...",
  "value": "0.1",
  "data": "0x...",
  "gasLimit": "21000"
}
```

Response:

```json
{
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "url": "https://app.example.com/tx/123e4567-e89b-12d3-a456-426614174000"
}
```

#### Get Transaction

```http
GET /api/v1/transaction/{uuid}
```

Response:

```json
{
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "chainId": "1",
  "from": "0x...",
  "to": "0x...",
  "value": "0.1",
  "data": "0x...",
  "gasLimit": "21000",
  "status": "pending"
}
```

#### Submit Transaction

```http
POST /api/v1/transaction/{uuid}/submit
Content-Type: application/json

{
  "signedTransaction": "0x..."
}
```

Response:

```json
{
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "status": "submitted",
  "txHash": "0x..."
}
```

### User

#### Get User Profile

```http
GET /api/v1/user/profile
```

Response:

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name"
}
```

#### Get User Transactions

```http
GET /api/v1/user/transactions
```

Response:

```json
{
  "transactions": [
    {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "chainId": "1",
      "to": "0x...",
      "value": "0.1",
      "status": "confirmed",
      "txHash": "0x...",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

## Error Handling

Errors are returned as JSON objects with the following structure:

```json
{
  "error": {
    "code": "error-code",
    "message": "Error message"
  }
}
```

### Common Error Codes

- `auth/invalid-api-key`: Invalid API key
- `auth/invalid-token`: Invalid JWT token
- `auth/expired-token`: Expired JWT token
- `blockchain/invalid-chain`: Invalid chain ID
- `blockchain/invalid-address`: Invalid address
- `blockchain/invalid-transaction`: Invalid transaction
- `transaction/not-found`: Transaction not found
- `transaction/already-submitted`: Transaction already submitted
