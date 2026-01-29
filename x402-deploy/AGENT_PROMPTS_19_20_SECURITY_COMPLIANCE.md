# Agent 19 & 20: Security & Compliance

> Enterprise-grade security and regulatory compliance

---

## Agent 19: Security Hardening

**Goal:** Protect against attacks and secure payment flows

### Task 19.1: Fraud Detection System 🛡️

**File:** `src/security/fraud-detection.ts`

```typescript
import { Cache } from '../enterprise/cache.js';

export interface FraudRule {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  check: (context: FraudContext) => Promise<boolean>;
  action: 'log' | 'flag' | 'block';
}

export interface FraudContext {
  payer: `0x${string}`;
  amount: string;
  network: string;
  txHash?: `0x${string}`;
  ip: string;
  userAgent: string;
  route: string;
  timestamp: Date;
}

export interface FraudAlert {
  id: string;
  ruleId: string;
  context: FraudContext;
  severity: string;
  blocked: boolean;
  timestamp: Date;
}

export class FraudDetector {
  private rules: Map<string, FraudRule> = new Map();
  private alerts: FraudAlert[] = [];
  private cache: Cache;
  private blacklist: Set<string> = new Set();

  constructor(cache: Cache) {
    this.cache = cache;
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    // Rule 1: Detect duplicate transactions
    this.addRule({
      id: 'duplicate-tx',
      name: 'Duplicate Transaction',
      severity: 'high',
      check: async (ctx) => {
        if (!ctx.txHash) return false;
        const key = `tx:${ctx.txHash}`;
        const exists = await this.cache.get(key);
        if (exists) return true;
        await this.cache.set(key, true, 86400); // 24 hours
        return false;
      },
      action: 'block'
    });

    // Rule 2: Rate limiting per payer
    this.addRule({
      id: 'high-frequency',
      name: 'High Frequency Requests',
      severity: 'medium',
      check: async (ctx) => {
        const key = `freq:${ctx.payer}`;
        const count = (await this.cache.get<number>(key)) || 0;
        
        if (count > 100) return true; // > 100 requests per minute
        
        await this.cache.set(key, count + 1, 60);
        return false;
      },
      action: 'flag'
    });

    // Rule 3: Suspicious amount patterns
    this.addRule({
      id: 'suspicious-amount',
      name: 'Suspicious Amount Pattern',
      severity: 'medium',
      check: async (ctx) => {
        const amount = parseFloat(ctx.amount);
        
        // Very small amounts (dust attacks)
        if (amount < 0.0001) return true;
        
        // Suspiciously round numbers in large amounts
        if (amount > 1000 && amount % 1000 === 0) return true;
        
        return false;
      },
      action: 'flag'
    });

    // Rule 4: Geographic anomalies (VPN/Tor detection)
    this.addRule({
      id: 'vpn-detection',
      name: 'VPN/Proxy Detection',
      severity: 'low',
      check: async (ctx) => {
        // Check if IP is known VPN/proxy
        // This would integrate with a service like IPQualityScore
        const knownVPNs = ['10.0.0.0', '192.168.0.0']; // Placeholder
        return knownVPNs.some(vpn => ctx.ip.startsWith(vpn));
      },
      action: 'log'
    });

    // Rule 5: Blacklisted addresses
    this.addRule({
      id: 'blacklist',
      name: 'Blacklisted Address',
      severity: 'critical',
      check: async (ctx) => {
        return this.blacklist.has(ctx.payer.toLowerCase());
      },
      action: 'block'
    });

    // Rule 6: Rapid network switching
    this.addRule({
      id: 'network-hopping',
      name: 'Rapid Network Switching',
      severity: 'medium',
      check: async (ctx) => {
        const key = `networks:${ctx.payer}`;
        const networks = (await this.cache.get<string[]>(key)) || [];
        
        if (!networks.includes(ctx.network)) {
          networks.push(ctx.network);
          await this.cache.set(key, networks, 3600); // 1 hour
        }
        
        // Flag if using > 3 different networks in 1 hour
        return networks.length > 3;
      },
      action: 'flag'
    });

    // Rule 7: Bot detection via user agent
    this.addRule({
      id: 'bot-detection',
      name: 'Potential Bot Activity',
      severity: 'low',
      check: async (ctx) => {
        const botPatterns = [
          /bot/i,
          /crawler/i,
          /spider/i,
          /curl/i,
          /wget/i,
          /python-requests/i
        ];
        
        return botPatterns.some(pattern => pattern.test(ctx.userAgent));
      },
      action: 'log'
    });
  }

  addRule(rule: FraudRule): void {
    this.rules.set(rule.id, rule);
  }

  async checkFraud(context: FraudContext): Promise<{
    safe: boolean;
    alerts: FraudAlert[];
    blocked: boolean;
  }> {
    const alerts: FraudAlert[] = [];
    let blocked = false;

    for (const rule of this.rules.values()) {
      try {
        const triggered = await rule.check(context);
        
        if (triggered) {
          const alert: FraudAlert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            ruleId: rule.id,
            context,
            severity: rule.severity,
            blocked: rule.action === 'block',
            timestamp: new Date()
          };

          alerts.push(alert);
          this.alerts.push(alert);

          if (rule.action === 'block') {
            blocked = true;
          }

          // Auto-blacklist on critical violations
          if (rule.severity === 'critical' && rule.action === 'block') {
            this.blacklist.add(context.payer.toLowerCase());
          }
        }
      } catch (error) {
        console.error(`Fraud rule ${rule.id} failed:`, error);
      }
    }

    return {
      safe: !blocked,
      alerts,
      blocked
    };
  }

  getRecentAlerts(limit = 100): FraudAlert[] {
    return this.alerts.slice(-limit);
  }

  addToBlacklist(address: `0x${string}`): void {
    this.blacklist.add(address.toLowerCase());
  }

  removeFromBlacklist(address: `0x${string}`): void {
    this.blacklist.delete(address.toLowerCase());
  }

  isBlacklisted(address: `0x${string}`): boolean {
    return this.blacklist.has(address.toLowerCase());
  }
}

// Express middleware
export function fraudDetectionMiddleware(detector: FraudDetector) {
  return async (req: any, res: any, next: any) => {
    const payer = req.headers['x-payer-address'] as `0x${string}`;
    
    if (!payer) {
      return next();
    }

    const context: FraudContext = {
      payer,
      amount: req.headers['x-payment-amount'] || '0',
      network: req.headers['x-payment-network'] || 'unknown',
      txHash: req.headers['x-payment-tx'] as `0x${string}` | undefined,
      ip: req.ip || req.headers['x-forwarded-for'] as string || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      route: `${req.method} ${req.path}`,
      timestamp: new Date()
    };

    const result = await detector.checkFraud(context);

    if (result.blocked) {
      return res.status(403).json({
        error: 'Payment blocked due to fraud detection',
        alerts: result.alerts.map(a => ({
          rule: a.ruleId,
          severity: a.severity
        }))
      });
    }

    if (result.alerts.length > 0) {
      res.setHeader('X-Fraud-Alerts', result.alerts.length.toString());
    }

    next();
  };
}
```

