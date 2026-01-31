/**
 * Feature Flags System
 * 
 * Simple but robust feature flags for controlling functionality.
 * Supports environment-based, config-based, and percentage rollouts.
 * 
 * @module feature-flags
 * @author nich <nich@nichxbt.com>
 */

// ============================================================================
// Types
// ============================================================================

export interface FeatureFlag {
  /** Unique identifier */
  name: string;
  /** Human-readable description */
  description?: string;
  /** Whether the flag is enabled by default */
  defaultValue: boolean;
  /** Override from environment variable */
  envVar?: string;
  /** Percentage rollout (0-100) */
  rolloutPercentage?: number;
  /** Specific user IDs that should have the flag enabled */
  allowedUsers?: string[];
  /** Specific user IDs that should have the flag disabled */
  blockedUsers?: string[];
  /** Tags for organization */
  tags?: string[];
  /** Expiration date (auto-disable after) */
  expiresAt?: Date;
}

export interface FeatureFlagConfig {
  flags: FeatureFlag[];
  /** Global kill switch - disables all flags */
  globalKillSwitch?: boolean;
  /** Override all flags (for testing) */
  overrideAll?: boolean;
}

export interface EvaluationContext {
  userId?: string;
  sessionId?: string;
  environment?: string;
  [key: string]: unknown;
}

// ============================================================================
// Feature Flag Manager
// ============================================================================

/**
 * Feature Flag Manager
 * 
 * @example
 * ```typescript
 * const flags = new FeatureFlagManager({
 *   flags: [
 *     { name: 'new-trading-ui', defaultValue: false, rolloutPercentage: 50 },
 *     { name: 'experimental-agent', defaultValue: false, envVar: 'ENABLE_EXPERIMENTAL_AGENT' }
 *   ]
 * });
 * 
 * if (flags.isEnabled('new-trading-ui', { userId: 'user123' })) {
 *   // Show new UI
 * }
 * ```
 */
