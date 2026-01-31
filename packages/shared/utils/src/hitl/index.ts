/**
 * Human-in-the-Loop (HITL) System
 * 
 * Provides approval workflows for agent actions requiring human oversight.
 * 
 * @module hitl
 * @author nich <nich@nichxbt.com>
 */

import { Logger, createLogger } from '../logger/index.js';
import { AgentAction } from '../guardrails/index.js';

// ============================================================================
// Types
// ============================================================================

export interface HITLRequest {
  /** Unique request ID */
  id: string;
  /** Agent that initiated the request */
  agentId: string;
  /** Action requiring approval */
  action: AgentAction;
  /** Human-readable description */
  description: string;
  /** Risk assessment */
  risk: 'low' | 'medium' | 'high' | 'critical';
  /** Request timestamp */
  createdAt: Date;
  /** Expiry timestamp */
  expiresAt: Date;
  /** Status */
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  /** Reviewer who processed the request */
  reviewer?: string;
  /** Review timestamp */
  reviewedAt?: Date;
  /** Reviewer notes */
  notes?: string;
  /** Additional context for review */
  context?: Record<string, unknown>;
}

export interface HITLConfig {
  /** Default timeout for requests (ms) */
  defaultTimeout: number;
  /** Maximum pending requests per agent */
  maxPendingPerAgent: number;
  /** Notification channels */
  notificationChannels: NotificationChannel[];
  /** Auto-reject after timeout */
  autoRejectOnTimeout: boolean;
  /** Escalation rules */
  escalationRules: EscalationRule[];
}

export interface NotificationChannel {
  type: 'webhook' | 'email' | 'slack' | 'discord' | 'telegram' | 'console';
  config: Record<string, unknown>;
  enabled: boolean;
}

export interface EscalationRule {
  /** Rule name */
  name: string;
  /** Time after which to escalate (ms) */
  afterMs: number;
  /** Additional notifiers to alert */
  notifyChannels: string[];
  /** Escalation message */
  message: string;
}

export type HITLEventType = 
  | 'request:created'
  | 'request:approved'
  | 'request:rejected'
  | 'request:expired'
  | 'request:cancelled'
  | 'request:escalated';

export type HITLEventHandler = (event: HITLEventType, request: HITLRequest) => void | Promise<void>;

// ============================================================================
// Notification Adapters
// ============================================================================

interface NotificationAdapter {
  send(request: HITLRequest, message: string): Promise<void>;
}

class ConsoleNotificationAdapter implements NotificationAdapter {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({ name: 'hitl-console' });
  }

  async send(request: HITLRequest, message: string): Promise<void> {
    this.logger.warn('⚠️ HUMAN APPROVAL REQUIRED', {
      id: request.id,
      agent: request.agentId,
      action: request.action.type,
      risk: request.risk,
      message,
      expiresAt: request.expiresAt.toISOString(),
    });
  }
}

class WebhookNotificationAdapter implements NotificationAdapter {
  private url: string;
  private headers: Record<string, string>;

  constructor(config: { url: string; headers?: Record<string, string> }) {
    this.url = config.url;
    this.headers = config.headers ?? {};
  }

  async send(request: HITLRequest, message: string): Promise<void> {
    await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
      body: JSON.stringify({
        type: 'hitl_request',
        request: {
          id: request.id,
          agentId: request.agentId,
          action: request.action,
          description: request.description,
          risk: request.risk,
          expiresAt: request.expiresAt.toISOString(),
        },
        message,
      }),
    });
  }
}

class SlackNotificationAdapter implements NotificationAdapter {
  private webhookUrl: string;
  private channel?: string;

  constructor(config: { webhookUrl: string; channel?: string }) {
    this.webhookUrl = config.webhookUrl;
    this.channel = config.channel;
  }

  async send(request: HITLRequest, message: string): Promise<void> {
    const riskEmoji = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴',
    };

