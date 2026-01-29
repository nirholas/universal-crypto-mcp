# MCP Blockchain Web DApp

This is the web application component of the MCP Blockchain Server & DApp system. It provides a user interface for reviewing and approving blockchain transactions prepared by AI assistants.

## Key Features

- Connect your wallet (MetaMask, WalletConnect, etc.)
- Review transaction details before signing
- Sign and submit transactions securely
- Track transaction status
- View transaction history

## Architecture

The web app is built with:

- React with TypeScript
- Material-UI for components
- Ethers.js for blockchain integration
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser with a wallet extension (like MetaMask)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env` file with the following:

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

The app will be available at [http://localhost:3001](http://localhost:3001).

## Usage

### Transaction Approval Flow

1. The AI assistant prepares a transaction using the MCP Server API
2. The server returns a unique URL for the transaction
3. The user opens the URL in their browser
4. The web app displays the transaction details
5. The user connects their wallet
6. The user reviews and signs the transaction
7. The web app submits the signed transaction to the blockchain
8. The transaction status is updated in real-time

### Supported Networks

- Ethereum Mainnet
- Sepolia Testnet
- Polygon Mainnet
- Polygon Mumbai Testnet

Additional networks can be added by updating the chain configuration.

## Security Considerations

- Private keys never leave the user's wallet
- All transaction details are displayed for review before signing
- Secure HTTPS communication with the backend
- Input validation for all user inputs
- Clear error messages and status updates

## Development

### Folder Structure

- `src/components` - React components
- `src/hooks` - Custom React hooks (including wallet integration)
- `src/services` - API and blockchain services
- `src/pages` - Page components
- `src/utils` - Utility functions
- `src/context` - React context providers

### Building for Production

```bash
npm run build
# or
yarn build
```

The built app will be available in the `build` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
