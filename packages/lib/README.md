# @ucm/lib - Unified Library Layer

This package provides unified adapters that wrap popular open-source libraries.

## Structure

```
lib/
├── wallet/          # Wallet connection adapters
├── ui/              # UI component exports
├── charts/          # Chart wrapper components
├── editor/          # Code editor wrappers
├── workflow/        # Workflow builder
├── forms/           # Form handling
├── api/             # API client utilities
├── auth/            # Auth adapters
├── database/        # Database clients
├── state/           # State management
├── realtime/        # WebSocket utilities
├── testing/         # Test utilities
├── ai/              # AI agent integrations
├── contracts/       # Contract utilities
├── payments/        # Payment processing
└── index.ts         # Unified exports
```

## Usage

```typescript
import { 
  createWalletClient,
  useWallet,
  createChart,
  createWorkflow,
  createAgent
} from '@ucm/lib';
```

## Reference Implementations

See `/vendor/` for reference implementations from:
- wagmi, viem, rainbowkit (wallet)
- shadcn/ui, radix (ui)
- recharts, nivo (charts)
- langchain, eliza, crewai (ai)
- and 50+ more...

All reference implementations maintain original licenses and attribution.
