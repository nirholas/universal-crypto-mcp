# AGENT 10: PAYMENT GATEWAY (x402)
## 5-Phase Implementation Prompts

---

## PROMPT 1: X402 PROTOCOL INTEGRATION

**Context:** Implement x402 payment protocol for AI agent micropayments and API monetization.

**Objective:** Build payment gateway enabling seamless crypto payments for services.

**Requirements:**
1. **X402 Client Setup** (`website-unified/lib/payments/x402Client.ts`)
   ```typescript
   class X402Client {
     constructor(config: X402Config);
     
     // Create payment request
     createPaymentRequest(params: PaymentParams): PaymentRequest;
     
     // Verify payment header
     verifyPayment(header: string): Promise<PaymentVerification>;
     
     // Process payment
     processPayment(request: PaymentRequest): Promise<PaymentResult>;
     
     // Get payment status
     getStatus(paymentId: string): Promise<PaymentStatus>;
   }
   ```

2. **Payment Request Handler** (`website-unified/lib/payments/requestHandler.ts`)
   - Parse X-PAYMENT header
   - Validate payment amount
   - Check payment expiry
   - Verify signature
   - Confirm on-chain settlement
   - Return 402 Payment Required if needed

3. **Wallet Integration** (`website-unified/lib/payments/walletPayment.ts`)
   - Connect user wallet for payments
   - Sign payment authorization
   - Execute payment transaction
   - Track payment confirmation
   - Handle multiple chains (EVM + Solana)

4. **Payment Configuration** (`website-unified/lib/payments/config.ts`)
   ```typescript
   interface X402Config {
     networks: {
       [chainId: number]: {
         rpc: string;
         paymentContract: string;
         supportedTokens: Token[];
       };
     };
     defaultToken: string;
     minPayment: bigint;
     maxPayment: bigint;
     paymentTimeout: number;
   }
   ```

**Technical Stack:**
- x402-sdk from packages/payments
- viem for EVM transactions
- @solana/web3.js for Solana
- ethers.js for signing
- TypeScript strict mode

**Deliverables:**
- X402 client implementation
- Payment verification system
- Multi-chain wallet integration
- Configuration management

---

## PROMPT 2: PAYMENT API ENDPOINTS

**Context:** Create API routes for payment processing, verification, and management.

**Objective:** Build complete payment API for the platform.

**Requirements:**
1. **Payment Creation** (`website-unified/app/api/payments/create/route.ts`)
   ```typescript
   POST /api/payments/create
   Body: {
     amount: string;
     token: string;
     chain: number;
     recipient: string;
     metadata: {
       serviceId?: string;
       subscriptionId?: string;
       description: string;
     };
   }
   Response: {
     paymentId: string;
     paymentRequest: string;
     expiresAt: number;
     qrCode: string;
   }
   ```

2. **Payment Verification** (`website-unified/app/api/payments/verify/route.ts`)
   ```typescript
   POST /api/payments/verify
   Headers: {
     'X-PAYMENT': string;
   }
   Body: {
     paymentId: string;
   }
   Response: {
     verified: boolean;
     paymentDetails: PaymentDetails;
     accessToken?: string;
   }
   ```

3. **Payment History** (`website-unified/app/api/payments/history/route.ts`)
   ```typescript
   GET /api/payments/history
   Query: {
     type?: 'sent' | 'received';
     status?: 'pending' | 'completed' | 'failed';
     from?: string;
     to?: string;
   }
   Response: {
     payments: Payment[];
     total: number;
     summary: {
       totalSent: string;
       totalReceived: string;
     };
   }
   ```

4. **Refund Processing** (`website-unified/app/api/payments/refund/route.ts`)
   ```typescript
   POST /api/payments/refund
   Body: {
     paymentId: string;
     reason: string;
     amount?: string; // Partial refund
   }
   Response: {
     refundId: string;
     status: 'pending' | 'processed';
     txHash?: string;
   }
   ```

**Technical Requirements:**
- Atomic payment processing
- Idempotency keys
- Payment retry logic
- Refund workflow
- Audit logging

**Deliverables:**
- Payment CRUD endpoints
- Verification system
- History and reporting
- Refund processing

---

## PROMPT 3: PAYMENT UI COMPONENTS

**Context:** Build user-facing payment components for checkout, history, and management.

**Objective:** Create intuitive payment interfaces for all payment scenarios.

**Requirements:**
1. **Checkout Modal** (`website-unified/components/payments/CheckoutModal.tsx`)
   - Payment amount display
   - Token/chain selector
   - Wallet connection prompt
   - Payment button with loading
   - Confirmation animation
   - Receipt generation
   - Error handling

