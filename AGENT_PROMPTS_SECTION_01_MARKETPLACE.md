# AGENT 3: AI SERVICE MARKETPLACE ADAPTATION
## 5-Phase Implementation Prompts

---

## PROMPT 1: MARKETPLACE SERVICE DISCOVERY UI

**Context:** Adapt existing marketplace components to integrate with AI Service Marketplace backend. Create comprehensive service discovery interface.

**Objective:** Build service discovery page with search, filtering, reputation display, and service details.

**Requirements:**
1. **Service Discovery Page** (`website-unified/app/(marketplace)/discover/page.tsx`)
   - Grid/list view toggle
   - Real-time service search with debouncing
   - Category filters (AI Models, Data APIs, Trading Signals, Analytics, etc.)
   - Reputation badges (verified, top-rated, new)
   - Pricing display (pay-per-use, subscription)
   - Service cards with: name, description, provider, rating, price, usage count

2. **Search & Filters** (`website-unified/components/marketplace/ServiceFilters.tsx`)
   - Category dropdown (15+ categories)
   - Price range slider
   - Reputation score minimum
   - Subscription type toggle
   - Sort by: popularity, price, rating, newest

3. **Service Card Component** (`website-unified/components/marketplace/ServiceCard.tsx`)
   - Service metadata display
   - Provider info with reputation score
   - Quick action buttons (View Details, Subscribe, Try Free)
   - Tags for capabilities
   - Live status indicator (online/offline)

4. **API Integration**
   - Connect to `/api/marketplace/services` endpoint
   - Real-time service availability updates
   - Pagination with infinite scroll
   - Error handling and loading states

**Technical Stack:**
- Next.js 14 App Router
- React Server Components where applicable
- TailwindCSS for styling
- SWR for data fetching
- TypeScript strict mode

**Deliverables:**
- 3 new pages in `app/(marketplace)/`
- 5+ reusable components in `components/marketplace/`
- TypeScript interfaces for all marketplace data
- Responsive design (mobile-first)

---

## PROMPT 2: SERVICE PROVIDER DASHBOARD

**Context:** Create provider-side interface for registering, managing, and monitoring services.

**Objective:** Build complete provider dashboard with service management, analytics, and revenue tracking.

**Requirements:**
1. **Provider Dashboard** (`website-unified/app/(marketplace)/provider/dashboard/page.tsx`)
   - Service overview cards (total services, active subscriptions, revenue)
   - Quick stats: API calls today, revenue this month, active users
   - Recent activity feed
   - Service health monitoring

2. **Service Registration Form** (`website-unified/app/(marketplace)/provider/register/page.tsx`)
   - Multi-step form wizard
   - Step 1: Basic info (name, description, category)
   - Step 2: Pricing (pay-per-use rate, subscription tiers)
   - Step 3: API endpoint configuration
   - Step 4: Documentation upload (OpenAPI spec)
   - Step 5: Review & submit for verification

3. **Service Management** (`website-unified/app/(marketplace)/provider/services/page.tsx`)
   - Service list with status (active, paused, pending)
   - Edit service details
   - Toggle service availability
   - View detailed analytics per service
   - Manage API keys

4. **Analytics Dashboard** (`website-unified/components/marketplace/ProviderAnalytics.tsx`)
   - Revenue charts (daily, weekly, monthly)
   - Usage graphs (API calls over time)
   - User retention metrics
   - Top consumers list
   - Geographic distribution map

**Technical Requirements:**
- Form validation with Zod
- File upload for service documentation
- Real-time analytics updates
- Charts using Recharts or similar
- Export data to CSV functionality

**Deliverables:**
- 5+ provider dashboard pages
- Multi-step form component
- Analytics visualization components
- Revenue tracking interface

---

## PROMPT 3: SUBSCRIPTION & PAYMENT FLOW

**Context:** Implement end-to-end subscription management with x402 payment integration.

**Objective:** Create seamless subscription flow from discovery to payment to active usage.

**Requirements:**
1. **Service Details Page** (`website-unified/app/(marketplace)/service/[id]/page.tsx`)
   - Full service description
   - Provider reputation profile
   - Pricing tiers comparison table
   - API documentation preview
   - Usage examples and code snippets
   - Reviews and ratings section
   - Subscribe/Purchase CTAs

2. **Subscription Flow** (`website-unified/components/marketplace/SubscriptionFlow.tsx`)
   - Tier selection modal
   - Payment method selection (x402, crypto, credit card)
   - Terms acceptance
   - Subscription confirmation
   - API key generation
   - Quick start guide

