/**
 * Alerting System
 * Production-grade alerting for x402-deploy
 */

export interface AlertConfig {
  webhook?: string;
  email?: string;
  slack?: string;
  discord?: string;
  pagerduty?: string;
  throttle?: {
    enabled: boolean;
    windowMs: number; // Time window in ms
    maxAlerts: number; // Max alerts per window
  };
}

export type AlertLevel = "info" | "warning" | "critical";

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  timestamp: Date;
  source?: string;
  metadata?: Record<string, unknown>;
  acknowledged?: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: () => boolean | Promise<boolean>;
  level: AlertLevel;
  title: string;
  message: string | (() => string);
  cooldownMs: number; // Minimum time between alerts for this rule
  enabled: boolean;
}

interface ThrottleState {
  count: number;
  windowStart: number;
}

/**
 * Alert Manager for x402-deploy
 * Handles alert routing to multiple channels
 */
export class AlertManager {
  private config: AlertConfig;
  private recentAlerts: Alert[] = [];
  private rules: Map<string, AlertRule> = new Map();
  private lastAlertTime: Map<string, number> = new Map();
  private throttleState: ThrottleState = { count: 0, windowStart: Date.now() };
  private alertListeners: ((alert: Alert) => void)[] = [];

  constructor(config: AlertConfig) {
    this.config = config;
  }

  /**
   * Send an alert to all configured channels
   */
  async sendAlert(alert: Omit<Alert, "id" | "timestamp">): Promise<Alert> {
    // Check throttling
    if (this.config.throttle?.enabled && !this.checkThrottle()) {
      console.warn("Alert throttled:", alert.title);
      throw new Error("Alert throttled - too many alerts in time window");
    }

    const fullAlert: Alert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(),
    };

    this.recentAlerts.push(fullAlert);

    // Keep only last 100 alerts
    if (this.recentAlerts.length > 100) {
      this.recentAlerts.shift();
    }

    // Notify listeners
    for (const listener of this.alertListeners) {
      try {
        listener(fullAlert);
      } catch (error) {
        console.error("Alert listener error:", error);
      }
    }

    // Send to configured channels
    const promises: Promise<void>[] = [];

    if (this.config.webhook) {
      promises.push(this.sendWebhook(fullAlert));
    }

    if (this.config.slack) {
      promises.push(this.sendSlack(fullAlert));
    }

    if (this.config.discord) {
      promises.push(this.sendDiscord(fullAlert));
    }

    if (this.config.pagerduty && alert.level === "critical") {
      promises.push(this.sendPagerDuty(fullAlert));
    }

    await Promise.allSettled(promises);

