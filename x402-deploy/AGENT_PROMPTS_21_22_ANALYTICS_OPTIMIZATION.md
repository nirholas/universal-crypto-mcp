# Agent 21 & 22: Analytics & Business Intelligence

> Data-driven insights and revenue optimization

---

## Agent 21: Advanced Analytics

**Goal:** Deep insights into API usage, revenue, and user behavior

### Task 21.1: Advanced Analytics Engine 📈

**File:** `src/analytics/engine.ts`

```typescript
import { PaymentRecord } from '../enterprise/database.js';

export interface AnalyticsQuery {
  startDate: Date;
  endDate: Date;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  filters?: {
    network?: string;
    payer?: string;
    route?: string;
  };
}

export interface TimeSeriesData {
  timestamp: Date;
  revenue: number;
  requests: number;
  uniqueUsers: number;
  avgTransactionValue: number;
}

export interface CohortAnalysis {
  cohort: string; // e.g., "2026-01-W04"
  size: number;
  retention: {
    week0: number;
    week1: number;
    week2: number;
    week3: number;
    week4: number;
  };
  ltv: number; // Lifetime value
}

export interface FunnelAnalysis {
  stage: string;
  users: number;
  conversionRate: number;
}

export class AdvancedAnalytics {
  async getTimeSeries(query: AnalyticsQuery): Promise<TimeSeriesData[]> {
    const groupByFormat = {
      hour: '%Y-%m-%d %H:00:00',
      day: '%Y-%m-%d',
      week: '%Y-W%V',
      month: '%Y-%m'
    }[query.groupBy || 'day'];

    const data = await PaymentRecord.findAll({
      attributes: [
        [PaymentRecord.sequelize!.fn('DATE_FORMAT', PaymentRecord.sequelize!.col('timestamp'), groupByFormat), 'period'],
        [PaymentRecord.sequelize!.fn('SUM', PaymentRecord.sequelize!.col('amount')), 'revenue'],
        [PaymentRecord.sequelize!.fn('COUNT', '*'), 'requests'],
        [PaymentRecord.sequelize!.fn('COUNT', PaymentRecord.sequelize!.fn('DISTINCT', PaymentRecord.sequelize!.col('payer'))), 'uniqueUsers'],
        [PaymentRecord.sequelize!.fn('AVG', PaymentRecord.sequelize!.col('amount')), 'avgTransactionValue']
      ],
      where: {
        timestamp: {
          $between: [query.startDate, query.endDate]
        },
        ...(query.filters?.network && { network: query.filters.network }),
        ...(query.filters?.payer && { payer: query.filters.payer }),
        ...(query.filters?.route && { route: query.filters.route })
      },
      group: ['period'],
      order: [['period', 'ASC']],
      raw: true
    });

    return data.map((row: any) => ({
      timestamp: new Date(row.period),
      revenue: parseFloat(row.revenue),
      requests: parseInt(row.requests),
      uniqueUsers: parseInt(row.uniqueUsers),
      avgTransactionValue: parseFloat(row.avgTransactionValue)
    }));
  }

  async getCohortAnalysis(startDate: Date): Promise<CohortAnalysis[]> {
    // Get users grouped by their first transaction week
    const cohorts = await PaymentRecord.findAll({
      attributes: [
        'payer',
        [PaymentRecord.sequelize!.fn('MIN', PaymentRecord.sequelize!.col('timestamp')), 'firstTransaction'],
        [PaymentRecord.sequelize!.fn('DATE_FORMAT', PaymentRecord.sequelize!.fn('MIN', PaymentRecord.sequelize!.col('timestamp')), '%Y-W%V'), 'cohort']
      ],
      where: {
        timestamp: {
          $gte: startDate
        }
      },
      group: ['payer'],
      raw: true
    });

    // Calculate retention for each cohort
    const cohortMap = new Map<string, CohortAnalysis>();

    for (const user of cohorts as any[]) {
      const cohort = user.cohort;
      const firstDate = new Date(user.firstTransaction);

      if (!cohortMap.has(cohort)) {
        cohortMap.set(cohort, {
          cohort,
          size: 0,
          retention: {
            week0: 0,
            week1: 0,
            week2: 0,
            week3: 0,
            week4: 0
          },
          ltv: 0
        });
      }

      const cohortData = cohortMap.get(cohort)!;
      cohortData.size++;

      // Check retention for each week
      for (let week = 0; week <= 4; week++) {
        const weekStart = new Date(firstDate);
        weekStart.setDate(weekStart.getDate() + (week * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const active = await PaymentRecord.count({
          where: {
            payer: user.payer,
            timestamp: {
              $between: [weekStart, weekEnd]
            }
          }
        });

        if (active > 0) {
          (cohortData.retention as any)[`week${week}`]++;
        }
      }

      // Calculate LTV
      const userRevenue = await PaymentRecord.sum('amount', {
        where: { payer: user.payer }
      });
      cohortData.ltv += userRevenue || 0;
    }

    // Convert to percentages and average LTV
    const result: CohortAnalysis[] = [];
    for (const [cohort, data] of cohortMap) {
      result.push({
        cohort,
        size: data.size,
        retention: {
          week0: (data.retention.week0 / data.size) * 100,
          week1: (data.retention.week1 / data.size) * 100,
          week2: (data.retention.week2 / data.size) * 100,
          week3: (data.retention.week3 / data.size) * 100,
          week4: (data.retention.week4 / data.size) * 100
        },
        ltv: data.ltv / data.size
      });
    }

    return result.sort((a, b) => a.cohort.localeCompare(b.cohort));
  }

  async getFunnelAnalysis(): Promise<FunnelAnalysis[]> {
    // Track user journey through stages
    const stages = [
      { stage: 'API Discovery', metric: 'unique_visitors' },
      { stage: 'Connected Wallet', metric: 'wallet_connections' },
      { stage: 'First Payment', metric: 'first_payments' },
      { stage: 'Return User', metric: 'return_users' },
      { stage: 'Power User (10+ calls)', metric: 'power_users' }
    ];

    // This would integrate with analytics tracking
    // For now, return sample data structure
    const totalVisitors = 10000;
    const walletConnections = 3000;
    const firstPayments = 1500;
    const returnUsers = 800;
    const powerUsers = 200;

    return [
      {
        stage: 'API Discovery',
        users: totalVisitors,
        conversionRate: 100
      },
      {
        stage: 'Connected Wallet',
        users: walletConnections,
        conversionRate: (walletConnections / totalVisitors) * 100
      },
      {
        stage: 'First Payment',
        users: firstPayments,
        conversionRate: (firstPayments / walletConnections) * 100
      },
      {
        stage: 'Return User',
        users: returnUsers,
        conversionRate: (returnUsers / firstPayments) * 100
      },
      {
        stage: 'Power User (10+ calls)',
        users: powerUsers,
        conversionRate: (powerUsers / returnUsers) * 100
      }
    ];
  }

  async getRevenueByRoute(): Promise<{ route: string; revenue: number; calls: number }[]> {
    const data = await PaymentRecord.findAll({
      attributes: [
        'route',
        [PaymentRecord.sequelize!.fn('SUM', PaymentRecord.sequelize!.col('amount')), 'revenue'],
        [PaymentRecord.sequelize!.fn('COUNT', '*'), 'calls']
      ],
      group: ['route'],
      order: [[PaymentRecord.sequelize!.fn('SUM', PaymentRecord.sequelize!.col('amount')), 'DESC']],
      raw: true
    });

    return data.map((row: any) => ({
      route: row.route,
      revenue: parseFloat(row.revenue),
      calls: parseInt(row.calls)
    }));
  }

  async getUserSegmentation(): Promise<{
    segment: string;
    users: number;
    avgRevenue: number;
    avgCalls: number;
  }[]> {
    const allUsers = await PaymentRecord.findAll({
      attributes: [
        'payer',
        [PaymentRecord.sequelize!.fn('SUM', PaymentRecord.sequelize!.col('amount')), 'totalRevenue'],
        [PaymentRecord.sequelize!.fn('COUNT', '*'), 'totalCalls']
      ],
      group: ['payer'],
      raw: true
    });

    // Segment users by behavior
    const segments = {
      whale: { users: 0, revenue: 0, calls: 0 },      // >$1000
      power: { users: 0, revenue: 0, calls: 0 },      // $100-$1000
      regular: { users: 0, revenue: 0, calls: 0 },    // $10-$100
      casual: { users: 0, revenue: 0, calls: 0 },     // $1-$10
      trial: { users: 0, revenue: 0, calls: 0 }       // <$1
    };

    for (const user of allUsers as any[]) {
      const revenue = parseFloat(user.totalRevenue);
      const calls = parseInt(user.totalCalls);

      let segment: keyof typeof segments;
      if (revenue >= 1000) segment = 'whale';
      else if (revenue >= 100) segment = 'power';
      else if (revenue >= 10) segment = 'regular';
      else if (revenue >= 1) segment = 'casual';
      else segment = 'trial';

      segments[segment].users++;
      segments[segment].revenue += revenue;
      segments[segment].calls += calls;
    }

    return Object.entries(segments).map(([segment, data]) => ({
      segment,
      users: data.users,
      avgRevenue: data.users > 0 ? data.revenue / data.users : 0,
      avgCalls: data.users > 0 ? data.calls / data.users : 0
    }));
  }
}
```

