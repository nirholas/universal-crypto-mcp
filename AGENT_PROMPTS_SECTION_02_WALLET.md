# AGENT 4: WALLET MANAGER ADAPTATION
## 5-Phase Implementation Prompts

---

## PROMPT 1: MULTI-CHAIN WALLET CONNECTION

**Context:** Adapt existing wallet components to support comprehensive multi-chain wallet management across EVM and Solana networks.

**Objective:** Build robust wallet connection system supporting 60+ networks with seamless switching.

**Requirements:**
1. **Wallet Connection Modal** (`website-unified/components/wallets/ConnectWalletModal.tsx`)
   - Support for 10+ wallet providers:
     - MetaMask, WalletConnect, Coinbase Wallet, Rainbow
     - Phantom, Solflare (Solana)
     - Ledger, Trezor (Hardware)
     - Safe (Multisig)
   - Recent wallets memory
   - Auto-reconnect on page load
   - Chain detection and switching prompts

2. **Network Switcher** (`website-unified/components/wallets/NetworkSwitcher.tsx`)
   - 60+ network support (all EVM chains + Solana)
   - Network categories (Mainnet, Testnet, L2s)
   - Custom RPC configuration
   - Network health indicators (block time, gas)
   - One-click chain add to wallet
   - Favorites system

3. **Wallet Context Provider** (`website-unified/providers/WalletProvider.tsx`)
   - Unified state for EVM (wagmi) and Solana (wallet-adapter)
   - Connection status management
   - Multi-wallet support (connect multiple simultaneously)
   - Chain state synchronization
   - Disconnect handling
   - Session persistence

4. **Connection Status Display** (`website-unified/components/wallets/WalletStatus.tsx`)
   - Connected wallet address (truncated with copy)
   - ENS/SNS name resolution
   - Network indicator with color coding
   - Balance display (native token)
   - Quick actions dropdown (disconnect, switch, copy)

**Technical Stack:**
- wagmi v2 + viem for EVM
- @solana/wallet-adapter for Solana
- RainbowKit or custom modal
- Zustand for wallet state
- TypeScript strict mode

**Deliverables:**
- Universal wallet connection system
- 60+ network configurations
- Wallet provider context
- Connection UI components

---

## PROMPT 2: WALLET DASHBOARD & PORTFOLIO

**Context:** Create comprehensive wallet dashboard showing all assets, balances, and transaction history.

**Objective:** Build portfolio overview with real-time balance tracking across all connected wallets.

**Requirements:**
1. **Portfolio Dashboard** (`website-unified/app/(wallets)/dashboard/page.tsx`)
   - Total portfolio value (USD)
   - Asset breakdown by chain
   - Token list with balances and values
   - NFT gallery preview
   - DeFi positions summary
   - 24h change indicators
   - Historical portfolio chart

2. **Token List Component** (`website-unified/components/wallets/TokenList.tsx`)
   - All ERC-20/SPL tokens
   - Token logos from token lists
   - Price and value display
   - 24h price change
   - Sort by: value, name, change
   - Filter by chain
   - Hide small balances toggle
   - Add custom token

3. **NFT Gallery** (`website-unified/components/wallets/NFTGallery.tsx`)
   - Grid view of owned NFTs
   - Collection grouping
   - Floor price display
   - Trait rarity indicators
   - Quick actions (transfer, list)
   - Lazy loading with thumbnails

4. **Transaction History** (`website-unified/components/wallets/TransactionHistory.tsx`)
   - All wallet transactions
   - Filter by type (send, receive, swap, approve)
   - Chain filter
   - Date range selector
   - Transaction details modal
   - Block explorer links
   - Pending transactions with status

**Technical Requirements:**
- Multi-chain balance fetching (Alchemy, Moralis, Helius)
- Token price integration (CoinGecko, DEX prices)
- NFT metadata from OpenSea/Magic Eden APIs
- Real-time WebSocket updates
- Efficient caching strategy

**Deliverables:**
- Portfolio dashboard page
- Token management components
- NFT gallery with metadata
- Transaction history with filters

---

## PROMPT 3: TRANSACTION BUILDER & SIGNING

**Context:** Create intuitive transaction building and signing interface for all wallet operations.

**Objective:** Build secure transaction flow from construction to signing to confirmation.

**Requirements:**
1. **Send Transaction Page** (`website-unified/app/(wallets)/send/page.tsx`)
   - Recipient address input with ENS/SNS resolution
   - Token selector (native + ERC-20/SPL)
   - Amount input with MAX button
   - USD value display
   - Gas estimation and customization
   - Transaction preview
   - Address book integration

2. **Transaction Builder** (`website-unified/components/wallets/TransactionBuilder.tsx`)
   - Multi-send support (batch transactions)
   - Custom contract call builder
   - ABI encoder/decoder
   - Calldata preview
   - Gas limit override
   - Nonce management
   - EIP-1559 gas parameters

