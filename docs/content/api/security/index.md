---
title: "Security API Reference"
description: "API documentation for security, auditing, and risk management packages"
category: "api"
keywords: ["api", "security", "audit", "risk", "monitoring", "alerts"]
order: 9
---

# Security API Reference

Security packages provide auditing, risk management, and monitoring capabilities.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/security-audit` | Smart contract auditing |
| `@nirholas/security-monitor` | Real-time monitoring |
| `@nirholas/security-scanner` | Vulnerability scanning |
| `@nirholas/security-alerts` | Alert management |
| `@nirholas/security-risk` | Risk assessment |

---

## Smart Contract Auditing

### Installation

```bash
pnpm add @nirholas/security-audit
```

### Configuration

```typescript
import { ContractAuditor } from '@nirholas/security-audit'

const auditor = new ContractAuditor({
  providers: ['slither', 'mythril', 'solhint'],
  severity: 'low', // Minimum severity to report
  outputFormat: 'json',
})
```

### Contract Analysis

#### analyzeContract

Analyze a smart contract for vulnerabilities.

```typescript
async function analyzeContract(params: AuditParams): Promise<AuditReport>

interface AuditParams {
  source: string | Buffer      // Solidity source or path
  contractName?: string
  compilerVersion?: string
  optimizerRuns?: number
  includeAST?: boolean
}

interface AuditReport {
  contractName: string
  compiler: string
  timestamp: Date
  summary: {
    critical: number
    high: number
    medium: number
    low: number
    informational: number
  }
  findings: Finding[]
  gasAnalysis?: GasAnalysis
  complexity?: ComplexityMetrics
}
```

**Example:**

```typescript
const report = await auditor.analyzeContract({
  source: './contracts/MyToken.sol',
  contractName: 'MyToken',
  compilerVersion: '0.8.20',
})

console.log(`Found ${report.summary.critical} critical issues`)
for (const finding of report.findings) {
  console.log(`[${finding.severity}] ${finding.title}`)
  console.log(`  Location: ${finding.location}`)
  console.log(`  ${finding.description}`)
}
```

### Finding Types

```typescript
interface Finding {
  id: string
  title: string
  description: string
  severity: Severity
  category: VulnerabilityCategory
  location: {
    file: string
    line: number
    column?: number
    function?: string
  }
  code?: string
  recommendation: string
  references?: string[]
  cwe?: string             // CWE identifier
  swc?: string             // SWC registry ID
}

type Severity = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'informational'

type VulnerabilityCategory =
  | 'reentrancy'
  | 'access-control'
  | 'arithmetic'
  | 'unchecked-calls'
  | 'denial-of-service'
  | 'front-running'
  | 'timestamp-dependence'
  | 'randomness'
  | 'gas-optimization'
  | 'code-quality'
```

### Gas Analysis

```typescript
interface GasAnalysis {
  totalGas: number
  functions: FunctionGas[]
  deploymentCost: number
  optimizationSuggestions: GasSuggestion[]
}

interface FunctionGas {
  name: string
  selector: string
  minGas: number
  maxGas: number
  averageGas: number
}

interface GasSuggestion {
  location: string
  currentCost: number
  optimizedCost: number
  suggestion: string
}
```

---

## Real-time Monitoring

### Installation

```bash
pnpm add @nirholas/security-monitor
```

### Monitor Configuration

```typescript
import { SecurityMonitor } from '@nirholas/security-monitor'

const monitor = new SecurityMonitor({
  networks: ['ethereum', 'base', 'arbitrum'],
  rpcUrls: {
    ethereum: process.env.ETH_RPC_URL!,
    base: process.env.BASE_RPC_URL!,
    arbitrum: process.env.ARBITRUM_RPC_URL!,
  },
  alertWebhook: process.env.SLACK_WEBHOOK,
})
```

### Contract Monitoring

#### watchContract

Monitor a contract for suspicious activity.

```typescript
function watchContract(params: WatchParams): void

interface WatchParams {
  address: string
  network: string
  events?: string[]           // Specific events to watch
  threshold?: ThresholdConfig
  callback?: (alert: Alert) => void
}