2. **Payment Status** (`website-unified/components/payments/PaymentStatus.tsx`)
   - Pending state with spinner
   - Confirmation countdown
   - Success with checkmark
   - Failed with retry option
   - Transaction hash link
   - Time elapsed display

3. **Payment History Table** (`website-unified/components/payments/PaymentHistory.tsx`)
   - Sortable columns
   - Filter by type/status/date
   - Payment details expansion
   - Export to CSV
   - Pagination
   - Quick actions (refund, view tx)

4. **Quick Pay Button** (`website-unified/components/payments/QuickPay.tsx`)
   - One-click payment for saved methods
   - Amount input
   - Recipient selection
   - Confirmation popup
   - Success toast

**Technical Requirements:**
- Wallet adapter integration
- Real-time status updates
- Responsive design
- Accessibility (ARIA)
- Loading states

**Deliverables:**
- Checkout flow components
- Payment status indicators
- History display
- Quick payment interface

---

## PROMPT 4: SUBSCRIPTION BILLING

**Context:** Implement recurring payment system for marketplace subscriptions.

**Objective:** Build subscription billing with automatic renewals and usage tracking.

**Requirements:**
1. **Subscription Manager** (`website-unified/lib/payments/subscriptionManager.ts`)
   ```typescript
   class SubscriptionManager {
     // Create subscription
     create(params: SubscriptionParams): Promise<Subscription>;
     
     // Process recurring payment
     processRecurring(subscriptionId: string): Promise<PaymentResult>;
     
     // Cancel subscription
     cancel(subscriptionId: string): Promise<void>;
     
     // Upgrade/downgrade
     changeTier(subscriptionId: string, newTier: string): Promise<Subscription>;
     
     // Get usage
     getUsage(subscriptionId: string): Promise<UsageData>;
   }
   ```

2. **Billing Cycle Handler** (`website-unified/lib/payments/billingCycle.ts`)
   - Calculate next billing date
   - Prorate upgrades/downgrades
   - Handle failed payments
   - Grace period management
   - Automatic retry logic
   - Cancellation workflow

3. **Usage Metering** (`website-unified/lib/payments/usageMetering.ts`)
   - Track API calls per subscription
   - Overage calculation
   - Usage alerts
   - Real-time usage display
   - Usage reset on billing cycle

4. **Invoice Generation** (`website-unified/lib/payments/invoiceGenerator.ts`)
   - Generate PDF invoices
   - Line item breakdown
   - Tax calculation
   - Company details
   - Download endpoint
   - Email delivery

**Technical Requirements:**
- Cron job for recurring billing
- Payment retry with backoff
- Usage database tracking
- PDF generation library
- Email integration

**Deliverables:**
- Subscription lifecycle management
- Recurring billing system
- Usage tracking
- Invoice generation

---

## PROMPT 5: PAYMENT ANALYTICS & REPORTING

**Context:** Build analytics dashboard for payment tracking and financial reporting.

**Objective:** Create comprehensive payment analytics for users and providers.

**Requirements:**
1. **Payment Dashboard** (`website-unified/app/(payments)/dashboard/page.tsx`)
   - Total revenue/spending
   - Payment volume chart
   - Success/failure rates
   - Average payment size
   - Top services/consumers
   - Payment method breakdown

2. **Revenue Analytics** (`website-unified/components/payments/RevenueAnalytics.tsx`)
   - Daily/weekly/monthly revenue
   - Revenue by service
   - Revenue by subscription tier
   - Growth rate calculations
   - Forecasting
   - Export reports

3. **Financial Reports** (`website-unified/components/payments/FinancialReports.tsx`)
   - Monthly statements
   - Tax summaries
   - Payout reports
   - Fee breakdown
   - Transaction ledger
   - Audit trail

4. **Alerts & Notifications** (`website-unified/components/payments/PaymentAlerts.tsx`)
   - Low balance alerts
   - Payment failure notifications
   - Subscription renewal reminders
   - Unusual activity detection
   - Payout ready notifications

**Technical Requirements:**
- Real-time analytics updates
- Chart visualizations
- Report generation (PDF/CSV)
- Alert delivery (email, push)
- Data aggregation queries

**Deliverables:**
- Payment analytics dashboard
- Revenue tracking
- Financial reporting
- Alert system

---

**Integration Notes:**
- Core x402 from packages/payments/x402
- Wallet connection from Agent 4
- Database storage via Agent 13
- API routes via Agent 9
- Smart contracts via Agent 14

**Success Criteria:**
- Payments process in < 30 seconds
- 99.9% payment success rate
- Real-time status updates
- Accurate billing calculations
- Secure payment verification
- Complete audit trail
- Multi-chain support