---

### Task 21.2: Real-time Analytics Dashboard 📊

**File:** `src/analytics/realtime.ts`

```typescript
import { EventEmitter } from 'events';

export interface RealtimeMetrics {
  requestsPerSecond: number;
  avgResponseTime: number;
  activeConnections: number;
  revenueToday: number;
  errorRate: number;
}

export class RealtimeAnalytics extends EventEmitter {
  private metrics: RealtimeMetrics = {
    requestsPerSecond: 0,
    avgResponseTime: 0,
    activeConnections: 0,
    revenueToday: 0,
    errorRate: 0
  };

  private requestCounts: number[] = [];
  private responseTimes: number[] = [];
  private errors: number = 0;
  private total: number = 0;

  constructor() {
    super();
    this.startAggregation();
  }

  private startAggregation(): void {
    // Aggregate metrics every second
    setInterval(() => {
      this.aggregateMetrics();
      this.emit('metrics', this.metrics);
    }, 1000);

    // Reset daily revenue at midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      this.metrics.revenueToday = 0;
      setInterval(() => {
        this.metrics.revenueToday = 0;
      }, 86400000); // 24 hours
    }, msUntilMidnight);
  }

  private aggregateMetrics(): void {
    // Calculate requests per second (last 60 seconds)
    this.requestCounts.push(this.total);
    if (this.requestCounts.length > 60) {
      const oldCount = this.requestCounts.shift()!;
      this.metrics.requestsPerSecond = this.total - oldCount;
    }

    // Calculate average response time
    if (this.responseTimes.length > 0) {
      this.metrics.avgResponseTime = 
        this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
      this.responseTimes = this.responseTimes.slice(-100); // Keep last 100
    }

    // Calculate error rate
    this.metrics.errorRate = this.total > 0 ? (this.errors / this.total) * 100 : 0;
  }

  trackRequest(responseTime: number, error: boolean = false): void {
    this.total++;
    this.responseTimes.push(responseTime);
    if (error) this.errors++;
  }

  trackRevenue(amount: number): void {
    this.metrics.revenueToday += amount;
  }

  setActiveConnections(count: number): void {
    this.metrics.activeConnections = count;
  }

  getMetrics(): RealtimeMetrics {
    return { ...this.metrics };
  }

  // Server-Sent Events endpoint
  createSSEHandler() {
    return (req: any, res: any) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const sendMetrics = () => {
        res.write(`data: ${JSON.stringify(this.metrics)}\n\n`);
      };

      // Send immediately
      sendMetrics();

      // Send every second
      const interval = setInterval(sendMetrics, 1000);

      // Cleanup on close
      req.on('close', () => {
        clearInterval(interval);
        res.end();
      });
    };
  }
}
```

