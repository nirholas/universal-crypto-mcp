# AGENT 5: ANALYTICS DASHBOARD ADAPTATION
## 5-Phase Implementation Prompts

---

## PROMPT 1: PORTFOLIO ANALYTICS DASHBOARD

**Context:** Adapt existing analytics components to provide comprehensive portfolio tracking and performance analysis.

**Objective:** Build real-time portfolio analytics with historical performance, PnL tracking, and insights.

**Requirements:**
1. **Main Analytics Dashboard** (`website-unified/app/(analytics)/dashboard/page.tsx`)
   - Total portfolio value with 24h/7d/30d change
   - Asset allocation pie chart
   - Performance chart (line graph with timeframes)
   - Top gainers/losers in portfolio
   - Recent transactions summary
   - Quick stats cards (total gain, best performer, etc.)

2. **Performance Charts** (`website-unified/components/analytics/PerformanceChart.tsx`)
   - Interactive line chart with zoom
   - Multiple timeframes (1D, 1W, 1M, 3M, 1Y, ALL)
   - Compare to benchmarks (BTC, ETH, S&P500)
   - Drawdown visualization
   - Volume overlay option
   - Touch-friendly for mobile

3. **Asset Allocation** (`website-unified/components/analytics/AssetAllocation.tsx`)
   - Pie/donut chart by asset
   - Breakdown by chain
   - Breakdown by category (DeFi, NFT, stablecoins)
   - Target allocation vs actual
   - Rebalancing suggestions
   - Historical allocation changes

4. **PnL Calculator** (`website-unified/components/analytics/PnLCalculator.tsx`)
   - Realized vs unrealized gains
   - Cost basis tracking
   - Tax lot selection (FIFO, LIFO, HIFO)
   - Per-asset PnL breakdown
   - Currency conversion
   - Export for tax reporting

**Technical Stack:**
- Recharts or Lightweight Charts for visualization
- Date-fns for time calculations
- Real-time price feeds
- Historical data from CoinGecko/custom APIs
- TypeScript strict mode

**Deliverables:**
- Portfolio analytics dashboard
- Interactive chart components
- PnL tracking system
- Asset allocation visualizations

---

## PROMPT 2: MARKET ANALYTICS & RESEARCH

**Context:** Create comprehensive market research dashboard with real-time data from 17+ sources.

**Objective:** Build market analytics center for research, discovery, and trend analysis.

**Requirements:**
1. **Market Overview** (`website-unified/app/(analytics)/market/page.tsx`)
   - Global crypto market cap
   - BTC dominance chart
   - Fear & Greed Index
   - Top 100 tokens by market cap
   - Trending tokens (24h volume spike)
   - Recently added tokens
   - Market heatmap

2. **Token Research** (`website-unified/app/(analytics)/token/[symbol]/page.tsx`)
   - Price chart with indicators
   - Market cap and volume stats
   - Circulating/total supply
   - All-time high/low
   - Exchanges listing
   - Social stats (Twitter, Discord, Telegram)
   - On-chain metrics (holders, transactions)
   - Related tokens

3. **Watchlist System** (`website-unified/components/analytics/Watchlist.tsx`)
   - Create multiple watchlists
   - Drag-and-drop reorder
   - Price alerts setup
   - Custom columns selection
   - Quick compare view
   - Share watchlist
   - Import from CSV

4. **Market Screener** (`website-unified/components/analytics/MarketScreener.tsx`)
   - Filter by market cap range
   - Filter by volume
   - Filter by price change
   - Filter by sector/category
   - Custom formula filters
   - Save screening presets
   - Export results

**Technical Requirements:**
- Integration with packages/market-data (17 sources)
- CoinGecko, CoinMarketCap, DefiLlama APIs
- Real-time WebSocket price updates
- Efficient data caching
- Lazy loading for large lists

**Deliverables:**
- Market overview dashboard
- Token research pages
- Watchlist management
- Advanced market screener

---

## PROMPT 3: DEFI ANALYTICS & YIELD TRACKING

**Context:** Build DeFi-specific analytics for tracking positions, yields, and protocol performance.

**Objective:** Create DeFi dashboard showing all positions, yields, and opportunities across protocols.

**Requirements:**
1. **DeFi Positions Dashboard** (`website-unified/app/(analytics)/defi/page.tsx`)
   - All DeFi positions across protocols
   - Total value locked (TVL) personal
   - Active yields and APY
   - Claimable rewards
   - Health factors (lending)
   - Impermanent loss tracking
   - Protocol diversity score

2. **Yield Tracker** (`website-unified/components/analytics/YieldTracker.tsx`)
   - Current APY/APR per position
   - Historical yield chart
   - Projected earnings
   - Auto-compound calculations
   - Gas cost vs yield analysis
   - Yield farming opportunities
   - Risk-adjusted returns