---

### Task 19.2: Security Headers & CORS 🔒

**File:** `src/security/headers.ts`

```typescript
import helmet from 'helmet';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

export interface SecurityConfig {
  cors?: {
    origins: string[];
    credentials?: boolean;
  };
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  contentSecurityPolicy?: boolean;
}

export function securityMiddleware(config: SecurityConfig = {}) {
  const middleware: any[] = [];

  // Helmet for security headers
  middleware.push(helmet({
    contentSecurityPolicy: config.contentSecurityPolicy !== false ? {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    } : false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // CORS
  if (config.cors) {
    middleware.push(cors({
      origin: config.cors.origins,
      credentials: config.cors.credentials || false,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-payment', 'x-payer-address']
    }));
  }

  // Custom security headers
  middleware.push((req: Request, res: Response, next: NextFunction) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS filter
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
  });

  return middleware;
}

// Request sanitization
export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
  // Remove null bytes
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(/\0/g, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
}
```

---

### Task 19.3: Audit Logging 📝

**File:** `src/security/audit-log.ts`

```typescript
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface AuditEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: 'payment' | 'security' | 'access' | 'config' | 'admin';
  action: string;
  actor?: string;
  target?: string;
  details?: any;
  ip?: string;
  userAgent?: string;
}

export class AuditLogger {
  private logDir: string;
  private entries: AuditEntry[] = [];
  private maxMemoryEntries = 1000;

  constructor(logDir = './logs') {
    this.logDir = logDir;
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
  }

  log(entry: Omit<AuditEntry, 'timestamp'>): void {
    const fullEntry: AuditEntry = {
      timestamp: new Date(),
      ...entry
    };

    // Add to memory
    this.entries.push(fullEntry);
    if (this.entries.length > this.maxMemoryEntries) {
      this.entries.shift();
    }

    // Write to file
    this.writeToFile(fullEntry);

    // Console output for critical events
    if (entry.level === 'critical' || entry.level === 'error') {
      console.error('[AUDIT]', JSON.stringify(fullEntry));
    }
  }

  private writeToFile(entry: AuditEntry): void {
    const date = entry.timestamp.toISOString().split('T')[0];
    const filename = join(this.logDir, `audit-${date}.log`);
    
    const line = JSON.stringify(entry) + '\n';
    appendFileSync(filename, line);
  }

  // Convenience methods
  logPayment(details: {
    payer: string;
    amount: string;
    txHash: string;
    route: string;
  }): void {
    this.log({
      level: 'info',
      category: 'payment',
      action: 'payment_received',
      actor: details.payer,
      details
    });
  }

  logSecurityEvent(details: {
    event: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    actor?: string;
    ip?: string;
  }): void {
    this.log({
      level: details.severity === 'critical' ? 'critical' : 'warning',
      category: 'security',
      action: details.event,
      actor: details.actor,
      ip: details.ip,
      details
    });
  }

  logAccess(details: {
    path: string;
    method: string;
    actor?: string;
    ip?: string;
    status: number;
  }): void {
    this.log({
      level: details.status >= 400 ? 'warning' : 'info',
      category: 'access',
      action: 'api_access',
      actor: details.actor,
      ip: details.ip,
      details
    });
  }

  logConfigChange(details: {
    changed: string;
    oldValue?: any;
    newValue?: any;
    actor: string;
  }): void {
    this.log({
      level: 'warning',
      category: 'config',
      action: 'config_changed',
      actor: details.actor,
      details
    });
  }

  // Query methods
  getRecent(limit = 100): AuditEntry[] {
    return this.entries.slice(-limit);
  }

  filterByCategory(category: AuditEntry['category'], limit = 100): AuditEntry[] {
    return this.entries
      .filter(e => e.category === category)
      .slice(-limit);
  }

  filterByActor(actor: string, limit = 100): AuditEntry[] {
    return this.entries
      .filter(e => e.actor === actor)
      .slice(-limit);
  }
}

// Express middleware
export function auditMiddleware(logger: AuditLogger) {
  return (req: any, res: any, next: any) => {
    const start = Date.now();

    res.on('finish', () => {
      logger.logAccess({
        path: req.path,
        method: req.method,
        actor: req.headers['x-payer-address'],
        ip: req.ip || req.headers['x-forwarded-for'],
        status: res.statusCode
      });
    });

    next();
  };
}
```