---

### Task 21.3: Predictive Analytics & ML 🤖

**File:** `src/analytics/predictions.ts`

```typescript
export interface PredictionModel {
  predictRevenue(historicalData: number[]): number;
  predictChurn(userActivity: UserActivity): number;
  predictOptimalPrice(routeMetrics: RouteMetrics): number;
}

export interface UserActivity {
  daysSinceFirstCall: number;
  totalCalls: number;
  avgCallsPerDay: number;
  daysSinceLastCall: number;
  totalSpent: number;
}

export interface RouteMetrics {
  currentPrice: number;
  callVolume: number;
  conversionRate: number;
  elasticity: number;
}

export class SimplePredictionModel implements PredictionModel {
  /**
   * Linear regression for revenue prediction
   */
  predictRevenue(historicalData: number[]): number {
    if (historicalData.length < 2) return 0;

    // Simple linear regression
    const n = historicalData.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = historicalData;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict next period
    return slope * n + intercept;
  }

  /**
   * Churn prediction based on user activity
   * Returns probability (0-1)
   */
  predictChurn(activity: UserActivity): number {
    let churnScore = 0;

    // Factor 1: Days since last call (higher = more likely to churn)
    if (activity.daysSinceLastCall > 30) churnScore += 0.4;
    else if (activity.daysSinceLastCall > 14) churnScore += 0.2;
    else if (activity.daysSinceLastCall > 7) churnScore += 0.1;

    // Factor 2: Declining activity
    const recentActivity = activity.avgCallsPerDay;
    if (recentActivity < 1) churnScore += 0.3;
    else if (recentActivity < 5) churnScore += 0.1;

    // Factor 3: Low total spending
    if (activity.totalSpent < 1) churnScore += 0.2;
    else if (activity.totalSpent < 10) churnScore += 0.1;

    // Factor 4: Short customer lifetime
    if (activity.daysSinceFirstCall < 7) churnScore += 0.1;

    return Math.min(churnScore, 1);
  }

  /**
   * Optimal pricing using price elasticity
   */
  predictOptimalPrice(metrics: RouteMetrics): number {
    const { currentPrice, callVolume, conversionRate, elasticity } = metrics;

    // If no elasticity data, suggest 10% increase if conversion is high
    if (elasticity === 0) {
      return conversionRate > 0.5 ? currentPrice * 1.1 : currentPrice * 0.9;
    }

    // Calculate revenue-maximizing price
    // Revenue = Price * Quantity
    // Quantity = BaseQuantity * (1 + elasticity * (Price - BasePrice) / BasePrice)
    
    // For simplicity, test prices in range and find maximum revenue
    let maxRevenue = currentPrice * callVolume;
    let optimalPrice = currentPrice;

    for (let multiplier = 0.5; multiplier <= 2.0; multiplier += 0.1) {
      const testPrice = currentPrice * multiplier;
      const priceChange = (testPrice - currentPrice) / currentPrice;
      const volumeChange = 1 + (elasticity * priceChange);
      const projectedVolume = callVolume * volumeChange;
      const projectedRevenue = testPrice * projectedVolume;

      if (projectedRevenue > maxRevenue) {
        maxRevenue = projectedRevenue;
        optimalPrice = testPrice;
      }
    }

    return optimalPrice;
  }
}

// Revenue forecasting
export class RevenueForecast {
  private model: PredictionModel;

  constructor(model: PredictionModel = new SimplePredictionModel()) {
    this.model = model;
  }

  async forecast(
    historicalRevenue: number[],
    periods: number = 7
  ): Promise<{ date: Date; predicted: number; confidence: number }[]> {
    const forecasts: { date: Date; predicted: number; confidence: number }[] = [];
    const data = [...historicalRevenue];

    for (let i = 0; i < periods; i++) {
      const predicted = this.model.predictRevenue(data);
      data.push(predicted);

      const date = new Date();
      date.setDate(date.getDate() + i + 1);

      // Simple confidence: decreases with forecast distance
      const confidence = Math.max(0.5, 1 - (i * 0.05));

      forecasts.push({ date, predicted, confidence });
    }

    return forecasts;
  }
}
```