    const payload = {
      channel: this.channel,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${riskEmoji[request.risk]} Human Approval Required`,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Request ID:*\n${request.id}` },
            { type: 'mrkdwn', text: `*Agent:*\n${request.agentId}` },
            { type: 'mrkdwn', text: `*Action:*\n${request.action.type}` },
            { type: 'mrkdwn', text: `*Risk:*\n${request.risk}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Description:*\n${request.description}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Expires: ${request.expiresAt.toISOString()}`,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Approve' },
              style: 'primary',
              action_id: `approve_${request.id}`,
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Reject' },
              style: 'danger',
              action_id: `reject_${request.id}`,
            },
          ],
        },
      ],
    };

    await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
}

function createNotificationAdapter(channel: NotificationChannel): NotificationAdapter | null {
  switch (channel.type) {
    case 'console':
      return new ConsoleNotificationAdapter();
    case 'webhook':
      return new WebhookNotificationAdapter(channel.config as { url: string; headers?: Record<string, string> });
    case 'slack':
      return new SlackNotificationAdapter(channel.config as { webhookUrl: string; channel?: string });
    default:
      return null;
  }
}

// ============================================================================
// HITL Manager
// ============================================================================

/**
 * Human-in-the-Loop Manager
 * 
 * Manages approval workflows for agent actions requiring human oversight.
 * 
 * @example
 * ```typescript
 * const hitl = new HITLManager({
 *   defaultTimeout: 3600000, // 1 hour
 *   maxPendingPerAgent: 10,
 *   notificationChannels: [
 *     { type: 'console', config: {}, enabled: true },
 *     { type: 'slack', config: { webhookUrl: 'https://...' }, enabled: true },
 *   ],
 *   autoRejectOnTimeout: true,
 *   escalationRules: [],
 * });
 * 
 * // Request approval
 * const request = await hitl.requestApproval({
 *   agentId: 'trading-agent',
 *   action: { type: 'transfer', token: 'ETH', amount: BigInt('5000000000000000000') },
 *   description: 'Transfer 5 ETH to external wallet',
 *   risk: 'high',
 * });
 * 
 * // Wait for human decision
 * const approved = await hitl.waitForDecision(request.id, 60000);
 * if (approved) {
 *   // Proceed with action
 * }
 * ```
 */
export class HITLManager {
  private config: HITLConfig;
  private requests: Map<string, HITLRequest> = new Map();
  private adapters: NotificationAdapter[] = [];
  private eventHandlers: HITLEventHandler[] = [];
  private escalationTimers: Map<string, NodeJS.Timeout[]> = new Map();
  private logger: Logger;

  constructor(config: Partial<HITLConfig> = {}) {
    this.config = {
      defaultTimeout: config.defaultTimeout ?? 3600000, // 1 hour
      maxPendingPerAgent: config.maxPendingPerAgent ?? 10,
      notificationChannels: config.notificationChannels ?? [
        { type: 'console', config: {}, enabled: true },
      ],
      autoRejectOnTimeout: config.autoRejectOnTimeout ?? true,
      escalationRules: config.escalationRules ?? [],
    };

    this.logger = createLogger({ name: 'hitl-manager' });

    // Initialize notification adapters
    for (const channel of this.config.notificationChannels) {
      if (channel.enabled) {
        const adapter = createNotificationAdapter(channel);
        if (adapter) {
          this.adapters.push(adapter);
        }
      }
    }
  }

  /**
   * Request human approval for an action
   */
  async requestApproval(params: {
    agentId: string;
    action: AgentAction;
    description: string;
    risk: 'low' | 'medium' | 'high' | 'critical';
    timeout?: number;
    context?: Record<string, unknown>;
  }): Promise<HITLRequest> {
    // Check pending limit
    const pendingCount = this.getPendingForAgent(params.agentId).length;
    if (pendingCount >= this.config.maxPendingPerAgent) {
      throw new Error(`Agent ${params.agentId} has too many pending requests (${pendingCount})`);
    }

    const timeout = params.timeout ?? this.config.defaultTimeout;
    const request: HITLRequest = {
      id: crypto.randomUUID(),
      agentId: params.agentId,
      action: params.action,
      description: params.description,
      risk: params.risk,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + timeout),
      status: 'pending',
      context: params.context,
    };

    this.requests.set(request.id, request);

    // Send notifications
    await this.notify(request, `New approval request from ${params.agentId}`);