---

## Agent 20: Compliance & KYC

**Goal:** Meet regulatory requirements for payment processing

### Task 20.1: KYC/AML Integration 👤

**File:** `src/compliance/kyc.ts`

```typescript
export interface KYCProvider {
  name: string;
  verify(address: `0x${string}`, userData?: any): Promise<KYCResult>;
}

export interface KYCResult {
  verified: boolean;
  level: 'none' | 'basic' | 'enhanced' | 'full';
  riskScore: number; // 0-100
  flags: string[];
  sanctions: boolean;
  pep: boolean; // Politically Exposed Person
  details?: any;
}

export class KYCManager {
  private providers: Map<string, KYCProvider> = new Map();
  private verifications: Map<string, KYCResult> = new Map();
  private required: boolean;

  constructor(options: { required?: boolean } = {}) {
    this.required = options.required || false;
  }

  registerProvider(provider: KYCProvider): void {
    this.providers.set(provider.name, provider);
  }

  async verifyUser(address: `0x${string}`, providerName?: string): Promise<KYCResult> {
    // Check cache
    const cached = this.verifications.get(address.toLowerCase());
    if (cached) return cached;

    // Get provider
    const provider = providerName 
      ? this.providers.get(providerName)
      : this.providers.values().next().value;

    if (!provider) {
      throw new Error('No KYC provider configured');
    }

    // Perform verification
    const result = await provider.verify(address);
    
    // Cache result
    this.verifications.set(address.toLowerCase(), result);

    return result;
  }

  async checkCompliance(address: `0x${string}`): Promise<{
    allowed: boolean;
    reason?: string;
    result?: KYCResult;
  }> {
    if (!this.required) {
      return { allowed: true };
    }

    try {
      const result = await this.verifyUser(address);

      // Check sanctions
      if (result.sanctions) {
        return {
          allowed: false,
          reason: 'Address on sanctions list',
          result
        };
      }

      // Check risk score
      if (result.riskScore > 80) {
        return {
          allowed: false,
          reason: 'High risk score',
          result
        };
      }

      // Check verification level
      if (result.level === 'none') {
        return {
          allowed: false,
          reason: 'KYC verification required',
          result
        };
      }

      return { allowed: true, result };
    } catch (error) {
      return {
        allowed: !this.required,
        reason: String(error)
      };
    }
  }

  middleware() {
    return async (req: any, res: any, next: any) => {
      if (!this.required) {
        return next();
      }

      const payer = req.headers['x-payer-address'] as `0x${string}`;
      if (!payer) {
        return res.status(400).json({ error: 'Missing x-payer-address' });
      }

      const check = await this.checkCompliance(payer);

      if (!check.allowed) {
        return res.status(403).json({
          error: 'Compliance check failed',
          reason: check.reason
        });
      }

      req.kyc = check.result;
      next();
    };
  }
}

// Example provider: Chainalysis
export class ChainalysisProvider implements KYCProvider {
  name = 'chainalysis';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async verify(address: `0x${string}`): Promise<KYCResult> {
    try {
      // Call Chainalysis API
      const response = await fetch(`https://api.chainalysis.com/api/risk/v2/entities/${address}`, {
        headers: {
          'X-API-Key': this.apiKey
        }
      });

      const data = await response.json();

      return {
        verified: true,
        level: this.mapRiskLevel(data.risk),
        riskScore: data.riskScore || 0,
        flags: data.alerts || [],
        sanctions: data.identifications?.some((id: any) => 
          id.category === 'sanctions'
        ) || false,
        pep: false,
        details: data
      };
    } catch (error) {
      return {
        verified: false,
        level: 'none',
        riskScore: 100,
        flags: ['verification_failed'],
        sanctions: false,
        pep: false
      };
    }
  }

  private mapRiskLevel(risk: string): KYCResult['level'] {
    switch (risk?.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'none';
      case 'medium':
        return 'basic';
      case 'low':
        return 'enhanced';
      default:
        return 'full';
    }
  }
}
```

---

### Task 20.2: Transaction Reporting 📊

**File:** `src/compliance/reporting.ts`

```typescript
import { writeFileSync } from 'fs';
import { PaymentRecord } from '../enterprise/database.js';