3. **Signing Interface** (`website-unified/components/wallets/SigningModal.tsx`)
   - Transaction simulation preview
   - Risk assessment warnings
   - Token approvals highlight
   - Gas cost display
   - Sign and broadcast
   - Hardware wallet support
   - Multisig threshold display (for Safe)

4. **Transaction Tracking** (`website-unified/components/wallets/TransactionTracker.tsx`)
   - Pending transaction list
   - Confirmation progress
   - Speed up / Cancel options
   - Toast notifications on confirm
   - Failed transaction handling
   - Retry mechanism

**Technical Requirements:**
- Transaction simulation (Tenderly, Alchemy)
- Gas estimation with buffer
- EIP-712 typed data signing
- Solana transaction building
- Hardware wallet integration (Ledger Live)

**Deliverables:**
- Send transaction flow
- Advanced transaction builder
- Secure signing modal
- Transaction monitoring

---

## PROMPT 4: ADDRESS BOOK & CONTACTS

**Context:** Create contact management system for frequently used addresses with labels and organization.

**Objective:** Build comprehensive address book with verification and safety features.

**Requirements:**
1. **Address Book Page** (`website-unified/app/(wallets)/contacts/page.tsx`)
   - Contact list with search
   - Add/Edit/Delete contacts
   - Contact groups (Personal, DeFi, CEX, etc.)
   - Recent addresses section
   - Import/Export contacts (CSV, JSON)
   - Sync across devices (encrypted)

2. **Contact Card** (`website-unified/components/wallets/ContactCard.tsx`)
   - Name and label
   - Multiple addresses (EVM + Solana)
   - ENS/SNS resolution display
   - Transaction history with contact
   - Total volume sent/received
   - Notes field
   - Favorite toggle

3. **Address Verification** (`website-unified/components/wallets/AddressVerifier.tsx`)
   - Checksum validation
   - Known contract detection
   - Scam database check
   - First-time address warning
   - Clipboard paste detection
   - QR code scanner

4. **Quick Send** (`website-unified/components/wallets/QuickSend.tsx`)
   - Contact search with autocomplete
   - Recent recipients
   - Favorite contacts quick access
   - Amount presets
   - One-click send to saved contact

**Technical Requirements:**
- Local encrypted storage
- Cloud sync option (encrypted)
- Address validation libraries
- QR code scanning (mobile)
- Scam detection API integration

**Deliverables:**
- Complete address book system
- Contact management CRUD
- Address verification
- Quick send functionality

---

## PROMPT 5: WALLET SETTINGS & SECURITY

**Context:** Build security-focused settings for wallet management, permissions, and recovery.

**Objective:** Create comprehensive security center for wallet protection and management.

**Requirements:**
1. **Wallet Settings Page** (`website-unified/app/(wallets)/settings/page.tsx`)
   - Connected wallets list
   - Default wallet selection
   - Auto-lock timeout
   - Transaction confirmation preferences
   - Network preferences
   - Display currency (USD, EUR, BTC)
   - Theme preferences

2. **Token Approvals Manager** (`website-unified/components/wallets/ApprovalsManager.tsx`)
   - List all token approvals
   - Spender contract identification
   - Approval amount display
   - Risk assessment (unlimited = high risk)
   - Revoke approval one-click
   - Batch revoke
   - Approval history

3. **Security Center** (`website-unified/components/wallets/SecurityCenter.tsx`)
   - Security score calculation
   - Risk factors list
   - Recommended actions
   - Phishing protection settings
   - Suspicious activity alerts
   - Connected dApps list
   - Session management

4. **Backup & Recovery** (`website-unified/components/wallets/BackupRecovery.tsx`)
   - Export wallet data (encrypted)
   - Recovery phrase verification
   - Hardware wallet pairing
   - Emergency contacts
   - Dead man's switch setup
   - Social recovery configuration

**Technical Requirements:**
- Approval fetching (Etherscan API, on-chain)
- Revoke transaction building
- Encrypted local storage
- Security scoring algorithm
- dApp connection tracking

**Deliverables:**
- Wallet settings interface
- Token approval management
- Security assessment dashboard
- Backup and recovery tools

---

**Integration Notes:**
- Integrate with `packages/wallets` for wallet operations
- Use `packages/security` for risk assessment
- Connect to market-data for token prices
- Implement proper key management (never expose private keys)
- Support both browser extension and WalletConnect
- Mobile responsive design essential

**Success Criteria:**
- Users can connect any wallet on any chain
- Portfolio displays accurate real-time balances
- Transactions build and sign securely
- Address book prevents sending to wrong addresses
- Security center protects user assets
- Works on mobile and desktop
- Zero security vulnerabilities