export class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private globalKillSwitch: boolean;
  private overrideAll?: boolean;
  private overrides: Map<string, boolean> = new Map();

  constructor(config: FeatureFlagConfig) {
    this.globalKillSwitch = config.globalKillSwitch ?? false;
    this.overrideAll = config.overrideAll;

    for (const flag of config.flags) {
      this.flags.set(flag.name, flag);
    }
  }

  /**
   * Check if a feature flag is enabled
   */
  isEnabled(name: string, context?: EvaluationContext): boolean {
    // Global kill switch
    if (this.globalKillSwitch) {
      return false;
    }

    // Override all (for testing)
    if (this.overrideAll !== undefined) {
      return this.overrideAll;
    }

    // Check local override
    if (this.overrides.has(name)) {
      return this.overrides.get(name)!;
    }

    const flag = this.flags.get(name);
    if (!flag) {
      return false;
    }

    // Check expiration
    if (flag.expiresAt && new Date() > flag.expiresAt) {
      return false;
    }

    // Check environment variable override
    if (flag.envVar) {
      const envValue = process.env[flag.envVar];
      if (envValue !== undefined) {
        return envValue === 'true' || envValue === '1';
      }
    }

    // Check blocked users
    if (context?.userId && flag.blockedUsers?.includes(context.userId)) {
      return false;
    }

    // Check allowed users
    if (context?.userId && flag.allowedUsers?.includes(context.userId)) {
      return true;
    }

    // Percentage rollout
    if (flag.rolloutPercentage !== undefined) {
      const hash = this.hashForRollout(name, context?.userId ?? context?.sessionId ?? '');
      if (hash > flag.rolloutPercentage) {
        return false;
      }
    }

    return flag.defaultValue;
  }

  /**
   * Get a flag value with type coercion
   */
  getValue<T>(name: string, defaultValue: T, context?: EvaluationContext): T {
    const enabled = this.isEnabled(name, context);
    if (typeof defaultValue === 'boolean') {
      return enabled as T;
    }
    return enabled ? defaultValue : (undefined as T);
  }

  /**
   * Set a local override for a flag
   */
  setOverride(name: string, value: boolean): void {
    this.overrides.set(name, value);
  }

  /**
   * Clear a local override
   */
  clearOverride(name: string): void {
    this.overrides.delete(name);
  }

  /**
   * Clear all overrides
   */
  clearAllOverrides(): void {
    this.overrides.clear();
  }

  /**
   * Get all flags status
   */
  getAllFlags(context?: EvaluationContext): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const name of this.flags.keys()) {
      result[name] = this.isEnabled(name, context);
    }
    return result;
  }

  /**
   * Register a new flag
   */
  registerFlag(flag: FeatureFlag): void {
    this.flags.set(flag.name, flag);
  }

  /**
   * Get flag metadata
   */
  getFlag(name: string): FeatureFlag | undefined {
    return this.flags.get(name);
  }

  /**
   * Activate global kill switch
   */
  activateKillSwitch(): void {
    this.globalKillSwitch = true;
  }

  /**
   * Deactivate global kill switch
   */
  deactivateKillSwitch(): void {
    this.globalKillSwitch = false;
  }

  /**
   * Generate consistent hash for rollout (0-100)
   */
  private hashForRollout(flagName: string, identifier: string): number {
    const str = `${flagName}:${identifier}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 100;
  }
}

// ============================================================================
// Default Feature Flags
// ============================================================================

/**
 * Default feature flags for Universal Crypto MCP
 */
export const DEFAULT_FLAGS: FeatureFlag[] = [
  // Agent Features
  {
    name: 'agent-guardrails',
    description: 'Enable agent safety guardrails',
    defaultValue: true,
    tags: ['agents', 'safety'],
  },
  {
    name: 'agent-human-in-loop',
    description: 'Require human approval for large transactions',
    defaultValue: true,
    tags: ['agents', 'safety'],
  },
  {
    name: 'agent-autonomous-trading',
    description: 'Allow fully autonomous trading (requires guardrails)',
    defaultValue: false,
    envVar: 'ENABLE_AUTONOMOUS_TRADING',
    tags: ['agents', 'trading', 'experimental'],
  },

  // Novel Features
  {
    name: 'novel-intent-solver',
    description: 'Enable intent-based transaction solver',
    defaultValue: false,
    envVar: 'ENABLE_INTENT_SOLVER',
    tags: ['novel', 'experimental'],
  },
  {
    name: 'novel-privacy-pools',
    description: 'Enable privacy pool features',
    defaultValue: false,
    envVar: 'ENABLE_PRIVACY_POOLS',
    tags: ['novel', 'experimental', 'privacy'],
  },
  {
    name: 'novel-quantum-resistant',
    description: 'Enable quantum-resistant cryptography',
    defaultValue: false,
    envVar: 'ENABLE_QUANTUM_RESISTANT',
    tags: ['novel', 'experimental', 'security'],
  },
  {
    name: 'novel-reputation-graphs',
    description: 'Enable reputation graph features',
    defaultValue: false,
    envVar: 'ENABLE_REPUTATION_GRAPHS',
    tags: ['novel', 'experimental'],
  },

  // Trading Features
  {
    name: 'memecoin-trading',
    description: 'Enable memecoin trading bot',
    defaultValue: false,
    envVar: 'ENABLE_MEMECOIN_TRADING',
    tags: ['trading', 'experimental'],
  },
  {
    name: 'volume-generation',
    description: 'Enable volume generation tools',
    defaultValue: false,
    envVar: 'ENABLE_VOLUME_GENERATION',
    tags: ['trading', 'experimental'],
  },

  // Observability
  {
    name: 'detailed-logging',
    description: 'Enable detailed debug logging',
    defaultValue: false,
    envVar: 'ENABLE_DETAILED_LOGGING',
    tags: ['observability', 'debug'],
  },
  {
    name: 'metrics-collection',
    description: 'Enable Prometheus metrics collection',
    defaultValue: true,
    envVar: 'ENABLE_METRICS',
    tags: ['observability'],
  },

  // Integration Features
  {
    name: 'rate-limiting',
    description: 'Enable rate limiting for API calls',
    defaultValue: true,
    tags: ['infrastructure'],
  },
  {
    name: 'circuit-breaker',
    description: 'Enable circuit breaker for failing services',
    defaultValue: true,
    tags: ['infrastructure'],
  },
];

// ============================================================================
// Default Manager Instance
// ============================================================================

export const featureFlags = new FeatureFlagManager({
  flags: DEFAULT_FLAGS,
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a feature is enabled (convenience function)
 */
export function isFeatureEnabled(name: string, context?: EvaluationContext): boolean {
  return featureFlags.isEnabled(name, context);
}

/**
 * Decorator for enabling features on methods
 */
export function requireFeature(flagName: string, fallbackValue?: unknown) {
  return function <T extends (...args: unknown[]) => unknown>(
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!;

    descriptor.value = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
      if (!featureFlags.isEnabled(flagName)) {
        if (fallbackValue !== undefined) {
          return fallbackValue as ReturnType<T>;
        }
        throw new Error(`Feature '${flagName}' is not enabled`);
      }
      return originalMethod.apply(this, args) as ReturnType<T>;
    } as T;

    return descriptor;
  };
}

/**
 * Execute function only if feature is enabled
 */
export async function withFeature<T>(
  flagName: string,
  fn: () => Promise<T>,
  fallback?: T,
  context?: EvaluationContext
): Promise<T | undefined> {
  if (featureFlags.isEnabled(flagName, context)) {
    return fn();
  }
  return fallback;
}
