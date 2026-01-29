/**
 * Behavior Profiles
 * Pre-defined trading behavior patterns for bots
 */

import type { BehaviorProfile } from '../types.js';

/**
 * Default behavior profile - balanced trading
 */
export const DEFAULT_PROFILE: BehaviorProfile = {
  name: 'default',
  description: 'Balanced trading with moderate activity',
  timingDistribution: 'poisson',
  sizeDistribution: 'uniform',
  activeHours: { start: 6, end: 23 },
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  burstProbability: 0.1,
  burstTradeRange: { min: 3, max: 8 },
  burstCooldown: 60000, // 1 minute
  varianceFactor: 1.0,
};

/**
 * Aggressive trader - high frequency, variable sizes
 */
export const AGGRESSIVE_PROFILE: BehaviorProfile = {
  name: 'aggressive',
  description: 'High frequency trading with aggressive patterns',
  timingDistribution: 'poisson',
  sizeDistribution: 'skewed-high',
  activeHours: { start: 0, end: 24 }, // 24/7
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  burstProbability: 0.25,
  burstTradeRange: { min: 5, max: 15 },
  burstCooldown: 30000, // 30 seconds
  varianceFactor: 1.5,
};

/**
 * Conservative trader - low frequency, steady sizes
 */
export const CONSERVATIVE_PROFILE: BehaviorProfile = {
  name: 'conservative',
  description: 'Low frequency trading with steady patterns',
  timingDistribution: 'gaussian',
  sizeDistribution: 'uniform',
  activeHours: { start: 9, end: 17 },
  activeDays: [1, 2, 3, 4, 5], // Weekdays only
  burstProbability: 0.02,
  burstTradeRange: { min: 2, max: 4 },
  burstCooldown: 300000, // 5 minutes
  varianceFactor: 0.5,
};

/**
 * Whale profile - large but infrequent trades
 */
export const WHALE_PROFILE: BehaviorProfile = {
  name: 'whale',
  description: 'Large trades with long intervals',
  timingDistribution: 'poisson',
  sizeDistribution: 'skewed-high',
  activeHours: { start: 8, end: 22 },
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  burstProbability: 0.05,
  burstTradeRange: { min: 2, max: 3 },
  burstCooldown: 600000, // 10 minutes
  varianceFactor: 2.0,
};

/**
 * Retail profile - small frequent trades like a typical retail user
 */
export const RETAIL_PROFILE: BehaviorProfile = {
  name: 'retail',
  description: 'Small frequent trades mimicking retail behavior',
  timingDistribution: 'poisson',
  sizeDistribution: 'skewed-low',
  activeHours: { start: 7, end: 23 },
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  burstProbability: 0.15,
  burstTradeRange: { min: 2, max: 5 },
  burstCooldown: 45000, // 45 seconds
  varianceFactor: 0.8,
};

/**
 * Stealth profile - designed to minimize detection
 */
export const STEALTH_PROFILE: BehaviorProfile = {
  name: 'stealth',
  description: 'Low visibility trading with high variance',
  timingDistribution: 'gaussian',
  sizeDistribution: 'uniform',
  activeHours: { start: 6, end: 22 },
  activeDays: [1, 2, 3, 4, 5, 6], // Skip Sundays
  burstProbability: 0.03,
  burstTradeRange: { min: 2, max: 3 },
  burstCooldown: 180000, // 3 minutes
  varianceFactor: 2.5,
};

/**
 * Market maker profile - balanced buy/sell with tight spread
 */
export const MARKET_MAKER_PROFILE: BehaviorProfile = {
  name: 'market-maker',
  description: 'Market making with balanced buy/sell activity',
  timingDistribution: 'poisson',
  sizeDistribution: 'uniform',
  activeHours: { start: 0, end: 24 },
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  burstProbability: 0.2,
  burstTradeRange: { min: 4, max: 10 },
  burstCooldown: 20000, // 20 seconds
  varianceFactor: 1.2,
};

/**
 * Accumulator profile - focused on buying
 */
export const ACCUMULATOR_PROFILE: BehaviorProfile = {
  name: 'accumulator',
  description: 'Gradual accumulation with buying bias',
  timingDistribution: 'gaussian',
  sizeDistribution: 'skewed-low',
  activeHours: { start: 4, end: 20 },
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  burstProbability: 0.08,
  burstTradeRange: { min: 3, max: 6 },
  burstCooldown: 120000, // 2 minutes
  varianceFactor: 1.0,
};

/**
 * Distributor profile - focused on selling
 */
export const DISTRIBUTOR_PROFILE: BehaviorProfile = {
  name: 'distributor',
  description: 'Gradual distribution with selling bias',
  timingDistribution: 'gaussian',
  sizeDistribution: 'skewed-low',
  activeHours: { start: 8, end: 22 },
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  burstProbability: 0.08,
  burstTradeRange: { min: 3, max: 6 },
  burstCooldown: 120000, // 2 minutes
  varianceFactor: 1.0,
};