export interface ComplianceReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalTransactions: number;
    totalVolume: string;
    uniqueUsers: number;
    flaggedTransactions: number;
  };
  transactions: ReportTransaction[];
  suspicious: SuspiciousActivity[];
}

export interface ReportTransaction {
  timestamp: Date;
  payer: string;
  amount: string;
  network: string;
  txHash: string;
  kycLevel?: string;
  riskScore?: number;
}

export interface SuspiciousActivity {
  timestamp: Date;
  payer: string;
  activity: string;
  riskLevel: 'low' | 'medium' | 'high';
  details: any;
}

export class ComplianceReporter {
  async generateReport(
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceReport> {
    // Fetch transactions from database
    const transactions = await PaymentRecord.findAll({
      where: {
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    });

    const reportTransactions: ReportTransaction[] = transactions.map(tx => ({
      timestamp: tx.timestamp,
      payer: tx.payer,
      amount: tx.amount,
      network: tx.network,
      txHash: tx.txHash
    }));

    const uniqueUsers = new Set(transactions.map(tx => tx.payer)).size;
    const totalVolume = transactions.reduce(
      (sum, tx) => sum + parseFloat(tx.amount),
      0
    );

    return {
      period: {
        start: startDate,
        end: endDate
      },
      summary: {
        totalTransactions: transactions.length,
        totalVolume: totalVolume.toFixed(6),
        uniqueUsers,
        flaggedTransactions: 0 // TODO: Get from fraud detector
      },
      transactions: reportTransactions,
      suspicious: [] // TODO: Get from fraud detector
    };
  }

  async exportToCSV(report: ComplianceReport, filename: string): Promise<void> {
    const headers = [
      'Timestamp',
      'Payer',
      'Amount',
      'Network',
      'TxHash',
      'KYC Level',
      'Risk Score'
    ].join(',');

    const rows = report.transactions.map(tx =>
      [
        tx.timestamp.toISOString(),
        tx.payer,
        tx.amount,
        tx.network,
        tx.txHash,
        tx.kycLevel || 'N/A',
        tx.riskScore || 'N/A'
      ].join(',')
    );

    const csv = [headers, ...rows].join('\n');
    writeFileSync(filename, csv);
  }

  async exportSAR(suspicious: SuspiciousActivity[], filename: string): Promise<void> {
    // Suspicious Activity Report format
    const report = {
      reportType: 'SAR',
      generatedAt: new Date().toISOString(),
      activities: suspicious.map(activity => ({
        date: activity.timestamp.toISOString(),
        subject: activity.payer,
        activity: activity.activity,
        riskLevel: activity.riskLevel,
        details: activity.details
      }))
    };

    writeFileSync(filename, JSON.stringify(report, null, 2));
  }
}
```

---

### Task 20.3: Geographic Restrictions 🌍

**File:** `src/compliance/geo-restrictions.ts`

```typescript
export interface GeoConfig {
  allowedCountries?: string[];
  blockedCountries?: string[];
  requireVPN?: boolean;
}

export class GeoRestrictions {
  private config: GeoConfig;

  constructor(config: GeoConfig) {
    this.config = config;
  }

  async getCountryFromIP(ip: string): Promise<string | null> {
    try {
      // Use IP geolocation service
      const response = await fetch(`https://ipapi.co/${ip}/country_code/`);
      return response.text();
    } catch (error) {
      console.error('Failed to get country from IP:', error);
      return null;
    }
  }

  async isAllowed(ip: string): Promise<{
    allowed: boolean;
    country?: string;
    reason?: string;
  }> {
    const country = await this.getCountryFromIP(ip);

    if (!country) {
      return {
        allowed: true,
        reason: 'Could not determine country'
      };
    }

    // Check blocked countries
    if (this.config.blockedCountries?.includes(country)) {
      return {
        allowed: false,
        country,
        reason: `Country ${country} is blocked`
      };
    }

    // Check allowed countries
    if (this.config.allowedCountries && !this.config.allowedCountries.includes(country)) {
      return {
        allowed: false,
        country,
        reason: `Country ${country} is not in allowed list`
      };
    }

    return { allowed: true, country };
  }

  middleware() {
    return async (req: any, res: any, next: any) => {
      const ip = req.ip || req.headers['x-forwarded-for'] as string;
      
      if (!ip) {
        return next();
      }

      const check = await this.isAllowed(ip);

      if (!check.allowed) {
        return res.status(451).json({
          error: 'Unavailable for legal reasons',
          reason: check.reason,
          country: check.country
        });
      }

      req.geoCountry = check.country;
      next();
    };
  }
}

// OFAC Sanctions List
export const OFAC_BLOCKED_COUNTRIES = [
  'CU', // Cuba
  'IR', // Iran
  'KP', // North Korea
  'SY', // Syria
  'RU', // Russia (partial)
];
```

---

## Success Criteria

**Agent 19 Complete When:**
- ✅ Fraud detection with 7+ rules
- ✅ Security headers (helmet, CORS, CSP)
- ✅ Audit logging to file system
- ✅ Request sanitization
- ✅ Blacklist management

**Agent 20 Complete When:**
- ✅ KYC/AML integration framework
- ✅ Chainalysis provider implemented
- ✅ Compliance reporting (CSV, SAR)
- ✅ Geographic restrictions
- ✅ OFAC sanctions checking

---

**These features make x402-deploy legally compliant and secure! 🔒**