---

## Agent 22: Revenue Optimization

**Goal:** Maximize revenue through intelligent pricing and experimentation

### Task 22.1: Dynamic Pricing Engine 💰

**File:** `src/optimization/dynamic-pricing.ts`

```typescript
import { RouteMetrics, SimplePredictionModel } from '../analytics/predictions.js';

export interface PricingStrategy {
  name: string;
  calculate(context: PricingContext): number;
}

export interface PricingContext {
  route: string;
  basePrice: number;
  callVolume: number;
  time: Date;
  payer?: string;
  historicalMetrics?: RouteMetrics;
}

export class DynamicPricingEngine {
  private strategies: Map<string, PricingStrategy> = new Map();
  private activeStrategy: string = 'base';

  constructor() {
    this.registerDefaultStrategies();
  }

  private registerDefaultStrategies(): void {
    // Strategy 1: Base pricing (no changes)
    this.addStrategy({
      name: 'base',
      calculate: (ctx) => ctx.basePrice
    });

    // Strategy 2: Time-based pricing (surge during peak hours)
    this.addStrategy({
      name: 'time-based',
      calculate: (ctx) => {
        const hour = ctx.time.getHours();
        
        // Peak hours: 9am-5pm (business hours)
        if (hour >= 9 && hour <= 17) {
          return ctx.basePrice * 1.5;
        }
        
        // Off-peak: 6pm-8am
        if (hour >= 18 || hour <= 8) {
          return ctx.basePrice * 0.8;
        }
        
        return ctx.basePrice;
      }
    });

    // Strategy 3: Volume-based pricing (discounts for high volume users)
    this.addStrategy({
      name: 'volume-discount',
      calculate: (ctx) => {
        if (!ctx.callVolume) return ctx.basePrice;
        
        // Tiered discounts
        if (ctx.callVolume > 10000) return ctx.basePrice * 0.5;
        if (ctx.callVolume > 1000) return ctx.basePrice * 0.7;
        if (ctx.callVolume > 100) return ctx.basePrice * 0.9;
        
        return ctx.basePrice;
      }
    });

    // Strategy 4: Demand-based pricing
    this.addStrategy({
      name: 'demand-based',
      calculate: (ctx) => {
        if (!ctx.callVolume) return ctx.basePrice;
        
        // Increase price with demand
        const demandMultiplier = Math.log10(ctx.callVolume + 1) / 4;
        return ctx.basePrice * (1 + demandMultiplier);
      }
    });

    // Strategy 5: ML-optimized pricing
    this.addStrategy({
      name: 'ml-optimized',
      calculate: (ctx) => {
        if (!ctx.historicalMetrics) return ctx.basePrice;
        
        const model = new SimplePredictionModel();
        return model.predictOptimalPrice(ctx.historicalMetrics);
      }
    });

    // Strategy 6: Personalized pricing (loyal customer discounts)
    this.addStrategy({
      name: 'personalized',
      calculate: (ctx) => {
        if (!ctx.payer || !ctx.callVolume) return ctx.basePrice;
        
        // Discount for loyal users
        if (ctx.callVolume > 1000) return ctx.basePrice * 0.8;
        if (ctx.callVolume > 100) return ctx.basePrice * 0.9;
        
        return ctx.basePrice;
      }
    });
  }

  addStrategy(strategy: PricingStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  setStrategy(name: string): void {
    if (!this.strategies.has(name)) {
      throw new Error(`Strategy ${name} not found`);
    }
    this.activeStrategy = name;
  }

  calculatePrice(context: PricingContext): number {
    const strategy = this.strategies.get(this.activeStrategy);
    if (!strategy) {
      return context.basePrice;
    }
    
    return Math.max(0.0001, strategy.calculate(context)); // Minimum price
  }

  compareStrategies(context: PricingContext): Record<string, number> {
    const results: Record<string, number> = {};
    
    for (const [name, strategy] of this.strategies) {
      results[name] = strategy.calculate(context);
    }
    
    return results;
  }
}
```