/**
 * Night owl profile - active during off-hours
 */
export const NIGHT_OWL_PROFILE: BehaviorProfile = {
  name: 'night-owl',
  description: 'Active during late night and early morning',
  timingDistribution: 'poisson',
  sizeDistribution: 'uniform',
  activeHours: { start: 22, end: 6 }, // Night hours (wraps around)
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  burstProbability: 0.12,
  burstTradeRange: { min: 3, max: 7 },
  burstCooldown: 90000, // 90 seconds
  varianceFactor: 1.3,
};

/**
 * All available profiles
 */
export const BEHAVIOR_PROFILES: Record<string, BehaviorProfile> = {
  default: DEFAULT_PROFILE,
  aggressive: AGGRESSIVE_PROFILE,
  conservative: CONSERVATIVE_PROFILE,
  whale: WHALE_PROFILE,
  retail: RETAIL_PROFILE,
  stealth: STEALTH_PROFILE,
  'market-maker': MARKET_MAKER_PROFILE,
  accumulator: ACCUMULATOR_PROFILE,
  distributor: DISTRIBUTOR_PROFILE,
  'night-owl': NIGHT_OWL_PROFILE,
};

/**
 * Get a behavior profile by name
 */
export function getProfile(name: string): BehaviorProfile {
  return BEHAVIOR_PROFILES[name] ?? DEFAULT_PROFILE;
}

/**
 * Create a custom profile by merging with base
 */
export function createCustomProfile(
  base: string | BehaviorProfile,
  overrides: Partial<BehaviorProfile>
): BehaviorProfile {
  const baseProfile = typeof base === 'string' ? getProfile(base) : base;
  return {
    ...baseProfile,
    ...overrides,
    name: overrides.name ?? `custom-${Date.now()}`,
  };
}

/**
 * Get profile suited for campaign mode
 */
export function getProfileForMode(mode: 'aggressive' | 'moderate' | 'stealth'): BehaviorProfile {
  switch (mode) {
    case 'aggressive':
      return AGGRESSIVE_PROFILE;
    case 'stealth':
      return STEALTH_PROFILE;
    case 'moderate':
    default:
      return DEFAULT_PROFILE;
  }
}

/**
 * Check if current time is within profile's active hours
 */
export function isWithinActiveHours(profile: BehaviorProfile, date: Date = new Date()): boolean {
  const hour = date.getHours();
  const day = date.getDay();

  // Check if day is active
  if (!profile.activeDays.includes(day)) {
    return false;
  }

  // Handle wraparound hours (e.g., 22-6)
  if (profile.activeHours.start <= profile.activeHours.end) {
    return hour >= profile.activeHours.start && hour < profile.activeHours.end;
  } else {
    return hour >= profile.activeHours.start || hour < profile.activeHours.end;
  }
}

/**
 * Get activity multiplier based on profile and current time
 */
export function getActivityMultiplier(profile: BehaviorProfile, date: Date = new Date()): number {
  if (!isWithinActiveHours(profile, date)) {
    return 0.1; // 10% activity outside active hours
  }

  const hour = date.getHours();
  
  // Peak hours get higher multiplier
  const peakHours = [10, 11, 14, 15, 16]; // Common peak trading hours
  if (peakHours.includes(hour)) {
    return 1.2;
  }

  return 1.0;
}

/**
 * Select random profiles for a swarm of bots
 * Ensures diversity in behavior
 */
export function selectProfilesForSwarm(
  count: number,
  mode: 'aggressive' | 'moderate' | 'stealth'
): BehaviorProfile[] {
  const profiles: BehaviorProfile[] = [];
  
  // Define profile distribution based on mode
  let distributions: Record<string, number>;
  switch (mode) {
    case 'aggressive':
      distributions = {
        aggressive: 0.3,
        'market-maker': 0.25,
        retail: 0.2,
        default: 0.15,
        whale: 0.1,
      };
      break;
    case 'stealth':
      distributions = {
        stealth: 0.35,
        conservative: 0.25,
        retail: 0.2,
        default: 0.15,
        'night-owl': 0.05,
      };
      break;
    case 'moderate':
    default:
      distributions = {
        default: 0.25,
        retail: 0.25,
        'market-maker': 0.2,
        conservative: 0.15,
        aggressive: 0.1,
        stealth: 0.05,
      };
      break;
  }

  // Generate profiles based on distribution
  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let cumulative = 0;
    let selectedProfile = DEFAULT_PROFILE;

    for (const [profileName, probability] of Object.entries(distributions)) {
      cumulative += probability;
      if (rand <= cumulative) {
        selectedProfile = getProfile(profileName);
        break;
      }
    }

    // Add slight variations to each profile
    profiles.push(createCustomProfile(selectedProfile, {
      varianceFactor: selectedProfile.varianceFactor * (0.9 + Math.random() * 0.2),
      burstProbability: selectedProfile.burstProbability * (0.8 + Math.random() * 0.4),
    }));
  }

  return profiles;
}
