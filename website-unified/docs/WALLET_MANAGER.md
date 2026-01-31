# Universal Wallet Manager

Enterprise-grade multi-chain wallet management system supporting 60+ networks across EVM and Solana ecosystems.

## 🎯 Features

### Multi-Chain Support
- **60+ Networks**: Ethereum, Polygon, Arbitrum, Optimism, Base, Solana, and more
- **EVM Chains**: Full support via wagmi v2 + viem
- **Solana**: Native integration with Solana wallet adapters
- **Network Switching**: Seamless chain switching with automatic wallet updates

### Wallet Integration
- **10+ Wallet Providers**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow, Phantom, Solflare, and more
- **Auto-Detection**: Automatically detect installed wallets
- **Multi-Wallet**: Connect and manage multiple wallets simultaneously
- **Persistent Sessions**: Auto-reconnect on page reload

### Portfolio Management
- **Real-Time Balances**: Live token balance tracking via Alchemy/Helius APIs
- **Multi-Chain Portfolio**: Aggregated view across all connected chains
- **Token Prices**: Live pricing from CoinGecko/Jupiter
- **NFT Gallery**: Display and manage NFTs with metadata
- **Transaction History**: Complete transaction history with filters

### Security Features
- **Token Approval Management**: View and revoke unlimited approvals
- **Security Score**: Real-time security assessment
- **Scam Detection**: Integration with GoPlus Labs for threat detection
- **Address Verification**: ENS/SNS resolution with safety checks
- **Transaction Simulation**: Preview transaction outcomes before signing

### Developer Experience
- **TypeScript**: Full type safety throughout
- **React Hooks**: Comprehensive hook library for all wallet operations
- **Zustand Store**: Efficient state management with persistence
- **Real-time Updates**: Automatic balance and transaction updates
- **Error Handling**: Comprehensive error handling and user feedback

## 📦 Installation

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

Required dependencies:
- `wagmi` ^2.0.0
- `viem` ^2.0.0
- `@tanstack/react-query` ^5.0.0
- `@solana/web3.js` ^1.90.0
- `@solana/spl-token` ^0.4.0
- `zustand` ^4.5.0
- `framer-motion` ^11.0.0

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your API keys:

```env
# Required for EVM chains
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here

# Required for Solana
NEXT_PUBLIC_HELIUS_API_KEY=your_key_here

# Required for WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. Wrap Your App

```tsx
// app/layout.tsx
import { WalletProvider } from '@/providers/WalletProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WalletProvider autoConnect={true} defaultNetwork={1}>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
```

## 🚀 Usage

### Basic Connection

```tsx
'use client';

import { useWallet } from '@/providers/WalletProvider';

