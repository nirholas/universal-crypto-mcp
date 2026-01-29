/**
 * Statistical Distribution Functions
 * Provides various probability distributions for natural-looking randomization
 */

/**
 * Generate a random number from a uniform distribution
 */
export function uniformRandom(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Generate a random integer from a uniform distribution
 */
export function uniformRandomInt(min: number, max: number): number {
  return Math.floor(uniformRandom(min, max + 1));
}

/**
 * Generate a random number from a Gaussian (normal) distribution
 * Uses the Box-Muller transform
 * @param mean - Mean of the distribution
 * @param stdDev - Standard deviation
 */
export function gaussianRandom(mean: number, stdDev: number): number {
  let u1 = Math.random();
  let u2 = Math.random();
  
  // Avoid log(0)
  while (u1 === 0) u1 = Math.random();
  
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/**
 * Generate a random number from a truncated Gaussian distribution
 * Ensures the result falls within [min, max]
 */
export function truncatedGaussian(mean: number, stdDev: number, min: number, max: number): number {
  let result: number;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    result = gaussianRandom(mean, stdDev);
    attempts++;
  } while ((result < min || result > max) && attempts < maxAttempts);
  
  // Fallback to clamping if we couldn't get a valid result
  if (result < min) return min;
  if (result > max) return max;
  return result;
}

/**
 * Generate a random number from a Poisson distribution
 * Uses the inverse transform method for small lambda,
 * and normal approximation for large lambda
 * @param lambda - Average rate (expected number of events)
 */
export function poissonRandom(lambda: number): number {
  if (lambda <= 0) return 0;
  
  // For large lambda, use normal approximation
  if (lambda > 30) {
    return Math.max(0, Math.round(gaussianRandom(lambda, Math.sqrt(lambda))));
  }
  
  // For small lambda, use inverse transform
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  
  return k - 1;
}

/**
 * Generate a random interval based on Poisson process
 * Returns time until next event given an average rate
 * @param averageRate - Average events per time unit
 */
export function poissonInterval(averageRate: number): number {
  if (averageRate <= 0) return Infinity;
  return -Math.log(1 - Math.random()) / averageRate;
}

/**
 * Generate a random number from an exponential distribution
 * Useful for inter-arrival times
 * @param rate - Rate parameter (lambda)
 */
export function exponentialRandom(rate: number): number {
  if (rate <= 0) return 0;
  return -Math.log(1 - Math.random()) / rate;
}

/**
 * Generate a random number from a log-normal distribution
 * Useful for modeling trade sizes (naturally skewed towards smaller values)
 * @param mu - Mean of the underlying normal distribution
 * @param sigma - Standard deviation of the underlying normal distribution
 */
export function logNormalRandom(mu: number, sigma: number): number {
  return Math.exp(gaussianRandom(mu, sigma));
}

/**
 * Generate a random number from a Pareto distribution
 * Heavy-tailed distribution, useful for modeling extreme events
 * @param scale - Minimum possible value (xm)
 * @param shape - Shape parameter (alpha)
 */
export function paretoRandom(scale: number, shape: number): number {
  const u = Math.random();
  return scale / Math.pow(1 - u, 1 / shape);
}

/**
 * Generate a random number from a beta distribution
 * Useful for probabilities and proportions
 * Uses the rejection method
 * @param alpha - Shape parameter alpha
 * @param beta - Shape parameter beta
 */
export function betaRandom(alpha: number, beta: number): number {
  // Use gamma distribution sampling
  const gammaA = gammaRandom(alpha, 1);
  const gammaB = gammaRandom(beta, 1);
  return gammaA / (gammaA + gammaB);
}

/**
 * Generate a random number from a gamma distribution
 * Uses Marsaglia and Tsang's method
 * @param shape - Shape parameter (k or alpha)
 * @param scale - Scale parameter (theta)
 */
export function gammaRandom(shape: number, scale: number): number {
  if (shape < 1) {
    // Use Ahrens-Dieter method for shape < 1
    return gammaRandom(1 + shape, scale) * Math.pow(Math.random(), 1 / shape);
  }
  
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  
  while (true) {
    let x: number;
    let v: number;
    
    do {
      x = gaussianRandom(0, 1);
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    const u = Math.random();
    
    if (u < 1 - 0.0331 * (x * x) * (x * x)) {
      return d * v * scale;
    }
    
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v * scale;
    }
  }
}

/**
 * Generate a skewed random value
 * Skews values towards lower or higher end of the range
 * @param min - Minimum value
 * @param max - Maximum value  
 * @param skew - Skew factor: < 1 skews low, > 1 skews high, 1 is uniform
 */
export function skewedRandom(min: number, max: number, skew: number): number {
  const u = Math.random();
  const skewed = Math.pow(u, skew);
  return min + skewed * (max - min);
}

/**
 * Generate a random number with power-law distribution
 * Useful for trade sizes where small trades are more common
 * @param min - Minimum value
 * @param max - Maximum value
 * @param exponent - Power law exponent (higher = more skewed to min)
 */
export function powerLawRandom(min: number, max: number, exponent: number): number {
  const u = Math.random();
  const minPow = Math.pow(min, exponent + 1);
  const maxPow = Math.pow(max, exponent + 1);
  return Math.pow((maxPow - minPow) * u + minPow, 1 / (exponent + 1));
}

/**
 * Fisher-Yates shuffle algorithm
 * Shuffles an array in-place
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

/**
 * Weighted random selection
 * @param items - Array of items to select from
 * @param weights - Corresponding weights for each item
 */
export function weightedRandom<T>(items: T[], weights: number[]): T {
  if (items.length !== weights.length || items.length === 0) {
    throw new Error('Items and weights must have same non-zero length');
  }
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i]!;
    if (random <= 0) {
      return items[i]!;
    }
  }
  
  return items[items.length - 1]!;
}