interface ThresholdConfig {
  largeTransfer?: string      // ETH/token amount
  unusualGas?: number         // Gas multiplier vs average
  rapidTransactions?: number  // Tx count per block
  newAddressInteraction?: boolean
}
```

**Example:**

```typescript
monitor.watchContract({
  address: '0xYourContract',
  network: 'ethereum',
  events: ['Transfer', 'Approval', 'OwnershipTransferred'],
  threshold: {
    largeTransfer: '100', // ETH
    rapidTransactions: 10,
  },
  callback: async (alert) => {
    console.log(`Alert: ${alert.type}`)
    await sendSlackNotification(alert)
  },
})

// Start monitoring
await monitor.start()
```

#### watchWallet

Monitor a wallet address.

```typescript
function watchWallet(params: WalletWatchParams): void

interface WalletWatchParams {
  address: string
  networks: string[]
  trackTokens?: boolean
  trackNFTs?: boolean
  alertOnIncoming?: boolean
  alertOnOutgoing?: boolean
  minAmount?: string
}
```

---

### Alert System

```typescript
interface Alert {
  id: string
  type: AlertType
  severity: 'critical' | 'high' | 'medium' | 'low'
  network: string
  address: string
  timestamp: Date
  transaction?: {
    hash: string
    from: string
    to: string
    value: string
    gasUsed: number
  }
  details: Record<string, unknown>
  acknowledged: boolean
}

type AlertType =
  | 'large_transfer'
  | 'unusual_gas'
  | 'rapid_transactions'
  | 'new_address_interaction'
  | 'ownership_change'
  | 'suspicious_approval'
  | 'contract_upgrade'
  | 'flash_loan_detected'
  | 'price_manipulation'
```

---

## Vulnerability Scanner

### Installation

```bash
pnpm add @nirholas/security-scanner
```

### Network Scanning

```typescript
import { VulnerabilityScanner } from '@nirholas/security-scanner'

const scanner = new VulnerabilityScanner({
  rpcUrl: process.env.RPC_URL!,
  etherscanApiKey: process.env.ETHERSCAN_API_KEY,
})
```

#### scanAddress

Scan a deployed contract for vulnerabilities.

```typescript
async function scanAddress(
  address: string,
  options?: ScanOptions
): Promise<ScanResult>

interface ScanOptions {
  fetchSource?: boolean       // Fetch from Etherscan
  includeProxy?: boolean      // Scan proxy implementation
  checkUpgradeable?: boolean  // Check upgrade patterns
  checkPermissions?: boolean  // Analyze access control
}

interface ScanResult {
  address: string
  isContract: boolean
  isProxy: boolean
  implementation?: string
  verified: boolean
  compiler?: string
  vulnerabilities: Vulnerability[]
  permissions: Permission[]
  upgradeability: UpgradeInfo
}
```

#### scanToken

Comprehensive token security scan.

```typescript
async function scanToken(address: string): Promise<TokenScanResult>

interface TokenScanResult {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  
  // Security checks
  isHoneypot: boolean
  hasBlacklist: boolean
  hasWhitelist: boolean
  hasMintFunction: boolean
  hasPauseFunction: boolean
  hasProxyPattern: boolean
  
  // Tax analysis
  buyTax: number
  sellTax: number
  transferTax: number
  
  // Ownership
  owner: string
  isRenounced: boolean
  ownerBalance: string
  ownerPercentage: number
  
  // Liquidity
  liquidityPools: LiquidityPool[]
  isLiquidityLocked: boolean
  lockDuration?: number
  
  // Risk score
  riskScore: number        // 0-100
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical'
  warnings: string[]
}
```

---

## Alert Management

### Installation

```bash
pnpm add @nirholas/security-alerts
```

### Alert Manager

```typescript
import { AlertManager } from '@nirholas/security-alerts'

const alerts = new AlertManager({
  database: process.env.DATABASE_URL!,
  channels: {
    slack: process.env.SLACK_WEBHOOK,
    discord: process.env.DISCORD_WEBHOOK,
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN!,
      chatId: process.env.TELEGRAM_CHAT_ID!,
    },
    email: {
      smtp: process.env.SMTP_URL,
      from: 'alerts@example.com',
      to: ['security@example.com'],
    },
    pagerduty: process.env.PAGERDUTY_KEY,
  },
})
```

#### createAlert

Create and send an alert.

```typescript
async function createAlert(params: CreateAlertParams): Promise<Alert>