    // Setup escalation timers
    this.setupEscalation(request);

    // Setup expiry timer
    setTimeout(() => this.checkExpiry(request.id), timeout + 1000);

    // Emit event
    await this.emitEvent('request:created', request);

    this.logger.info('HITL request created', {
      id: request.id,
      agent: params.agentId,
      action: params.action.type,
      risk: params.risk,
    });

    return request;
  }

  /**
   * Approve a request
   */
  async approve(requestId: string, reviewer: string, notes?: string): Promise<boolean> {
    const request = this.requests.get(requestId);
    if (!request) {
      this.logger.warn('Request not found', { id: requestId });
      return false;
    }

    if (request.status !== 'pending') {
      this.logger.warn('Request not pending', { id: requestId, status: request.status });
      return false;
    }

    request.status = 'approved';
    request.reviewer = reviewer;
    request.reviewedAt = new Date();
    request.notes = notes;

    // Clear escalation timers
    this.clearEscalation(requestId);

    // Emit event
    await this.emitEvent('request:approved', request);

    this.logger.info('HITL request approved', {
      id: requestId,
      reviewer,
    });

    return true;
  }

  /**
   * Reject a request
   */
  async reject(requestId: string, reviewer: string, notes?: string): Promise<boolean> {
    const request = this.requests.get(requestId);
    if (!request) {
      this.logger.warn('Request not found', { id: requestId });
      return false;
    }

    if (request.status !== 'pending') {
      this.logger.warn('Request not pending', { id: requestId, status: request.status });
      return false;
    }

    request.status = 'rejected';
    request.reviewer = reviewer;
    request.reviewedAt = new Date();
    request.notes = notes;

    // Clear escalation timers
    this.clearEscalation(requestId);

    // Emit event
    await this.emitEvent('request:rejected', request);

    this.logger.info('HITL request rejected', {
      id: requestId,
      reviewer,
      notes,
    });

    return true;
  }

  /**
   * Cancel a request (by the agent)
   */
  async cancel(requestId: string): Promise<boolean> {
    const request = this.requests.get(requestId);
    if (!request) return false;
    if (request.status !== 'pending') return false;

    request.status = 'cancelled';

    // Clear escalation timers
    this.clearEscalation(requestId);

    // Emit event
    await this.emitEvent('request:cancelled', request);

    this.logger.info('HITL request cancelled', { id: requestId });

    return true;
  }

  /**
   * Wait for a decision on a request
   */
  async waitForDecision(requestId: string, pollInterval = 1000): Promise<boolean> {
    const request = this.requests.get(requestId);
    if (!request) return false;

    while (request.status === 'pending') {
      if (Date.now() > request.expiresAt.getTime()) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    return request.status === 'approved';
  }

  /**
   * Get request by ID
   */
  getRequest(requestId: string): HITLRequest | undefined {
    return this.requests.get(requestId);
  }

  /**
   * Get all pending requests
   */
  getPending(): HITLRequest[] {
    return Array.from(this.requests.values())
      .filter(r => r.status === 'pending' && r.expiresAt.getTime() > Date.now());
  }

  /**
   * Get pending requests for an agent
   */
  getPendingForAgent(agentId: string): HITLRequest[] {
    return this.getPending().filter(r => r.agentId === agentId);
  }

  /**
   * Get request history
   */
  getHistory(limit = 100): HITLRequest[] {
    return Array.from(this.requests.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Register event handler
   */
  onEvent(handler: HITLEventHandler): void {
    this.eventHandlers.push(handler);
  }

  /**
   * Send notification through all channels
   */
  private async notify(request: HITLRequest, message: string): Promise<void> {
    const results = await Promise.allSettled(
      this.adapters.map(adapter => adapter.send(request, message))
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        this.logger.error('Notification failed', { error: result.reason });
      }
    }
  }

  /**
   * Setup escalation timers
   */
  private setupEscalation(request: HITLRequest): void {
    const timers: NodeJS.Timeout[] = [];

    for (const rule of this.config.escalationRules) {
      const timer = setTimeout(async () => {
        const current = this.requests.get(request.id);
        if (current?.status === 'pending') {
          this.logger.warn('Escalating HITL request', {
            id: request.id,
            rule: rule.name,
          });
          await this.notify(current, `ESCALATION: ${rule.message}`);
          await this.emitEvent('request:escalated', current);
        }
      }, rule.afterMs);

      timers.push(timer);
    }

    this.escalationTimers.set(request.id, timers);
  }

  /**
   * Clear escalation timers
   */
  private clearEscalation(requestId: string): void {
    const timers = this.escalationTimers.get(requestId);
    if (timers) {
      for (const timer of timers) {
        clearTimeout(timer);
      }
      this.escalationTimers.delete(requestId);
    }
  }

  /**
   * Check and handle request expiry
   */
  private async checkExpiry(requestId: string): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) return;
    if (request.status !== 'pending') return;
    if (Date.now() < request.expiresAt.getTime()) return;

    request.status = 'expired';
    this.clearEscalation(requestId);

    await this.emitEvent('request:expired', request);

    this.logger.warn('HITL request expired', { id: requestId });
  }

  /**
   * Emit event to handlers
   */
  private async emitEvent(type: HITLEventType, request: HITLRequest): Promise<void> {
    const results = await Promise.allSettled(
      this.eventHandlers.map(handler => handler(type, request))
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        this.logger.error('Event handler failed', { type, error: result.reason });
      }
    }
  }

  /**
   * Clear all requests (for testing)
   */
  clear(): void {
    for (const [id] of this.escalationTimers) {
      this.clearEscalation(id);
    }
    this.requests.clear();
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create HITL manager with console notifications only
 */
export function createConsoleHITL(): HITLManager {
  return new HITLManager({
    defaultTimeout: 3600000,
    maxPendingPerAgent: 10,
    notificationChannels: [
      { type: 'console', config: {}, enabled: true },
    ],
    autoRejectOnTimeout: true,
    escalationRules: [],
  });
}

/**
 * Create HITL manager with webhook notifications
 */
export function createWebhookHITL(webhookUrl: string): HITLManager {
  return new HITLManager({
    defaultTimeout: 3600000,
    maxPendingPerAgent: 10,
    notificationChannels: [
      { type: 'console', config: {}, enabled: true },
      { type: 'webhook', config: { url: webhookUrl }, enabled: true },
    ],
    autoRejectOnTimeout: true,
    escalationRules: [
      {
        name: '15-minute',
        afterMs: 900000,
        notifyChannels: ['webhook'],
        message: 'Request pending for 15 minutes',
      },
      {
        name: '30-minute',
        afterMs: 1800000,
        notifyChannels: ['webhook'],
        message: 'URGENT: Request pending for 30 minutes',
      },
    ],
  });
}

/**
 * Create HITL manager with Slack notifications
 */
export function createSlackHITL(webhookUrl: string, channel?: string): HITLManager {
  return new HITLManager({
    defaultTimeout: 3600000,
    maxPendingPerAgent: 10,
    notificationChannels: [
      { type: 'console', config: {}, enabled: true },
      { type: 'slack', config: { webhookUrl, channel }, enabled: true },
    ],
    autoRejectOnTimeout: true,
    escalationRules: [
      {
        name: '15-minute',
        afterMs: 900000,
        notifyChannels: ['slack'],
        message: 'Request pending for 15 minutes',
      },
    ],
  });
}

// ============================================================================
// Decorator
// ============================================================================

/**
 * Decorator to require human approval for a method
 */
export function requireHumanApproval(
  hitl: HITLManager,
  options: {
    agentId: string;
    risk?: 'low' | 'medium' | 'high' | 'critical';
    timeout?: number;
  }
) {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(
    _target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const original = descriptor.value!;

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      const request = await hitl.requestApproval({
        agentId: options.agentId,
        action: { type: 'execute', function: propertyKey },
        description: `Execute ${propertyKey}`,
        risk: options.risk ?? 'medium',
        timeout: options.timeout,
        context: { args },
      });

      const approved = await hitl.waitForDecision(request.id);
      if (!approved) {
        throw new Error(`Human approval denied for ${propertyKey}`);
      }

      return original.apply(this, args);
    } as T;

    return descriptor;
  };
}