    return fullAlert;
  }

  /**
   * Check if we're within throttle limits
   */
  private checkThrottle(): boolean {
    if (!this.config.throttle?.enabled) {
      return true;
    }

    const now = Date.now();
    const { windowMs, maxAlerts } = this.config.throttle;

    // Reset window if expired
    if (now - this.throttleState.windowStart > windowMs) {
      this.throttleState = { count: 0, windowStart: now };
    }

    // Check if under limit
    if (this.throttleState.count < maxAlerts) {
      this.throttleState.count++;
      return true;
    }

    return false;
  }

  /**
   * Send alert to a webhook
   */
  private async sendWebhook(alert: Alert): Promise<void> {
    try {
      await fetch(this.config.webhook!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...alert,
          timestamp: alert.timestamp.toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send webhook alert:", error);
    }
  }

  /**
   * Send alert to Slack
   */
  private async sendSlack(alert: Alert): Promise<void> {
    const color: Record<AlertLevel, string> = {
      info: "#36a64f",
      warning: "#ff9800",
      critical: "#ff0000",
    };

    const emoji: Record<AlertLevel, string> = {
      info: "ℹ️",
      warning: "⚠️",
      critical: "🚨",
    };

    try {
      await fetch(this.config.slack!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attachments: [
            {
              color: color[alert.level],
              title: `${emoji[alert.level]} ${alert.title}`,
              text: alert.message,
              footer: `x402-deploy | ${alert.source || "system"}`,
              ts: Math.floor(alert.timestamp.getTime() / 1000),
              fields: alert.metadata
                ? Object.entries(alert.metadata).map(([key, value]) => ({
                    title: key,
                    value: String(value),
                    short: true,
                  }))
                : undefined,
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Failed to send Slack alert:", error);
    }
  }

  /**
   * Send alert to Discord
   */
  private async sendDiscord(alert: Alert): Promise<void> {
    const color: Record<AlertLevel, number> = {
      info: 0x36a64f,
      warning: 0xff9800,
      critical: 0xff0000,
    };

    const emoji: Record<AlertLevel, string> = {
      info: "ℹ️",
      warning: "⚠️",
      critical: "🚨",
    };

    try {
      await fetch(this.config.discord!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: `${emoji[alert.level]} ${alert.title}`,
              description: alert.message,
              color: color[alert.level],
              timestamp: alert.timestamp.toISOString(),
              footer: {
                text: `x402-deploy | ${alert.source || "system"}`,
              },
              fields: alert.metadata
                ? Object.entries(alert.metadata).map(([name, value]) => ({
                    name,
                    value: String(value),
                    inline: true,
                  }))
                : undefined,
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Failed to send Discord alert:", error);
    }
  }

  /**
   * Send alert to PagerDuty
   */
  private async sendPagerDuty(alert: Alert): Promise<void> {
    try {
      await fetch("https://events.pagerduty.com/v2/enqueue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routing_key: this.config.pagerduty!,
          event_action: "trigger",
          payload: {
            summary: alert.title,
            severity: alert.level === "critical" ? "critical" : "warning",
            source: alert.source || "x402-deploy",
            custom_details: {
              message: alert.message,
              ...alert.metadata,
            },
          },
        }),
      });
    } catch (error) {
      console.error("Failed to send PagerDuty alert:", error);
    }
  }

  /**
   * Add an alert listener
   */
  onAlert(listener: (alert: Alert) => void): () => void {
    this.alertListeners.push(listener);
    return () => {
      const index = this.alertListeners.indexOf(listener);
      if (index !== -1) {
        this.alertListeners.splice(index, 1);
      }
    };
  }

  /**
   * Add an alert rule
   */
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove an alert rule
   */
  removeRule(id: string): void {
    this.rules.delete(id);
  }

  /**
   * Check all alert rules
   */
  async checkRules(): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const now = Date.now();

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      // Check cooldown
      const lastAlert = this.lastAlertTime.get(rule.id) || 0;
      if (now - lastAlert < rule.cooldownMs) continue;

      try {
        const shouldAlert = await rule.condition();
        if (shouldAlert) {
          const message =
            typeof rule.message === "function" ? rule.message() : rule.message;

          const alert = await this.sendAlert({
            level: rule.level,
            title: rule.title,
            message,
            source: `rule:${rule.id}`,
          });

          this.lastAlertTime.set(rule.id, now);
          alerts.push(alert);
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error);
      }
    }

    return alerts;
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit = 50): Alert[] {
    return this.recentAlerts.slice(-limit).reverse();
  }

  /**
   * Get alerts by level
   */
  getAlertsByLevel(level: AlertLevel): Alert[] {
    return this.recentAlerts.filter((a) => a.level === level);
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string, acknowledgedBy?: string): boolean {
    const alert = this.recentAlerts.find((a) => a.id === alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;
    return true;
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.recentAlerts = [];
  }

  // Pre-configured alert methods

  /**
   * Alert for payment verification failure
   */
  async alertPaymentFailed(error: string, metadata?: Record<string, unknown>): Promise<Alert> {
    return this.sendAlert({
      level: "warning",
      title: "Payment Verification Failed",
      message: `Payment verification failed: ${error}`,
      source: "payment-verifier",
      metadata,
    });
  }

  /**
   * Alert for high error rate
   */
  async alertHighErrorRate(rate: number, threshold: number): Promise<Alert> {
    return this.sendAlert({
      level: "critical",
      title: "High Error Rate Detected",
      message: `Error rate is at ${rate.toFixed(1)}% (threshold: ${threshold}%)`,
      source: "metrics",
      metadata: { errorRate: rate, threshold },
    });
  }

  /**
   * Alert for low disk space
   */
  async alertLowDiskSpace(percent: number): Promise<Alert> {
    return this.sendAlert({
      level: percent > 90 ? "critical" : "warning",
      title: "Low Disk Space",
      message: `Disk usage at ${percent}%`,
      source: "health-check",
      metadata: { diskUsagePercent: percent },
    });
  }

  /**
   * Alert for low memory
   */
  async alertLowMemory(percent: number): Promise<Alert> {
    return this.sendAlert({
      level: percent > 90 ? "critical" : "warning",
      title: "Low Memory",
      message: `Memory usage at ${percent.toFixed(1)}%`,
      source: "health-check",
      metadata: { memoryUsagePercent: percent },
    });
  }

  /**
   * Alert for RPC connection failure
   */
  async alertRPCFailure(network: string, error: string): Promise<Alert> {
    return this.sendAlert({
      level: "critical",
      title: "RPC Connection Failed",
      message: `Failed to connect to ${network}: ${error}`,
      source: "multi-chain",
      metadata: { network },
    });
  }

  /**
   * Alert for successful deployment
   */
  async alertDeploymentSuccess(url: string, metadata?: Record<string, unknown>): Promise<Alert> {
    return this.sendAlert({
      level: "info",
      title: "Deployment Successful",
      message: `Successfully deployed to ${url}`,
      source: "deployer",
      metadata: { url, ...metadata },
    });
  }

  /**
   * Alert for failed deployment
   */
  async alertDeploymentFailed(error: string, metadata?: Record<string, unknown>): Promise<Alert> {
    return this.sendAlert({
      level: "critical",
      title: "Deployment Failed",
      message: `Deployment failed: ${error}`,
      source: "deployer",
      metadata,
    });
  }

  /**
   * Alert for subscription expiring soon
   */
  async alertSubscriptionExpiring(
    payer: string,
    daysRemaining: number
  ): Promise<Alert> {
    return this.sendAlert({
      level: "info",
      title: "Subscription Expiring Soon",
      message: `Subscription for ${payer.slice(0, 10)}... expires in ${daysRemaining} days`,
      source: "subscriptions",
      metadata: { payer, daysRemaining },
    });
  }

  /**
   * Alert for low credits
   */
  async alertLowCredits(payer: string, remaining: number): Promise<Alert> {
    return this.sendAlert({
      level: "info",
      title: "Low Credits Balance",
      message: `User ${payer.slice(0, 10)}... has only ${remaining} credits remaining`,
      source: "credits",
      metadata: { payer, remainingCredits: remaining },
    });
  }
}