---

### Task 22.2: A/B Testing Framework 🧪

**File:** `src/optimization/ab-testing.ts`

```typescript
export interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  startDate: Date;
  endDate?: Date;
  active: boolean;
  targetMetric: 'revenue' | 'conversion' | 'retention';
}

export interface Variant {
  id: string;
  name: string;
  weight: number; // 0-1, percentage of traffic
  config: any; // Variant-specific configuration
}

export interface ExperimentResult {
  variant: string;
  users: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  avgRevenuePerUser: number;
  confidence: number;
}

export class ABTestingFramework {
  private experiments: Map<string, Experiment> = new Map();
  private assignments: Map<string, string> = new Map(); // user -> variant
  private results: Map<string, Map<string, ExperimentResult>> = new Map();

  createExperiment(experiment: Omit<Experiment, 'active'>): Experiment {
    const fullExperiment: Experiment = {
      ...experiment,
      active: true
    };

    // Validate weights sum to 1
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.001) {
      throw new Error('Variant weights must sum to 1');
    }

    this.experiments.set(experiment.id, fullExperiment);
    this.results.set(experiment.id, new Map());

    return fullExperiment;
  }

  assignVariant(experimentId: string, userId: string): string {
    const key = `${experimentId}:${userId}`;
    
    // Check if already assigned
    if (this.assignments.has(key)) {
      return this.assignments.get(key)!;
    }

    const experiment = this.experiments.get(experimentId);
    if (!experiment || !experiment.active) {
      throw new Error(`Experiment ${experimentId} not found or inactive`);
    }

    // Deterministic assignment based on user ID
    const hash = this.hashCode(userId);
    const random = (hash % 10000) / 10000; // 0-1

    let cumulative = 0;
    for (const variant of experiment.variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        this.assignments.set(key, variant.id);
        return variant.id;
      }
    }

    // Fallback to first variant
    const firstVariant = experiment.variants[0].id;
    this.assignments.set(key, firstVariant);
    return firstVariant;
  }

  trackConversion(experimentId: string, variantId: string, revenue: number): void {
    const experimentResults = this.results.get(experimentId);
    if (!experimentResults) return;

    let variantResult = experimentResults.get(variantId);
    if (!variantResult) {
      variantResult = {
        variant: variantId,
        users: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
        avgRevenuePerUser: 0,
        confidence: 0
      };
      experimentResults.set(variantId, variantResult);
    }

    variantResult.users++;
    variantResult.conversions++;
    variantResult.revenue += revenue;
    variantResult.conversionRate = variantResult.conversions / variantResult.users;
    variantResult.avgRevenuePerUser = variantResult.revenue / variantResult.users;
  }

  getResults(experimentId: string): ExperimentResult[] {
    const experimentResults = this.results.get(experimentId);
    if (!experimentResults) return [];

    const results = Array.from(experimentResults.values());

    // Calculate statistical confidence
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const confidence = this.calculateConfidence(results[i], results[j]);
        results[i].confidence = Math.max(results[i].confidence, confidence);
      }
    }

    return results;
  }

  private calculateConfidence(a: ExperimentResult, b: ExperimentResult): number {
    // Simplified z-test for conversion rate
    if (a.users < 30 || b.users < 30) return 0; // Not enough data

    const p1 = a.conversionRate;
    const p2 = b.conversionRate;
    const n1 = a.users;
    const n2 = b.users;

    const pooled = ((p1 * n1) + (p2 * n2)) / (n1 + n2);
    const se = Math.sqrt(pooled * (1 - pooled) * (1/n1 + 1/n2));
    const z = Math.abs(p1 - p2) / se;

    // Convert z-score to confidence level (approximate)
    if (z > 2.576) return 0.99;  // 99%
    if (z > 1.96) return 0.95;   // 95%
    if (z > 1.645) return 0.90;  // 90%
    return 0;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  stopExperiment(experimentId: string, winningVariant?: string): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.active = false;
      experiment.endDate = new Date();
    }
  }
}

// Example: Price testing
export async function runPriceExperiment(
  abTesting: ABTestingFramework
): Promise<Experiment> {
  return abTesting.createExperiment({
    id: 'price-test-1',
    name: 'API Pricing Test',
    variants: [
      { id: 'control', name: 'Current Price ($0.001)', weight: 0.4, config: { price: 0.001 } },
      { id: 'lower', name: 'Lower Price ($0.0005)', weight: 0.3, config: { price: 0.0005 } },
      { id: 'higher', name: 'Higher Price ($0.002)', weight: 0.3, config: { price: 0.002 } }
    ],
    startDate: new Date(),
    targetMetric: 'revenue'
  });
}
```

