# Wallet Manager Dependencies

## Required Dependencies

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    // Existing dependencies...
    
    // Wallet & Blockchain
    "wagmi": "^2.12.0",
    "viem": "^2.21.0",
    "@tanstack/react-query": "^5.56.0",
    "@solana/web3.js": "^1.95.0",
    "@solana/spl-token": "^0.4.0",
    
    // Already installed (verify versions)
    "zustand": "^4.5.7",
    "framer-motion": "^11.0.0"
  }
}
```

## Installation Command

```bash
pnpm add wagmi viem @tanstack/react-query @solana/web3.js @solana/spl-token
```

Or with npm:

```bash
npm install wagmi viem @tanstack/react-query @solana/web3.js @solana/spl-token
```

Or with yarn:

```bash
yarn add wagmi viem @tanstack/react-query @solana/web3.js @solana/spl-token
```

## Dependency Details

### wagmi (^2.12.0)
- **Purpose**: React hooks for Ethereum wallet connections
- **Features**: EVM wallet management, network switching, transaction handling
- **Docs**: https://wagmi.sh/

### viem (^2.21.0)
- **Purpose**: TypeScript interface for Ethereum
- **Features**: Type-safe blockchain interactions, account abstraction
- **Docs**: https://viem.sh/

### @tanstack/react-query (^5.56.0)
- **Purpose**: Data fetching and caching for React
- **Features**: Automatic refetching, caching, mutations
- **Docs**: https://tanstack.com/query/latest

### @solana/web3.js (^1.95.0)
- **Purpose**: Solana blockchain JavaScript SDK
- **Features**: Transaction building, account management, RPC calls
- **Docs**: https://solana-labs.github.io/solana-web3.js/

### @solana/spl-token (^0.4.0)
- **Purpose**: SPL token program interactions
- **Features**: Token transfers, account creation, mint/burn
- **Docs**: https://spl.solana.com/token

### zustand (^4.5.7)
- **Purpose**: State management
- **Features**: Lightweight, persistent stores
- **Note**: Already installed in your project

### framer-motion (^11.0.0)
- **Purpose**: Animation library
- **Features**: Smooth animations for modals and transitions
- **Note**: Already installed in your project

## Peer Dependencies

These are automatically installed with the main dependencies:

- `react` ^18.3.1 (already installed)
- `react-dom` ^18.3.1 (already installed)
- `typescript` ^5 (already installed)

## Optional Dependencies

For enhanced functionality:

```bash
# QR Code generation (alternative to built-in generator)
pnpm add qrcode @types/qrcode

# ENS utilities (alternative to fetch-based resolution)
pnpm add @ensdomains/ensjs

# Enhanced Solana utilities
pnpm add @metaplex-foundation/js @metaplex-foundation/mpl-token-metadata
```

## Environment Setup

After installing dependencies, copy `.env.example` to `.env.local` and add your API keys:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
```

## Verification

To verify all dependencies are installed correctly:

```bash
# Check for missing dependencies
pnpm install

# Run type checking
pnpm type-check

# Start development server
pnpm dev
```

## Version Compatibility

| Package | Minimum Version | Recommended |
|---------|----------------|-------------|
| Node.js | 18.17.0 | 20.x or later |
| pnpm | 8.0.0 | Latest |
| Next.js | 14.0.0 | 15.x or later |
| React | 18.2.0 | 18.3.x |
| TypeScript | 5.0.0 | 5.3.x |

## Troubleshooting

### Common Issues

#### Peer Dependency Warnings
If you see peer dependency warnings with pnpm, you can safely ignore them or add to `.npmrc`:
```
auto-install-peers=true
strict-peer-dependencies=false
```

#### Solana Web3.js Buffer Issues
If you encounter Buffer errors with @solana/web3.js in Next.js:

Add to `next.config.js`:
```js
webpack: (config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
  };
  return config;
}
```

#### TypeScript Errors
Ensure your `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```

## Build Size Impact

Approximate impact on bundle size:

- wagmi + viem: ~150 KB (gzipped)
- @solana/web3.js: ~200 KB (gzipped)
- @tanstack/react-query: ~40 KB (gzipped)
- zustand: ~5 KB (gzipped)

Total additional size: ~395 KB (gzipped)

## Performance Optimization

To optimize bundle size:

1. **Code Splitting**: Wallet components are already lazy-loaded
2. **Tree Shaking**: Import only what you need from viem
3. **Dynamic Imports**: Use Next.js dynamic imports for wallet modals

Example:
```tsx
import dynamic from 'next/dynamic';

const ConnectWalletModal = dynamic(
  () => import('@/components/wallets/ConnectWalletModal'),
  { ssr: false }
);
```

## Support

For issues with specific dependencies:

- **wagmi**: https://github.com/wevm/wagmi/discussions
- **viem**: https://github.com/wevm/viem/discussions  
- **Solana**: https://discord.gg/solana
- **React Query**: https://github.com/TanStack/query/discussions