/**
 * Generate a random boolean with given probability
 * @param probability - Probability of returning true (0-1)
 */
export function randomBoolean(probability: number): boolean {
  return Math.random() < probability;
}

/**
 * Add jitter to a value
 * @param value - Base value
 * @param jitterPercent - Maximum percentage to vary (0-100)
 */
export function addJitter(value: number, jitterPercent: number): number {
  const jitterFraction = jitterPercent / 100;
  const jitterRange = value * jitterFraction;
  return value + (Math.random() * 2 - 1) * jitterRange;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Generate time-of-day weighted randomness
 * Higher activity during typical trading hours
 * @param hour - Hour of day (0-23)
 */
export function getTimeOfDayWeight(hour: number): number {
  // Peak activity: 9-11 AM and 2-4 PM (typical market hours)
  // Lower activity: night hours
  const weights: Record<number, number> = {
    0: 0.2, 1: 0.1, 2: 0.1, 3: 0.1, 4: 0.15, 5: 0.2,
    6: 0.3, 7: 0.5, 8: 0.7, 9: 1.0, 10: 1.0, 11: 0.9,
    12: 0.7, 13: 0.8, 14: 1.0, 15: 1.0, 16: 0.8, 17: 0.6,
    18: 0.5, 19: 0.4, 20: 0.35, 21: 0.3, 22: 0.25, 23: 0.2
  };
  return weights[hour] ?? 0.5;
}

/**
 * Generate day-of-week weighted randomness
 * @param dayOfWeek - Day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeekWeight(dayOfWeek: number): number {
  const weights: Record<number, number> = {
    0: 0.6,  // Sunday
    1: 1.0,  // Monday
    2: 1.0,  // Tuesday
    3: 1.0,  // Wednesday
    4: 1.0,  // Thursday
    5: 0.9,  // Friday
    6: 0.5   // Saturday
  };
  return weights[dayOfWeek] ?? 0.8;
}