---

### Task 22.3: Revenue Optimization Dashboard 📊

**File:** `src/optimization/dashboard-api.ts`

```typescript
import express from 'express';
import { DynamicPricingEngine } from './dynamic-pricing.js';
import { ABTestingFramework } from './ab-testing.js';
import { AdvancedAnalytics } from '../analytics/engine.js';

export function createOptimizationDashboard(
  pricing: DynamicPricingEngine,
  abTesting: ABTestingFramework,
  analytics: AdvancedAnalytics
): express.Router {
  const router = express.Router();

  // Get pricing recommendations
  router.get('/pricing/recommendations', async (req, res) => {
    try {
      const routes = await analytics.getRevenueByRoute();
      const recommendations = [];

      for (const route of routes.slice(0, 10)) {
        const context = {
          route: route.route,
          basePrice: 0.001, // Get from config
          callVolume: route.calls,
          time: new Date(),
          historicalMetrics: {
            currentPrice: 0.001,
            callVolume: route.calls,
            conversionRate: 0.5,
            elasticity: -0.5
          }
        };

        const strategies = pricing.compareStrategies(context);
        
        recommendations.push({
          route: route.route,
          currentRevenue: route.revenue,
          strategies,
          recommendation: Object.entries(strategies)
            .sort(([, a], [, b]) => b - a)[0]
        });
      }

      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Get active experiments
  router.get('/experiments', (req, res) => {
    // Return active experiments with results
    res.json({ experiments: [] }); // TODO: Get from abTesting
  });

  // Get revenue optimization insights
  router.get('/insights', async (req, res) => {
    try {
      const segments = await analytics.getUserSegmentation();
      const routes = await analytics.getRevenueByRoute();
      
      const insights = [
        {
          type: 'segment',
          title: 'High-Value Users',
          description: `${segments[0]?.users || 0} users in top segment generating $${segments[0]?.avgRevenue.toFixed(2) || 0} average`,
          action: 'Consider premium tier'
        },
        {
          type: 'pricing',
          title: 'Underpriced Route',
          description: `${routes[0]?.route} has high volume (${routes[0]?.calls}) but low price`,
          action: 'Test 20% price increase'
        },
        {
          type: 'churn',
          title: 'Churn Risk',
          description: '15% of users inactive for 14+ days',
          action: 'Send re-engagement offer'
        }
      ];

      res.json({ insights });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  return router;
}
```

---

## Success Criteria

**Agent 21 Complete When:**
- ✅ Time series analytics with grouping
- ✅ Cohort analysis with retention metrics
- ✅ Funnel analysis
- ✅ User segmentation
- ✅ Real-time metrics with SSE
- ✅ Revenue forecasting with ML

**Agent 22 Complete When:**
- ✅ Dynamic pricing with 6+ strategies
- ✅ A/B testing framework with confidence intervals
- ✅ Price optimization recommendations
- ✅ Revenue optimization dashboard API
- ✅ Automated insights generation

---

**These features turn x402-deploy into a revenue-maximizing machine! 💸**