3. **Protocol Analytics** (`website-unified/components/analytics/ProtocolAnalytics.tsx`)
   - Protocol TVL charts
   - Revenue and fees
   - User growth metrics
   - Smart contract audit status
   - Governance token performance
   - Compare protocols side-by-side
   - Risk ratings

4. **Impermanent Loss Calculator** (`website-unified/components/analytics/ILCalculator.tsx`)
   - Real-time IL calculation
   - Historical IL for positions
   - Break-even analysis
   - Fee earnings vs IL comparison
   - Scenario modeling
   - Exit strategy suggestions

**Technical Requirements:**
- DefiLlama API integration
- On-chain position reading
- Yield calculation engine
- Multi-protocol support (Aave, Compound, Uniswap, Curve)
- Real-time updates

**Deliverables:**
- DeFi positions dashboard
- Yield tracking system
- Protocol comparison tools
- IL calculator

---

## PROMPT 4: TRANSACTION ANALYTICS & TAX

**Context:** Create detailed transaction analysis with tax reporting capabilities.

**Objective:** Build transaction analytics for cost basis tracking, tax calculation, and audit preparation.

**Requirements:**
1. **Transaction Analytics** (`website-unified/app/(analytics)/transactions/page.tsx`)
   - All transactions across wallets
   - Transaction categorization
   - Volume analysis
   - Fee spending tracking
   - Failed transactions summary
   - Transaction patterns
   - Protocol interaction breakdown

2. **Tax Report Generator** (`website-unified/components/analytics/TaxReport.tsx`)
   - Capital gains calculation
   - Income tracking (staking, airdrops)
   - Cost basis methods (FIFO, LIFO, HIFO, ACB)
   - Short-term vs long-term gains
   - Loss harvesting opportunities
   - Multi-jurisdiction support
   - Export formats (TurboTax, Form 8949, etc.)

3. **Cost Basis Tracker** (`website-unified/components/analytics/CostBasis.tsx`)
   - Per-asset cost basis
   - Transaction-level tracking
   - Transfer between wallets handling
   - DeFi transaction categorization
   - Missing cost basis alerts
   - Manual adjustment interface

4. **Audit Trail** (`website-unified/components/analytics/AuditTrail.tsx`)
   - Complete transaction history
   - Source documentation
   - Calculation methodology
   - Data sources used
   - Export for accountants
   - Year-over-year comparison

**Technical Requirements:**
- Transaction parsing engine
- DeFi transaction decoding
- Tax calculation algorithms
- Report generation (PDF, CSV)
- Multi-year data storage

**Deliverables:**
- Transaction analytics dashboard
- Tax report generator
- Cost basis tracking
- Audit documentation

---

## PROMPT 5: ALERTS & NOTIFICATIONS SYSTEM

**Context:** Build comprehensive alert system for price, portfolio, and market events.

**Objective:** Create customizable notification system across all analytics features.

**Requirements:**
1. **Alerts Dashboard** (`website-unified/app/(analytics)/alerts/page.tsx`)
   - Active alerts list
   - Triggered alerts history
   - Create new alert wizard
   - Alert templates
   - Notification preferences
   - Alert performance (hit rate)

2. **Price Alerts** (`website-unified/components/analytics/PriceAlerts.tsx`)
   - Price above/below threshold
   - Percentage change alerts
   - Volume spike alerts
   - Moving average crossovers
   - Custom formula alerts
   - Multi-token conditions

3. **Portfolio Alerts** (`website-unified/components/analytics/PortfolioAlerts.tsx`)
   - Portfolio value thresholds
   - Allocation drift alerts
   - Position size warnings
   - DeFi health factor alerts
   - Liquidation warnings
   - Reward claim reminders

4. **Notification Delivery** (`website-unified/components/analytics/NotificationSystem.tsx`)
   - In-app notifications
   - Email notifications
   - Push notifications (PWA)
   - Telegram bot integration
   - Discord webhook
   - SMS (Twilio)
   - Notification history

**Technical Requirements:**
- Real-time price monitoring
- Alert evaluation engine
- Multiple delivery channels
- Rate limiting
- Quiet hours settings
- Deduplication logic

**Deliverables:**
- Alerts management system
- Price alert engine
- Portfolio monitoring
- Multi-channel notifications

---

**Integration Notes:**
- Use packages/market-data for price feeds
- Integrate with wallet context for positions
- Connect to DeFi protocols for position data
- Store alerts in database (Agent 13)
- WebSocket for real-time updates (Agent 11)

**Success Criteria:**
- Portfolio tracks accurately across all chains
- Market data updates in real-time
- DeFi positions show correct values and yields
- Tax reports are accurate and exportable
- Alerts fire reliably and promptly
- Dashboards load quickly with caching
- Mobile responsive charts