interface CreateAlertParams {
  type: AlertType
  severity: Severity
  title: string
  description: string
  source: string
  metadata?: Record<string, unknown>
  channels?: string[]         // Override default channels
  deduplicate?: boolean       // Prevent duplicate alerts
  dedupeWindow?: number       // Seconds
}
```

#### configureRules

Configure alert routing rules.

```typescript
async function configureRules(rules: AlertRule[]): Promise<void>

interface AlertRule {
  name: string
  conditions: {
    type?: AlertType[]
    severity?: Severity[]
    source?: string[]
  }
  actions: {
    channels: string[]
    throttle?: number         // Min seconds between alerts
    escalate?: {
      after: number           // Seconds
      to: string[]            // Channels
    }
  }
}
```

**Example:**

```typescript
await alerts.configureRules([
  {
    name: 'critical-alerts',
    conditions: {
      severity: ['critical', 'high'],
    },
    actions: {
      channels: ['slack', 'pagerduty', 'email'],
      escalate: {
        after: 300, // 5 minutes
        to: ['telegram'],
      },
    },
  },
  {
    name: 'low-severity',
    conditions: {
      severity: ['low', 'informational'],
    },
    actions: {
      channels: ['slack'],
      throttle: 3600, // 1 hour
    },
  },
])
```

---

## Risk Assessment

### Installation

```bash
pnpm add @nirholas/security-risk
```

### Risk Analyzer

```typescript
import { RiskAnalyzer } from '@nirholas/security-risk'

const risk = new RiskAnalyzer({
  dataProviders: ['chainalysis', 'elliptic', 'internal'],
  riskThreshold: 50,
})
```

#### assessAddress

Assess risk level of an address.

```typescript
async function assessAddress(address: string): Promise<RiskAssessment>

interface RiskAssessment {
  address: string
  riskScore: number          // 0-100
  riskLevel: RiskLevel
  categories: RiskCategory[]
  flags: RiskFlag[]
  lastActivity: Date
  transactionCount: number
  recommendation: 'allow' | 'review' | 'block'
}

type RiskLevel = 'minimal' | 'low' | 'medium' | 'high' | 'severe'

interface RiskCategory {
  name: string
  score: number
  reason: string
}

interface RiskFlag {
  type: string
  severity: string
  description: string
  source: string
}
```

#### assessTransaction

Assess risk of a pending transaction.

```typescript
async function assessTransaction(
  params: TransactionParams
): Promise<TransactionRisk>

interface TransactionParams {
  from: string
  to: string
  value: string
  data?: string
}

interface TransactionRisk {
  riskScore: number
  recommendation: 'proceed' | 'review' | 'reject'
  warnings: Warning[]
  simulationResult?: {
    success: boolean
    gasUsed: number
    balanceChanges: BalanceChange[]
    events: Event[]
  }
}
```

#### batchAssess

Assess multiple addresses efficiently.

```typescript
async function batchAssess(
  addresses: string[]
): Promise<Map<string, RiskAssessment>>
```

---

## Error Types

```typescript
class SecurityError extends Error {
  code: string
}

// Audit errors
class CompilationError extends SecurityError {}
class AnalysisTimeoutError extends SecurityError {}
class UnsupportedVersionError extends SecurityError {}

// Monitor errors
class ConnectionError extends SecurityError {}
class RateLimitError extends SecurityError {}
class InvalidAddressError extends SecurityError {}

// Scanner errors
class ContractNotVerifiedError extends SecurityError {}
class ScanTimeoutError extends SecurityError {}
class ProviderError extends SecurityError {}

// Alert errors
class ChannelError extends SecurityError {}
class ThrottledError extends SecurityError {}
class ConfigurationError extends SecurityError {}

// Risk errors
class AssessmentError extends SecurityError {}
class DataProviderError extends SecurityError {}
class SimulationError extends SecurityError {}
```

---

## Type Exports

```typescript
export type {
  AuditReport,
  Finding,
  Severity,
  VulnerabilityCategory,
  GasAnalysis,
  Alert,
  AlertType,
  WatchParams,
  ScanResult,
  TokenScanResult,
  RiskAssessment,
  RiskLevel,
  TransactionRisk,
}
```