export function ConnectButton() {
  const { isConnected, connect, disconnect, activeWallet, openConnectModal } = useWallet();

  if (isConnected && activeWallet) {
    return (
      <div>
        <p>Connected: {activeWallet.address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return <button onClick={openConnectModal}>Connect Wallet</button>;
}
```

### Token Balances

```tsx
import { useTokenBalances } from '@/lib/wallets/hooks';

export function BalanceDisplay() {
  const { activeWallet } = useWallet();
  const { balances, totalValueUsd, isLoading } = useTokenBalances(
    activeWallet?.address,
    activeWallet?.chainId
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total: ${totalValueUsd.toFixed(2)}</h2>
      {balances.map(balance => (
        <div key={balance.token.address}>
          <span>{balance.token.symbol}: {balance.balanceFormatted}</span>
          <span>${balance.valueUsd?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
```

### NFT Gallery

```tsx
import { useNFTs } from '@/lib/wallets/hooks';

export function NFTGallery() {
  const { activeWallet } = useWallet();
  const { nfts, collections, isLoading, loadMore, hasMore } = useNFTs(
    activeWallet?.address,
    activeWallet?.chainId
  );

  return (
    <div>
      <h2>My NFTs ({nfts.length})</h2>
      <div className="grid grid-cols-4 gap-4">
        {nfts.map(nft => (
          <div key={nft.id}>
            <img src={nft.imageUrl} alt={nft.name} />
            <p>{nft.name}</p>
          </div>
        ))}
      </div>
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

### Transaction History

```tsx
import { useTransactionHistory } from '@/lib/wallets/hooks';

export function TransactionList() {
  const { activeWallet } = useWallet();
  const { groupedTransactions, isLoading, loadMore, hasMore } = useTransactionHistory(
    activeWallet?.address,
    { chainId: activeWallet?.chainId, limit: 50 }
  );

  return (
    <div>
      {groupedTransactions.map(group => (
        <div key={group.date}>
          <h3>{group.date}</h3>
          {group.transactions.map(tx => (
            <div key={tx.hash}>
              <span>{tx.type}</span>
              <span>{tx.valueFormatted}</span>
              <a href={`https://etherscan.io/tx/${tx.hash}`}>View</a>
            </div>
          ))}
        </div>
      ))}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

### Network Switching

```tsx
import { useWallet } from '@/providers/WalletProvider';
import { useAvailableNetworks } from '@/lib/wallets/hooks';

export function NetworkSwitcher() {
  const { currentNetwork, switchNetwork } = useWallet();
  const { networks } = useAvailableNetworks();

  return (
    <select 
      value={currentNetwork?.chainId} 
      onChange={(e) => switchNetwork(Number(e.target.value))}
    >
      {networks.map(network => (
        <option key={network.chainId} value={network.chainId}>
          {network.name}
        </option>
      ))}
    </select>
  );
}
```

### Token Approval Management

```tsx
import { useTokenApprovals } from '@/lib/wallets/hooks';
import { useWalletStore } from '@/lib/wallets/store';

export function ApprovalManager() {
  const { activeWallet } = useWallet();
  const { approvals, metrics, isLoading, refetch } = useTokenApprovals(
    activeWallet?.address,
    activeWallet?.chainId
  );
  const revokeApproval = useWalletStore(state => state.revokeApproval);

  return (
    <div>
      <h2>Token Approvals</h2>
      <p>Security Score: {metrics.riskScore}/100</p>
      <p>Unlimited Approvals: {metrics.unlimitedApprovals}</p>
      <p>Value at Risk: ${metrics.totalValueAtRisk.toFixed(2)}</p>
      
      {approvals.map(approval => (
        <div key={`${approval.tokenAddress}-${approval.spender}`}>
          <span>{approval.tokenSymbol}</span>
          <span>{approval.isUnlimited ? 'Unlimited' : approval.allowance.toString()}</span>
          <span>{approval.spenderLabel || approval.spender}</span>
          <button onClick={() => revokeApproval(approval.tokenAddress, approval.spender)}>
            Revoke
          </button>
        </div>
      ))}
    </div>
  );
}
```

### QR Code Generation

```tsx
import { generateAddressQR, downloadQRCode } from '@/lib/wallets/qrcode';

export function ReceiveAddress() {
  const { activeWallet } = useWallet();
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    if (activeWallet?.address) {
      const svg = generateAddressQR(activeWallet.address, {
        size: 300,
        darkColor: '#000000',
        lightColor: '#ffffff',
      });
      setQrCode(svg);
    }
  }, [activeWallet?.address]);

  const handleDownload = async () => {
    if (activeWallet?.address) {
      await downloadQRCode(
        activeWallet.address,
        `wallet-${activeWallet.address}`,
        { size: 500, format: 'png' }
      );
    }
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: qrCode }} />
      <button onClick={handleDownload}>Download QR</button>
    </div>
  );
}
```

## 🏗️ Architecture

### File Structure

```
lib/wallets/
├── types.ts              # TypeScript type definitions
├── networks.ts           # 60+ network configurations
├── providers.ts          # Wallet provider definitions
├── store.ts              # Zustand state management
├── hooks.ts              # React hooks for wallet operations
├── utils.ts              # Utility functions
├── wagmi.ts              # wagmi v2 configuration for EVM
├── solana.ts             # Solana wallet adapter configuration
├── qrcode.ts             # QR code generation utilities
├── api/
│   ├── index.ts          # Unified API layer
│   ├── alchemy.ts        # Alchemy API integration (EVM)
│   └── helius.ts         # Helius API integration (Solana)
└── index.ts              # Main exports

providers/
└── WalletProvider.tsx    # Main context provider

components/wallets/
├── ConnectWalletModal.tsx
├── NetworkSwitcher.tsx
├── WalletStatus.tsx
├── TokenList.tsx
├── NFTGallery.tsx
├── TransactionHistory.tsx
├── SigningModal.tsx
├── AddressVerifier.tsx
└── TransactionTracker.tsx

app/(wallets)/
├── layout.tsx
├── dashboard/page.tsx
├── send/page.tsx
├── receive/page.tsx
├── contacts/page.tsx
├── settings/page.tsx
└── security/page.tsx
```

### State Management

The wallet system uses Zustand for state management with localStorage persistence:

- **Connection State**: Connected wallets, active wallet, network
- **Settings**: User preferences, network favorites, notifications
- **Contacts**: Address book with ENS/SNS names
- **Recent Addresses**: Transaction history for autocomplete

### API Integration

#### EVM Chains (via Alchemy)
- Token balances (ERC-20)
- Native balance (ETH, MATIC, etc.)
- Token metadata and pricing
- NFT ownership and metadata
- Transaction history
- Gas estimation
- Token approvals

#### Solana (via Helius)
- SPL token balances
- SOL balance
- NFT ownership (including compressed NFTs)
- Transaction history
- Priority fee estimation

## 🔒 Security Best Practices

1. **Never expose private keys** - All signing happens in the wallet
2. **Validate addresses** - Use built-in validation before sending
3. **Check approvals regularly** - Use the Security Center to review
4. **Verify transactions** - Always review transaction details
5. **Use hardware wallets** - Ledger/Trezor support included
6. **Enable scam detection** - GoPlus Labs integration active

## 🧪 Testing

Run tests:

```bash
pnpm test
```

Run e2e tests:

```bash
pnpm test:e2e
```

## 📝 API Keys Setup

### Alchemy (EVM Chains)
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Create a free account
3. Create a new app
4. Copy your API key to `.env.local`

### Helius (Solana)
1. Go to [helius.dev](https://www.helius.dev/)
2. Sign up for free
3. Create a new API key
4. Copy to `.env.local`

### WalletConnect
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Create a project
3. Copy your Project ID to `.env.local`

## 🤝 Contributing

This is an enterprise-grade implementation following best practices:

- Full TypeScript type safety
- Comprehensive error handling
- Real API integrations (no mocks)
- Production-ready code
- Extensive documentation

## 📄 License

Apache-2.0

---

Built with ❤️ by [@nichxbt](https://github.com/nichxbt)