/**
 * Create alert rules for common monitoring scenarios
 */
export function createCommonAlertRules(options: {
  getErrorRate: () => number;
  getMemoryUsage: () => number;
  getDiskUsage: () => Promise<number>;
}): AlertRule[] {
  return [
    {
      id: "high-error-rate",
      name: "High Error Rate",
      condition: () => options.getErrorRate() > 5,
      level: "critical",
      title: "High Error Rate",
      message: () => `Error rate is at ${options.getErrorRate().toFixed(1)}%`,
      cooldownMs: 5 * 60 * 1000, // 5 minutes
      enabled: true,
    },
    {
      id: "high-memory",
      name: "High Memory Usage",
      condition: () => options.getMemoryUsage() > 85,
      level: "warning",
      title: "High Memory Usage",
      message: () => `Memory usage is at ${options.getMemoryUsage().toFixed(1)}%`,
      cooldownMs: 15 * 60 * 1000, // 15 minutes
      enabled: true,
    },
    {
      id: "critical-memory",
      name: "Critical Memory Usage",
      condition: () => options.getMemoryUsage() > 95,
      level: "critical",
      title: "Critical Memory Usage",
      message: () => `Memory usage is critical at ${options.getMemoryUsage().toFixed(1)}%`,
      cooldownMs: 5 * 60 * 1000, // 5 minutes
      enabled: true,
    },
    {
      id: "low-disk",
      name: "Low Disk Space",
      condition: async () => (await options.getDiskUsage()) > 80,
      level: "warning",
      title: "Low Disk Space",
      message: "Disk usage is above 80%",
      cooldownMs: 60 * 60 * 1000, // 1 hour
      enabled: true,
    },
    {
      id: "critical-disk",
      name: "Critical Disk Space",
      condition: async () => (await options.getDiskUsage()) > 90,
      level: "critical",
      title: "Critical Disk Space",
      message: "Disk usage is above 90%",
      cooldownMs: 15 * 60 * 1000, // 15 minutes
      enabled: true,
    },
  ];
}