3. **Payment Integration** (`website-unified/components/marketplace/PaymentProcessor.tsx`)
   - x402 protocol integration
   - Crypto wallet connection (MetaMask, WalletConnect)
   - Payment confirmation UI
   - Transaction tracking
   - Receipt generation

4. **Subscription Management** (`website-unified/app/(marketplace)/subscriptions/page.tsx`)
   - Active subscriptions list
   - Usage tracking per subscription
   - Upgrade/downgrade options
   - Cancel subscription flow
   - Billing history
   - API key management

**Technical Requirements:**
- Integration with packages/marketplace SDK
- Web3 wallet connection (wagmi/viem)
- x402 payment processing
- Subscription state management
- Webhook handling for payment confirmations

**Deliverables:**
- Complete subscription flow (5+ steps)
- Payment processing components
- Subscription management dashboard
- API key delivery system

---

## PROMPT 4: REPUTATION & REVIEW SYSTEM

**Context:** Build trust layer with on-chain reputation, reviews, and dispute resolution.

**Objective:** Create comprehensive reputation system integrating blockchain verification and user reviews.

**Requirements:**
1. **Reputation Display Components**
   - `ReputationBadge.tsx` - Visual reputation score (0-100)
   - `VerificationBadges.tsx` - On-chain verification, KYC status
   - `TrustIndicators.tsx` - Uptime %, response time, success rate

2. **Review System** (`website-unified/components/marketplace/ReviewSystem.tsx`)
   - Star rating (1-5)
   - Detailed review form (pros, cons, use case)
   - Image/video attachment support
   - Helpful votes on reviews
   - Provider responses to reviews
   - Review moderation flags

3. **Reputation Dashboard** (`website-unified/app/(marketplace)/reputation/page.tsx`)
   - Overall reputation score calculation
   - Breakdown by category (reliability, support, value)
   - Historical reputation chart
   - Recent reviews
   - Dispute history
   - Improvement suggestions

4. **Dispute Resolution** (`website-unified/components/marketplace/DisputeFlow.tsx`)
   - File dispute form
   - Evidence upload
   - Dispute status tracking
   - Mediator assignment
   - Resolution timeline
   - Escrow release/refund UI

**Technical Requirements:**
- On-chain reputation reading (ethers.js/viem)
- IPFS for review storage
- Real-time reputation updates
- Dispute smart contract integration
- Moderation queue for reviews

**Deliverables:**
- Reputation calculation engine
- Review submission and display
- Dispute resolution workflow
- Trust badge system

---

## PROMPT 5: MARKETPLACE ADMIN & MONITORING

**Context:** Create admin interface for marketplace management, service verification, and platform analytics.

**Objective:** Build comprehensive admin dashboard for marketplace operations.

**Requirements:**
1. **Admin Dashboard** (`website-unified/app/(marketplace)/admin/page.tsx`)
   - Platform-wide statistics
   - Revenue analytics (platform fees)
   - Service verification queue
   - User management
   - Dispute resolution queue
   - System health monitoring

2. **Service Verification** (`website-unified/app/(marketplace)/admin/verify/page.tsx`)
   - Pending services list
   - Service detail review
   - API endpoint testing interface
   - Documentation completeness check
   - Security audit checklist
   - Approve/reject with feedback

3. **Platform Analytics** (`website-unified/components/marketplace/PlatformAnalytics.tsx`)
   - Total GMV (Gross Marketplace Volume)
   - Active services/providers/consumers
   - Category breakdown
   - Growth metrics (DAU, MAU)
   - Top services by revenue
   - Churn analysis

4. **Admin Tools**
   - User role management
   - Service feature flags
   - Platform fee adjustment
   - Emergency service pause
   - Announcement system
   - Fraud detection alerts

**Technical Requirements:**
- Role-based access control (RBAC)
- Automated verification checks
- Real-time monitoring dashboard
- Admin action audit logs
- Bulk operations support

**Deliverables:**
- Complete admin dashboard
- Service verification workflow
- Platform analytics suite
- Admin tooling interface

---

**Integration Notes:**
- All components must integrate with existing `packages/marketplace` contracts
- Use consistent design system from `website-unified/components/ui`
- Implement proper error boundaries
- Follow accessibility guidelines (WCAG 2.1)
- Include loading skeletons for all async operations
- Add comprehensive TypeScript types
- Write unit tests for critical flows

**Success Criteria:**
- Users can discover, subscribe, and use services seamlessly
- Providers can register and manage services efficiently
- Reputation system builds trust and transparency
- Admin can verify and moderate marketplace effectively
- All flows work on mobile and desktop
- 100% TypeScript coverage
- Zero runtime errors in production
